import type { Money } from "@/lib/contracts/catalog";
import { formatMoneyWithMarket } from "@/lib/market/formatter";

/**
 * Formats a monetary value in USD with en-US formatting.
 */
export function formatMoney(money: Money, locale = "en-US"): string {
  return formatMoneyWithMarket(money, undefined, { locale });
}
