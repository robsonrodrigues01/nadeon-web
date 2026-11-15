// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";

import PetKitsPage, { metadata } from "@/app/(pet)/pet/kits/page";
import PetKitPage, { generateMetadata } from "@/app/(pet)/pet/kits/[slug]/page";
import { buildKitView } from "@/app/(pet)/pet/kits/_components/kit-format";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { DEFAULT_MARKET, getMarket } from "@/lib/market/markets";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { cookies } from "next/headers";
import { getRequestMarket } from "@/app/(pet)/pet/kits/_components/request-market";
import type { Product } from "@/lib/contracts/catalog";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

const PET_KIT_SLUGS = [
  "chew-oil",
  "chew-good-days",
  "senior-starter",
  "cat-care",
];

async function renderKitsPage() {
  const jsx = await PetKitsPage();
  render(jsx);
}

describe("W2-13: /pet/kits Route Suite", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Metadata & SEO", () => {
    it("exports metadata with the kits title and canonical path", () => {
      expect(metadata.title).toContain("Kits & Bundles");
      expect(metadata.description).toContain(
        "priced below buying them one by one"
      );
      expect(metadata.description).not.toMatch(/\d+%/);
      expect(metadata.alternates?.canonical).toContain("/pet/kits");
    });
  });

  describe("Server page (PetKitsPage)", () => {
    it("renders the hero heading and the four pet kits from the catalog provider", async () => {
      await renderKitsPage();

      expect(
        screen.getByRole("heading", { level: 1, name: /kits & bundles/i })
      ).toBeTruthy();

      for (const slug of PET_KIT_SLUGS) {
        const kit = (await mockCatalogProvider.getKit(slug))!;
        expect(
          screen.getByRole("heading", { level: 2, name: kit.name })
        ).toBeTruthy();
      }
      expect(screen.getAllByRole("article")).toHaveLength(4);
    });

    it("renders the kit price in the market currency and the savings from catalog data", async () => {
      await renderKitsPage();

      const card = screen.getByRole("article", { name: "Chew + Oil" });
      expect(within(card).getByText("$75.00")).toBeTruthy();
      expect(within(card).getByText("$88.00")).toBeTruthy();
      expect(within(card).getByText("You save $13.00")).toBeTruthy();
    });

    it("includes JSON-LD for the kit collection with the escaped script id", async () => {
      await renderKitsPage();

      const script = document.getElementById("pet-kits-collection-ld");
      expect(script).toBeTruthy();
      expect(script?.textContent).toContain("Chew + Oil");
      expect(script?.textContent).not.toContain("<");
    });

    it("derives the savings percentage from catalog prices, not from copy", async () => {
      await renderKitsPage();

      // Pet kits save 52 of 342 at compare-at prices: 15%.
      expect(
        screen.getByText(/priced about 15% below buying them one by one/i)
      ).toBeTruthy();
      const howItWorks = screen.getByRole("region", { name: "How kits work" });
      expect(within(howItWorks).queryByText(/free shipping/i)).toBeNull();
      expect(within(howItWorks).queryByText(/\$49/)).toBeNull();
      const card = screen.getByRole("article", { name: "Chew + Oil" });
      expect(within(card).getByText("SAVE 15%")).toBeTruthy();
    });

    it("does not duplicate the pet chrome (layout provides header, banner, trust strip and footer)", async () => {
      await renderKitsPage();

      expect(screen.queryByRole("contentinfo")).toBeNull();
      expect(screen.queryByRole("banner")).toBeNull();
      expect(document.querySelector("#main-content")).toBeTruthy();
    });

    it("renders no placeholder text ([X], $XX or (example))", async () => {
      await renderKitsPage();

      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/\[X\]|\$XX|\(example\)/i);
    });
  });

  describe("Filters (buttons from catalog section 5.2)", () => {
    it("exposes All kits, Duos and Trios as toggle buttons with counts", async () => {
      await renderKitsPage();

      const all = screen.getByRole("button", { name: /all kits 4/i });
      const duos = screen.getByRole("button", { name: /duos 3/i });
      const trios = screen.getByRole("button", { name: /trios 1/i });

      expect(all.getAttribute("aria-pressed")).toBe("true");
      expect(duos.getAttribute("aria-pressed")).toBe("false");
      expect(trios.getAttribute("aria-pressed")).toBe("false");
    });

    it("filters the cards to duos, to trios and back to all kits", async () => {
      await renderKitsPage();

      fireEvent.click(screen.getByRole("button", { name: /duos 3/i }));
      expect(screen.getAllByRole("article")).toHaveLength(3);
      expect(
        screen
          .getByRole("button", { name: /duos 3/i })
          .getAttribute("aria-pressed")
      ).toBe("true");

      fireEvent.click(screen.getByRole("button", { name: /trios 1/i }));
      const trioCards = screen.getAllByRole("article");
      expect(trioCards).toHaveLength(1);
      expect(
        within(trioCards[0]).getByRole("heading", {
          level: 2,
          name: "Senior Starter",
        })
      ).toBeTruthy();

      fireEvent.click(screen.getByRole("button", { name: /all kits 4/i }));
      expect(screen.getAllByRole("article")).toHaveLength(4);
    });
  });

  describe("Card actions", () => {
    it("renders Add kit to cart as a disabled button on every card", async () => {
      await renderKitsPage();

      const buttons = screen.getAllByRole("button", {
        name: "Add kit to cart",
      });
      expect(buttons).toHaveLength(4);
      for (const button of buttons) {
        expect((button as HTMLButtonElement).disabled).toBe(true);
        expect(button.tagName).toBe("BUTTON");
      }
    });

    it("links View details to each kit detail page", async () => {
      await renderKitsPage();

      const links = screen.getAllByRole("link", { name: "View details" });
      expect(links).toHaveLength(4);
      const hrefs = links.map((link) => link.getAttribute("href"));
      for (const slug of PET_KIT_SLUGS) {
        expect(hrefs).toContain(`/pet/kits/${slug}`);
      }
    });

    it("links Build your box to the pet box builder", async () => {
      await renderKitsPage();

      const link = screen.getByRole("link", { name: "Build your box" });
      expect(link.getAttribute("href")).toBe("/pet/build-your-box");
    });
  });
});

describe("W2-13: /pet/kits/[slug] Route Suite", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports metadata built from the kit", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "chew-oil" }),
    });
    expect(meta.title).toContain("Chew + Oil");
    expect(meta.alternates?.canonical).toContain("/pet/kits/chew-oil");
  });

  it("renders the kit with its price, disabled add button and product links", async () => {
    const jsx = await PetKitPage({
      params: Promise.resolve({ slug: "chew-oil" }),
    });
    render(jsx);

    expect(
      screen.getByRole("heading", { level: 1, name: "Chew + Oil" })
    ).toBeTruthy();
    expect(screen.getByText("$75.00")).toBeTruthy();
    expect(
      (
        screen.getByRole("button", {
          name: "Add kit to cart",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);

    const productList = screen.getByRole("list", {
      name: "Products in this kit",
    });
    const productLinks = within(productList).getAllByRole("link");
    expect(productLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/pet/products/more-good-years",
      "/pet/products/more-good-years-oil",
    ]);
  });

  it("does not duplicate the pet chrome on the detail page", async () => {
    const jsx = await PetKitPage({
      params: Promise.resolve({ slug: "chew-oil" }),
    });
    render(jsx);

    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.queryByRole("banner")).toBeNull();
  });

  it("emits JSON-LD offer in the market currency of the cookie", async () => {
    vi.mocked(cookies).mockResolvedValueOnce({
      get: (name: string) =>
        name === "nadeon_market" ? { value: "ca" } : undefined,
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    const jsx = await PetKitPage({
      params: Promise.resolve({ slug: "chew-oil" }),
    });
    render(jsx);

    const ld = document.getElementById("pet-kit-product-ld")?.textContent ?? "";
    const data = JSON.parse(ld);
    expect(data.offers.priceCurrency).toBe("CAD");
    expect(data.offers.price).toBeCloseTo(102, 0);
  });

  it("returns 404 for a kit that is not a pet kit", async () => {
    await expect(
      PetKitPage({ params: Promise.resolve({ slug: "energy-duo" }) })
    ).rejects.toThrow();
  });

  it("builds the card view with savings and no badge for kits without one", async () => {
    const kit = (await mockCatalogProvider.getKit("chew-oil"))!;
    const map = new Map([
      [
        "more-good-years",
        (await mockCatalogProvider.getProduct("more-good-years"))!,
      ],
      [
        "more-good-years-oil",
        (await mockCatalogProvider.getProduct("more-good-years-oil"))!,
      ],
    ]);
    const view = buildKitView(kit, map, DEFAULT_MARKET);

    expect(view.productCount).toBe(2);
    expect(view.savings).toBe("$13.00");
    expect(view.badge).toBe("SAVE 15%");
    expect(view.image).toBe(map.get("more-good-years")?.images[0]);
  });

  it("uses the placeholder when no kit product has a catalog image", async () => {
    const kit = (await mockCatalogProvider.getKit("chew-oil"))!;
    const map = new Map<string, Product>();
    await Promise.all(
      kit.products.map(async ({ productSlug }) => {
        const product = await mockCatalogProvider.getProduct(productSlug);
        if (product) map.set(productSlug, { ...product, images: [] });
      })
    );
    expect(buildKitView(kit, map, DEFAULT_MARKET).image).toBe(
      "/renders/placeholder.svg"
    );
  });
});

describe("W2-13: market from nadeon_market cookie (Rule 14)", () => {
  beforeEach(() => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => undefined,
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  afterEach(() => {
    cleanup();
  });

  it("falls back to the default market when the cookie is absent", async () => {
    expect((await getRequestMarket()).id).toBe(DEFAULT_MARKET.id);
  });

  it("reads the market from the cookie and formats prices in its currency", async () => {
    const ca = getMarket("ca")!;
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === "nadeon_market" ? { value: "ca" } : undefined,
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    const market = await getRequestMarket();
    expect(market.id).toBe(ca.id);

    const kit = (await mockCatalogProvider.getKit("chew-oil"))!;
    const map = new Map([
      [
        "more-good-years",
        (await mockCatalogProvider.getProduct("more-good-years"))!,
      ],
      [
        "more-good-years-oil",
        (await mockCatalogProvider.getProduct("more-good-years-oil"))!,
      ],
    ]);
    const view = buildKitView(kit, map, market);
    // Canadian market converts the USD catalog price by the market rate (75 USD -> ~102 CAD).
    expect(view.price).toBe(
      formatMoneyWithMarket({ amount: 75, currencyCode: "USD" }, ca)
    );
    expect(view.price).toMatch(/102/);
  });

  it("falls back to the default market for an unknown cookie value", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ value: "xx" }),
    } as unknown as Awaited<ReturnType<typeof cookies>>);
    expect((await getRequestMarket()).id).toBe(DEFAULT_MARKET.id);
  });
});
