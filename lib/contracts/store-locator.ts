import { z } from "zod";
import { ProductLineSchema } from "./catalog";

export const StoreSearchSchema = z.object({
  zip: z.string().trim().min(1),
  radiusMiles: z.number().positive(),
  line: z.union([ProductLineSchema, z.literal("all")]).optional(),
});
export type StoreSearch = z.infer<typeof StoreSearchSchema>;

export const StoreLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  zip: z.string(),
  distanceMiles: z.number().nonnegative(),
  lines: z.array(ProductLineSchema),
});
export type StoreLocation = z.infer<typeof StoreLocationSchema>;

export interface StoreLocatorProvider {
  search(input: StoreSearch): Promise<StoreLocation[]>;
}
