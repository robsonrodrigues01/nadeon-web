import type { Product } from "@/lib/contracts/catalog";

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
