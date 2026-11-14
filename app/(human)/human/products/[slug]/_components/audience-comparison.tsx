import React from "react";
import { Claim } from "@/components/commerce/product-card/claim";

export interface AudienceComparisonProps {
  productName?: string;
}

const AUDIENCE_CARDS = [
  {
    title: "Starting a longevity routine",
    description: "Adults 25+ who want a simple, single-ingredient start.",
    isClaim: false,
  },
  {
    title: "Busy, active adults",
    description: "People who want daily support for cellular energy.*",
    isClaim: true,
  },
  {
    title: "Already on NAD+",
    description: "Add the precursor, or pair with Renew for both.",
    isClaim: false,
  },
];

const COMPARISON_ROWS = [
  {
    metric: "NMN per serving",
    biohack: "500 mg",
    brandA: "250 mg",
    brandB: "150 mg",
  },
  {
    metric: "Purity tested",
    biohack: "first lots publishing soon",
    brandA: "Not stated",
    brandB: "Not stated",
  },
  {
    metric: "Lab report per lot, public",
    biohack: "first lots publishing soon",
    brandA: "✗",
    brandB: "✗",
  },
  {
    metric: "Lot number on every jar",
    biohack: "✓",
    brandA: "✓",
    brandB: "✗",
  },
  {
    metric: "No proprietary blend",
    biohack: "✓",
    brandA: "✓",
    brandB: "✗",
  },
  {
    metric: "Made in the USA",
    biohack: "✓",
    brandA: "✗",
    brandB: "✓",
  },
  {
    metric: "Vegan capsule",
    biohack: "✓",
    brandA: "✓",
    brandB: "✗",
  },
];

export function AudienceComparison({
  productName = "BioHack",
}: AudienceComparisonProps) {
  return (
    <section
      aria-label="Target audience and market comparison"
      className="w-full bg-bg py-16 px-4 sm:px-8 lg:px-18 border-b border-border text-fg"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section 1: Who it is for */}
        <div className="mb-12">
          <div className="text-xs font-bold tracking-widest uppercase text-product-amber">
            WHO IT IS FOR
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-archivo uppercase text-fg mt-2">
            Is {productName} right for you?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {AUDIENCE_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-card border border-border bg-bg-elevated p-6 shadow-card"
            >
              <h3 className="text-lg font-bold text-fg mb-2">{card.title}</h3>
              <div className="text-sm text-fg-muted leading-relaxed">
                {card.isClaim ? (
                  <Claim showDisclaimer>{card.description}</Claim>
                ) : (
                  <span>{card.description}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Safety caution note */}
        <div
          role="note"
          className="rounded-field border border-border/60 bg-bg-elevated/60 p-4 text-xs text-fg-muted mb-16"
        >
          Not for anyone under 18, pregnant or nursing. Talk to your doctor if
          you take medication.
        </div>

        {/* Section 2: How we compare table */}
        <div>
          <div className="mb-8">
            <div className="text-xs font-bold tracking-widest uppercase text-product-amber">
              HOW WE COMPARE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-archivo uppercase text-fg mt-2">
              {productName} vs. similar NMN supplements
            </h3>
          </div>

          <div className="overflow-x-auto rounded-card border border-border bg-bg-elevated shadow-card">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparison of {productName} with competitor NMN supplements
              </caption>
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th scope="col" className="p-4 sm:p-5 font-bold text-fg">
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="p-4 sm:p-5 font-extrabold text-accent bg-accent/10 border-x border-border"
                  >
                    {productName}
                  </th>
                  <th
                    scope="col"
                    className="p-4 sm:p-5 font-bold text-fg-muted"
                  >
                    NMN brand A
                  </th>
                  <th
                    scope="col"
                    className="p-4 sm:p-5 font-bold text-fg-muted"
                  >
                    NMN brand B
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.metric}
                    className="hover:bg-bg/40 transition-colors"
                  >
                    <th scope="row" className="p-4 sm:p-5 font-medium text-fg">
                      {row.metric}
                    </th>
                    <td className="p-4 sm:p-5 font-bold text-fg bg-accent/5 border-x border-border">
                      {row.biohack}
                    </td>
                    <td className="p-4 sm:p-5 text-fg-muted">{row.brandA}</td>
                    <td className="p-4 sm:p-5 text-fg-muted">{row.brandB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
