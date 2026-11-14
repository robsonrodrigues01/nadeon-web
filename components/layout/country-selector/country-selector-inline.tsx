"use client";

import React, { useId } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useMarket } from "@/lib/market";

export interface CountrySelectorInlineProps {
  className?: string;
  showNotice?: boolean;
}

export function CountrySelectorInline({
  className = "",
  showNotice = true,
}: CountrySelectorInlineProps) {
  const { market, markets, setMarket } = useMarket();
  const selectId = useId();

  return (
    <form
      role="region"
      aria-label="Country and currency selector"
      onSubmit={(e) => e.preventDefault()}
      className={`space-y-2 ${className}`}
    >
      <label
        htmlFor={selectId}
        className="label flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fg-muted"
      >
        <Globe className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        <span>Country &amp; Currency</span>
      </label>

      <div className="relative">
        <select
          id={selectId}
          value={market.id}
          onChange={(e) => setMarket(e.target.value)}
          aria-label="Select your country and market currency"
          className="w-full min-h-[44px] appearance-none rounded-field border border-border bg-bg-elevated px-3 py-2 pr-10 text-sm font-medium text-fg shadow-sm transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {markets.map((m) => (
            <option key={m.id} value={m.id} className="bg-bg text-fg">
              {m.flag} {m.name} ({m.currency.code} {m.currency.symbol})
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
          aria-hidden="true"
        />
      </div>

      {showNotice && market.taxNotice && (
        <p className="text-[11px] leading-relaxed text-fg-muted">
          {market.taxNotice}
        </p>
      )}
    </form>
  );
}
