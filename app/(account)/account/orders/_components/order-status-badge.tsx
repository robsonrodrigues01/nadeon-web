import type { FulfillmentStatus } from "@/lib/contracts/account";
import { cn } from "@/lib/utils";

const DOT_TONE: Record<FulfillmentStatus, string> = {
  processing: "bg-product-sky",
  in_transit: "bg-accent",
  delivered: "bg-product-mint",
};

export interface OrderStatusBadgeProps {
  status: FulfillmentStatus;
  label: string;
}

/** Status is always shown as text; the colored dot is decorative. */
export function OrderStatusBadge({ status, label }: OrderStatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill border border-border px-3 py-1 text-xs font-bold text-fg">
      <span
        aria-hidden="true"
        className={cn("h-2 w-2 rounded-full", DOT_TONE[status])}
      />
      {label}
    </span>
  );
}
