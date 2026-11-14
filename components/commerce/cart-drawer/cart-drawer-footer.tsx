"use client";

import React from "react";
import type { Cart } from "@/lib/providers/client";
import { formatMoney } from "./money";

export interface CartDrawerFooterProps {
  cart: Cart;
  theme?: "human" | "pet";
  onCheckout?: () => void;
}

export function CartDrawerFooter({
  cart,
  theme = "human",
  onCheckout,
}: CartDrawerFooterProps) {
  const isPet = theme === "pet";
  const hasSavings = cart.totalDiscount.amount > 0;
  const formattedTotal = formatMoney(cart.totalPrice);
  const formattedSubtotal = formatMoney(cart.subtotalPrice);
  const formattedDiscount = formatMoney(cart.totalDiscount);

  const handleCheckoutClick = () => {
    if (onCheckout) {
      onCheckout();
    } else if (cart.checkoutUrl && typeof window !== "undefined") {
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <footer className="p-5 sm:p-7 border-t border-border/40 bg-bg-elevated mt-auto">
      {/* Subtotal */}
      <div className="flex justify-between items-baseline mb-1.5 text-fg">
        <span className="font-bold text-sm sm:text-base">Subtotal</span>
        <span className="font-bold text-lg sm:text-xl font-archivo">
          {formattedSubtotal}
        </span>
      </div>

      {/* Subscription savings line */}
      {hasSavings && (
        <div className="flex justify-between text-xs text-fg-muted mb-3.5">
          <span>Subscription savings</span>
          <span className="text-accent font-bold">−{formattedDiscount}</span>
        </div>
      )}

      {/* Checkout button */}
      <button
        type="button"
        onClick={handleCheckoutClick}
        aria-label={`Checkout ${formattedTotal}`}
        className={`w-full min-h-[48px] rounded-full font-bold text-sm sm:text-base text-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isPet
            ? "bg-fg text-bg hover:opacity-90"
            : "bg-gradient-gold text-accent-fg hover:brightness-105"
        }`}
      >
        Checkout · {formattedTotal}
      </button>

      {/* Taxes note */}
      <p className="text-center text-[11px] text-fg-muted mt-2.5 mb-3.5">
        Taxes and shipping calculated at checkout
      </p>

      {/* Express checkout buttons */}
      <div
        className="flex gap-1.5 flex-wrap justify-center items-center"
        aria-label="Express checkout options"
        role="group"
      >
        <button
          type="button"
          aria-label="Pay with Apple Pay"
          className="h-7 min-w-11 px-2.5 rounded-md border border-border/50 bg-fg/5 hover:bg-fg/10 text-fg text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Apple Pay
        </button>
        <button
          type="button"
          aria-label="Pay with Google Pay"
          className="h-7 min-w-11 px-2.5 rounded-md border border-border/50 bg-fg/5 hover:bg-fg/10 text-fg text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Google Pay
        </button>
        <button
          type="button"
          aria-label="Pay with PayPal"
          className="h-7 min-w-11 px-2.5 rounded-md border border-border/50 bg-fg/5 hover:bg-fg/10 text-fg text-[11px] font-bold italic flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          PayPal
        </button>
        <button
          type="button"
          aria-label="Pay with Shop Pay"
          className="h-7 min-w-11 px-2.5 rounded-md border border-border/50 bg-fg/5 hover:bg-fg/10 text-fg text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Shop Pay
        </button>
      </div>

      {/* Regulatory FDA & Pet Disclaimers */}
      <div className="text-[10px] text-fg-muted/60 leading-normal mt-4 text-center">
        <p>
          *These statements have not been evaluated by the Food and Drug
          Administration. These products are not intended to diagnose, treat,
          cure or prevent any disease.
        </p>
        {isPet && (
          <p className="mt-1 font-bold text-fg-muted/80">
            For animal use only.
          </p>
        )}
      </div>
    </footer>
  );
}
