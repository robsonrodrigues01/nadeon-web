"use client";

import React, { type FormEvent, useId, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { subscribeNewsletter } from "./actions";
import type {
  FormsProvider,
  FormSubmissionResult,
} from "@/lib/contracts/forms";
import { cn } from "@/lib/utils";
import { newsletterSchema } from "./schema";

export type NewsletterVariant = "human" | "pet";

export interface NewsletterProps {
  variant?: NewsletterVariant;
  list?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  provider?: FormsProvider;
  className?: string;
  id?: string;
  onSuccess?: (result: FormSubmissionResult) => void;
}

export function Newsletter({
  variant = "human",
  list,
  title,
  subtitle,
  buttonText = "Get 10% off",
  provider,
  className,
  id,
  onSuccess,
}: NewsletterProps) {
  const componentId = useId();
  const inputId = id ?? `newsletter-email-${componentId}`;
  const errorId = `newsletter-error-${componentId}`;
  const statusId = `newsletter-status-${componentId}`;

  const resolvedList =
    list ?? (variant === "pet" ? "newsletter-pet" : "newsletter-human");
  const resolvedTitle =
    title ?? (variant === "pet" ? "Join the pack" : "Join the Nadeon list");
  const resolvedSubtitle =
    subtitle ??
    "10% off your first order, plus new science, launches and members-only offers. No spam.";

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successResult, setSuccessResult] =
    useState<FormSubmissionResult | null>(null);

  const validateEmail = (value: string) => {
    const parsed = newsletterSchema.safeParse({ email: value });
    setEmailError(
      parsed.success ? null : (parsed.error.issues[0]?.message ?? null)
    );
    return parsed;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailTouched(true);
    const parsed = validateEmail(email);
    if (!parsed.success) return;

    setServerError(null);
    setIsSubmitting(true);
    try {
      // Newsletter requires affirmative acceptance of terms and privacy policy
      const result = provider
        ? await provider.subscribe(resolvedList, parsed.data.email, true)
        : await subscribeNewsletter(resolvedList, parsed.data.email, true);
      if (result.success) {
        setSuccessResult(result);
        onSuccess?.(result);
      } else {
        setServerError(
          result.message ?? "Unable to subscribe. Please try again."
        );
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPet = variant === "pet";

  return (
    <div
      className={cn("flex flex-col max-w-xl text-fg", className)}
      data-testid="newsletter-container"
    >
      <h2 className="title font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-fg">
        {resolvedTitle}
      </h2>

      <p className="body text-fg-muted text-sm sm:text-base mt-2.5 leading-relaxed">
        {resolvedSubtitle}
      </p>

      {successResult ? (
        <div
          id={statusId}
          role="status"
          aria-live="polite"
          className="mt-5 p-4 rounded-card bg-border/20 border border-border flex items-start gap-3"
        >
          <CheckCircle2
            className="w-5 h-5 text-product-mint shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="text-sm font-bold text-fg">
              Thank you for subscribing!
            </p>
            <p className="text-xs text-fg-muted">
              {successResult.message ??
                "Check your inbox for your 10% off coupon code."}
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-5"
          aria-label={resolvedTitle}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <label htmlFor={inputId} className="sr-only">
                Email address
              </label>
              <input
                id={inputId}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
                disabled={isSubmitting}
                value={email}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setEmail(value);
                  if (emailTouched) validateEmail(value);
                }}
                onBlur={() => {
                  setEmailTouched(true);
                  validateEmail(email);
                }}
                aria-invalid={emailError ? "true" : "false"}
                aria-describedby={
                  emailError ? errorId : serverError ? errorId : undefined
                }
                className={cn(
                  "w-full min-h-11 h-11 px-5 rounded-full text-sm outline-none transition-colors",
                  "bg-fg/10 text-fg placeholder:text-fg-muted/70",
                  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  emailError
                    ? "border border-product-coral"
                    : isPet
                      ? "border border-border/60 hover:border-border"
                      : "border border-border hover:border-accent/40"
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting ? "true" : undefined}
              className={cn(
                "inline-flex items-center justify-center gap-2 min-h-11 min-w-[44px] px-6 py-2.5 rounded-full",
                "font-bold text-sm uppercase tracking-wider text-center select-none whitespace-nowrap cursor-pointer",
                "transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                isPet
                  ? "bg-fg text-bg hover:opacity-90 shadow-card"
                  : "bg-gradient-gold text-accent-fg shadow-card hover:brightness-105"
              )}
            >
              {isSubmitting && (
                <Loader2
                  className="w-4 h-4 animate-spin shrink-0"
                  aria-hidden="true"
                />
              )}
              <span>{buttonText}</span>
            </button>
          </div>

          {emailError && (
            <p
              id={errorId}
              role="alert"
              className="text-xs text-product-coral font-medium mt-1.5 flex items-center gap-1.5"
            >
              <AlertCircle
                className="w-3.5 h-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>{emailError}</span>
            </p>
          )}

          {serverError && !emailError && (
            <p
              id={errorId}
              role="alert"
              className="text-xs text-product-coral font-medium mt-2 flex items-center gap-1.5"
            >
              <AlertCircle
                className="w-3.5 h-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>{serverError}</span>
            </p>
          )}

          <p className="text-[11px] text-fg-muted mt-2.5 leading-normal">
            By signing up you agree to our{" "}
            <Link
              href="/legal/terms"
              className="underline underline-offset-2 hover:text-fg transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              className="underline underline-offset-2 hover:text-fg transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      )}
    </div>
  );
}
