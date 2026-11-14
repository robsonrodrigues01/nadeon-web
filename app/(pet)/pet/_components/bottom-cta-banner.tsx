import React from "react";
import Link from "next/link";

export function BottomCtaBanner() {
  return (
    <section
      className="w-full bg-bg text-fg py-16 sm:py-24 border-b border-border"
      aria-labelledby="bottom-cta-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-14 rounded border border-border bg-bg-elevated shadow-card text-center max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-mono text-accent">
            10% OFF THEIR FIRST JAR
          </span>
          <h2
            id="bottom-cta-heading"
            className="mt-3 text-3xl sm:text-5xl font-normal font-sans tracking-tight text-fg"
          >
            Give them more good years.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-fg-muted">
            Free shipping over $49 · Vet-reviewed · Cancel anytime
          </p>

          <div className="mt-4 text-xs font-mono text-fg-muted">
            More Good Years · Golden Years · Still Sharp · Shine On
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pet/dogs"
              className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
            >
              Shop dog chews
            </Link>
            <Link
              href="/pet/quiz"
              className="min-h-11 px-6 py-3 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
            >
              Find the right formula
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
