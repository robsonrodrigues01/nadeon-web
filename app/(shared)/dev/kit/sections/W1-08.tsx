"use client";

import React, { useState } from "react";
import {
  CookieBanner,
  CookieSettingsModal,
} from "@/components/layout/cookie-banner";
import { ConsentProvider, ConsentGate, useConsent } from "@/lib/consent";

function ConsentGateDemo() {
  const { consent, isUs, country, acceptAll, rejectNonEssential } =
    useConsent();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-card bg-bg-elevated border border-border">
        <div>
          <span className="label text-xs uppercase tracking-wider text-accent font-bold">
            Live Consent State
          </span>
          <p className="body text-xs text-fg-muted mt-0.5">
            Jurisdiction:{" "}
            <span className="font-bold text-fg">
              {isUs ? "United States (Opt-out)" : "International (Opt-in)"}
            </span>
            {country
              ? ` · Country code: ${country}`
              : " · Country: Default (Non-US)"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={rejectNonEssential}
            className="min-h-11 px-4 py-2 text-xs font-bold rounded-full border border-border text-fg hover:border-fg transition-colors"
          >
            Simulate Reject
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="min-h-11 px-4 py-2 text-xs font-bold rounded-full bg-fg text-bg hover:opacity-90 transition-opacity font-bold"
          >
            Simulate Accept All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Necessary Gate */}
        <div className="p-4 rounded-card border border-border bg-bg-elevated flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-fg">
              Necessary
            </span>
            <span className="text-[10px] uppercase font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
              Always on
            </span>
          </div>
          <ConsentGate category="necessary">
            <div className="p-3 rounded-field bg-bg text-fg text-xs font-mono border border-border">
              Session &amp; cart engine running.
            </div>
          </ConsentGate>
        </div>

        {/* Analytics Gate */}
        <div className="p-4 rounded-card border border-border bg-bg-elevated flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-fg">
              Analytics
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                consent.analytics
                  ? "text-product-mint border-product-mint/30 bg-product-mint/10"
                  : "text-fg-muted border-border bg-bg"
              }`}
            >
              {consent.analytics ? "Active" : "Blocked"}
            </span>
          </div>
          <ConsentGate
            category="analytics"
            fallback={
              <div className="p-3 rounded-field bg-bg/50 text-fg-muted text-xs border border-dashed border-border">
                Analytics script blocked pending consent.
              </div>
            }
          >
            <div className="p-3 rounded-field bg-product-mint/10 text-product-mint text-xs font-mono border border-product-mint/20">
              Vercel Speed Insights &amp; metrics recording.
            </div>
          </ConsentGate>
        </div>

        {/* Marketing Gate */}
        <div className="p-4 rounded-card border border-border bg-bg-elevated flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-fg">
              Marketing
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                consent.marketing
                  ? "text-product-coral border-product-coral/30 bg-product-coral/10"
                  : "text-fg-muted border-border bg-bg"
              }`}
            >
              {consent.marketing ? "Active" : "Blocked"}
            </span>
          </div>
          <ConsentGate
            category="marketing"
            fallback={
              <div className="p-3 rounded-field bg-bg/50 text-fg-muted text-xs border border-dashed border-border">
                Ad pixels and campaign tracking blocked.
              </div>
            }
          >
            <div className="p-3 rounded-field bg-product-coral/10 text-product-coral text-xs font-mono border border-product-coral/20">
              Shopify Customer Privacy advertising pixels active.
            </div>
          </ConsentGate>
        </div>
      </div>
    </div>
  );
}

function ThemeShowcase({
  theme,
  title,
  subtitle,
}: {
  theme: "human" | "pet";
  title: string;
  subtitle: string;
}) {
  const [showSettingsPreview, setShowSettingsPreview] = useState(false);

  return (
    <div
      data-theme={theme}
      className="rounded-card border-2 border-border bg-bg text-fg p-6 sm:p-8 shadow-card flex flex-col gap-8"
    >
      <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-1">
            {title}
          </span>
          <p className="body text-sm text-fg-muted">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowSettingsPreview(!showSettingsPreview)}
          className="min-h-11 px-4 py-2 text-xs font-bold rounded-full border border-border text-fg hover:border-fg transition-colors"
        >
          {showSettingsPreview ? "Hide settings panel" : "View settings panel"}
        </button>
      </div>

      <ConsentProvider forceBannerOpen={true}>
        {/* Banner Preview */}
        <div className="space-y-3">
          <h3 className="label text-xs uppercase tracking-wider text-fg-muted font-bold">
            1. Cookie Banner (Inline Preview)
          </h3>
          <CookieBanner inline forceVisible={true} />
        </div>

        {/* Settings Panel Preview */}
        {showSettingsPreview && (
          <div className="space-y-3 animate-in fade-in">
            <h3 className="label text-xs uppercase tracking-wider text-fg-muted font-bold">
              2. Cookie Settings Modal (Inline Category Panel)
            </h3>
            <CookieSettingsModal inline isOpen={true} />
          </div>
        )}

        {/* ConsentGate Demonstration */}
        <div className="space-y-3">
          <h3 className="label text-xs uppercase tracking-wider text-fg-muted font-bold">
            3. ConsentGate &amp; useConsent Hook Verification
          </h3>
          <ConsentGateDemo />
        </div>
      </ConsentProvider>
    </div>
  );
}

export default function W1_08Section() {
  return (
    <section aria-labelledby="section-w1-08-title" className="mb-16">
      <header className="mb-8">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Wave 1 · W1-08
        </span>
        <h2
          id="section-w1-08-title"
          className="title text-2xl sm:text-3xl font-black uppercase text-fg"
        >
          Cookie Banner &amp; ConsentGate
        </h2>
        <p className="lead text-sm sm:text-base text-fg-muted mt-2 max-w-3xl">
          Compliant first-party cookie banner adhering to Section 6.4 of Plan
          v3. Supports opt-out regime in the United States and strict opt-in
          regime internationally, persisted to the{" "}
          <code className="text-xs bg-bg-elevated px-1.5 py-0.5 rounded border border-border font-mono">
            nadeon_consent
          </code>{" "}
          cookie and integrated with the Shopify Customer Privacy API.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ThemeShowcase
          theme="human"
          title="Theme: Human (Dark, Warm)"
          subtitle="Warm dark container with high contrast AA borders and action buttons."
        />
        <ThemeShowcase
          theme="pet"
          title="Theme: Pet (Light, Warm)"
          subtitle="Warm light container with high contrast AA borders and action buttons."
        />
      </div>
    </section>
  );
}
