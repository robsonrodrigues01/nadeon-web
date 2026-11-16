"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { subscribeNewsletter } from "@/components/brand/newsletter/actions";
import { newsletterSchema } from "@/components/brand/newsletter/schema";
import type { FormsProvider } from "@/lib/contracts/forms";
import type { FooterLine } from "./types";

export interface NewsletterFormProps {
  line?: FooterLine;
  className?: string;
  provider?: FormsProvider;
}

export function NewsletterForm({
  line = "human",
  className = "",
  provider,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const isPet = line === "pet";
  const heading = isPet ? "Join the pack" : "Join the Nadeon list";
  const listName = isPet ? "newsletter-pet" : "newsletter-human";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setStatus("error");
      setErrorMessage(
        parsed.error.issues[0]?.message || "Please enter a valid email address."
      );
      setInvalidEmail(true);
      requestAnimationFrame(() => emailRef.current?.focus());
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");
      setInvalidEmail(false);
      const result = provider
        ? await provider.subscribe(listName, parsed.data.email, true)
        : await subscribeNewsletter(listName, parsed.data.email, true);
      if (!result.success) {
        throw new Error("Newsletter subscription failed");
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Could not complete subscription. Please try again.");
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-fg leading-none">
        {heading}
      </h2>
      <p className="text-sm sm:text-base text-fg/80 mt-2.5 leading-relaxed">
        10% off your first order, plus new science, launches and members-only
        offers. No spam.
      </p>

      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 rounded-field border border-accent/40 bg-bg-elevated p-4 text-sm text-fg"
        >
          <span className="font-bold text-accent">Thanks for subscribing!</span>{" "}
          Check your inbox for your 10% discount code.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-5 flex flex-col sm:flex-row gap-2.5"
          noValidate
        >
          <div className="relative flex-1">
            <label
              htmlFor={`footer-newsletter-email-${line}`}
              className="sr-only"
            >
              Email address
            </label>
            <input
              id={`footer-newsletter-email-${line}`}
              ref={emailRef}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setInvalidEmail(false);
                if (status === "error") {
                  setStatus("idle");
                  setErrorMessage("");
                }
              }}
              placeholder="Email address"
              aria-label="Email address"
              aria-invalid={invalidEmail || undefined}
              aria-describedby={
                invalidEmail ? `footer-newsletter-error-${line}` : undefined
              }
              disabled={status === "loading"}
              required
              className="w-full min-h-11 rounded-full border border-accent/40 bg-white/10 px-5 py-2.5 text-sm text-fg placeholder:text-fg/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={
              isPet
                ? "min-h-11 px-6 py-2.5 rounded-full font-bold text-sm tracking-wide bg-fg text-accent-fg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                : "min-h-11 px-6 py-2.5 rounded-full font-bold text-sm tracking-wide bg-gradient-gold text-accent-fg hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            }
          >
            {status === "loading" ? "Subscribing..." : "Get 10% off"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p
          ref={statusRef}
          id={`footer-newsletter-error-${line}`}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="mt-2 text-xs font-medium text-product-coral"
        >
          {errorMessage}
        </p>
      )}

      <p className="text-xs text-fg/60 mt-2.5 leading-normal">
        By signing up you agree to our{" "}
        <Link
          href="/legal/terms"
          className="underline underline-offset-2 hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/legal/privacy"
          className="underline underline-offset-2 hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
