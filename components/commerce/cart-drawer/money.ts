import type { Money } from "@/lib/contracts/catalog";
import { formatMoneyWithMarket } from "@/lib/market/formatter";

export function formatMoney(
  money?: Money | { amount: number; currencyCode: string } | null
): string {
  if (!money) return "";
  return formatMoneyWithMarket(money);
}
