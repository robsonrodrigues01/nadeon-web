"use client";

import React, { useState } from "react";
import { cartProvider as defaultCartProvider } from "@/lib/providers/client";
import type { CartProvider } from "@/lib/contracts/cart";
import { Button } from "@/components/ui/button";

export interface BundleItem {
  id: string;
  name: string;
  category: string;
  chewName: string;
  chewDesc: string;
  oilName: string;
  oilDesc: string;
  price: { amount: number; currencyCode: string };
  compareAtPrice: { amount: number; currencyCode: string };
  variantIds: string[];
}

export const DOG_BUNDLES: readonly BundleItem[] = [
  {
    id: "bundle-more-good-years",
    name: "More Good Years chew + oil",
    category: "Longevity",
    chewName: "More Good Years",
    chewDesc: "Senior · NMN 75 mg",
    oilName: "More Good Years Oil",
    oilDesc: "Longevity · drops",
    price: { amount: 75, currencyCode: "USD" },
    compareAtPrice: { amount: 88, currencyCode: "USD" },
    variantIds: ["var_more_good_years_1", "var_more_good_years_oil_1"],
  },
  {
    id: "bundle-golden-years",
    name: "Golden Years chew + oil",
    category: "Joints",
    chewName: "Golden Years",
    chewDesc: "Joints · NMN 50 mg",
    oilName: "Golden Years Oil",
    oilDesc: "Joints · drops",
    price: { amount: 75, currencyCode: "USD" },
    compareAtPrice: { amount: 88, currencyCode: "USD" },
    variantIds: ["var_golden_years_1", "var_golden_years_oil_1"],
  },
  {
    id: "bundle-still-sharp",
    name: "Still Sharp chew + oil",
    category: "Calm",
    chewName: "Still Sharp",
    chewDesc: "Calm · NMN 50 mg",
    oilName: "Still Sharp Oil",
    oilDesc: "Calm · drops",
    price: { amount: 75, currencyCode: "USD" },
    compareAtPrice: { amount: 88, currencyCode: "USD" },
    variantIds: ["var_still_sharp_1", "var_still_sharp_oil_1"],
  },
  {
    id: "bundle-shine-on",
    name: "Shine On chew + oil",
    category: "Skin & coat",
    chewName: "Shine On",
    chewDesc: "Skin & coat · NMN 50 mg",
    oilName: "Shine On Oil",
    oilDesc: "Skin & coat · drops",
    price: { amount: 75, currencyCode: "USD" },
    compareAtPrice: { amount: 88, currencyCode: "USD" },
    variantIds: ["var_shine_on_1", "var_shine_on_oil_1"],
  },
] as const;

function formatBundlePrice(
  amount: number,
  currencyCode = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export interface BundlesSectionProps {
  cartProvider?: CartProvider;
  locale?: string;
}

export function BundlesSection({
  cartProvider = defaultCartProvider,
  locale = "en-US",
}: BundlesSectionProps) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const handleAddBundle = async (bundle: BundleItem) => {
    setAddingId(bundle.id);
    setFeedback((prev) => ({ ...prev, [bundle.id]: "" }));
    try {
      await cartProvider.addLines(
        bundle.variantIds.map((variantId) => ({
          variantId,
          quantity: 1,
        }))
      );
      setFeedback((prev) => ({
        ...prev,
        [bundle.id]: `Added ${bundle.name} to cart`,
      }));
      setTimeout(() => {
        setFeedback((prev) => {
          const next = { ...prev };
          delete next[bundle.id];
          return next;
        });
      }, 3500);
    } catch {
      setFeedback((prev) => ({
        ...prev,
        [bundle.id]: "Failed to add bundle to cart",
      }));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section
      id="bundles"
      aria-labelledby="bundles-heading"
      className="bg-bg px-6 py-16 sm:px-12 sm:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <span className="label block text-xs font-extrabold tracking-widest text-accent uppercase">
          BUNDLE &amp; SAVE 15%
        </span>

        <h2
          id="bundles-heading"
          className="title mt-2 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-fg"
        >
          Chew + oil, by need
        </h2>

        <p className="lead mt-3 text-base sm:text-lg text-fg-muted max-w-2xl">
          A daily chew plus the matching oil for picky days.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DOG_BUNDLES.map((bundle) => {
            const formattedPrice = formatBundlePrice(
              bundle.price.amount,
              bundle.price.currencyCode,
              locale
            );
            const formattedCompare = formatBundlePrice(
              bundle.compareAtPrice.amount,
              bundle.compareAtPrice.currencyCode,
              locale
            );
            const isAdding = addingId === bundle.id;
            const message = feedback[bundle.id];

            return (
              <article
                key={bundle.id}
                className="flex flex-col justify-between overflow-hidden rounded-card border border-border bg-bg-elevated p-6 shadow-card transition-all hover:shadow-elevated"
                aria-label={bundle.name}
              >
                <div>
                  {/* Category Pill */}
                  <span className="label inline-block rounded-pill bg-bg px-3 py-1 text-xs font-bold text-accent border border-border mb-4">
                    {bundle.category}
                  </span>

                  <h3 className="title text-xl font-extrabold uppercase text-fg leading-tight">
                    {bundle.name}
                  </h3>

                  {/* Visual formula pair preview */}
                  <div className="my-5 rounded-field border border-border bg-bg/50 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-fg">
                      <span className="font-bold">{bundle.chewName}</span>
                      <span className="text-fg-muted">{bundle.chewDesc}</span>
                    </div>
                    <div className="text-center font-extrabold text-accent">
                      +
                    </div>
                    <div className="flex items-center justify-between text-fg">
                      <span className="font-bold">{bundle.oilName}</span>
                      <span className="text-fg-muted">{bundle.oilDesc}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-extrabold text-fg">
                      {formattedPrice}
                    </span>
                    <span className="text-sm font-semibold text-fg-muted line-through">
                      {formattedCompare}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="default"
                    className="w-full"
                    isLoading={isAdding}
                    loadingText="Adding bundle..."
                    onClick={() => handleAddBundle(bundle)}
                    aria-label={`Add ${bundle.name} bundle for ${formattedPrice}`}
                  >
                    Add bundle
                  </Button>

                  <div
                    aria-live="polite"
                    className="min-h-5 mt-2 text-center text-xs font-medium text-accent"
                  >
                    {message}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
