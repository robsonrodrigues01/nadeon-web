import type { Product, SellingPlan } from "@/lib/contracts/catalog";

/** Returns one plan per interval, ordered from shortest to longest. */
export function getUniqueSellingPlans(products: Product[]): SellingPlan[] {
  const plansByInterval = new Map<number, SellingPlan>();
  for (const product of products) {
    for (const plan of product.sellingPlans ?? []) {
      if (!plansByInterval.has(plan.intervalDays)) {
        plansByInterval.set(plan.intervalDays, plan);
      }
    }
  }
  return Array.from(plansByInterval.values()).sort(
    (a, b) => a.intervalDays - b.intervalDays
  );
}

/** Returns the first positive subscription discount across the products. */
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

/** Prefers the 30-day plan discount, then the first configured plan. */
export function getProductSubscriptionDiscount(
  product: Product
): number | null {
  const plans = product.sellingPlans ?? [];
  const plan =
    plans.find((candidate) => candidate.intervalDays === 30) ?? plans[0];
  if (
    plan &&
    typeof plan.discountPercentage === "number" &&
    plan.discountPercentage > 0
  ) {
    return plan.discountPercentage;
  }
  return null;
}
