import type { Money } from "@/lib/contracts/catalog";
import type { FormatMoneyOptions, Market } from "./types";
import { DEFAULT_MARKET } from "./markets";

/**
 * Formats a monetary amount with currency code and locale using Intl.NumberFormat.
 * Complies strictly with Rule 7: no raw string concatenation or fixed currency symbols.
 */
export function formatMarketPrice(
  amount: number,
  currencyCode: string,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      ...options,
    }).format(safeAmount);
  } catch {
    // Graceful fallback for unsupported locales
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      ...options,
    }).format(safeAmount);
  }
}

/**
 * Converts a base USD amount to a target currency using the market rate.
 * Rounds cleanly according to currency fraction digits.
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
 * Formats a Money object or a numeric base price according to a specific Market.
 */
export function formatMoneyWithMarket(
  money: Money | number,
  market: Market = DEFAULT_MARKET,
  options?: FormatMoneyOptions
): string {
  const targetCurrency = options?.currency ?? market.currency.code;
  const targetLocale = options?.locale ?? market.locale;
  const shouldConvert = options?.convert ?? true;

  if (typeof money === "number") {
    const finalAmount = shouldConvert
      ? convertAmount(money, market.rate, market.currency.fractionDigits)
      : money;
    return formatMarketPrice(finalAmount, targetCurrency, targetLocale, {
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
    });
  }

  let finalAmount = money.amount;
  if (
    shouldConvert &&
    money.currencyCode === "USD" &&
    targetCurrency !== "USD"
  ) {
    finalAmount = convertAmount(
      money.amount,
      market.rate,
      market.currency.fractionDigits
    );
  }

  return formatMarketPrice(finalAmount, targetCurrency, targetLocale, {
    minimumFractionDigits: options?.minimumFractionDigits,
    maximumFractionDigits: options?.maximumFractionDigits,
  });
}
