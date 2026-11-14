import React from "react";
import Image from "next/image";
import { catalogProvider } from "@/lib/providers";

// Known rendered files in public/renders/
const RENDERED_HANDLES = new Set([
  "biohack",
  "full-charge",
  "renew",
  "powerhouse",
  "daylight",
  "more-good-years",
  "golden-years",
  "still-sharp",
  "shine-on",
]);

function formatPriceUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function W1_20Section() {
  const [allProducts, allKits] = await Promise.all([
    catalogProvider.getProducts(),
    catalogProvider.getKits(),
  ]);

  const humanProducts = allProducts.filter((p) => p.line === "human");
  const petProducts = allProducts.filter((p) => p.line === "pet");
  const humanKits = allKits.filter((k) => k.line === "human");
  const petKits = allKits.filter((k) => k.line === "pet");

  return (
    <section
      id="w1-20-showcase"
      aria-labelledby="w1-20-heading"
      className="space-y-12 py-8"
    >
      {/* Section Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <span className="label rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
            Task W1-20
          </span>
          <span className="text-xs font-medium text-fg-muted uppercase tracking-wider">
            Wave 1 Shopify Handles &amp; Renders Catalog
          </span>
        </div>
        <h2
          id="w1-20-heading"
          className="title text-3xl font-extrabold uppercase tracking-tight text-fg mt-2"
        >
          Shopify Handles &amp; Label Renders
        </h2>
        <p className="text-sm text-fg-muted mt-2 max-w-3xl">
          Complete master registry of Shopify handles, 1/2/3-jar variants,
          15%-off recurring subscription selling plans, provisional pricing, and
          label artwork renders across all 21 SKUs and 8 kits.
        </p>
      </div>

      {/* Trust Strip Global Indicator (Section 3) */}
      <aside
        aria-label="Trust Strip"
        className="rounded-card border border-border bg-bg-elevated p-4 text-center text-xs font-semibold tracking-wide text-fg-muted"
      >
        Made in Clifton, NJ · Our own lab · Tested every lot · Public lab
        reports · Free shipping · 60-day guarantee
      </aside>

      {/* ============================================================ */}
      {/* 1. Human Line Showcase */}
      {/* ============================================================ */}
      <div
        data-theme="human"
        className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
          <div>
            <span className="label inline-block rounded-full bg-border px-3 py-1 text-xs font-bold text-fg-muted uppercase tracking-wider">
              Human Line
            </span>
            <h3 className="title text-2xl font-bold uppercase text-fg mt-1">
              Human Longevity &amp; Cellular Health
            </h3>
            <p className="text-xs font-medium text-accent mt-0.5">
              FREE SHIPPING OVER $75 · SUBSCRIBE &amp; SAVE 15% · TAKE THE QUIZ
            </p>
          </div>
          <span className="text-xs text-fg-muted font-medium">
            Theme: Dark Warm
          </span>
        </div>

        {/* Semantic Controls for Human Handles */}
        <form
          aria-label="Human Line Controls"
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-card bg-bg-elevated border border-border"
        >
          <div>
            <label
              htmlFor="human-search-input"
              className="block text-xs font-bold uppercase tracking-wider text-fg mb-1"
            >
              Search Human Handles
            </label>
            <input
              id="human-search-input"
              type="search"
              name="human-search"
              placeholder="e.g. biohack, renew, glow..."
              className="w-full min-h-11 px-3 py-2 text-sm rounded-md bg-bg text-fg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="human-format-select"
              className="block text-xs font-bold uppercase tracking-wider text-fg mb-1"
            >
              Filter by Format
            </label>
            <select
              id="human-format-select"
              name="human-format"
              className="w-full min-h-11 px-3 py-2 text-sm rounded-md bg-bg text-fg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">
                All Formats (Capsules, Powders, Tinctures)
              </option>
              <option value="capsules">Capsules</option>
              <option value="powders">Powders</option>
              <option value="tinctures">Tinctures</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              className="min-h-11 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-accent text-accent-fg hover:opacity-90 transition-opacity"
            >
              Export Human Handles
            </button>
            <button
              type="button"
              className="min-h-11 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border border-border text-fg hover:border-fg transition-colors"
            >
              Copy All Handles
            </button>
          </div>
        </form>

        {/* Human Products Grid */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold uppercase tracking-tight text-fg">
            Human Products ({humanProducts.length} SKUs)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {humanProducts.map((product) => {
              const hasRender = RENDERED_HANDLES.has(product.handle);
              const v1 = product.variants.find((v) => v.jars === 1);
              const priceDisplay = v1
                ? formatPriceUSD(v1.price.amount)
                : "Provisional";

              return (
                <article
                  key={product.handle}
                  aria-labelledby={`card-title-${product.handle}`}
                  className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-5 space-y-4 shadow-card"
                >
                  <div className="space-y-3">
                    {/* Render Image or Pending Badge */}
                    <div className="relative w-full h-44 rounded-md overflow-hidden bg-bg border border-border flex items-center justify-center">
                      {hasRender ? (
                        <Image
                          src={`/renders/${product.handle}.png`}
                          alt={`${product.name} label render artwork`}
                          width={260}
                          height={160}
                          className="object-contain max-h-full max-w-full p-2"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <span className="label inline-block rounded-full bg-border px-3 py-1 text-[11px] font-bold text-fg-muted uppercase">
                            Render Pendente
                          </span>
                          <span className="text-xs text-fg-muted mt-2">
                            3D render to be generated
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5
                          id={`card-title-${product.handle}`}
                          className="text-base font-bold text-fg leading-tight"
                        >
                          {product.name}
                        </h5>
                        <p className="text-xs text-fg-muted">
                          {product.technicalName}
                        </p>
                      </div>
                      <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-mono font-bold text-accent">
                        {priceDisplay}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between text-fg-muted">
                        <span>Shopify Handle:</span>
                        <code className="font-mono text-fg font-semibold">
                          {product.handle}
                        </code>
                      </div>
                      <div className="flex items-center justify-between text-fg-muted">
                        <span>Format:</span>
                        <span className="text-fg font-medium">
                          {product.format}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-fg-muted">
                        <span>Variants:</span>
                        <span className="text-fg font-medium">
                          {product.variants.length} tiers (1, 2, 3 jars)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-fg-muted">
                        <span>Subscription:</span>
                        <span className="text-fg font-medium">
                          15% off (30/60/90 days)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex gap-2">
                    <button
                      type="button"
                      aria-label={`Copy handle for ${product.name}`}
                      className="min-h-11 w-full px-3 py-2 text-xs font-bold rounded border border-border text-fg hover:border-fg transition-colors"
                    >
                      Copy Handle: {product.handle}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Human Kits Section */}
        {humanKits.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h4 className="text-lg font-bold uppercase tracking-tight text-fg">
              Human Kits &amp; Bundles ({humanKits.length} Kits)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {humanKits.map((kit) => (
                <div
                  key={kit.handle}
                  className="rounded-card border border-border bg-bg-elevated p-4 flex flex-col justify-between space-y-2"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      Bundle
                    </span>
                    <h5 className="text-sm font-bold text-fg">{kit.name}</h5>
                    <p className="text-xs text-fg-muted mt-1 line-clamp-2">
                      {kit.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <code className="text-xs font-mono text-fg font-bold">
                      {kit.handle}
                    </code>
                    <span className="text-xs font-bold text-accent">
                      {formatPriceUSD(kit.price.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FDA Claim Regulatory Notice (AGENTS.md Rule 8) */}
        <footer className="pt-4 border-t border-border/50 text-[11px] text-fg-muted leading-relaxed">
          *These statements have not been evaluated by the Food and Drug
          Administration. This product is not intended to diagnose, treat, cure,
          or prevent any disease.
        </footer>
      </div>

      {/* ============================================================ */}
      {/* 2. Pet Line Showcase */}
      {/* ============================================================ */}
      <div
        data-theme="pet"
        className="rounded-card border border-border bg-bg p-6 sm:p-8 space-y-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
          <div>
            <span className="label inline-block rounded-full bg-border px-3 py-1 text-xs font-bold text-fg-muted uppercase tracking-wider">
              Pet Line
            </span>
            <h3 className="title text-2xl font-bold uppercase text-fg mt-1">
              Pet Longevity (Dogs, Cats &amp; Horses)
            </h3>
            <p className="text-xs font-medium text-accent mt-0.5">
              FREE SHIPPING OVER $49 · SUBSCRIBE &amp; SAVE 15% · FIND THE RIGHT
              FORMULA
            </p>
          </div>
          <span className="text-xs text-fg-muted font-medium">
            Theme: Light Warm
          </span>
        </div>

        {/* Semantic Controls for Pet Handles */}
        <form
          aria-label="Pet Line Controls"
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-card bg-bg-elevated border border-border"
        >
          <div>
            <label
              htmlFor="pet-search-input"
              className="block text-xs font-bold uppercase tracking-wider text-fg mb-1"
            >
              Search Pet Handles
            </label>
            <input
              id="pet-search-input"
              type="search"
              name="pet-search"
              placeholder="e.g. more-good-years, golden-years..."
              className="w-full min-h-11 px-3 py-2 text-sm rounded-md bg-bg text-fg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="pet-species-select"
              className="block text-xs font-bold uppercase tracking-wider text-fg mb-1"
            >
              Filter by Species
            </label>
            <select
              id="pet-species-select"
              name="pet-species"
              className="w-full min-h-11 px-3 py-2 text-sm rounded-md bg-bg text-fg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Species (Dogs, Cats, Horses)</option>
              <option value="dog">Dogs (Canine)</option>
              <option value="cat">Cats (Feline)</option>
              <option value="horse">Horses (Equine)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              className="min-h-11 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md bg-accent text-accent-fg hover:opacity-90 transition-opacity"
            >
              Export Pet Handles
            </button>
            <button
              type="button"
              className="min-h-11 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border border-border text-fg hover:border-fg transition-colors"
            >
              Copy All Handles
            </button>
          </div>
        </form>

        {/* Pet Products Grid */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold uppercase tracking-tight text-fg">
            Pet Products ({petProducts.length} SKUs)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petProducts.map((product) => {
              const hasRender = RENDERED_HANDLES.has(product.handle);
              const v1 = product.variants.find((v) => v.jars === 1);
              const priceDisplay = v1
                ? formatPriceUSD(v1.price.amount)
                : "Provisional";

              return (
                <article
                  key={product.handle}
                  aria-labelledby={`card-title-${product.handle}`}
                  className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-5 space-y-4 shadow-card"
                >
                  <div className="space-y-3">
                    {/* Render Image or Pending Badge */}
                    <div className="relative w-full h-44 rounded-md overflow-hidden bg-bg border border-border flex items-center justify-center">
                      {hasRender ? (
                        <Image
                          src={`/renders/${product.handle}.png`}
                          alt={`${product.name} label render artwork`}
                          width={260}
                          height={160}
                          className="object-contain max-h-full max-w-full p-2"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <span className="label inline-block rounded-full bg-border px-3 py-1 text-[11px] font-bold text-fg-muted uppercase">
                            Render Pendente
                          </span>
                          <span className="text-xs text-fg-muted mt-2">
                            3D render to be generated
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5
                          id={`card-title-${product.handle}`}
                          className="text-base font-bold text-fg leading-tight"
                        >
                          {product.name}
                        </h5>
                        <p className="text-xs text-fg-muted">
                          {product.technicalName}
                        </p>
                      </div>
                      <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-mono font-bold text-accent">
                        {priceDisplay}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between text-fg-muted">
                        <span>Shopify Handle:</span>
                        <code className="font-mono text-fg font-semibold">
                          {product.handle}
                        </code>
                      </div>
                      <div className="flex items-center justify-between text-fg-muted">
                        <span>Species:</span>
                        <span className="text-fg font-medium capitalize">
                          {product.species || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-fg-muted">
                        <span>Format:</span>
                        <span className="text-fg font-medium">
                          {product.format}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-fg-muted">
                        <span>Variants:</span>
                        <span className="text-fg font-medium">
                          {product.variants.length} tiers (1, 2, 3 jars)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex gap-2">
                    <button
                      type="button"
                      aria-label={`Copy handle for ${product.name}`}
                      className="min-h-11 w-full px-3 py-2 text-xs font-bold rounded border border-border text-fg hover:border-fg transition-colors"
                    >
                      Copy Handle: {product.handle}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Pet Kits Section */}
        {petKits.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h4 className="text-lg font-bold uppercase tracking-tight text-fg">
              Pet Kits &amp; Bundles ({petKits.length} Kits)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {petKits.map((kit) => (
                <div
                  key={kit.handle}
                  className="rounded-card border border-border bg-bg-elevated p-4 flex flex-col justify-between space-y-2"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      Bundle
                    </span>
                    <h5 className="text-sm font-bold text-fg">{kit.name}</h5>
                    <p className="text-xs text-fg-muted mt-1 line-clamp-2">
                      {kit.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <code className="text-xs font-mono text-fg font-bold">
                      {kit.handle}
                    </code>
                    <span className="text-xs font-bold text-accent">
                      {formatPriceUSD(kit.price.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pet Regulatory Notice (AGENTS.md Rule 8) */}
        <footer className="pt-4 border-t border-border/50 text-[11px] text-fg-muted leading-relaxed space-y-1">
          <p className="font-semibold text-fg">For animal use only.</p>
          <p>Equine products: not for horses intended for food.</p>
        </footer>
      </div>
    </section>
  );
}
