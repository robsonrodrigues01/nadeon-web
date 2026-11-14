import React from "react";
import Link from "next/link";

export interface HeroProps {
  discountPercentage?: number;
}

export function Hero({ discountPercentage = 15 }: HeroProps = {}) {
  return (
    <section
      aria-label="Subscribe & Save"
      className="relative overflow-hidden bg-bg-elevated text-fg border-b border-border py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="max-w-2xl lg:col-span-7">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-fg">
              SUBSCRIBE &amp; SAVE {discountPercentage}%
            </span>

            <h1 className="mt-6 font-archivo text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-fg leading-none">
              Your routine,
              <br />
              <span className="text-accent">on autopilot</span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-fg-muted leading-relaxed max-w-xl">
              Your daily NMN and NAD<sup>+</sup>, delivered on your schedule.
              Save {discountPercentage}% on every box, ship free every time, and
              skip, pause or cancel whenever you like.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/human/build-your-box"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
              >
                Build your box
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
              >
                How it works
              </Link>
            </div>
          </div>

          {/* Formulas visual preview */}
          <div
            aria-hidden="true"
            className="flex items-end justify-center gap-4 sm:gap-6 pt-6 lg:col-span-5 lg:justify-end"
          >
            {/* Renew Jar */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-24 rounded-t-md bg-[var(--product-rose)] shadow-sm" />
              <div className="flex h-36 w-32 flex-col items-center justify-center rounded-2xl bg-bg p-3 text-center shadow-card border border-border">
                <span className="font-archivo text-base font-black text-[var(--product-rose)]">
                  Renew
                </span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[var(--product-rose)] opacity-80">
                  NAD+ + Resveratrol
                </span>
              </div>
            </div>

            {/* BioHack Jar (featured center) */}
            <div className="flex flex-col items-center -translate-y-4">
              <div className="h-7 w-28 rounded-t-md bg-fg shadow-sm" />
              <div className="flex h-44 w-36 flex-col items-center justify-center rounded-2xl bg-bg p-3 text-center shadow-elevated border border-accent">
                <span className="inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[8px] font-bold uppercase text-accent">
                  Hero
                </span>
                <span className="mt-1 font-archivo text-lg font-black text-fg">
                  BioHack
                </span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-fg-muted">
                  NMN 500 mg
                </span>
              </div>
            </div>

            {/* Full Charge Jar */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-24 rounded-t-md bg-[var(--product-amber)] shadow-sm" />
              <div className="flex h-36 w-32 flex-col items-center justify-center rounded-2xl bg-bg p-3 text-center shadow-card border border-border">
                <span className="font-archivo text-base font-black text-[var(--product-amber)]">
                  Full Charge
                </span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[var(--product-amber)] opacity-80">
                  NMN 4-in-1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
