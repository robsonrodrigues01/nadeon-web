import React from "react";
import Link from "next/link";

export function QuizBanner() {
  return (
    <section
      data-theme="pet"
      aria-labelledby="quiz-banner-heading"
      className="bg-bg text-fg py-16 lg:py-20 px-5 sm:px-8 lg:px-18 border-t border-border/40"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-fg px-3.5 py-1 text-xs font-bold tracking-wider text-bg uppercase select-none">
            60-SECOND QUIZ
          </span>

          <h2
            id="quiz-banner-heading"
            className="title mt-4 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-fg"
          >
            Not sure which one?
          </h2>

          <p className="body mt-3 text-base sm:text-lg text-fg-muted leading-relaxed">
            Answer 5 questions about your age, goals and routine. Get your
            formula, plus 10% off your first order.
          </p>
        </div>

        <div>
          <Link
            href="/quiz"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-fg px-8 py-3.5 font-bold text-sm text-bg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-xs"
          >
            Take the quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
