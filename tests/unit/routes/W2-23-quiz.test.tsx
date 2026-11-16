// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import HumanQuizPage, { metadata } from "@/app/(human)/human/quiz/page";
import { HumanQuizClient } from "@/app/(human)/human/quiz/_components/human-quiz-client";
import { QuizHeader } from "@/app/(human)/human/quiz/_components/quiz-header";
import { QuizFooter } from "@/app/(human)/human/quiz/_components/quiz-footer";
import { QuizAnalyzing, QuizResultHuman } from "@/components/commerce/quiz";
import { getQuiz, evaluateQuizRecommendation } from "@/lib/quiz";
import { catalogProvider } from "@/lib/providers";
import { QuizWizard } from "@/components/commerce/quiz/quiz-wizard";

// Mock next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  notFound: vi.fn(),
}));

// Mock newsletter action
vi.mock("@/components/brand/newsletter/actions", () => ({
  subscribeNewsletter: vi.fn().mockResolvedValue({ success: true }),
  subscribe: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock client cart provider
vi.mock("@/lib/providers/client", () => ({
  cartProvider: {
    addLines: vi.fn().mockResolvedValue({}),
  },
}));

describe("Route /human/quiz Suite (W2-23)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Metadata & SEO", () => {
    it("defines valid page metadata with title, description, and canonical", () => {
      expect(metadata).toBeDefined();
      expect(metadata.title).toBe("Human NAD+ Routine Quiz | Nadeon Labs");
      expect(metadata.description).toContain("personalized");
      expect(metadata.alternates?.canonical).toContain("/human/quiz");
    });
  });

  describe("Quiz Header & Footer Components", () => {
    it("renders semantic header with navigation link, brand, status, and exit link", () => {
      render(<QuizHeader statusText="Takes about 1 minute · 10% off" />);

      // Banner role
      const header = screen.getByRole("banner");
      expect(header).toBeDefined();

      // Home link with label
      const homeLink = screen.getByRole("link", { name: /nadeon human home/i });
      expect(homeLink).toBeDefined();
      expect(homeLink.getAttribute("href")).toBe("/human");

      // Line pill
      expect(screen.getByText("HUMAN")).toBeDefined();

      // Status text
      expect(screen.getByText(/takes about 1 minute/i)).toBeDefined();

      // Exit link
      const exitLink = screen.getByRole("link", { name: /exit quiz/i });
      expect(exitLink).toBeDefined();
      expect(exitLink.getAttribute("href")).toBe("/human");
    });

    it("renders semantic footer with FDA claim disclaimer, legal links, and advisory", () => {
      render(<QuizFooter />);

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeDefined();

      // FDA disclaimer statement
      expect(
        screen.getByText(
          /these statements have not been evaluated by the food and drug administration/i
        )
      ).toBeDefined();

      // Legal links
      const privacyLink = screen.getByRole("link", { name: /privacy/i });
      const termsLink = screen.getByRole("link", { name: /terms/i });
      expect(privacyLink.getAttribute("href")).toBe("/legal/privacy");
      expect(termsLink.getAttribute("href")).toBe("/legal/terms");

      // General advice note
      expect(
        screen.getByText(
          /quiz suggestions are general and are not medical advice/i
        )
      ).toBeDefined();
    });
  });

  describe("Quiz Flow Elements (Catalog Section 5.6)", () => {
    it("completes all five Human questions and shows the result after analysis", async () => {
      const humanQuiz = getQuiz("human");
      render(<QuizWizard initialQuiz={humanQuiz!} />);

      fireEvent.click(screen.getByRole("button", { name: /start the quiz/i }));
      for (const answer of [
        "35 to 44",
        "Daily energy",
        "Most days",
        "Capsules",
        "No, I am new to NMN",
      ]) {
        fireEvent.click(
          await screen.findByRole("button", { name: new RegExp(`^${answer}`) })
        );
        fireEvent.click(
          screen.getByRole("button", { name: /continue to next step/i })
        );
      }

      expect(await screen.findByTestId("quiz-analyzing")).toBeTruthy();
      expect(
        await screen.findByTestId("quiz-result-human", {}, { timeout: 5000 })
      ).toBeTruthy();
    });

    it("Start Screen: renders semantic Start button, time and question count without placeholders", () => {
      const humanQuiz = getQuiz("human");
      expect(humanQuiz).toBeDefined();

      render(<HumanQuizClient quiz={humanQuiz!} />);

      // Start button
      const startButton = screen.getByRole("button", {
        name: /start the quiz/i,
      });
      expect(startButton).toBeDefined();
      expect(startButton.tagName).toBe("BUTTON");

      // Dynamic time & questions
      expect(
        screen.getAllByText(/takes about 1 minute/i).length
      ).toBeGreaterThan(0);
      expect(screen.getByText(/5 questions/i)).toBeDefined();

      // Ensure no raw [X] placeholders are displayed
      expect(screen.queryByText(/\[x\]/i)).toBeNull();
    });

    it("Question Screen: renders option cards, progressbar, and navigation buttons", async () => {
      const humanQuiz = getQuiz("human");
      render(<HumanQuizClient quiz={humanQuiz!} />);

      // Start quiz
      const startButton = screen.getByRole("button", {
        name: /start the quiz/i,
      });
      fireEvent.click(startButton);

      // Progress bar
      const progressbar = await screen.findByRole("progressbar");
      expect(progressbar).toBeDefined();

      // Step indicators
      expect(await screen.findByText(/step 1 of 5/i)).toBeDefined();

      // Navigation buttons: Back (Previous question) and Continue (Continue to next step)
      const backButton = screen.getByRole("button", {
        name: /previous question/i,
      });
      const continueButton = screen.getByRole("button", {
        name: /continue to next step/i,
      });
      expect(backButton).toBeDefined();
      expect(continueButton).toBeDefined();

      // Pick an option card for step 1 (age-range)
      const optionCard = await screen.findByText("35 to 44");
      expect(optionCard).toBeDefined();
      fireEvent.click(optionCard);

      // Click Continue to step 2
      fireEvent.click(continueButton);
      expect(await screen.findByText(/step 2 of 5/i)).toBeDefined();
    });

    it("Analyzing Screen: renders analysis steps with Done and In progress indicators", () => {
      const humanQuiz = getQuiz("human");
      render(
        <QuizAnalyzing
          quiz={humanQuiz!}
          answers={{
            "age-range": "35-to-44",
            goal: "daily-energy",
            "afternoon-slump": "sometimes",
            format: "capsules",
            "takes-nmn": "no",
          }}
          onComplete={vi.fn()}
        />
      );

      // Screen indicates analyzing state
      expect(screen.getByText(/analyzing your answers/i)).toBeDefined();
      expect(screen.getByText(/almost there/i)).toBeDefined();

      // Analyzing steps badges
      expect(screen.getByText("Done")).toBeDefined();
      expect(screen.getByText("In progress")).toBeDefined();
    });

    it("Result Screen: renders answers summary, Add routine to cart, alternatives, Retake the quiz, and email form", async () => {
      const humanQuiz = getQuiz("human");
      const [products, kits] = await Promise.all([
        catalogProvider.getProducts({ line: "human" }),
        catalogProvider.getKits("human"),
      ]);

      const productsMap = Object.fromEntries(products.map((p) => [p.slug, p]));
      const kitsMap = Object.fromEntries(kits.map((k) => [k.slug, k]));

      const answers = {
        "age-range": "35-to-44",
        goal: "daily-energy",
        "afternoon-slump": "most-days",
        format: "capsules",
        "takes-nmn": "no",
      };

      const recommendation = await evaluateQuizRecommendation(
        humanQuiz!,
        answers
      );

      const onRetake = vi.fn();
      const onEditAnswers = vi.fn();

      render(
        <QuizResultHuman
          quiz={humanQuiz!}
          answers={answers}
          recommendation={recommendation}
          productsMap={productsMap}
          kitsMap={kitsMap}
          onRetake={onRetake}
          onEditAnswers={onEditAnswers}
        />
      );

      // Headline and routine section
      expect(
        screen.getByRole("heading", { level: 1, name: /your routine/i })
      ).toBeDefined();

      // Answers Summary
      expect(screen.getByText("Your answers")).toBeDefined();
      expect(screen.getByText("35 to 44")).toBeDefined();

      // Add to cart button
      const addToCartBtn = screen.getByRole("button", {
        name: /add routine to cart/i,
      });
      expect(addToCartBtn).toBeDefined();

      // Retake quiz button
      const retakeBtn = screen.getByRole("button", {
        name: /retake the quiz/i,
      });
      expect(retakeBtn).toBeDefined();
      fireEvent.click(retakeBtn);
      expect(onRetake).toHaveBeenCalledTimes(1);

      // Alternatives buttons (e.g. Choose Full Charge / Just BioHack)
      if (
        recommendation.alternatives &&
        recommendation.alternatives.length > 0
      ) {
        for (const alt of recommendation.alternatives) {
          const altBtn = screen.getByRole("button", { name: alt.title });
          expect(altBtn).toBeDefined();
        }
      }

      // Email input field and submit button
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toBeDefined();
      expect(emailInput.getAttribute("type")).toBe("email");

      const emailSubmitBtn = screen.getByRole("button", {
        name: /email my results/i,
      });
      expect(emailSubmitBtn).toBeDefined();
    });

    it("Exit quiz redirects user to /human", () => {
      const humanQuiz = getQuiz("human");
      render(<HumanQuizClient quiz={humanQuiz!} />);

      // Start quiz
      fireEvent.click(screen.getByRole("button", { name: /start the quiz/i }));

      // Click Exit quiz inside question component
      const exitBtn = screen.getByRole("button", { name: /exit quiz/i });
      fireEvent.click(exitBtn);

      expect(pushMock).toHaveBeenCalledWith("/human");
    });
  });

  describe("Server Component Page Integration", () => {
    it("renders the Server Component successfully with JSON-LD breadcrumbs", async () => {
      const pageResult = await HumanQuizPage();
      const { container } = render(pageResult);

      // Breadcrumb JSON-LD script is present
      const jsonLdScript = container.querySelector(
        'script[type="application/ld+json"]#human-quiz-breadcrumbs'
      );
      expect(jsonLdScript).not.toBeNull();
      const jsonContent = JSON.parse(jsonLdScript!.textContent || "{}");
      expect(jsonContent["@type"]).toBe("BreadcrumbList");
      expect(jsonContent.itemListElement).toHaveLength(3);

      // Header and quiz container rendered
      expect(screen.getByRole("banner")).toBeDefined();
      expect(
        screen.getByRole("button", { name: /start the quiz/i })
      ).toBeDefined();
      expect(screen.getByRole("contentinfo")).toBeDefined();
    });
  });
});
