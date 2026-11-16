"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import type { Cart, CartProvider } from "@/lib/contracts/cart";
import { cartProvider as defaultCartProvider } from "@/lib/providers/client";
import { useMarket } from "@/lib/market/context";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { Button } from "@/components/ui/button";
import { Claim } from "./claim";

export interface ProductCardProps {
  product: Product;
  headingLevel?: 2 | 3;
  className?: string;
  cartProvider?: CartProvider;
  onAddToCartSuccess?: (cart: Cart) => void;
}

export function ProductCard({
  product,
  headingLevel = 3,
  className = "",
  cartProvider = defaultCartProvider,
  onAddToCartSuccess,
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { market } = useMarket();

  const primaryVariant = product.variants[0];
  const primaryPrice = primaryVariant?.price ?? {
    amount: 0,
    currencyCode: "USD",
  };
  const formattedPrice = formatMoneyWithMarket(primaryPrice, market);

  const primarySellingPlan = product.sellingPlans[0];
  const discountPercentage = primarySellingPlan?.discountPercentage ?? 15;

  const isPet = product.line === "pet";
  const isEquine = product.species === "horse";
  const productHref = `/${isPet ? "pet" : "human"}/products/${product.slug}`;
  const ProductHeading = headingLevel === 2 ? "h2" : "h3";

  // Primary image fallback or first image
  const imageSrc =
    product.images[0] ||
    (isPet
      ? "/images/products/more-good-years-front.webp"
      : "/images/products/biohack-front.webp");

  const handleAddToCart = async () => {
    if (!primaryVariant) return;
    setIsAdding(true);
    setFeedback(null);
    try {
      const updatedCart = await cartProvider.addLines([
        {
          variantId: primaryVariant.id,
          quantity: 1,
        },
      ]);
      setFeedback(`Added ${product.name} to cart`);
      if (onAddToCartSuccess) {
        onAddToCartSuccess(updatedCart);
      }
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article
      className={`group flex min-w-0 flex-col justify-between overflow-hidden rounded-card border border-border bg-bg-elevated text-fg shadow-card transition-all hover:shadow-elevated ${className}`}
      aria-labelledby={`product-heading-${product.slug}`}
    >
      <div>
        {/* Top media container with format badge */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-bg flex items-center justify-center p-6">
          <Link
            href={productHref}
            className="relative flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105"
            aria-label={`View details for ${product.name}`}
          >
            <Image
              src={imageSrc}
              alt={`${product.name} - ${product.technicalName}`}
              width={240}
              height={240}
              className="max-h-full max-w-full object-contain"
            />
          </Link>

          {/* Format badge */}
          <span className="label absolute left-3 top-3 inline-flex items-center rounded-pill bg-bg-elevated/90 px-3 py-1 text-xs font-bold text-fg border border-border backdrop-blur-xs select-none">
            {product.format}
          </span>
        </div>

        {/* Content details */}
        <div className="min-w-0 p-5 sm:p-6">
          <div className="mb-1 flex min-w-0 items-baseline justify-between gap-2">
            <ProductHeading
              id={`product-heading-${product.slug}`}
              className="title min-w-0 break-words text-xl font-extrabold uppercase tracking-tight text-fg sm:text-2xl [overflow-wrap:anywhere]"
            >
              <Link
                href={productHref}
                className="hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                {product.name}
              </Link>
            </ProductHeading>
          </div>

          <p className="text-sm text-fg-muted font-medium mb-3 line-clamp-2">
            {product.technicalName}
          </p>

          {/* Compliance notice for pets */}
          {isPet && (
            <div
              className="mb-3 rounded-field border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-accent"
              role="note"
            >
              For animal use only.
              {isEquine && (
                <span className="block mt-0.5">
                  Equine products: not for horses intended for food.
                </span>
              )}
            </div>
          )}

          {/* First claim or primary benefit if present */}
          {(() => {
            const activeClaim = product.claims.find((c) => c.isClaim);
            if (activeClaim) {
              return (
                <div className="text-xs text-fg-muted mb-4 flex items-start gap-1.5">
                  <span className="text-accent font-bold" aria-hidden="true">
                    ✓
                  </span>
                  <Claim showDisclaimer={false}>{activeClaim.text}</Claim>
                </div>
              );
            }
            if (product.benefits.length > 0) {
              return (
                <div className="text-xs text-fg-muted mb-4 flex items-start gap-1.5">
                  <span className="text-accent font-bold" aria-hidden="true">
                    ✓
                  </span>
                  <span>{product.benefits[0]}</span>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Footer with price and Add to Cart action */}
      <div className="p-5 sm:p-6 pt-0 border-t border-border/40 mt-2">
        <div className="flex items-center justify-between gap-3 mb-2 pt-4">
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-fg">
              {formattedPrice}
            </div>
            {product.sellingPlans.length > 0 && (
              <div className="text-[11px] text-fg-muted">
                or subscribe and save {discountPercentage}%
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            size="default"
            isLoading={isAdding}
            loadingText="Adding..."
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart for ${formattedPrice}`}
          >
            Add to cart
          </Button>
        </div>

        {/* Live feedback for screen readers and UI notification */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="min-h-5 text-center text-xs font-medium text-accent"
        >
          {feedback}
        </div>
      </div>
    </article>
  );
}
