import React from "react";
import Link from "next/link";

export function ByLifeStageSection() {
  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="by-life-stage-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
            BY LIFE STAGE
          </span>
          <h2
            id="by-life-stage-heading"
            className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            Right for their age
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Adult Dogs */}
          <div className="p-8 rounded border border-border bg-bg-elevated shadow-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-accent">
                1 to 6 years
              </span>
              <h3 className="text-2xl font-medium mt-1 text-fg">Adult dogs</h3>
              <p className="mt-3 text-sm text-fg-muted">
                Shine On · Still Sharp · Good Days
              </p>
              <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                Foundational cellular protection, calm temperament and coat
                resilience to keep prime years strong and active.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border">
              <Link
                href="/pet/dogs"
                className="min-h-11 px-6 py-2.5 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
              >
                Shop adult dogs
              </Link>
            </div>
          </div>

          {/* Senior Dogs */}
          <div className="p-8 rounded border border-border bg-bg-elevated shadow-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-accent">
                7+ years
              </span>
              <h3 className="text-2xl font-medium mt-1 text-fg">Senior dogs</h3>
              <p className="mt-3 text-sm text-fg-muted">
                More Good Years · Golden Years · Second Wind
              </p>
              <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                Higher potency NMN with joint and mobility compounds designed
                specifically for the biological needs of aging dogs.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border">
              <Link
                href="/pet/dogs"
                className="min-h-11 px-6 py-2.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
              >
                Shop senior dogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
