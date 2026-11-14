import React from "react";
import Link from "next/link";

export function DoseByWeightSection() {
  const tiers = [
    {
      range: "Up to 20 lbs",
      dose: "1 chew",
      frequency: "per day",
    },
    {
      range: "21 to 50 lbs",
      dose: "2 chews",
      frequency: "per day",
    },
    {
      range: "51 to 90 lbs",
      dose: "3 chews",
      frequency: "per day",
    },
    {
      range: "Over 90 lbs",
      dose: "4 chews",
      frequency: "per day",
    },
  ];

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="dose-by-weight-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
            DOSE BY WEIGHT
          </span>
          <h2
            id="dose-by-weight-heading"
            className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            How many chews a day?
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.range}
              className="p-6 rounded border border-border bg-bg-elevated shadow-card text-center flex flex-col justify-center"
            >
              <span className="text-xs sm:text-sm font-mono text-fg-muted uppercase">
                {tier.range}
              </span>
              <p className="mt-3 text-2xl sm:text-3xl font-medium text-fg">
                {tier.dose}
              </p>
              <span className="text-xs text-accent font-medium mt-1">
                {tier.frequency}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded bg-bg-elevated border border-border text-center text-sm text-fg-muted">
          Example: a 35 lb dog takes 2 chews a day. Give with or after a meal.
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/pet/dogs"
            className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
          >
            Shop chews for my dog
          </Link>
          <Link
            href="/pet/quiz"
            className="min-h-11 px-6 py-3 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
          >
            Take the quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
