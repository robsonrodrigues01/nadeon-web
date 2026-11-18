"use client";

import { useActionState } from "react";
import { registerForCourse, type CourseRegistrationState } from "../actions";

const initialState: CourseRegistrationState = { success: null, message: "" };

export function CourseRegistrationForm({
  courseSlug,
  audience,
}: {
  courseSlug: string;
  audience: "human" | "pet";
}) {
  const [state, formAction, pending] = useActionState(
    registerForCourse,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courseSlug" value={courseSlug} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          {audience === "pet" ? "Your name" : "First name"}
          <input
            name="firstName"
            autoComplete="given-name"
            required
            className="min-h-12 rounded-lg border border-border bg-bg px-4 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>
        {audience === "pet" && (
          <label className="grid gap-2 text-sm font-semibold">
            Dog&apos;s name
            <input
              name="dogName"
              required
              className="min-h-12 rounded-lg border border-border bg-bg px-4 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
        )}
        <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-12 rounded-lg border border-border bg-bg px-4 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto"
      >
        Send me the free course
      </button>
      {state.message && (
        <p role={state.success ? "status" : "alert"} aria-live="polite">
          {state.message}
        </p>
      )}
      <p className="text-sm text-fg-muted">No spam. Unsubscribe anytime.</p>
      <p className="text-xs leading-relaxed text-fg-muted">
        By signing up you agree to our{" "}
        <a className="underline underline-offset-4" href="/legal/terms">
          Terms
        </a>{" "}
        and{" "}
        <a className="underline underline-offset-4" href="/legal/privacy">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
