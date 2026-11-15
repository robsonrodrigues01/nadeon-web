import React from "react";
import Link from "next/link";

export const PRIVACY_SECTIONS = [
  { id: "introduction-and-scope", num: "1.", title: "Introduction and scope" },
  { id: "information-we-collect", num: "2.", title: "Information we collect" },
  {
    id: "how-we-use-your-information",
    num: "3.",
    title: "How we use your information",
  },
  {
    id: "cookies-and-tracking-technologies",
    num: "4.",
    title: "Cookies and tracking technologies",
  },
  {
    id: "how-we-share-your-information",
    num: "5.",
    title: "How we share your information",
  },
  {
    id: "your-us-privacy-rights",
    num: "6.",
    title: "Your US privacy rights (CCPA/CPRA)",
  },
  {
    id: "how-to-submit-a-privacy-request",
    num: "7.",
    title: "How to submit a privacy request",
  },
  {
    id: "data-retention-and-security",
    num: "8.",
    title: "Data retention and security",
  },
  { id: "childrens-privacy", num: "9.", title: "Children's privacy" },
  {
    id: "changes-to-this-privacy-policy",
    num: "10.",
    title: "Changes to this privacy policy",
  },
  { id: "contact-us", num: "11.", title: "Contact us" },
] as const;

export const LEGAL_PAGES = [
  { label: "Terms of Service →", href: "/legal/terms", current: false },
  { label: "Privacy Policy", href: "/legal/privacy", current: true },
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

export function PrivacyHero() {
  return (
    <section
      data-theme="human"
      aria-labelledby="privacy-hero-heading"
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
          <span className="text-fg font-medium">Privacy Policy</span>
        </nav>

        <h1
          id="privacy-hero-heading"
          className="hero text-fg tracking-tight text-4xl sm:text-6xl lg:text-7xl"
        >
          Privacy Policy
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
          <Link
            href="/legal/terms"
            className="inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-pill font-bold text-sm border border-accent/50 text-fg hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Terms of Service
          </Link>
          <span
            aria-current="page"
            className="inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-pill font-bold text-sm bg-gradient-gold text-accent-fg"
          >
            Privacy Policy
          </span>
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

export function PrivacyContent() {
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
              {PRIVACY_SECTIONS.map((sec) => (
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
              {PRIVACY_SECTIONS.map((sec, idx) => (
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
              Questions about our privacy policy?{" "}
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
        <article className="flex-1 max-w-3xl">
          {/* Intro paragraph */}
          <p className="text-lg sm:text-xl font-medium leading-relaxed mb-10 text-fg">
            Placeholder intro. This Privacy Policy describes how Nadeon Labs
            collects, uses, and discloses your personal information when you
            visit or make a purchase from nadeonlabs.com.
          </p>

          {/* Section 1 */}
          <section
            id="introduction-and-scope"
            aria-labelledby="heading-privacy-intro"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-privacy-intro"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">1.</span> Introduction and scope
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. This policy applies to personal data collected
                through nadeonlabs.com, customer service interactions, and
                marketing communications.
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

          {/* Section 2 */}
          <section
            id="information-we-collect"
            aria-labelledby="heading-info-collect"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-info-collect"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">2.</span> Information we collect
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. We collect personal identifiers (name, email
                address, shipping and billing address, phone number), commercial
                information (purchase history, subscription details), and
                technical information (IP address, browser type, device
                identifiers).
              </p>
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section
            id="how-we-use-your-information"
            aria-labelledby="heading-info-use"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-info-use"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">3.</span> How we use your
              information
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. We use your personal information to fulfill
                orders, process payments, manage subscriptions, communicate
                order updates, send marketing offers (with your consent), and
                improve our website experience.
              </p>
              <p>
                Placeholder text. Curabitur pretium tincidunt lacus. Nulla
                gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                est eros bibendum elit, nec luctus magna felis sollicitudin
                mauris.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section
            id="cookies-and-tracking-technologies"
            aria-labelledby="heading-cookies"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-cookies"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">4.</span> Cookies and tracking
              technologies
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed mb-5">
              <p>
                We use cookies and similar tracking technologies to run our
                online store, enhance site navigation, and measure performance.
                We use essential cookies to run the store, and optional cookies
                for analytics and advertising.
              </p>
              <p>
                You can manage cookie preferences or reject non-essential
                cookies. Global Privacy Control (GPC) signals broadcast by your
                browser are recognized and honored as a valid opt-out of sale
                and sharing.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section
            id="how-we-share-your-information"
            aria-labelledby="heading-info-share"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-info-share"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">5.</span> How we share your
              information
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. We share personal information with trusted
                service providers who assist us in operating our store,
                processing payments, delivering packages, and conducting
                analytics.
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

          {/* Section 6 */}
          <section
            id="your-us-privacy-rights"
            aria-labelledby="heading-privacy-rights"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-privacy-rights"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">6.</span> Your US privacy rights
              (CCPA/CPRA)
            </h2>
            <p className="text-base sm:text-lg text-fg/90 leading-relaxed mb-6">
              If you live in California or another US state with a consumer
              privacy law, you have the rights below. We do not discriminate
              against you for using them.
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
          </section>

          {/* Section 7 */}
          <section
            id="how-to-submit-a-privacy-request"
            aria-labelledby="heading-submit-request"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-submit-request"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">7.</span> How to submit a privacy
              request
            </h2>
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

          {/* Section 8 */}
          <section
            id="data-retention-and-security"
            aria-labelledby="heading-retention"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-retention"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">8.</span> Data retention and
              security
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. We retain personal information for as long as
                necessary to fulfill the purposes described in this policy,
                unless a longer retention period is required by law.
              </p>
              <p>
                Placeholder text. We maintain reasonable technical and
                organizational security measures to protect personal information
                against unauthorized access, loss, or misuse.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section
            id="childrens-privacy"
            aria-labelledby="heading-children"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-children"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">9.</span> Children&apos;s privacy
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. Our website is not directed to children under
                16 years of age, and we do not knowingly collect personal
                information from children.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section
            id="changes-to-this-privacy-policy"
            aria-labelledby="heading-changes-privacy"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-changes-privacy"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">10.</span> Changes to this privacy
              policy
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed">
              <p>
                Placeholder text. We may update this Privacy Policy from time to
                time. When we make changes, we will update the date at the top
                of this page.
              </p>
              <p>
                Placeholder text. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section
            id="contact-us"
            aria-labelledby="heading-contact-privacy"
            className="mb-12 scroll-mt-24"
          >
            <h2
              id="heading-contact-privacy"
              className="title text-2xl sm:text-3xl font-extrabold text-fg mb-4"
            >
              <span className="text-accent">11.</span> Contact us
            </h2>
            <div className="space-y-4 text-fg/90 text-base sm:text-lg leading-relaxed mb-6">
              <p>
                Placeholder text. If you have any questions or concerns about
                this Privacy Policy or our privacy practices, please contact us.
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
                Email: To be confirmed (privacy contact placeholder)
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
