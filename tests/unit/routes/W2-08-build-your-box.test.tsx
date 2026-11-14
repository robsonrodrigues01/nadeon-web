// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  within,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import BuildYourBoxPage, {
  generateMetadata,
} from "@/app/(human)/human/build-your-box/page";
import { BoxBuilder } from "@/app/(human)/human/build-your-box/_components/box-builder";
import {
  boxTotals,
  formatCents,
  frequencyOptions,
} from "@/app/(human)/human/build-your-box/_components/box-math";
import { startBoxSubscription } from "@/app/(human)/human/build-your-box/_components/actions";
import type { BoxProduct } from "@/app/(human)/human/build-your-box/_components/types";
import { cartProvider, catalogProvider } from "@/lib/providers";

const PRODUCTS: BoxProduct[] = [
  {
    slug: "biohack",
    name: "BioHack",
    technicalName: "NMN 500 mg",
    format: "Capsules",
    color: "#1A0A2C",
    currencyCode: "USD",
    listPrice: 59,
    plans: [
      { intervalDays: 30, discountPercentage: 15 },
      { intervalDays: 60, discountPercentage: 15 },
      { intervalDays: 90, discountPercentage: 15 },
    ],
  },
  {
    slug: "renew",
    name: "Renew",
    technicalName: "NAD+ + Resveratrol",
    format: "Capsules",
    color: "#2E0716",
    currencyCode: "USD",
    listPrice: 65,
    plans: [
      { intervalDays: 30, discountPercentage: 15 },
      { intervalDays: 60, discountPercentage: 15 },
      { intervalDays: 90, discountPercentage: 15 },
    ],
  },
  {
    slug: "prime",
    name: "Prime",
    technicalName: "Pure NAD+ powder",
    format: "Powders",
    color: "#06241A",
    currencyCode: "USD",
    listPrice: 49,
    plans: [
      { intervalDays: 30, discountPercentage: 15 },
      { intervalDays: 60, discountPercentage: 15 },
    ],
  },
];

const FREQUENCIES = [30, 60, 90];

function renderBuilder() {
  return render(
    <BoxBuilder
      products={PRODUCTS}
      frequencies={FREQUENCIES}
      preselectedSlugs={["biohack", "renew"]}
    />
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe("W2-08: /human/build-your-box math and formatting", () => {
  it("computes list, subscription and savings in integer cents", () => {
    const lines = [
      { product: PRODUCTS[0], quantity: 2 },
      { product: PRODUCTS[1], quantity: 2 },
    ];
    const totals = boxTotals(lines, 60);
    expect(totals.listCents).toBe(24800);
    expect(totals.subscriptionCents).toBe(21080);
    expect(totals.savingsCents).toBe(3720);
  });

  it("formats money with the currency from the catalog, never a fixed one", () => {
    expect(formatCents(21080, "USD")).toBe("$210.80");
    expect(formatCents(21080, "EUR", "de-DE")).toContain("€");
  });

  it("offers only frequencies every product sells and the subscription allows", () => {
    expect(frequencyOptions(PRODUCTS, [30, 60, 90, 120, 180])).toEqual([
      30, 60,
    ]);
  });
});

describe("W2-08: /human/build-your-box route", () => {
  it("generates metadata through lib/seo", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toContain("Build your box");
    expect(metadata.title).toContain("Nadeon");
    expect(metadata.description).toContain("Pick your formulas");
  });

  it("renders the page from mock providers with breadcrumb, h1 and JSON-LD", async () => {
    const page = await BuildYourBoxPage();
    const { container } = render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: "Build your box" })
    ).toBeTruthy();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Home" })).toBeTruthy();
    expect(
      container.querySelector("#build-your-box-structured-data")?.textContent
    ).toContain("BreadcrumbList");
    expect(
      screen.getByRole("heading", { name: "Choose your formulas" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Review your box" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Subscription questions" })
    ).toBeTruthy();
  });

  it("uses the human catalog for formula cards, with no placeholder text", async () => {
    const page = await BuildYourBoxPage();
    const { container } = render(page);
    const visible = container.cloneNode(true) as HTMLElement;
    visible.querySelectorAll("script").forEach((node) => node.remove());
    const text = visible.textContent ?? "";
    expect(text).not.toContain("[");
    expect(text).not.toContain("$XX");
    expect(text).not.toContain("(example)");
    const mockProducts = await catalogProvider.getProducts({ line: "human" });
    for (const product of mockProducts) {
      expect(screen.getByRole("heading", { name: product.name })).toBeTruthy();
    }
  });
});

describe("W2-08: /human/build-your-box controls (catalog section 5.2)", () => {
  it("preselects the design state: two formulas added, with Added and Remove buttons", () => {
    renderBuilder();
    expect(
      screen.getByRole("button", {
        name: "BioHack added to box, press to remove",
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Renew added to box, press to remove",
      })
    ).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(2);
  });

  it("'+ Add' adds a formula with the default quantity for the frequency", () => {
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: "Add Prime" }));
    expect(
      screen.getByRole("button", {
        name: "Prime added to box, press to remove",
      })
    ).toBeTruthy();
    const group = screen.getByRole("group", { name: "Quantity of Prime" });
    expect(
      within(group).getByRole("button", { name: "Increase Prime quantity" })
    ).toBeTruthy();
    expect(within(group).getByText("2")).toBeTruthy();
  });

  it("'✓ Added' and 'Remove' both take a formula out of the box", () => {
    renderBuilder();
    fireEvent.click(
      screen.getByRole("button", {
        name: "BioHack added to box, press to remove",
      })
    );
    expect(screen.getByRole("button", { name: "Add BioHack" })).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[0]);
    expect(screen.getByRole("button", { name: "Add Renew" })).toBeTruthy();
  });

  it("quantity steppers change the line within 1 to 6 jars", () => {
    renderBuilder();
    const group = screen.getByRole("group", { name: "Quantity of BioHack" });
    fireEvent.click(
      within(group).getByRole("button", { name: "Increase BioHack quantity" })
    );
    expect(within(group).getByText("3")).toBeTruthy();
    fireEvent.click(
      within(group).getByRole("button", { name: "Decrease BioHack quantity" })
    );
    fireEvent.click(
      within(group).getByRole("button", { name: "Decrease BioHack quantity" })
    );
    fireEvent.click(
      within(group).getByRole("button", { name: "Decrease BioHack quantity" })
    );
    expect(within(group).getByText("1")).toBeTruthy();
  });

  it("frequency options are radios inside a fieldset with a legend", () => {
    renderBuilder();
    const fieldset = screen.getByRole("group", {
      name: "Choose your frequency",
    });
    expect(fieldset.tagName).toBe("FIELDSET");
    const radios = within(fieldset).getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(screen.getByRole("radio", { name: /60 days/ })).toHaveProperty(
      "checked",
      true
    );
  });

  it("changing frequency resets quantities to the new supply", () => {
    renderBuilder();
    fireEvent.click(screen.getByRole("radio", { name: /30 days/ }));
    const group = screen.getByRole("group", { name: "Quantity of BioHack" });
    expect(within(group).getByText("1")).toBeTruthy();
  });

  it("'Start my subscription' is a button, disabled with nothing selected", () => {
    renderBuilder();
    const start = screen.getByRole("button", { name: "Start my subscription" });
    expect(start.tagName).toBe("BUTTON");
    expect(start).toHaveProperty("disabled", false);
    fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(
      screen.getByRole("button", { name: "Start my subscription" })
    ).toHaveProperty("disabled", true);
  });

  it("the FAQ item is a native disclosure with its answer", async () => {
    const page = await BuildYourBoxPage();
    render(page);
    const summary = screen
      .getByText("Can I change my formulas later?")
      .closest("summary");
    expect(summary).toBeTruthy();
    expect(summary?.closest("details")).toBeTruthy();
    expect(
      screen.getByText(/Add, remove or swap formulas from your account/)
    ).toBeTruthy();
  });
});

describe("W2-08: startBoxSubscription server action", () => {
  it("rejects malformed input", async () => {
    const result = await startBoxSubscription({ intervalDays: 60, items: [] });
    expect(result.ok).toBe(false);
  });

  it("rejects a slug that is not in the human catalog", async () => {
    const result = await startBoxSubscription({
      intervalDays: 60,
      items: [{ slug: "does-not-exist", quantity: 1 }],
    });
    expect(result.ok).toBe(false);
  });

  it("resolves variant and selling plan on the server and adds the lines", async () => {
    const addLines = vi
      .spyOn(cartProvider, "addLines")
      .mockResolvedValue({} as never);
    const result = await startBoxSubscription({
      intervalDays: 60,
      items: [{ slug: "biohack", quantity: 2 }],
    });
    expect(result).toEqual({ ok: true, lineCount: 1 });
    const products = await catalogProvider.getProducts({ line: "human" });
    const biohack = products.find((p) => p.slug === "biohack")!;
    expect(addLines).toHaveBeenCalledWith([
      {
        variantId: biohack.variants.find((v) => v.jars === 1)!.id,
        quantity: 2,
        sellingPlanId: biohack.sellingPlans.find((p) => p.intervalDays === 60)!
          .id,
      },
    ]);
  });
});
