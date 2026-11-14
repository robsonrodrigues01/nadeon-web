"use client";

import React, { useState } from "react";
import type { Kit, Product } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { Claim } from "@/components/commerce/product-card/claim";
import { Button } from "@/components/ui/button";
import { formatMoney } from "./money";

export interface BetterTogetherProps {
  kits: Kit[];
  products: Product[];
  locale?: string;
}

export function BetterTogetherSection({
  kits,
  products,
  locale = "en-US",
}: BetterTogetherProps) {
  const [addingSlug, setAddingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filter for human duos: Energy Duo and Beauty Duo
  const duoKits = kits.filter(
    (k) =>
      k.slug === "energy-duo" ||
      k.slug === "beauty-duo" ||
      k.name.toLowerCase().includes("duo")
  );

  const handleAddDuo = async (kit: Kit) => {
    setAddingSlug(kit.slug);
    setFeedback(null);

    try {
      // Find variants for all products in this kit
      const lineInputs = kit.products
        .map((ref) => {
          const product = products.find((p) => p.slug === ref.productSlug);
          const primaryVariant = product?.variants[0];
          if (!primaryVariant) return null;
          return {
            variantId: primaryVariant.id,
            quantity: ref.quantity,
          };
        })
        .filter(
          (item): item is { variantId: string; quantity: number } =>
            item !== null
        );

      if (lineInputs.length > 0) {
        await cartProvider.addLines(lineInputs);
        setFeedback(`Added ${kit.name} to cart`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback(`Failed to add ${kit.name} to cart`);
    } finally {
      setAddingSlug(null);
    }
  };

  if (duoKits.length === 0) {
    return null;
  }

  return (
    <section
      data-theme="pet"
      aria-labelledby="better-together-heading"
      className="bg-bg text-fg py-16 lg:py-24 px-5 sm:px-8 lg:px-18 border-t border-border/40"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 lg:mb-12">
          <p className="text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-accent">
            BUNDLE &amp; SAVE
          </p>
          <h2
            id="better-together-heading"
            className="title mt-2 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-fg"
          >
            Better together
          </h2>
        </div>

        {/* Screen reader live feedback */}
        <div role="status" aria-live="polite" className="sr-only">
          {feedback}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {duoKits.map((kit) => {
            const isEnergy = kit.slug === "energy-duo";
            const formattedPrice = formatMoney(kit.price, locale);
            const formattedCompare = kit.compareAtPrice
              ? formatMoney(kit.compareAtPrice, locale)
              : null;
            const isAdding = addingSlug === kit.slug;

            return (
              <div
                key={kit.slug}
                className="rounded-card border border-border/60 bg-bg-elevated p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-card"
              >
                {/* Visual Duo representation */}
                <div
                  aria-hidden="true"
                  className="w-full sm:w-auto shrink-0 rounded-2xl bg-bg border border-border/40 p-5 flex items-center justify-center gap-3 select-none"
                >
                  {isEnergy ? (
                    <>
                      {/* BioHack mini */}
                      <div className="w-20 h-24 bg-bg-elevated rounded-lg border border-border/60 flex flex-col items-center justify-center p-1 text-center shadow-xs">
                        <span className="font-extrabold text-[11px] text-fg">
                          BioHack
                        </span>
                        <span className="text-[8px] font-semibold text-accent uppercase">
                          NMN 500 mg
                        </span>
                      </div>
                      <span className="text-xl font-bold text-fg-muted">+</span>
                      {/* Renew mini */}
                      <div className="w-20 h-24 bg-bg-elevated rounded-lg border border-border/60 flex flex-col items-center justify-center p-1 text-center shadow-xs">
                        <span className="font-extrabold text-[11px] text-fg">
                          Renew
                        </span>
                        <span className="text-[8px] font-semibold text-fg-muted uppercase">
                          NAD+
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Glow mini */}
                      <div className="w-20 h-24 bg-bg-elevated rounded-lg border border-border/60 flex flex-col items-center justify-center p-1 text-center shadow-xs">
                        <span className="font-extrabold text-[11px] text-fg">
                          Glow
                        </span>
                        <span className="text-[8px] font-semibold text-accent uppercase">
                          Collagen
                        </span>
                      </div>
                      <span className="text-xl font-bold text-fg-muted">+</span>
                      {/* Prime mini */}
                      <div className="w-20 h-24 bg-bg-elevated rounded-lg border border-border/60 flex flex-col items-center justify-center p-1 text-center shadow-xs">
                        <span className="font-extrabold text-[11px] text-fg">
                          Prime
                        </span>
                        <span className="text-[8px] font-semibold text-fg-muted uppercase">
                          NAD+ Pwd
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Content info */}
                <div className="flex-1 flex flex-col">
                  <span className="inline-flex self-start rounded-full bg-fg px-3 py-1 text-[11px] font-bold tracking-wider text-bg uppercase select-none">
                    SAVE 15%
                  </span>

                  <h3 className="title text-2xl font-extrabold uppercase tracking-tight text-fg mt-3">
                    {kit.name}
                  </h3>

                  <div className="text-sm text-fg-muted mt-2 leading-relaxed">
                    {kit.description.includes("*") ? (
                      <Claim showDisclaimer={false}>{kit.description}</Claim>
                    ) : (
                      <span>{kit.description}</span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-2xl font-extrabold text-fg">
                      {formattedPrice}
                    </span>
                    {formattedCompare && (
                      <span className="text-sm text-fg-muted line-through opacity-60">
                        {formattedCompare}
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    <Button
                      type="button"
                      variant="primary"
                      size="default"
                      isLoading={isAdding}
                      loadingText="Adding..."
                      onClick={() => handleAddDuo(kit)}
                      aria-label={`Add ${kit.name} to cart for ${formattedPrice}`}
                      className="min-h-[44px] px-6 rounded-full font-bold text-sm"
                    >
                      Add the duo
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
