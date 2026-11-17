"use client";

import React, { useState } from "react";
import type { Order } from "@/lib/contracts/account";
import type { Market } from "@/lib/market";
import { OrderLookup } from "./order-lookup";
import { TrackResult } from "./track-result";

interface TrackViewProps {
  signInHref: string;
  market: Market;
  initialOrderNumber?: string;
}

export function TrackView({
  signInHref,
  market,
  initialOrderNumber,
}: TrackViewProps) {
  const [order, setOrder] = useState<Order | null>(null);

  if (order) {
    return <TrackResult order={order} market={market} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <OrderLookup
        signInHref={signInHref}
        initialValues={{
          orderNumber: initialOrderNumber,
        }}
        onOrderFound={(foundOrder) => setOrder(foundOrder)}
      />

      <aside
        aria-labelledby="order-number-help-heading"
        className="rounded-card border border-border p-6 sm:p-8"
      >
        <h2
          id="order-number-help-heading"
          className="font-archivo text-xl font-bold text-fg"
        >
          Where is my order number?
        </h2>
        <ol className="mt-5 flex flex-col gap-4 text-sm text-fg-muted">
          <li>
            Search your inbox for <strong>&quot;Nadeon order&quot;</strong>. The
            number is at the top of the confirmation email.
          </li>
          <li>
            Order numbers start with <strong>NL-</strong> and have 6 digits.
          </li>
          <li>
            Checked out with Shop Pay or as a guest? Same email, same number.
          </li>
          <li>
            Still stuck? Chat with us or email support and we will find it.
          </li>
        </ol>
      </aside>
    </div>
  );
}
