"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Search, X } from "lucide-react";
import { useMarket } from "@/lib/market";
import type { MarketRegion } from "@/lib/market";

export interface CountrySelectorProps {
  className?: string;
  variant?: "header" | "footer" | "button";
  align?: "left" | "right";
}

const REGION_ORDER: MarketRegion[] = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Other",
];

export function CountrySelector({
  className = "",
  variant = "button",
  align = "left",
}: CountrySelectorProps) {
  const { market, markets, setMarket } = useMarket();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const titleId = useId();
  const searchInputId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wasOpenRef = useRef(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const focusables = modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables?.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus management: focus search input on open, restore trigger on close
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const filteredMarkets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return markets;
    return markets.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.countryCode.toLowerCase().includes(q) ||
        m.currency.code.toLowerCase().includes(q) ||
        m.currency.name.toLowerCase().includes(q)
    );
  }, [markets, search]);

  const groupedMarkets = useMemo(() => {
    const map = new Map<MarketRegion, typeof markets>();
    for (const r of REGION_ORDER) {
      const inRegion = filteredMarkets.filter((m) => m.region === r);
      if (inRegion.length > 0) {
        map.set(r, inRegion);
      }
    }
    return map;
  }, [filteredMarkets]);

  const handleSelect = (marketId: string) => {
    setMarket(marketId);
    setIsOpen(false);
  };

  const isFooter = variant === "footer";

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button: Accessible >= 44x44px target with visible focus */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Select country and currency. Currently selected: ${market.name}, ${market.currency.code}`}
        className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-between gap-2.5 rounded-field border border-border bg-bg-elevated px-3.5 py-2 text-sm font-medium text-fg shadow-sm transition-colors hover:border-accent hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isFooter ? "w-full sm:w-auto" : ""
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden="true">
            {market.flag}
          </span>
          <span className="font-semibold text-fg">{market.countryCode}</span>
          <span className="text-fg-muted font-normal">
            ({market.currency.code} {market.currency.symbol})
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-fg-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Modal / Dialog Backing */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`fixed inset-x-4 top-1/2 z-50 max-h-[85vh] -translate-y-1/2 overflow-hidden rounded-card border border-border bg-bg-elevated shadow-elevated sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 ${
              align === "right" ? "sm:right-0" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
              <div className="flex items-center gap-2.5">
                <Globe className="h-5 w-5 text-accent" aria-hidden="true" />
                <h2
                  id={titleId}
                  className="title text-base sm:text-lg font-bold uppercase tracking-tight text-fg"
                >
                  Select Country &amp; Currency
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close country selector dialog"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-field border border-transparent text-fg-muted transition-colors hover:border-border hover:bg-bg hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Search Filter Field */}
            <div className="border-b border-border p-4 bg-bg">
              <form onSubmit={(e) => e.preventDefault()} role="search">
                <label
                  htmlFor={searchInputId}
                  className="label mb-1.5 block text-xs font-bold uppercase tracking-wider text-fg-muted"
                >
                  Search Country or Currency
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
                    aria-hidden="true"
                  />
                  <input
                    ref={searchInputRef}
                    id={searchInputId}
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by country, currency or code..."
                    className="w-full min-h-[44px] rounded-field border border-border bg-bg-elevated py-2 pl-9 pr-3 text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </div>
              </form>
            </div>

            {/* Markets List grouped by Region */}
            <div className="max-h-[50vh] overflow-y-auto p-4 sm:p-5 space-y-5">
              {groupedMarkets.size === 0 ? (
                <div className="py-8 text-center text-sm text-fg-muted">
                  No matching countries or currencies found.
                </div>
              ) : (
                Array.from(groupedMarkets.entries()).map(
                  ([region, marketList]) => (
                    <fieldset key={region} className="space-y-2">
                      <legend className="label text-xs font-bold uppercase tracking-wider text-fg-muted mb-2">
                        {region}
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {marketList.map((m) => {
                          const isSelected = m.id === market.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => handleSelect(m.id)}
                              aria-pressed={isSelected}
                              aria-current={isSelected ? "true" : undefined}
                              className={`flex min-h-[44px] items-center justify-between rounded-field border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                                isSelected
                                  ? "border-accent bg-bg font-semibold text-fg"
                                  : "border-border bg-bg-elevated text-fg-muted hover:border-border hover:bg-bg hover:text-fg"
                              }`}
                            >
                              <span className="flex items-center gap-2.5">
                                <span
                                  className="text-xl leading-none"
                                  aria-hidden="true"
                                >
                                  {m.flag}
                                </span>
                                <span className="flex flex-col">
                                  <span className="text-sm font-semibold text-fg">
                                    {m.name}
                                  </span>
                                  <span className="text-xs text-fg-muted">
                                    {m.currency.code} ({m.currency.symbol})
                                  </span>
                                </span>
                              </span>
                              {isSelected && (
                                <Check
                                  className="h-4 w-4 text-accent shrink-0 ml-2"
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  )
                )
              )}
            </div>

            {/* Compliance / Customs Notice Footer */}
            <div className="border-t border-border bg-bg p-4 text-xs text-fg-muted">
              <p className="leading-relaxed">
                Prices and checkout convert to your selected market currency.
                International shipments may be subject to customs duties and
                import taxes collected at delivery.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
