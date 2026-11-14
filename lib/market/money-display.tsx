"use client";

import React from "react";
import type { Money } from "@/lib/contracts/catalog";
import type { FormatMoneyOptions } from "./types";
import { useMarket } from "./context";

export interface MoneyDisplayProps {
  money?: Money;
  amount?: number;
  currencyCode?: string;
  options?: FormatMoneyOptions;
  className?: string;
  as?: "span" | "div" | "strong";
}

/**
 * Renders a formatted price according to the active Market in React context.
 * Complies with Rule 7 (Intl.NumberFormat with local market currency).
 */
export function MoneyDisplay({
  money,
  amount,
  currencyCode = "USD",
  options,
  className,
  as: Component = "span",
}: MoneyDisplayProps) {
  const { formatMoney } = useMarket();

  let formatted = "";
  if (money) {
    formatted = formatMoney(money, options);
  } else if (typeof amount === "number") {
    formatted = formatMoney({ amount, currencyCode }, options);
  } else {
    formatted = formatMoney(0, options);
  }

  return <Component className={className}>{formatted}</Component>;
}
