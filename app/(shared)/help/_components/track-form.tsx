"use client";

import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { lookupOrder, type TrackState } from "./actions";

const initialState: TrackState = { status: "idle" };

const fieldClass =
  "min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function TrackForm() {
  const [state, formAction] = useActionState(lookupOrder, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="track-order-number"
          className="text-sm font-bold text-fg"
        >
          Order number
        </label>
        <input
          id="track-order-number"
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
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className={fieldClass}
        />
      </div>

      <Button type="submit" size="lg" className="w-full">
        Track order
      </Button>

      <p role="status" aria-live="polite" className="text-sm text-fg-muted">
        {state.status === "invalid" && "Check the order number and email."}
        {state.status === "pending" && "Order tracking is not connected yet."}
      </p>
    </form>
  );
}
