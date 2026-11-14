"use client";

import React, { useState } from "react";
import type { Kit } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import type { Market } from "@/lib/market/types";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";

export interface PetKitsSectionProps {
  kits: Kit[];
  market: Market;
  className?: string;
}

export function PetKitsSection({
  kits,
  market,
  className = "",
}: PetKitsSectionProps) {
  const [addingKitSlug, setAddingKitSlug] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Take up to 2 relevant kits
  const displayKits = kits.slice(0, 2);
  if (displayKits.length === 0) return null;

  const handleAddKit = async (kit: Kit) => {
    setAddingKitSlug(kit.slug);
    setStatusMessage(null);
    try {
      // Add each product in the kit to the cart
      const lines = kit.products.map((p) => ({
        variantId: `var_${p.productSlug.replace(/-/g, "_")}_1`,
        quantity: p.quantity,
      }));
      await cartProvider.addLines(lines);
      setStatusMessage(`Added ${kit.name} to cart`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage("Failed to add kit to cart");
    } finally {
      setAddingKitSlug(null);
    }
  };

  return (
    <section
      aria-labelledby="featured-kits-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
            FEATURED KITS
          </span>
          <h2
            id="featured-kits-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-fg"
          >
            Better together
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayKits.map((kit, idx) => {
            const isFavorite = idx === 1;
            const badgeText = isFavorite ? "PET PARENT FAVORITE" : "SAVE 15%";
            const formattedPrice = formatMoneyWithMarket(kit.price, market);
            const formattedCompare = kit.compareAtPrice
              ? formatMoneyWithMarket(kit.compareAtPrice, market)
              : null;

            return (
              <div
                key={kit.slug}
                className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8 flex flex-col justify-between shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center rounded-pill bg-accent/20 text-accent px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
                      {badgeText}
                    </span>
                    <span className="text-xs font-bold text-fg/60 uppercase tracking-wider">
                      Kit
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-fg mb-2">
                    {kit.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-fg-muted font-medium mb-6 leading-relaxed">
                    <Claim showDisclaimer={false}>{kit.description}</Claim>
                  </p>
                </div>

                <div className="pt-6 border-t border-border/60 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-fg">
                      {formattedPrice}
                    </span>
                    {formattedCompare && (
                      <span className="text-sm font-semibold text-fg/50 line-through">
                        {formattedCompare}
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="default"
                    isLoading={addingKitSlug === kit.slug}
                    loadingText="Adding kit..."
                    onClick={() => handleAddKit(kit)}
                    className="min-h-11"
                  >
                    Add the kit
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {statusMessage && (
          <div
            aria-live="polite"
            className="mt-4 text-center text-xs font-bold text-accent"
          >
            {statusMessage}
          </div>
        )}
      </div>
    </section>
  );
}
