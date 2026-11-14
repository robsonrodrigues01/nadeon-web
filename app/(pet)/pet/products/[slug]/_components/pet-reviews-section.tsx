import React from "react";

export interface PetReviewsSectionProps {
  className?: string;
}

// Launch state: no reviews and no write button (plan v3, section 0 and rule 8).
// The review form arrives 1 to 2 weeks after launch.
export function PetReviewsSection({ className = "" }: PetReviewsSectionProps) {
  const ratingBars = [
    { stars: "5 star", pct: 0 },
    { stars: "4 star", pct: 0 },
    { stars: "3 star", pct: 0 },
    { stars: "2 star", pct: 0 },
    { stars: "1 star", pct: 0 },
  ];

  return (
    <section
      id="reviews"
      aria-labelledby="pet-reviews-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border bg-bg-elevated/40 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
              REVIEWS
            </span>
            <h2
              id="pet-reviews-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-fg"
            >
              Pet parent reviews
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Summary Column */}
          <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-pill bg-accent/20 text-accent px-2.5 py-0.5 text-xs font-extrabold uppercase">
                New
              </span>
              <span className="text-xs font-bold text-fg/60">0 reviews</span>
            </div>

            <div className="flex items-center gap-2 text-xl font-extrabold text-fg my-2">
              <span className="opacity-40" aria-hidden="true">
                ☆☆☆☆☆
              </span>
              <span className="text-sm font-bold text-fg-muted">
                No reviews yet
              </span>
            </div>

            {/* Rating breakdown bars */}
            <div className="space-y-2 mt-6">
              {ratingBars.map((bar) => (
                <div
                  key={bar.stars}
                  className="flex items-center gap-3 text-xs"
                >
                  <span className="w-12 shrink-0 font-medium text-fg/70">
                    {bar.stars}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${bar.pct}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-semibold text-fg/60">
                    {bar.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state details */}
          <div className="md:col-span-2 rounded-card border border-border bg-bg-elevated p-8 shadow-card flex flex-col justify-center min-h-[220px] text-center">
            <h3 className="text-lg font-extrabold uppercase tracking-wide text-fg mb-2">
              Verified reviews go here
            </h3>
            <p className="text-sm text-fg-muted max-w-md mx-auto leading-relaxed">
              Real reviews and dog photos will load after launch. We never
              publish made-up testimonials.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
