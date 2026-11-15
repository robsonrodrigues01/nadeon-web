import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Order } from "@/lib/contracts/account";
import { formatMoneyWithMarket, type Market } from "@/lib/market";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";

interface TrackResultProps {
  order: Order;
  market: Market;
}

const STATUS_LABELS: Record<string, string> = {
  processing: "Processing",
  in_transit: "Shipped",
  delivered: "Delivered",
};

export function TrackResult({ order, market }: TrackResultProps) {
  const dateFormat = new Intl.DateTimeFormat(market.locale, {
    dateStyle: "medium",
  });
  const placedDate = dateFormat.format(new Date(order.createdAt));
  const totalItemCount = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const statusLabel =
    STATUS_LABELS[order.fulfillmentStatus] || order.fulfillmentStatus;

  const isDelivered = order.fulfillmentStatus === "delivered";
  const isInTransit = order.fulfillmentStatus === "in_transit";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/track"
          className="inline-flex min-h-11 items-center text-sm font-bold text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          ← Look up another order
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h2 className="font-archivo text-3xl font-bold text-fg sm:text-4xl">
            Order #{order.orderNumber}
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <span className="size-2 rounded-full bg-accent" />
            {statusLabel}
          </span>
        </div>
        <p className="mt-2 text-sm text-fg-muted">
          Placed {placedDate} · {totalItemCount}{" "}
          {totalItemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Shipment status timeline */}
      <section
        aria-labelledby="shipment-status-heading"
        className="rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8"
      >
        <p
          id="shipment-status-heading"
          className="text-xs font-bold uppercase tracking-wider text-accent"
        >
          Shipment status
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5 text-center text-xs">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-accent text-bg font-bold">
              ✓
            </div>
            <span className="font-bold text-fg">Ordered</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-accent text-bg font-bold">
              ✓
            </div>
            <span className="font-bold text-fg">Packed</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex size-9 items-center justify-center rounded-full font-bold ${
                isInTransit || isDelivered
                  ? "bg-accent text-bg"
                  : "border border-border text-fg-muted"
              }`}
            >
              {isInTransit || isDelivered ? "✓" : "3"}
            </div>
            <span className="font-bold text-fg">
              Shipped
              {isInTransit && (
                <span className="ml-1 text-[10px] text-accent">· NOW</span>
              )}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex size-9 items-center justify-center rounded-full font-bold ${
                isDelivered
                  ? "bg-accent text-bg"
                  : "border border-border text-fg-muted"
              }`}
            >
              {isDelivered ? "✓" : "4"}
            </div>
            <span
              className={`font-bold ${isDelivered ? "text-fg" : "text-fg-muted"}`}
            >
              Out for delivery
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex size-9 items-center justify-center rounded-full font-bold ${
                isDelivered
                  ? "bg-accent text-bg"
                  : "border border-border text-fg-muted"
              }`}
            >
              {isDelivered ? "✓" : "5"}
            </div>
            <span
              className={`font-bold ${isDelivered ? "text-fg" : "text-fg-muted"}`}
            >
              Delivered
            </span>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div>
              <p className="text-xs text-fg-muted uppercase font-bold tracking-wider">
                Carrier
              </p>
              <p className="text-base font-bold text-fg mt-1">
                Tracking {order.trackingNumber}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CopyButton text={order.trackingNumber} />
              {order.trackingUrl && (
                <Button
                  variant="primary"
                  size="sm"
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Track on carrier
                  <span className="sr-only">(opens in a new tab)</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Items list & details */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section
          aria-labelledby="order-items-heading"
          className="rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8"
        >
          <p
            id="order-items-heading"
            className="text-xs font-bold uppercase tracking-wider text-accent"
          >
            Items ({totalItemCount})
          </p>
          <ul className="mt-4 divide-y divide-border">
            {order.items.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="size-12 rounded-field object-cover bg-bg"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="size-12 rounded-field bg-bg border border-border"
                    />
                  )}
                  <div>
                    <p className="font-bold text-fg text-sm">{item.title}</p>
                    <p className="text-xs text-fg-muted mt-1">
                      {item.variantTitle ? `${item.variantTitle} · ` : ""}Qty{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-fg text-sm">
                  {formatMoneyWithMarket(item.price, market)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
            <span className="font-bold text-fg">Total</span>
            <span className="font-bold text-fg">
              {formatMoneyWithMarket(order.total, market)}
            </span>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {order.shippingAddress && (
            <section
              aria-labelledby="shipping-address-heading"
              className="rounded-card border border-border bg-bg-elevated p-6 shadow-card"
            >
              <h3
                id="shipping-address-heading"
                className="text-xs font-bold uppercase tracking-wider text-accent"
              >
                Shipping address
              </h3>
              <address className="mt-3 text-sm not-italic text-fg flex flex-col gap-1">
                <span>
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </span>
                <span>{order.shippingAddress.address1}</span>
                {order.shippingAddress.address2 && (
                  <span>{order.shippingAddress.address2}</span>
                )}
                <span>
                  {order.shippingAddress.city}
                  {order.shippingAddress.province
                    ? `, ${order.shippingAddress.province}`
                    : ""}{" "}
                  {order.shippingAddress.zip}
                </span>
                <span>{order.shippingAddress.country}</span>
              </address>
            </section>
          )}

          <section
            aria-labelledby="need-help-heading"
            className="rounded-card border border-border bg-bg-elevated p-6 shadow-card"
          >
            <h3
              id="need-help-heading"
              className="font-archivo text-lg font-bold text-fg"
            >
              Need a hand with this order?
            </h3>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              Damaged jar, missing item or a question? We reply within 1 business
              day. Returns are covered by our 60-day money-back guarantee.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" size="sm" href="/help#contact">
                Contact support
              </Button>
              <Button variant="secondary" size="sm" href="/help#contact">
                Report a problem
              </Button>
              <Button variant="secondary" size="sm" href="/shipping-returns">
                Start a return
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
