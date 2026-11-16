import React from "react";
import Link from "next/link";
import { FeedbackForm } from "./feedback-form";

export const ACCESSIBILITY_SECTIONS = [
  { id: "our-commitment", num: "1.", title: "Our commitment" },
  { id: "standards-we-follow", num: "2.", title: "Standards we follow" },
  { id: "measures-we-take", num: "3.", title: "Measures we take" },
  { id: "compatibility", num: "4.", title: "Compatibility" },
  { id: "known-limitations", num: "5.", title: "Known limitations" },
  { id: "feedback-and-contact", num: "6.", title: "Feedback and contact" },
  { id: "alternative-formats", num: "7.", title: "Alternative formats" },
] as const;

export const LEGAL_PAGES = [
  { label: "Terms of Service", href: "/legal/terms", current: false },
  { label: "Privacy Policy", href: "/legal/privacy", current: false },
  {
    label: "Do Not Sell or Share My Personal Information",
    href: "/legal/do-not-sell",
    current: false,
  },
  {
    label: "Accessibility Statement",
    href: "/legal/accessibility",
    current: true,
  },
  {
    label: "Shipping & Returns",
    href: "/shipping-returns",
    current: false,
  },
] as const;

export function AccessibilityHero() {
  return (
    <section
      data-theme="human"
      aria-labelledby="accessibility-hero-heading"
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
          <span className="text-fg font-medium">Accessibility statement</span>
        </nav>

        <h1
          id="accessibility-hero-heading"
          className="font-archivo text-fg tracking-tight text-3xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-tight break-words"
        >
          Accessibility statement
        </h1>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap mt-4 text-xs sm:text-sm text-fg-muted">
          <span>Last updated: To be confirmed</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span>Last reviewed: To be confirmed</span>
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
                className="inline-flex min-h-11 items-center justify-center px-4 sm:px-5 py-2.5 rounded-pill font-bold text-xs sm:text-sm border border-border hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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

export function AccessibilityContent() {
  return (
    <div
      data-theme="pet"
      className="bg-bg text-fg px-5 sm:px-8 lg:px-18 py-12 lg:py-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 lg:shrink-0 flex flex-col gap-6">
          {/* Mobile Accordion */}
          <details className="lg:hidden rounded-card bg-bg-elevated border border-border p-4">
            <summary className="font-bold text-sm cursor-pointer list-none flex items-center justify-between min-h-11">
              <span>On this page (7 sections)</span>
              <span aria-hidden="true">▾</span>
            </summary>
            <nav
              aria-label="Jump to section"
              className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5"
            >
              {ACCESSIBILITY_SECTIONS.map((sec) => (
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

          {/* Desktop On this page */}
          <div className="hidden lg:block rounded-card bg-bg-elevated border border-border p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
              On this page
            </h2>
            <nav aria-label="On this page" className="flex flex-col">
              {ACCESSIBILITY_SECTIONS.map((sec, idx) => (
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

          {/* Desktop Legal Pages Links */}
          <div className="hidden lg:block rounded-card bg-bg-elevated border border-border p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
              Legal pages
            </h2>
            <nav aria-label="Legal pages sidebar" className="flex flex-col">
              {LEGAL_PAGES.map((page) => (
                <Link
                  key={page.label}
                  href={page.href}
                  className={`py-2.5 text-sm font-bold border-b border-border/70 last:border-b-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm flex items-center justify-between ${
                    page.current ? "text-accent" : "text-fg hover:text-accent"
                  }`}
                >
                  <span>{page.label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Article Content */}
        <article className="w-full min-w-0 flex-1 flex flex-col gap-10">
          {/* Template Callout Banner */}
          <div className="rounded-card bg-product-amber/20 border border-accent/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-fg">
            <span className="font-extrabold uppercase px-2.5 py-1 rounded bg-fg text-bg text-xs shrink-0 tracking-wider">
              TEMPLATE
            </span>
            <span className="font-medium leading-relaxed">
              All text on this page is placeholder. Final statement to be
              reviewed after an accessibility audit.
            </span>
          </div>

          {/* Intro Paragraph */}
          <p className="text-base sm:text-lg leading-relaxed text-fg/90">
            Placeholder intro. Nadeon Labs wants everyone, including people with
            disabilities, to be able to shop, learn and get support on
            nadeonlabs.com, on both the Human and Pet storefronts.
          </p>

          {/* Section 1: Our commitment */}
          <section
            id="our-commitment"
            aria-labelledby="heading-our-commitment"
            className="flex flex-col gap-4 pt-4 border-t border-border"
          >
            <h2
              id="heading-our-commitment"
              className="font-archivo text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-fg break-words"
            >
              <span className="text-accent mr-2">1.</span>
              Our commitment
            </h2>
            <p className="text-base leading-relaxed text-fg/85">
              Placeholder text. We design and test our site with accessibility
              in mind and we keep improving it. Accessibility is part of how we
              build new pages, not an afterthought.
            </p>
            <p className="text-base leading-relaxed text-fg/85">
              Placeholder text. A named team member is responsible for
              accessibility: To be confirmed.
            </p>
          </section>

          {/* Section 2: Standards we follow */}
          <section
            id="standards-we-follow"
            aria-labelledby="heading-standards-we-follow"
            className="flex flex-col gap-6 pt-4 border-t border-border"
          >
            <h2
              id="heading-standards-we-follow"
              className="font-archivo text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-fg break-words"
            >
              <span className="text-accent mr-2">2.</span>
              Standards we follow
            </h2>

            {/* WCAG Target Banner */}
            <div
              data-theme="human"
              className="rounded-card bg-bg text-fg p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 shadow-sm"
            >
              <div className="hero text-3xl sm:text-4xl bg-gradient-gold bg-clip-text text-transparent shrink-0">
                WCAG 2.2 AA
              </div>
              <div className="text-sm sm:text-base leading-relaxed opacity-90">
                Our target is conformance with the Web Content Accessibility
                Guidelines (WCAG) 2.2, Level AA. Current status: To be confirmed
                (placeholder, after audit).
              </div>
            </div>

            {/* POUR Principles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5">
                <h3 className="font-bold text-base text-fg">Perceivable</h3>
                <p className="text-xs sm:text-sm text-fg-muted mt-1 leading-relaxed">
                  Text alternatives, captions, contrast
                </p>
              </div>
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5">
                <h3 className="font-bold text-base text-fg">Operable</h3>
                <p className="text-xs sm:text-sm text-fg-muted mt-1 leading-relaxed">
                  Keyboard access, enough time, no seizure triggers
                </p>
              </div>
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5">
                <h3 className="font-bold text-base text-fg">Understandable</h3>
                <p className="text-xs sm:text-sm text-fg-muted mt-1 leading-relaxed">
                  Readable text, predictable pages, input help
                </p>
              </div>
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5">
                <h3 className="font-bold text-base text-fg">Robust</h3>
                <p className="text-xs sm:text-sm text-fg-muted mt-1 leading-relaxed">
                  Works with current and future assistive tech
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Measures we take */}
          <section
            id="measures-we-take"
            aria-labelledby="heading-measures-we-take"
            className="flex flex-col gap-6 pt-4 border-t border-border"
          >
            <h2
              id="heading-measures-we-take"
              className="font-archivo text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-fg break-words"
            >
              <span className="text-accent mr-2">3.</span>
              Measures we take
            </h2>

            <p className="text-base leading-relaxed text-fg/85">
              Placeholder text. Steps we take to support accessibility:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-card bg-bg-elevated border border-border p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-product-amber/20 text-fg font-bold text-sm flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="font-bold text-base text-fg">
                    Keyboard navigation
                  </h3>
                </div>
                <p className="text-sm text-fg/80 leading-relaxed">
                  Every menu, form, cart and quiz step works without a mouse.
                  Visible focus on all controls.
                </p>
              </div>

              <div className="rounded-card bg-bg-elevated border border-border p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-product-amber/20 text-fg font-bold text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h3 className="font-bold text-base text-fg">
                    Text alternatives
                  </h3>
                </div>
                <p className="text-sm text-fg/80 leading-relaxed">
                  Product images, icons and charts have alt text. Decorative
                  images are hidden from screen readers.
                </p>
              </div>

              <div className="rounded-card bg-bg-elevated border border-border p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-product-amber/20 text-fg font-bold text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h3 className="font-bold text-base text-fg">
                    Color and contrast
                  </h3>
                </div>
                <p className="text-sm text-fg/80 leading-relaxed">
                  Text meets AA contrast on dark and cream backgrounds. Color is
                  never the only signal.
                </p>
              </div>

              <div className="rounded-card bg-bg-elevated border border-border p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-product-amber/20 text-fg font-bold text-sm flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h3 className="font-bold text-base text-fg">
                    Forms and errors
                  </h3>
                </div>
                <p className="text-sm text-fg/80 leading-relaxed">
                  Every field has a label. Errors are described in text and
                  announced.
                </p>
              </div>

              <div className="rounded-card bg-bg-elevated border border-border p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-product-amber/20 text-fg font-bold text-sm flex items-center justify-center shrink-0">
                    5
                  </span>
                  <h3 className="font-bold text-base text-fg">
                    Motion and media
                  </h3>
                </div>
                <p className="text-sm text-fg/80 leading-relaxed">
                  Respects reduced motion. Videos have captions and no autoplay
                  with sound.
                </p>
              </div>

              <div className="rounded-card bg-bg-elevated border border-border p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-product-amber/20 text-fg font-bold text-sm flex items-center justify-center shrink-0">
                    6
                  </span>
                  <h3 className="font-bold text-base text-fg">
                    Zoom and reflow
                  </h3>
                </div>
                <p className="text-sm text-fg/80 leading-relaxed">
                  Pages work at 200% zoom and on small screens without side
                  scrolling.
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-fg/85">
              We also include accessibility in staff training, test with
              assistive technology and review new features before launch To be
              confirmed.
            </p>
          </section>

          {/* Section 4: Compatibility */}
          <section
            id="compatibility"
            aria-labelledby="heading-compatibility"
            className="flex flex-col gap-6 pt-4 border-t border-border"
          >
            <h2
              id="heading-compatibility"
              className="font-archivo text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-fg break-words"
            >
              <span className="text-accent mr-2">4.</span>
              Compatibility
            </h2>

            <p className="text-base leading-relaxed text-fg/85">
              Placeholder text. The site is designed to work with:
            </p>

            <div className="rounded-card bg-bg-elevated border border-border overflow-hidden divide-y divide-border">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span className="font-bold text-sm sm:text-base text-fg sm:w-44 shrink-0">
                  Browsers
                </span>
                <span className="text-sm sm:text-base text-fg/80 leading-relaxed">
                  Latest versions of To be confirmed, To be confirmed, To be
                  confirmed (placeholder)
                </span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span className="font-bold text-sm sm:text-base text-fg sm:w-44 shrink-0">
                  Screen readers
                </span>
                <span className="text-sm sm:text-base text-fg/80 leading-relaxed">
                  To be confirmed with To be confirmed; To be confirmed on iOS
                  (placeholder)
                </span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span className="font-bold text-sm sm:text-base text-fg sm:w-44 shrink-0">
                  Devices
                </span>
                <span className="text-sm sm:text-base text-fg/80 leading-relaxed">
                  Desktop, tablet and mobile, portrait and landscape
                </span>
              </div>
            </div>
          </section>

          {/* Section 5: Known limitations */}
          <section
            id="known-limitations"
            aria-labelledby="heading-known-limitations"
            className="flex flex-col gap-6 pt-4 border-t border-border"
          >
            <h2
              id="heading-known-limitations"
              className="font-archivo text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-fg break-words"
            >
              <span className="text-accent mr-2">5.</span>
              Known limitations
            </h2>

            <p className="text-base leading-relaxed text-fg/85">
              Placeholder text. Despite our efforts, some content may not be
              fully accessible yet:
            </p>

            <div className="flex flex-col gap-3.5">
              {/* Item 1 */}
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                <div>
                  <h3 className="font-bold text-base text-fg">
                    To be confirmed
                  </h3>
                  <p className="text-sm text-fg/80 mt-1 leading-relaxed">
                    Some parts of the embedded To be confirmed are not fully
                    keyboard accessible.
                  </p>
                </div>
                <span className="inline-flex items-center self-start sm:self-center px-3 py-1 rounded-pill bg-product-amber/20 text-fg font-bold text-xs shrink-0">
                  Fix planned by To be confirmed
                </span>
              </div>

              {/* Item 2 */}
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                <div>
                  <h3 className="font-bold text-base text-fg">
                    Older PDF documents
                  </h3>
                  <p className="text-sm text-fg/80 mt-1 leading-relaxed">
                    Some lab reports (COAs) are scanned PDFs without tags. Ask
                    us for an accessible version.
                  </p>
                </div>
                <span className="inline-flex items-center self-start sm:self-center px-3 py-1 rounded-pill bg-product-amber/20 text-fg font-bold text-xs shrink-0">
                  Replacing by To be confirmed
                </span>
              </div>

              {/* Item 3 */}
              <div className="rounded-card bg-bg-elevated border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                <div>
                  <h3 className="font-bold text-base text-fg">
                    To be confirmed
                  </h3>
                  <p className="text-sm text-fg/80 mt-1 leading-relaxed">
                    To be confirmed.
                  </p>
                </div>
                <span className="inline-flex items-center self-start sm:self-center px-3 py-1 rounded-pill bg-product-amber/20 text-fg font-bold text-xs shrink-0">
                  Under review
                </span>
              </div>
            </div>
          </section>

          {/* Section 6: Feedback and contact */}
          <section
            id="feedback-and-contact"
            aria-labelledby="heading-feedback-and-contact"
            className="flex flex-col gap-6 pt-4 border-t border-border"
          >
            <h2
              id="heading-feedback-and-contact"
              className="font-archivo text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-fg break-words"
            >
              <span className="text-accent mr-2">6.</span>
              Feedback and contact
            </h2>

            <p className="text-base leading-relaxed text-fg/85">
              If you find a barrier or need help with any part of the site,
              contact us. We will respond and, where possible, help you complete
              your order another way.
            </p>

            {/* Contact channels list */}
            <div className="rounded-card bg-bg-elevated border border-border divide-y divide-border overflow-hidden">
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <span className="text-sm sm:text-base text-fg-muted">
                  Email
                </span>
                <span className="font-bold text-sm sm:text-base text-fg text-right">
                  To be confirmed
                </span>
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <span className="text-sm sm:text-base text-fg-muted">
                  Phone
                </span>
                <span className="font-bold text-sm sm:text-base text-fg text-right">
                  To be confirmed
                </span>
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <span className="text-sm sm:text-base text-fg-muted">
                  Hours
                </span>
                <span className="font-bold text-sm sm:text-base text-fg text-right">
                  Mon to Fri, To be confirmed ET
                </span>
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <span className="text-sm sm:text-base text-fg-muted">
                  Response time
                </span>
                <span className="font-bold text-sm sm:text-base text-fg text-right">
                  Within To be confirmed business days
                </span>
              </div>
            </div>

            {/* Barrier report form */}
            <FeedbackForm />
          </section>

          {/* Section 7: Alternative formats */}
          <section
            id="alternative-formats"
            aria-labelledby="heading-alternative-formats"
            className="flex flex-col gap-4 pt-4 border-t border-border"
          >
            <h2
              id="heading-alternative-formats"
              className="font-archivo text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-fg break-words"
            >
              <span className="text-accent mr-2">7.</span>
              Alternative formats
            </h2>

            <p className="text-base leading-relaxed text-fg/85">
              Placeholder text. Product labels, lab reports and policies are
              available in large print or as accessible documents on request.
            </p>

            <div className="mt-4 pt-4 border-t border-border text-xs sm:text-sm text-fg-muted leading-relaxed">
              This statement was last updated on To be confirmed and last
              reviewed by To be confirmed.
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
