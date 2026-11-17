import { z } from "zod";
import { ProductLineSchema } from "./catalog";

export const WholesaleApplicationInputSchema = z.object({
  businessName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  website: z.string().optional(),
  businessType: z.string().min(1),
  state: z.string().min(1),
  locationCount: z.string().min(1),
  resellerPermitOrEin: z.string().min(1),
  estimatedMonthlyOrder: z.string().min(1),
  productLines: z.array(ProductLineSchema).min(1),
  description: z.string().optional(),
  termsAccepted: z.literal(true),
});
export type WholesaleApplicationInput = z.infer<
  typeof WholesaleApplicationInputSchema
>;

export interface WholesaleProvider {
  submit(input: WholesaleApplicationInput): Promise<{ id: string }>;
}
