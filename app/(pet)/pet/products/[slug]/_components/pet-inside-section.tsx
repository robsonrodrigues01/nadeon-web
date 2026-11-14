import React from "react";
import type { Product } from "@/lib/contracts/catalog";
import { Claim } from "@/components/commerce/product-card/claim";

export interface PetInsideSectionProps {
  product: Product;
  className?: string;
}

export function PetInsideSection({
  product,
  className = "",
}: PetInsideSectionProps) {
  const isHorse = product.species === "horse";

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Column 1: Dose by Weight */}
          <div className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card">
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wider text-fg mb-4">
                Dose by weight
              </h3>
              <ul className="space-y-3">
                {product.dosingByWeight && product.dosingByWeight.length > 0 ? (
                  product.dosingByWeight.map((band, idx) => (
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
                  ))
                ) : (
                  <>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                      <span className="font-semibold text-fg/80">
                        Up to 20 lbs
                      </span>
                      <span className="font-extrabold text-fg">
                        1 chew / day
                      </span>
                    </li>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                      <span className="font-semibold text-fg/80">
                        21 to 50 lbs
                      </span>
                      <span className="font-extrabold text-fg">
                        2 chews / day
                      </span>
                    </li>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                      <span className="font-semibold text-fg/80">
                        51 to 90 lbs
                      </span>
                      <span className="font-extrabold text-fg">
                        3 chews / day
                      </span>
                    </li>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                      <span className="font-semibold text-fg/80">
                        Over 90 lbs
                      </span>
                      <span className="font-extrabold text-fg">
                        4 chews / day
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <p className="mt-6 text-xs text-fg-muted font-medium">
              Give with or after a meal. Ask your vet if your dog takes
              medication.
            </p>
          </div>

          {/* Column 2: Active Ingredients per Chew */}
          <div className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card">
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wider text-fg mb-4">
                Active ingredients per chew
              </h3>
              <ul className="space-y-3">
                {product.actives && product.actives.length > 0 ? (
                  product.actives.map((active, idx) => (
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
                  ))
                ) : (
                  <>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                      <span className="font-semibold text-fg/80">NMN</span>
                      <span className="font-extrabold text-fg">75 mg</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                      <span className="font-semibold text-fg/80">
                        Omega-3 (EPA + DHA)
                      </span>
                      <span className="font-extrabold text-fg">60 mg</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                      <span className="font-semibold text-fg/80">CoQ10</span>
                      <span className="font-extrabold text-fg">15 mg</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                      <span className="font-semibold text-fg/80">
                        Vitamin E
                      </span>
                      <span className="font-extrabold text-fg">10 IU</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <p className="mt-6 text-xs text-fg-muted font-medium">
              Third-party tested for purity, heavy metals, and potency.
            </p>
          </div>

          {/* Column 3: Guaranteed Analysis & Flavor */}
          <div className="rounded-card border border-border bg-bg-elevated p-6 flex flex-col justify-between shadow-card">
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wider text-fg mb-4">
                Guaranteed analysis
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                  <span className="font-semibold text-fg/80">
                    Crude protein
                  </span>
                  <span className="font-extrabold text-fg">min 10.5%</span>
                </li>
                <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                  <span className="font-semibold text-fg/80">Crude fat</span>
                  <span className="font-extrabold text-fg">min 2.5%</span>
                </li>
                <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                  <span className="font-semibold text-fg/80">Crude fiber</span>
                  <span className="font-extrabold text-fg">max 10%</span>
                </li>
                <li className="flex items-center justify-between border-b border-border/50 pb-2 text-sm">
                  <span className="font-semibold text-fg/80">Moisture</span>
                  <span className="font-extrabold text-fg">max 20%</span>
                </li>
              </ul>

              <div className="mt-5 rounded-field bg-bg p-3 border border-border/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent block">
                  FLAVOR
                </span>
                <span className="text-sm font-bold text-fg">
                  Pumpkin &amp; chicken liver
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-fg-muted font-medium">
              No corn, wheat or soy. No artificial colors.
            </p>
          </div>
        </div>

        {/* FDA & Animal Disclaimer banner */}
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
