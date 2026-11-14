/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import HumanPage, { generateMetadata } from "@/app/(human)/human/page";
import { useCartStore, cartProvider } from "@/lib/providers/client";

describe("W2-02 Route: /human (Home Human)", () => {
  beforeEach(() => {
    useCartStore.getState().resetCart();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Metadata & SEO", () => {
    it("generates valid SEO metadata with title and description", async () => {
      const metadata = await generateMetadata();
      expect(metadata.title).toContain("Nadeon Human");
      expect(metadata.description).toContain("Clean NMN and NAD+ formulas");
    });
  });

  describe("Catalog Section 5.1 Elements & Semantics", () => {
    it("renders hero carousel and transitions across slides with semantic controls", async () => {
      const PageComponent = await HumanPage();
      render(PageComponent);

      // Hero Carousel controls & Slide 1
      const prevBtn = screen.getByRole("button", { name: /previous slide/i });
      const nextBtn = screen.getByRole("button", { name: /next slide/i });
      expect(prevBtn).toBeDefined();
      expect(nextBtn).toBeDefined();

      const shopBestSellersLink = screen.getByRole("link", {
        name: /shop best sellers/i,
      });
      expect(shopBestSellersLink.getAttribute("href")).toBe("#daily-routine");

      const takeQuizLinks = screen.getAllByRole("link", {
        name: /take the quiz/i,
      });
      expect(takeQuizLinks[0].getAttribute("href")).toBe("/human/quiz");

      // Slide 2: Bundle & Save
      fireEvent.click(nextBtn);
      expect(
        screen.getByRole("button", { name: /add the energy duo/i })
      ).toBeDefined();
      expect(
        screen
          .getByRole("link", { name: /compare formulas/i })
          .getAttribute("href")
      ).toBe("#daily-routine");

      // Slide 3: Quiz preview
      fireEvent.click(nextBtn);
      expect(
        screen.getAllByRole("link", { name: /take the 60-second quiz/i })[0]
      ).toBeDefined();
      expect(
        screen.getAllByRole("link", { name: /shop all formulas/i })[0]
      ).toBeDefined();

      // Slide 4: Black Friday campaign template
      fireEvent.click(nextBtn);
      expect(
        screen
          .getByRole("link", { name: /shop the sale/i })
          .getAttribute("href")
      ).toBe("/human/shop");
      expect(
        screen.getByRole("link", { name: /see the kits/i }).getAttribute("href")
      ).toBe("#bundles");
    }, 15000);

    it("renders daily routine format tabs and product cards with add-to-cart", async () => {
      const PageComponent = await HumanPage();
      render(PageComponent);

      const tabAll = screen.getByRole("tab", { name: /^all$/i });
      const tabCapsules = screen.getByRole("tab", { name: /^capsules$/i });
      const tabPowders = screen.getByRole("tab", { name: /^powders$/i });
      const tabTinctures = screen.getByRole("tab", { name: /^tinctures$/i });

      expect(tabAll).toBeDefined();
      expect(tabCapsules).toBeDefined();
      expect(tabPowders).toBeDefined();
      expect(tabTinctures).toBeDefined();

      expect(tabAll.getAttribute("aria-selected")).toBe("true");

      fireEvent.click(tabCapsules);
      expect(tabCapsules.getAttribute("aria-selected")).toBe("true");
      expect(tabAll.getAttribute("aria-selected")).toBe("false");

      const addToCartButtons = screen.getAllByRole("button", {
        name: /add .* to cart/i,
      });
      expect(addToCartButtons.length).toBeGreaterThan(0);
    }, 15000);

    it("renders age bands, ingredients, label comparison and routine blocks", async () => {
      const PageComponent = await HumanPage();
      render(PageComponent);

      expect(
        screen
          .getByRole("link", { name: /find my formula/i })
          .getAttribute("href")
      ).toBe("/human/quiz");
      expect(
        screen
          .getByRole("link", { name: /compare all formulas/i })
          .getAttribute("href")
      ).toBe("/human/shop");

      expect(screen.getByText("25 to 34")).toBeDefined();
      expect(screen.getByText("35 to 49")).toBeDefined();
      expect(screen.getByText("50+")).toBeDefined();

      expect(
        screen.getAllByRole("link", { name: /read the science/i })[0]
      ).toBeDefined();
      expect(
        screen.getByRole("link", { name: /shop by ingredient/i })
      ).toBeDefined();
      expect(
        screen.getByRole("link", { name: /shop biohack/i }).getAttribute("href")
      ).toBe("/human/products/biohack");
      expect(
        screen
          .getByRole("link", { name: /start your routine/i })
          .getAttribute("href")
      ).toBe("#daily-routine");

      expect(
        screen.getByRole("button", { name: /add the duo/i })
      ).toBeDefined();
      expect(
        screen
          .getByRole("link", { name: /start a subscription/i })
          .getAttribute("href")
      ).toBe("/human/subscribe");
    }, 15000);

    it("renders lab results, customer reviews, journal, and accordion faqs", async () => {
      const PageComponent = await HumanPage();
      render(PageComponent);

      expect(
        screen.getByRole("textbox", { name: /enter lot number/i })
      ).toBeDefined();
      expect(screen.getByRole("button", { name: /search/i })).toBeDefined();
      expect(
        screen.getAllByRole("link", { name: /see our lab results/i })[0]
      ).toBeDefined();
      expect(screen.getByText(/first lots publishing soon/i)).toBeDefined();

      expect(
        screen.getByRole("link", { name: /about us/i }).getAttribute("href")
      ).toBe("/about");
      expect(
        screen
          .getByRole("link", { name: /read all reviews/i })
          .getAttribute("href")
      ).toBe("/reviews");
      expect(screen.getByText(/no reviews yet/i)).toBeDefined();
      expect(
        screen.getByRole("link", { name: /all articles/i }).getAttribute("href")
      ).toBe("/journal");

      expect(
        screen.getByRole("link", { name: /all faqs/i }).getAttribute("href")
      ).toBe("/faq");
      const faqBtn = screen.getByRole("button", {
        name: /what is nmn and how is it different from nad\+?/i,
      });
      expect(faqBtn.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(faqBtn);
      expect(faqBtn.getAttribute("aria-expanded")).toBe("true");

      expect(
        screen
          .getByRole("link", { name: /visit nadeon pet →/i })
          .getAttribute("href")
      ).toBe("/pet");
    }, 15000);

    it("triggers cart additions correctly for kit bundle buttons", async () => {
      const addLinesSpy = vi.spyOn(cartProvider, "addLines");
      const PageComponent = await HumanPage();
      render(PageComponent);

      const addDuoBtn = screen.getByRole("button", { name: /add the duo/i });
      fireEvent.click(addDuoBtn);

      await waitFor(() => {
        expect(addLinesSpy).toHaveBeenCalledWith([
          { variantId: "var_biohack_1", quantity: 1 },
          { variantId: "var_renew_1", quantity: 1 },
        ]);
      });
    }, 15000);

    it("handles lot number lookup submission gracefully with status notice", async () => {
      const PageComponent = await HumanPage();
      render(PageComponent);

      const lotInput = screen.getByRole("textbox", {
        name: /enter lot number/i,
      });
      const searchBtn = screen.getByRole("button", { name: /search/i });

      fireEvent.change(lotInput, { target: { value: "NL-2026-001" } });
      fireEvent.click(searchBtn);

      expect(screen.getByText(/first lots publishing soon/i)).toBeDefined();
    }, 15000);
  });
});
