"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Kit } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { Claim } from "@/components/commerce/product-card/claim";
import { useMarket } from "@/lib/market";
import type { KitCartLine } from "./kit-lines";

export interface BundleSectionProps {
  kit?: Kit | null;
  kitLines?: KitCartLine[];
}

export function BundleSection({ kit, kitLines = [] }: BundleSectionProps) {
  const { formatMoney } = useMarket();
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const price = kit?.price;
  const compareAt = kit?.compareAtPrice;
  const savePercent =
    price && compareAt && compareAt.amount > price.amount
      ? Math.round((1 - price.amount / compareAt.amount) * 100)
      : null;

  const handleAddDuo = async () => {
    setIsAdding(true);
    setFeedback(null);
    try {
      await cartProvider.addLines(kitLines);
      setFeedback("Added Energy Duo to cart");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("Could not add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section
      id="bundles"
      aria-labelledby="bundle-section-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="rounded-card border border-border bg-bg-elevated p-8 sm:p-12 lg:p-16 shadow-card">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-fg">
                BUNDLE &amp; SAVE
              </span>
              <h2
                id="bundle-section-title"
                className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
              >
                The Energy Duo
              </h2>
              <div className="mt-4 text-base sm:text-lg text-fg-muted font-normal leading-relaxed">
                <Claim>
                  BioHack for daily NMN plus Renew for direct NAD⁺. Two paths to
                  the same goal, in one routine.*
                </Claim>
              </div>

              {price && (
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-archivo text-3xl sm:text-4xl font-black text-fg">
                    {formatMoney(price)}
                  </span>
                  {compareAt && (
                    <span className="text-lg text-fg-muted line-through font-medium">
                      {formatMoney(compareAt)}
                    </span>
                  )}
                  {savePercent !== null && (
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-fg">
                      SAVE {savePercent}%
                    </span>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleAddDuo}
                  disabled={isAdding || kitLines.length === 0}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "Add the duo"}
                </button>
              </div>
              {feedback && (
                <p
                  className="mt-3 text-xs font-medium text-accent"
                  role="status"
                >
                  {feedback}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="flex min-w-0 flex-col items-center rounded-card border border-border bg-bg p-4 sm:p-6 shadow-card">
                <div className="h-24 w-24 sm:h-36 sm:w-36 relative flex items-center justify-center">
                  <Image
                    src="/images/products/biohack-front.webp"
                    alt="BioHack NMN 500 mg"
                    width={144}
                    height={144}
                    sizes="(min-width: 640px) 144px, 96px"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-3 font-archivo text-base font-bold text-fg">
                  BioHack
                </span>
                <span className="text-xs uppercase font-medium text-fg-muted">
                  NMN 500 mg
                </span>
              </div>
              <span className="text-3xl font-black text-accent">+</span>
              <div className="flex min-w-0 flex-col items-center rounded-card border border-border bg-bg p-4 sm:p-6 shadow-card">
                <div className="h-24 w-24 sm:h-36 sm:w-36 relative flex items-center justify-center">
                  <Image
                    src="/images/products/renew-front.webp"
                    alt="Renew NAD+ and Resveratrol"
                    width={144}
                    height={144}
                    sizes="(min-width: 640px) 144px, 96px"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-3 font-archivo text-base font-bold text-fg">
                  Renew
                </span>
                <span className="text-xs uppercase font-medium text-fg-muted">
                  NAD+ + Resveratrol
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
