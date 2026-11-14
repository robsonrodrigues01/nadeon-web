import { Button } from "@/components/ui/button";
import type { OrderRowView } from "./order-view";
import { OrderStatusBadge } from "./order-status-badge";

export interface OrderCardProps {
  row: OrderRowView;
}

/**
 * Actions follow the order status: processing orders can still edit the address,
 * in-transit orders track the package, delivered orders can be bought again.
 */
export function OrderCard({ row }: OrderCardProps) {
  const detailsHref = `/account/orders/${row.id}`;

  return (
    <article className="flex flex-col gap-5 rounded-card border border-border bg-bg-elevated p-5 md:p-6 lg:grid lg:grid-cols-[160px_minmax(0,1fr)_140px_auto] lg:items-center lg:gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold text-fg">
          Order #{row.orderNumber}
        </h2>
        <p className="text-sm text-fg-muted">Placed {row.placedLabel}</p>
      </div>

      <ul className="flex min-w-0 flex-col gap-1 text-sm text-fg">
        {row.itemTitles.map((title, index) => (
          <li
            key={`${row.id}-item-${index}`}
            className="flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              className="h-10 w-10 shrink-0 rounded-field bg-bg"
            />
            <span className="font-bold">{title}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-start gap-2">
        <OrderStatusBadge status={row.status} label={row.statusLabel} />
        <p className="font-bold text-fg">{row.totalLabel}</p>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {row.status === "processing" && (
          <Button variant="secondary" size="sm" href="/account/addresses">
            Edit address
          </Button>
        )}
        {row.status === "in_transit" &&
          (row.trackingUrl ? (
            <Button
              variant="primary"
              size="sm"
              href={row.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Track package
              <span className="sr-only">(opens in a new tab)</span>
            </Button>
          ) : (
            <Button variant="primary" size="sm" disabled>
              Track package
            </Button>
          ))}
        {row.status === "delivered" && (
          // Buy again needs variant ids, which the order contract does not expose yet.
          <Button variant="primary" size="sm" disabled>
            Buy again
          </Button>
        )}
        <Button variant="secondary" size="sm" href={detailsHref}>
          Details
        </Button>
      </div>
    </article>
  );
}
