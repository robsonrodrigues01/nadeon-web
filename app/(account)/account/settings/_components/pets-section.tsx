"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PetRegulatoryNotice } from "@/app/(pet)/pet/_components/pet-regulatory-notice";
import type { Market } from "@/lib/market/types";
import { PetForm } from "./pet-form";
import { PetRecommendations } from "./pet-recommendations";
import type { PetView, ProductView } from "./pet-views";

const SPECIES_LABEL = { dog: "Dog", cat: "Cat", horse: "Horse" } as const;
const ACTIVITY_LABEL = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
} as const;

export interface PetsSectionProps {
  pets: PetView[];
  products: ProductView[];
  concernOptions: string[];
  market: Market;
}

type Editing = PetView | "new" | null;

export function PetsSection({
  pets,
  products,
  concernOptions,
  market,
}: PetsSectionProps) {
  const [editing, setEditing] = useState<Editing>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(pets[0]?.id);
  const formOpen = editing !== null;

  return (
    <section
      id="pets"
      aria-labelledby="pets-heading"
      className="scroll-mt-24 flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="pets-heading"
            className="font-archivo text-2xl font-extrabold uppercase text-fg sm:text-3xl"
          >
            My pets
          </h2>
          <p className="mt-2 text-sm text-fg/75">
            Save each pet so we can suggest the right dose.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          aria-expanded={formOpen && editing === "new"}
          onClick={() => setEditing(editing === "new" ? null : "new")}
        >
          + Add pet
        </Button>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {pets.map((pet) => (
          <li
            key={pet.id}
            className="flex flex-col gap-4 rounded-card border border-border bg-bg-elevated p-5 sm:flex-row sm:p-6"
          >
            {pet.photoSrc ? (
              <Image
                src={pet.photoSrc}
                width={96}
                height={96}
                alt={`Photo of ${pet.name}`}
                className="h-24 w-24 shrink-0 rounded-card object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-card bg-gradient-gold font-archivo text-3xl font-extrabold text-accent-fg"
              >
                {pet.name.charAt(0).toUpperCase()}
              </span>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  {SPECIES_LABEL[pet.species]}
                </p>
                <h3 className="font-archivo text-xl font-extrabold uppercase text-fg">
                  {pet.name}
                </h3>
                <p className="text-sm text-fg/70">
                  Activity: {ACTIVITY_LABEL[pet.activityLevel]}
                  {pet.concerns[0] ? ` · Focus: ${pet.concerns[0]}` : ""}
                </p>
              </div>

              <dl className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-fg/60">
                    Breed
                  </dt>
                  <dd className="font-bold text-fg">{pet.breed}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-fg/60">
                    Weight
                  </dt>
                  <dd className="font-bold text-fg">
                    {pet.weightLbs !== undefined ? `${pet.weightLbs} lb` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-fg/60">
                    Age
                  </dt>
                  <dd className="font-bold text-fg">
                    {pet.ageYears !== undefined ? `${pet.ageYears} yrs` : ""}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-wrap gap-4">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setEditing(pet)}
                >
                  Edit profile
                </Button>
                <Button type="button" variant="link" size="sm" disabled>
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {editing !== null ? (
        <div id="pet-form-panel">
          <PetForm
            key={editing === "new" ? "new" : editing.id}
            pet={editing === "new" ? undefined : editing}
            concernOptions={concernOptions}
            onCancel={() => setEditing(null)}
            onSaved={() => setEditing(null)}
          />
        </div>
      ) : null}

      {selectedId ? (
        <PetRecommendations
          pets={pets}
          selectedId={selectedId}
          onSwitch={setSelectedId}
          products={products}
          market={market}
        />
      ) : null}

      <PetRegulatoryNotice />
    </section>
  );
}
