"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useId,
  useCallback,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Link from "next/link";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useConsent, readCookie, writeCookie } from "@/lib/consent";
import { subscribeNewsletter } from "@/components/brand/newsletter/actions";
import { newsletterSchema } from "@/components/brand/newsletter/schema";
import { cn } from "@/lib/utils";

export const FIRST_VISIT_POPUP_COOKIE_NAME = "nadeon_first_visit_popup";

export type PopupVariant = "human" | "pet";

export interface FirstVisitPopupProps {
  /**
   * Brand line variant: "human" (dark/gold) or "pet" (warm light/clean).
   * @default "human"
   */
  variant?: PopupVariant;

  /**
   * Explicit control over open state.
   */
  isOpen?: boolean;

  /**
   * Force open for previews and test environments.
   */
  forceOpen?: boolean;

  /**
   * Render inline for dev kit and documentation cards without a fixed overlay.
   */
  inline?: boolean;

  /**
   * Callback fired when popup is closed/dismissed.
   */
  onDismiss?: () => void;

  /**
   * Alias for onDismiss.
   */
  onClose?: () => void;

  /**
   * Callback fired on successful newsletter signup.
   */
  onSuccess?: (email: string) => void;

  /**
   * Custom cookie name override for testing/isolation.
   */
  cookieName?: string;

  /**
   * Additional wrapper class names.
   */
  className?: string;
}

const emptySubscribe = () => () => {};

export function FirstVisitPopup({
  variant = "human",
  isOpen,
  forceOpen = false,
  inline = false,
  onDismiss,
  onClose,
  onSuccess,
  cookieName = FIRST_VISIT_POPUP_COOKIE_NAME,
  className = "",
}: FirstVisitPopupProps) {
  const { isBannerOpen, record } = useConsent();

  // SSR-safe, React 19 external store checks
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const cookieDismissed = useSyncExternalStore(
    emptySubscribe,
    () => Boolean(readCookie(cookieName)),
    () => false
  );

  const [userDismissed, setUserDismissed] = useState(false);

  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;
  const descId = `${idPrefix}-desc`;
  const inputId = `${idPrefix}-email`;
  const errorId = `${idPrefix}-error`;

  // Consent is resolved when the user has made an explicit choice and banner is closed
  const isConsentResolved = Boolean(record?.explicit) && !isBannerOpen;

  const isVisible =
    isOpen !== undefined
      ? isOpen
      : forceOpen
        ? !userDismissed
        : isClient && !cookieDismissed && !userDismissed && isConsentResolved;

  const isPet = variant === "pet";
  const list = isPet ? "newsletter-pet" : "newsletter-human";
  const kicker = isPet ? "WELCOME TO NADEON PET" : "WELCOME TO NADEON";
  const subtitle = isPet
    ? "Join the pack for new science, pet longevity launches and members-only offers. No spam."
    : "Join the list for new science, launches and members-only offers. No spam.";

  const handleDismiss = useCallback(() => {
    setUserDismissed(true);
    writeCookie(cookieName, "dismissed", 365);
    onDismiss?.();
    onClose?.();
  }, [cookieName, onDismiss, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInputError(null);
    setServerError(null);

    const validation = newsletterSchema.safeParse({ email });
    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message;
      setInputError(firstIssue || "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await subscribeNewsletter(
        list,
        validation.data.email,
        true
      );
      if (result.success) {
        setIsSubscribed(true);
        writeCookie(cookieName, "subscribed", 365);
        onSuccess?.(validation.data.email);
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

  // Keyboard navigation & Focus trapping
  useEffect(() => {
    if (!isVisible || inline) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const modalEl = modalRef.current;
    if (!modalEl) return;

    const focusableSelectors =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Focus the email input or first focusable
    const focusables =
      modalEl.querySelectorAll<HTMLElement>(focusableSelectors);
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
        return;
      }

      if (e.key === "Tab") {
        const currentFocusables =
          modalEl.querySelectorAll<HTMLElement>(focusableSelectors);
        if (currentFocusables.length === 0) return;

        const first = currentFocusables[0];
        const last = currentFocusables[currentFocusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      const returnFocus = previousActiveElement.current;
      if (returnFocus?.isConnected && returnFocus !== document.body) {
        returnFocus.focus();
      } else {
        document.getElementById("main-content")?.focus();
      }
    };
  }, [isVisible, inline, handleDismiss]);

  if (!isVisible) return null;

  const content = (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal={inline ? undefined : "true"}
      aria-labelledby={titleId}
      aria-describedby={descId}
      data-theme={variant}
      className={cn(
        "relative w-full max-w-3xl overflow-hidden rounded-[26px] border border-accent/30 bg-bg-elevated text-fg shadow-elevated",
        "flex flex-col md:flex-row transition-all duration-200",
        className
      )}
    >
      {/* Left / Top Visual Column */}
      <div
        className={cn(
          "relative flex items-center justify-center p-6 md:p-8 shrink-0 overflow-hidden",
          "w-full h-32 md:h-auto md:w-[320px]",
          isPet
            ? "bg-bg border-b md:border-b-0 md:border-r border-border"
            : "bg-bg-elevated border-b md:border-b-0 md:border-r border-border"
        )}
        aria-hidden="true"
      >
        {/* Decorative backdrop shapes */}
        <div className="absolute inset-0 bg-radial from-accent/15 via-transparent to-transparent opacity-60" />

        <div className="relative flex items-end justify-center gap-3">
          {/* Main Formula Jar */}
          <div className="flex flex-col items-center">
            <div className="w-16 md:w-24 h-5 md:h-7 rounded-t-md bg-fg/10 border-t border-x border-border shadow-xs" />
            <div className="w-20 md:w-28 h-20 md:h-28 rounded-lg bg-bg border border-border shadow-card flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-accent">
                {isPet ? "Chews" : "BioHack"}
              </span>
              <span className="text-[8px] md:text-[9px] text-fg-muted font-medium mt-0.5">
                {isPet ? "NMN 250 mg" : "NMN 500 mg"}
              </span>
            </div>
          </div>

          {/* Secondary Bottle */}
          <div className="flex flex-col items-center">
            <div className="w-12 md:w-16 h-4 md:h-5 rounded-t-md bg-fg/10 border-t border-x border-border" />
            <div className="w-16 md:w-20 h-16 md:h-22 rounded-lg bg-bg border border-border shadow-card flex flex-col items-center justify-center p-1.5 text-center">
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-fg">
                {isPet ? "Drops" : "Renew"}
              </span>
              <span className="text-[7px] md:text-[8px] text-fg-muted">
                {isPet ? "Pet Longevity" : "NAD+ Boost"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Content & Form */}
      <div className="relative flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
        {/* Close Button: Meets min 44x44px clickable target */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close dialog"
          className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:border-fg hover:bg-fg/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div>
          {/* Kicker Preheader */}
          <span className="text-xs font-bold tracking-[0.14em] uppercase bg-gradient-gold bg-clip-text text-transparent">
            {kicker}
          </span>

          {/* Dialog Title */}
          <h2
            id={titleId}
            className="title text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-fg mt-2 leading-[0.98]"
          >
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              10% off
            </span>
            <br />
            your first order
          </h2>

          {/* Description */}
          <p
            id={descId}
            className="body text-xs sm:text-sm text-fg-muted mt-3 leading-relaxed"
          >
            {subtitle}
          </p>
        </div>

        {/* State A: Submission Form / State B: Confirmation */}
        {isSubscribed ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 p-5 rounded-card bg-border/20 border border-border flex items-start gap-3.5"
          >
            <CheckCircle2
              className="w-5 h-5 text-accent shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-sm font-bold text-fg">
                Thank you for subscribing!
              </p>
              <p className="text-xs text-fg-muted leading-relaxed">
                Check your inbox for your 10% off coupon code.
              </p>
              <button
                type="button"
                onClick={handleDismiss}
                className="mt-2 text-xs font-bold text-accent underline underline-offset-4 hover:opacity-80 min-h-[44px] inline-flex items-center"
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5">
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor={inputId} className="sr-only">
                  Email address
                </label>
                <input
                  ref={emailInputRef}
                  id={inputId}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  autoComplete="email"
                  placeholder="Email address"
                  disabled={isSubmitting}
                  aria-invalid={inputError ? "true" : "false"}
                  aria-describedby={
                    inputError ? errorId : serverError ? errorId : undefined
                  }
                  className={cn(
                    "w-full min-h-[44px] h-11 px-5 rounded-full text-sm outline-none transition-colors",
                    "bg-fg/10 text-fg placeholder:text-fg-muted/70",
                    "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    inputError
                      ? "border border-product-coral"
                      : "border border-border hover:border-accent/50"
                  )}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting ? "true" : undefined}
                className={cn(
                  "inline-flex items-center justify-center gap-2 min-h-[44px] h-12 w-full px-6 rounded-full",
                  "font-bold text-sm uppercase tracking-wider text-center select-none cursor-pointer",
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
                <span>Get 10% off</span>
              </button>
            </div>

            {/* Error Message */}
            {(inputError || serverError) && (
              <p
                id={errorId}
                role="alert"
                className="text-xs text-product-coral font-medium mt-2 flex items-center gap-1.5"
              >
                <AlertCircle
                  className="w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>{inputError || serverError}</span>
              </p>
            )}

            {/* "No thanks" action */}
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex min-h-[44px] items-center justify-center text-xs font-bold underline underline-offset-4 text-fg-muted hover:text-fg transition-colors cursor-pointer"
              >
                No thanks
              </button>
            </div>

            {/* Legal Links */}
            <p className="text-[11px] text-fg-muted/70 mt-2 text-center leading-normal">
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
              . One code per customer.
            </p>
          </form>
        )}
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-elevated/75 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
    >
      {content}
    </div>
  );
}
