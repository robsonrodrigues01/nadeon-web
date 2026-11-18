import React from "react";
import { mockCatalogProvider } from "@/lib/providers";
import {
  WeightSelector,
  WeightCalculator,
} from "@/components/commerce/weight-selector";
import { Claim } from "@/components/commerce/product-card/claim";

export default async function W1_13Section() {
  const [moreGoodYears, biohack] = await Promise.all([
    mockCatalogProvider.getProduct("more-good-years"),
    mockCatalogProvider.getProduct("biohack"),
  ]);

  return (
    <section
      id="w1-13-showcase"
      aria-labelledby="w1-13-heading"
      className="space-y-12 py-8"
    >
      {/* Section Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <span className="label rounded-pill bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
            Task W1-13
          </span>
          <span className="text-xs font-medium text-fg-muted uppercase tracking-wider">
            Wave 1 Dosing &amp; Weight Selector Showcase
          </span>
        </div>
        <h2
          id="w1-13-heading"
          className="title text-3xl font-extrabold uppercase tracking-tight text-fg mt-2"
        >
          Dosing by Weight &amp; Weight Selector
        </h2>
        <p className="text-sm text-fg-muted mt-2 max-w-3xl leading-relaxed">
          Pure functions for weight-based dosing calculations, accessible
          radiogroup weight selector (Up to 20 lbs / 21 to 50 / 51 to 90 / Over
          90 lbs), seamless lb/kg conversion, multi-species support (Dog, Cat,
          Horse), daily schedules, and regulatory compliance notices.
        </p>
      </div>

      {/* Pet Line Variant Showcase */}
      <div
        data-theme="pet"
        className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <span className="label inline-block rounded-pill bg-border px-2.5 py-0.5 text-[11px] font-bold text-fg-muted">
              Pet Line
            </span>
            <h3
              id="w1-13-pet-heading"
              className="title text-2xl font-bold uppercase text-fg mt-1"
            >
              Pet Line Dosing &amp; Calculator (Canine, Feline, Equine)
            </h3>
          </div>
          <span className="text-xs text-fg-muted font-medium">
            Theme: Light Warm
          </span>
        </div>

        {/* Part 1: Product PDP Standalone Weight Selector */}
        <div className="space-y-4 rounded-card border border-border bg-bg-elevated p-6">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Product Detail Component
              </span>
              <h4 className="text-lg font-black uppercase text-fg">
                {moreGoodYears?.name || "More Good Years"} · Weight Selector
              </h4>
              <p className="text-xs text-fg-muted">
                {moreGoodYears?.format || "Soft chews"} · Dosed by weight,
                vet-reviewed formula
              </p>
            </div>
            <span className="text-xs font-bold text-accent bg-accent/10 rounded-pill px-3 py-1">
              For animal use only.
            </span>
          </div>

          <div className="max-w-md">
            <WeightSelector
              defaultSelectedId="21-to-50"
              legend="Your dog weighs"
              helperText="2 chews a day · we picked the plan that matches"
              showUnitToggle
            />
          </div>
        </div>

        {/* Part 2: Interactive Dose Calculator & Reference Table */}
        <div className="space-y-4">
          <div className="border-b border-border/50 pb-2">
            <h4 className="text-lg font-black uppercase text-fg">
              Interactive Pet Dose Calculator (/pet/dose-calculator)
            </h4>
            <p className="text-xs text-fg-muted">
              Dynamically computes dose, daily schedules, starter titration
              guidelines, and species tables based on weight, age, and activity.
            </p>
          </div>

          <WeightCalculator
            product={moreGoodYears}
            initialSpecies="dog"
            initialWeight={35}
            initialUnit="lb"
          />
        </div>

        {/* Pet Regulatory Notice Footer */}
        <div className="rounded-card border border-border/70 bg-bg-elevated/60 p-4 text-xs text-fg-muted space-y-1">
          <p className="font-bold text-accent">
            Regulatory Compliance: For animal use only.
          </p>
          <p>
            Equine products: not for horses intended for food. Check with your
            veterinarian before starting any supplement regimen.
          </p>
        </div>
      </div>

      {/* Human Line Variant Showcase */}
      <div
        data-theme="human"
        className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <span className="label inline-block rounded-pill bg-border px-2.5 py-0.5 text-[11px] font-bold text-fg-muted">
              Human Line
            </span>
            <h3
              id="w1-13-human-heading"
              className="title text-2xl font-bold uppercase text-fg mt-1"
            >
              Human Line Serving Protocol &amp; Adult Considerations
            </h3>
          </div>
          <span className="text-xs text-fg-muted font-medium">
            Theme: Dark Warm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h4 className="text-base font-bold text-fg uppercase tracking-wide">
              Standardized Adult Dosage Protocol
            </h4>
            <p className="text-xs text-fg-muted leading-relaxed">
              Human formulas ({biohack?.name || "BioHack Cellular Optimizer"})
              feature precision standardized adult servings optimized for
              cellular NAD+ elevation. Dosage is tailored based on activity
              intensity, metabolic requirements, and daily routine timing.
            </p>

            <div className="rounded-card border border-border bg-bg-elevated p-4 space-y-2 text-xs">
              <span className="font-bold text-fg block uppercase tracking-wide">
                BioHack Serving Guide
              </span>
              <p className="text-fg-muted">
                Standard: 2 capsules daily in the morning with water or
                breakfast.
              </p>
              <Claim className="text-fg-muted" showDisclaimer>
                Supports NAD+ levels and healthy aging*
              </Claim>
            </div>
          </div>

          {/* Selector Demonstration in Dark Theme */}
          <div className="rounded-card border border-border bg-bg-elevated p-6 space-y-4">
            <div className="border-b border-border/60 pb-2">
              <h4 className="text-sm font-bold text-fg uppercase tracking-wide">
                Selector Dark Theme Compatibility
              </h4>
              <p className="text-xs text-fg-muted">
                Demonstrates token inheritance, contrast ratios, and accessible
                focus states inside dark warm theme.
              </p>
            </div>

            <WeightSelector
              legend="Weight &amp; Routine Protocol"
              helperText="Adapts cleanly to dark theme tokens with AA contrast"
              defaultSelectedId="21-to-50"
              showUnitToggle
            />
          </div>
        </div>

        {/* Human FDA Legal Notice */}
        <div className="border-t border-border/50 pt-4 text-xs text-fg-muted leading-relaxed">
          <p>
            *These statements have not been evaluated by the Food and Drug
            Administration. These products are not intended to diagnose, treat,
            cure or prevent any disease.
          </p>
        </div>
      </div>
    </section>
  );
}
