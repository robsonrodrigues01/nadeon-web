import React from "react";
import Link from "next/link";
import { PrivacyRequestForm } from "./privacy-form";

export const LEGAL_PAGES = [
  { label: "Terms of Service", href: "/legal/terms", current: false },
  { label: "Privacy Policy", href: "/legal/privacy", current: false },
  {
    label: "Do Not Sell or Share My Personal Information",
    href: "/legal/do-not-sell",
    current: true,
  },
  {
    label: "Accessibility Statement",
    href: "/legal/accessibility",
    current: false,
  },
  {
    label: "Shipping & Returns",
    href: "/shipping-returns",
    current: false,
  },
] as const;

export function DoNotSellHero() {
  return (
    <section
      data-theme="human"
      aria-labelledby="do-not-sell-hero-heading"
      className="bg-bg text-fg px-5 sm:px-8 lg:px-18 py-16 lg:py-24 border-b border-border"
    >
      <div className="max-w-7xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="text-xs sm:text-sm text-fg-muted mb-5 flex items-center gap-2 flex-wrap"
        >
          <Link href="/" className="hover:text-fg transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/legal/terms"
            className="hover:text-fg transition-colors opacity-70"
          >
            Legal
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-fg font-medium">Your privacy choices</span>
        </nav>

        <h1
          id="do-not-sell-hero-heading"
          className="hero text-fg tracking-tight text-4xl sm:text-6xl lg:text-7xl uppercase"
        >
          Your privacy choices
        </h1>

        <p className="text-base sm:text-xl text-fg/85 mt-4 max-w-2xl leading-relaxed">
          Use this form to opt out of the sale or sharing of your personal
          information, or to ask us to access, delete or correct it.
        </p>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap mt-4 text-xs sm:text-sm text-fg-muted">
          <span>Last updated: To be confirmed</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>
            For residents of California and other US states with privacy laws
          </span>
        </div>

        <nav
          aria-label="Legal pages navigation"
          className="flex items-center gap-2 sm:gap-2.5 flex-wrap mt-8"
        >
          {LEGAL_PAGES.map((page) =>
            page.current ? (
              <span
                key={page.href}
                aria-current="page"
                className="inline-flex min-h-11 items-center justify-center px-4 sm:px-5 py-2.5 rounded-pill font-bold text-xs sm:text-sm bg-gradient-gold text-accent-fg shadow-sm"
              >
                {page.label}
              </span>
            ) : (
              <Link
                key={page.href}
                href={page.href}
                className="inline-flex min-h-11 items-center justify-center px-4 sm:px-5 py-2.5 rounded-pill font-bold text-xs sm:text-sm border border-border text-fg hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {page.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </section>
  );
}

export function DoNotSellSidebar() {
  return (
    <aside
      aria-label="Privacy Information and Guidance"
      className="w-full lg:w-96 lg:shrink-0 flex flex-col gap-4 sm:gap-5"
    >
      {/* Global Privacy Control Card */}
      <div
        data-theme="human"
        className="rounded-card bg-bg text-fg p-6 shadow-sm border border-border"
      >
        <div className="text-xs font-bold tracking-widest uppercase text-accent">
          Global Privacy Control
        </div>
        <h2 className="title text-xl font-extrabold text-fg mt-2 leading-tight">
          We honor GPC signals
        </h2>
        <p className="text-sm text-fg-muted mt-2.5 leading-relaxed">
          If your browser or extension sends a Global Privacy Control signal, we
          treat it as a request to opt out of sale and sharing for that browser,
          no form needed. To apply it to your account too, submit this form
          while signed in To be confirmed.
        </p>
        <div className="flex items-center gap-2.5 mt-4 rounded-field bg-fg/10 px-3 py-2.5 text-xs text-fg">
          <span
            className="size-2.5 rounded-full bg-product-mint shrink-0"
            aria-hidden="true"
          />
          <span>GPC detected in this browser: To be confirmed</span>
        </div>
      </div>

      {/* Other ways to submit Card */}
      <div className="rounded-card bg-bg-elevated border border-border p-6 shadow-sm">
        <div className="text-xs font-bold tracking-widest uppercase text-accent">
          Other ways to submit
        </div>
        <div className="mt-3 space-y-2 text-sm text-fg leading-relaxed">
          <div>
            Email: <b>To be confirmed</b>
          </div>
          <div>
            Call: <b>To be confirmed</b>
          </div>
          <div>
            Mail: <b>To be confirmed</b>
          </div>
        </div>
      </div>

      {/* What happens next Card */}
      <div className="rounded-card bg-bg-elevated border border-border p-6 shadow-sm">
        <div className="text-xs font-bold tracking-widest uppercase text-accent">
          What happens next
        </div>
        <div className="mt-4 space-y-3.5 text-sm text-fg leading-snug">
          <div className="flex items-start gap-3">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fg text-bg font-extrabold text-xs"
              aria-hidden="true"
            >
              1
            </span>
            <span className="pt-0.5">
              We confirm receipt within To be confirmed business days.
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fg text-bg font-extrabold text-xs"
              aria-hidden="true"
            >
              2
            </span>
            <span className="pt-0.5">We verify your identity if needed.</span>
          </div>
          <div className="flex items-start gap-3">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fg text-bg font-extrabold text-xs"
              aria-hidden="true"
            >
              3
            </span>
            <span className="pt-0.5">
              We complete your request within To be confirmed days.
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3.5 border-t border-border">
          <Link
            href="/legal/privacy"
            className="font-bold text-sm text-accent hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >
            Read our Privacy Policy →
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function DoNotSellContent() {
  return (
    <div
      data-theme="pet"
      className="bg-bg text-fg px-5 sm:px-8 lg:px-18 py-12 lg:py-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        <div className="flex-1 w-full min-w-0">
          <PrivacyRequestForm />
        </div>
        <DoNotSellSidebar />
      </div>
    </div>
  );
}
