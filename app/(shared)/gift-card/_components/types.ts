import type { GiftCardProvider } from "@/lib/contracts/gift-card";
import type { Market } from "@/lib/market/types";

export interface GiftCardFormProps {
  provider?: GiftCardProvider;
  market: Market;
}

export interface GiftCardFaqItem {
  question: string;
  answer: string;
}
