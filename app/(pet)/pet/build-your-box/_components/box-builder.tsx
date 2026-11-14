"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Product } from "@/lib/contracts/catalog";
import { STANDARD_WEIGHT_BANDS } from "@/lib/dosing/bands";
import type { PetSpecies, WeightBand } from "@/lib/dosing/types";
import { cartProvider } from "@/lib/providers/client";
import { MoneyDisplay } from "@/lib/market/money-display";
import { openCartDrawer } from "@/components/commerce/cart-drawer";
import { WeightSelector } from "@/components/commerce/weight-selector";
import { Button } from "@/components/ui/button";
import {
  AGE_OPTIONS,
  SPECIES_OPTIONS,
  boxTotals,
  buildBoxLines,
  frequencyHint,
  isIntervalAvailable,
  type BoxLine,
  type DoseGuideEntry,
  type PetAge,
} from "./box-helpers";

const DEFAULT_WEIGHT_ID = "21-to-50";
const DEFAULT_INTERVAL = 30;
const STEPS = ["Your pet", "Formulas", "Frequency", "Review"];

export interface BoxBuilderProps {
  products: Product[];
  intervals: number[];
  savePercentage: number;
  doseGuide: DoseGuideEntry[];
}

const groupClass = "border-0 p-0 m-0 min-w-0";
const legendClass =
  "text-xs font-bold uppercase tracking-wide text-fg/80 mb-2 p-0";
const chipClass =
  "min-h-11 inline-flex items-center justify-center rounded-pill border border-border bg-bg-elevated px-4 py-2 text-sm font-bold text-fg cursor-pointer peer-checked:border-accent peer-checked:text-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-disabled:opacity-50 peer-disabled:cursor-not-allowed";

export function BoxBuilder({
  products,
  intervals,
  savePercentage,
  doseGuide,
}: BoxBuilderProps) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<PetSpecies>("dog");
  const [bandId, setBandId] = useState(DEFAULT_WEIGHT_ID);
  const [age, setAge] = useState<PetAge>("adult");
  const [selected, setSelected] = useState<string[]>([]);
  const [interval, setInterval] = useState(intervals[0] ?? DEFAULT_INTERVAL);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const band: WeightBand =
    STANDARD_WEIGHT_BANDS.find((b) => b.id === bandId) ??
    STANDARD_WEIGHT_BANDS[1];
  const speciesOption = SPECIES_OPTIONS.find((s) => s.value === species);
  const ageOption = AGE_OPTIONS.find((a) => a.value === age);

  const speciesProducts = products.filter((p) => p.species === species);
  const allLines = buildBoxLines(speciesProducts, interval, band);
  const lines: BoxLine[] = allLines.filter((l) =>
    selected.includes(l.product.slug)
  );
  const chosenProducts = lines.map((l) => l.product);
  const totals = boxTotals(lines);
  const canStart =
    lines.length > 0 && lines.every((l) => l.sellingPlanId !== null);

  function chooseSpecies(next: PetSpecies) {
    setSpecies(next);
    setSelected([]);
  }

  function toggleProduct(slug: string) {
    setSelected((cur) =>
      cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]
    );
  }

  function resetPet() {
    setName("");
    setSpecies("dog");
    setBandId(DEFAULT_WEIGHT_ID);
    setAge("adult");
    setSelected([]);
    setInterval(intervals[0] ?? DEFAULT_INTERVAL);
    setFailed(false);
  }

  async function startSubscription() {
    setFailed(false);
    setPending(true);
    try {
      await cartProvider.addLines(
        lines.map((l) => ({
          variantId: l.variantId,
          quantity: 1,
          sellingPlanId: l.sellingPlanId,
        }))
      );
      openCartDrawer();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  const petLine = [
    name ? `For ${name}` : null,
    speciesOption?.label,
    band.labelLbs,
    ageOption?.label,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12 py-10 sm:py-14 space-y-12">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
          <li>
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-accent"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/pet"
              className="underline underline-offset-4 hover:text-accent"
            >
              Pet
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            Build your box
          </li>
        </ol>
      </nav>

      <header className="space-y-3 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          Subscribe &amp; save {savePercentage}%
        </p>
        <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-fg">
          Build their box
        </h1>
        <p className="text-fg-muted">
          Tell us about your pet, pick their formulas and set the rhythm. Doses
          are worked out by weight. Save {savePercentage}% and ship free on
          every box.
        </p>
      </header>

      <ol className="flex flex-wrap gap-3 text-sm font-bold text-fg-muted">
        {STEPS.map((label, index) => (
          <li key={label} className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-pill border border-border">
              {index}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {/* Step 0: your pet */}
      <section aria-labelledby="step-0-title" className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            Step 0
          </p>
          <h2 id="step-0-title" className="text-2xl font-normal text-fg">
            Tell us about your pet
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="pet-name"
              className="block text-xs font-bold uppercase tracking-wide text-fg/80 mb-2"
            >
              Pet name
            </label>
            <input
              id="pet-name"
              name="petName"
              type="text"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11 w-full rounded-field border border-border bg-bg-elevated px-4 py-2 text-fg"
            />
          </div>

          <fieldset className={groupClass}>
            <legend className={legendClass}>Species</legend>
            <div className="flex flex-wrap gap-2">
              {SPECIES_OPTIONS.map((option) => (
                <label key={option.value} className="inline-flex">
                  <input
                    type="radio"
                    name="species"
                    value={option.value}
                    checked={species === option.value}
                    onChange={() => chooseSpecies(option.value)}
                    className="peer sr-only"
                  />
                  <span className={chipClass}>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <WeightSelector
          legend="Weight"
          name="weight"
          selectedId={band.id}
          onChange={(next) => setBandId(next.id)}
        />

        <fieldset className={groupClass}>
          <legend className={legendClass}>Age</legend>
          <div className="flex flex-wrap gap-2">
            {AGE_OPTIONS.map((option) => (
              <label key={option.value} className="inline-flex">
                <input
                  type="radio"
                  name="age"
                  value={option.value}
                  checked={age === option.value}
                  onChange={() => setAge(option.value)}
                  className="peer sr-only"
                />
                <span className={chipClass}>
                  {option.label}
                  <span className="ml-2 font-normal text-fg-muted">
                    {option.hint}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {/* Step 1: formulas */}
      <section aria-labelledby="step-1-title" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Step 1
            </p>
            <h2 id="step-1-title" className="text-2xl font-normal text-fg">
              Choose formulas{name ? ` for ${name}` : ""}
            </h2>
          </div>
          <p className="text-sm text-fg-muted">
            {chosenProducts.length} selected
          </p>
        </div>
        <p className="text-sm text-fg-muted">
          Showing {speciesProducts.length} formulas for {speciesOption?.plural}.
          Doses calculated for {band.labelLbs}.
        </p>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {allLines.map((line) => {
            const isSelected = selected.includes(line.product.slug);
            const active = line.product.actives[0];
            return (
              <li
                key={line.product.slug}
                className="flex flex-col gap-3 rounded-card border border-border bg-bg-elevated p-4"
              >
                <div>
                  <h3 className="text-base font-bold text-fg">
                    {line.product.name}
                  </h3>
                  <p className="text-sm text-fg-muted">
                    {line.product.format}
                    {active ? ` · ${active.name} ${active.amount}` : ""}
                  </p>
                </div>
                <p className="flex flex-wrap items-baseline gap-2">
                  {line.sellingPlanId ? (
                    <>
                      <s className="text-sm text-fg-muted">
                        <MoneyDisplay money={line.list} />
                      </s>
                      <MoneyDisplay
                        money={line.subscription}
                        className="font-bold"
                      />
                    </>
                  ) : (
                    <MoneyDisplay money={line.list} className="font-bold" />
                  )}
                </p>
                {line.dose ? (
                  <p className="text-sm text-fg">Dose: {line.dose}</p>
                ) : null}
                {isSelected ? (
                  <div className="mt-auto flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-accent">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Added
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      aria-label={`Remove ${line.product.name}`}
                      onClick={() => toggleProduct(line.product.slug)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-auto"
                    aria-label={`Add ${line.product.name}`}
                    onClick={() => toggleProduct(line.product.slug)}
                  >
                    + Add
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Step 2: frequency */}
      <section aria-labelledby="step-2-title" className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            Step 2
          </p>
          <fieldset className={groupClass}>
            <legend
              id="step-2-title"
              className="text-2xl font-normal text-fg mb-4 p-0"
            >
              Choose your frequency
            </legend>
            <div className="flex flex-wrap gap-2">
              {intervals.map((days) => {
                const available = isIntervalAvailable(chosenProducts, days);
                return (
                  <label key={days} className="inline-flex">
                    <input
                      type="radio"
                      name="frequency"
                      value={days}
                      checked={interval === days}
                      disabled={!available}
                      onChange={() => setInterval(days)}
                      className="peer sr-only"
                    />
                    <span className={`${chipClass} flex-col items-start`}>
                      <span>{days} days</span>
                      {frequencyHint(days) ? (
                        <span className="font-normal text-fg-muted">
                          {frequencyHint(days)}
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </section>

      {/* Step 3: review */}
      <section aria-labelledby="step-3-title" className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            Step 3
          </p>
          <h2 id="step-3-title" className="text-2xl font-normal text-fg">
            Review your box
          </h2>
        </div>

        {lines.length === 0 ? (
          <p className="text-fg-muted">
            Add at least one formula to review your box.
          </p>
        ) : (
          <div className="rounded-card border border-border bg-bg-elevated p-5 sm:p-6 space-y-5">
            <p className="text-sm text-fg-muted">{petLine}</p>

            <ul className="space-y-3">
              {lines.map((line) => (
                <li
                  key={line.product.slug}
                  className="flex flex-wrap items-baseline justify-between gap-2"
                >
                  <span>
                    <span className="font-bold text-fg">
                      {line.product.name}
                    </span>{" "}
                    <span className="text-sm text-fg-muted">
                      every {interval} days
                    </span>
                  </span>
                  <span className="flex gap-2">
                    {line.sellingPlanId ? (
                      <s className="text-sm text-fg-muted">
                        <MoneyDisplay money={line.list} />
                      </s>
                    ) : null}
                    <MoneyDisplay
                      money={line.sellingPlanId ? line.subscription : line.list}
                      className="font-bold"
                    />
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>
                  <MoneyDisplay money={totals.subtotal} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Subscribe &amp; save {totals.discountPercentage}%</dt>
                <dd>
                  −<MoneyDisplay money={totals.savings} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>Free, every delivery</dd>
              </div>
              <div className="flex justify-between font-bold">
                <dt>Total per delivery</dt>
                <dd>
                  <MoneyDisplay money={totals.total} />
                </dd>
              </div>
            </dl>

            <p className="text-sm text-fg-muted">
              You save <MoneyDisplay money={totals.savings} /> every box
            </p>
          </div>
        )}

        <p className="text-sm text-fg-muted">
          Then every {interval} days. Charged when each box ships, with a
          reminder email 3 days before.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            type="button"
            size="lg"
            disabled={!canStart}
            isLoading={pending}
            onClick={startSubscription}
          >
            Start my subscription
          </Button>
          <p className="text-sm text-fg-muted">Skip, pause or cancel anytime</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={resetPet}
          >
            + Add another pet
          </Button>
        </div>

        {failed ? (
          <p role="alert" className="text-sm font-bold text-accent">
            We could not add your box. Try again.
          </p>
        ) : null}

        <p className="text-sm text-fg-muted">60-day money-back guarantee.</p>
      </section>

      {/* Subscription FAQ: only the answered question from the design */}
      <section aria-labelledby="faq-title" className="space-y-4 max-w-2xl">
        <h2 id="faq-title" className="text-2xl font-normal text-fg">
          Subscription questions
        </h2>
        <details className="rounded-card border border-border bg-bg-elevated p-4">
          <summary className="cursor-pointer font-bold text-fg min-h-11 flex items-center">
            How do you work out the dose?
          </summary>
          <div className="mt-3 space-y-3 text-fg-muted">
            <p>
              From your pet&apos;s species and weight, using the serving guide
              on each label.
            </p>
            {doseGuide.map((entry) => (
              <div key={entry.format}>
                <p className="font-bold text-fg">{entry.format}</p>
                <ul className="list-disc pl-5">
                  {entry.ranges
                    .filter((range) => range.dose !== null)
                    .map((range) => (
                      <li key={range.label}>
                        {range.label}: {range.dose}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </section>
    </div>
  );
}
