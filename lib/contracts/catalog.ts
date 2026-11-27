import { z } from "zod";

export const MoneySchema = z.object({
  amount: z.number(),
  currencyCode: z.string().default("USD"),
});
export type Money = z.infer<typeof MoneySchema>;

export const ProductLineSchema = z.enum(["human", "pet"]);
export type ProductLine = z.infer<typeof ProductLineSchema>;

export const SpeciesSchema = z.enum(["dog", "cat", "horse"]).nullable();
export type Species = z.infer<typeof SpeciesSchema>;

export const ProductVariantSchema = z.object({
  id: z.string(),
  jars: z.number().int().min(1).max(3),
  title: z.string(),
  price: MoneySchema,
  compareAtPrice: MoneySchema.optional(),
  sku: z.string().optional(),
});
export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const SellingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  intervalDays: z.number().int().positive(),
  discountPercentage: z.number().min(0).max(100),
});
export type SellingPlan = z.infer<typeof SellingPlanSchema>;

export const ActiveIngredientSchema = z.object({
  name: z.string(),
  amount: z.string(),
});
export type ActiveIngredient = z.infer<typeof ActiveIngredientSchema>;

export const ClaimSchema = z.object({
  text: z.string(),
  isClaim: z.boolean(),
});
export type Claim = z.infer<typeof ClaimSchema>;

export const DosingRangeSchema = z.object({
  minWeightLbs: z.number().nonnegative(),
  maxWeightLbs: z.number().positive().nullable(),
  dose: z.string(),
  servingDescription: z.string(),
});
export type DosingRange = z.infer<typeof DosingRangeSchema>;

export const ProductFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export type ProductFaq = z.infer<typeof ProductFaqSchema>;

export const ProductSchema = z.object({
  slug: z.string(),
  handle: z.string(),
  name: z.string(),
  technicalName: z.string(),
  line: ProductLineSchema,
  species: SpeciesSchema,
  format: z.string(),
  color: z.string(),
  images: z.array(z.string()),
  actives: z.array(ActiveIngredientSchema),
  serving: z.string().optional(),
  servingsPerJar: z.number().int().positive().optional(),
  netWeight: z.string().optional(),
  variants: z.array(ProductVariantSchema),
  sellingPlans: z.array(SellingPlanSchema),
  benefits: z.array(z.string()),
  howToUse: z.string(),
  faq: z.array(ProductFaqSchema),
  related: z.array(z.string()),
  claims: z.array(ClaimSchema),
  dosingByWeight: z.array(DosingRangeSchema),
});
export type Product = z.infer<typeof ProductSchema>;

export const KitProductRefSchema = z.object({
  productSlug: z.string(),
  quantity: z.number().int().positive(),
});
export type KitProductRef = z.infer<typeof KitProductRefSchema>;

export const KitSchema = z.object({
  slug: z.string(),
  handle: z.string(),
  name: z.string(),
  line: ProductLineSchema,
  description: z.string(),
  products: z.array(KitProductRefSchema),
  price: MoneySchema,
  compareAtPrice: MoneySchema.optional(),
  images: z.array(z.string()),
});
export type Kit = z.infer<typeof KitSchema>;

export const CollectionSchema = z.object({
  handle: z.string(),
  title: z.string(),
  description: z.string().optional(),
  products: z.array(ProductSchema),
});
export type Collection = z.infer<typeof CollectionSchema>;

export const CatalogFilterSchema = z.object({
  line: ProductLineSchema.optional(),
  species: z.enum(["dog", "cat", "horse"]).optional(),
  format: z.string().optional(),
});
export type CatalogFilter = z.infer<typeof CatalogFilterSchema>;

export const CatalogSortSchema = z.enum([
  "featured",
  "price-asc",
  "price-desc",
  "best-selling",
  "title-asc",
]);
export type CatalogSort = z.infer<typeof CatalogSortSchema>;

export interface CatalogProvider {
  getProducts(filter?: CatalogFilter): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getCollection(
    handle: string,
    filter?: CatalogFilter,
    sort?: CatalogSort
  ): Promise<Collection | null>;
  getKits(line?: ProductLine): Promise<Kit[]>;
  getKit(slug: string): Promise<Kit | null>;
  search(q: string): Promise<Product[]>;
}
