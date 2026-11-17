"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { EmailPreferences } from "@/lib/contracts/email-preferences";
import {
  emailPreferencesAction,
  type EmailPreferencesActionState,
} from "./actions";

const initialState: EmailPreferencesActionState = { status: "idle" };

const topics = [
  {
    name: "subscriptionReminders",
    title: "Subscription reminders",
    audience: "All",
    description: "To be confirmed",
  },
  {
    name: "humanNews",
    title: "Human news",
    audience: "Human",
    description: "New formulas, science updates and routines.",
  },
  {
    name: "petNews",
    title: "Pet news",
    audience: "Pet",
    description: "New pet formulas, dosing guides and pet care tips.",
  },
  {
    name: "journal",
    title: "Journal",
    audience: "All",
    description: "New articles from the Nadeon Journal.",
  },
  {
    name: "offers",
    title: "Offers",
    audience: "All",
    description: "To be confirmed",
  },
] as const;

export function EmailPreferencesForm({
  initialPreferences,
  maskedEmail,
  shopHref,
}: {
  initialPreferences: EmailPreferences;
  maskedEmail: string;
  shopHref: string;
}) {
  const [actionState, formAction, pending] = useActionState(
    emailPreferencesAction,
    initialState
  );
  const [confirming, setConfirming] = useState(false);

  const preferences = actionState.preferences ?? initialPreferences;

  if (preferences.unsubscribedAll) {
    return (
      <section
        aria-labelledby="unsubscribed-title"
        className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8"
      >
        <div
          className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-accent-fg"
          aria-hidden="true"
        >
          ✓
        </div>
        <h2
          id="unsubscribed-title"
          className="mt-4 font-archivo text-2xl font-extrabold uppercase"
        >
          You are unsubscribed
        </h2>
        <p className="mt-3 leading-relaxed text-fg-muted">
          {maskedEmail} will not get marketing emails from Nadeon Labs. It can
          take up to To be confirmed to stop completely.
        </p>
        {actionState.intent === "resubscribe" &&
          actionState.status !== "idle" &&
          actionState.status !== "success" && (
            <p role="alert" className="mt-3 text-sm text-product-coral">
              {actionState.message}
            </p>
          )}
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={formAction}>
            <input type="hidden" name="intent" value="resubscribe" />
            <input type="hidden" name="confirm" value="yes" />
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 rounded-full border border-border px-5 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
            >
              Resubscribe
            </button>
          </form>
          <Link
            href={shopHref}
            className="inline-flex min-h-11 items-center rounded-full bg-gradient-gold px-5 font-bold uppercase text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Back to the shop
          </Link>
        </div>
        <p className="mt-4 text-sm text-fg-muted">
          Changed your mind later? Use the link in any order email.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="managing-title"
        className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8"
      >
        <p className="text-sm text-fg-muted">Managing emails for</p>
        <p id="managing-title" className="mt-1 font-bold text-fg">
          {maskedEmail}
        </p>
      </section>

      <form
        action={formAction}
        className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8"
      >
        <input type="hidden" name="intent" value="save" />
        <fieldset className="space-y-4">
          <legend className="font-archivo text-xl font-extrabold uppercase">
            Topics
          </legend>
          <label className="flex min-h-16 items-start gap-4 rounded-card border border-border p-4 opacity-80">
            <input
              type="checkbox"
              checked
              disabled
              readOnly
              className="mt-1 h-5 w-5 accent-accent"
            />
            <span className="flex-1">
              <span className="flex flex-wrap items-center gap-2 font-bold">
                Orders and shipping{" "}
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase">
                  All
                </span>
                <span className="rounded-full bg-border px-2 py-0.5 text-[10px] uppercase">
                  Locked
                </span>
              </span>
              <span className="mt-1 block text-sm text-fg-muted">
                Confirmations, receipts and delivery updates. Required while you
                have an open order.
              </span>
            </span>
          </label>
          {topics.map((topic) => (
            <label
              key={topic.name}
              className="flex min-h-16 cursor-pointer items-start gap-4 rounded-card border border-border p-4 focus-within:ring-2 focus-within:ring-accent"
            >
              <input
                type="checkbox"
                name={topic.name}
                defaultChecked={initialPreferences.topics[topic.name]}
                className="mt-1 h-5 w-5 accent-accent"
              />
              <span className="flex-1">
                <span className="flex flex-wrap items-center gap-2 font-bold">
                  {topic.title}{" "}
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase">
                    {topic.audience}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-fg-muted">
                  {topic.name === "subscriptionReminders"
                    ? "A heads-up To be confirmed days before each delivery is charged."
                    : topic.description}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className="mt-8 space-y-3">
          <legend className="font-archivo text-xl font-extrabold uppercase">
            How often
          </legend>
          {[
            ["every_email", "Every email", "Get each email as it goes out."],
            ["weekly_digest", "Weekly digest", "One roundup per week."],
            ["monthly_digest", "Monthly digest", "One roundup per month."],
          ].map(([value, title, description]) => (
            <label
              key={value}
              className="flex min-h-11 cursor-pointer items-start gap-3 rounded-field p-2 focus-within:ring-2 focus-within:ring-accent"
            >
              <input
                type="radio"
                name="frequency"
                value={value}
                defaultChecked={initialPreferences.frequency === value}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <span>
                <span className="font-bold">{title}</span>
                <span className="mt-0.5 block text-sm text-fg-muted">
                  {description}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        {actionState.intent === "save" && actionState.status !== "idle" && (
          <p
            role={
              actionState.status === "error" || actionState.status === "invalid"
                ? "alert"
                : "status"
            }
            className="mt-5 text-sm text-fg-muted"
          >
            {actionState.message}
          </p>
        )}
        <p className="mt-5 text-sm text-fg-muted">
          Changes apply within To be confirmed.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="mt-5 min-h-11 rounded-full bg-gradient-gold px-6 font-bold uppercase text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
        >
          Save preferences
        </button>
      </form>

      <section className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8">
        <h2 className="font-archivo text-xl font-extrabold uppercase">
          Unsubscribe from all
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Stops every marketing email. You will still get emails about orders
          you place.
        </p>
        {confirming &&
        !(
          actionState.intent === "unsubscribe" &&
          actionState.status === "success"
        ) ? (
          <div
            className="mt-5 rounded-card border border-border p-5"
            aria-labelledby="unsubscribe-confirm-title"
          >
            <h3
              id="unsubscribe-confirm-title"
              className="font-archivo text-xl font-extrabold uppercase"
            >
              Unsubscribe from all emails?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              You will stop getting news, Journal, reminders and offers. Order
              and shipping emails still arrive when you buy.
            </p>
            <form action={formAction} className="mt-4 space-y-4">
              <input type="hidden" name="intent" value="unsubscribe" />
              <input type="hidden" name="confirm" value="yes" />
              <label
                className="block text-sm font-bold"
                htmlFor="unsubscribe-reason"
              >
                Tell us why (optional)
              </label>
              <select
                id="unsubscribe-reason"
                name="reason"
                defaultValue=""
                className="min-h-11 w-full max-w-sm rounded-field border border-border bg-bg px-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="">To be confirmed</option>
                <option value="too_many_emails">Too many emails</option>
                <option value="not_relevant">Not relevant</option>
                <option value="other">Other</option>
              </select>
              {actionState.intent === "unsubscribe" &&
                actionState.status !== "idle" && (
                  <p role="alert" className="text-sm text-product-coral">
                    {actionState.message}
                  </p>
                )}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={pending}
                  className="min-h-11 rounded-full bg-product-coral px-5 font-bold uppercase text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                >
                  Yes, unsubscribe
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="min-h-11 rounded-full border border-border px-5 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Keep my emails
                </button>
              </div>
            </form>
            <p className="mt-4 text-sm text-fg-muted">
              Tip: switch to the monthly digest instead.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-5 min-h-11 rounded-full border border-product-coral px-5 font-bold uppercase text-product-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Unsubscribe from all
          </button>
        )}
      </section>
    </div>
  );
}
