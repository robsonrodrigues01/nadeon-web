import React from "react";
import type { Product } from "@/lib/contracts/catalog";
import { Claim } from "@/components/commerce/product-card/claim";

export interface PetInsideSectionProps {
  product: Product;
  className?: string;
}

// Only data from the product. Guaranteed analysis and flavor are not in the
// catalog contract yet, so they stay out of the page (see DONE).
export function PetInsideSection({
  product,
  className = "",
}: PetInsideSectionProps) {
  const isHorse = product.species === "horse";
  const hasDosing = product.dosingByWeight.length > 0;
  const hasActives = product.actives.length > 0;

  return (
    <section
      id="supplement-facts"
      aria-labelledby="what-is-inside-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
            WHAT IS INSIDE
          </span>
          <h2
            id="what-is-inside-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-fg"
          >
            Dose, actives, analysis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {hasDosing && (
            <div className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card">
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-wider text-fg mb-4">
                  Dose by weight
                </h3>
                <ul className="space-y-3">
                  {product.dosingByWeight.map((band, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between border-b border-border/50 pb-2 text-sm"
                    >
                      <span className="font-semibold text-fg/80">
                        {band.servingDescription}
                      </span>
                      <span className="font-extrabold text-fg">
                        {band.dose}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {product.howToUse && (
                <p className="mt-6 text-xs text-fg-muted font-medium">
                  {product.howToUse}
                </p>
              )}
            </div>
          )}

          {hasActives && (
            <div className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card">
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-wider text-fg mb-4">
                  Active ingredients per chew
                </h3>
                <ul className="space-y-3">
                  {product.actives.map((active, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between border-b border-border/50 pb-2 text-sm"
                    >
                      <span className="font-semibold text-fg/80">
                        {active.name}
                      </span>
                      <span className="font-extrabold text-fg">
                        {active.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-card border border-border/70 bg-bg-elevated/60 p-4 sm:p-5 text-xs text-fg-muted leading-relaxed">
          <Claim showDisclaimer={true}>
            *These statements have not been evaluated by the Food and Drug
            Administration. These products are not intended to diagnose, treat,
            cure or prevent any disease. For animal use only.
            {isHorse && " Equine products: not for horses intended for food."}
          </Claim>
        </div>
      </div>
    </section>
  );
}
