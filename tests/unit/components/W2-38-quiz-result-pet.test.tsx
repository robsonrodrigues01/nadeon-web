// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { QuizResultPet } from "@/components/commerce/quiz/quiz-result-pet";
import { MarketProvider } from "@/lib/market/context";
import { getMarket, SUPPORTED_MARKETS } from "@/lib/market";
import { getQuiz, type QuizRecommendationResult } from "@/lib/quiz";
import { getAllProducts, getAllKits } from "@/data/products";

// Mock newsletter server action
const subscribeNewsletterMock = vi
  .fn()
  .mockResolvedValue({ success: true, message: "ok" });
vi.mock("@/components/brand/newsletter/actions", () => ({
  subscribeNewsletter: (...args: unknown[]) => subscribeNewsletterMock(...args),
  subscribe: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock client cart provider
const addLinesMock = vi.fn().mockResolvedValue({});
vi.mock("@/lib/providers/client", () => ({
  cartProvider: {
    addLines: (...args: unknown[]) => addLinesMock(...args),
  },
}));

const dogQuiz = getQuiz("dog")!;
const horseQuiz = getQuiz("horse")!;

const allProducts = getAllProducts();
const allKits = getAllKits();

const mockPrimaryProduct = allProducts.find(
  (p) => p.slug === "more-good-years"
)!;
const mockSecondaryProduct = allProducts.find(
  (p) => p.slug === "golden-years-oil"
)!;
const mockKit = allKits.find((k) => k.slug === "chew-oil")!;

const mockRecommendation: QuizRecommendationResult = {
  recommendedKitSlug: "chew-oil",
  recommendedProductSlug: "more-good-years",
  secondaryProductSlug: "golden-years-oil",
  headline:
    "A daily senior chew plus a joint oil on food, dosed specifically by weight.*",
  reasons: [
    "Formulated for senior dogs 7+: 75 mg NMN per chew supports cellular NAD+ levels.*",
  ],
  dosing: {
    species: "dog",
    weightLbs: 35,
    weightKg: 16,
    dose: "2 chews",
    servingDescription: "1 at breakfast, 1 at dinner",
    dailySchedule: {
      morning: "1 chew + 0.9 mL oil on food",
      evening: "1 chew, with or after the meal",
    },
  },
};

describe("QuizResultPet Component (W2-38)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Prices and Markets (Rule 14 & Catalogo)", () => {
    it("formats kit and product prices using useMarket() and formatMoneyWithMarket in default US market", () => {
      render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{
            petName: "Max",
            weightLbs: 35,
            ageGroup: "senior",
            concern: "joints-mobility",
            "picky-eater": "no",
          }}
          recommendation={mockRecommendation}
          productsMap={{
            "more-good-years": mockPrimaryProduct,
            "golden-years-oil": mockSecondaryProduct,
          }}
          kitsMap={{
            "chew-oil": mockKit,
          }}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      // One-time price ($75.00)
      expect(screen.getByText("$75.00")).toBeDefined();

      // Card prices ($44.00 each)
      const prices44 = screen.getAllByText("$44.00");
      expect(prices44.length).toBeGreaterThanOrEqual(2);

      // Subscription price with 15% discount: 75 - 11.25 = 63.75
      expect(screen.getByText("$63.75")).toBeDefined();
    });

    it("converts and formats prices according to non-US market via MarketProvider (e.g. UK market GBP)", () => {
      const gbMarket =
        getMarket("GB") ||
        SUPPORTED_MARKETS.find((m) => m.countryCode === "GB")!;

      render(
        <MarketProvider initialMarket={gbMarket}>
          <QuizResultPet
            quiz={dogQuiz}
            answers={{
              petName: "Max",
              weightLbs: 35,
              ageGroup: "senior",
              concern: "joints-mobility",
              "picky-eater": "no",
            }}
            recommendation={mockRecommendation}
            productsMap={{
              "more-good-years": mockPrimaryProduct,
              "golden-years-oil": mockSecondaryProduct,
            }}
            kitsMap={{
              "chew-oil": mockKit,
            }}
            onRetake={vi.fn()}
            onEditAnswers={vi.fn()}
          />
        </MarketProvider>
      );

      // Must format with GBP (£) symbol, no raw hardcoded $
      expect(screen.getAllByText(/£/).length).toBeGreaterThan(0);
    });

    it("displays 'To be confirmed' when recommended products/kits are missing from catalog", () => {
      render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{
            petName: "Max",
            weightLbs: 35,
          }}
          recommendation={{
            headline: "Plan under calculation.*",
            reasons: [],
          }}
          productsMap={{}}
          kitsMap={{}}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
    });
  });

  describe("Subscription Discount from product.sellingPlans", () => {
    it("derives discount percentage and order savings from sellingPlans", () => {
      render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{
            petName: "Max",
            weightLbs: 35,
            ageGroup: "senior",
          }}
          recommendation={mockRecommendation}
          productsMap={{
            "more-good-years": mockPrimaryProduct,
            "golden-years-oil": mockSecondaryProduct,
          }}
          kitsMap={{
            "chew-oil": mockKit,
          }}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      // Save 15% badge in subscription option
      expect(screen.getByText("Save 15%")).toBeDefined();

      // Yearly savings: 11.25 * 12 = 135.00
      expect(screen.getByText("$135.00")).toBeDefined();
      expect(screen.getByText("saved per year")).toBeDefined();
    });

    it("switches active price in Add plan to cart button when toggling between subscription and one-time", () => {
      render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{
            petName: "Max",
            weightLbs: 35,
          }}
          recommendation={mockRecommendation}
          productsMap={{
            "more-good-years": mockPrimaryProduct,
          }}
          kitsMap={{
            "chew-oil": mockKit,
          }}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      // Starts as subscription ($63.75)
      const addBtn = screen.getByRole("button", { name: /Add plan to cart/i });
      expect(addBtn.textContent).toContain("$63.75");

      // Switch to One-time
      const oneTimeBtn = screen.getByRole("button", { name: /One-time/i });
      fireEvent.click(oneTimeBtn);
      expect(addBtn.textContent).toContain("$75.00");

      // Switch back to subscription
      const subBtn = screen.getByRole("button", {
        name: /Subscribe every 30 days/i,
      });
      fireEvent.click(subBtn);
      expect(addBtn.textContent).toContain("$63.75");
    });
  });

  describe("Claims with Asterisks (<Claim> Component)", () => {
    it("wraps headline and bullet points with asterisks in <Claim>", () => {
      const { container } = render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{
            petName: "Max",
            weightLbs: 35,
            concern: "joints-mobility",
          }}
          recommendation={mockRecommendation}
          productsMap={{
            "more-good-years": mockPrimaryProduct,
            "golden-years-oil": mockSecondaryProduct,
          }}
          kitsMap={{
            "chew-oil": mockKit,
          }}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      // Headline has claim
      expect(
        screen.getByText(/A daily senior chew plus a joint oil on food/)
      ).toBeDefined();

      // Bullets with * are rendered
      expect(screen.getByText(/Formulated for senior dogs 7\+/)).toBeDefined();

      // Every text with asterisk should have an ancestor span from Claim
      const claimTexts = container.querySelectorAll("span.inline");
      expect(claimTexts.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Board Copy and Content Alignment", () => {
    it("matches the exact text from design board QuizPet_Result", () => {
      render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{
            petName: "Max",
            weightLbs: 35,
            ageGroup: "senior",
            concern: "joints-mobility",
            "picky-eater": "no",
          }}
          recommendation={mockRecommendation}
          productsMap={{
            "more-good-years": mockPrimaryProduct,
            "golden-years-oil": mockSecondaryProduct,
          }}
          kitsMap={{
            "chew-oil": mockKit,
          }}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      // Section titles
      expect(screen.getByText("RECOMMENDED FOR MAX")).toBeDefined();
      expect(screen.getByText("MAX'S DAILY DOSE")).toBeDefined();
      expect(screen.getByText("What a day looks like")).toBeDefined();
      expect(screen.getByText("SUBSCRIBE & SAVE")).toBeDefined();
      expect(screen.getByText("Never run out")).toBeDefined();

      // Missing board or catalog details remain unconfirmed.
      expect(screen.getByText("MORNING · Breakfast")).toBeDefined();
      expect(screen.getByText("EVENING · Dinner")).toBeDefined();

      // Commercial footnote is unconfirmed pending approval.
      expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);

      // Email section
      expect(screen.getByText("Send Max's plan to my inbox")).toBeDefined();
      expect(
        screen.getByText(
          /Dose chart, reminders and 10% off your first single-formula order/
        )
      ).toBeDefined();
    });

    it("renders equine warning only when species is horse", () => {
      const { rerender } = render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{ petName: "Buddy", weightLbs: 40 }}
          recommendation={mockRecommendation}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      expect(screen.getByText("For animal use only")).toBeDefined();
      expect(
        screen.queryByText(/Equine products: not for horses intended for food/)
      ).toBeNull();

      rerender(
        <QuizResultPet
          quiz={horseQuiz}
          answers={{ petName: "Thunder", weightLbs: 1100 }}
          recommendation={mockRecommendation}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      expect(
        screen.getByText("Equine products: not for horses intended for food.")
      ).toBeDefined();
    });
  });

  describe("Cart and Newsletter Interactions", () => {
    it("does not invent a selling plan or allow subscription when catalog has none", async () => {
      const productWithoutPlans = { ...mockPrimaryProduct, sellingPlans: [] };
      render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{ petName: "Max", weightLbs: 35 }}
          recommendation={mockRecommendation}
          productsMap={{
            "more-good-years": productWithoutPlans,
            "golden-years-oil": mockSecondaryProduct,
          }}
          kitsMap={{ "chew-oil": mockKit }}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      expect(
        screen.queryByRole("button", { name: /Subscribe every 30 days/i })
      ).toBeNull();
      expect(
        screen.getByTestId("subscription-plan-unconfirmed").textContent
      ).toContain("To be confirmed");
      fireEvent.click(
        screen.getByRole("button", { name: /Add plan to cart/i })
      );
      await waitFor(() => expect(addLinesMock).toHaveBeenCalledTimes(1));
      expect(
        addLinesMock.mock.calls[0][0].every(
          (line: { sellingPlanId?: string | null }) => !line.sellingPlanId
        )
      ).toBe(true);
    });

    it("adds kit lines to cart provider with sellingPlanId when in subscription mode", async () => {
      render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{ petName: "Max", weightLbs: 35 }}
          recommendation={mockRecommendation}
          productsMap={{
            "more-good-years": mockPrimaryProduct,
            "golden-years-oil": mockSecondaryProduct,
          }}
          kitsMap={{
            "chew-oil": mockKit,
          }}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      const addBtn = screen.getByRole("button", { name: /Add plan to cart/i });
      fireEvent.click(addBtn);

      await waitFor(() => expect(addLinesMock).toHaveBeenCalledTimes(1));
      const calls = addLinesMock.mock.calls[0][0];
      expect(calls).toHaveLength(2);
      expect(calls[0].sellingPlanId).toBe("plan_more_good_years_30d");
    });

    it("submits email newsletter with species-specific channel", async () => {
      render(
        <QuizResultPet
          quiz={dogQuiz}
          answers={{ petName: "Max", weightLbs: 35 }}
          recommendation={mockRecommendation}
          onRetake={vi.fn()}
          onEditAnswers={vi.fn()}
        />
      );

      const input = screen.getByLabelText("Email address");
      fireEvent.change(input, { target: { value: "max.owner@example.com" } });

      const emailBtn = screen.getByRole("button", { name: "Email my plan" });
      fireEvent.click(emailBtn);

      await waitFor(() =>
        expect(subscribeNewsletterMock).toHaveBeenCalledTimes(1)
      );
      expect(subscribeNewsletterMock).toHaveBeenCalledWith(
        "dog-quiz-plan",
        "max.owner@example.com",
        true
      );
    });
  });
});
