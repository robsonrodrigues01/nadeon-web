"use client";

import React, { useState, useId } from "react";
import {
  track,
  type AnalyticsEventName,
  type ViewItemPayload,
  type AddToCartPayload,
  type BeginCheckoutPayload,
  type SubscribeNewsletterPayload,
  type QuizCompletePayload,
  type PurchasePayload,
} from "@/lib/analytics";

interface EventLogEntry {
  id: string;
  timestamp: string;
  event: AnalyticsEventName;
  line: "human" | "pet";
  tracked: boolean;
  reason?: string;
  details: string;
}

interface ThemeVariantProps {
  theme: "human" | "pet";
  title: string;
  subtitle: string;
  defaultSku: string;
  defaultName: string;
  defaultPrice: number;
}

function ThemeAnalyticsWorkbench({
  theme,
  title,
  subtitle,
  defaultSku,
  defaultName,
  defaultPrice,
}: ThemeVariantProps) {
  const [consentGranted, setConsentGranted] = useState<boolean>(true);
  const [sku, setSku] = useState<string>(defaultSku);
  const [productName, setProductName] = useState<string>(defaultName);
  const [price, setPrice] = useState<number>(defaultPrice);
  const [quantity, setQuantity] = useState<number>(1);
  const [logs, setLogs] = useState<EventLogEntry[]>([]);

  const skuInputId = useId();
  const nameInputId = useId();
  const priceInputId = useId();
  const quantityInputId = useId();

  const appendLog = (
    event: AnalyticsEventName,
    tracked: boolean,
    details: string,
    reason?: string
  ) => {
    const newEntry: EventLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      event,
      line: theme,
      tracked,
      reason,
      details,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 9)]);
  };

  const handleTrackViewItem = () => {
    const payload: ViewItemPayload = {
      item_id: sku,
      item_name: productName,
      price,
      currency: "USD",
      line: theme,
      item_category: theme === "human" ? "Capsules" : "Soft chews",
    };

    const res = track("view_item", payload, { consent: consentGranted });
    appendLog(
      "view_item",
      res.tracked,
      JSON.stringify(payload),
      res.tracked ? undefined : res.reason
    );
  };

  const handleTrackAddToCart = () => {
    const payload: AddToCartPayload = {
      item_id: sku,
      item_name: productName,
      price,
      quantity,
      currency: "USD",
      line: theme,
      frequency: "subscription",
      subscription_interval: "30_days",
    };

    const res = track("add_to_cart", payload, { consent: consentGranted });
    appendLog(
      "add_to_cart",
      res.tracked,
      JSON.stringify(payload),
      res.tracked ? undefined : res.reason
    );
  };

  const handleTrackBeginCheckout = () => {
    const payload: BeginCheckoutPayload = {
      value: Number((price * quantity).toFixed(2)),
      currency: "USD",
      item_count: quantity,
      line: theme,
      cart_id: `cart_${theme}_101`,
    };

    const res = track("begin_checkout", payload, { consent: consentGranted });
    appendLog(
      "begin_checkout",
      res.tracked,
      JSON.stringify(payload),
      res.tracked ? undefined : res.reason
    );
  };

  const handleTrackSubscribe = () => {
    const payload: SubscribeNewsletterPayload = {
      list: theme === "human" ? "newsletter-human" : "newsletter-pet",
      source: "dev-kit-demo",
      line: theme,
    };

    const res = track("subscribe_newsletter", payload, {
      consent: consentGranted,
    });
    appendLog(
      "subscribe_newsletter",
      res.tracked,
      JSON.stringify(payload),
      res.tracked ? undefined : res.reason
    );
  };

  const handleTrackQuizComplete = () => {
    const payload: QuizCompletePayload = {
      quiz_id: theme === "human" ? "human_longevity_quiz" : "pet_dosing_quiz",
      line: theme,
      species: theme === "pet" ? "dog" : undefined,
      recommended_slug: sku,
      answers_count: 4,
    };

    const res = track("quiz_complete", payload, { consent: consentGranted });
    appendLog(
      "quiz_complete",
      res.tracked,
      JSON.stringify(payload),
      res.tracked ? undefined : res.reason
    );
  };

  const handleTrackPurchase = () => {
    const payload: PurchasePayload = {
      transaction_id: `ord_${theme}_${Date.now().toString().slice(-4)}`,
      value: Number((price * quantity).toFixed(2)),
      currency: "USD",
      item_count: quantity,
      line: theme,
      tax: 0,
      shipping: 0,
    };

    const res = track("purchase", payload, { consent: consentGranted });
    appendLog(
      "purchase",
      res.tracked,
      JSON.stringify(payload),
      res.tracked ? undefined : res.reason
    );
  };

  return (
    <div
      data-theme={theme}
      className="rounded-card border-2 border-border bg-bg text-fg p-6 sm:p-8 shadow-card flex flex-col gap-6"
    >
      <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-1">
            {title}
          </span>
          <p className="body text-sm text-fg-muted">{subtitle}</p>
        </div>

        {/* Consent Controller */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-fg-muted font-mono">
            Consent:{" "}
            <strong
              className={consentGranted ? "text-accent" : "text-fg-muted"}
            >
              {consentGranted ? "Granted" : "Denied"}
            </strong>
          </span>
          <button
            type="button"
            onClick={() => setConsentGranted(true)}
            aria-pressed={consentGranted}
            className={`min-h-11 px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${
              consentGranted
                ? "bg-fg text-bg border-fg"
                : "bg-bg text-fg border-border hover:border-fg"
            }`}
          >
            Grant consent
          </button>
          <button
            type="button"
            onClick={() => setConsentGranted(false)}
            aria-pressed={!consentGranted}
            className={`min-h-11 px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${
              !consentGranted
                ? "bg-fg text-bg border-fg"
                : "bg-bg text-fg border-border hover:border-fg"
            }`}
          >
            Revoke consent
          </button>
        </div>
      </div>

      {/* Interactive Item Configuration Fieldset */}
      <fieldset className="border border-border rounded-card p-4 bg-bg-elevated">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-fg-muted">
          Sample Product Parameters
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          <div>
            <label
              htmlFor={nameInputId}
              className="block text-xs font-bold text-fg-muted mb-1"
            >
              Product Name
            </label>
            <input
              id={nameInputId}
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full min-h-11 px-3 py-2 text-sm bg-bg border border-border rounded-field text-fg focus:outline-none focus:border-fg"
            />
          </div>

          <div>
            <label
              htmlFor={skuInputId}
              className="block text-xs font-bold text-fg-muted mb-1"
            >
              SKU / Slug
            </label>
            <input
              id={skuInputId}
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full min-h-11 px-3 py-2 text-sm bg-bg border border-border rounded-field text-fg focus:outline-none focus:border-fg"
            />
          </div>

          <div>
            <label
              htmlFor={priceInputId}
              className="block text-xs font-bold text-fg-muted mb-1"
            >
              Unit Price (USD)
            </label>
            <input
              id={priceInputId}
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full min-h-11 px-3 py-2 text-sm bg-bg border border-border rounded-field text-fg focus:outline-none focus:border-fg"
            />
          </div>

          <div>
            <label
              htmlFor={quantityInputId}
              className="block text-xs font-bold text-fg-muted mb-1"
            >
              Quantity
            </label>
            <input
              id={quantityInputId}
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full min-h-11 px-3 py-2 text-sm bg-bg border border-border rounded-field text-fg focus:outline-none focus:border-fg"
            />
          </div>
        </div>
      </fieldset>

      {/* Action Buttons to Trigger Events */}
      <fieldset className="border border-border rounded-card p-4 bg-bg-elevated">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-fg-muted">
          Dispatch Analytics Events
        </legend>
        <div className="flex flex-wrap gap-2.5 mt-2">
          <button
            type="button"
            onClick={handleTrackViewItem}
            className="min-h-11 px-4 py-2 text-xs font-bold rounded-full bg-fg text-bg hover:opacity-90 transition-opacity"
          >
            Track view_item
          </button>

          <button
            type="button"
            onClick={handleTrackAddToCart}
            className="min-h-11 px-4 py-2 text-xs font-bold rounded-full bg-fg text-bg hover:opacity-90 transition-opacity"
          >
            Track add_to_cart
          </button>

          <button
            type="button"
            onClick={handleTrackBeginCheckout}
            className="min-h-11 px-4 py-2 text-xs font-bold rounded-full border border-border text-fg hover:border-fg transition-colors"
          >
            Track begin_checkout
          </button>

          <button
            type="button"
            onClick={handleTrackSubscribe}
            className="min-h-11 px-4 py-2 text-xs font-bold rounded-full border border-border text-fg hover:border-fg transition-colors"
          >
            Track subscribe_newsletter
          </button>

          <button
            type="button"
            onClick={handleTrackQuizComplete}
            className="min-h-11 px-4 py-2 text-xs font-bold rounded-full border border-border text-fg hover:border-fg transition-colors"
          >
            Track quiz_complete
          </button>

          <button
            type="button"
            onClick={handleTrackPurchase}
            className="min-h-11 px-4 py-2 text-xs font-bold rounded-full border border-border text-fg hover:border-fg transition-colors"
          >
            Track purchase
          </button>
        </div>
      </fieldset>

      {/* Dispatch Activity Stream */}
      <div className="border border-border rounded-card p-4 bg-bg-elevated">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
            Recent Event Activity Log
          </span>
          {logs.length > 0 && (
            <button
              type="button"
              onClick={() => setLogs([])}
              className="text-xs text-fg-muted hover:text-fg underline"
            >
              Clear log
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-fg-muted py-2 italic">
            No events triggered yet. Click one of the buttons above to test
            tracking.
          </p>
        ) : (
          <ul
            aria-live="polite"
            className="divide-y divide-border text-xs font-mono space-y-1.5"
          >
            {logs.map((entry) => (
              <li
                key={entry.id}
                className="pt-1.5 flex flex-wrap items-start justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                      entry.tracked
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-border text-fg-muted border border-border"
                    }`}
                  >
                    {entry.tracked ? "Tracked" : "Blocked"}
                  </span>
                  <span className="font-bold text-fg">{entry.event}</span>
                  <span className="text-fg-muted">({entry.timestamp})</span>
                </div>
                <div className="text-fg-muted truncate max-w-xs sm:max-w-md">
                  {entry.tracked ? entry.details : `Blocked: ${entry.reason}`}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function W1_10Section() {
  return (
    <section aria-labelledby="section-w1-10-title" className="mb-16">
      <header className="mb-8">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Wave 1 · W1-10
        </span>
        <h2
          id="section-w1-10-title"
          className="title text-2xl sm:text-3xl font-black uppercase text-fg"
        >
          Analytics &amp; Event Tracking
        </h2>
        <p className="lead text-sm sm:text-base text-fg-muted mt-2 max-w-3xl">
          Unified tracking interface adhering to Section 6.5 of Plan v3.
          Dispatches typed events with Zod schema validation, enforced by strict
          consent checks against the analytics category. In development, events
          are logged to the console; in production, events route to Vercel
          Analytics.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ThemeAnalyticsWorkbench
          theme="human"
          title="Theme: Human (Dark, Warm)"
          subtitle="Cellular longevity and vitality formulas. Dispatches human line analytics."
          defaultSku="biohack"
          defaultName="BioHack"
          defaultPrice={59}
        />

        <ThemeAnalyticsWorkbench
          theme="pet"
          title="Theme: Pet (Light, Warm)"
          subtitle="Canine, feline and equine longevity supplements. Dispatches pet line analytics."
          defaultSku="more-good-years"
          defaultName="More Good Years"
          defaultPrice={44}
        />
      </div>
    </section>
  );
}
