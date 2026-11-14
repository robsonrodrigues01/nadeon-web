import React from "react";
import type { Product } from "@/lib/contracts/catalog";
import { Claim } from "@/components/commerce/product-card/claim";

export interface PetAudienceSectionProps {
  product: Product;
  className?: string;
}

export function PetAudienceSection({
  product,
  className = "",
}: PetAudienceSectionProps) {
  const isHorse = product.species === "horse";
  const isCat = product.species === "cat";

  const cards = isHorse
    ? [
        {
          title: "Performance horses",
          text: "Intensive training, competition, and daily conditioning demands.",
        },
        {
          title: "Veterans 15+",
          text: "Built for golden years in pasture, trail riding, and continued vitality.",
        },
        {
          title: "Working breeds",
          text: "Demanding workloads needing stamina and accelerated muscle recovery.*",
        },
      ]
    : isCat
      ? [
          {
            title: "Senior cats 7+",
            text: "Less leaping, more naps. Specially balanced for feline longevity.",
          },
          {
            title: "Indoor companions",
            text: "Supporting mobility and coat health through steady daily routine.",
          },
          {
            title: "Curious seniors",
            text: "Helping older cats maintain daily curiosity and playful energy.*",
          },
        ]
      : [
          {
            title: "Senior dogs 7+",
            text: "Slower walks, more naps. Built for the years when energy dips.",
          },
          {
            title: "Large breeds from 5",
            text: "Big dogs age faster. Labs, Goldens, Shepherds and Danes.",
          },
          {
            title: "Active dogs slowing down",
            text: "Still love the trail, just need a little more support.*",
          },
        ];

  return (
    <section
      aria-labelledby="who-it-is-for-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border bg-bg-elevated/40 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
            WHO IT IS FOR
          </span>
          <h2
            id="who-it-is-for-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-fg"
          >
            Is {product.name} right for your {product.species || "pet"}?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, idx) => (
            <div
              key={idx}
              className="rounded-card border border-border bg-bg-elevated p-6 shadow-card flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-fg mb-2">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-fg-muted font-medium leading-relaxed">
                  <Claim showDisclaimer={false}>{c.text}</Claim>
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-fg-muted font-medium">
          Not for puppies or pregnant dogs. Ask your vet if your dog takes
          medication.
        </p>
      </div>
    </section>
  );
}
