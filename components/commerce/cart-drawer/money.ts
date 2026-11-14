import type { Money } from "@/lib/contracts/catalog";

export function formatMoney(
  money?: Money | { amount: number; currencyCode: string } | null,
  locale = "en-US"
): string {
  if (!money) return "";
  const currency = money.currencyCode || "USD";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(money.amount);
}
