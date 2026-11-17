"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Pet } from "@/lib/contracts/account";
import { removePetAction, savePetAction } from "./actions";

const initialState = { status: "idle" as const };

function ActionMessage({
  status,
  message,
}: {
  status: "idle" | "success" | "invalid" | "error";
  message?: string;
}) {
  if (status === "idle") return null;
  return (
    <p
      role={status === "success" ? "status" : "alert"}
      className="text-sm text-fg-muted"
    >
      {message}
    </p>
  );
}

function PetForm({ pet }: { pet?: Pet }) {
  const [state, formAction, pending] = useActionState(
    savePetAction,
    initialState
  );
  const prefix = pet?.id ?? "new-pet";

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {pet && <input type="hidden" name="id" value={pet.id} />}
      <label
        className="grid gap-1.5 text-sm font-bold"
        htmlFor={`${prefix}-name`}
      >
        Pet name
        <input
          id={`${prefix}-name`}
          name="name"
          required
          maxLength={100}
          defaultValue={pet?.name ?? ""}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <label
        className="grid gap-1.5 text-sm font-bold"
        htmlFor={`${prefix}-species`}
      >
        Species
        <select
          id={`${prefix}-species`}
          name="species"
          required
          defaultValue={pet?.species ?? "dog"}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="horse">Horse</option>
        </select>
      </label>
      <label
        className="grid gap-1.5 text-sm font-bold"
        htmlFor={`${prefix}-breed`}
      >
        Breed
        <input
          id={`${prefix}-breed`}
          name="breed"
          required
          maxLength={100}
          defaultValue={pet?.breed ?? ""}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <label
        className="grid gap-1.5 text-sm font-bold"
        htmlFor={`${prefix}-birth-date`}
      >
        Birth date (or best guess)
        <input
          id={`${prefix}-birth-date`}
          name="birthDate"
          type="date"
          defaultValue={pet?.birthDate ?? ""}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <label
        className="grid gap-1.5 text-sm font-bold"
        htmlFor={`${prefix}-weight`}
      >
        Weight (lb)
        <input
          id={`${prefix}-weight`}
          name="weightLbs"
          type="number"
          min="0.1"
          step="0.1"
          defaultValue={pet?.weightLbs ?? ""}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <label
        className="grid gap-1.5 text-sm font-bold"
        htmlFor={`${prefix}-activity`}
      >
        Activity level
        <select
          id={`${prefix}-activity`}
          name="activityLevel"
          defaultValue={pet?.activityLevel ?? ""}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="">To be confirmed</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
      </label>
      <div className="sm:col-span-2">
        <p className="text-sm font-bold">Photo</p>
        <p className="mt-1 text-sm text-fg-muted">To be confirmed</p>
      </div>
      <div className="sm:col-span-2">
        <p className="text-sm font-bold">Health focus</p>
        <p className="mt-1 text-sm text-fg-muted">To be confirmed</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-fg px-6 font-bold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
        >
          Save pet
        </button>
        <button
          type="reset"
          className="inline-flex min-h-11 items-center justify-center rounded-full px-4 font-bold text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Cancel
        </button>
        <ActionMessage status={state.status} message={state.message} />
      </div>
    </form>
  );
}

function RemovePetForm({ petId }: { petId: string }) {
  const [state, formAction, pending] = useActionState(
    removePetAction,
    initialState
  );
  return (
    <form action={formAction} className="mt-3">
      <input type="hidden" name="id" value={petId} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center rounded-full border border-product-coral px-4 font-bold text-product-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
      >
        Remove
      </button>
      <ActionMessage status={state.status} message={state.message} />
    </form>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  const activity = pet.activityLevel
    ? pet.activityLevel[0].toUpperCase() + pet.activityLevel.slice(1)
    : "To be confirmed";

  return (
    <article className="rounded-card border border-border bg-bg-elevated p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-archivo text-xl font-extrabold uppercase">
            {pet.name}
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            {pet.species[0].toUpperCase() + pet.species.slice(1)} · Activity:{" "}
            {activity}
          </p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-bold uppercase">
          Photo: To be confirmed
        </span>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 rounded-field bg-bg p-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-fg-muted">
            Breed
          </dt>
          <dd className="mt-1 font-bold">{pet.breed || "To be confirmed"}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-fg-muted">
            Weight
          </dt>
          <dd className="mt-1 font-bold">
            {pet.weightLbs ? `${pet.weightLbs} lb` : "To be confirmed"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-fg-muted">
            Age
          </dt>
          <dd className="mt-1 font-bold">To be confirmed</dd>
        </div>
      </dl>
      <details className="mt-4">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-bold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          Edit profile
        </summary>
        <div className="mt-4 rounded-field border border-border p-4">
          <PetForm pet={pet} />
        </div>
      </details>
      <RemovePetForm petId={pet.id} />
    </article>
  );
}

export function PetProfileManager({ pets }: { pets: Pet[] }) {
  return (
    <div className="space-y-8">
      <ul className="grid gap-4 lg:grid-cols-2">
        {pets.map((pet) => (
          <li key={pet.id}>
            <PetCard pet={pet} />
          </li>
        ))}
        <li>
          <Link
            href="#new-pet"
            className="flex min-h-32 flex-col items-center justify-center rounded-card border-2 border-dashed border-border p-5 text-center font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span aria-hidden="true" className="text-3xl">
              +
            </span>
            Add pet
            <span className="mt-1 text-sm font-normal text-fg-muted">
              To be confirmed
            </span>
          </Link>
        </li>
      </ul>
      <section
        id="new-pet"
        aria-labelledby="new-pet-title"
        className="rounded-card border border-border bg-bg-elevated p-5 sm:p-8"
      >
        <h2
          id="new-pet-title"
          className="mb-5 font-archivo text-xl font-extrabold uppercase"
        >
          Add a pet
        </h2>
        <PetForm />
      </section>
      <section
        aria-labelledby="recommendations-title"
        className="rounded-card border border-border bg-bg-elevated p-5 sm:p-8"
      >
        <h2
          id="recommendations-title"
          className="font-archivo text-xl font-extrabold uppercase"
        >
          Picked by weight
        </h2>
        <p className="mt-3 text-sm text-fg-muted">To be confirmed</p>
      </section>
    </div>
  );
}
