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
 * Derives the subscription discount percentage from a list of products.
 * Returns the first valid positive discount found, or fallback.
 */
export function getSubscriptionDiscountPercentage(
  products: Product[],
  fallback = 15
): number {
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
  return fallback;
}

/**
 * Derives the subscription discount percentage for a single product.
 * Looks for the 30-day plan first, or defaults to the first plan in product.sellingPlans.
 */
export function getProductSubscriptionDiscount(
  product: Product,
  fallback = 15
): number {
  const plans = product.sellingPlans ?? [];
  const plan = plans.find((sp) => sp.intervalDays === 30) ?? plans[0];
  if (plan && typeof plan.discountPercentage === "number") {
    return plan.discountPercentage;
  }
  return fallback;
}
