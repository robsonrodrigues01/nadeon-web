import React from "react";
import type { Product } from "@/lib/contracts/catalog";
import { Claim } from "@/components/commerce/product-card/claim";

export interface PetScienceSectionProps {
  product: Product;
  className?: string;
}

export function PetScienceSection({
  product,
  className = "",
}: PetScienceSectionProps) {
  const scienceCards = [
    {
      number: "01",
      title: "NMN for NAD+",
      text: "NMN is a building block dogs use to make NAD+, a coenzyme that declines with age.*",
      tag: "75 MG NMN",
    },
    {
      number: "02",
      title: "Omega-3 EPA + DHA",
      text: "Fatty acids that support joints, skin and coat in older dogs.*",
      tag: "60 MG PER CHEW",
    },
    {
      number: "03",
      title: "CoQ10",
      text: "Supports cellular energy in the heart and muscles.*",
      tag: "15 MG PER CHEW",
    },
    {
      number: "04",
      title: "Dosed by weight",
      text: "1 to 4 chews a day, so small and large dogs get the right amount.",
      tag: "VET-REVIEWED",
    },
  ];

  return (
    <section
      id="science"
      aria-labelledby="science-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border bg-bg-elevated/40 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
            THE SCIENCE
          </span>
          <h2
            id="science-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-fg"
          >
            The science behind {product.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {scienceCards.map((card) => (
            <div
              key={card.number}
              className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card hover:border-accent/40 transition-colors"
            >
              <div>
                <span className="text-3xl font-extrabold text-accent block mb-3">
                  {card.number}
                </span>
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-fg mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed font-medium">
                  <Claim showDisclaimer={false}>{card.text}</Claim>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <span className="inline-flex items-center rounded-pill bg-fg text-bg px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                  {card.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
