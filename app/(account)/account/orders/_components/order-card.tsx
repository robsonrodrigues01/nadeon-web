import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { OrderRowView } from "./order-view";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderActions } from "./order-actions";

export interface OrderCardProps {
  row: OrderRowView;
}

/**
 * Actions follow the order status: processing orders can still edit the address,
 * in-transit orders track the package, delivered orders can be bought again.
 */
export function OrderCard({ row }: OrderCardProps) {
  const detailsHref = `/account/orders/${encodeURIComponent(row.id)}`;

  return (
    <article className="flex flex-col gap-5 rounded-card border border-border bg-bg-elevated p-5 md:p-6 lg:grid lg:grid-cols-[160px_minmax(0,1fr)_140px_auto] lg:items-center lg:gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold text-fg">
          Order #{row.orderNumber}
        </h2>
        <p className="text-sm text-fg-muted">Placed {row.placedLabel}</p>
      </div>

      <ul className="flex min-w-0 flex-col gap-2 text-sm text-fg">
        {(
          row.items ??
          row.itemTitles.map((t) => ({ title: t, image: undefined }))
        ).map((item, index) => {
          const imageSrc =
            "image" in item && typeof item.image === "string"
              ? item.image
              : undefined;
          return (
            <li
              key={`${row.id}-item-${index}`}
              className="flex items-center gap-3"
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={item.title}
                  width={40}
                  height={40}
                  sizes="40px"
                  className="size-10 shrink-0 rounded-field object-cover bg-bg"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-10 shrink-0 rounded-field bg-bg border border-border"
                />
              )}
              <span className="font-bold">{item.title}</span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col items-start gap-2">
        <OrderStatusBadge status={row.status} label={row.statusLabel} />
        <p className="font-bold text-fg">{row.totalLabel}</p>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {row.status === "processing" && (
          <Button variant="secondary" size="sm" href="/account/settings">
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
        {row.canReview &&
          row.items
            ?.filter((item) => item.productSlug)
            .map((item) => (
              <Button
                key={`${row.id}-${item.productSlug}`}
                variant="secondary"
                size="sm"
                href={`/reviews/write?orderId=${encodeURIComponent(row.id)}&productSlug=${encodeURIComponent(item.productSlug!)}`}
                aria-label={`Write a review for ${item.title}`}
              >
                Write a review
              </Button>
            ))}
        <OrderActions
          lines={row.lines}
          orderUrl={row.url}
          copyLink={row.copyLink}
          canReorder={row.canReorder}
          showBuyAgain={row.status === "delivered" || Boolean(row.canReorder)}
        />
        <Button variant="secondary" size="sm" href={detailsHref}>
          Details
        </Button>
      </div>
    </article>
  );
}
