"use client";

import { useActionState } from "react";
import {
  affiliateAudienceSizeOptions,
  affiliateNicheOptions,
} from "../application-schema";
import {
  submitAffiliateApplication,
  type AffiliateApplicationState,
} from "../actions";

const initialState: AffiliateApplicationState = { status: "idle" };
const inputClass =
  "min-h-11 w-full rounded-field border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function AffiliateApplicationForm() {
  const [state, formAction, isPending] = useActionState(
    submitAffiliateApplication,
    initialState
  );

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <TextField
        id="affiliate-name"
        name="fullName"
        label="Full name"
        placeholder="First and last name"
        autoComplete="name"
      />
      <TextField
        id="affiliate-email"
        name="email"
        label="Email"
        placeholder="To be confirmed"
        type="email"
        autoComplete="email"
      />
      <TextField
        id="affiliate-social"
        name="socialHandles"
        label="Social handles"
        placeholder="To be confirmed"
      />
      <div className="grid gap-2">
        <label htmlFor="affiliate-links" className="text-sm font-bold">
          Content links
        </label>
        <textarea
          id="affiliate-links"
          name="contentLinks"
          rows={4}
          required
          placeholder="Add 2 or 3 links to recent posts or episodes, one per line"
          className={inputClass}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="affiliate-audience" className="text-sm font-bold">
          Audience size range
        </label>
        <select
          id="affiliate-audience"
          name="audienceSize"
          defaultValue=""
          required
          className={inputClass}
        >
          <option value="" disabled>
            Select a range
          </option>
          {affiliateAudienceSizeOptions.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="affiliate-niche" className="text-sm font-bold">
          Niche
        </label>
        <select
          id="affiliate-niche"
          name="niche"
          defaultValue=""
          required
          className={inputClass}
        >
          <option value="" disabled>
            Select a niche
          </option>
          {affiliateNicheOptions.map((niche) => (
            <option key={niche} value={niche.toLowerCase()}>
              {niche}
            </option>
          ))}
        </select>
      </div>

      <p className="sm:col-span-2 text-sm text-fg-muted">
        Affiliate program terms and content guidelines: To be confirmed.
      </p>
      <label className="flex min-h-11 items-start gap-3 sm:col-span-2">
        <input
          type="checkbox"
          name="guidelinesAccepted"
          required
          className="mt-1 size-4 accent-current"
        />
        <span>I acknowledge the content guidelines are To be confirmed.</span>
      </label>
      <label className="flex min-h-11 items-start gap-3 sm:col-span-2">
        <input
          type="checkbox"
          name="disclosureAccepted"
          required
          className="mt-1 size-4 accent-current"
        />
        <span>I will disclose the partnership in every post.</span>
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
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
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
        required
        className={inputClass}
      />
    </div>
  );
}
