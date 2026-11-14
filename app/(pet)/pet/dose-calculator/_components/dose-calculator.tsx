"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import type { AddCartLineInput } from "@/lib/contracts/cart";
import { cartProvider } from "@/lib/providers/client";
import { Button } from "@/components/ui/button";
import {
  calculateDose,
  convertKgToLb,
  convertLbToKg,
  formatWeight,
  getSpeciesDosingTable,
  type ActivityLevel,
  type DoseResult,
  type PetAgeGroup,
  type PetSpecies,
  type WeightUnit,
} from "@/lib/dosing";

export interface DoseCalculatorProps {
  products: Product[];
}

interface CalculationResult {
  species: PetSpecies;
  weight: number;
  unit: WeightUnit;
  age: PetAgeGroup;
  activity: ActivityLevel;
  product: Product | null;
  dose: DoseResult;
}

const SPECIES_OPTIONS: { value: PetSpecies; label: string }[] = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "horse", label: "Horse" },
];

const AGE_OPTIONS: { value: PetAgeGroup; label: string }[] = [
  { value: "young", label: "Young" },
  { value: "adult", label: "Adult" },
  { value: "senior", label: "Senior" },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
];

const UNIT_OPTIONS: WeightUnit[] = ["lb", "kg"];

const CHOICE_BASE =
  "flex min-h-[48px] cursor-pointer items-center justify-center rounded-card border px-2 py-3 text-center text-sm font-bold transition-all focus-within:ring-2 focus-within:ring-accent";
const CHOICE_ON = "border-fg bg-fg text-bg shadow-sm";
const CHOICE_OFF = "border-border bg-bg text-fg hover:border-fg/40";

const TOGGLE_BASE =
  "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-pill px-3.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/** Catalog product used for the recommendation: first pet product of the species. */
export function findProductForSpecies(
  products: Product[],
  species: PetSpecies
): Product | null {
  return products.find((p) => p.species === species) ?? null;
}

/** Formats a catalog price with its own currency. */
export function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export function DoseCalculator({ products }: DoseCalculatorProps) {
  const [species, setSpecies] = useState<PetSpecies>("dog");
  const [unit, setUnit] = useState<WeightUnit>("lb");
  const [weightInput, setWeightInput] = useState<string>("");
  const [age, setAge] = useState<PetAgeGroup>("senior");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [tableSpecies, setTableSpecies] = useState<PetSpecies>("dog");
  const [cartStatus, setCartStatus] = useState<string | null>(null);

  const handleUnitChange = (next: WeightUnit) => {
    if (next === unit) return;
    const current = parseFloat(weightInput);
    if (Number.isFinite(current) && current > 0) {
      const converted =
        next === "kg" ? convertLbToKg(current, 1) : convertKgToLb(current, 1);
      setWeightInput(String(converted));
    }
    setUnit(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const weight = parseFloat(weightInput);
    if (!Number.isFinite(weight) || weight <= 0) {
      setResult(null);
      setError("Enter a weight above 0.");
      return;
    }
    const product = findProductForSpecies(products, species);
    const dose = calculateDose({
      species,
      weight,
      unit,
      age,
      activity,
      product,
    });
    setError(null);
    setCartStatus(null);
    setResult({ species, weight, unit, age, activity, product, dose });
  };

  const handleAddToCart = async (product: Product) => {
    const variant = product.variants[0];
    if (!variant) return;
    const line: AddCartLineInput = {
      variantId: variant.id,
      quantity: 1,
      sellingPlanId: null,
    };
    try {
      await cartProvider.addLines([line]);
      setCartStatus("Added to cart");
    } catch {
      setCartStatus("Could not add to cart. Try again.");
    }
  };

  const tableRows = getSpeciesDosingTable(tableSpecies);
  const tableLabel =
    SPECIES_OPTIONS.find((s) => s.value === tableSpecies)?.label ?? "Dog";

  return (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Inputs */}
      <form
        onSubmit={handleSubmit}
        aria-labelledby="dose-inputs-heading"
        className="space-y-2 lg:col-span-7"
      >
        <h2
          id="dose-inputs-heading"
          className="title mb-4 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl"
        >
          About your pet
        </h2>

        {/* 1. Species */}
        <fieldset className="space-y-4 border-b border-border py-6">
          <legend className="flex items-center gap-3 text-base font-extrabold">
            <StepNumber n={1} />
            Species
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {SPECIES_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`${CHOICE_BASE} ${
                  species === option.value ? CHOICE_ON : CHOICE_OFF
                }`}
              >
                <input
                  type="radio"
                  name="dose-species"
                  value={option.value}
                  checked={species === option.value}
                  onChange={() => setSpecies(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* 2. Weight */}
        <fieldset className="space-y-4 border-b border-border py-6">
          <legend className="flex w-full items-center gap-3 text-base font-extrabold">
            <StepNumber n={2} />
            Weight
            <span className="ml-auto text-xs font-medium text-fg-muted">
              Use a recent weigh-in
            </span>
          </legend>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <label htmlFor="dose-weight" className="sr-only">
                Pet weight in {unit}
              </label>
              <input
                id="dose-weight"
                name="weight"
                type="number"
                inputMode="decimal"
                min="0.5"
                step="0.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                aria-describedby={error ? "dose-weight-error" : undefined}
                aria-invalid={error ? true : undefined}
                className="w-full rounded-field border border-border bg-bg-elevated px-4 py-3 pr-14 text-lg font-bold text-fg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-fg-muted"
              >
                {unit}
              </span>
            </div>
            <div
              role="group"
              aria-label="Weight unit"
              className="inline-flex rounded-pill border border-border bg-bg-elevated p-1"
            >
              {UNIT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={unit === option}
                  onClick={() => handleUnitChange(option)}
                  className={`${TOGGLE_BASE} ${
                    unit === option
                      ? "bg-fg text-bg shadow-sm"
                      : "text-fg/70 hover:text-fg"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p
              id="dose-weight-error"
              role="alert"
              className="text-sm font-bold text-product-coral"
            >
              {error}
            </p>
          )}
        </fieldset>

        {/* 3. Age */}
        <fieldset className="space-y-4 border-b border-border py-6">
          <legend className="flex items-center gap-3 text-base font-extrabold">
            <StepNumber n={3} />
            Age
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {AGE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`${CHOICE_BASE} ${
                  age === option.value ? CHOICE_ON : CHOICE_OFF
                }`}
              >
                <input
                  type="radio"
                  name="dose-age"
                  value={option.value}
                  checked={age === option.value}
                  onChange={() => setAge(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* 4. Activity */}
        <fieldset className="space-y-4 py-6">
          <legend className="flex items-center gap-3 text-base font-extrabold">
            <StepNumber n={4} />
            Activity level
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {ACTIVITY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`${CHOICE_BASE} ${
                  activity === option.value ? CHOICE_ON : CHOICE_OFF
                }`}
              >
                <input
                  type="radio"
                  name="dose-activity"
                  value={option.value}
                  checked={activity === option.value}
                  onChange={() => setActivity(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="pt-4">
          <Button type="submit" size="lg">
            Calculate dose
          </Button>
        </div>
      </form>

      {/* Result */}
      <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
        <section className="rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between">
            <h2
              id="dose-result-heading"
              className="text-xs font-extrabold tracking-[0.12em] text-accent"
            >
              YOUR RESULT
            </h2>
          </div>

          {result ? (
            <ResultBody result={result} />
          ) : (
            <p className="mt-6 text-base text-fg-muted">
              Enter a weight and press Calculate dose.
            </p>
          )}
        </section>

        {result?.product && (
          <RecommendedProduct
            product={result.product}
            species={result.species}
            onAddToCart={handleAddToCart}
            cartStatus={cartStatus}
          />
        )}

        <section
          aria-labelledby="dose-vet-heading"
          className="space-y-2 rounded-card border border-border bg-bg-elevated p-5 text-xs leading-relaxed text-fg-muted"
        >
          <h2
            id="dose-vet-heading"
            className="text-xs font-extrabold uppercase tracking-wider text-fg"
          >
            Check with your vet first
          </h2>
          <p>
            This calculator gives a general starting point based on weight, age
            and activity. It is not veterinary advice. Talk to your veterinarian
            before starting any supplement, especially if your pet is pregnant,
            nursing, on medication or has a health condition. Stop use and call
            your vet if you notice any adverse reaction.
          </p>
        </section>
      </div>

      {/* Quick reference */}
      <section
        aria-labelledby="dose-reference-heading"
        className="space-y-6 border-t border-border pt-12 lg:col-span-12"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-accent">
              QUICK REFERENCE
            </p>
            <h2
              id="dose-reference-heading"
              className="title mt-2 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl"
            >
              Dose by weight
            </h2>
          </div>
          <div
            role="group"
            aria-label="Species for dose table"
            className="inline-flex flex-wrap gap-1 rounded-pill border border-border bg-bg-elevated p-1"
          >
            {SPECIES_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={tableSpecies === option.value}
                onClick={() => setTableSpecies(option.value)}
                className={`${TOGGLE_BASE} ${
                  tableSpecies === option.value
                    ? "bg-fg text-bg shadow-sm"
                    : "text-fg/70 hover:text-fg"
                }`}
              >
                {option.label}s
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-card border border-border bg-bg-elevated">
          <table className="w-full min-w-[480px] text-left text-sm">
            <caption className="sr-only">
              Dose by weight for {tableLabel.toLowerCase()}s
            </caption>
            <thead className="border-b border-border text-xs font-extrabold uppercase tracking-wider text-fg-muted">
              <tr>
                <th scope="col" className="px-5 py-4">
                  Weight
                </th>
                <th scope="col" className="px-5 py-4">
                  Dose
                </th>
                <th scope="col" className="px-5 py-4">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr
                  key={row.bandLabel}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <th scope="row" className="px-5 py-4 font-bold">
                    {row.bandLabel}
                  </th>
                  <td className="px-5 py-4 font-extrabold">{row.dose}</td>
                  <td className="px-5 py-4 text-fg-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-accent text-xs font-extrabold text-accent-fg"
    >
      {n}
    </span>
  );
}

function ResultBody({ result }: { result: CalculationResult }) {
  const { dose } = result;
  const speciesLabel =
    SPECIES_OPTIONS.find((s) => s.value === result.species)?.label ?? "";
  const ageLabel = AGE_OPTIONS.find((a) => a.value === result.age)?.label ?? "";
  const activityLabel =
    ACTIVITY_OPTIONS.find((a) => a.value === result.activity)?.label ?? "";

  return (
    <div className="mt-6 space-y-6">
      <p className="text-sm font-semibold text-fg-muted">
        {speciesLabel}, {formatWeight(result.weight, result.unit)}, {ageLabel},{" "}
        {activityLabel.toLowerCase()} activity
      </p>

      <div>
        <p className="title text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
          {dose.dose}
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-fg-muted">
          {dose.servingDescription}
        </p>
      </div>

      {dose.dailySchedule && (
        <div className="space-y-2 rounded-card border border-border bg-bg p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-fg-muted">
            Daily schedule
          </p>
          <div className="flex items-center justify-between gap-4 border-b border-border/50 py-2 text-sm">
            <span className="font-bold">Morning</span>
            <span className="text-right font-extrabold">
              {dose.dailySchedule.morning}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2 text-sm">
            <span className="font-bold">Evening</span>
            <span className="text-right font-extrabold">
              {dose.dailySchedule.evening}
            </span>
          </div>
        </div>
      )}

      {dose.starterGuideline && (
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-fg-muted">
            First week
          </p>
          <p className="text-sm leading-relaxed text-fg-muted">
            {dose.starterGuideline}
          </p>
        </div>
      )}
    </div>
  );
}

function RecommendedProduct({
  product,
  species,
  onAddToCart,
  cartStatus,
}: {
  product: Product;
  species: PetSpecies;
  onAddToCart: (product: Product) => void;
  cartStatus: string | null;
}) {
  const variant = product.variants[0];
  const plan = product.sellingPlans[0];
  const speciesLabel =
    SPECIES_OPTIONS.find((s) => s.value === species)?.label ?? "";

  return (
    <section
      aria-labelledby="dose-recommended-heading"
      className="rounded-card border border-border bg-bg-elevated p-5 sm:p-6"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-fg-muted">
        Recommended for your {speciesLabel.toLowerCase()}
      </p>
      <h2
        id="dose-recommended-heading"
        className="title mt-1 text-lg font-extrabold uppercase leading-tight"
      >
        <Link
          href={`/pet/products/${product.slug}`}
          className="underline underline-offset-4 hover:text-accent"
        >
          {product.name}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-fg-muted">
        {product.format} · {product.servingsPerJar} servings per jar
      </p>

      {variant && (
        <p className="mt-3 text-xl font-extrabold">
          {formatPrice(variant.price.amount, variant.price.currencyCode)}
        </p>
      )}
      {plan && (
        <p className="mt-1 text-xs text-fg-muted">
          Subscribe &amp; save {plan.discountPercentage}% · ships every{" "}
          {plan.intervalDays} days
        </p>
      )}

      {variant && (
        <div className="mt-4">
          <Button type="button" onClick={() => onAddToCart(product)}>
            Add to cart
          </Button>
        </div>
      )}
      <p
        role="status"
        aria-live="polite"
        className="mt-2 min-h-[1.25rem] text-sm font-bold"
      >
        {cartStatus}
      </p>
    </section>
  );
}
