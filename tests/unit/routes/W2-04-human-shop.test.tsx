// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import HumanShopPage, { generateMetadata } from "@/app/(human)/human/shop/page";
import { ShopHero } from "@/app/(human)/human/shop/_components/shop-hero";
import { ShopCollection } from "@/app/(human)/human/shop/_components/shop-collection";
import { BetterTogetherSection } from "@/app/(human)/human/shop/_components/better-together";
import { QuizBanner } from "@/app/(human)/human/shop/_components/quiz-banner";
import { ShoppingFaqSection } from "@/app/(human)/human/shop/_components/shopping-faq";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { cartProvider } from "@/lib/providers/client";
import { DEFAULT_MARKET } from "@/lib/market/markets";

// Páginas de servidor leem o cookie de mercado; o teste não tem requisição.
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

describe("W2-04: /human/shop Route & Components", () => {
  beforeEach(() => {
    vi.spyOn(cartProvider, "addLines").mockResolvedValue({
      id: "cart_test_123",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 100, currencyCode: "USD" },
      totalDiscount: { amount: 0, currencyCode: "USD" },
      totalPrice: { amount: 100, currencyCode: "USD" },
      totalQuantity: 1,
      checkoutUrl: "https://checkout.nadeon.com/mock",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe("Page & Metadata & JSON-LD", () => {
    it("generates metadata with correct title, description and pathname", async () => {
      const metadata = await generateMetadata();
      expect(metadata.title).toContain("Shop All Human Formulas");
      expect(metadata.title).toContain("Nadeon");
      expect(metadata.description).toContain(
        "NMN and NAD+ in capsules, powders and tinctures"
      );
    });

    it("renders the complete HumanShopPage with mocks", async () => {
      const pageJsx = await HumanShopPage();
      const { container } = render(pageJsx);

      // Verify JSON-LD script presence
      const jsonLdScript = container.querySelector("#shop-structured-data");
      expect(jsonLdScript).toBeTruthy();
      expect(jsonLdScript?.textContent).toContain("BreadcrumbList");
      expect(jsonLdScript?.textContent).toContain("FAQPage");
      expect(jsonLdScript?.textContent).toContain(
        "Which formula should I start with?"
      );

      // Verify main content container
      const main = container.querySelector("#main-content");
      expect(main).toBeTruthy();

      // Verify page hero heading
      const h1 = screen.getByRole("heading", {
        level: 1,
        name: /shop all formulas/i,
      });
      expect(h1).toBeTruthy();

      // Verify section headings
      expect(
        screen.getByRole("heading", { level: 2, name: /better together/i })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 2, name: /not sure which one\?/i })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 2, name: /shopping questions/i })
      ).toBeTruthy();
    });
  });

  describe("ShopHero Component", () => {
    it("renders semantic breadcrumbs, eyebrow, h1 and subtitle", () => {
      render(<ShopHero />);

      // Breadcrumb nav
      const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
      expect(nav).toBeTruthy();

      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink.getAttribute("href")).toBe("/");

      const humanLink = screen.getByRole("link", { name: "Human" });
      expect(humanLink.getAttribute("href")).toBe("/human");

      expect(screen.getByText("Shop")).toBeTruthy();

      // Eyebrow and heading
      expect(screen.getByText("THE HUMAN LINE · 7 FORMULAS")).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 1, name: "Shop all formulas" })
      ).toBeTruthy();

      // Subtitle
      expect(screen.getByText(/NMN and NAD/i)).toBeTruthy();
    });
  });

  describe("ShopCollection Component (Filters, Sort, Products, Compare)", () => {
    it("renders format filter buttons with counts and handles filtering", async () => {
      const products = await mockCatalogProvider.getProducts({ line: "human" });
      render(<ShopCollection products={products} />);

      // Format filter buttons
      const allBtn = screen.getByRole("button", { name: /all 7/i });
      const capsulesBtn = screen.getByRole("button", { name: /capsules 3/i });
      const powdersBtn = screen.getByRole("button", { name: /powders 2/i });
      const tincturesBtn = screen.getByRole("button", { name: /tinctures 2/i });

      expect(allBtn).toBeTruthy();
      expect(capsulesBtn).toBeTruthy();
      expect(powdersBtn).toBeTruthy();
      expect(tincturesBtn).toBeTruthy();

      // Default state: All is active
      expect(allBtn.getAttribute("aria-pressed")).toBe("true");
      expect(capsulesBtn.getAttribute("aria-pressed")).toBe("false");
      expect(screen.getByText("7 products")).toBeTruthy();

      // Filter by Capsules
      fireEvent.click(capsulesBtn);
      expect(capsulesBtn.getAttribute("aria-pressed")).toBe("true");
      expect(allBtn.getAttribute("aria-pressed")).toBe("false");
      expect(screen.getByText("3 products")).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 3, name: "BioHack" })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 3, name: "Full Charge" })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 3, name: "Renew" })
      ).toBeTruthy();
      expect(
        screen.queryByRole("heading", { level: 3, name: "Glow" })
      ).toBeNull();

      // Filter by Powders
      fireEvent.click(powdersBtn);
      expect(screen.getByText("2 products")).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 3, name: "Glow" })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 3, name: "Prime" })
      ).toBeTruthy();
      expect(
        screen.queryByRole("heading", { level: 3, name: "BioHack" })
      ).toBeNull();

      // Back to All
      fireEvent.click(allBtn);
      expect(screen.getByText("7 products")).toBeTruthy();
    });

    it("renders goal filter buttons and handles goal selection", async () => {
      const products = await mockCatalogProvider.getProducts({ line: "human" });
      render(<ShopCollection products={products} />);

      const energyBtn = screen.getByRole("button", { name: "Energy" });
      const agingBtn = screen.getByRole("button", { name: "Healthy aging" });
      const beautyBtn = screen.getByRole("button", { name: "Beauty" });
      const vitaminsBtn = screen.getByRole("button", {
        name: "Daily vitamins",
      });

      expect(energyBtn).toBeTruthy();
      expect(agingBtn).toBeTruthy();
      expect(beautyBtn).toBeTruthy();
      expect(vitaminsBtn).toBeTruthy();

      // Click Beauty -> only Glow
      fireEvent.click(beautyBtn);
      expect(beautyBtn.getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByText("1 products")).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 3, name: "Glow" })
      ).toBeTruthy();

      // Toggle off Beauty
      fireEvent.click(beautyBtn);
      expect(beautyBtn.getAttribute("aria-pressed")).toBe("false");
      expect(screen.getByText("7 products")).toBeTruthy();
    });

    it("renders sort select menu with all options and updates order", async () => {
      const products = await mockCatalogProvider.getProducts({ line: "human" });
      render(<ShopCollection products={products} />);

      const sortSelect = screen.getByLabelText(/sort: best sellers/i);
      expect(sortSelect).toBeTruthy();

      // Verify options
      expect(
        screen.getByRole("option", { name: "Sort: Best sellers" })
      ).toBeTruthy();
      expect(
        screen.getByRole("option", { name: "Sort: Featured" })
      ).toBeTruthy();
      expect(
        screen.getByRole("option", { name: "Price: low to high" })
      ).toBeTruthy();
      expect(
        screen.getByRole("option", { name: "Price: high to low" })
      ).toBeTruthy();

      // Sort by price: low to high
      fireEvent.change(sortSelect, { target: { value: "price-asc" } });
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBe(7);
      // First should be Daylight ($29)
      expect(articles[0].textContent).toContain("Daylight");
    });

    it("renders product cards with Intl formatted prices, images, and Add to cart buttons", async () => {
      const products = await mockCatalogProvider.getProducts({ line: "human" });
      render(<ShopCollection products={products} />);

      // Verify BioHack card details
      const biohackHeading = screen.getByRole("heading", {
        level: 3,
        name: "BioHack",
      });
      expect(biohackHeading).toBeTruthy();

      const biohackLink = screen.getByRole("link", { name: "BioHack" });
      expect(biohackLink.getAttribute("href")).toBe("/human/products/biohack");

      // Verify formatted prices exist (both BioHack and Renew are $65.00)
      const prices65 = screen.getAllByText("$65.00");
      expect(prices65.length).toBeGreaterThanOrEqual(2);

      // Verify Add to cart button
      const addBiohackBtn = screen.getByRole("button", {
        name: /add biohack to cart/i,
      });
      expect(addBiohackBtn).toBeTruthy();
      expect(addBiohackBtn.getAttribute("type")).toBe("button");

      // Click Add to cart
      fireEvent.click(addBiohackBtn);
      await waitFor(() => {
        expect(cartProvider.addLines).toHaveBeenCalledWith([
          expect.objectContaining({
            variantId: expect.any(String),
            quantity: 1,
          }),
        ]);
      });
    });

    it("does not link to the growth-stage comparison page", async () => {
      const products = await mockCatalogProvider.getProducts({ line: "human" });
      render(<ShopCollection products={products} />);

      expect(screen.queryByRole("link", { name: "Compare" })).toBeNull();
    });
  });

  describe("BetterTogetherSection Component", () => {
    it("renders Energy Duo and Beauty Duo with prices, descriptions, and Add the duo buttons", async () => {
      const [kits, products] = await Promise.all([
        mockCatalogProvider.getKits("human"),
        mockCatalogProvider.getProducts({ line: "human" }),
      ]);

      render(
        <BetterTogetherSection
          kits={kits}
          products={products}
          market={DEFAULT_MARKET}
        />
      );

      expect(screen.getByText("BUNDLE & SAVE")).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 2, name: "Better together" })
      ).toBeTruthy();

      // Energy Duo
      expect(
        screen.getByRole("heading", { level: 3, name: "Energy Duo" })
      ).toBeTruthy();
      expect(
        screen.getByText(/BioHack for daily NMN plus Renew for direct NAD/i)
      ).toBeTruthy();
      expect(screen.getByText("$105.00")).toBeTruthy();
      expect(screen.getByText("$124.00")).toBeTruthy();

      // Beauty Duo
      expect(
        screen.getByRole("heading", { level: 3, name: "Beauty Duo" })
      ).toBeTruthy();
      expect(
        screen.getByText(/Glow collagen with NMN plus Prime pure NAD/i)
      ).toBeTruthy();
      expect(screen.getByText("$92.00")).toBeTruthy();
      expect(screen.getByText("$108.00")).toBeTruthy();

      // Add the duo buttons
      const addEnergyDuoBtn = screen.getByRole("button", {
        name: /add energy duo to cart/i,
      });
      const addBeautyDuoBtn = screen.getByRole("button", {
        name: /add beauty duo to cart/i,
      });
      expect(addEnergyDuoBtn).toBeTruthy();
      expect(addBeautyDuoBtn).toBeTruthy();

      // Click Add Energy Duo
      const addKitSpy = vi
        .spyOn(cartProvider, "addKit")
        .mockResolvedValue(
          {} as Awaited<ReturnType<typeof cartProvider.addKit>>
        );
      fireEvent.click(addEnergyDuoBtn);
      await waitFor(() => {
        expect(addKitSpy).toHaveBeenCalledWith("energy-duo", 1);
      });
    });
  });

  describe("QuizBanner Component", () => {
    it("renders 60-second quiz badge, heading, description and Take the quiz link", () => {
      render(<QuizBanner />);

      expect(screen.getByText("60-SECOND QUIZ")).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 2, name: "Not sure which one?" })
      ).toBeTruthy();
      expect(
        screen.getByText(
          /Answer 5 questions about your age, goals and routine/i
        )
      ).toBeTruthy();

      const quizLink = screen.getByRole("link", { name: "Take the quiz" });
      expect(quizLink).toBeTruthy();
      expect(quizLink.getAttribute("href")).toBe("/human/quiz");
    });
  });

  describe("ShoppingFaqSection Component", () => {
    it("renders FAQ eyebrow, Shopping questions heading, All FAQs link and accordion questions", () => {
      render(<ShoppingFaqSection />);

      expect(screen.getByText("FAQ")).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 2, name: "Shopping questions" })
      ).toBeTruthy();

      const allFaqsLink = screen.getByRole("link", { name: "All FAQs" });
      expect(allFaqsLink).toBeTruthy();
      expect(allFaqsLink.getAttribute("href")).toBe("/faq");

      // Verify all 4 questions exist as buttons
      const q1 = screen.getByRole("button", {
        name: /which formula should i start with\?/i,
      });
      const q2 = screen.getByRole("button", {
        name: /can i take more than one formula\?/i,
      });
      const q3 = screen.getByRole("button", {
        name: /how does subscribe & save work\?/i,
      });
      const q4 = screen.getByRole("button", {
        name: /how do i find the lab report for my jar\?/i,
      });

      expect(q1).toBeTruthy();
      expect(q2).toBeTruthy();
      expect(q3).toBeTruthy();
      expect(q4).toBeTruthy();

      // Question 1 is open by default
      expect(q1.getAttribute("aria-expanded")).toBe("true");
      expect(
        screen.getByText(/Most people start with BioHack for daily NMN/i)
      ).toBeTruthy();

      // Questions 2, 3, 4 are closed
      expect(q2.getAttribute("aria-expanded")).toBe("false");
      expect(q3.getAttribute("aria-expanded")).toBe("false");
      expect(q4.getAttribute("aria-expanded")).toBe("false");

      // Toggle Question 2 open
      fireEvent.click(q2);
      expect(q2.getAttribute("aria-expanded")).toBe("true");
      expect(q1.getAttribute("aria-expanded")).toBe("false");
      expect(screen.getByText(/Many customers stack formulas/i)).toBeTruthy();
    });
  });
});
