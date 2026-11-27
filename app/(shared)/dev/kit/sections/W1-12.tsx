import React from "react";
import { catalogProvider } from "@/lib/providers";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { ProductCard } from "@/components/commerce/product-card";
import { PurchaseOptions } from "@/components/commerce/purchase-options";

export default async function W1_12Section() {
  const [biohack, moreGoodYears] = await Promise.all([
    catalogProvider.getProduct("biohack"),
    catalogProvider.getProduct("more-good-years"),
  ]);

  return (
    <section
      id="w1-12-showcase"
      aria-labelledby="w1-12-heading"
      className="space-y-12 py-8"
    >
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <span className="label rounded-pill bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
            Task W1-12
          </span>
          <span className="text-xs font-medium text-fg-muted uppercase tracking-wider">
            Wave 1 Commerce Component Showcase
          </span>
        </div>
        <h2
          id="w1-12-heading"
          className="title text-3xl font-extrabold uppercase tracking-tight text-fg mt-2"
        >
          Product Card &amp; Purchase Options
        </h2>
        <p className="text-sm text-fg-muted mt-2 max-w-2xl">
          Standardized commerce components for Nadeon Labs. Features dynamic
          variant selections, recurring subscription selling plans, FDA claim
          compliance, pet regulatory notices, and international market currency
          formatting via Intl.NumberFormat.
        </p>
      </div>

      {/* Human Line Showcase: BioHack */}
      {biohack && (
        <div
          data-theme="human"
          className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div>
              <span className="label inline-block rounded-pill bg-border px-2.5 py-0.5 text-[11px] font-bold text-fg-muted">
                Human Line
              </span>
              <h3 className="title text-2xl font-bold uppercase text-fg mt-1">
                BioHack Cellular Optimizer
              </h3>
            </div>
            <span className="text-xs text-fg-muted font-medium">
              Theme: Dark Warm
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Product Card Column */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="label text-xs text-fg-muted font-bold tracking-wider">
                Product Card Component
              </h4>
              <ProductCard product={biohack} />
            </div>

            {/* Purchase Options Column */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="label text-xs text-fg-muted font-bold tracking-wider">
                Purchase Options Component
              </h4>
              <PurchaseOptions
                product={biohack}
                defaultPurchaseType="subscription"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pet Line Showcase: More Good Years */}
      {moreGoodYears && (
        <div
          data-theme="pet"
          className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div>
              <span className="label inline-block rounded-pill bg-border px-2.5 py-0.5 text-[11px] font-bold text-fg-muted">
                Pet Line (Canine)
              </span>
              <h3 className="title text-2xl font-bold uppercase text-fg mt-1">
                More Good Years Chews
              </h3>
            </div>
            <span className="text-xs text-fg-muted font-medium">
              Theme: Light Warm
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Product Card Column */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="label text-xs text-fg-muted font-bold tracking-wider">
                Product Card Component
              </h4>
              <ProductCard product={moreGoodYears} />
            </div>

            {/* Purchase Options Column */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="label text-xs text-fg-muted font-bold tracking-wider">
                Purchase Options Component
              </h4>
              <PurchaseOptions
                product={moreGoodYears}
                defaultPurchaseType="one-time"
              />
            </div>
          </div>
        </div>
      )}

      {/* USD Single-Currency Proof */}
      {biohack && (
        <div className="rounded-card border border-border bg-bg-elevated p-6 space-y-4">
          <h4 className="title text-lg font-bold uppercase text-fg">
            USD Currency Formatting
          </h4>
          <p className="text-xs text-fg-muted">
            All storefront prices format in USD via the market formatter
            (Intl.NumberFormat), never concatenated strings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-field border border-border bg-bg">
              <span className="text-xs font-bold text-fg-muted block mb-1">
                US Market (USD)
              </span>
              <div className="text-xl font-black text-fg">
                {formatMoneyWithMarket(biohack.variants[0].price)}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
