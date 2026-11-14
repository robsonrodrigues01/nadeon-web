import React from "react";
import Link from "next/link";

export function ReviewsSection() {
  return (
    <section
      aria-labelledby="reviews-section-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
        <h2
          id="reviews-section-title"
          className="font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
        >
          What customers say
        </h2>

        {/* Empty state per Rule 8 & Decision 19 */}
        <div className="mt-12 rounded-card border border-border bg-bg-elevated p-12 max-w-xl mx-auto shadow-card">
          <p className="text-base sm:text-lg font-medium text-fg-muted">
            No reviews yet
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/reviews"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Read all reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
