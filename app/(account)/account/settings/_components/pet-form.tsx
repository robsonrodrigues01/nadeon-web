"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PetInputSchema, type Pet } from "@/lib/contracts/account";
import { savePetAction } from "./actions";
import type { PetView } from "./pet-views";

const INPUT_CLASS =
  "min-h-11 w-full rounded-field border border-border bg-bg/40 px-4 py-3 text-base text-fg placeholder:text-fg/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const LABEL_CLASS = "mb-2 block text-sm font-bold text-fg/85";
const LEGEND_CLASS = "mb-2 text-sm font-bold text-fg/85";
const OPTION_CLASS =
  "flex min-h-11 cursor-pointer items-center gap-2 rounded-field border border-border px-3 text-sm font-bold text-fg has-[:checked]:border-accent has-[:checked]:bg-accent/10 focus-within:ring-2 focus-within:ring-accent";

const SPECIES_OPTIONS = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "horse", label: "Horse" },
] as const;

const ACTIVITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
] as const;

export interface PetFormProps {
  pet?: PetView;
  concernOptions: string[];
  onCancel: () => void;
  onSaved: (pet: Pet) => void;
}

export function PetForm({
  pet,
  concernOptions,
  onCancel,
  onSaved,
}: PetFormProps) {
  const router = useRouter();
  const headingId = "pet-form-heading";
  const [status, setStatus] = useState<
    "idle" | "pending" | "invalid" | "error"
  >("idle");
  const [invalidField, setInvalidField] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);

  function validate(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const weight = String(data.get("weightLbs") ?? "").trim();
    const parsed = PetInputSchema.safeParse({
      id: String(data.get("id") ?? "").trim() || undefined,
      name: String(data.get("name") ?? "").trim(),
      species: String(data.get("species") ?? ""),
      breed: String(data.get("breed") ?? "").trim(),
      birthDate: String(data.get("birthDate") ?? "").trim() || undefined,
      weightLbs: weight ? Number(weight) : undefined,
      activityLevel: String(data.get("activityLevel") ?? "") || undefined,
      concerns: data.getAll("concerns").map(String),
      photoUrl: String(data.get("photoUrl") ?? "").trim() || undefined,
    });
    if (parsed.success) {
      setInvalidField("");
      return;
    }

    event.preventDefault();
    const field = String(parsed.error.issues[0]?.path[0] ?? "name");
    setStatus("invalid");
    setInvalidField(field);
    const control = form.elements.namedItem(field);
    const target = control instanceof RadioNodeList ? control[0] : control;
    if (target instanceof HTMLElement) target.focus();
  }

  async function submit(formData: FormData) {
    setStatus("pending");
    try {
      const saved = await savePetAction(formData);
      if (saved) {
        onSaved(saved);
        router.refresh();
      } else {
        setStatus("invalid");
        requestAnimationFrame(() => statusRef.current?.focus());
      }
    } catch {
      setStatus("error");
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-card border border-border bg-bg-elevated p-6 sm:p-7"
    >
      <h3
        id={headingId}
        className="font-archivo text-xl font-extrabold uppercase text-fg"
      >
        {pet ? "Edit profile" : "Add a pet"}
      </h3>
      {pet ? null : (
        <p className="mt-1 text-sm text-fg/70">All fields editable later</p>
      )}

      <form
        action={submit}
        onSubmit={validate}
        onChange={() => {
          if (invalidField) {
            setInvalidField("");
            setStatus("idle");
          }
        }}
        noValidate
        className="mt-5 grid gap-5"
      >
        {pet ? <input type="hidden" name="id" value={pet.id} /> : null}
        {pet?.photoUrl ? (
          <input type="hidden" name="photoUrl" value={pet.photoUrl} />
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" size="sm" disabled>
            Upload photo
          </Button>
          <span className="text-sm text-fg/70">JPG or PNG</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pet-name" className={LABEL_CLASS}>
              Pet name
            </label>
            <input
              id="pet-name"
              name="name"
              type="text"
              required
              defaultValue={pet?.name ?? ""}
              aria-invalid={invalidField === "name" || undefined}
              aria-describedby={
                invalidField === "name"
                  ? "pet-form-validation-error"
                  : undefined
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="pet-breed" className={LABEL_CLASS}>
              Breed
            </label>
            <input
              id="pet-breed"
              name="breed"
              type="text"
              required
              defaultValue={pet?.breed ?? ""}
              aria-invalid={invalidField === "breed" || undefined}
              aria-describedby={
                invalidField === "breed"
                  ? "pet-form-validation-error"
                  : undefined
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="pet-birth-date" className={LABEL_CLASS}>
              Birth date (or best guess)
            </label>
            <input
              id="pet-birth-date"
              name="birthDate"
              type="date"
              defaultValue={pet?.birthDate ?? ""}
              aria-invalid={invalidField === "birthDate" || undefined}
              aria-describedby={
                invalidField === "birthDate"
                  ? "pet-form-validation-error"
                  : undefined
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="pet-weight" className={LABEL_CLASS}>
              Weight
            </label>
            <input
              id="pet-weight"
              name="weightLbs"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              defaultValue={pet?.weightLbs ?? ""}
              aria-invalid={invalidField === "weightLbs" || undefined}
              aria-describedby={
                invalidField === "weightLbs"
                  ? "pet-weight-help pet-form-validation-error"
                  : "pet-weight-help"
              }
              className={INPUT_CLASS}
            />
            <span className="sr-only">lb</span>
            <p id="pet-weight-help" className="mt-2 text-xs text-fg/70">
              Used to work out the suggested dose.
            </p>
          </div>
        </div>

        <fieldset>
          <legend className={LEGEND_CLASS}>Species</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {SPECIES_OPTIONS.map((option) => (
              <label key={option.value} className={OPTION_CLASS}>
                <input
                  type="radio"
                  name="species"
                  value={option.value}
                  required
                  defaultChecked={(pet?.species ?? "dog") === option.value}
                  aria-invalid={invalidField === "species" || undefined}
                  aria-describedby={
                    invalidField === "species"
                      ? "pet-form-validation-error"
                      : undefined
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={LEGEND_CLASS}>Activity level</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {ACTIVITY_OPTIONS.map((option) => (
              <label key={option.value} className={OPTION_CLASS}>
                <input
                  type="radio"
                  name="activityLevel"
                  value={option.value}
                  defaultChecked={
                    (pet?.activityLevel ?? "moderate") === option.value
                  }
                  aria-invalid={invalidField === "activityLevel" || undefined}
                  aria-describedby={
                    invalidField === "activityLevel"
                      ? "pet-form-validation-error"
                      : undefined
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={LEGEND_CLASS}>Health focus (pick any)</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {concernOptions.map((concern) => (
              <label key={concern} className={OPTION_CLASS}>
                <input
                  type="checkbox"
                  name="concerns"
                  value={concern}
                  defaultChecked={pet?.concerns.includes(concern) ?? false}
                  aria-invalid={invalidField === "concerns" || undefined}
                  aria-describedby={
                    invalidField === "concerns"
                      ? "pet-form-validation-error"
                      : undefined
                  }
                />
                {concern}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={status === "pending"}>
            {status === "pending" ? "Saving..." : "Save pet"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <p
          id="pet-form-validation-error"
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="text-sm text-fg-muted"
        >
          {status === "invalid" &&
            "Please check the highlighted fields and try again."}
          {status === "error" && "Could not save your pet. Please try again."}
        </p>
      </form>
    </section>
  );
}
