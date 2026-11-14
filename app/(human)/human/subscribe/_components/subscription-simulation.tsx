"use client";

import React, { useState } from "react";

export function SubscriptionSimulation() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formulas, setFormulas] = useState("BioHack + Renew");
  const [interval, setInterval] = useState("every 60 days");
  const [isPaused, setIsPaused] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const handleSkip = () => {
    const d = new Date();
    d.setDate(d.getDate() + 105);
    const newDate = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    setDeliveryDate(newDate);
    setStatusMessage(`Next box skipped! New delivery date: ${newDate}`);
  };

  const handlePause = () => {
    setIsPaused((prev) => !prev);
    setStatusMessage(
      !isPaused
        ? "Subscription paused for 30 days."
        : "Subscription resumed and active."
    );
  };

  const handleChangeDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    const newDate = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    setDeliveryDate(newDate);
    setStatusMessage(`Delivery date rescheduled to ${newDate}.`);
  };

  const handleSwap = () => {
    const nextFormula =
      formulas === "BioHack + Renew"
        ? "Full Charge + Renew"
        : "BioHack + Renew";
    setFormulas(nextFormula);
    setStatusMessage(`Formula swapped to ${nextFormula}.`);
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setStatusMessage(
      "Subscription cancelled. You can reactivate anytime from your account."
    );
  };

  const handleReset = () => {
    setFormulas("BioHack + Renew");
    setInterval("every 60 days");
    setIsPaused(false);
    setIsCancelled(false);
    const d = new Date();
    d.setDate(d.getDate() + 45);
    setDeliveryDate(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
    setStatusMessage(null);
  };

  return (
    <div
      aria-label="Interactive subscription simulation"
      className="rounded-card border border-border bg-bg p-6 sm:p-8 shadow-card text-left max-w-lg mx-auto"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
            ACCOUNT SIMULATION
          </span>
          <h3 className="font-archivo text-xl font-bold uppercase text-fg mt-0.5">
            My subscription
          </h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            isCancelled
              ? "bg-red-500/20 text-red-400"
              : isPaused
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          {isCancelled ? "Cancelled" : isPaused ? "Paused" : "Active"}
        </span>
      </div>

      <div className="mt-5 space-y-2">
        <div className="text-base font-bold text-fg">{formulas}</div>
        <div className="text-xs text-fg-muted">2 jars each · {interval}</div>
        <div className="text-sm text-fg">
          Next box:{" "}
          <span className="font-semibold text-accent">{deliveryDate}</span>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className="mt-4 rounded-lg bg-accent/15 border border-accent/30 p-3 text-xs font-medium text-fg"
        >
          {statusMessage}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={handleSkip}
          disabled={isCancelled || isPaused}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent"
        >
          Skip next
        </button>

        <button
          type="button"
          onClick={handlePause}
          disabled={isCancelled}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>

        <button
          type="button"
          onClick={handleChangeDate}
          disabled={isCancelled || isPaused}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent"
        >
          Change date
        </button>

        <button
          type="button"
          onClick={handleSwap}
          disabled={isCancelled}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent"
        >
          Swap formula
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isCancelled}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-red-500/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 transition-colors hover:border-red-500 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-red-500"
        >
          Cancel subscription
        </button>

        {(isCancelled || isPaused || formulas !== "BioHack + Renew") && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-xs underline text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Reset demo
          </button>
        )}
      </div>
    </div>
  );
}
