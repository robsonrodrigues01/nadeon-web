import React from "react";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";

export interface PetExpectSectionProps {
  className?: string;
}

export function PetExpectSection({ className = "" }: PetExpectSectionProps) {
  const steps = [
    {
      period: "Day 1",
      title: "First chew",
      description: "Introduce during or after a morning meal.",
    },
    {
      period: "Week 2",
      title: "Daily rhythm",
      description: "Consistent cellular support taking root.",
    },
    {
      period: "Week 6",
      title: "Check in on walks and coat",
      description: "Notice daily vitality and mobility.",
    },
    {
      period: "Week 12",
      title: "Keep going, talk to your vet",
      description: "Long-term wellness for senior companions.",
    },
  ];

  return (
    <section
      aria-labelledby="what-to-expect-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center rounded-pill bg-fg text-bg px-3 py-1 text-xs font-extrabold uppercase tracking-wider mb-3">
              VET-REVIEWED
            </span>
            <h2
              id="what-to-expect-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-fg"
            >
              WHAT TO EXPECT
            </h2>
          </div>

          <Button
            variant="secondary"
            href="/science"
            size="default"
            className="self-start sm:self-auto min-h-11"
          >
            Read the science
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card"
            >
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
                  {step.period}
                </span>
                <h3 className="text-base font-extrabold uppercase tracking-wide text-fg mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-fg-muted font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs text-fg-muted">
          <Claim showDisclaimer={false}>
            Every dog is different. *These statements have not been evaluated by
            the Food and Drug Administration. These products are not intended to
            diagnose, treat, cure or prevent any disease.
          </Claim>
        </div>
      </div>
    </section>
  );
}
