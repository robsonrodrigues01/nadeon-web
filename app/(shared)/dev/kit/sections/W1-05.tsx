"use client";

import React from "react";
import {
  CountrySelector,
  CountrySelectorInline,
} from "@/components/layout/country-selector";
import {
  MarketProvider,
  MoneyDisplay,
  SUPPORTED_MARKETS,
  useMarket,
} from "@/lib/market";

function ThemeCard({
  theme,
  productTitle,
  productSubtitle,
  productBasePrice,
  isPet = false,
}: {
  theme: "human" | "pet";
  productTitle: string;
  productSubtitle: string;
  productBasePrice: number;
  isPet?: boolean;
}) {
  const { market } = useMarket();

  return (
    <div
      data-theme={theme}
      className="flex flex-col justify-between rounded-card border-2 border-border bg-bg text-fg p-6 sm:p-8 shadow-card"
    >
      <div className="space-y-6">
        {/* Header tag */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="label inline-block rounded-full bg-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-fg-muted">
              {theme === "human" ? "Human Line Theme" : "Pet Line Theme"}
            </span>
            <h3 className="title text-xl sm:text-2xl font-black uppercase text-fg mt-2">
              {theme === "human"
                ? "Dark / Warm Luxury"
                : "Light / Warm Companion"}
            </h3>
          </div>
          <span className="text-2xl" aria-hidden="true">
            {market.flag}
          </span>
        </div>

        {/* Regulatory note for Pet theme */}
        {isPet && (
          <div className="rounded-field border border-border bg-bg-elevated p-3 text-xs font-semibold text-accent">
            For animal use only. Keep out of reach of children.
          </div>
        )}

        {/* Modal Trigger Demo */}
        <div className="space-y-2">
          <span className="label block text-xs font-bold uppercase tracking-wider text-fg-muted">
            1. Modal Trigger (Header / Navigation)
          </span>
          <CountrySelector variant="button" />
        </div>

        {/* Inline Form Demo */}
        <div className="space-y-2">
          <span className="label block text-xs font-bold uppercase tracking-wider text-fg-muted">
            2. Inline Form (Footer / Checkout)
          </span>
          <div className="rounded-card border border-border bg-bg-elevated p-4">
            <CountrySelectorInline />
          </div>
        </div>

        {/* Dynamic Multi-Currency Price Formatting */}
        <div className="rounded-card border border-border bg-bg-elevated p-4 space-y-3">
          <span className="label block text-xs font-bold uppercase tracking-wider text-fg-muted">
            3. Dynamic Catalog Price (Rule 7: Intl.NumberFormat)
          </span>

          <div className="flex items-baseline justify-between border-b border-border pb-3">
            <div>
              <div className="font-bold text-base text-fg">{productTitle}</div>
              <div className="text-xs text-fg-muted">{productSubtitle}</div>
            </div>
            <div className="text-right">
              <MoneyDisplay
                amount={productBasePrice}
                currencyCode="USD"
                className="text-xl font-black text-accent"
              />
              <span className="block text-[11px] text-fg-muted">
                {market.currency.code} ({market.currency.name})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-fg-muted">
            <div>
              <span className="font-semibold text-fg">Active Market:</span>{" "}
              {market.name}
            </div>
            <div>
              <span className="font-semibold text-fg">Exchange Rate:</span> 1
              USD = {market.rate} {market.currency.code}
            </div>
            <div>
              <span className="font-semibold text-fg">Locale:</span>{" "}
              {market.locale}
            </div>
            <div>
              <span className="font-semibold text-fg">Cookie:</span>{" "}
              nadeon_market={market.id}
            </div>
          </div>
        </div>
      </div>

      {/* Footer notice */}
      <div className="mt-6 pt-4 border-t border-border text-[11px] text-fg-muted leading-relaxed">
        {market.taxNotice}
      </div>
    </div>
  );
}

export default function W1_05_Section() {
  return (
    <MarketProvider>
      <section
        aria-labelledby="w1-05-heading"
        className="mb-16 space-y-8"
        id="section-w1-05"
      >
        {/* Section Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="label inline-block rounded-full bg-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              Wave 1 · W1-05
            </span>
            <span className="label inline-block rounded-full bg-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-fg-muted">
              Global Multi-Market
            </span>
          </div>
          <h2
            id="w1-05-heading"
            className="hero text-3xl sm:text-5xl font-black uppercase tracking-tight text-fg"
          >
            Country &amp; Currency Selector
          </h2>
          <p className="lead text-fg-muted mt-2 max-w-3xl">
            Shopify Markets mock integration featuring country and currency
            selection, cookie persistence (nadeon_market), React context for
            automatic multi-currency pricing, and accessible semantic components
            tested across both Human and Pet themes.
          </p>
        </div>

        {/* Side-by-Side Theme Variants: Human vs Pet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ThemeCard
            theme="human"
            productTitle="BioHack"
            productSubtitle="Cellular Longevity & NAD+ Optimizer"
            productBasePrice={65}
            isPet={false}
          />
          <ThemeCard
            theme="pet"
            productTitle="Canine Vitality Chews"
            productSubtitle="Veterinary Cellular Longevity Formula"
            productBasePrice={49}
            isPet={true}
          />
        </div>

        {/* Supported Markets Matrix */}
        <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card space-y-4">
          <h3 className="title text-xl font-bold uppercase text-fg">
            Supported Markets &amp; Exchange Rates
          </h3>
          <p className="text-sm text-fg-muted">
            All prices format dynamically using standard browser
            Intl.NumberFormat with proper locale-specific symbols and grouping.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-fg-muted">
                <tr>
                  <th scope="col" className="py-3 px-3">
                    Country
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Region
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Currency
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Rate (USD base)
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Locale
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Customs / Tax Notice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-fg">
                {SUPPORTED_MARKETS.map((m) => (
                  <tr key={m.id} className="hover:bg-bg/50 transition-colors">
                    <td className="py-3 px-3 font-semibold flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">
                        {m.flag}
                      </span>
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3 px-3 text-fg-muted">{m.region}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-accent">
                        {m.currency.code}
                      </span>{" "}
                      <span className="text-fg-muted">
                        ({m.currency.symbol})
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-fg-muted">
                      1 USD = {m.rate} {m.currency.code}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-fg-muted">
                      {m.locale}
                    </td>
                    <td className="py-3 px-3 text-xs text-fg-muted max-w-xs">
                      {m.taxNotice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </MarketProvider>
  );
}
