"use client";

import React, { useState } from "react";
import Link from "next/link";

export function FlexibilitySection() {
  const [isPaused, setIsPaused] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("Dec 3 (example)");
  const [productName, setProductName] = useState("More Good Years");
  const [productBadge, setProductBadge] = useState("Senior · NMN 75 mg");
  const [productColor, setProductColor] = useState("bg-product-mint");
  const [isCancelled, setIsCancelled] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSkip = () => {
    setIsCancelled(false);
    if (deliveryDate === "Dec 3 (example)") {
      setDeliveryDate("Jan 2 (example)");
      setMessage("Next delivery skipped to Jan 2 (example).");
    } else {
      setDeliveryDate("Feb 1 (example)");
      setMessage("Next delivery skipped to Feb 1 (example).");
    }
  };

  const handlePause = () => {
    setIsCancelled(false);
    if (!isPaused) {
      setIsPaused(true);
      setMessage("Subscription paused for up to 3 months.");
    } else {
      setIsPaused(false);
      setMessage("Subscription resumed. Your next shipment is scheduled.");
    }
  };

  const handleChangeDate = () => {
    setIsCancelled(false);
    if (deliveryDate.includes("Dec 3")) {
      setDeliveryDate("Dec 18 (example)");
      setMessage("Delivery date moved to Dec 18 (example).");
    } else {
      setDeliveryDate("Dec 3 (example)");
      setMessage("Delivery date updated to Dec 3 (example).");
    }
  };

  const handleSwap = () => {
    setIsCancelled(false);
    if (productName === "More Good Years") {
      setProductName("Golden Years");
      setProductBadge("Joints · NMN 50 mg");
      setProductColor("bg-product-amber");
      setMessage("Swapped product to Golden Years.");
    } else {
      setProductName("More Good Years");
      setProductBadge("Senior · NMN 75 mg");
      setProductColor("bg-product-mint");
      setMessage("Swapped product to More Good Years.");
    }
  };

  const handleCancel = () => {
    if (!isCancelled) {
      setIsCancelled(true);
      setMessage(
        "Subscription cancelled. You can reactivate anytime with one tap."
      );
    } else {
      setIsCancelled(false);
      setMessage("Subscription reactivated.");
    }
  };

  return (
    <section
      aria-labelledby="flexibility-heading"
      className="border-b border-border bg-fg py-16 text-bg sm:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-5 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:px-12">
        {/* Left Column: Feature highlights */}
        <div className="flex-1 text-left">
          <span className="bg-gradient-gold bg-clip-text text-xs font-bold uppercase tracking-widest text-transparent">
            FULL FLEXIBILITY
          </span>
          <h2
            id="flexibility-heading"
            className="mt-3 font-sans text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-bg sm:text-4xl lg:text-5xl"
          >
            You are always in control
          </h2>

          <div className="mt-8 space-y-6">
            {/* 1. Skip */}
            <div className="flex items-start gap-4 border-b border-bg/20 pb-6">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-fg font-sans text-xl font-extrabold"
                aria-hidden="true"
              >
                »
              </div>
              <div>
                <h3 className="font-sans text-xl font-extrabold uppercase tracking-tight text-bg sm:text-2xl">
                  Skip
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-bg/80 sm:text-base">
                  Have extra? Skip the next delivery with one tap.
                </p>
              </div>
            </div>

            {/* 2. Pause */}
            <div className="flex items-start gap-4 border-b border-bg/20 pb-6">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-fg font-sans text-base font-extrabold"
                aria-hidden="true"
              >
                ❚❚
              </div>
              <div>
                <h3 className="font-sans text-xl font-extrabold uppercase tracking-tight text-bg sm:text-2xl">
                  Pause
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-bg/80 sm:text-base">
                  Going away? Pause for up to 3 months.
                </p>
              </div>
            </div>

            {/* 3. Cancel */}
            <div className="flex items-start gap-4 border-b border-bg/20 pb-6">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-fg font-sans text-lg font-extrabold"
                aria-hidden="true"
              >
                ✕
              </div>
              <div>
                <h3 className="font-sans text-xl font-extrabold uppercase tracking-tight text-bg sm:text-2xl">
                  Cancel
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-bg/80 sm:text-base">
                  No calls, no forms. Cancel anytime from your account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Subscription Dashboard Simulation Card */}
        <div className="w-full flex-1 max-w-lg rounded-3xl bg-bg p-6 text-fg shadow-2xl sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-fg/60">
              MY SUBSCRIPTION (SIMULATION)
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                isCancelled
                  ? "bg-product-coral/20 text-product-coral"
                  : isPaused
                    ? "bg-accent/20 text-accent-fg"
                    : "bg-product-mint/20 text-fg"
              }`}
            >
              {isCancelled ? "Cancelled" : isPaused ? "Paused" : "Active"}
            </span>
          </div>

          {/* Product Info */}
          <div className="mt-5 flex items-center gap-4">
            <div
              className="flex h-16 w-14 flex-shrink-0 flex-col items-center justify-end"
              aria-hidden="true"
            >
              <div className="h-2 w-10 rounded-t bg-fg" />
              <div className="flex h-13 w-13 flex-col items-center justify-center overflow-hidden rounded-md border border-border bg-bg-elevated">
                <div
                  className={`h-3/5 w-full ${productColor} flex items-center justify-center`}
                >
                  <span className="text-[7px] font-extrabold text-fg">●</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-sans text-base font-extrabold uppercase tracking-tight text-fg sm:text-lg">
                {productName}
              </h4>
              <p className="text-xs text-fg-muted">{productBadge}</p>
              <p className="mt-1 text-xs text-fg/70">
                For: Buddy (example) · every 30 days
              </p>
            </div>
          </div>

          {/* Next Delivery Banner */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-accent/20 px-4 py-3 text-sm">
            <span className="text-fg/80">Next delivery</span>
            <strong className="font-bold text-fg">
              {isCancelled
                ? "None scheduled"
                : isPaused
                  ? "Paused"
                  : deliveryDate}
            </strong>
          </div>

          {/* Live Feedback Toast */}
          {message && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 rounded-lg bg-bg-elevated border border-border p-3 text-center text-xs font-medium text-fg"
            >
              {message}
            </div>
          )}

          {/* Action Buttons Grid */}
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isCancelled}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-3 py-2 text-xs sm:text-sm font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
            >
              Skip next
            </button>
            <button
              type="button"
              onClick={handlePause}
              disabled={isCancelled}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-3 py-2 text-xs sm:text-sm font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={handleChangeDate}
              disabled={isCancelled}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-3 py-2 text-xs sm:text-sm font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
            >
              Change date
            </button>
            <button
              type="button"
              onClick={handleSwap}
              disabled={isCancelled}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-3 py-2 text-xs sm:text-sm font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
            >
              Swap product
            </button>
          </div>

          {/* Cancel Subscription Action */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex min-h-[44px] items-center justify-center text-xs font-medium text-fg/70 underline transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
            >
              {isCancelled ? "Reactivate subscription" : "Cancel subscription"}
            </button>
          </div>

          <div className="mt-2 text-center">
            <Link
              href="/account/subscriptions"
              className="inline-flex min-h-[44px] items-center justify-center text-xs text-accent-fg font-semibold hover:underline"
            >
              Go to account subscriptions →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
