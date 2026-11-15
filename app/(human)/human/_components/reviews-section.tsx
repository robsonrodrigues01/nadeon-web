import React from "react";

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
      </div>
    </section>
  );
}
