import React from "react";
import { Footer } from "@/components/layout/footer";

export default function W104Section() {
  return (
    <section aria-labelledby="section-w1-04" className="mb-16 space-y-12">
      <header className="border-b border-border pb-4">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Global Layout Components · W1-04
        </span>
        <h2
          id="section-w1-04"
          className="title text-3xl font-black uppercase text-fg"
        >
          Footer · Human &amp; Pet Variants
        </h2>
        <p className="text-sm text-fg-muted mt-2 max-w-3xl">
          Complete global footers showcasing semantic HTML5 structure,
          accessible navigation columns (Shop, Learn, Help, Company),
          interactive newsletter subscription with forms provider integration,
          cross-line promotion cards, regulatory disclaimers (including equine
          and animal use warnings on Pet), social media links, and payment
          method badges.
        </p>
      </header>

      {/* Human Line Variant */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-fg">
              Human Line Footer Variant
            </h3>
            <p className="text-xs text-fg-muted">
              Theme: Human · Features human product catalog links, Nadeon Pet
              cross-promo card, and standard FDA disclaimer.
            </p>
          </div>
          <span className="label inline-block rounded-full bg-accent/20 border border-accent/40 text-accent px-3 py-1 text-xs font-bold uppercase">
            Variant: Human
          </span>
        </div>

        <div className="rounded-card overflow-hidden border border-border shadow-elevated">
          <Footer line="human" />
        </div>
      </div>

      {/* Pet Line Variant */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-fg">
              Pet Line Footer Variant
            </h3>
            <p className="text-xs text-fg-muted">
              Theme: Pet · Features pet product lines (Dogs, Cats, Horses),
              Nadeon Human cross-promo card, and mandatory animal &amp; equine
              regulatory notices.
            </p>
          </div>
          <span className="label inline-block rounded-full bg-accent/20 border border-accent/40 text-accent px-3 py-1 text-xs font-bold uppercase">
            Variant: Pet
          </span>
        </div>

        <div className="rounded-card overflow-hidden border border-border shadow-elevated">
          <Footer line="pet" />
        </div>
      </div>
    </section>
  );
}
