import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { OrderDetailView } from "./order-view";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderActions } from "./order-actions";

export interface OrderDetailViewProps {
  order: OrderDetailView;
}

const SECTION_TITLE =
  "text-sm font-extrabold uppercase tracking-wider text-fg-muted";
const SECTION_CARD =
  "flex flex-col gap-4 rounded-card border border-border bg-bg-elevated p-5 md:p-6";

/** Order detail. Only fields the order contract provides are rendered; the rest is left out. */
export function OrderDetailView({ order }: OrderDetailViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
          <li>
            <Link href="/account" className="underline underline-offset-4">
              Account
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/account/orders"
              className="underline underline-offset-4"
            >
              Orders
            </Link>
          </li>
        </ol>
      </nav>

      <Link
        href="/account/orders"
        className="inline-flex min-h-11 w-fit items-center text-sm font-bold text-fg underline underline-offset-4 hover:text-accent"
      >
        ← All orders
      </Link>

      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold text-fg md:text-4xl">
            Order #{order.orderNumber}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={order.status} label={order.statusLabel} />
            <p className="text-sm text-fg-muted">Placed {order.placedLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderActions
            lines={order.lines}
            orderUrl={order.url}
            copyLink={order.copyLink}
            canReorder={order.canReorder}
            showBuyAgain={order.canReorder ?? true}
          />
          <Button variant="secondary" size="sm" href="/help">
            Get help
          </Button>
        </div>
      </header>

      {order.trackingNumber && (
        <section aria-labelledby="shipment-title" className={SECTION_CARD}>
          <h2 id="shipment-title" className={SECTION_TITLE}>
            Shipment
          </h2>
          <dl className="flex flex-col gap-1 text-sm">
            <dt className="text-fg-muted">Tracking number</dt>
            <dd className="font-bold text-fg">{order.trackingNumber}</dd>
          </dl>
          {order.trackingUrl && (
            <div>
              <Button
                variant="primary"
                size="sm"
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Track package
                <span className="sr-only">(opens in a new tab)</span>
              </Button>
            </div>
          )}
        </section>
      )}

      <section aria-labelledby="items-title" className={SECTION_CARD}>
        <h2 id="items-title" className={SECTION_TITLE}>
          Items ({order.items.length})
        </h2>
        <ul className="flex flex-col divide-y divide-border">
          {order.items.map((item, index) => (
            <li
              key={`${order.id}-item-${index}`}
              className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-field object-cover bg-bg"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="size-12 shrink-0 rounded-field bg-bg border border-border"
                  />
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-bold text-fg">{item.title}</p>
                  <p className="text-sm text-fg-muted">
                    {item.variantTitle ? `${item.variantTitle} · ` : ""}Qty{" "}
                    {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold text-fg">{item.priceLabel}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="help-title" className={SECTION_CARD}>
        <h2 id="help-title" className="text-base font-bold text-fg">
          Something wrong?
        </h2>
        <p className="text-sm text-fg-muted">
          Damaged jar, missing item or a question about a lot? We reply within 1
          business day.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" href="/help">
            Get help with this order
          </Button>
          <Button variant="secondary" size="sm" href="/help?subject=return">
            Start a return
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {order.addressLines && (
          <section aria-labelledby="address-title" className={SECTION_CARD}>
            <h2 id="address-title" className={SECTION_TITLE}>
              Shipping address
            </h2>
            <address className="flex flex-col gap-1 text-sm not-italic text-fg">
              {order.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </section>
        )}

        <section aria-labelledby="summary-title" className={SECTION_CARD}>
          <h2 id="summary-title" className={SECTION_TITLE}>
            Payment summary
          </h2>
          <dl className="flex items-center justify-between text-base">
            <dt className="font-bold text-fg">Total</dt>
            <dd className="font-bold text-fg">{order.totalLabel}</dd>
          </dl>
        </section>
      </div>
    </div>
  );
}
