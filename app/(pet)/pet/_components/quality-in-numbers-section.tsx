import React from "react";
import Link from "next/link";

export function QualityInNumbersSection() {
  const specs = [
    {
      stat: "90 to 120%",
      label: "Active content vs. label",
    },
    {
      stat: "≤ 10,000",
      label: "CFU/g total aerobic count",
    },
    {
      stat: "Negative",
      label: "Salmonella in 25 g",
    },
    {
      stat: "NASC",
      label: "Heavy metals within limits",
    },
    {
      stat: "Every lot",
      label: "Numbered, dated, tracked",
    },
  ];

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="quality-in-numbers-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
            QUALITY IN NUMBERS
          </span>
          <h2
            id="quality-in-numbers-heading"
            className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            Release specs for every lot
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="p-6 rounded border border-border bg-bg-elevated shadow-card flex flex-col justify-center text-center"
            >
              <p className="text-2xl sm:text-3xl font-medium text-fg">
                {spec.stat}
              </p>
              <p className="mt-2 text-xs text-fg-muted font-mono leading-snug">
                {spec.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/lab-results"
            className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
          >
            Look up your lot
          </Link>
        </div>
      </div>
    </section>
  );
}
