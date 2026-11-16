"use client";

import React, { useEffect, useRef, useState, useActionState } from "react";
import { submitAccessibilityFeedback, type FeedbackFormState } from "./actions";

const inputClass =
  "min-h-11 w-full rounded-field border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function FeedbackForm() {
  const [customState, setCustomState] = useState<FeedbackFormState>({
    status: "idle",
  });

  const [serverState, formAction, isPending] = useActionState(
    submitAccessibilityFeedback,
    customState
  );

  const activeState = customState.status !== "idle" ? customState : serverState;
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (activeState.status === "invalid" || activeState.status === "error")
      statusRef.current?.focus();
  }, [activeState.status]);

  if (activeState.status === "success") {
    return (
      <div
        data-testid="feedback-success-card"
        className="rounded-card bg-bg-elevated border border-border p-6 sm:p-8 text-center"
      >
        <div className="mx-auto flex size-12 sm:size-14 items-center justify-center rounded-full bg-product-mint/20 text-product-mint">
          <svg
            className="size-6 sm:size-7"
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
        <h3 className="title text-xl sm:text-2xl font-extrabold text-fg uppercase mt-4">
          Feedback received
        </h3>
        <p className="text-sm sm:text-base text-fg/80 mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for helping us improve our website accessibility. We will
          review your report and respond within To be confirmed business days.
        </p>
        <p role="status" aria-live="polite" className="sr-only">
          Feedback received.
        </p>
        <button
          type="button"
          onClick={() => setCustomState({ status: "idle" })}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-pill bg-fg text-bg px-6 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Send another report
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-card bg-bg-elevated border border-border p-6 sm:p-8 shadow-sm">
      <div className="text-xs font-bold tracking-widest uppercase text-accent">
        Accessibility feedback
      </div>
      <h3 className="hero text-xl sm:text-2xl text-fg mt-2">
        Tell us about a barrier
      </h3>

      <form action={formAction} noValidate className="mt-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-name"
              className="text-xs font-bold text-fg"
            >
              Name
            </label>
            <input
              id="feedback-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-email"
              className="text-xs font-bold text-fg"
            >
              Email
            </label>
            <input
              id="feedback-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className={inputClass}
            />
          </div>

          {/* Page or feature */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label
              htmlFor="feedback-page"
              className="text-xs font-bold text-fg"
            >
              Page or feature (optional)
            </label>
            <input
              id="feedback-page"
              name="pageOrFeature"
              type="text"
              placeholder="Page URL or name"
              className={inputClass}
            />
          </div>

          {/* Describe the issue */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label
              htmlFor="feedback-description"
              className="text-xs font-bold text-fg"
            >
              Describe the issue
            </label>
            <textarea
              id="feedback-description"
              name="description"
              required
              rows={4}
              placeholder="What happened and what you were trying to do"
              className="w-full rounded-field border border-border bg-bg-elevated px-4 py-3 text-fg placeholder:text-fg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-y min-h-[100px]"
            />
          </div>

          {/* Preferred reply format */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-reply-format"
              className="text-xs font-bold text-fg"
            >
              Preferred reply format
            </label>
            <select
              id="feedback-reply-format"
              name="preferredReply"
              defaultValue="Email"
              className={inputClass}
            >
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="No reply needed">No reply needed</option>
            </select>
          </div>

          {/* Assistive technology used */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-assistive-tech"
              className="text-xs font-bold text-fg"
            >
              Assistive technology used (optional)
            </label>
            <input
              id="feedback-assistive-tech"
              name="assistiveTech"
              type="text"
              placeholder="e.g. screen reader, zoom"
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-2 flex items-center">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-pill bg-fg text-bg px-8 py-3 font-bold text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send feedback"}
          </button>
        </div>

        <p
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="text-sm"
        >
          {activeState.status === "invalid" && (
            <span className="text-product-coral font-medium">
              {activeState.error ||
                "Please fill in all required fields and try again."}
            </span>
          )}
          {activeState.status === "error" && (
            <span className="text-product-coral font-medium">
              {activeState.error ||
                "An error occurred while submitting feedback. Please try again."}
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
