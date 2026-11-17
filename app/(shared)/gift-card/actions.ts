"use server";

import { GiftCardPurchaseInputSchema } from "@/lib/contracts/gift-card";
import { giftCardProvider } from "@/lib/providers";

export async function prepareGiftCardPurchase(input: unknown) {
  const parsed = GiftCardPurchaseInputSchema.parse(input);
  return giftCardProvider.preparePurchase(parsed);
}
