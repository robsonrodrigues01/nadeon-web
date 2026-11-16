"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { Claim } from "@/components/commerce/product-card/claim";
import { Button } from "@/components/ui/button";

export interface SearchResultItemProps {
  product: Product;
  /** Preço já formatado pelo mercado no servidor (formatMoneyWithMarket). */
  priceLabel?: string;
}

const FALLBACK_IMAGE = "/images/products/biohack-front.webp";

export function SearchResultItem({
  product,
  priceLabel,
}: SearchResultItemProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const variant = product.variants[0];
  const href = `/human/products/${product.slug}`;
  const imageSrc = product.images[0] || FALLBACK_IMAGE;
  const benefit =
    product.claims.find((claim) => claim.isClaim)?.text ?? product.benefits[0];
  const discount = product.sellingPlans[0]?.discountPercentage;

  const handleAddToCart = async () => {
    if (!variant) return;
    setIsAdding(true);
    setFeedback(null);
    try {
      await cartProvider.addLines([{ variantId: variant.id, quantity: 1 }]);
      setFeedback(`Added ${product.name} to cart`);
    } catch {
      setFeedback("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article
      aria-labelledby={`search-product-${product.slug}`}
      className="flex flex-col gap-4 border-b border-border/40 py-6 sm:flex-row sm:items-center sm:gap-6"
    >
      <Image
        src={imageSrc}
        alt={`${product.name} - ${product.technicalName}`}
        width={120}
        height={120}
        sizes="(min-width: 640px) 120px, 96px"
        className="h-24 w-24 shrink-0 object-contain sm:h-30 sm:w-30"
      />

      <div className="flex-1">
        <p className="label text-xs font-bold uppercase tracking-wider text-fg-muted">
          {product.format}
        </p>
        <h3
          id={`search-product-${product.slug}`}
          className="title text-lg font-extrabold uppercase tracking-tight text-fg sm:text-xl"
        >
          <Link
            href={href}
            className="rounded-sm hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {product.name}
          </Link>
        </h3>

        {benefit && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-fg-muted">
            <span className="font-bold text-accent" aria-hidden="true">
              ✓
            </span>
            <Claim>{benefit}</Claim>
          </p>
        )}
      </div>

      {variant && priceLabel && (
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <div className="text-right">
            <p className="text-lg font-extrabold text-fg">{priceLabel}</p>
            {discount !== undefined && (
              <p className="text-xs text-fg-muted">
                Subscribe &amp; save {discount}%
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="primary"
            size="default"
            isLoading={isAdding}
            loadingText="Adding..."
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </div>
      )}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="min-h-5 text-xs font-medium text-accent sm:basis-full"
      >
        {feedback}
      </div>
    </article>
  );
}
