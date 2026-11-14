"use client";

import React from "react";
import { formatMoney } from "./money";

export interface CartDrawerShippingBarProps {
  subtotal: number;
  currencyCode?: string;
  theme?: "human" | "pet";
}

export function CartDrawerShippingBar({
  subtotal,
  currencyCode = "USD",
  theme = "human",
}: CartDrawerShippingBarProps) {
  const threshold = theme === "pet" ? 49 : 75;
  const isUnlocked = subtotal >= threshold;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((subtotal / threshold) * 100))
  );
  const remaining = Math.max(0, Number((threshold - subtotal).toFixed(2)));

  const remainingFormatted = formatMoney({
    amount: remaining,
    currencyCode,
  });
  const thresholdFormatted = formatMoney({
    amount: threshold,
    currencyCode,
  });
  const zeroFormatted = formatMoney({
    amount: 0,
    currencyCode,
  });

  return (
    <div className="pt-6 pb-2 px-6 sm:px-7">
      <div className="text-sm mb-2 text-fg">
        {isUnlocked ? (
          <span>
            You unlocked <strong>free shipping</strong> ✓
          </span>
        ) : (
          <span>
            Add <strong>{remainingFormatted}</strong> more to unlock free
            shipping
          </span>
        )}
      </div>

      <div
        role="progressbar"
        aria-label="Free shipping progress"
        aria-valuenow={Math.min(subtotal, threshold)}
        aria-valuemin={0}
        aria-valuemax={threshold}
        className="h-2 rounded-full bg-fg/15 relative overflow-hidden"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            theme === "pet" ? "bg-accent" : "bg-gradient-gold"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-fg-muted mt-1.5">
        <span>{zeroFormatted}</span>
        <span>Free shipping at {thresholdFormatted}</span>
      </div>
    </div>
  );
}
