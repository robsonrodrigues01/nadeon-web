"use client";

import Link from "next/link";
import { useActionState } from "react";
import { WholesaleBusinessTypeSchema } from "@/lib/contracts/wholesale";
import {
  submitWholesaleApplication,
  type WholesaleApplicationState,
} from "../actions";

const initialState: WholesaleApplicationState = { status: "idle" };

const inputClass =
  "min-h-11 w-full rounded-field border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function WholesaleApplicationForm() {
  const [state, formAction, isPending] = useActionState(
    submitWholesaleApplication,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 grid gap-5 sm:grid-cols-2">
      <p className="sm:col-span-2 text-sm text-fg-muted">
        All fields required unless marked optional.
      </p>
      {[
        {
          id: "wholesale-business",
          name: "businessName",
          label: "Business name",
          placeholder: "Your store or practice",
          autoComplete: "organization",
        },
        {
          id: "wholesale-contact",
          name: "contactName",
          label: "Contact name",
          placeholder: "First and last name",
          autoComplete: "name",
        },
        {
          id: "wholesale-email",
          name: "email",
          label: "Email",
          placeholder: "name@business.com",
          type: "email",
          autoComplete: "email",
        },
        {
          id: "wholesale-phone",
          name: "phone",
          label: "Phone",
          placeholder: "(555) 000-0000",
          type: "tel",
          autoComplete: "tel",
        },
      ].map((field) => (
        <div key={field.name} className="grid gap-2">
          <label htmlFor={field.id} className="text-sm font-bold text-fg">
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.name}
            type={field.type ?? "text"}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            required
            className={inputClass}
          />
        </div>
      ))}

      <div className="grid gap-2">
        <label
          htmlFor="wholesale-website"
          className="text-sm font-bold text-fg"
        >
          Website or social (optional)
        </label>
        <input
          id="wholesale-website"
          name="website"
          type="url"
          placeholder="https://"
          autoComplete="url"
          className={inputClass}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="wholesale-type" className="text-sm font-bold text-fg">
          Business type
        </label>
        <select
          id="wholesale-type"
          name="businessType"
          required
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>
            Select one
          </option>
          {WholesaleBusinessTypeSchema.options.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {[
        {
          id: "wholesale-state",
          name: "state",
          label: "State",
          placeholder: "Select state",
          type: "text",
        },
        {
          id: "wholesale-locations",
          name: "locationCount",
          label: "Number of locations",
          placeholder: "Select",
          type: "number",
        },
        {
          id: "wholesale-reseller-id",
          name: "resellerPermitOrEin",
          label: "Reseller permit or EIN",
          placeholder: "Enter number",
          type: "text",
        },
        {
          id: "wholesale-monthly-order",
          name: "estimatedMonthlyOrder",
          label: "Estimated monthly order",
          placeholder: "Select a range",
          type: "text",
        },
      ].map((field) => (
        <div key={field.name} className="grid gap-2">
          <label htmlFor={field.id} className="text-sm font-bold text-fg">
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required
            className={inputClass}
          />
        </div>
      ))}

      <fieldset className="grid gap-3 sm:col-span-2">
        <legend className="text-sm font-bold text-fg">
          Lines you want to carry
        </legend>
        {[
          { id: "wholesale-human", value: "human", label: "Nadeon Human" },
          { id: "wholesale-pet", value: "pet", label: "Nadeon Pet" },
        ].map((line) => (
          <label
            key={line.value}
            htmlFor={line.id}
            className="flex min-h-11 items-center gap-3 text-sm text-fg"
          >
            <input
              id={line.id}
              name="productLines"
              value={line.value}
              type="checkbox"
              className="h-5 w-5 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            {line.label}
          </label>
        ))}
      </fieldset>

      <div className="grid gap-2 sm:col-span-2">
        <label
          htmlFor="wholesale-description"
          className="text-sm font-bold text-fg"
        >
          Tell us about your business (optional)
        </label>
        <textarea
          id="wholesale-description"
          name="description"
          placeholder="Customers, current brands, shelf space"
          rows={4}
          className={inputClass}
        />
      </div>

      <div className="grid gap-2 sm:col-span-2">
        <label
          htmlFor="wholesale-terms"
          className="flex min-h-11 items-center gap-3 text-sm text-fg"
        >
          <input
            id="wholesale-terms"
            name="termsAccepted"
            type="checkbox"
            required
            className="h-5 w-5 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          I agree to be contacted about wholesale and accept the Terms and
          Privacy Policy.
        </label>
        <p className="text-xs text-fg-muted">
          <Link
            href="/legal/terms"
            className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Terms
          </Link>{" "}
          ·{" "}
          <Link
            href="/legal/privacy"
            className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Privacy Policy
          </Link>
        </p>
      </div>

      {state.status === "invalid" && (
        <p role="alert" className="sm:col-span-2 text-sm text-fg">
          Check the required fields and try again.
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="sm:col-span-2 text-sm text-fg">
          We could not submit your application. Please try again.
        </p>
      )}
      {state.status === "submitted" && (
        <p role="status" className="sm:col-span-2 text-sm text-fg">
          Application received. A partner manager will reach out with pricing
          and next steps.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="min-h-11 rounded-pill bg-accent px-7 py-3 text-sm font-bold text-bg hover:brightness-110 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:col-span-2 sm:justify-self-start"
      >
        Submit application
      </button>
    </form>
  );
}
