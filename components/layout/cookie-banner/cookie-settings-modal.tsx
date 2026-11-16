"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { useConsent } from "@/lib/consent";
import { X } from "lucide-react";

export interface CookieSettingsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

interface CookieSettingsFormProps {
  initialAnalytics: boolean;
  initialMarketing: boolean;
  titleId: string;
  descId: string;
  inline: boolean;
  onClose: () => void;
  onSave: (prefs: { analytics: boolean; marketing: boolean }) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

function CookieSettingsForm({
  initialAnalytics,
  initialMarketing,
  titleId,
  descId,
  inline,
  onClose,
  onSave,
  onAcceptAll,
  onRejectAll,
}: CookieSettingsFormProps) {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [marketing, setMarketing] = useState(initialMarketing);

  return (
    <div
      role="dialog"
      aria-modal={inline ? undefined : "true"}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="bg-bg-elevated text-fg border border-border rounded-card p-6 sm:p-8 max-w-xl w-full shadow-elevated flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="label text-xs uppercase tracking-wider text-accent font-bold">
            Privacy Preferences
          </span>
          <h2 id={titleId} className="title text-xl sm:text-2xl font-bold mt-1">
            Cookie Settings
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cookie settings"
          className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full text-fg-muted hover:text-fg hover:bg-fg/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <p id={descId} className="body text-sm text-fg-muted leading-relaxed">
        Manage how we use cookies to power your shopping experience. Strictly
        necessary cookies are essential for our store to operate and cannot be
        deactivated.
      </p>

      {/* Categories Fieldset */}
      <fieldset className="space-y-4">
        <legend className="sr-only">Cookie categories and permissions</legend>

        {/* 1. Necessary */}
        <div className="rounded-card border border-border p-4 bg-bg/40 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor="cookie-category-necessary"
                className="font-bold text-sm sm:text-base text-fg"
              >
                Strictly Necessary
              </label>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                Always active
              </span>
            </div>
            <p className="text-xs text-fg-muted mt-1 leading-normal">
              Essential for core functions such as shopping cart, secure
              checkout, and session management.
            </p>
          </div>
          <div className="shrink-0 flex items-center min-h-11">
            <input
              type="checkbox"
              id="cookie-category-necessary"
              name="necessary"
              checked={true}
              disabled={true}
              aria-label="Strictly Necessary Cookies (Always active)"
              className="h-5 w-5 accent-accent opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        {/* 2. Analytics */}
        <div className="rounded-card border border-border p-4 bg-bg/40 flex items-start justify-between gap-4">
          <div className="flex-1">
            <label
              htmlFor="cookie-category-analytics"
              className="font-bold text-sm sm:text-base text-fg cursor-pointer"
            >
              Analytics Cookies
            </label>
            <p className="text-xs text-fg-muted mt-1 leading-normal">
              Help us understand how visitors interact with our pages, track
              site speed, and identify areas for improvement.
            </p>
          </div>
          <div className="shrink-0 flex items-center min-h-11">
            <input
              type="checkbox"
              id="cookie-category-analytics"
              name="analytics"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              aria-label="Analytics Cookies"
              className="h-5 w-5 accent-accent cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Marketing */}
        <div className="rounded-card border border-border p-4 bg-bg/40 flex items-start justify-between gap-4">
          <div className="flex-1">
            <label
              htmlFor="cookie-category-marketing"
              className="font-bold text-sm sm:text-base text-fg cursor-pointer"
            >
              Marketing Cookies
            </label>
            <p className="text-xs text-fg-muted mt-1 leading-normal">
              Used to measure marketing performance and deliver relevant
              promotions tailored to your wellness interests.
            </p>
          </div>
          <div className="shrink-0 flex items-center min-h-11">
            <input
              type="checkbox"
              id="cookie-category-marketing"
              name="marketing"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              aria-label="Marketing Cookies"
              className="h-5 w-5 accent-accent cursor-pointer"
            />
          </div>
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border sm:justify-end">
        <button
          type="button"
          onClick={onRejectAll}
          className="min-h-11 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full border-2 border-border text-fg hover:border-fg hover:bg-fg/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer text-center"
        >
          Reject non-essential
        </button>
        <button
          type="button"
          onClick={onAcceptAll}
          className="min-h-11 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full border-2 border-border text-fg hover:border-fg hover:bg-fg/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer text-center"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => onSave({ analytics, marketing })}
          className="min-h-11 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-full bg-fg text-bg hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer text-center font-bold"
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsModal({
  isOpen,
  onClose,
  inline = false,
}: CookieSettingsModalProps) {
  const {
    consent,
    isSettingsOpen,
    closeSettings,
    savePreferences,
    acceptAll,
    rejectNonEssential,
  } = useConsent();

  const titleId = useId();
  const descId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const active = isOpen !== undefined ? isOpen : isSettingsOpen;
  const handleClose = onClose || closeSettings;

  useEffect(() => {
    if (!active || inline) return;

    const dialog =
      modalRef.current?.querySelector<HTMLElement>('[role="dialog"]');
    if (!dialog) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const focusables = dialog.querySelectorAll<HTMLElement>(focusableSelector);
    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;
      const currentFocusables =
        dialog.querySelectorAll<HTMLElement>(focusableSelector);
      if (!currentFocusables.length) return;

      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [active, inline, handleClose]);

  if (!active) return null;

  const handleSave = (prefs: { analytics: boolean; marketing: boolean }) => {
    savePreferences(prefs);
    handleClose();
  };

  const handleAcceptAll = () => {
    acceptAll();
    handleClose();
  };

  const handleRejectAll = () => {
    rejectNonEssential();
    handleClose();
  };

  const modalContent = (
    <CookieSettingsForm
      key={active ? "open" : "closed"}
      initialAnalytics={consent.analytics}
      initialMarketing={consent.marketing}
      titleId={titleId}
      descId={descId}
      inline={inline}
      onClose={handleClose}
      onSave={handleSave}
      onAcceptAll={handleAcceptAll}
      onRejectAll={handleRejectAll}
    />
  );

  if (inline) {
    return modalContent;
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      {modalContent}
    </div>
  );
}
