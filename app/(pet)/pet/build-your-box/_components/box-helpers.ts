import type {
  Money,
  Product,
  ProductVariant,
  SellingPlan,
} from "@/lib/contracts/catalog";
import { getDoseForProduct } from "@/lib/dosing/calculator";
import { STANDARD_WEIGHT_BANDS } from "@/lib/dosing/bands";
import type { PetSpecies, WeightBand } from "@/lib/dosing/types";

export const SPECIES_OPTIONS: {
  value: PetSpecies;
  label: string;
  plural: string;
}[] = [
  { value: "dog", label: "Dog", plural: "dogs" },
  { value: "cat", label: "Cat", plural: "cats" },
  { value: "horse", label: "Horse", plural: "horses" },
];

export const AGE_OPTIONS = [
  { value: "puppy", label: "Puppy", hint: "Under 1 year" },
  { value: "adult", label: "Adult", hint: "1 to 6 years" },
  { value: "senior", label: "Senior", hint: "7+ years" },
] as const;

export type PetAge = (typeof AGE_OPTIONS)[number]["value"];

const FREQUENCY_HINTS: Record<number, string> = {
  30: "Monthly",
  60: "Most flexible",
  90: "Stock up",
  120: "Fewer boxes",
  180: "Twice a year",
};

export function frequencyHint(intervalDays: number): string | undefined {
  return FREQUENCY_HINTS[intervalDays];
}

export function planFor(
  product: Product,
  intervalDays: number
): SellingPlan | undefined {
  return product.sellingPlans.find((s) => s.intervalDays === intervalDays);
}

export function oneJarVariant(product: Product): ProductVariant | undefined {
  return product.variants.find((v) => v.jars === 1);
}

export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export interface BoxLine {
  product: Product;
  variantId: string;
  sellingPlanId: string | null;
  discountPercentage: number;
  list: Money;
  subscription: Money;
  dose: string | null;
}

/** One line per product of the species, priced for the chosen interval. */
export function buildBoxLines(
  products: Product[],
  intervalDays: number,
  band: WeightBand
): BoxLine[] {
  return products.flatMap((product) => {
    const variant = oneJarVariant(product);
    if (!variant) return [];
    const plan = planFor(product, intervalDays);
    const list = variant.price;
    const discount = plan?.discountPercentage ?? 0;
    return [
      {
        product,
        variantId: variant.id,
        sellingPlanId: plan?.id ?? null,
        discountPercentage: discount,
        list,
        subscription: {
          amount: roundMoney(list.amount * (1 - discount / 100)),
          currencyCode: list.currencyCode,
        },
        dose: getDoseForProduct(product, band.minWeightLbs)?.dose ?? null,
      },
    ];
  });
}

/** Totals in the currency of the catalog lines; null when the box is empty (no currency to show). */
export function boxTotals(lines: BoxLine[]) {
  const first = lines[0];
  if (!first) return null;
  const currencyCode = first.list.currencyCode;
  const subtotal = roundMoney(lines.reduce((s, l) => s + l.list.amount, 0));
  const total = roundMoney(
    lines.reduce((s, l) => s + l.subscription.amount, 0)
  );
  const savings = roundMoney(subtotal - total);
  return {
    subtotal: { amount: subtotal, currencyCode },
    total: { amount: total, currencyCode },
    savings: { amount: savings, currencyCode },
    discountPercentage: first.discountPercentage,
  };
}

/** Frequencies are open while no product is picked; afterwards every pick must have a plan. */
export function isIntervalAvailable(
  chosen: Product[],
  intervalDays: number
): boolean {
  return (
    chosen.length === 0 ||
    chosen.every((p) => planFor(p, intervalDays) !== undefined)
  );
}

export interface DoseGuideEntry {
  format: string;
  ranges: { label: string; dose: string | null }[];
}

/** Serving guide built from catalog dosingByWeight: one entry per format, one row per weight band. */
export function doseGuide(products: Product[]): DoseGuideEntry[] {
  const firstByFormat = new Map<string, Product>();
  for (const product of products) {
    if (product.dosingByWeight.length === 0) continue;
    if (!firstByFormat.has(product.format)) {
      firstByFormat.set(product.format, product);
    }
  }
  return [...firstByFormat.values()].map((product) => ({
    format: product.format,
    ranges: STANDARD_WEIGHT_BANDS.map((band) => ({
      label: band.labelLbs,
      dose: getDoseForProduct(product, band.minWeightLbs)?.dose ?? null,
    })),
  }));
}
