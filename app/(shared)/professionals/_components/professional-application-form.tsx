"use client";

import { useActionState } from "react";
import {
  submitProfessionalApplication,
  type ProfessionalApplicationState,
} from "../actions";

const initialState: ProfessionalApplicationState = { status: "idle" };
const inputClass =
  "min-h-11 w-full rounded-field border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const professions = [
  "Medical doctor (MD, DO)",
  "Nutritionist or dietitian",
  "Personal trainer",
  "Health coach",
  "Veterinarian (DVM)",
  "Vet tech",
  "Animal trainer",
  "Groomer",
  "Other",
];

export function ProfessionalApplicationForm() {
  const [state, formAction, isPending] = useActionState(
    submitProfessionalApplication,
    initialState
  );

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <fieldset className="grid gap-3 sm:col-span-2">
        <legend className="font-bold">I work in</legend>
        <div className="flex flex-wrap gap-3">
          {[
            ["human", "Human health"],
            ["pet", "Pet health"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-border px-5 py-2 focus-within:ring-2 focus-within:ring-accent"
            >
              <input
                type="radio"
                name="audience"
                value={value}
                required
                className="accent-current"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="professional-name" className="text-sm font-bold">
          Full name
        </label>
        <input
          id="professional-name"
          name="fullName"
          autoComplete="name"
          required
          className={inputClass}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="professional-profession" className="text-sm font-bold">
          Profession
        </label>
        <select
          id="professional-profession"
          name="profession"
          defaultValue=""
          required
          className={inputClass}
        >
          <option value="" disabled>
            Select a profession
          </option>
          {professions.map((profession) => (
            <option key={profession} value={profession}>
              {profession}
            </option>
          ))}
        </select>
      </div>

      <TextField
        id="professional-license"
        name="licenseOrCredential"
        label="License or credential number"
        placeholder="To be confirmed"
        required
      />
      <TextField
        id="professional-practice"
        name="practice"
        label="Practice or clinic"
        placeholder="Practice name"
        autoComplete="organization"
        required
      />
      <TextField
        id="professional-state"
        name="state"
        label="State"
        placeholder="To be confirmed"
        required
      />
      <TextField
        id="professional-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@practice.com"
        required
      />
      <TextField
        id="professional-phone"
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        placeholder="To be confirmed"
        required
      />

      <div className="grid gap-2">
        <label htmlFor="professional-model" className="text-sm font-bold">
          How would you recommend Nadeon?
        </label>
        <select
          id="professional-model"
          name="recommendationModel"
          defaultValue=""
          required
          className={inputClass}
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="clinic">In-clinic sales</option>
          <option value="referral">Referral code</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className="grid gap-2 sm:col-span-2">
        <label htmlFor="professional-profile" className="text-sm font-bold">
          Anything else we should know? (optional)
        </label>
        <textarea
          id="professional-profile"
          name="audienceProfile"
          rows={4}
          placeholder="Patient or client profile, questions"
          className={inputClass}
        />
      </div>

      <p className="sm:col-span-2 text-sm text-fg-muted">
        Program terms: To be confirmed.
      </p>
      <label className="flex min-h-11 items-start gap-3 sm:col-span-2">
        <input
          type="checkbox"
          name="licenseConfirmation"
          required
          className="mt-1 size-4 accent-current"
        />
        <span>
          I confirm I hold an active license or credential in my field.
        </span>
      </label>
      <label className="flex min-h-11 items-start gap-3 sm:col-span-2">
        <input
          type="checkbox"
          name="termsAccepted"
          required
          className="mt-1 size-4 accent-current"
        />
        <span>
          I agree to the program terms and to make structure/function statements
          only.
        </span>
      </label>

      {state.status === "invalid" || state.status === "error" ? (
        <p role="alert" className="sm:col-span-2 text-sm text-fg">
          Unable to submit your application. Check the form and try again.
        </p>
      ) : null}
      {state.status === "submitted" ? (
        <p role="status" className="sm:col-span-2 text-sm text-fg">
          Application received. Next steps: To be confirmed.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="min-h-11 rounded-full bg-gradient-gold px-6 py-3 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
      >
        {isPending ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}

function TextField({
  id,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </div>
  );
}
