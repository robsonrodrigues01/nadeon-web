"use client";

import React from "react";
import Link from "next/link";

export interface CartDrawerEmptyProps {
  theme?: "human" | "pet";
  onClose?: () => void;
}

export function CartDrawerEmpty({
  theme = "human",
  onClose,
}: CartDrawerEmptyProps) {
  const isPet = theme === "pet";

  return (
    <div className="py-12 px-6 sm:px-7 flex flex-col items-center text-center justify-center space-y-4">
      {/* Visual icon badge */}
      <div
        className="w-20 h-20 rounded-full bg-fg/10 flex items-center justify-center text-3xl select-none"
        aria-hidden="true"
      >
        {isPet ? "🐾" : "⚡"}
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="font-archivo font-extrabold text-2xl uppercase tracking-tight text-fg">
          Your cart is empty
        </h3>
        <p className="text-sm text-fg-muted leading-relaxed">
          {isPet
            ? "Nothing in the bowl yet. Let's find something your best friend will love, or take our quick quiz to find the ideal formula."
            : "Explore our pure NAD+ and cellular longevity formulas, or take our 2-minute quiz to tailor your routine."}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href={isPet ? "/pet/shop" : "/shop"}
          onClick={onClose}
          className={`min-h-[44px] flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            isPet
              ? "bg-fg text-bg hover:opacity-90"
              : "bg-gradient-gold text-accent-fg hover:brightness-105"
          }`}
        >
          {isPet ? "Shop dogs" : "Shop all"}
        </Link>

        <Link
          href={isPet ? "/pet/quiz" : "/human/quiz"}
          onClick={onClose}
          className="min-h-[44px] flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-center border-2 border-border text-fg hover:border-accent hover:text-accent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Take the quiz
        </Link>
      </div>

      <div className="pt-3 text-[11px] text-fg-muted">
        {isPet
          ? "Free shipping over $49 · Subscribe & save 15%"
          : "Free shipping over $75 · Subscribe & save 15%"}
      </div>
    </div>
  );
}
