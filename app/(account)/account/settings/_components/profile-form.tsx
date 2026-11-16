"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomerProfile } from "@/lib/contracts/account";
import { Button } from "@/components/ui/button";
import { saveProfileWithFeedback, type ProfileFormState } from "./actions";
import { formatBirthday } from "./birthday";

const INPUT_CLASS =
  "min-h-11 w-full rounded-field border border-border bg-bg/40 px-4 py-3 text-base text-fg placeholder:text-fg/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const LABEL_CLASS = "mb-2 block text-sm font-bold text-fg/85";

// Perfil do contrato: Human, Pet ou Both (mesmos termos da tela de criar conta).
const PROFILE_TYPES = ["Human", "Pet", "Both"] as const;

type ProfileFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  profileType: CustomerProfile["profileType"];
};

function toProfileFields(customer: CustomerProfile): ProfileFields {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone ?? "",
    birthDate: formatBirthday(customer.birthDate),
    profileType: customer.profileType,
  };
}

export interface ProfileFormProps {
  customer: CustomerProfile;
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const router = useRouter();
  const initialState: ProfileFormState = { status: "idle" };
  const [state, formAction, isPending] = useActionState(
    saveProfileWithFeedback,
    initialState
  );
  const [fields, setFields] = useState(() => toProfileFields(customer));

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [router, state]);

  const updateField = <Key extends keyof ProfileFields>(
    key: Key,
    value: ProfileFields[Key]
  ) => setFields((current) => ({ ...current, [key]: value }));

  return (
    <section
      aria-labelledby="profile-heading"
      className="rounded-card border border-border bg-bg-elevated p-6 sm:p-7"
    >
      <h2
        id="profile-heading"
        className="text-xs font-bold uppercase tracking-[0.12em] text-accent"
      >
        Profile
      </h2>

      {state.status === "success" ? (
        <p role="status" aria-live="polite" className="mt-4 text-sm text-fg">
          {state.message}
        </p>
      ) : null}
      {state.status === "error" ? (
        <p
          role="alert"
          aria-live="assertive"
          className="mt-4 text-sm text-product-coral"
        >
          {state.message}
        </p>
      ) : null}
      <form
        action={formAction}
        aria-busy={isPending}
        className="mt-5 grid gap-4 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="profile-first-name" className={LABEL_CLASS}>
            First name
          </label>
          <input
            id="profile-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={fields.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="profile-last-name" className={LABEL_CLASS}>
            Last name
          </label>
          <input
            id="profile-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={fields.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="profile-email" className={LABEL_CLASS}>
            Email
          </label>
          <input
            id="profile-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className={LABEL_CLASS}>
            Phone
          </label>
          <input
            id="profile-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="profile-birthday" className={LABEL_CLASS}>
            Birthday (optional)
          </label>
          <input
            id="profile-birthday"
            name="birthDate"
            type="text"
            inputMode="numeric"
            placeholder="MM / DD"
            value={fields.birthDate}
            onChange={(event) => updateField("birthDate", event.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="profile-type" className={LABEL_CLASS}>
            Shopping for
          </label>
          <select
            id="profile-type"
            name="profileType"
            value={fields.profileType}
            onChange={(event) =>
              updateField(
                "profileType",
                event.target.value as CustomerProfile["profileType"]
              )
            }
            className={INPUT_CLASS}
          >
            {PROFILE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </section>
  );
}
