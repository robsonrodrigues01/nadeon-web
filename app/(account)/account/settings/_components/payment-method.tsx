"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export interface SavedPaymentMethod {
  brand: string;
  last4: string;
  expiry: string;
  subscriptionCount?: number;
}

export interface PaymentMethodProps {
  paymentMethod?: SavedPaymentMethod | null;
}

export function PaymentMethod({ paymentMethod }: PaymentMethodProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpdate = () => {
    setFeedback("Redirecting to secure Shopify Payments portal...");
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <section
      aria-labelledby="payment-method-heading"
      className="flex flex-col gap-4 rounded-card border border-border bg-bg-elevated p-6 sm:p-7 shadow-card"
    >
      <div>
        <h2
          id="payment-method-heading"
          className="text-xs font-bold uppercase tracking-wider text-accent"
        >
          Payment method
        </h2>
      </div>

      {paymentMethod ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span
              aria-hidden="true"
              className="inline-flex rounded-field border border-border px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-fg"
            >
              {paymentMethod.brand}
            </span>
            <div>
              <p className="text-sm font-bold text-fg sm:text-base">
                •••• {paymentMethod.last4}
              </p>
              <p className="text-xs text-fg-muted sm:text-sm">
                Expires {paymentMethod.expiry}
                {typeof paymentMethod.subscriptionCount === "number"
                  ? ` · used for ${paymentMethod.subscriptionCount} subscription${paymentMethod.subscriptionCount === 1 ? "" : "s"}`
                  : ""}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-fg-muted">No saved payment method.</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleUpdate}
          >
            Add payment method
          </Button>
        </div>
      )}

      <p className="text-xs text-fg-muted">
        Card details are stored and processed by Shopify Payments.
      </p>

      {feedback ? (
        <p role="status" className="text-xs font-semibold text-accent">
          {feedback}
        </p>
      ) : null}
    </section>
  );
}
