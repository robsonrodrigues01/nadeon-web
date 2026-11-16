"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
interface OrderLookupProps {
  signInHref: string;
  errorMessage?: string;
  initialValues?: {
    orderNumber?: string;
    email?: string;
  };
}

// Estado A do design: formulário de busca de pedido de visitante.
export function OrderLookup({
  signInHref,
  errorMessage,
  initialValues,
}: OrderLookupProps) {
  const [isPending, setIsPending] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (errorMessage) errorRef.current?.focus();
  }, [errorMessage]);

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

      <form
        method="GET"
        action="/track"
        onSubmit={() => setIsPending(true)}
        className="mt-6 flex flex-col gap-5"
      >
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
            defaultValue={initialValues?.orderNumber ?? ""}
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
            defaultValue={initialValues?.email ?? ""}
            aria-describedby="order-email-hint"
            className="min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <p id="order-email-hint" className="text-sm text-fg-muted">
            The email you used at checkout.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Tracking..." : "Track order"}
        </Button>

        {errorMessage && (
          <p
            ref={errorRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="text-sm text-accent"
          >
            {errorMessage}
          </p>
        )}
      </form>

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
