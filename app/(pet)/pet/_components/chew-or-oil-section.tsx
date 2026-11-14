import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function ChewOrOilSection() {
  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="chew-or-oil-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
            CHEW OR OIL?
          </span>
          <h2
            id="chew-or-oil-heading"
            className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            Pick the format that fits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Soft chews */}
          <div className="p-8 rounded border border-border bg-bg-elevated shadow-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-accent uppercase">
                Senior · NMN 75 mg
              </span>
              <h3 className="text-2xl font-medium mt-1 text-fg">Soft chews</h3>
              <p className="mt-2 text-sm text-fg-muted">Daily, like a treat</p>

              <ul className="mt-6 space-y-3 text-sm text-fg">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>NMN in every chew</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Fixed dose by weight</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Easy for most dogs</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <Link
                href="/pet/dogs"
                className="min-h-11 px-6 py-2.5 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
              >
                Shop soft chews
              </Link>
            </div>
          </div>

          {/* Oils */}
          <div className="p-8 rounded border border-border bg-bg-elevated shadow-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-accent uppercase">
                Drops on food
              </span>
              <h3 className="text-2xl font-medium mt-1 text-fg">Oils</h3>
              <p className="mt-2 text-sm text-fg-muted">Golden Years Oil</p>

              <ul className="mt-6 space-y-3 text-sm text-fg">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Adjustable: 0.5 mL per 20 lbs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Good for picky eaters</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Pairs with the chews</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <Link
                href="/pet/dogs"
                className="min-h-11 px-6 py-2.5 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
              >
                Shop oils
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pet/kits"
            className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
          >
            Get the bundle
          </Link>
        </div>
      </div>
    </section>
  );
}
