"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrackOrderSchema } from "./schema";
import { lookupOrderAction } from "./actions";
import type { GuestOrderTracking } from "@/lib/contracts/account";

interface OrderLookupProps {
  signInHref: string;
  errorMessage?: string;
  initialValues?: {
    orderNumber?: string;
    email?: string;
  };
  onOrderFound?: (order: GuestOrderTracking) => void;
}

// Estado A do design: formulário de busca de pedido de visitante via POST (Server Action).
export function OrderLookup({
  signInHref,
  errorMessage,
  initialValues,
  onOrderFound,
}: OrderLookupProps) {
  const [isPending, setIsPending] = useState(false);
  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [invalidField, setInvalidField] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  const orderNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const activeError = clientError || serverError || errorMessage;

  useEffect(() => {
    if (serverError || errorMessage) {
      errorRef.current?.focus();
    }
  }, [serverError, errorMessage]);

  function validate(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = TrackOrderSchema.safeParse({
      orderNumber: data.get("orderNumber"),
      email: data.get("email"),
    });
    if (parsed.success) {
      setClientError("");
      setInvalidField("");
      setIsPending(true);
      return;
    }

    event.preventDefault();
    const field = String(parsed.error.issues[0]?.path[0] ?? "orderNumber");
    setInvalidField(field);
    setClientError("Check the order number and email.");
    (field === "email" ? emailRef : orderNumberRef).current?.focus();
  }

  async function handleAction(formData: FormData) {
    setServerError("");
    setClientError("");
    setIsPending(true);

    try {
      const result = await lookupOrderAction(formData);
      if (result.status === "found" && result.order) {
        onOrderFound?.(result.order);
        return;
      }
      setServerError(
        (result.status !== "found" && result.errorMessage) ||
          "No order found with that number and email. Please check your confirmation email."
      );
    } catch {
      setServerError("Unable to look up your order. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

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
        action={handleAction}
        onSubmit={validate}
        onChange={() => {
          if (clientError || serverError) {
            setClientError("");
            setServerError("");
            setInvalidField("");
          }
        }}
        noValidate
        className="mt-6 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="order-number" className="text-sm font-bold text-fg">
            Order number
          </label>
          <input
            id="order-number"
            ref={orderNumberRef}
            aria-invalid={
              invalidField === "orderNumber" || Boolean(activeError)
            }
            name="orderNumber"
            type="text"
            required
            autoComplete="off"
            autoCapitalize="characters"
            pattern="([Nn][Ll]-[0-9]{6}|[Tt][Ee][Ss][Tt]-[Nn][Ll]-[0-9]+)"
            defaultValue={initialValues?.orderNumber ?? ""}
            aria-describedby={
              activeError
                ? "order-lookup-error order-number-hint"
                : "order-number-hint"
            }
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
            ref={emailRef}
            aria-invalid={invalidField === "email" || Boolean(activeError)}
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={initialValues?.email ?? ""}
            aria-describedby={
              activeError
                ? "order-lookup-error order-email-hint"
                : "order-email-hint"
            }
            className="min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <p id="order-email-hint" className="text-sm text-fg-muted">
            The email you used at checkout.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Tracking..." : "Track order"}
        </Button>

        {activeError && (
          <p
            id="order-lookup-error"
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="text-sm font-semibold text-accent"
          >
            {activeError}
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
