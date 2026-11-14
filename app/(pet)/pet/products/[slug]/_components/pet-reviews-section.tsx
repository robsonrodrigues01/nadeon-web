import React from "react";
import type { Review, ReviewSummary } from "@/lib/contracts/reviews";

export interface PetReviewsSectionProps {
  summary: ReviewSummary;
  reviews: Review[];
  className?: string;
}

// Data comes from ReviewsProvider (Server Component). No write button here:
// the review form opens 1 to 2 weeks after launch (plan v3, section 0).
export function PetReviewsSection({
  summary,
  reviews,
  className = "",
}: PetReviewsSectionProps) {
  const total = summary.totalReviews;
  const bars = [5, 4, 3, 2, 1].map((stars) => {
    const count = summary.ratingBreakdown[stars] ?? 0;
    return {
      stars,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  return (
    <section
      id="reviews"
      aria-labelledby="pet-reviews-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border bg-bg-elevated/40 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="mb-10">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-fg/60">
                {total} {total === 1 ? "review" : "reviews"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xl font-extrabold text-fg my-2">
              {total === 0 ? (
                <span className="text-sm font-bold text-fg-muted">
                  No reviews yet
                </span>
              ) : (
                <span className="text-sm font-bold text-fg-muted">
                  {summary.averageRating.toFixed(1)}
                </span>
              )}
            </div>

            {total > 0 && (
              <div className="space-y-2 mt-6">
                {bars.map((bar) => (
                  <div
                    key={bar.stars}
                    className="flex items-center gap-3 text-xs"
                  >
                    <span className="w-12 shrink-0 font-medium text-fg/70">
                      {bar.stars} star
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
            )}
          </div>

          <div className="md:col-span-2 rounded-card border border-border bg-bg-elevated p-8 shadow-card">
            {reviews.length === 0 ? (
              <div className="flex flex-col justify-center min-h-[220px] text-center">
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-fg mb-2">
                  Verified reviews go here
                </h3>
                <p className="text-sm text-fg-muted max-w-md mx-auto leading-relaxed">
                  Real reviews and dog photos will load after launch. We never
                  publish made-up testimonials.
                </p>
              </div>
            ) : (
              <ul className="space-y-6">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="border-b border-border/60 pb-6 last:border-0"
                  >
                    <p className="text-sm font-extrabold text-fg">
                      <span aria-label={`${review.rating} out of 5 stars`}>
                        {"★".repeat(review.rating)}
                      </span>{" "}
                      {review.title}
                    </p>
                    <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                      {review.body}
                    </p>
                    <p className="mt-2 text-xs font-bold text-fg/70">
                      {review.authorName}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
