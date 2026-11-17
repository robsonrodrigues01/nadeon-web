import type { GiftCardProvider } from "@/lib/contracts/gift-card";
import type { Market } from "@/lib/market/types";

export interface GiftCardFormProps {
  provider?: GiftCardProvider;
  market: Market;
}

export const PRESET_AMOUNTS = [25, 50, 100, 200] as const;

export interface GiftCardFaqItem {
  question: string;
  answer: string;
}
