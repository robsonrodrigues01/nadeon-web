import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AndForYouSection() {
  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="and-for-you-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-12 rounded border border-border bg-bg-elevated shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left max-w-xl">
            <h2
              id="and-for-you-heading"
              className="text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
            >
              And for you
            </h2>
            <p className="mt-3 text-base text-fg-muted leading-relaxed">
              The same NMN science, in capsules, powders and tinctures.
            </p>
          </div>
          <div>
            <Link
              href="/human"
              className="min-h-11 px-8 py-3.5 inline-flex items-center gap-2 justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
            >
              <span>Visit Nadeon Human →</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
