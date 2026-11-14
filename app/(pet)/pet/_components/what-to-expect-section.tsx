import React from "react";
import Link from "next/link";
import { Claim } from "@/components/commerce/product-card/claim";

export function WhatToExpectSection() {
  const steps = [
    {
      timeframe: "Day 1",
      title: "First chew",
      description: "Most dogs take it like a treat.",
    },
    {
      timeframe: "Week 2",
      title: "Daily rhythm",
      description: "Same time, every day.",
    },
    {
      timeframe: "Week 6",
      title: "Check in",
      description: "Watch energy, walks and coat.",
    },
    {
      timeframe: "Week 12",
      title: "Keep it going",
      description: "Talk to your vet about next steps.",
    },
  ];

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="what-to-expect-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
            WHAT TO EXPECT
          </span>
          <h2
            id="what-to-expect-heading"
            className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            Good things take a few weeks
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.timeframe}
              className="p-6 rounded border border-border bg-bg-elevated shadow-card flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono uppercase text-accent">
                  {step.timeframe}
                </span>
                <h3 className="text-lg font-medium mt-1 text-fg">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-fg-muted">
          <Claim showDisclaimer>
            Every dog is different. These statements have not been evaluated by
            the FDA.*
          </Claim>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/pet/dogs"
            className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
          >
            Start today
          </Link>
          <Link
            href="/pet/subscribe"
            className="min-h-11 px-6 py-3 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
          >
            Subscribe & save 15%
          </Link>
        </div>
      </div>
    </section>
  );
}
