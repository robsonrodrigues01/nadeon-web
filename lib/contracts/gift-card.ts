import { z } from "zod";
import { MoneySchema, type Money } from "./catalog";

export const GiftCardDesignSchema = z.enum(["espresso", "sunset", "cream"]);
export type GiftCardDesign = z.infer<typeof GiftCardDesignSchema>;

export const GiftCardPurchaseInputSchema = z.object({
  amount: MoneySchema,
  design: GiftCardDesignSchema,
  recipientName: z.string().min(1),
  recipientEmail: z.string().email(),
  senderName: z.string().min(1),
  message: z.string().optional(),
  deliveryDate: z.iso.date(),
});
export type GiftCardPurchaseInput = z.infer<typeof GiftCardPurchaseInputSchema>;

export interface GiftCardProvider {
  getAvailableAmounts(currencyCode: string): Promise<Money[]>;
  getDesigns(): Promise<GiftCardDesign[]>;
  preparePurchase(input: GiftCardPurchaseInput): Promise<{ id: string }>;
}
