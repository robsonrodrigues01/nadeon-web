import type { Kit, Money, Product } from "@/lib/contracts/catalog";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { getDefaultMarket } from "@/lib/market/markets";

// Badge text is design copy keyed by kit slug; discount values are derived from catalog prices.
const KIT_TAG_BADGES: Readonly<Record<string, string>> = {
  "chew-good-days": "PET PARENT PICK",
  "cat-care": "FOR CATS",
};

export interface KitProductView {
  slug: string;
  name: string;
  detail: string;
}

export interface KitView {
  slug: string;
  name: string;
  description: string;
  productCount: number;
  productNames: string;
  products: KitProductView[];
  badge: string | null;
  price: string;
  compareAtPrice: string | null;
  savings: string | null;
}

/** Formats a catalog Money in the market currency and locale (Rule 14). */
export function formatKitMoney(money: Money): string {
  return formatMoneyWithMarket(money, getDefaultMarket());
}

/** Percentage saved against compare-at prices, rounded; null when no kit has a compare-at price. */
export function kitSavingsPercent(kit: Kit): number | null {
  if (!kit.compareAtPrice || kit.compareAtPrice.amount <= 0) return null;
  const saved = kit.compareAtPrice.amount - kit.price.amount;
  if (saved <= 0) return null;
  return Math.round((saved / kit.compareAtPrice.amount) * 100);
}

/** Weighted savings percentage across kits with compare-at prices, for copy that quotes one average. */
export function averageKitSavingsPercent(kits: readonly Kit[]): number | null {
  let saved = 0;
  let compare = 0;
  for (const kit of kits) {
    if (!kit.compareAtPrice) continue;
    saved += kit.compareAtPrice.amount - kit.price.amount;
    compare += kit.compareAtPrice.amount;
  }
  if (compare <= 0 || saved <= 0) return null;
  return Math.round((saved / compare) * 100);
}

/** Builds the serializable view a kit card needs. Products missing from the catalog are dropped. */
export function buildKitView(
  kit: Kit,
  productsBySlug: ReadonlyMap<string, Product>
): KitView {
  const products: KitProductView[] = [];
  for (const ref of kit.products) {
    const product = productsBySlug.get(ref.productSlug);
    if (product) {
      products.push({
        slug: product.slug,
        name: product.name,
        detail: product.technicalName,
      });
    }
  }

  const savingsAmount = kit.compareAtPrice
    ? kit.compareAtPrice.amount - kit.price.amount
    : null;
  const percent = kitSavingsPercent(kit);

  return {
    slug: kit.slug,
    name: kit.name,
    description: kit.description,
    productCount: kit.products.reduce((sum, ref) => sum + ref.quantity, 0),
    productNames: products.map((p) => p.name).join(" + "),
    products,
    badge:
      KIT_TAG_BADGES[kit.slug] ??
      (percent !== null ? `SAVE ${percent}%` : null),
    price: formatKitMoney(kit.price),
    compareAtPrice: kit.compareAtPrice
      ? formatKitMoney(kit.compareAtPrice)
      : null,
    savings:
      savingsAmount !== null && savingsAmount > 0
        ? formatKitMoney({
            amount: savingsAmount,
            currencyCode: kit.price.currencyCode,
          })
        : null,
  };
}
