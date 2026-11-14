import React from "react";

export interface ReviewsSectionProps {
  productName?: string;
}

const RATING_BREAKDOWN = [
  { stars: 5, percentage: 0 },
  { stars: 4, percentage: 0 },
  { stars: 3, percentage: 0 },
  { stars: 2, percentage: 0 },
  { stars: 1, percentage: 0 },
];

export function ReviewsSection({
  productName = "BioHack",
}: ReviewsSectionProps) {
  return (
    <section
      aria-label="Customer reviews and ratings"
      className="w-full bg-bg py-16 px-4 sm:px-8 lg:px-18 border-b border-border text-fg"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <div className="text-xs font-bold tracking-widest uppercase text-product-amber">
            REVIEWS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-archivo uppercase text-fg mt-2">
            What customers say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-8 rounded-card border border-border bg-bg-elevated shadow-card">
          {/* Summary Column */}
          <div className="flex flex-col items-start gap-2 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-8">
            <span className="rounded-pill bg-product-amber/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-product-amber">
              New
            </span>
            <div
              className="text-2xl text-product-amber tracking-widest select-none"
              aria-hidden="true"
            >
              ☆☆☆☆☆
            </div>
            <div className="text-lg font-bold text-fg">No reviews yet</div>
            <p className="text-xs text-fg-muted mt-2">
              Be the first to review {productName} once your order arrives.
            </p>
          </div>

          {/* Breakdown Column */}
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-8">
            {RATING_BREAKDOWN.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-fg-muted font-medium">
                  {item.stars} star
                </span>
                <div className="flex-1 h-2 rounded-full bg-bg overflow-hidden border border-border/40">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                    aria-valuenow={item.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                  />
                </div>
                <span className="w-8 text-right text-fg-muted">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Policy & Authenticity Notice (Rule 8: sem botão no lançamento) */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-fg mb-2">
                Verified reviews go here
              </h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                Real customer reviews will load from the review app after
                launch. We never publish made-up testimonials.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border/40 text-[11px] text-fg-muted">
              Authentic verified customer feedback.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
