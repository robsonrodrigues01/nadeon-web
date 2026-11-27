import React from "react";
import type { Product } from "@/lib/contracts/catalog";
import { Button } from "@/components/ui/button";
import { Claim } from "./product-card/claim";

export interface ProductCardMinProps {
  product: Product;
  className?: string;
}

/**
 * Formats a monetary value according to the specified market currency and locale.
 * Follows Rule 7: Always uses Intl.NumberFormat, never manual string concatenation.
 */
export function formatMarketPrice(
  amount: number,
  currencyCode: string,
  locale?: string
): string {
  const resolvedLocale =
    locale ?? (currencyCode.toUpperCase() === "EUR" ? "de-DE" : "en-US");
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export function ProductCardMin({ product, className }: ProductCardMinProps) {
  const primaryVariant = product.variants[0];
  const baseUsdPrice = primaryVariant?.price.amount ?? 0;

  // Approximate EU market conversion rate (1 USD ~ 0.92 EUR) to demonstrate market currency formatting
  const eurAmount = Math.round(baseUsdPrice * 0.92);

  const formattedUsd = formatMarketPrice(baseUsdPrice, "USD", "en-US");
  const formattedEur = formatMarketPrice(eurAmount, "EUR", "en-IE");

  const isPet = product.line === "pet";
  const isEquine = product.species === "horse";

  return (
    <article
      className={`flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-6 shadow-card transition-shadow hover:shadow-elevated ${
        className ?? ""
      }`}
      aria-labelledby={`product-heading-${product.slug}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider">
            {product.line}
          </span>
          <span className="text-xs font-medium text-fg-muted">
            {product.format}
          </span>
        </div>

        <h3
          id={`product-heading-${product.slug}`}
          className="title text-2xl font-extrabold uppercase tracking-tight text-fg mb-1"
        >
          {product.name}
        </h3>

        <p className="text-sm text-fg-muted mb-4 font-medium">
          {product.technicalName}
        </p>

        {/* Regulatory & Compliance Notices (Rule 8) */}
        {isPet && (
          <div className="mb-4 rounded-field border border-border bg-bg p-2 text-xs font-semibold text-accent">
            ⚠️ For animal use only. Keep out of reach of children.
            {isEquine && (
              <span className="block mt-1">
                Not for horses intended for human consumption.
              </span>
            )}
          </div>
        )}

        {/* Benefits Preview */}
        {product.benefits.length > 0 && (
          <ul className="mb-6 space-y-1.5 text-xs text-fg-muted">
            {product.benefits.slice(0, 2).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-accent font-bold" aria-hidden="true">
                  ✓
                </span>
                <Claim showDisclaimer={false}>{benefit}</Claim>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        {/* Market Pricing Comparison: USD (US Market) vs EUR (EU Market) */}
        <div className="mb-4 rounded-field border border-border bg-bg p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-fg-muted mb-1">
            Market Pricing Proof
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-fg-muted font-medium">US Market (USD):</span>
            <span className="font-bold text-fg">{formattedUsd}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-fg-muted font-medium">EU Market (EUR):</span>
            <span className="font-bold text-accent">{formattedEur}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="primary" className="w-full">
            Add to cart · {formattedUsd}
          </Button>
          <Button
            variant="secondary"
            href={`/products/${product.slug}`}
            className="w-full"
          >
            View details
          </Button>
        </div>
      </div>
    </article>
  );
}
