import type { Money } from "@/lib/contracts/catalog";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import type { Market } from "@/lib/market/types";

export interface KitPriceProps {
  price: Money;
  compareAtPrice: Money | null;
  savings: Money | null;
  market: Market;
}

export function KitPrice({
  price,
  compareAtPrice,
  savings,
  market,
}: KitPriceProps) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-xl font-bold text-fg">
        {formatMoneyWithMarket(price, market)}
      </span>
      {compareAtPrice && (
        <s className="text-sm text-fg-muted">
          {formatMoneyWithMarket(compareAtPrice, market)}
        </s>
      )}
      {savings && (
        <span className="text-sm font-semibold text-accent">
          You save {formatMoneyWithMarket(savings, market)}
        </span>
      )}
    </p>
  );
}
