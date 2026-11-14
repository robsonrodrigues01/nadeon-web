"use client";

import React, { useState, useEffect } from "react";
import type { Product, Money } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { Button } from "@/components/ui/button";

export interface StickyBarProps {
  product: Product;
  locale?: string;
}

function formatMoney(money: Money, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
  }).format(money.amount);
}

export function StickyBar({ product, locale = "en-US" }: StickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Recommended 2 jars variant and 60-day subscription
  const recommendedVariant =
    product.variants.find((v) => v.jars === 2) || product.variants[0];
  const recommendedPlan =
    product.sellingPlans.find((p) => p.intervalDays === 60) ||
    product.sellingPlans[0];

  const basePrice = recommendedVariant?.price.amount ?? 106;
  const discountRate = recommendedPlan?.discountPercentage ?? 15;
  const subscriptionPriceAmount = Number(
    (basePrice * ((100 - discountRate) / 100)).toFixed(2)
  );

  const currencyCode = recommendedVariant?.price.currencyCode ?? "USD";
  const formattedPrice = formatMoney(
    { amount: subscriptionPriceAmount, currencyCode },
    locale
  );

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!recommendedVariant) return;
    setIsAdding(true);
    try {
      await cartProvider.addLines([
        {
          variantId: recommendedVariant.id,
          quantity: 1,
          sellingPlanId: recommendedPlan?.id ?? null,
        },
      ]);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch {
      // Error handled
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <aside
      aria-label="Quick add to cart bar"
      className={`fixed bottom-0 left-0 right-0 z-30 w-full border-t border-border bg-bg-elevated/95 backdrop-blur-md px-4 py-3 sm:px-8 transition-transform duration-300 shadow-elevated ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        {/* Product and plan summary */}
        <div className="flex flex-col min-w-0">
          <span className="font-archivo font-black text-sm sm:text-base text-fg truncate">
            {product.name}
          </span>
          <span className="text-xs text-fg-muted truncate">
            <span className="hidden sm:inline">
              {product.technicalName} · Subscribe &amp; save {discountRate}% · 2
              jars every 60 days
            </span>
            <span className="sm:hidden">Subscribe · 2 jars / 60 days</span>
          </span>
        </div>

        {/* Action Button and Price */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="hidden sm:inline font-archivo font-extrabold text-lg text-fg">
            {formattedPrice}
          </span>

          <Button
            type="button"
            variant="primary"
            size="default"
            isLoading={isAdding}
            loadingText="Adding..."
            onClick={handleAddToCart}
            className="min-h-11 px-6 whitespace-nowrap text-xs sm:text-sm font-bold"
            aria-label={`Add to cart · ${formattedPrice}`}
          >
            {added ? (
              "Added!"
            ) : (
              <>
                <span className="hidden sm:inline">Add to cart</span>
                <span className="sm:hidden">
                  Add to cart · {formattedPrice}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
