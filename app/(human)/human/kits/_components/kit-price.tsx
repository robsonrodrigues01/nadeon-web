import type { Money } from "@/lib/contracts/catalog";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { DEFAULT_MARKET } from "@/lib/market/markets";

export interface KitPriceProps {
  price: Money;
  compareAtPrice: Money | null;
  savings: Money | null;
}

export function KitPrice({ price, compareAtPrice, savings }: KitPriceProps) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-xl font-bold text-fg">
        {formatMoneyWithMarket(price, DEFAULT_MARKET)}
      </span>
      {compareAtPrice && (
        <s className="text-sm text-fg-muted">
          {formatMoneyWithMarket(compareAtPrice, DEFAULT_MARKET)}
        </s>
      )}
      {savings && (
        <span className="text-sm font-semibold text-accent">
          You save {formatMoneyWithMarket(savings, DEFAULT_MARKET)}
        </span>
      )}
    </p>
  );
}
