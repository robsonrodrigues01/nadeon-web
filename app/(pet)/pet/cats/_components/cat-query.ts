import type { Money } from "@/lib/contracts/catalog";

export type CatSort = "featured" | "best-selling";

export interface CatKitView {
  slug: string;
  name: string;
  description: string;
  productNames: string[];
  formats: string[];
  price: Money;
  compareAtPrice?: Money;
  savePercent: number | null;
  lines: { variantId: string; quantity: number }[];
}

/** Concern is the first segment of technicalName, e.g. "Joints · drops" → "Joints". */
export function concernOf(product: { technicalName: string }): string {
  return product.technicalName.split("·")[0].trim();
}

export function toQueryString(state: {
  concern?: string;
  format?: string;
  sort?: string;
}): string {
  const params = new URLSearchParams();
  if (state.concern) params.set("concern", state.concern);
  if (state.format) params.set("format", state.format);
  if (state.sort && state.sort !== "featured") params.set("sort", state.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function formatPrice(money: Money, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
  }).format(money.amount);
}

export function savePercent(price: Money, compareAt?: Money): number | null {
  if (!compareAt || compareAt.amount <= price.amount) return null;
  return Math.round(
    ((compareAt.amount - price.amount) / compareAt.amount) * 100
  );
}
