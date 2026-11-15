import type { Product, SellingPlan } from "@/lib/contracts/catalog";

/**
 * Returns unique selling plans across products, deduplicated by intervalDays
 * and sorted in ascending order.
 */
export function getUniqueSellingPlans(products: Product[]): SellingPlan[] {
  const map = new Map<number, SellingPlan>();
  for (const product of products) {
    for (const plan of product.sellingPlans ?? []) {
      if (!map.has(plan.intervalDays)) {
        map.set(plan.intervalDays, plan);
      }
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => a.intervalDays - b.intervalDays
  );
}

/**
 * Derives unique interval days from selling plans across products in ascending order.
 * Returns empty array when no plans are present.
 */
export function getSubscriptionIntervals(products: Product[]): number[] {
  const intervals = new Set<number>();
  for (const product of products) {
    for (const plan of product.sellingPlans ?? []) {
      if (typeof plan.intervalDays === "number" && plan.intervalDays > 0) {
        intervals.add(plan.intervalDays);
      }
    }
  }
  return Array.from(intervals).sort((a, b) => a - b);
}

/**
 * Derives the subscription discount percentage from a list of products.
 * Returns the first valid positive discount found, or null when none is present.
 */
export function getSubscriptionDiscountPercentage(
  products: Product[]
): number | null {
  for (const product of products) {
    for (const plan of product.sellingPlans ?? []) {
      if (
        typeof plan.discountPercentage === "number" &&
        plan.discountPercentage > 0
      ) {
        return plan.discountPercentage;
      }
    }
  }
  return null;
}

/**
 * Derives the subscription discount percentage for a single product.
 * Looks for the 30-day plan first, or defaults to the first plan in product.sellingPlans.
 * Returns null when no positive discount is configured.
 */
export function getProductSubscriptionDiscount(
  product: Product
): number | null {
  const plans = product.sellingPlans ?? [];
  const plan = plans.find((sp) => sp.intervalDays === 30) ?? plans[0];
  if (
    plan &&
    typeof plan.discountPercentage === "number" &&
    plan.discountPercentage > 0
  ) {
    return plan.discountPercentage;
  }
  return null;
}

/**
 * Formats intervals array as readable text (e.g., "30, 60 or 90 days").
 * Returns null when intervals is empty (no fixed fallback).
 */
export function formatIntervalsText(intervals: number[]): string | null {
  if (!intervals || intervals.length === 0) return null;
  if (intervals.length === 1) return `${intervals[0]} days`;
  const leading = intervals.slice(0, -1).join(", ");
  const last = intervals[intervals.length - 1];
  return `${leading} or ${last} days`;
}
