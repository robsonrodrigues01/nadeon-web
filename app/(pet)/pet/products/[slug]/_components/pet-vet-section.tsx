import React from "react";

export interface PetVetSectionProps {
  className?: string;
}

export function PetVetSection({ className = "" }: PetVetSectionProps) {
  return (
    <section
      aria-labelledby="vet-reviewed-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border bg-bg-elevated/40 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="rounded-card border border-border bg-bg-elevated p-8 sm:p-12 shadow-card flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Vet Badge / Avatar circle */}
          <div className="shrink-0 flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-accent bg-bg text-accent font-extrabold text-xl tracking-wider uppercase text-center p-4">
            <span>VET REVIEWED</span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center rounded-pill bg-fg text-bg px-3 py-1 text-xs font-extrabold uppercase tracking-wider mb-3">
              VET-REVIEWED
            </span>
            <h2
              id="vet-reviewed-heading"
              className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-fg mb-4"
            >
              Formulated with a veterinarian
            </h2>
            <p className="text-sm sm:text-base text-fg-muted leading-relaxed font-medium mb-4 max-w-2xl">
              Our formulas are reviewed by a licensed veterinarian for dose,
              ingredients and safety by weight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
