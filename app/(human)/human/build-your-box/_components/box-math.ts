import { formatMoneyWithMarket } from "@/lib/market/formatter";
import type { Market } from "@/lib/market/types";
import type { BoxPlan, BoxProduct } from "./types";

export const MAX_JARS_PER_LINE = 6;

/** One jar per 30 days of supply, so a 60-day box ships 2 jars of each formula. */
export function defaultQuantity(intervalDays: number): number {
  return Math.min(
    MAX_JARS_PER_LINE,
    Math.max(1, Math.round(intervalDays / 30))
  );
}

export function planFor(
  product: BoxProduct,
  intervalDays: number
): BoxPlan | undefined {
  return product.plans.find((plan) => plan.intervalDays === intervalDays);
}

/** Frequencies offered: allowed by the subscription provider and sold by every product. */
export function frequencyOptions(
  products: BoxProduct[],
  allowedIntervals: number[]
): number[] {
  return allowedIntervals
    .filter(
      (days) =>
        products.length > 0 &&
        products.every((product) => planFor(product, days) !== undefined)
    )
    .sort((a, b) => a - b);
}

export interface BoxLine {
  product: BoxProduct;
  quantity: number;
}

export interface BoxTotals {
  listCents: number;
  subscriptionCents: number;
  savingsCents: number;
}

/** Integer cents avoid float drift when a discount is applied. */
export function boxTotals(lines: BoxLine[], intervalDays: number): BoxTotals {
  let listCents = 0;
  let subscriptionCents = 0;

  for (const { product, quantity } of lines) {
    const unit = Math.round(product.listPrice * 100);
    const plan = planFor(product, intervalDays);
    const subscriptionUnit = plan
      ? Math.round((unit * (100 - plan.discountPercentage)) / 100)
      : unit;

    listCents += unit * quantity;
    subscriptionCents += subscriptionUnit * quantity;
  }

  return {
    listCents,
    subscriptionCents,
    savingsCents: listCents - subscriptionCents,
  };
}

/** Renders integer cents in the market currency and locale (rule 14). */
export function formatCents(cents: number, market: Market): string {
  return formatMoneyWithMarket(cents / 100, market);
}
