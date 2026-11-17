import { z } from "zod";
import { MoneySchema, type Money } from "./catalog";

export const GiftCardDesignSchema = z.enum(["espresso", "sunset", "cream"]);
export type GiftCardDesign = z.infer<typeof GiftCardDesignSchema>;

export function isGiftCardAmountWithinApprovedRange(
  amount: Money,
  approvedAmounts: readonly Money[]
) {
  const approved = approvedAmounts
    .filter((entry) => entry.currencyCode === amount.currencyCode)
    .map((entry) => entry.amount);
  if (approved.length === 0) return false;
  return (
    amount.amount >= Math.min(...approved) &&
    amount.amount <= Math.max(...approved)
  );
}

export const GiftCardPurchaseInputSchema = z.object({
  amount: MoneySchema.extend({ amount: z.number().positive() }),
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
