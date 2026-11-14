import React from "react";
import Link from "next/link";

export function PawIcon({
  className = "w-5 h-5",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-hidden={ariaHidden}
    >
      <ellipse cx="22" cy="42" rx="9" ry="12" transform="rotate(-25 22 42)" />
      <ellipse cx="39" cy="24" rx="9.5" ry="13" transform="rotate(-8 39 24)" />
      <ellipse cx="61" cy="24" rx="9.5" ry="13" transform="rotate(8 61 24)" />
      <ellipse cx="78" cy="42" rx="9" ry="12" transform="rotate(25 78 42)" />
      <path d="M50 48 C 38 48 28 60 24 70 C 20 80 26 90 36 89 C 42 88 46 85 50 85 C 54 85 58 88 64 89 C 74 90 80 80 76 70 C 72 60 62 48 50 48 Z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      aria-label="Collection Hero"
      className="relative overflow-hidden bg-gradient-to-br from-product-amber/25 via-product-coral/15 to-product-mint/20 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
    >
      {/* Subtle decorative paw watermark */}
      <div className="pointer-events-none absolute right-40 top-0 hidden lg:block opacity-5">
        <PawIcon className="h-72 w-72 text-fg" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          {/* Semantic Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
              <li>
                <Link
                  href="/pet"
                  className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  Pet
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-40">
                /
              </li>
              <li>
                <Link
                  href="/pet/dogs"
                  className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  Shop
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-40">
                /
              </li>
              <li className="text-fg" aria-current="page">
                Dogs
              </li>
            </ol>
          </nav>

          <span className="label block text-xs font-extrabold tracking-widest text-accent uppercase">
            NADEON PET
          </span>

          <h1 className="hero mt-3 text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-fg">
            Shop for dogs
          </h1>

          <p className="lead mt-4 text-base sm:text-lg text-fg/80 max-w-xl">
            NMN soft chews, treats, oils and powder. Dosed by weight,
            vet-reviewed, made in our Clifton, NJ lab.
          </p>

          {/* Species navigation */}
          <nav
            aria-label="Species navigation"
            className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3"
          >
            <Link
              href="/pet/dogs"
              aria-current="page"
              className="inline-flex items-center gap-2 rounded-pill bg-fg px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-extrabold text-bg shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <PawIcon className="h-4 w-4 sm:h-5 sm:w-5 text-bg" />
              <span>Dogs</span>
            </Link>

            <Link
              href="/pet/cats"
              className="inline-flex items-center gap-2 rounded-pill border border-border bg-bg-elevated px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-extrabold text-fg transition-all hover:border-fg/40 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <PawIcon className="h-4 w-4 sm:h-5 sm:w-5 text-fg/50" />
              <span>Cats</span>
            </Link>

            <Link
              href="/pet/horses"
              className="inline-flex items-center gap-2 rounded-pill border border-border bg-bg-elevated px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-extrabold text-fg transition-all hover:border-fg/40 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <PawIcon className="h-4 w-4 sm:h-5 sm:w-5 text-fg/50" />
              <span>Horses</span>
            </Link>
          </nav>
        </div>

        {/* Decorative jar visuals on desktop */}
        <div
          className="hidden lg:flex items-end gap-4 select-none pointer-events-none"
          aria-hidden="true"
        >
          {/* Golden Years mock render visual */}
          <div className="flex flex-col items-center">
            <div className="h-5 w-24 rounded-t-sm bg-fg opacity-90 shadow-sm" />
            <div className="flex h-28 w-32 flex-col items-center justify-center rounded-xl bg-bg-elevated p-3 shadow-card border border-border">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                Joints
              </span>
              <span className="font-extrabold text-xs uppercase text-fg text-center mt-0.5 leading-tight">
                Golden Years
              </span>
              <span className="text-[9px] text-fg-muted mt-0.5">NMN 50 mg</span>
            </div>
          </div>

          {/* More Good Years (elevated center) */}
          <div className="flex flex-col items-center pb-3">
            <div className="h-6 w-28 rounded-t-sm bg-fg shadow-sm" />
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-xl bg-bg-elevated p-3 shadow-elevated border border-border">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                Senior
              </span>
              <span className="font-extrabold text-sm uppercase text-fg text-center mt-1 leading-tight">
                More Good Years
              </span>
              <span className="text-[9px] text-fg-muted mt-0.5">NMN 75 mg</span>
            </div>
          </div>

          {/* Still Sharp mock render visual */}
          <div className="flex flex-col items-center">
            <div className="h-5 w-24 rounded-t-sm bg-fg opacity-90 shadow-sm" />
            <div className="flex h-28 w-32 flex-col items-center justify-center rounded-xl bg-bg-elevated p-3 shadow-card border border-border">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                Calm
              </span>
              <span className="font-extrabold text-xs uppercase text-fg text-center mt-0.5 leading-tight">
                Still Sharp
              </span>
              <span className="text-[9px] text-fg-muted mt-0.5">NMN 50 mg</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
