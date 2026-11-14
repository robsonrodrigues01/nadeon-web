import type { Money } from "@/lib/contracts/catalog";

export type MarketRegion =
  "North America" | "Europe" | "Asia Pacific" | "Other";

export interface MarketCurrency {
  code: string;
  symbol: string;
  name: string;
  fractionDigits: number;
}

/** Free shipping thresholds per product line, in the market currency. */
export interface FreeShippingThresholds {
  human: number;
  pet: number;
}

export interface Market {
  id: string;
  countryCode: string;
  name: string;
  region: MarketRegion;
  currency: MarketCurrency;
  locale: string;
  rate: number;
  flag: string;
  taxNotice?: string;
  /** null when the market advertises no free shipping. */
  freeShipping: FreeShippingThresholds | null;
}

export interface FormatMoneyOptions {
  locale?: string;
  currency?: string;
  convert?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface MarketContextValue {
  market: Market;
  markets: Market[];
  setMarket: (marketIdOrCode: string) => void;
  formatMoney: (money: Money | number, options?: FormatMoneyOptions) => string;
  formatPrice: (amount: number, options?: FormatMoneyOptions) => string;
}
