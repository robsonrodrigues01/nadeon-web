"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";

interface FlexibilitySectionProps {
  products?: Product[];
  intervalDays?: number | null;
  pauseMonths?: number;
}

const PRODUCT_COLORS: Record<string, string> = {
  "more-good-years": "bg-product-mint",
  "golden-years": "bg-product-amber",
  "good-days": "bg-product-coral",
  "high-jump": "bg-product-sky",
  "still-sharp": "bg-product-sky",
  "shine-on": "bg-product-coral",
  "second-wind": "bg-product-amber",
};

function formatDynamicDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function FlexibilitySection({
  products = [],
  intervalDays = null,
  pauseMonths = 3,
}: FlexibilitySectionProps) {
  const stepDays = intervalDays && intervalDays > 0 ? intervalDays : 30;
  const prod1 = products[0];
  const prod2 = products[1];

  const [productIndex, setProductIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dayOffset, setDayOffset] = useState(stepDays);
  const [deliveryDate, setDeliveryDate] = useState(() =>
    formatDynamicDate(stepDays)
  );
  const [isCancelled, setIsCancelled] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentProduct = productIndex === 1 && prod2 ? prod2 : prod1;
  const productName = currentProduct?.name ?? "More Good Years";
  const productBadge = currentProduct?.technicalName || "Senior · NMN 75 mg";
  const productColor = currentProduct
    ? (PRODUCT_COLORS[currentProduct.slug] ?? "bg-product-mint")
    : "bg-product-mint";

  const frequencyCopy = intervalDays
    ? `every ${intervalDays} days`
    : "recurring delivery";

  const handleSkip = () => {
    setIsCancelled(false);
    const nextOffset = dayOffset + stepDays;
    setDayOffset(nextOffset);
    const nextDate = formatDynamicDate(nextOffset);
    setDeliveryDate(nextDate);
    setMessage(`Next delivery skipped to ${nextDate}.`);
  };

  const handlePause = () => {
    setIsCancelled(false);
    if (!isPaused) {
      setIsPaused(true);
      setMessage(`Subscription paused for up to ${pauseMonths} months.`);
    } else {
      setIsPaused(false);
      setMessage("Subscription resumed. Your next shipment is scheduled.");
    }
  };

  const handleChangeDate = () => {
    setIsCancelled(false);
    const newOffset = dayOffset + 14;
    setDayOffset(newOffset);
    const nextDate = formatDynamicDate(newOffset);
    setDeliveryDate(nextDate);
    setMessage(`Delivery date moved to ${nextDate}.`);
  };

  const handleSwap = () => {
    setIsCancelled(false);
    if (prod2) {
      const nextIdx = productIndex === 0 ? 1 : 0;
      setProductIndex(nextIdx);
      const nextProd = nextIdx === 1 ? prod2 : prod1;
      setMessage(`Swapped product to ${nextProd.name}.`);
    } else {
      // Toggle demo name if only 1 product or mock passed
      const nextName =
        productName === "More Good Years" ? "Golden Years" : "More Good Years";
      setMessage(`Swapped product to ${nextName}.`);
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
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent font-sans text-xl font-extrabold text-fg"
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
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent font-sans text-base font-extrabold text-fg"
                aria-hidden="true"
              >
                ❚❚
              </div>
              <div>
                <h3 className="font-sans text-xl font-extrabold uppercase tracking-tight text-bg sm:text-2xl">
                  Pause
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-bg/80 sm:text-base">
                  Going away? Pause for up to {pauseMonths} months.
                </p>
              </div>
            </div>

            {/* 3. Cancel */}
            <div className="flex items-start gap-4 border-b border-bg/20 pb-6">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent font-sans text-lg font-extrabold text-fg"
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
                Active subscription · {frequencyCopy}
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
              className="mt-4 rounded-lg border border-border bg-bg-elevated p-3 text-center text-xs font-medium text-fg"
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
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-3 py-2 text-xs font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-sm"
            >
              Skip next
            </button>
            <button
              type="button"
              onClick={handlePause}
              disabled={isCancelled}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-3 py-2 text-xs font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-sm"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={handleChangeDate}
              disabled={isCancelled}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-3 py-2 text-xs font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-sm"
            >
              Change date
            </button>
            <button
              type="button"
              onClick={handleSwap}
              disabled={isCancelled}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-3 py-2 text-xs font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-sm"
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
              className="inline-flex min-h-[44px] items-center justify-center text-xs font-semibold text-accent-fg hover:underline"
            >
              Go to account subscriptions →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
