"use client";

import React, { useEffect, useState } from "react";
import type { Product, Money } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { Button } from "@/components/ui/button";

export interface PetStickyBarProps {
  product: Product;
  locale?: string;
}

function formatMoney(money: Money, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
  }).format(money.amount);
}

export function PetStickyBar({ product, locale = "en-US" }: PetStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once user scrolls past 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultVariant =
    product.variants.find((v) => v.jars === 2) || product.variants[0];
  const defaultPlan =
    product.sellingPlans.find((p) => p.intervalDays === 60) ||
    product.sellingPlans[0];

  // Page only renders this bar when the product has variants (see page.tsx)
  const currencyCode = defaultVariant.price.currencyCode;
  const baseAmount = defaultVariant.price.amount;
  const discountRate = defaultPlan?.discountPercentage ?? 0;
  const discountedAmount = Number(
    (baseAmount * (1 - discountRate / 100)).toFixed(2)
  );

  const formattedPrice = formatMoney(
    { amount: discountedAmount, currencyCode },
    locale
  );

  const handleAddToCart = async () => {
    if (!defaultVariant) return;
    setIsAdding(true);
    try {
      await cartProvider.addLines([
        {
          variantId: defaultVariant.id,
          quantity: 1,
          sellingPlanId: defaultPlan?.id ?? null,
        },
      ]);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Quick add to cart"
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border shadow-elevated px-4 py-3 sm:py-4 transition-transform duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold uppercase tracking-tight text-fg truncate">
            {product.name}
          </div>
          <div className="text-xs text-fg-muted truncate hidden sm:block">
            {product.technicalName} · Subscribe &amp; save {discountRate}% ·{" "}
            {defaultVariant.jars} {defaultVariant.jars === 1 ? "jar" : "jars"}{" "}
            every {defaultPlan?.intervalDays} days
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-base sm:text-lg font-extrabold text-fg">
            {formattedPrice}
          </span>
          <Button
            type="button"
            variant="primary"
            size="default"
            isLoading={isAdding}
            loadingText="Adding..."
            onClick={handleAddToCart}
            className="min-h-11"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </aside>
  );
}
