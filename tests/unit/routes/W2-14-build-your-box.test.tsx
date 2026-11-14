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

const addLines = vi.hoisted(() => vi.fn());
const openCartDrawer = vi.hoisted(() => vi.fn());

vi.mock("@/lib/providers/client", () => ({
  cartProvider: { addLines },
}));
vi.mock("@/components/commerce/cart-drawer", () => ({ openCartDrawer }));

import BuildYourBoxPage, {
  metadata,
} from "@/app/(pet)/pet/build-your-box/page";
import { BoxBuilder } from "@/app/(pet)/pet/build-your-box/_components/box-builder";
import {
  boxTotals,
  buildBoxLines,
  isIntervalAvailable,
  planFor,
  oneJarVariant,
  doseGuide,
} from "@/app/(pet)/pet/build-your-box/_components/box-helpers";
import { STANDARD_WEIGHT_BANDS } from "@/lib/dosing/bands";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { mockSubscriptionProvider } from "@/lib/providers/mock/subscription";
import type { Product } from "@/lib/contracts/catalog";

const BAND_21_TO_50 = STANDARD_WEIGHT_BANDS[1];

async function loadPetProducts(): Promise<Product[]> {
  return mockCatalogProvider.getProducts({ line: "pet" });
}

async function renderPage() {
  const products = await loadPetProducts();
  const capabilities = await mockSubscriptionProvider.capabilities();
  const intervals = [...capabilities.allowedIntervalDays].sort((a, b) => a - b);
  const el = await BuildYourBoxPage();
  return { products, intervals, ...render(el) };
}

describe("W2-14: pure box helpers", () => {
  let products: Product[];

  beforeEach(async () => {
    products = await loadPetProducts();
  });

  it("prices a dog formula at 15% off for the 30-day plan", () => {
    const moreGoodYears = products.find((p) => p.slug === "more-good-years")!;
    const [line] = buildBoxLines([moreGoodYears], 30, BAND_21_TO_50);
    expect(line.list).toEqual({ amount: 44, currencyCode: "USD" });
    expect(line.subscription.amount).toBe(37.4);
    expect(line.sellingPlanId).toBe("plan_more_good_years_30d");
    expect(line.variantId).toBe("var_more_good_years_1");
  });

  it("totals two formulas with savings and keeps the currency code", () => {
    const pair = ["more-good-years", "more-good-years-oil"].map((slug) =>
      products.find((p) => p.slug === slug)!
    );
    const totals = boxTotals(buildBoxLines(pair, 30, BAND_21_TO_50))!;
    expect(totals.subtotal).toEqual({ amount: 88, currencyCode: "USD" });
    expect(totals.savings.amount).toBe(13.2);
    expect(totals.total.amount).toBe(74.8);
    expect(totals.discountPercentage).toBe(15);
  });

  it("returns no totals for an empty box instead of a currency fallback", () => {
    expect(boxTotals([])).toBeNull();
  });

  it("takes the dose from dosingByWeight and leaves it empty for cats and horses", () => {
    const dog = products.find((p) => p.slug === "more-good-years")!;
    const cat = products.find((p) => p.slug === "high-jump")!;
    expect(buildBoxLines([dog], 30, BAND_21_TO_50)[0].dose).toBe(
      "2 chews daily"
    );
    expect(buildBoxLines([cat], 30, BAND_21_TO_50)[0].dose).toBeNull();
  });

  it("builds the serving guide from dosingByWeight, one row per weight band", () => {
    const guide = doseGuide(products);
    const chews = guide.find((g) => g.format === "Soft chews");
    expect(chews).toBeDefined();
    expect(chews!.ranges.map((r) => r.label)).toEqual(
      STANDARD_WEIGHT_BANDS.map((b) => b.labelLbs)
    );
    expect(chews!.ranges.find((r) => r.label === "21 to 50 lbs")?.dose).toBe(
      "2 chews daily"
    );
    expect(guide.some((g) => g.format === "Oils")).toBe(true);
    expect(guide.every((g) => g.ranges.every((r) => r.dose !== null))).toBe(
      true
    );
  });

  it("renders the dose FAQ answer from catalog data, not fixed numbers", async () => {
    await renderPage();
    fireEvent.click(screen.getByText("How do you work out the dose?"));
    expect(screen.getByText("Up to 20 lbs: 1 chew daily")).toBeTruthy();
    expect(screen.getByText("Over 90 lbs: 4 chews daily")).toBeTruthy();
  });

  it("disables a frequency only when a picked product has no plan for it", () => {
    const dog = products.find((p) => p.slug === "more-good-years")!;
    expect(isIntervalAvailable([], 120)).toBe(true);
    expect(isIntervalAvailable([dog], 30)).toBe(true);
    expect(isIntervalAvailable([dog], 120)).toBe(false);
    expect(planFor(dog, 180)).toBeUndefined();
    expect(oneJarVariant(dog)?.jars).toBe(1);
  });
});

// Full-page role queries are slow when the suite runs in parallel workers.
describe("W2-14: /pet/build-your-box route", { timeout: 30000 }, () => {
  beforeEach(() => {
    addLines.mockReset();
    addLines.mockResolvedValue({});
    openCartDrawer.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("exports metadata built with the shared SEO helper", () => {
    expect(metadata.title).toBe("Build your box - Nadeon Pet");
    expect(metadata.alternates?.canonical).toBeDefined();
  });

  it("renders the design headings, stepper and breadcrumb", async () => {
    await renderPage();
    expect(
      screen.getByRole("heading", { level: 1, name: "Build their box" })
    ).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 2, name: "Tell us about your pet" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 2, name: "Review your box" })
    ).toBeTruthy();
  });

  it("covers the catalog fields: pet name, species, weight, age", async () => {
    await renderPage();
    expect(screen.getByRole("textbox", { name: "Pet name" })).toBeTruthy();
    const species = screen.getByRole("group", { name: "Species" });
    expect(species.tagName).toBe("FIELDSET");
    for (const label of ["Dog", "Cat", "Horse"]) {
      expect(screen.getByRole("radio", { name: label })).toBeTruthy();
    }
    expect(screen.getByRole("group", { name: "Weight" }).tagName).toBe(
      "FIELDSET"
    );
    expect(screen.getByRole("radio", { name: /21 to 50 lbs/ })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Age" }).tagName).toBe("FIELDSET");
    for (const label of ["Puppy", "Adult", "Senior"]) {
      expect(
        screen.getByRole("radio", { name: new RegExp(label) })
      ).toBeTruthy();
    }
  });

  it("covers the catalog formula buttons: Add, Added and Remove", async () => {
    await renderPage();
    const add = screen.getByRole("button", { name: "Add More Good Years" });
    expect(add.tagName).toBe("BUTTON");
    expect(add.getAttribute("type")).toBe("button");
    fireEvent.click(add);
    expect(screen.getByText("Added")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Remove More Good Years" })
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: "Remove More Good Years" })
    );
    expect(
      screen.queryByRole("button", { name: "Remove More Good Years" })
    ).toBeNull();
  });

  it("covers the frequency options from 30 to 180 days", async () => {
    await renderPage();
    for (const days of [30, 60, 90, 120, 180]) {
      expect(
        screen.getByRole("radio", { name: new RegExp(`${days} days`) })
      ).toBeTruthy();
    }
    expect(
      screen.getByRole("group", { name: "Choose your frequency" })
    ).toBeTruthy();
  });

  it("disables 120 and 180 days once a formula without those plans is picked", async () => {
    await renderPage();
    fireEvent.click(
      screen.getByRole("button", { name: "Add More Good Years" })
    );
    expect(
      (screen.getByRole("radio", { name: /120 days/ }) as HTMLInputElement)
        .disabled
    ).toBe(true);
    expect(
      (screen.getByRole("radio", { name: /30 days/ }) as HTMLInputElement)
        .disabled
    ).toBe(false);
  });

  it("covers the review buttons and the total for the picked box", async () => {
    await renderPage();
    const start = screen.getByRole("button", { name: "Start my subscription" });
    expect(start.tagName).toBe("BUTTON");
    expect((start as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(
      screen.getByRole("button", { name: "Add More Good Years" })
    );
    expect((start as HTMLButtonElement).disabled).toBe(false);
    expect(
      screen.getByRole("button", { name: "+ Add another pet" })
    ).toBeTruthy();
  });

  it("sends the picked lines to the cart with their selling plans and opens the drawer", async () => {
    await renderPage();
    fireEvent.click(
      screen.getByRole("button", { name: "Add More Good Years" })
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Start my subscription" })
    );
    await waitFor(() => expect(openCartDrawer).toHaveBeenCalledTimes(1));
    expect(addLines).toHaveBeenCalledWith([
      {
        variantId: "var_more_good_years_1",
        quantity: 1,
        sellingPlanId: "plan_more_good_years_30d",
      },
    ]);
  });

  it("resets the pet step with the add another pet button", async () => {
    await renderPage();
    fireEvent.click(
      screen.getByRole("button", { name: "Add More Good Years" })
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Add another pet" }));
    expect(
      screen.queryByRole("button", { name: "Remove More Good Years" })
    ).toBeNull();
  });

  it("clears the picked formulas when the species changes", async () => {
    await renderPage();
    fireEvent.click(
      screen.getByRole("button", { name: "Add More Good Years" })
    );
    fireEvent.click(screen.getByRole("radio", { name: "Cat" }));
    expect(
      screen.queryByRole("button", { name: "Remove More Good Years" })
    ).toBeNull();
    expect(screen.getByRole("button", { name: "Add High Jump" })).toBeTruthy();
  });

  it("renders the Pet regulatory notice", async () => {
    await renderPage();
    expect(
      screen.getByRole("complementary", { name: "Pet regulatory information" })
        .textContent
    ).toContain("For animal use only");
  });

  it("uses the product list from the catalog provider, not inline data", async () => {
    const products = await loadPetProducts();
    const dogs = products.filter((p) => p.species === "dog");
    render(
      <BoxBuilder
        products={products}
        intervals={[30, 60, 90, 120, 180]}
        savePercentage={15}
        doseGuide={doseGuide(products)}
      />
    );
    expect(screen.getAllByRole("button", { name: /^Add / })).toHaveLength(
      dogs.length
    );
    expect(
      screen.getByText(`Showing ${dogs.length} formulas for dogs.`, {
        exact: false,
      })
    ).toBeTruthy();
  });
});
