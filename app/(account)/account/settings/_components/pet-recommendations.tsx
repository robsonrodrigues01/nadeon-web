"use client";

import { useState } from "react";
import { cartProvider } from "@/lib/providers/client";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import type { Market } from "@/lib/market/types";
import { calculateDose } from "@/lib/dosing/calculator";
import type { PetAgeGroup } from "@/lib/dosing/types";
import type { PetView, ProductView } from "./pet-views";

export interface PetRecommendationsProps {
  pets: PetView[];
  selectedId: string;
  onSwitch: (id: string) => void;
  products: ProductView[];
  market: Market;
}

function ageGroup(years?: number): PetAgeGroup {
  if (years === undefined) return "adult";
  if (years < 1) return "young";
  if (years >= 7) return "senior";
  return "adult";
}

function AddButton({ variantId, label }: { variantId: string; label: string }) {
  const [busy, setBusy] = useState(false);

  async function add() {
    setBusy(true);
    try {
      await cartProvider.addLines([{ variantId, quantity: 1 }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      isLoading={busy}
      onClick={add}
      aria-label={`Add ${label} to cart`}
    >
      Add
    </Button>
  );
}

export function PetRecommendations({
  pets,
  selectedId,
  onSwitch,
  products,
  market,
}: PetRecommendationsProps) {
  const pet = pets.find((p) => p.id === selectedId) ?? pets[0];
  if (!pet) return null;

  const matching = products.filter(
    (product) => product.species === pet.species
  );

  return (
    <section
      aria-labelledby="pet-recommendations-heading"
      className="rounded-card border border-border bg-bg-elevated p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">
            Picked by weight
          </p>
          <h3
            id="pet-recommendations-heading"
            className="mt-1 font-archivo text-xl font-extrabold uppercase text-fg"
          >
            Recommended for {pet.name}
          </h3>
          <p className="mt-1 text-sm text-fg/70">
            {pet.weightLbs !== undefined
              ? `Based on ${pet.name}'s weight (${pet.weightLbs} lb), age and health focus.`
              : `Based on ${pet.name}'s age and health focus.`}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="pet-switch" className="text-sm font-bold text-fg/85">
            Switch pet
          </label>
          <select
            id="pet-switch"
            value={pet.id}
            onChange={(event) => onSwitch(event.target.value)}
            className="min-h-11 rounded-field border border-border bg-bg/40 px-4 py-2 text-base text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {pets.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {matching.map((product) => {
          const dose =
            pet.weightLbs !== undefined
              ? calculateDose({
                  species: pet.species,
                  weight: pet.weightLbs,
                  unit: "lb",
                  age: ageGroup(pet.ageYears),
                  activity: pet.activityLevel,
                  product,
                }).dose
              : undefined;

          return (
            <li
              key={product.slug}
              className="flex flex-col justify-between gap-3 rounded-card border border-border p-4"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-fg/70">
                  {product.format}
                </p>
                <p className="mt-1 font-bold text-fg">{product.name}</p>
                {product.benefit ? (
                  <p className="mt-1 text-sm text-fg/85">
                    <Claim>{`${product.benefit} support*`}</Claim>
                  </p>
                ) : null}
                {dose && pet.weightLbs !== undefined ? (
                  <p className="mt-2 text-sm text-fg/70">
                    {dose} daily for {pet.weightLbs} lb
                  </p>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-fg">
                  {formatMoneyWithMarket(product.price, market)}
                </span>
                <AddButton variantId={product.variantId} label={product.name} />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-fg/70">
        Suggested dose uses the weight you entered. Check with your vet before
        starting, especially for pets with health conditions or on medication.
      </p>
    </section>
  );
}
