"use client";

import React, { useState } from "react";
import type { CartProvider, Cart } from "@/lib/providers/client";
import { formatMoney } from "./money";
import { Claim } from "../product-card/claim";

export interface CartDrawerUpsellProps {
  cart: Cart;
  cartProvider: CartProvider;
  theme?: "human" | "pet";
}

export function CartDrawerUpsell({
  cart,
  cartProvider,
  theme = "human",
}: CartDrawerUpsellProps) {
  const [isAdding, setIsAdding] = useState(false);

  const isPet = theme === "pet";
  const upsellVariantId = isPet ? "var_golden_years_oil_1" : "var_prime_1";
  const upsellTitle = isPet ? "Golden Years Oil" : "Prime";
  const upsellSubtitle = isPet
    ? "Joints & mobility top-dress"
    : "250 mg of pure NAD+ per scoop*";
  const upsellPrice = {
    amount: isPet ? 44 : 49,
    currencyCode: cart.totalPrice.currencyCode || "USD",
  };

  const isAlreadyInCart = cart.lines.some(
    (line) => line.variantId === upsellVariantId
  );

  const handleAdd = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await cartProvider.addLines([
        {
          variantId: upsellVariantId,
          quantity: 1,
        },
      ]);
    } finally {
      setIsAdding(false);
    }
  };

  const totalDiscountAmount = cart.totalDiscount.amount;
  const hasSavings = totalDiscountAmount > 0;

  return (
    <div className="mt-5 space-y-4">
      {/* Upsell Header / Card */}
      <div>
        <div className="text-xs font-bold tracking-wider uppercase text-accent mb-2">
          {isPet ? "Pairs well with" : "Recommended add-on"}
        </div>

        <div className="flex items-center justify-between gap-3 p-3 rounded-card bg-bg-elevated border border-border/40">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-fg leading-tight">
              {upsellTitle}
            </h4>
            <div className="text-xs text-fg-muted mt-0.5">
              <Claim showDisclaimer={false}>{upsellSubtitle}</Claim>
            </div>
            <div className="text-xs font-bold text-fg mt-1">
              {formatMoney(upsellPrice)}
            </div>
          </div>

          <button
            type="button"
            disabled={isAdding}
            onClick={handleAdd}
            aria-label={`Add ${upsellTitle} to cart`}
            className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0 ${
              isAlreadyInCart
                ? "bg-fg/10 text-fg hover:bg-fg/20"
                : isPet
                  ? "bg-fg text-bg hover:opacity-90"
                  : "bg-gradient-gold text-accent-fg hover:brightness-105"
            }`}
          >
            {isAdding ? "Adding..." : isAlreadyInCart ? "Add another" : "+ Add"}
          </button>
        </div>
      </div>

      {/* Savings Callout */}
      {hasSavings && (
        <div className="flex items-center gap-3 p-3 rounded-card bg-accent/10 border border-accent/20 text-xs leading-snug text-fg">
          <span className="text-base select-none" aria-hidden="true">
            {isPet ? "🐾" : "⚡"}
          </span>
          <div>
            You&apos;re saving{" "}
            <strong>{formatMoney(cart.totalDiscount)}</strong> with Subscribe
            &amp; Save. Skip, pause or cancel anytime.
          </div>
        </div>
      )}
    </div>
  );
}
