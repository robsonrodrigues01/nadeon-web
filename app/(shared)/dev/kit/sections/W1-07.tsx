import React from "react";
import { TrustStrip } from "@/components/brand/trust-strip";

export default function TrustStripSection() {
  return (
    <section aria-labelledby="w1-07-title" className="mb-16">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider">
            Task W1-07
          </span>
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            Brand Component
          </span>
        </div>
        <h2
          id="w1-07-title"
          className="title text-3xl font-black uppercase text-fg tracking-tight"
        >
          Trust Strip (Faixa de Confianca)
        </h2>
        <p className="mt-2 text-fg-muted max-w-3xl text-sm leading-relaxed">
          Informative trust indicators displayed globally on Human and Pet
          storefronts. Highlights Clifton, NJ laboratory testing, lot-by-lot
          public reports, free shipping thresholds ($75 Human / $49 Pet), and
          the 60-day money-back guarantee. Built as an accessible semantic list
          with zero interactive controls, per catalog design specifications.
        </p>
      </div>

      <div className="space-y-10">
        {/* Human Variant Showcase */}
        <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="label text-fg text-sm font-bold uppercase tracking-wider">
                Human Storefront Variant
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Default free shipping threshold: Over $75 · Stylized cellular
                brand badge
              </p>
            </div>
            <span className="label text-xs font-bold text-accent px-2.5 py-1 rounded-full bg-border">
              Theme: Human
            </span>
          </div>

          <div
            data-theme="human"
            className="rounded-card overflow-hidden border border-border bg-bg"
          >
            <TrustStrip line="human" />
          </div>
        </div>

        {/* Pet Variant Showcase */}
        <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="label text-fg text-sm font-bold uppercase tracking-wider">
                Pet Storefront Variant
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Default free shipping threshold: Over $49 · Pet paw brand badge
              </p>
            </div>
            <span className="label text-xs font-bold text-accent px-2.5 py-1 rounded-full bg-border">
              Theme: Pet
            </span>
          </div>

          <div
            data-theme="pet"
            className="rounded-card overflow-hidden border border-border bg-bg text-fg"
          >
            <TrustStrip line="pet" />
          </div>
        </div>

        {/* Technical Architecture & Specifications */}
        <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card">
          <h3 className="label text-fg text-sm font-bold uppercase tracking-wider mb-4">
            Component Specifications &amp; Semantic Checklist
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="rounded-card border border-border bg-bg p-4">
              <dt className="font-bold text-fg mb-1 uppercase tracking-wider">
                Semantic HTML
              </dt>
              <dd className="text-fg-muted leading-relaxed">
                Rendered as &lt;section aria-label=&quot;...&quot;&gt; with an
                explicit &lt;ul role=&quot;list&quot;&gt; and &lt;li&gt; nodes.
              </dd>
            </div>

            <div className="rounded-card border border-border bg-bg p-4">
              <dt className="font-bold text-fg mb-1 uppercase tracking-wider">
                Purely Informative
              </dt>
              <dd className="text-fg-muted leading-relaxed">
                Zero interactive buttons, links or form fields, matching the
                &quot;So informativo&quot; specification in Catalogo section 3.
              </dd>
            </div>

            <div className="rounded-card border border-border bg-bg p-4">
              <dt className="font-bold text-fg mb-1 uppercase tracking-wider">
                Accessibility (a11y)
              </dt>
              <dd className="text-fg-muted leading-relaxed">
                Decorative badge icons flagged with
                aria-hidden=&quot;true&quot;. High contrast text meeting WCAG AA
                standards in both themes.
              </dd>
            </div>

            <div className="rounded-card border border-border bg-bg p-4">
              <dt className="font-bold text-fg mb-1 uppercase tracking-wider">
                Responsive Design
              </dt>
              <dd className="text-fg-muted leading-relaxed">
                2 columns on mobile screens (grid-cols-2) expanding to 4 columns
                on desktop viewports (lg:grid-cols-4).
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
