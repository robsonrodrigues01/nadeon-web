import React from "react";
import Link from "next/link";

const TRY_SEARCHES = [
  "nmn vs nad+",
  "nmn powder",
  "nmn dosage",
  "nmn for dogs",
];

const POPULAR_SEARCHES = [
  "BioHack",
  "Lab results",
  "Subscribe & save",
  "NAD + powder",
];

const chipClass =
  "inline-flex min-h-11 items-center rounded-pill border border-border px-4 text-sm font-bold text-fg hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function SearchTrySuggestions() {
  return (
    <nav aria-label="Try these searches" className="mt-4">
      <p className="text-sm font-bold text-fg-muted">Try:</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {TRY_SEARCHES.map((term) => (
          <li key={term}>
            <Link
              href={`/search?q=${encodeURIComponent(term)}`}
              className={chipClass}
            >
              {term}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SearchPopularAndQuiz() {
  return (
    <section
      aria-labelledby="popular-searches-heading"
      className="px-5 py-8 sm:px-8 lg:px-18"
    >
      <h2
        id="popular-searches-heading"
        className="text-sm font-bold uppercase tracking-wider text-fg-muted"
      >
        Popular searches
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((term) => (
          <li key={term}>
            <Link
              href={`/search?q=${encodeURIComponent(term)}`}
              className={chipClass}
            >
              {term}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/human/quiz" className={chipClass}>
            Take the quiz
          </Link>
        </li>
      </ul>

      <div className="mt-8 rounded-card border border-border bg-bg-elevated p-6 shadow-card">
        <h2 className="title text-xl font-extrabold text-fg">
          Not sure what you need?
        </h2>
        <p className="mt-1 text-sm text-fg-muted">5 questions. Your formula.</p>
        <Link
          href="/human/quiz"
          className="mt-4 inline-flex min-h-11 items-center rounded-pill bg-accent px-5 text-sm font-bold text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Take the quiz
        </Link>
      </div>
    </section>
  );
}
