import type { Money, Product } from "@/lib/contracts/catalog";
import type { Cart } from "@/lib/providers/client";

// Subconjunto serializável do produto que o cliente precisa (preço de lista,
// planos de assinatura e textos de linha). Evita mandar o produto inteiro.
export interface CartCatalogProduct {
  slug: string;
  handle: string;
  name: string;
  technicalName: string;
  format: string;
  servingsPerJar: number;
  image?: string;
  variants: { id: string; price: Money }[];
  sellingPlans: {
    id: string;
    name: string;
    intervalDays: number;
    discountPercentage: number;
  }[];
}

export function toCartCatalogProduct(product: Product): CartCatalogProduct {
  return {
    slug: product.slug,
    handle: product.handle,
    name: product.name,
    technicalName: product.technicalName,
    format: product.format,
    servingsPerJar: product.servingsPerJar,
    image: product.images[0],
    variants: product.variants.map((v) => ({ id: v.id, price: v.price })),
    sellingPlans: product.sellingPlans.map((p) => ({
      id: p.id,
      name: p.name,
      intervalDays: p.intervalDays,
      discountPercentage: p.discountPercentage,
    })),
  };
}

export type RunCartAction = (action: () => Promise<Cart>) => Promise<void>;
