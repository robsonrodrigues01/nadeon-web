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
import { catalogProvider } from "@/lib/providers";
import { MarketProvider } from "@/lib/market";

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

    it("keeps lot number search disabled until real lots exist", async () => {
      const PageComponent = await HumanPage();
      render(PageComponent);

      const lotInput = screen.getByRole("textbox", {
        name: /enter lot number/i,
      }) as HTMLInputElement;
      const searchBtn = screen.getByRole("button", {
        name: /search/i,
      }) as HTMLButtonElement;

      expect(lotInput.disabled).toBe(true);
      expect(searchBtn.disabled).toBe(true);
      expect(screen.getByText(/first lots publishing soon/i)).toBeDefined();
    }, 15000);

    it("moves between format tabs with arrow, Home and End keys", async () => {
      const PageComponent = await HumanPage();
      render(PageComponent);

      const tabAll = screen.getByRole("tab", { name: /^all$/i });
      const tablist = screen.getByRole("tablist");

      fireEvent.keyDown(tablist, { key: "ArrowRight" });
      const tabCapsules = screen.getByRole("tab", { name: /^capsules$/i });
      expect(tabCapsules.getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabCapsules);

      fireEvent.keyDown(tablist, { key: "End" });
      expect(
        screen
          .getByRole("tab", { name: /^tinctures$/i })
          .getAttribute("aria-selected")
      ).toBe("true");

      fireEvent.keyDown(tablist, { key: "ArrowRight" });
      expect(tabAll.getAttribute("aria-selected")).toBe("true");

      fireEvent.keyDown(tablist, { key: "ArrowLeft" });
      expect(
        screen
          .getByRole("tab", { name: /^tinctures$/i })
          .getAttribute("aria-selected")
      ).toBe("true");
    }, 15000);

    it("points every tab's aria-controls at the rendered tabpanel", async () => {
      const PageComponent = await HumanPage();
      render(PageComponent);

      const panel = screen.getByRole("tabpanel");
      for (const tab of screen.getAllByRole("tab")) {
        expect(tab.getAttribute("aria-controls")).toBe(panel.id);
      }
      expect(panel.getAttribute("aria-labelledby")).toBe("tab-all");
    }, 15000);

    it("formats kit prices in the active market currency", async () => {
      render(
        <MarketProvider initialMarket="ca">{await HumanPage()}</MarketProvider>
      );

      // Kit price is 105 USD; Canada rate 1.36 gives 142.80 CAD.
      expect(
        screen.getByText(/142\.80/, { selector: "span" }).textContent
      ).toMatch(/142\.80/);
      expect(screen.queryByText(/105\.00/)).toBeNull();
    }, 15000);

    it("does not render a fallback price when the catalog has no kit", async () => {
      vi.spyOn(catalogProvider, "getKit").mockResolvedValue(null);

      render(await HumanPage());

      expect(screen.queryByText(/\$105|\$124/)).toBeNull();
      expect(
        (
          screen.getByRole("button", {
            name: /add the duo/i,
          }) as HTMLButtonElement
        ).disabled
      ).toBe(true);
    }, 15000);

    it("renders market-aware free shipping label in bottom CTA and handles null threshold", async () => {
      const { unmount } = render(await HumanPage());
      expect(
        screen.getByText(
          /free shipping over \$75 · 60-day guarantee · cancel anytime/i
        )
      ).toBeDefined();

      unmount();

      render(
        <MarketProvider initialMarket="ca">{await HumanPage()}</MarketProvider>
      );
      expect(
        screen.getByText(/^60-day guarantee · cancel anytime$/i)
      ).toBeDefined();
      expect(screen.queryByText(/free shipping over/i)).toBeNull();
    }, 15000);
  });
});
