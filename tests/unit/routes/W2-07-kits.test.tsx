// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import HumanKitsPage, { metadata } from "@/app/(human)/human/kits/page";
import HumanKitPage, {
  generateMetadata as kitMetadata,
} from "@/app/(human)/human/kits/[slug]/page";
import { cartProvider } from "@/lib/providers/client";
import {
  buildKitViews,
  averageSavingsPercent,
  formatKitMoney,
} from "@/app/(human)/human/kits/_components/kit-view";
import { catalogProvider } from "@/lib/providers";

const PLACEHOLDERS = /\[X\]|\$XX|\(example\)/i;

async function renderList() {
  render(await HumanKitsPage());
}

async function renderKit(slug: string) {
  render(await HumanKitPage({ params: Promise.resolve({ slug }) }));
}

describe("W2-07 Route: Kits (`/human/kits`)", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("exports SEO metadata with canonical `/human/kits`", () => {
    expect(metadata.title).toMatch(/Kits & bundles/);
    expect(metadata.alternates?.canonical).toBe(
      "https://nadeonlabs.com/human/kits"
    );
    expect(metadata.description).toMatch(/Clifton, NJ/);
  });

  it("renders the page heading and breadcrumb as semantic elements", async () => {
    await renderList();
    expect(
      screen.getByRole("heading", { level: 1, name: "Kits & bundles" })
    ).toBeDefined();
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(nav).getByRole("link", { name: "Home" }).getAttribute("href")
    ).toBe("/");
    expect(
      within(nav).getByRole("link", { name: "Human" }).getAttribute("href")
    ).toBe("/human");
    expect(
      within(nav).getByText("Kits & bundles").getAttribute("aria-current")
    ).toBe("page");
  });

  it("renders the filter buttons with catalog counts (All 4, Duos 3, Trios 1)", async () => {
    await renderList();
    const group = screen.getByRole("group", { name: "Filter kits" });
    const all = within(group).getByRole("button", { name: "All kits 4" });
    const duos = within(group).getByRole("button", { name: "Duos 3" });
    const trios = within(group).getByRole("button", { name: "Trios 1" });
    expect(all.getAttribute("aria-pressed")).toBe("true");
    expect(duos.getAttribute("aria-pressed")).toBe("false");
    expect(trios.getAttribute("type")).toBe("button");
  });

  it("filters kits when a filter button is pressed", async () => {
    await renderList();
    const group = screen.getByRole("group", { name: "Filter kits" });
    fireEvent.click(within(group).getByRole("button", { name: "Duos 3" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.queryByRole("heading", { name: "Full Routine" })).toBeNull();

    fireEvent.click(within(group).getByRole("button", { name: "Trios 1" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Full Routine" })).toBeDefined();

    fireEvent.click(within(group).getByRole("button", { name: "All kits 4" }));
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("gives each kit card an Add kit to cart button and a View details link", async () => {
    await renderList();
    expect(
      screen.getAllByRole("button", { name: "Add kit to cart" })
    ).toHaveLength(4);
    const details = screen.getAllByRole("link", { name: "View details" });
    expect(details.map((a) => a.getAttribute("href"))).toEqual([
      "/human/kits/energy-duo",
      "/human/kits/beauty-duo",
      "/human/kits/morning-stack",
      "/human/kits/full-routine",
    ]);
  });

  it("adds the kit's formulas to the cart through the client provider", async () => {
    const spy = vi
      .spyOn(cartProvider, "addLines")
      .mockResolvedValue(
        {} as Awaited<ReturnType<typeof cartProvider.addLines>>
      );
    await renderList();
    const card = screen.getByRole("article", { name: "Energy Duo" });
    fireEvent.click(
      within(card).getByRole("button", { name: "Add kit to cart" })
    );
    await screen.findByText("Added Energy Duo to cart");
    expect(spy).toHaveBeenCalledWith([
      expect.objectContaining({ quantity: 1 }),
      expect.objectContaining({ quantity: 1 }),
    ]);
  });

  it("shows prices formatted with Intl and savings badges from catalog data", async () => {
    await renderList();
    const card = screen.getByRole("article", { name: "Energy Duo" });
    expect(
      within(card).getByText(
        formatKitMoney({ amount: 105, currencyCode: "USD" })
      )
    ).toBeDefined();
    expect(within(card).getByText("You save $19.00")).toBeDefined();
    expect(within(card).getByText("SAVE 15%")).toBeDefined();
  });

  it("marks the highest-savings kit as best value", async () => {
    await renderList();
    expect(screen.getByText("BEST VALUE")).toBeDefined();
    expect(
      screen.getByRole("article", { name: "Full Routine" }).textContent
    ).toContain("BEST VALUE");
  });

  it("renders the build-your-own and how-it-works sections with a build link", async () => {
    await renderList();
    expect(
      screen.getByRole("heading", { name: "Build your own kit" })
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Build your box" }).getAttribute("href")
    ).toBe("/human/build-your-box");
    expect(
      screen.getByRole("heading", { name: "How kits work" })
    ).toBeDefined();
    expect(screen.getByText("60 Day guarantee")).toBeDefined();
  });

  it("does not leave placeholders, example markers or dollar placeholders in the text", async () => {
    await renderList();
    expect(document.body.textContent ?? "").not.toMatch(PLACEHOLDERS);
  });
});

describe("W2-07 Route: Kit detail (`/human/kits/[slug]`)", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("exports metadata for the kit", async () => {
    const meta = await kitMetadata({
      params: Promise.resolve({ slug: "energy-duo" }),
    });
    expect(meta.title).toBe("Energy Duo | Nadeon Labs");
    expect(meta.alternates?.canonical).toBe(
      "https://nadeonlabs.com/human/kits/energy-duo"
    );
  });

  it("renders the kit name, included formulas as links and the add button", async () => {
    await renderKit("energy-duo");
    expect(
      screen.getByRole("heading", { level: 1, name: "Energy Duo" })
    ).toBeDefined();
    const included = screen.getByRole("list", { name: "Included formulas" });
    const links = within(included).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/human/products/biohack",
      "/human/products/renew",
    ]);
    expect(
      screen.getByRole("button", { name: "Add kit to cart" })
    ).toBeDefined();
  });

  it("calls notFound for an unknown slug or a pet kit", async () => {
    await expect(
      HumanKitPage({ params: Promise.resolve({ slug: "missing-kit" }) })
    ).rejects.toThrow();
    await expect(
      HumanKitPage({ params: Promise.resolve({ slug: "chew-oil" }) })
    ).rejects.toThrow();
  });
});

describe("W2-07 kit view model", () => {
  it("computes savings, best value and average savings from catalog data", async () => {
    const kits = await catalogProvider.getKits("human");
    const products = await catalogProvider.getProducts({ line: "human" });
    const views = buildKitViews(kits, products);
    expect(views.filter((v) => v.isBestValue).map((v) => v.slug)).toEqual([
      "full-routine",
    ]);
    expect(averageSavingsPercent(views)).toBe(15);
    expect(views.every((v) => v.canAddToCart)).toBe(true);
  });

  it("returns null average when no kit has a compare-at price", () => {
    expect(averageSavingsPercent([])).toBeNull();
  });
});
