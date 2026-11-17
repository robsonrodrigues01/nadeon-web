import {
  GiftCardPurchaseInputSchema,
  type GiftCardDesign,
  type GiftCardProvider,
} from "@/lib/contracts/gift-card";
import type { Money } from "@/lib/contracts/catalog";

export class MockGiftCardProvider implements GiftCardProvider {
  async getAvailableAmounts(_currencyCode: string): Promise<Money[]> {
    void _currencyCode;
    // Board amounts are placeholders; keep unavailable until approved values exist.
    return [];
  }

  async getDesigns(): Promise<GiftCardDesign[]> {
    return ["espresso", "sunset", "cream"];
  }

  async preparePurchase(input: unknown) {
    GiftCardPurchaseInputSchema.parse(input);
    return { id: `gift_TEST_${Math.random().toString(36).slice(2, 9)}` };
  }
}
