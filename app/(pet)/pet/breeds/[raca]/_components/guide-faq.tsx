"use client";

import React from "react";
import { Claim } from "@/components/commerce/product-card/claim";

interface GuideFaqProps {
  breedTitle: string;
}

const FAQ_ITEMS = [
  {
    q: "How many chews should a 70 lb Labrador take?",
    a: "Dose: To be confirmed. Label dose and veterinary recommendation are To be confirmed. Check with your vet first.*",
  },
  {
    q: "Can I give chews and oil together?",
    a: "To be confirmed. Combination routines will be reviewed and published with veterinary guidance.",
  },
  {
    q: "At what age is a Labrador a senior?",
    a: "Typically around 7 years of age, though individual dogs vary. Consult your veterinarian for tailored life-stage screening.",
  },
  {
    q: "My Lab is a picky eater. Is there another format?",
    a: "To be confirmed. We offer soft chews, treats, oils and powders across our Pet product line.",
  },
  {
    q: "Do I need to talk to my vet first?",
    a: "Yes. Always talk to your veterinarian before starting any new dietary supplement with your pet.",
  },
];

export function GuideFaq({ breedTitle }: GuideFaqProps) {
  return (
    <section
      aria-labelledby="guide-faq-heading"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold tracking-widest uppercase text-fg-muted">
          FAQ
        </span>
        <h2
          id="guide-faq-heading"
          className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg"
        >
          {breedTitle.includes("Labrador")
            ? "Labrador questions"
            : `${breedTitle} questions`}
        </h2>
      </div>

      <div className="flex flex-col divide-y divide-border/60 border-y border-border/60">
        {FAQ_ITEMS.map((item, index) => (
          <details key={index} className="group py-4 sm:py-5 cursor-pointer">
            <summary className="flex justify-between items-center font-bold text-base sm:text-lg text-fg list-none select-none">
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="text-fg-muted text-xl font-light transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="pt-3 text-sm sm:text-base text-fg-muted leading-relaxed max-w-3xl">
              {item.a.includes("*") ? (
                <Claim showDisclaimer={false}>{item.a}</Claim>
              ) : (
                item.a
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
