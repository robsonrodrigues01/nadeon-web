import React from "react";
import Link from "next/link";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border py-16 sm:py-24 lg:py-28"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 237, 176, 0.95) 0%, rgba(255, 220, 192, 0.9) 45%, rgba(221, 238, 251, 0.9) 100%)",
      }}
    >
      {/* Decorative paw print SVG */}
      <div
        className="pointer-events-none absolute -bottom-10 right-4 sm:right-10 text-fg opacity-[0.06]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-64 w-64 sm:h-96 sm:w-96 fill-current"
        >
          <ellipse
            cx="22"
            cy="42"
            rx="9"
            ry="12"
            transform="rotate(-25 22 42)"
          />
          <ellipse
            cx="39"
            cy="24"
            rx="9.5"
            ry="13"
            transform="rotate(-8 39 24)"
          />
          <ellipse
            cx="61"
            cy="24"
            rx="9.5"
            ry="13"
            transform="rotate(8 61 24)"
          />
          <ellipse
            cx="78"
            cy="42"
            rx="9"
            ry="12"
            transform="rotate(25 78 42)"
          />
          <path d="M50 48 C 38 48 28 60 24 70 C 20 80 26 90 36 89 C 42 88 46 85 50 85 C 54 85 58 88 64 89 C 74 90 80 80 76 70 C 72 60 62 48 50 48 Z" />
        </svg>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-5 sm:px-8 lg:flex-row lg:gap-16 lg:px-12">
        {/* Left Column: Headline and CTAs */}
        <div className="relative z-10 max-w-2xl text-left">
          <span className="inline-block rounded-full bg-fg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-bg">
            SUBSCRIBE &amp; SAVE 15%
          </span>
          <h1
            id="hero-heading"
            className="mt-4 font-sans text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-fg sm:text-5xl lg:text-7xl"
          >
            Never run out of good days.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg sm:text-lg">
            Their daily chew, delivered on your schedule. Save 15% on every
            order. Skip, pause or cancel anytime, no calls needed.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/pet/build-your-box"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-fg px-7 py-3 text-sm font-bold text-bg transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-base"
            >
              Build a subscription
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-5 py-2.5 text-sm font-bold text-fg transition hover:bg-fg/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-base"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Jars Stack */}
        <div
          className="relative flex items-end justify-center gap-3 sm:gap-5"
          aria-hidden="true"
        >
          {/* Jar 1: More Good Years (Mint) */}
          <div className="flex w-24 flex-col items-center justify-end sm:w-36 lg:w-40">
            <div className="h-4 w-18 rounded-t-lg bg-fg shadow-sm sm:h-7 sm:w-28" />
            <div className="relative flex h-24 w-24 flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-card sm:h-36 sm:w-36 lg:h-40 lg:w-40">
              <div className="flex h-3/5 w-full flex-col items-center justify-center bg-product-mint px-2 text-center text-fg">
                <span className="font-sans text-[10px] font-extrabold uppercase leading-none tracking-tight sm:text-sm lg:text-base">
                  More Good Years
                </span>
                <span className="mt-1 text-[7px] font-bold uppercase tracking-wider opacity-85 sm:text-[9px]">
                  Senior · NMN 75 mg
                </span>
              </div>
            </div>
          </div>

          {/* Jar 2: Golden Years (Amber) */}
          <div className="flex w-24 flex-col items-center justify-end sm:w-36 lg:w-40">
            <div className="h-4 w-18 rounded-t-lg bg-fg shadow-sm sm:h-7 sm:w-28" />
            <div className="relative flex h-24 w-24 flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-card sm:h-36 sm:w-36 lg:h-40 lg:w-40">
              <div className="flex h-3/5 w-full flex-col items-center justify-center bg-product-amber px-2 text-center text-fg">
                <span className="font-sans text-[10px] font-extrabold uppercase leading-none tracking-tight sm:text-sm lg:text-base">
                  Golden Years
                </span>
                <span className="mt-1 text-[7px] font-bold uppercase tracking-wider opacity-85 sm:text-[9px]">
                  Joints · NMN 50 mg
                </span>
              </div>
            </div>
          </div>

          {/* Jar 3: Still Sharp (Sky) */}
          <div className="flex w-24 flex-col items-center justify-end sm:w-36 lg:w-40">
            <div className="h-4 w-18 rounded-t-lg bg-fg shadow-sm sm:h-7 sm:w-28" />
            <div className="relative flex h-24 w-24 flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-card sm:h-36 sm:w-36 lg:h-40 lg:w-40">
              <div className="flex h-3/5 w-full flex-col items-center justify-center bg-product-sky px-2 text-center text-fg">
                <span className="font-sans text-[10px] font-extrabold uppercase leading-none tracking-tight sm:text-sm lg:text-base">
                  Still Sharp
                </span>
                <span className="mt-1 text-[7px] font-bold uppercase tracking-wider opacity-85 sm:text-[9px]">
                  Calm · NMN 50 mg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
