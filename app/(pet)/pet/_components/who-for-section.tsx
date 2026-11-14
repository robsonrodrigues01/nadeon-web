import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function WhoForSection() {
  const cards = [
    {
      species: "Dogs",
      subtitle: "10 formulas",
      cta: "Shop dogs →",
      href: "/pet/dogs",
      description:
        "Soft chews, treats and oils formulated for canine vitality and joint longevity.",
    },
    {
      species: "Cats",
      subtitle: "2 drops",
      cta: "Shop cats →",
      href: "/pet/cats",
      description:
        "Precision dropper formulations crafted specifically for feline metabolism.",
    },
    {
      species: "Horses",
      subtitle: "2 top-dress powders",
      cta: "Shop horses →",
      href: "/pet/horses",
      description:
        "Targeted equine top-dress powders supporting active joints and stamina.",
    },
  ];

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="who-for-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-left mb-10">
          <h2
            id="who-for-heading"
            className="text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            Who are we shopping for?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.species}
              className="p-6 sm:p-8 rounded border border-border bg-bg-elevated shadow-card flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono uppercase text-accent">
                  {card.subtitle}
                </span>
                <h3 className="text-2xl font-medium mt-1 text-fg">
                  {card.species}
                </h3>
                <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  href={card.href}
                  className="min-h-11 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
