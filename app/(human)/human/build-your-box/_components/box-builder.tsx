"use client";

import React, { useState, useTransition } from "react";
import { openCartDrawer } from "@/components/commerce/cart-drawer";
import type { BoxProduct } from "./types";
import {
  boxTotals,
  defaultQuantity,
  formatCents,
  MAX_JARS_PER_LINE,
  planFor,
} from "./box-math";
import { startBoxSubscription } from "./actions";

export interface BoxBuilderProps {
  products: BoxProduct[];
  frequencies: number[];
  preselectedSlugs?: string[];
  locale?: string;
}

const FREQUENCY_LABELS: Record<number, { title: string; note: string }> = {
  30: { title: "30 days", note: "Monthly" },
  60: { title: "60 days", note: "Most flexible" },
  90: { title: "90 days", note: "Stock up" },
  120: { title: "120 days", note: "Fewer boxes" },
  180: { title: "180 days", note: "Twice a year" },
};

const STEP_BUTTON_STYLE =
  "min-h-11 min-w-11 inline-flex items-center justify-center rounded-pill px-3 font-bold text-fg";

export function BoxBuilder({
  products,
  frequencies,
  preselectedSlugs = [],
  locale = "en-US",
}: BoxBuilderProps) {
  const [intervalDays, setIntervalDays] = useState<number>(
    frequencies.includes(60) ? 60 : (frequencies[0] ?? 30)
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      products
        .filter((p) => preselectedSlugs.includes(p.slug))
        .map((p) => [p.slug, defaultQuantity(intervalDays)])
    )
  );
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [pending, startTransition] = useTransition();

  const selectedLines = products
    .filter((p) => quantities[p.slug] !== undefined)
    .map((product) => ({ product, quantity: quantities[product.slug] }));

  const totals = boxTotals(selectedLines, intervalDays);
  const currency = products[0]?.currencyCode ?? "USD";
  const activePlan = selectedLines[0]
    ? planFor(selectedLines[0].product, intervalDays)
    : undefined;
  const fmt = (cents: number) => formatCents(cents, currency, locale);

  function toggle(slug: string) {
    setQuantities((prev) => {
      const next = { ...prev };
      if (next[slug] === undefined) next[slug] = defaultQuantity(intervalDays);
      else delete next[slug];
      return next;
    });
  }

  function changeQuantity(slug: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[slug];
      if (current === undefined) return prev;
      const next = Math.min(MAX_JARS_PER_LINE, Math.max(1, current + delta));
      return { ...prev, [slug]: next };
    });
  }

  function changeFrequency(days: number) {
    setIntervalDays(days);
    setQuantities((prev) =>
      Object.fromEntries(
        Object.keys(prev).map((slug) => [slug, defaultQuantity(days)])
      )
    );
  }

  function startSubscription() {
    setStatus("idle");
    startTransition(async () => {
      const result = await startBoxSubscription({
        intervalDays,
        items: selectedLines.map(({ product, quantity }) => ({
          slug: product.slug,
          quantity,
        })),
      });
      if (result.ok) {
        openCartDrawer("human");
      } else {
        setStatus("error");
      }
    });
  }

  const jarWord = (n: number) => (n === 1 ? "jar" : "jars");
  const quantityForFrequency = defaultQuantity(intervalDays);

  return (
    <div className="flex flex-col gap-10 px-4 py-10 lg:flex-row lg:gap-16 lg:px-18">
      <div className="flex min-w-0 flex-1 flex-col gap-12">
        <section aria-labelledby="step-formulas">
          <StepHeading
            number={1}
            label="Step 1"
            title="Choose your formulas"
            id="step-formulas"
            aside={`${selectedLines.length} selected`}
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {products.map((product) => {
              const selected = quantities[product.slug] !== undefined;
              const plan = planFor(product, intervalDays);
              const subUnit = plan
                ? Math.round(
                    (Math.round(product.listPrice * 100) *
                      (100 - plan.discountPercentage)) /
                      100
                  )
                : Math.round(product.listPrice * 100);
              return (
                <li key={product.slug}>
                  <article
                    aria-labelledby={`product-${product.slug}`}
                    className={`flex h-full flex-row gap-4 rounded-card border-2 bg-bg-elevated p-3 lg:flex-col lg:p-4 ${
                      selected ? "border-accent" : "border-border"
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className="flex h-20 w-18 shrink-0 items-end justify-center rounded-card lg:h-40 lg:w-full"
                      style={{ backgroundColor: product.color }}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div>
                        <h3
                          id={`product-${product.slug}`}
                          className="font-archivo text-base font-extrabold"
                        >
                          {product.name}
                        </h3>
                        <p className="text-sm text-fg-muted">
                          {product.technicalName}
                        </p>
                      </div>
                      <p className="text-sm">
                        <span className="line-through opacity-50">
                          {fmt(Math.round(product.listPrice * 100))}
                        </span>{" "}
                        <strong className="text-accent">{fmt(subUnit)}</strong>
                        <span className="text-xs text-fg-muted"> /jar</span>
                      </p>
                      {selected ? (
                        <div className="mt-auto flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <div
                              role="group"
                              aria-label={`Quantity of ${product.name}`}
                              className="inline-flex items-center rounded-pill border-2 border-border"
                            >
                              <button
                                type="button"
                                aria-label={`Decrease ${product.name} quantity`}
                                className={STEP_BUTTON_STYLE}
                                onClick={() => changeQuantity(product.slug, -1)}
                              >
                                <span aria-hidden="true">−</span>
                              </button>
                              <output
                                aria-live="polite"
                                className="min-w-8 text-center font-extrabold"
                              >
                                {quantities[product.slug]}
                              </output>
                              <button
                                type="button"
                                aria-label={`Increase ${product.name} quantity`}
                                className={STEP_BUTTON_STYLE}
                                onClick={() => changeQuantity(product.slug, 1)}
                              >
                                <span aria-hidden="true">+</span>
                              </button>
                            </div>
                            <button
                              type="button"
                              className="min-h-11 px-2 text-sm underline"
                              onClick={() => toggle(product.slug)}
                            >
                              Remove
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-pressed="true"
                            aria-label={`${product.name} added to box, press to remove`}
                            className="min-h-11 rounded-pill bg-gradient-gold px-3 text-sm font-extrabold text-accent-fg"
                            onClick={() => toggle(product.slug)}
                          >
                            <span aria-hidden="true">✓ </span>Added
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          aria-pressed="false"
                          aria-label={`Add ${product.name}`}
                          className="mt-auto min-h-11 rounded-pill border-2 border-fg px-3 text-sm font-extrabold text-fg"
                          onClick={() => toggle(product.slug)}
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="step-frequency">
          <StepHeading
            number={2}
            label="Step 2"
            title="Choose your frequency"
            id="step-frequency"
          />
          <fieldset>
            <legend className="sr-only">Choose your frequency</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3">
              {frequencies.map((days) => {
                const label = FREQUENCY_LABELS[days] ?? {
                  title: `${days} days`,
                  note: "",
                };
                const id = `frequency-${days}`;
                return (
                  <div key={days} className="relative">
                    <input
                      type="radio"
                      id={id}
                      name="frequency"
                      value={days}
                      checked={intervalDays === days}
                      onChange={() => changeFrequency(days)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={id}
                      className={`flex min-h-11 cursor-pointer flex-col items-center rounded-card border-2 px-3 py-3 text-center peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                        intervalDays === days
                          ? "border-transparent bg-gradient-gold text-accent-fg"
                          : "border-border text-fg"
                      }`}
                    >
                      <span className="font-extrabold">{label.title}</span>
                      {label.note && (
                        <span className="text-xs opacity-75">{label.note}</span>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
          <p className="mt-4 rounded-card border border-border bg-bg-elevated p-4 text-sm leading-normal">
            Every {intervalDays} days we send a {intervalDays}-day supply, so
            quantity is set to {quantityForFrequency}{" "}
            {jarWord(quantityForFrequency)} of each formula. Change it anytime
            from your account.
          </p>
        </section>
      </div>

      <aside
        aria-labelledby="step-review"
        className="w-full shrink-0 rounded-card bg-fg p-6 text-bg shadow-elevated lg:sticky lg:top-6 lg:w-105"
      >
        <StepHeading
          number={3}
          label="Step 3"
          title="Review your box"
          id="step-review"
          inverted
        />

        <ul className="mt-4">
          {selectedLines.map(({ product, quantity }) => {
            const lineSubtotal = (() => {
              const t = boxTotals([{ product, quantity }], intervalDays);
              return t.subscriptionCents;
            })();
            return (
              <li
                key={product.slug}
                className="flex items-center justify-between gap-3 border-b border-current/10 py-3"
              >
                <div>
                  <p className="font-extrabold">{product.name}</p>
                  <p className="text-xs opacity-65">
                    Qty {quantity} · every {intervalDays} days
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="line-through opacity-45">
                    {fmt(
                      boxTotals([{ product, quantity }], intervalDays).listCents
                    )}
                  </p>
                  <p className="font-extrabold">{fmt(lineSubtotal)}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <dl className="mt-3 flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{fmt(totals.listCents)}</dd>
          </div>
          {activePlan && (
            <div className="flex justify-between font-bold">
              <dt>Subscribe &amp; save {activePlan.discountPercentage}%</dt>
              <dd>−{fmt(totals.savingsCents)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="font-bold">Free, every delivery</dd>
          </div>
        </dl>

        <div className="mt-2 flex items-baseline justify-between border-t-2 border-current pt-3">
          <span className="font-extrabold">Total per delivery</span>
          <span className="font-archivo text-3xl font-extrabold">
            {fmt(totals.subscriptionCents)}
          </span>
        </div>
        {totals.savingsCents > 0 && (
          <p className="mt-1 text-right text-xs opacity-65">
            You save {fmt(totals.savingsCents)} every box
          </p>
        )}

        <p className="mt-4 text-xs opacity-70">
          Then every {intervalDays} days. Charged when each box ships, with a
          reminder email 3 days before.
        </p>

        <div className="mt-4">
          <button
            type="button"
            disabled={selectedLines.length === 0 || pending}
            onClick={startSubscription}
            className="block min-h-11 w-full rounded-pill bg-gradient-gold px-7 py-4 text-base font-bold text-accent-fg disabled:opacity-50"
          >
            Start my subscription
          </button>
          {status === "error" && (
            <p role="alert" className="mt-2 text-sm">
              Check your selection and try again.
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-sm font-extrabold">
          Skip, pause or cancel anytime
        </p>
        <ul className="mt-3 flex justify-center gap-7 text-xs font-bold">
          <li>Skip</li>
          <li>Pause</li>
          <li>Cancel</li>
        </ul>
        <p className="mt-4 text-center text-xs opacity-55">
          60-day money-back guarantee.
        </p>
      </aside>
    </div>
  );
}

function StepHeading({
  number,
  label,
  title,
  id,
  aside,
  inverted = false,
}: {
  number: number;
  label: string;
  title: string;
  id: string;
  aside?: string;
  inverted?: boolean;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span
        aria-hidden="true"
        className={`flex size-12 shrink-0 items-center justify-center rounded-full font-archivo text-xl font-extrabold ${
          inverted ? "bg-bg text-fg" : "bg-gradient-gold text-accent-fg"
        }`}
      >
        {number}
      </span>
      <div>
        <p
          className={`text-xs font-extrabold tracking-widest ${
            inverted ? "text-accent" : "text-accent"
          }`}
        >
          {label.toUpperCase()}
        </p>
        <h2 id={id} className="font-archivo text-2xl font-extrabold uppercase">
          {title}
        </h2>
      </div>
      {aside && <span className="ml-auto text-sm text-fg-muted">{aside}</span>}
    </div>
  );
}
