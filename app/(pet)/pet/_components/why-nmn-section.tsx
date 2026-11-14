import React from "react";
import { Claim } from "@/components/commerce/product-card/claim";

export function WhyNmnSection() {
  const pillars = [
    {
      title: "NAD+ drops with age",
      description:
        "Dogs make less NAD+ as they get older, the same way people do.",
    },
    {
      title: "NMN in every chew",
      description: (
        <Claim>
          Each chew carries NMN, the direct building block of NAD+.*
        </Claim>
      ),
    },
    {
      title: "Dose by weight",
      description:
        "From 1 chew under 20 lbs to 4 chews over 90 lbs, printed on every jar.",
    },
  ];

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="why-nmn-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-left">
          <h2
            id="why-nmn-heading"
            className="text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            Why NMN for pets?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded border border-border bg-bg-elevated shadow-card"
            >
              <span className="text-xs font-mono text-accent">0{idx + 1}</span>
              <h3 className="text-xl font-medium mt-2 text-fg">
                {pillar.title}
              </h3>
              <div className="mt-3 text-sm text-fg-muted leading-relaxed">
                {pillar.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
