"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ProfileInputSchema,
  type CustomerProfile,
} from "@/lib/contracts/account";
import { Button } from "@/components/ui/button";
import { saveProfileFormAction, type ProfileFormState } from "./actions";
import { formatBirthday, parseBirthday } from "./birthday";

const INPUT_CLASS =
  "min-h-11 w-full rounded-field border border-border bg-bg/40 px-4 py-3 text-base text-fg placeholder:text-fg/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const LABEL_CLASS = "mb-2 block text-sm font-bold text-fg/85";

// Perfil do contrato: Human, Pet ou Both (mesmos termos da tela de criar conta).
const PROFILE_TYPES = ["Human", "Pet", "Both"] as const;

export interface ProfileFormProps {
  customer: CustomerProfile;
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const [state, action, isPending] = useActionState(saveProfileFormAction, {
    status: "idle",
  } satisfies ProfileFormState);
  const [clientError, setClientError] = useState("");
  const [invalidField, setInvalidField] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.status === "invalid" || state.status === "error")
      statusRef.current?.focus();
  }, [state.status]);

  function validate(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const birthday = parseBirthday(String(data.get("birthDate") ?? ""));
    const parsed = ProfileInputSchema.safeParse({
      firstName,
      lastName,
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim() || undefined,
      birthDate: birthday ?? undefined,
      profileType: String(data.get("profileType") ?? "") || undefined,
    });

    const field = !firstName
      ? "firstName"
      : !lastName
        ? "lastName"
        : !parsed.success
          ? String(parsed.error.issues[0]?.path[0] ?? "email")
          : birthday === null
            ? "birthDate"
            : "";
    if (!field) {
      setClientError("");
      setInvalidField("");
      return;
    }

    event.preventDefault();
    setInvalidField(field);
    setClientError(
      field === "firstName"
        ? "First name is required."
        : field === "lastName"
          ? "Last name is required."
          : field === "email"
            ? "Enter a valid email address."
            : "Enter a valid birthday or leave it blank."
    );
    const invalidControl = form.elements.namedItem(field);
    if (invalidControl instanceof HTMLElement) invalidControl.focus();
  }

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

      <form
        action={action}
        onSubmit={validate}
        onChange={() => {
          if (clientError) {
            setClientError("");
            setInvalidField("");
          }
        }}
        noValidate
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
            defaultValue={customer.firstName}
            aria-invalid={invalidField === "firstName" || undefined}
            aria-describedby={
              invalidField === "firstName"
                ? "profile-validation-error"
                : undefined
            }
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
            defaultValue={customer.lastName}
            aria-invalid={invalidField === "lastName" || undefined}
            aria-describedby={
              invalidField === "lastName"
                ? "profile-validation-error"
                : undefined
            }
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
            defaultValue={customer.email}
            aria-invalid={invalidField === "email" || undefined}
            aria-describedby={
              invalidField === "email" ? "profile-validation-error" : undefined
            }
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
            defaultValue={customer.phone ?? ""}
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
            defaultValue={formatBirthday(customer.birthDate)}
            aria-invalid={invalidField === "birthDate" || undefined}
            aria-describedby={
              invalidField === "birthDate"
                ? "profile-validation-error"
                : undefined
            }
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
            defaultValue={customer.profileType}
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
        <p
          id="profile-validation-error"
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="text-sm text-fg-muted sm:col-span-2"
        >
          {clientError}
          {!clientError &&
            state.status === "invalid" &&
            "Please check the highlighted fields and try again."}
          {!clientError &&
            state.status === "error" &&
            "Could not save your changes. Please try again."}
          {!clientError && state.status === "saved" && "Changes saved."}
        </p>
      </form>
    </section>
  );
}
