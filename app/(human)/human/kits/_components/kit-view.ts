import type { AddCartLineInput } from "@/lib/contracts/cart";
import type { Kit, Money, Product } from "@/lib/contracts/catalog";

export interface KitView {
  slug: string;
  name: string;
  description: string;
  image: string | null;
  itemCount: number;
  itemsLabel: string;
  price: Money;
  compareAtPrice: Money | null;
  savings: Money | null;
  savingsPercent: number;
  isBestValue: boolean;
  cartLines: AddCartLineInput[];
  canAddToCart: boolean;
}

export function formatKitMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(money.amount);
}

/**
 * Turns catalog kits into plain, serializable view models for the UI.
 * shortcut: each formula is added at its first variant's price, so the kit
 * discount is not applied in the cart until CatalogProvider exposes kit variants.
 */
export function buildKitViews(kits: Kit[], products: Product[]): KitView[] {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const savingsOf = (kit: Kit) =>
    kit.compareAtPrice ? kit.compareAtPrice.amount - kit.price.amount : 0;
  const maxSavings = Math.max(0, ...kits.map(savingsOf));
  let bestValueMarked = false;

  return kits.map((kit) => {
    const members = kit.products.map((ref) => ({
      ref,
      product: bySlug.get(ref.productSlug),
    }));
    const cartLines = members.flatMap(({ ref, product }) => {
      const variantId = product?.variants[0]?.id;
      return variantId ? [{ variantId, quantity: ref.quantity }] : [];
    });
    const savingsAmount = savingsOf(kit);
    const isBestValue =
      !bestValueMarked && maxSavings > 0 && savingsAmount === maxSavings;
    if (isBestValue) bestValueMarked = true;

    return {
      slug: kit.slug,
      name: kit.name,
      description: kit.description,
      image: kit.images[0] ?? null,
      itemCount: kit.products.reduce((sum, ref) => sum + ref.quantity, 0),
      itemsLabel: members
        .flatMap(({ product }) =>
          product
            ? [
                product.technicalName
                  ? `${product.name} ${product.technicalName}`
                  : product.name,
              ]
            : []
        )
        .join(" + "),
      price: kit.price,
      compareAtPrice: kit.compareAtPrice ?? null,
      savings:
        savingsAmount > 0
          ? { amount: savingsAmount, currencyCode: kit.price.currencyCode }
          : null,
      savingsPercent: kit.compareAtPrice
        ? Math.round((savingsAmount / kit.compareAtPrice.amount) * 100)
        : 0,
      isBestValue,
      cartLines,
      canAddToCart: cartLines.length === members.length && cartLines.length > 0,
    };
  });
}

/** Mean savings across kits that have a compare-at price; null when none do. */
export function averageSavingsPercent(kits: KitView[]): number | null {
  const withSavings = kits.filter((k) => k.savingsPercent > 0);
  if (withSavings.length === 0) return null;
  const total = withSavings.reduce((sum, k) => sum + k.savingsPercent, 0);
  return Math.round(total / withSavings.length);
}
