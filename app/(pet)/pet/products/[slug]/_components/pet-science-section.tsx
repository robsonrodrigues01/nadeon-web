import React from "react";
import type { Product } from "@/lib/contracts/catalog";

export interface PetScienceSectionProps {
  product: Product;
  className?: string;
}

// Cards come from the product data: one per active ingredient, plus the serving.
export function PetScienceSection({
  product,
  className = "",
}: PetScienceSectionProps) {
  const cards = [
    ...product.actives.map((active) => ({
      title: active.name,
      tag: active.amount,
    })),
    ...(product.serving
      ? [{ title: "Dosed by weight", tag: product.serving }]
      : []),
  ];

  if (cards.length === 0) return null;

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

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <li
              key={`${card.title}-${idx}`}
              className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card"
            >
              <div>
                <span className="text-3xl font-extrabold text-accent block mb-3">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-fg mb-2">
                  {card.title}
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <span className="inline-flex items-center rounded-pill bg-fg text-bg px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                  {card.tag}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
