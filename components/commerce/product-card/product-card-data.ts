import type { Product } from "@/lib/contracts/catalog";

export type ProductCardData = Pick<
  Product,
  "slug" | "name" | "technicalName" | "line" | "species" | "format" | "claims"
> & {
  images: string[];
  variants: Pick<Product["variants"][number], "id" | "price">[];
  sellingPlans: Pick<Product["sellingPlans"][number], "discountPercentage">[];
  benefits: string[];
};

export function toProductCardData(product: Product): ProductCardData {
  return {
    slug: product.slug,
    name: product.name,
    technicalName: product.technicalName,
    line: product.line,
    species: product.species,
    format: product.format,
    images: product.images.slice(0, 1),
    variants: product.variants.slice(0, 1).map(({ id, price }) => ({
      id,
      price,
    })),
    sellingPlans: product.sellingPlans
      .slice(0, 1)
      .map(({ discountPercentage }) => ({ discountPercentage })),
    benefits: product.benefits.slice(0, 1),
    claims: product.claims.filter(({ isClaim }) => isClaim),
  };
}
