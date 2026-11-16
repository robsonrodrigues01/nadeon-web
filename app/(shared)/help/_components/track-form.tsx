"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TrackOrderSchema } from "@/app/(shared)/track/_components/schema";
import { lookupOrder, type TrackState } from "./actions";

const initialState: TrackState = { status: "idle" };

const fieldClass =
  "min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function TrackForm() {
  const [state, formAction, isPending] = useActionState(
    lookupOrder,
    initialState
  );
  const [clientError, setClientError] = useState("");
  const [invalidField, setInvalidField] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);
  const orderNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      !clientError &&
      ["invalid", "not_found", "error"].includes(state.status)
    )
      statusRef.current?.focus();
  }, [clientError, state.status]);

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
      return;
    }

    event.preventDefault();
    const field = String(parsed.error.issues[0]?.path[0] ?? "orderNumber");
    setInvalidField(field);
    setClientError("Check the order number and email.");
    (field === "email" ? emailRef : orderNumberRef).current?.focus();
  }

  return (
    <form
      action={formAction}
      onSubmit={validate}
      onChange={() => {
        if (clientError) {
          setClientError("");
          setInvalidField("");
        }
      }}
      noValidate
      className="mt-6 flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="track-order-number"
          className="text-sm font-bold text-fg"
        >
          Order number
        </label>
        <input
          id="track-order-number"
          ref={orderNumberRef}
          aria-invalid={invalidField === "orderNumber"}
          name="orderNumber"
          type="text"
          required
          autoComplete="off"
          autoCapitalize="characters"
          pattern="[Nn][Ll]-[0-9]{6}"
          placeholder="e.g. NL-100234"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="track-email" className="text-sm font-bold text-fg">
          Email
        </label>
        <input
          id="track-email"
          ref={emailRef}
          aria-invalid={invalidField === "email"}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className={fieldClass}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Tracking..." : "Track order"}
      </Button>

      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="text-sm text-fg-muted"
      >
        {clientError}
        {!clientError && state.status === "invalid" && (
          <p>Check the order number and email.</p>
        )}
        {!clientError && state.status === "not_found" && (
          <p>No order found with those details.</p>
        )}
        {!clientError && state.status === "error" && (
          <p>Unable to track order. Try again.</p>
        )}
        {!clientError && state.status === "found" && (
          <div className="mt-4 rounded-card border border-border bg-bg-elevated p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-fg">
                Order #{state.orderNumber}
              </span>
              <span className="capitalize font-bold text-accent">
                {state.fulfillmentStatus.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-fg-muted">Items: {state.itemCount}</p>
            {state.trackingUrl && (
              <a
                href={state.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-xs font-bold text-accent underline"
              >
                Track package →
              </a>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
