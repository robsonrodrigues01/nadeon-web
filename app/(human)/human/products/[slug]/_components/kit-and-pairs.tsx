"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Kit, Product } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { formatMarketPrice } from "@/lib/market/formatter";
import { DEFAULT_MARKET } from "@/lib/market/markets";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";

export interface KitAndPairsProps {
  kit: Kit | null;
  relatedProducts: Product[];
}

export function KitAndPairs({ kit, relatedProducts }: KitAndPairsProps) {
  const [isAddingKit, setIsAddingKit] = useState(false);
  const [addingSlug, setAddingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddDuo = async () => {
    setIsAddingKit(true);
    setFeedback(null);
    try {
      // Find variants for the products in kit if available, otherwise primary variants
      const linesToAdd =
        kit?.products.map((ref) => {
          const matchedProduct = relatedProducts.find(
            (p) => p.slug === ref.productSlug
          );
          const variantId =
            matchedProduct?.variants[0]?.id || `var_${ref.productSlug}_1`;
          return {
            variantId,
            quantity: ref.quantity,
          };
        }) || [];

      if (linesToAdd.length > 0) {
        await cartProvider.addLines(linesToAdd);
      } else {
        await cartProvider.addLines([
          { variantId: "var_biohack_1", quantity: 1 },
          { variantId: "var_renew_1", quantity: 1 },
        ]);
      }

      setFeedback("Added The Energy Duo to cart");
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback("Failed to add duo to cart");
    } finally {
      setIsAddingKit(false);
    }
  };

  const handleAddProduct = async (product: Product) => {
    const variantId = product.variants[0]?.id;
    if (!variantId) return;

    setAddingSlug(product.slug);
    setFeedback(null);
    try {
      await cartProvider.addLines([
        {
          variantId,
          quantity: 1,
        },
      ]);
      setFeedback(`Added ${product.name} to cart`);
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback(`Failed to add ${product.name} to cart`);
    } finally {
      setAddingSlug(null);
    }
  };

  const kitPrice = kit?.price
    ? formatMarketPrice(
        kit.price.amount,
        kit.price.currencyCode,
        DEFAULT_MARKET.locale
      )
    : null;
  const kitComparePrice = kit?.compareAtPrice
    ? formatMarketPrice(
        kit.compareAtPrice.amount,
        kit.compareAtPrice.currencyCode,
        DEFAULT_MARKET.locale
      )
    : null;

  return (
    <section
      aria-label="Bundles and routine pairings"
      className="w-full bg-bg py-16 px-4 sm:px-8 lg:px-18 border-b border-border text-fg"
    >
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Feedback message banner */}
        {feedback && (
          <div
            role="status"
            className="rounded-field border border-accent bg-accent/15 px-4 py-2.5 text-center text-sm font-bold text-fg"
          >
            {feedback}
          </div>
        )}

        {/* Featured Kit Section: The Energy Duo (only when the catalog has the kit) */}
        {kit && (
          <div className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8 lg:p-10 shadow-card">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left Duo Graphic */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-6 rounded-card bg-bg border border-border/50">
                <div className="flex items-center gap-4 text-center">
                  <div className="p-4 rounded-card bg-bg-elevated border border-border">
                    <div className="font-archivo font-black text-lg text-fg">
                      BioHack
                    </div>
                    <div className="text-xs text-product-amber font-bold">
                      NMN 500 mg
                    </div>
                  </div>
                  <span className="text-2xl font-black text-product-amber select-none">
                    +
                  </span>
                  <div className="p-4 rounded-card bg-bg-elevated border border-border">
                    <div className="font-archivo font-black text-lg text-fg">
                      Renew
                    </div>
                    <div className="text-xs text-product-amber font-bold">
                      NAD+ + Resveratrol
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Duo Copy & Action */}
              <div className="w-full lg:w-1/2 flex flex-col items-start gap-4">
                <span className="rounded-pill bg-product-amber/15 border border-product-amber/30 px-3 py-1 text-xs font-bold tracking-wider uppercase text-product-amber">
                  FEATURED KIT
                </span>

                <h3 className="text-2xl sm:text-3xl font-black font-archivo uppercase text-fg">
                  The Energy Duo
                </h3>

                <div className="text-sm text-fg-muted leading-relaxed">
                  <Claim showDisclaimer>
                    BioHack in the morning, Renew with lunch. NMN plus direct
                    NAD+.*
                  </Claim>
                </div>

                {kitPrice && (
                  <div className="flex items-baseline gap-3 my-2">
                    <span className="text-2xl font-black font-archivo text-fg">
                      {kitPrice}
                    </span>
                    {kitComparePrice && (
                      <span className="text-sm font-medium line-through text-fg-muted">
                        {kitComparePrice}
                      </span>
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  isLoading={isAddingKit}
                  loadingText="Adding duo..."
                  onClick={handleAddDuo}
                  className="w-full sm:w-auto min-w-[200px]"
                  aria-label="Add the duo to cart"
                >
                  Add the duo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pairs Well With Section */}
        <div>
          <div className="mb-8">
            <div className="text-xs font-bold tracking-widest uppercase text-product-amber">
              PAIRS WELL WITH
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-archivo uppercase text-fg mt-2">
              Complete the routine
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((product) => {
              const price = product.variants[0]?.price;
              const formattedPrice = price
                ? formatMarketPrice(
                    price.amount,
                    price.currencyCode,
                    DEFAULT_MARKET.locale
                  )
                : null;
              const discountRate = product.sellingPlans[0]?.discountPercentage;
              const isCurrentlyAdding = addingSlug === product.slug;

              return (
                <div
                  key={product.slug}
                  className="rounded-card border border-border bg-bg-elevated p-5 flex flex-col justify-between shadow-card hover:border-border/80 transition-colors"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">
                      {product.format || "Capsules"}
                    </span>
                    <h4 className="text-lg font-bold font-archivo text-fg mt-1">
                      <Link
                        href={`/human/products/${product.slug}`}
                        className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                      >
                        {product.name}
                      </Link>
                    </h4>
                    <p className="text-xs text-product-amber font-semibold mt-0.5">
                      {product.technicalName}
                    </p>

                    <div className="text-xs text-fg-muted mt-3 line-clamp-2">
                      {product.claims[0] ? (
                        <Claim showDisclaimer>{product.claims[0].text}</Claim>
                      ) : (
                        product.benefits[0] || "Supports cellular routine"
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-fg-muted mt-3">
                      <span className="text-accent">✓</span>
                      <span>first lots publishing soon</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/40 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      {formattedPrice && (
                        <span className="text-base font-bold text-fg">
                          {formattedPrice}
                        </span>
                      )}
                      {discountRate !== undefined && (
                        <span className="text-[11px] text-fg-muted font-medium">
                          Subscribe &amp; save {discountRate}%
                        </span>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      isLoading={isCurrentlyAdding}
                      loadingText="Adding..."
                      onClick={() => handleAddProduct(product)}
                      className="w-full text-xs font-bold"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
