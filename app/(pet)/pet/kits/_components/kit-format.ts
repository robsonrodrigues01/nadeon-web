import type { Kit, Money, Product } from "@/lib/contracts/catalog";
import { convertAmount, formatMoneyWithMarket } from "@/lib/market/formatter";
import type { Market } from "@/lib/market/types";

export interface KitProductView {
  slug: string;
  name: string;
  detail: string;
}

export interface KitView {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  productNames: string;
  products: KitProductView[];
  badge: string | null;
  price: string;
  compareAtPrice: string | null;
  savings: string | null;
}

/** Formats a catalog Money in the visitor's market currency and locale (Rule 14). */
export function formatKitMoney(money: Money, market: Market): string {
  return formatMoneyWithMarket(money, market);
}

/** Price in the market currency, converted the same way formatKitMoney formats it (for JSON-LD). */
export function marketOffer(money: Money, market: Market): Money {
  const needsConversion =
    money.currencyCode === "USD" && market.currency.code !== "USD";
  return needsConversion
    ? {
        amount: convertAmount(
          money.amount,
          market.rate,
          market.currency.fractionDigits
        ),
        currencyCode: market.currency.code,
      }
    : money;
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
  productsBySlug: ReadonlyMap<string, Product>,
  market: Market
): KitView {
  const products: KitProductView[] = [];
  const kitProducts: Product[] = [];
  for (const ref of kit.products) {
    const product = productsBySlug.get(ref.productSlug);
    if (product) {
      kitProducts.push(product);
      products.push({
        slug: product.slug,
        name: product.name,
        detail: product.technicalName,
      });
    }
  }
  // Badge comes from product data (species), never from a per-slug table.
  const forCats =
    kitProducts.length > 0 && kitProducts.every((p) => p.species === "cat");

  const savingsAmount = kit.compareAtPrice
    ? kit.compareAtPrice.amount - kit.price.amount
    : null;
  const percent = kitSavingsPercent(kit);

  return {
    slug: kit.slug,
    name: kit.name,
    description: kit.description,
    image:
      kitProducts.find((product) => product.images[0])?.images[0] ||
      "/renders/placeholder.svg",
    productCount: kit.products.reduce((sum, ref) => sum + ref.quantity, 0),
    productNames: products.map((p) => p.name).join(" + "),
    products,
    badge: forCats ? "FOR CATS" : percent !== null ? `SAVE ${percent}%` : null,
    price: formatKitMoney(kit.price, market),
    compareAtPrice: kit.compareAtPrice
      ? formatKitMoney(kit.compareAtPrice, market)
      : null,
    savings:
      savingsAmount !== null && savingsAmount > 0
        ? formatKitMoney(
            {
              amount: savingsAmount,
              currencyCode: kit.price.currencyCode,
            },
            market
          )
        : null,
  };
}
