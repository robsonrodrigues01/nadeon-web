import type { Kit, Product } from "@/lib/contracts/catalog";

export interface KitCartLine {
  variantId: string;
  quantity: number;
}

// Each kit item maps to the catalog variant whose jar count equals the kit quantity.
// If any item has no matching variant, the kit is not addable: return [] so the button stays disabled.
export function buildKitLines(
  kit: Kit | null | undefined,
  products: Product[]
): KitCartLine[] {
  if (!kit) return [];

  const lines: Array<KitCartLine | null> = kit.products.map((ref) => {
    const product = products.find((p) => p.slug === ref.productSlug);
    const variant = product?.variants.find((v) => v.jars === ref.quantity);
    return variant ? { variantId: variant.id, quantity: 1 } : null;
  });

  return lines.every((line): line is KitCartLine => line !== null) ? lines : [];
}
