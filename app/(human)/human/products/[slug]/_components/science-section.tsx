import React from "react";
import Link from "next/link";
import { Claim } from "@/components/commerce/product-card/claim";

export interface ScienceSectionProps {
  productName?: string;
}

const SCIENCE_CARDS = [
  {
    step: "01",
    title: "NMN to NAD+",
    text: "Your cells turn NMN into NAD+, a coenzyme used in energy metabolism.*",
    tag: "500 MG NMN",
    isClaim: true,
  },
  {
    step: "02",
    title: "NAD+ declines with age",
    text: "Studies report lower NAD+ levels in older adults.*",
    tag: "DAILY SUPPORT",
    isClaim: true,
  },
  {
    step: "03",
    title: "Cellular maintenance",
    text: "NAD+ feeds enzymes linked to DNA repair and sirtuin activity.*",
    tag: "HEALTHY AGING",
    isClaim: true,
  },
  {
    step: "04",
    title: "Purity you can check",
    text: "≥99% NMN, tested by a third-party lab, report published per lot.",
    tag: "EVERY LOT",
    isClaim: false,
  },
];

const TIMELINE_STEPS = [
  { week: "Week 1", title: "Build the habit" },
  { week: "Week 4", title: "Stay consistent" },
  { week: "Week 8", title: "Check in on energy" },
  { week: "Week 12", title: "Review with your doctor" },
];

export function ScienceSection({
  productName = "BioHack",
}: ScienceSectionProps) {
  return (
    <section
      aria-label="Scientific background and research"
      className="w-full bg-bg py-16 px-4 sm:px-8 lg:px-18 border-b border-border text-fg"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-xs font-bold tracking-widest uppercase text-product-amber">
            THE SCIENCE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-archivo uppercase text-fg mt-2">
            The science behind {productName}
          </h2>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SCIENCE_CARDS.map((card) => (
            <div
              key={card.step}
              className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card"
            >
              <div>
                <div className="text-2xl font-black font-archivo text-product-amber mb-3">
                  {card.step}
                </div>
                <h3 className="text-lg font-bold text-fg mb-2">{card.title}</h3>
                <div className="text-sm text-fg-muted leading-relaxed">
                  {card.isClaim ? (
                    <Claim showDisclaimer={false}>{card.text}</Claim>
                  ) : (
                    <span>{card.text}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40">
                <span className="text-[11px] font-bold tracking-wider uppercase text-fg-muted">
                  {card.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline What to Expect */}
        <div className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8 mb-10 shadow-card">
          <h3 className="text-xs font-bold tracking-widest uppercase text-product-amber mb-6">
            WHAT TO EXPECT
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TIMELINE_STEPS.map((step, idx) => (
              <div key={step.week} className="relative">
                <div className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-1">
                  {step.week}
                </div>
                <div className="text-sm font-bold text-fg">{step.title}</div>
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute top-2 right-0 w-8 border-t border-border"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer & Read Science Action Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
          <p className="text-xs text-fg-muted max-w-2xl leading-relaxed">
            Individual results vary. *These statements have not been evaluated
            by the Food and Drug Administration. These products are not intended
            to diagnose, treat, cure or prevent any disease.
          </p>

          <Link
            href="/science"
            className="inline-flex min-h-11 items-center justify-center rounded-pill border-2 border-fg px-6 py-2 text-sm font-bold text-fg transition-colors hover:bg-fg hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
          >
            Read the science
          </Link>
        </div>
      </div>
    </section>
  );
}
