import type { Money } from "@/lib/contracts/catalog";
import type { FormatMoneyOptions, Market } from "./types";
import { DEFAULT_MARKET } from "./markets";

const USD_CURRENCY_CODE = "USD";
const USD_LOCALE = "en-US";

/**
 * Formats a monetary amount in USD with en-US formatting using Intl.NumberFormat.
 * All storefront markets settle in USD (rate 1).
 */
export function formatMarketPrice(
  amount: number,
  _currencyCode: string = USD_CURRENCY_CODE,
  _locale: string = USD_LOCALE,
  options?: Intl.NumberFormatOptions
): string {
  void _currencyCode;
  void _locale;
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(USD_LOCALE, {
    ...options,
    style: "currency",
    currency: USD_CURRENCY_CODE,
  }).format(safeAmount);
}

/**
 * Rounds an amount according to fraction digits (kept for numeric rounding helpers).
 */
export function convertAmount(
  baseUsdAmount: number,
  rate: number,
  fractionDigits: number
): number {
  const raw = baseUsdAmount * rate;
  if (fractionDigits === 0) {
    return Math.round(raw);
  }
  const factor = Math.pow(10, fractionDigits);
  return Math.round(raw * factor) / factor;
}

/**
 * Formats a Money object or a numeric base price in USD with en-US formatting.
 */
export function formatMoneyWithMarket(
  money: Money | number,
  _market: Market = DEFAULT_MARKET,
  options?: FormatMoneyOptions
): string {
  void _market;
  const finalAmount = typeof money === "number" ? money : money.amount;

  return formatMarketPrice(finalAmount, USD_CURRENCY_CODE, USD_LOCALE, {
    minimumFractionDigits: options?.minimumFractionDigits,
    maximumFractionDigits: options?.maximumFractionDigits,
  });
}
