import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/contracts/account";

interface OrderLookupProps {
  signInHref: string;
  order?: Order | null;
}

// Estado A do design: formulário sem resultado. Sem JavaScript de cliente.
export function OrderLookup({ signInHref, order }: OrderLookupProps) {
  return (
    <section
      aria-labelledby="order-lookup-heading"
      className="rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        Order lookup
      </p>
      <h2
        id="order-lookup-heading"
        className="mt-2 font-archivo text-2xl font-bold text-fg"
      >
        Find your order
      </h2>

      <form action="/track" method="get" className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="order-number" className="text-sm font-bold text-fg">
            Order number
          </label>
          <input
            id="order-number"
            name="orderNumber"
            type="text"
            required
            autoComplete="off"
            autoCapitalize="characters"
            pattern="[Nn][Ll]-[0-9]{6}"
            aria-describedby="order-number-hint"
            className="min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <p id="order-number-hint" className="text-sm text-fg-muted">
            Starts with NL, found in your confirmation email.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="order-email" className="text-sm font-bold text-fg">
            Email
          </label>
          <input
            id="order-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-describedby="order-email-hint"
            className="min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <p id="order-email-hint" className="text-sm text-fg-muted">
            The email you used at checkout.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Track order
        </Button>
      </form>

      {order && (
        <section
          aria-labelledby="lookup-result-title"
          className="mt-8 border-t border-border pt-6"
        >
          <h3
            id="lookup-result-title"
            className="font-archivo text-xl font-bold text-fg"
          >
            Order {order.orderNumber}
          </h3>
          <p className="mt-2 text-sm text-fg-muted">
            Status: {order.fulfillmentStatus.replace("_", " ")}
          </p>
          {order.trackingNumber && (
            <p className="mt-1 text-sm text-fg-muted">
              Tracking number: {order.trackingNumber}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {order.trackingUrl && (
              <Button
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Track shipment
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            )}
            <Button
              variant="secondary"
              href={`/help?subject=problem&order=${encodeURIComponent(order.orderNumber)}`}
            >
              Report a problem
            </Button>
            <Button
              variant="secondary"
              href={`/help?subject=return&order=${encodeURIComponent(order.orderNumber)}`}
            >
              Start a return
            </Button>
          </div>
        </section>
      )}

      <p className="mt-6 text-sm text-fg-muted">
        or{" "}
        <Link
          href={signInHref}
          className="font-bold text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm inline-flex min-h-11 items-center"
        >
          Sign in to see all orders →
        </Link>
      </p>
      <p className="mt-2 text-sm text-fg-muted">
        Track every order, manage subscriptions and find lot reports.
      </p>
    </section>
  );
}
