import React from "react";
import { Star } from "lucide-react";

export function ReviewsSection() {
  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2
              id="reviews-heading"
              className="text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
            >
              Happy tails
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              Real reviews from pet parents will appear here after launch.
            </p>
          </div>
        </div>

        {/* Empty state launch cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((cardId) => (
            <div
              key={cardId}
              className="p-6 rounded border border-border bg-bg-elevated shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-accent mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent"
                      aria-hidden="true"
                    />
                  ))}
                  <span className="sr-only">5 out of 5 stars</span>
                </div>
                <p className="text-sm text-fg-muted italic leading-relaxed">
                  Real reviews from pet parents will appear here after launch.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <span className="text-xs font-mono text-fg-muted">
                  Pet Parent Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
