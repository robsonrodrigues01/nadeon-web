import React from "react";
import Link from "next/link";

export const TERMS_SECTIONS = [
  {
    id: "acceptance-of-these-terms",
    num: "1.",
    title: "Acceptance of these terms",
  },
  {
    id: "eligibility-and-accounts",
    num: "2.",
    title: "Eligibility and accounts",
  },
  { id: "orders-and-pricing", num: "3.", title: "Orders and pricing" },
  {
    id: "subscriptions-and-auto-renewal",
    num: "4.",
    title: "Subscriptions and auto-renewal",
  },
  {
    id: "shipping-returns-and-refunds",
    num: "5.",
    title: "Shipping, returns and refunds",
  },
  { id: "rewards-and-promotions", num: "6.", title: "Rewards and promotions" },
  {
    id: "product-information-and-health-disclaimer",
    num: "7.",
    title: "Product information and health disclaimer",
  },
  {
    id: "reviews-and-user-content",
    num: "8.",
    title: "Reviews and user content",
  },
  { id: "intellectual-property", num: "9.", title: "Intellectual property" },
  { id: "prohibited-uses", num: "10.", title: "Prohibited uses" },
  {
    id: "disclaimers-and-limitation-of-liability",
    num: "11.",
    title: "Disclaimers and limitation of liability",
  },
  {
    id: "dispute-resolution-and-arbitration",
    num: "12.",
    title: "Dispute resolution and arbitration",
  },
  { id: "governing-law", num: "13.", title: "Governing law" },
  { id: "changes-to-these-terms", num: "14.", title: "Changes to these terms" },
  {
    id: "your-us-privacy-rights",
    num: "15.",
    title: "Your US privacy rights (CCPA/CPRA)",
  },
  { id: "contact-us", num: "16.", title: "Contact us" },
] as const;

export const LEGAL_PAGES = [
  { label: "Terms of Service", href: "/legal/terms", current: true },
  { label: "Privacy Policy →", href: "/legal/privacy", current: false },
  {
    label: "Do Not Sell or Share My Personal Information →",
    href: "/legal/do-not-sell",
    current: false,
  },
  {
    label: "Accessibility Statement →",
    href: "/legal/accessibility",
    current: false,
  },
  { label: "Shipping & Returns →", href: "/shipping-returns", current: false },
  { label: "Subscription Terms →", href: "/faq", current: false },
] as const;

export function TermsHero() {
  return (
    <section
      data-theme="human"
      aria-labelledby="terms-hero-heading"
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
          <span className="opacity-70">Legal</span>
          <span aria-hidden="true">/</span>
          <span className="text-fg font-medium">Terms of Service</span>
        </nav>

        <h1
          id="terms-hero-heading"
          className="hero text-fg tracking-tight text-4xl sm:text-6xl lg:text-7xl"
        >
          Terms of Service
        </h1>

        <div className="flex items-center gap-4 sm:gap-7 flex-wrap mt-4 text-xs sm:text-sm text-fg-muted">
          <span>Last updated: To be confirmed</span>
          <span>Effective: To be confirmed</span>
          <span>Version: To be confirmed</span>
        </div>

        <nav
          aria-label="Legal sections"
          className="flex items-center gap-2.5 flex-wrap mt-8"
        >
          <span
            aria-current="page"
            className="inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-pill font-bold text-sm bg-gradient-gold text-accent-fg"
          >
            Terms of Service
          </span>
          <Link
            href="/legal/privacy"
            className="inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-pill font-bold text-sm border border-accent/50 text-fg hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal/do-not-sell"
            className="inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-pill font-bold text-sm border border-accent/50 text-fg hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Do Not Sell or Share My Personal Information
          </Link>
          <Link
            href="/legal/accessibility"
            className="inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-pill font-bold text-sm border border-accent/50 text-fg hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Accessibility Statement
          </Link>
        </nav>
      </div>
    </section>
  );
}

export function TermsContent() {
  return (
    <div
      data-theme="pet"
      className="bg-bg text-fg px-5 sm:px-8 lg:px-18 py-12 lg:py-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 lg:shrink-0 flex flex-col gap-5">
          {/* Mobile Jump to section accordion */}
          <details className="lg:hidden rounded-card bg-bg-elevated border border-border p-4">
            <summary className="font-bold text-sm cursor-pointer list-none flex items-center justify-between min-h-11">
              <span>Jump to section</span>
              <span aria-hidden="true">▾</span>
            </summary>
            <nav
              aria-label="Jump to section"
              className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5"
            >
              {TERMS_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="text-sm py-1.5 text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  <span className="font-bold text-accent mr-2">{sec.num}</span>
                  {sec.title}
                </a>
              ))}
            </nav>
          </details>

          {/* Desktop Table of Contents */}
          <div className="hidden lg:block rounded-card bg-bg-elevated border border-border p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
              On this page
            </h2>
            <nav aria-label="On this page" className="flex flex-col">
              {TERMS_SECTIONS.map((sec, idx) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={`flex items-start gap-2.5 py-2 text-sm transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm ${
                    idx === 0 ? "font-bold text-fg" : "text-fg-muted"
                  }`}
                >
                  <span className="w-6 shrink-0 opacity-60">{sec.num}</span>
                  <span>{sec.title}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Desktop Legal Pages list */}
          <div className="hidden lg:block rounded-card bg-bg-elevated border border-border p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
              Legal pages
            </h2>
            <nav aria-label="Legal pages sidebar" className="flex flex-col">
              {LEGAL_PAGES.map((page) => (
                <Link
                  key={page.label}
                  href={page.href}
                  className={`py-2.5 text-sm font-bold border-b border-border/70 last:border-b-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm ${
                    page.current ? "text-accent" : "text-fg hover:text-accent"
                  }`}
                >
                  {page.label}
                </Link>
              ))}
            </nav>
            <p className="mt-4 text-xs text-fg-muted leading-relaxed">
              Questions about these terms?{" "}
              <Link
                href="/help"
                className="underline hover:text-fg font-medium"
              >
                Contact us
              </Link>{" "}
              and we will help.
            </p>
          </div>
        </aside>

        {/* Main Article Content */}
        <article className="w-full min-w-0 flex-1 max-w-3xl">
          {/* Intro paragraph */}
          <p className="text-lg sm:text-xl font-medium leading-relaxed mb-10 text-fg">
            Placeholder intro. These Terms of Service govern your use of
            nadeonlabs.com and any purchase from Nadeon Labs. Please read them
            carefully.
          </p>

          {/* Section 1 */}
          <section
            id="acceptance-of-these-terms"
            aria-labelledby="heading-acceptance"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-acceptance"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">1.</span> Acceptance of these terms
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section
            id="eligibility-and-accounts"
            aria-labelledby="heading-eligibility"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-eligibility"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">2.</span> Eligibility and accounts
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section
            id="orders-and-pricing"
            aria-labelledby="heading-orders"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-orders"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">3.</span> Orders and pricing
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section
            id="subscriptions-and-auto-renewal"
            aria-labelledby="heading-subscriptions"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-subscriptions"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">4.</span> Subscriptions and
              auto-renewal
            </h2>

            {/* Dark callout banner */}
            <div
              data-theme="human"
              className="rounded-card bg-bg text-fg p-5 sm:p-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
            >
              <span className="font-archivo font-extrabold text-lg sm:text-xl text-accent">
                Cancel anytime, no fees, no minimum commitment.
              </span>
              <span className="text-sm text-fg-muted shrink-0">
                Skip, pause or cancel online in your account.
              </span>
            </div>

            {/* Automatic renewal disclosure card */}
            <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 text-sm sm:text-base leading-relaxed mb-5 shadow-sm">
              <p>
                <strong>Automatic renewal disclosure.</strong> Your subscription
                renews automatically and we charge your saved payment method at
                the price and interval you chose (every 30, 60 or 90 days) until
                you cancel.{" "}
                <strong>We email you 3 days before each charge</strong> with the
                date, items and amount. Cancel before the charge date to avoid
                the next charge. Cancelling stops future orders and does not
                refund orders that already shipped.
              </p>
            </div>

            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section
            id="shipping-returns-and-refunds"
            aria-labelledby="heading-shipping"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-shipping"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">5.</span> Shipping, returns and
              refunds
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed mb-6">
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>

            <h3 className="font-archivo text-xl font-bold text-fg mb-3">
              Refunds
            </h3>
            <p className="text-base sm:text-lg text-fg/90 mb-4">
              Once we approve a return or a 60-day guarantee claim, we refund
              the original payment method. Timing depends on how you paid:
            </p>

            {/* Refunds table */}
            <div className="rounded-card overflow-hidden border border-border bg-bg-elevated mb-4 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Refunds</caption>
                  <thead
                    data-theme="human"
                    className="bg-bg text-fg text-xs font-bold uppercase tracking-wider"
                  >
                    <tr>
                      <th scope="col" className="p-3.5 sm:p-4">
                        Payment method
                      </th>
                      <th scope="col" className="p-3.5 sm:p-4">
                        Refund issued
                      </th>
                      <th scope="col" className="p-3.5 sm:p-4">
                        Shows on your account
                      </th>
                      <th scope="col" className="p-3.5 sm:p-4">
                        Timeline details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <th
                        scope="row"
                        className="p-3.5 sm:p-4 font-bold text-fg"
                      >
                        Credit or debit card
                      </th>
                      <td className="p-3.5 sm:p-4 text-fg/90">
                        Within 5 business days of approval
                      </td>
                      <td className="p-3.5 sm:p-4 text-fg/90">
                        Up to 10 business days
                      </td>
                      <td className="p-3.5 sm:p-4 text-xs text-fg-muted">
                        Approved Mar 2, refund issued by Mar 9, on statement by
                        Mar 23
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="p-3.5 sm:p-4 font-bold text-fg"
                      >
                        PayPal
                      </th>
                      <td className="p-3.5 sm:p-4 text-fg/90">
                        Within 5 business days of approval
                      </td>
                      <td className="p-3.5 sm:p-4 text-fg/90">
                        Up to 10 business days
                      </td>
                      <td className="p-3.5 sm:p-4 text-xs text-fg-muted">
                        Approved Mar 2, back in PayPal balance or linked card by
                        Mar 23
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="p-3.5 sm:p-4 font-bold text-fg"
                      >
                        Shop Pay
                      </th>
                      <td className="p-3.5 sm:p-4 text-fg/90">
                        Within 5 business days of approval
                      </td>
                      <td className="p-3.5 sm:p-4 text-fg/90">
                        Up to 10 business days
                      </td>
                      <td className="p-3.5 sm:p-4 text-xs text-fg-muted">
                        Approved Mar 2, back on the card used in Shop Pay by Mar
                        23
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-fg-muted italic">
              Dates are examples. Your bank or wallet controls when the refund
              appears after we issue it.
            </p>
          </section>

          {/* Section 6 */}
          <section
            id="rewards-and-promotions"
            aria-labelledby="heading-rewards"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-rewards"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">6.</span> Rewards and promotions
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                One discount per order. Codes (welcome, quiz, launch and
                referral) cannot be combined with each other or with Subscribe
                &amp; Save or kit prices, which already include their discount.
                Reward points can be redeemed on any order.
              </p>
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section
            id="product-information-and-health-disclaimer"
            aria-labelledby="heading-product-info"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-product-info"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">7.</span> Product information and
              health disclaimer
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed mb-5">
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
            <div
              className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 text-sm leading-relaxed shadow-sm"
              role="note"
            >
              *These statements have not been evaluated by the Food and Drug
              Administration. These products are not intended to diagnose,
              treat, cure or prevent any disease.
            </div>
          </section>

          {/* Section 8 */}
          <section
            id="reviews-and-user-content"
            aria-labelledby="heading-reviews"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-reviews"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">8.</span> Reviews and user content
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section
            id="intellectual-property"
            aria-labelledby="heading-ip"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-ip"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">9.</span> Intellectual property
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section
            id="prohibited-uses"
            aria-labelledby="heading-prohibited"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-prohibited"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">10.</span> Prohibited uses
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section
            id="disclaimers-and-limitation-of-liability"
            aria-labelledby="heading-disclaimers"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-disclaimers"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">11.</span> Disclaimers and
              limitation of liability
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section
            id="dispute-resolution-and-arbitration"
            aria-labelledby="heading-dispute"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-dispute"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">12.</span> Dispute resolution and
              arbitration
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed mb-5">
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
            </div>
            <div className="border-l-4 border-fg pl-4 py-2 font-bold text-sm uppercase leading-relaxed text-fg mb-4">
              Placeholder for capitalized arbitration and class action waiver
              notice.
            </div>
          </section>

          {/* Section 13 */}
          <section
            id="governing-law"
            aria-labelledby="heading-law"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-law"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">13.</span> Governing law
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section
            id="changes-to-these-terms"
            aria-labelledby="heading-changes"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-changes"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">14.</span> Changes to these terms
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section
            id="your-us-privacy-rights"
            aria-labelledby="heading-privacy-rights"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-privacy-rights"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">15.</span> Your US privacy rights
              (CCPA/CPRA)
            </h2>
            <p className="text-base sm:text-lg text-fg/90 leading-relaxed mb-6">
              If you live in California or another US state with a consumer
              privacy law, you have the rights below. We do not discriminate
              against you for using them. Full details are in our Privacy
              Policy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 shadow-sm">
                <h3 className="font-bold text-base text-fg">Right to know</h3>
                <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
                  Ask what personal information we collect, use and disclose,
                  and why.
                </p>
              </div>
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 shadow-sm">
                <h3 className="font-bold text-base text-fg">Right to delete</h3>
                <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
                  Ask us to delete personal information we hold about you, with
                  some exceptions.
                </p>
              </div>
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 shadow-sm">
                <h3 className="font-bold text-base text-fg">
                  Right to correct
                </h3>
                <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
                  Ask us to fix personal information that is inaccurate.
                </p>
              </div>
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 shadow-sm">
                <h3 className="font-bold text-base text-fg">
                  Right to opt out of sale or sharing
                </h3>
                <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
                  Tell us not to sell or share your personal information for
                  cross-context behavioral advertising.
                </p>
              </div>
            </div>

            <h3 className="font-archivo text-xl font-bold text-fg mb-3">
              How to submit a request
            </h3>
            <p className="text-base sm:text-lg text-fg/90 leading-relaxed mb-5">
              Use the privacy request form, email our privacy contact (To be
              confirmed) or call our toll-free number (To be confirmed). We
              verify your identity before acting and respond within 45 days. You
              can use an authorized agent. Global Privacy Control (GPC) signals
              are honored as an opt-out of sale and sharing.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/legal/do-not-sell"
                className="inline-flex min-h-11 items-center justify-center rounded-pill bg-fg text-bg px-6 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Submit a privacy request
              </Link>
              <Link
                href="/legal/do-not-sell"
                className="inline-flex min-h-11 items-center font-bold text-sm underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                Do Not Sell or Share My Personal Information →
              </Link>
            </div>
          </section>

          {/* Section 16 */}
          <section
            id="contact-us"
            aria-labelledby="heading-contact"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-contact"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">16.</span> Contact us
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed mb-6">
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
              <p>
                Placeholder text. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
            </div>

            <div className="rounded-card bg-bg-elevated border border-border p-5 sm:p-6 text-sm sm:text-base leading-relaxed shadow-sm">
              <div className="font-bold text-fg text-base sm:text-lg">
                Nadeon Labs
              </div>
              <div className="text-fg/90 mt-1">
                1081 Paulison Ave, Suite 3B, Clifton, NJ 07011
              </div>
              <div className="text-fg/80 mt-1">
                Email: To be confirmed (legal contact placeholder)
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
