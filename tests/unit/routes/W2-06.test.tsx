// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import ProductPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(human)/human/products/[slug]/page";
import { catalogProvider } from "@/lib/providers";
import { formatMarketPrice } from "@/lib/market/formatter";
import { DEFAULT_MARKET } from "@/lib/market/markets";

// Página de servidor lê o cookie de mercado; o teste não tem requisição.
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

describe("Route /human/products/[slug] (W2-06)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("SEO & Metadata", () => {
    it("generates correct metadata for BioHack", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: "biohack" }),
      });

      expect(metadata.title).toBe("BioHack | Nadeon Labs");
      expect(metadata.description).toBeDefined();
      expect(metadata.alternates?.canonical).toBe(
        "https://nadeonlabs.com/human/products/biohack"
      );
      expect(metadata.alternates?.languages?.["en-US"]).toBe(
        "https://nadeonlabs.com/human/products/biohack"
      );
    });

    it("generates fallback title for missing slug", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: "non-existent-slug" }),
      });

      expect(metadata.title).toBe("Product Not Found | Nadeon Labs");
    });

    it("provides static params for all human products", async () => {
      const params = await generateStaticParams();
      expect(params.length).toBeGreaterThan(0);
      expect(params.some((p) => p.slug === "biohack")).toBe(true);
    });
  });

  describe("404 Not Found handling", () => {
    it("triggers notFound() when product does not exist", async () => {
      await expect(
        ProductPage({
          params: Promise.resolve({ slug: "non-existent-product" }),
        })
      ).rejects.toThrow("NEXT_NOT_FOUND");
      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });

    it("triggers notFound() when product belongs to pet line", async () => {
      await expect(
        ProductPage({
          params: Promise.resolve({ slug: "more-good-years" }),
        })
      ).rejects.toThrow("NEXT_NOT_FOUND");
      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
  });

  describe("Page layout, semantic elements, and Section 5.2 buttons & fields", () => {
    it("uses the catalog image and product-specific alt text", async () => {
      const jsx = await ProductPage({
        params: Promise.resolve({ slug: "powerhouse" }),
      });

      render(jsx);

      const product = await catalogProvider.getProduct("powerhouse");
      expect(product).toBeTruthy();
      const image = screen.getByRole("img", { name: "Powerhouse, Jar view" });
      expect(
        new URL(
          image.getAttribute("src")!,
          "https://nadeonlabs.com"
        ).searchParams.get("url")
      ).toBe(product!.images[0]);
      expect(image.getAttribute("sizes")).toBe(
        "(min-width: 1280px) 576px, (min-width: 1024px) calc(58.333vw - 171.333px), (min-width: 640px) calc(100vw - 128px), calc(100vw - 96px)"
      );

      // 1. Heading and Breadcrumb navigation
      expect(
        screen.getByRole("heading", { level: 1, name: /powerhouse/i })
      ).toBeTruthy();
      expect(
        screen.getByRole("navigation", { name: /breadcrumb/i })
      ).toBeTruthy();

      const expectedTabs = [
        "Jar",
        "Capsules",
        "Label",
        "How to take",
        "Supplement facts",
        "Routine",
        "Lab report",
        "▶ Video",
      ];
      for (const tabName of expectedTabs)
        expect(screen.getByRole("tab", { name: tabName })).toBeTruthy();
    });

    it("uses a descriptive product alt text for the placeholder image", async () => {
      const jsx = await ProductPage({
        params: Promise.resolve({ slug: "glow" }),
      });
      render(jsx);

      const image = screen.getByRole("img", { name: "Glow, Jar view" });
      expect(image.getAttribute("src")).toBe("/renders/placeholder.svg");
    });

    it("renders page with all buttons and fields mandated by catalog section 5.2", async () => {
      const jsx = await ProductPage({
        params: Promise.resolve({ slug: "biohack" }),
      });
      render(jsx);

      expect(
        screen.getByRole("heading", { level: 1, name: /biohack/i })
      ).toBeTruthy();
      expect(
        screen.getByRole("navigation", { name: /breadcrumb/i })
      ).toBeTruthy();

      // 2. Gallery interactive buttons (Jar, Capsules, Label, How to take, Supplement facts, Routine, Lab report, ▶ Video)
      const expectedTabs = [
        "Jar",
        "Capsules",
        "Label",
        "How to take",
        "Supplement facts",
        "Routine",
        "Lab report",
        "▶ Video",
      ];
      for (const tabName of expectedTabs) {
        const tabButton = screen.getByRole("tab", { name: tabName });
        expect(tabButton).toBeTruthy();
      }

      // Test gallery interaction: clicking another tab changes active selection
      const capsulesTab = screen.getByRole("tab", { name: "Capsules" });
      fireEvent.click(capsulesTab);
      expect(capsulesTab.getAttribute("aria-selected")).toBe("true");

      // 3. Link "See Supplement Facts"
      const supplementFactsLink = screen.getByRole("link", {
        name: /see supplement facts/i,
      });
      expect(supplementFactsLink).toBeTruthy();
      expect(supplementFactsLink.getAttribute("href")).toBe(
        "#supplement-facts"
      );

      // 4. Compra avulsa options (1 jar $59, 2 jars $106, 3 jars $150)
      const oneTimeRadio = screen.getByRole("radio", {
        name: /one-time purchase/i,
      });
      expect(oneTimeRadio).toBeTruthy();
      fireEvent.click(oneTimeRadio);

      // Verify variant options exist
      expect(screen.getByRole("radio", { name: /1 jar/i })).toBeTruthy();
      expect(screen.getByRole("radio", { name: /2 jars/i })).toBeTruthy();
      expect(screen.getByRole("radio", { name: /3 jars/i })).toBeTruthy();

      // 5. Assinatura options (Subscribe & save 15%, 30 days, 60 days, 90 days)
      const subRadio = screen.getByRole("radio", {
        name: /subscribe & save 15%/i,
      });
      expect(subRadio).toBeTruthy();
      fireEvent.click(subRadio);

      // Verify selling plans
      expect(screen.getByRole("radio", { name: /30 days/i })).toBeTruthy();
      expect(screen.getByRole("radio", { name: /60 days/i })).toBeTruthy();
      expect(screen.getByRole("radio", { name: /90 days/i })).toBeTruthy();

      // 6. Main Add to Cart button + Shop Pay text
      const addToCartButtons = screen.getAllByRole("button", {
        name: /add to cart/i,
      });
      expect(addToCartButtons.length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/shop pay/i).length).toBeGreaterThanOrEqual(1);

      // 7. Busca de laudo: campo "e.g. NL-0000" + botão "Search"
      const lotInput = screen.getByPlaceholderText(
        /e\.g\. nl-0000/i
      ) as HTMLInputElement;
      expect(lotInput).toBeTruthy();
      expect(lotInput.disabled).toBe(true);

      const searchButton = screen.getByRole("button", {
        name: /search/i,
      }) as HTMLButtonElement;
      expect(searchButton).toBeTruthy();
      expect(searchButton.disabled).toBe(true);

      // Compliance Rule 8 text: first lots publishing soon
      expect(
        screen.getAllByText(/first lots publishing soon/i).length
      ).toBeGreaterThan(0);

      // 8. Seção Ciência: link "Read the science"
      const readScienceLink = screen.getByRole("link", {
        name: /read the science/i,
      });
      expect(readScienceLink).toBeTruthy();
      expect(readScienceLink.getAttribute("href")).toBe("/science");

      // 9. Seção "Is BioHack right for you?" (Who it is for)
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: /is biohack right for you\?/i,
        })
      ).toBeTruthy();

      // 10. Comparação com concorrentes (Comparison table)
      expect(
        screen.getByRole("table", {
          name: /comparison of biohack with competitor nmn supplements/i,
        })
      ).toBeTruthy();
      expect(screen.getByText(/nmn brand a/i)).toBeTruthy();
      expect(screen.getByText(/nmn brand b/i)).toBeTruthy();

      // 11. Kit: botão "Add the duo"
      const addDuoButton = screen.getByRole("button", {
        name: /add the duo/i,
      });
      expect(addDuoButton).toBeTruthy();

      // 12. Avaliações com "No reviews yet" e sem botão de escrita (Rule 8)
      expect(
        screen.getAllByText(/no reviews yet/i).length
      ).toBeGreaterThanOrEqual(1);
      expect(
        screen.queryByRole("button", { name: /write a review/i })
      ).toBeNull();

      // 13. FAQ com botões de acordeão e link "All FAQs"
      const faqQuestionButton = screen.getByRole("button", {
        name: /how is nmn different from nad\+/i,
      });
      expect(faqQuestionButton).toBeTruthy();
      expect(faqQuestionButton.getAttribute("aria-expanded")).toBe("true");

      const allFaqsLink = screen.getByRole("link", { name: /all faqs/i });
      expect(allFaqsLink).toBeTruthy();
      expect(allFaqsLink.getAttribute("href")).toBe("/faq");

      // 14. Abas/produtos relacionados (Complete the routine) com Add to Cart
      expect(screen.getByText(/complete the routine/i)).toBeTruthy();
      expect(screen.getAllByText(/renew/i).length).toBeGreaterThanOrEqual(1);

      // 15. Sticky Add-to-Cart Bar
      const quickBar = screen.getByRole("complementary", {
        name: /quick add to cart bar/i,
      });
      expect(quickBar).toBeTruthy();
      const stickyButton = within(quickBar).getByRole("button", {
        name: /add to cart/i,
      });
      expect(stickyButton).toBeTruthy();
    }, 30000);

    it("toggles FAQ accordion items when clicked", async () => {
      const jsx = await ProductPage({
        params: Promise.resolve({ slug: "biohack" }),
      });

      render(jsx);

      const q2Button = screen.getByRole("button", {
        name: /can i take biohack with renew\?/i,
      });
      expect(q2Button.getAttribute("aria-expanded")).toBe("false");

      fireEvent.click(q2Button);
      expect(q2Button.getAttribute("aria-expanded")).toBe("true");
      expect(
        screen.getByText(/biohack provides nmn in the morning/i)
      ).toBeTruthy();
    }, 30000);
  });

  describe("Compliance and market rules", () => {
    it("shows the FDA notice next to claims", async () => {
      render(
        await ProductPage({ params: Promise.resolve({ slug: "biohack" }) })
      );

      expect(
        screen.getAllByText(/These statements have not been evaluated/).length
      ).toBeGreaterThan(0);
    }, 30000);

    it("omits the route's own lot, lab and shipping copy", async () => {
      render(
        await ProductPage({ params: Promise.resolve({ slug: "biohack" }) })
      );

      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/Lab report published for every lot/);
      expect(text).not.toMatch(/Lab-tested every lot/);
      expect(text).not.toMatch(/You save 15%/);
    }, 30000);

    it("formats the headline price from the catalog variant", async () => {
      const product = await catalogProvider.getProduct("biohack");
      const price = product!.variants[0].price;
      const expected = formatMarketPrice(
        price.amount,
        price.currencyCode,
        DEFAULT_MARKET.locale
      );

      render(
        await ProductPage({ params: Promise.resolve({ slug: "biohack" }) })
      );

      expect(screen.getAllByText(expected).length).toBeGreaterThan(0);
    }, 30000);
  });
});
