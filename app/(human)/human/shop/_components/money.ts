import type { Money } from "@/lib/contracts/catalog";

/**
 * Formats a monetary value according to the specified market currency and locale.
 * Follows Rule 7: Always uses Intl.NumberFormat, never manual string concatenation.
 */
export function formatMoney(money: Money, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
  }).format(money.amount);
}

export function formatAmount(
  amount: number,
  currencyCode = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}
