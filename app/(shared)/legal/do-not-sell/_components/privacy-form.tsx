"use client";

import React, { useEffect, useRef, useState, useActionState } from "react";
import Link from "next/link";
import { submitPrivacyRequest, type PrivacyFormState } from "./actions";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
] as const;

const REQUEST_OPTIONS = [
  {
    id: "do_not_sell",
    title: "Do not sell or share my personal information",
    description:
      "Stop the sale or sharing of your data for cross-context behavioral advertising.",
  },
  {
    id: "access",
    title: "Access my personal information",
    description: "Get a copy of the personal information we hold about you.",
  },
  {
    id: "delete",
    title: "Delete my personal information",
    description: "Ask us to delete your data, with some legal exceptions.",
  },
  {
    id: "correct",
    title: "Correct my personal information",
    description: "Ask us to fix information that is inaccurate.",
  },
] as const;

const fieldClass =
  "min-h-11 w-full rounded-field border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const initialState: PrivacyFormState = { status: "idle" };

export function PrivacyRequestForm({
  initialFormState,
}: {
  initialFormState?: PrivacyFormState;
} = {}) {
  const [selectedType, setSelectedType] = useState<string>("do_not_sell");
  const [requestorType, setRequestorType] = useState<string>("consumer");
  const [resetKey, setResetKey] = useState<number>(0);

  const [state, formAction, isPending] = useActionState(
    submitPrivacyRequest,
    initialFormState ?? initialState
  );
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "invalid" || state.status === "error")
      statusRef.current?.focus();
  }, [state.status]);

  function handleReset() {
    setSelectedType("do_not_sell");
    setRequestorType("consumer");
    setResetKey((prev) => prev + 1);
  }

  // Confirmation state (State B)
  if (state.status === "success" && resetKey === 0) {
    return (
      <div
        data-testid="privacy-confirmation"
        className="rounded-card bg-bg-elevated border border-border p-6 sm:p-10 lg:p-12 shadow-sm text-center"
      >
        <div className="mx-auto flex size-16 sm:size-20 items-center justify-center rounded-full bg-product-mint/20 text-product-mint">
          <svg
            className="size-8 sm:size-10"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8.5l3.2 3L13 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="title text-2xl sm:text-4xl font-extrabold text-fg uppercase mt-4 sm:mt-5">
          Request received
        </h2>

        <p className="text-base sm:text-lg text-fg/80 mt-2 sm:mt-3 max-w-xl mx-auto leading-relaxed">
          Thanks. Your request has been received.
        </p>
        <p role="status" aria-live="polite" className="sr-only">
          Request received.
        </p>

        <div className="inline-block mt-4 rounded-field border border-dashed border-border px-4 py-2 text-sm text-fg">
          Reference <b>#{state.id || "To be confirmed"}</b>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8 pt-8 border-t border-border">
          <div className="flex items-start gap-3.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fg text-bg font-extrabold text-base"
              aria-hidden="true"
            >
              1
            </span>
            <div>
              <div className="font-extrabold text-fg text-base">Received</div>
              <p className="text-sm text-fg-muted mt-1 leading-relaxed">
                Your request is logged today, To be confirmed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fg text-bg font-extrabold text-base"
              aria-hidden="true"
            >
              2
            </span>
            <div>
              <div className="font-extrabold text-fg text-base">Verify</div>
              <p className="text-sm text-fg-muted mt-1 leading-relaxed">
                Check your inbox for a link from To be confirmed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fg text-bg font-extrabold text-base"
              aria-hidden="true"
            >
              3
            </span>
            <div>
              <div className="font-extrabold text-fg text-base">Done</div>
              <p className="text-sm text-fg-muted mt-1 leading-relaxed">
                We finish within To be confirmed days and email you the result.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-pill bg-fg text-bg px-6 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Back to home
          </Link>
          <Link
            href="/legal/privacy"
            className="inline-flex min-h-11 items-center justify-center rounded-pill border border-border bg-bg-elevated text-fg px-6 py-2.5 font-bold text-sm hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Read our Privacy Policy
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-11 items-center justify-center rounded-pill border border-border px-6 py-2.5 font-bold text-sm text-fg-muted hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  // Request form state (State A)
  return (
    <div className="rounded-card bg-bg-elevated border border-border p-5 sm:p-8 lg:p-9 shadow-sm">
      <div className="text-xs font-bold tracking-widest uppercase text-accent">
        Privacy request form
      </div>
      <h2 className="title text-2xl sm:text-3xl font-extrabold text-fg uppercase mt-2">
        Submit a request
      </h2>

      <form
        key={resetKey}
        action={formAction}
        className="mt-6 flex flex-col gap-6"
      >
        {/* Section 1: What would you like to do? */}
        <fieldset>
          <legend className="font-extrabold text-base sm:text-lg text-fg mb-3">
            1. What would you like to do?
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REQUEST_OPTIONS.map((opt) => {
              const isSelected = selectedType === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-4 rounded-card border cursor-pointer transition-all ${
                    isSelected
                      ? "border-fg bg-accent/20 text-fg shadow-sm"
                      : "border-border bg-bg-elevated hover:border-fg/40 text-fg"
                  }`}
                >
                  <input
                    type="radio"
                    name="requestType"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setSelectedType(opt.id)}
                    className="size-5 mt-0.5 accent-accent shrink-0"
                  />
                  <div>
                    <div className="font-bold text-sm sm:text-base leading-snug">
                      {opt.title}
                    </div>
                    <div
                      className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                        isSelected ? "text-fg/80" : "text-fg-muted"
                      }`}
                    >
                      {opt.description}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Shown only when correct is selected */}
          {selectedType === "correct" && (
            <div
              data-testid="correct-details-container"
              className="mt-4 border border-dashed border-border rounded-card p-4 bg-bg"
            >
              <div className="text-[11px] font-bold tracking-wider text-fg-muted uppercase mb-2">
                SHOWN ONLY WHEN &quot;CORRECT&quot; IS SELECTED
              </div>
              <label
                htmlFor="correct-details"
                className="text-sm font-bold text-fg block mb-2"
              >
                What should we correct?
              </label>
              <textarea
                id="correct-details"
                name="correctionDetails"
                rows={3}
                placeholder="Describe the information and the correct value"
                className={`${fieldClass} min-h-24`}
              />
            </div>
          )}
        </fieldset>

        {/* Section 2: Where do you live? */}
        <fieldset>
          <legend className="font-extrabold text-base sm:text-lg text-fg mb-3">
            2. Where do you live?
          </legend>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="state-residence"
              className="text-sm font-bold text-fg"
            >
              State of residence
            </label>
            <select
              id="state-residence"
              name="state"
              required
              defaultValue=""
              className={fieldClass}
            >
              <option value="" disabled>
                Select your state
              </option>
              {US_STATES.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-fg-muted">
              Rights differ by state. We apply the law of your state of
              residence.
            </p>
          </div>
        </fieldset>

        {/* Section 3: About you */}
        <fieldset>
          <legend className="font-extrabold text-base sm:text-lg text-fg mb-3">
            3. About you
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="first-name" className="text-sm font-bold text-fg">
                First name
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                placeholder="First name"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="last-name" className="text-sm font-bold text-fg">
                Last name
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                placeholder="Last name"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="user-email" className="text-sm font-bold text-fg">
                Email
              </label>
              <input
                id="user-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@email.com"
                className={fieldClass}
              />
              <p className="text-xs text-fg-muted">
                Use the email on your orders or account.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-bold text-fg">
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(555) 000-0000"
                className={fieldClass}
              />
            </div>

            <div className="sm:col-span-2 mt-2">
              <div className="text-sm font-bold text-fg mb-2.5">
                Who is submitting this request?
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="requestorType"
                    value="consumer"
                    checked={requestorType === "consumer"}
                    onChange={() => setRequestorType("consumer")}
                    className="size-5 mt-0.5 accent-accent"
                  />
                  <span className="font-bold text-sm sm:text-base text-fg">
                    I am the consumer
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="requestorType"
                    value="agent"
                    checked={requestorType === "agent"}
                    onChange={() => setRequestorType("agent")}
                    className="size-5 mt-0.5 accent-accent"
                  />
                  <div>
                    <div className="font-bold text-sm sm:text-base text-fg">
                      I am an authorized agent
                    </div>
                    <div className="text-xs text-fg-muted mt-0.5">
                      Proof of authorization will be requested.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Verification callout box */}
        <div className="rounded-card bg-accent/15 border border-accent/30 p-4 sm:p-5 flex gap-3 text-sm leading-relaxed text-fg">
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fg text-bg font-extrabold text-xs"
            aria-hidden="true"
          >
            i
          </span>
          <div>
            <b>How we verify you.</b> Opt-out requests do not need verification.
            For access, delete and correct requests we email a link to confirm
            it is you and may ask for To be confirmed details that match our
            records, such as a recent order number. We only use this information
            to verify your request To be confirmed.
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-3 text-sm cursor-pointer min-h-11 py-1">
          <input
            type="checkbox"
            name="confirmAccuracy"
            required
            className="size-5 mt-0.5 accent-accent shrink-0"
          />
          <span className="text-fg leading-relaxed">
            I confirm that I am the person named above, or I am authorized to
            act for them. The information I gave is accurate.
          </span>
        </label>

        {/* Submit button and status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-pill bg-fg text-bg px-8 py-3.5 font-bold text-base hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
          >
            {isPending ? "Submitting..." : "Submit request"}
          </button>
          <span className="text-xs sm:text-sm text-fg-muted">
            We respond within To be confirmed days as required by law.
          </span>
        </div>

        <p
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="text-sm"
        >
          {state.status === "invalid" && (
            <span className="text-red-600 font-medium">
              {state.error ||
                "Please fill in all required fields and try again."}
            </span>
          )}
          {state.status === "error" && (
            <span className="text-red-600 font-medium">
              {state.error ||
                "An error occurred while submitting your request. Please try again."}
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
