import React from "react";
import Link from "next/link";
import { PawIcon } from "./hero";

export interface WeightTier {
  weightRange: string;
  doseText: string;
}

export const DOG_WEIGHT_TIERS: readonly WeightTier[] = [
  { weightRange: "Up to 20 lbs", doseText: "1 chew" },
  { weightRange: "21 to 50 lbs", doseText: "2 chews" },
  { weightRange: "51 to 90 lbs", doseText: "3 chews" },
  { weightRange: "Over 90 lbs", doseText: "4 chews" },
] as const;

export function DoseByWeightSection() {
  return (
    <section
      aria-labelledby="dose-by-weight-heading"
      className="bg-product-amber/20 border-y border-border px-6 py-10 sm:px-12 sm:py-12 lg:px-16"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        {/* Header with Paw icon */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="rounded-full bg-product-amber/30 p-3 text-fg">
            <PawIcon className="h-8 w-8 sm:h-10 sm:w-10 text-fg" />
          </div>
          <div>
            <h2
              id="dose-by-weight-heading"
              className="title text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-fg"
            >
              Dose by weight
            </h2>
            <p className="body text-sm sm:text-base text-fg/80 mt-1">
              Soft chews, per day. Oils: 0.5 mL per 20 lbs.
            </p>
          </div>
        </div>

        {/* 4 Weight Tier Cards */}
        <div className="grid w-full flex-1 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:max-w-2xl">
          {DOG_WEIGHT_TIERS.map((tier) => (
            <div
              key={tier.weightRange}
              className="flex flex-col items-center justify-center rounded-card bg-bg-elevated p-4 text-center shadow-xs border border-border"
            >
              <span className="text-xs font-bold text-fg-muted">
                {tier.weightRange}
              </span>
              <span className="title mt-1 text-xl sm:text-2xl font-extrabold text-fg">
                {tier.doseText}
              </span>
            </div>
          ))}
        </div>

        {/* Dosing Guide Action */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <Link
            href="/pet/dose-calculator"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-pill border-2 border-fg bg-transparent px-6 py-2.5 text-sm font-extrabold text-fg transition-all hover:bg-fg hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Full dosing guide
          </Link>
        </div>
      </div>
    </section>
  );
}
