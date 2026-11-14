import type { Money } from "@/lib/contracts/catalog";
import { formatKitMoney } from "./kit-view";

export interface KitPriceProps {
  price: Money;
  compareAtPrice: Money | null;
  savings: Money | null;
}

export function KitPrice({ price, compareAtPrice, savings }: KitPriceProps) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-xl font-bold text-fg">{formatKitMoney(price)}</span>
      {compareAtPrice && (
        <s className="text-sm text-fg-muted">
          {formatKitMoney(compareAtPrice)}
        </s>
      )}
      {savings && (
        <span className="text-sm font-semibold text-accent">
          You save {formatKitMoney(savings)}
        </span>
      )}
    </p>
  );
}
