import React from "react";
import Link from "next/link";

export function ShopHero() {
  return (
    <section
      aria-labelledby="shop-hero-heading"
      className="relative overflow-hidden bg-bg text-fg py-12 px-5 sm:px-8 lg:px-18 border-b border-border/40"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
        <div className="max-w-2xl">
          {/* Semantic Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-xs text-fg-muted font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-40">
                /
              </li>
              <li>
                <Link
                  href="/human"
                  className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
                >
                  Human
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-40">
                /
              </li>
              <li aria-current="page" className="text-fg font-semibold">
                Shop
              </li>
            </ol>
          </nav>

          {/* Eyebrow */}
          <p className="text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-accent bg-gradient-gold bg-clip-text text-transparent">
            THE HUMAN LINE · 7 FORMULAS
          </p>

          {/* Main heading */}
          <h1
            id="shop-hero-heading"
            className="hero mt-3 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase bg-gradient-gold bg-clip-text text-transparent"
          >
            Shop all formulas
          </h1>

          {/* Subtitle */}
          <p className="body mt-4 text-base sm:text-lg lg:text-xl text-fg-muted max-w-xl leading-relaxed">
            NMN and NAD<sup>+</sup> in capsules, powders and tinctures. Tested
            lot by lot in our Clifton, NJ lab.
          </p>
        </div>

        {/* Decorative miniature jar lineup matching design board */}
        <div
          aria-hidden="true"
          className="hidden sm:flex items-end justify-center lg:justify-end gap-4 select-none shrink-0"
        >
          {/* Full Charge mini jar */}
          <div className="w-28 sm:w-32 flex flex-col items-center justify-end">
            <div className="w-20 h-5 bg-border/40 rounded-t-md shadow-inner" />
            <div className="w-28 sm:w-32 h-24 bg-bg-elevated rounded-xl border border-border/60 shadow-card flex flex-col items-center justify-center p-2 text-center">
              <span className="font-extrabold text-xs text-fg">
                Full Charge
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-fg-muted">
                NMN 4-in-1
              </span>
            </div>
          </div>

          {/* BioHack mini jar */}
          <div className="w-28 sm:w-32 flex flex-col items-center justify-end">
            <div className="w-20 h-5 bg-border/40 rounded-t-md shadow-inner" />
            <div className="w-28 sm:w-32 h-24 bg-bg-elevated rounded-xl border border-accent/40 shadow-card flex flex-col items-center justify-center p-2 text-center">
              <span className="font-extrabold text-xs text-fg">BioHack</span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-accent">
                NMN 500 mg
              </span>
            </div>
          </div>

          {/* Renew mini jar */}
          <div className="w-28 sm:w-32 flex flex-col items-center justify-end">
            <div className="w-20 h-5 bg-border/40 rounded-t-md shadow-inner" />
            <div className="w-28 sm:w-32 h-24 bg-bg-elevated rounded-xl border border-border/60 shadow-card flex flex-col items-center justify-center p-2 text-center">
              <span className="font-extrabold text-xs text-fg">Renew</span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-fg-muted">
                NAD+ + Resveratrol
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
