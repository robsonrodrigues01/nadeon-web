import React from "react";
import Link from "next/link";

export function OurStory() {
  const highlights = [
    { label: "Clifton, NJ", detail: "Our own lab" },
    { label: "Every lot", detail: "Numbered and dated" },
    { label: "Raw material", detail: "Tracked to the jar" },
  ];

  return (
    <section
      aria-labelledby="our-story-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
            OUR STORY
          </span>
          <h2
            id="our-story-title"
            className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            Made by people who read labels
          </h2>
          <p className="mt-6 text-base sm:text-lg text-fg-muted leading-relaxed">
            Nadeon Labs makes NMN and NAD⁺ formulas in small lots in our
            Clifton, New Jersey lab, for people and for the animals they love.
            Every lot is numbered, dated and tracked from raw material to jar.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-card border border-border bg-bg-elevated p-6 shadow-card"
              >
                <span className="font-archivo text-xl font-bold uppercase text-fg block">
                  {h.label}
                </span>
                <span className="mt-1 text-xs uppercase font-medium text-accent block">
                  {h.detail}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/about"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
            >
              About us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
