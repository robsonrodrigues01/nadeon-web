"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { Claim } from "@/components/commerce/product-card/claim";
import { Button } from "@/components/ui/button";
import { formatMoney } from "./money";

export interface ShopCollectionProps {
  products: Product[];
  locale?: string;
}

const PRODUCT_GOALS: Record<string, string[]> = {
  biohack: ["Energy", "Healthy aging"],
  "full-charge": ["Energy", "Healthy aging", "Daily vitamins"],
  renew: ["Healthy aging"],
  glow: ["Beauty"],
  prime: ["Energy"],
  powerhouse: ["Energy"],
  daylight: ["Daily vitamins"],
};

export function ShopCollection({
  products,
  locale = "en-US",
}: ShopCollectionProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("All");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("best-selling");
  const [addingSlug, setAddingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Compute format counts dynamically from products
  const counts = useMemo(() => {
    return {
      all: products.length,
      capsules: products.filter((p) => p.format.toLowerCase() === "capsules")
        .length,
      powders: products.filter((p) => p.format.toLowerCase() === "powders")
        .length,
      tinctures: products.filter((p) => p.format.toLowerCase() === "tinctures")
        .length,
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by format
    if (selectedFormat !== "All") {
      list = list.filter(
        (p) => p.format.toLowerCase() === selectedFormat.toLowerCase()
      );
    }

    // Filter by goal
    if (selectedGoal) {
      list = list.filter((p) => {
        const goals = PRODUCT_GOALS[p.slug] || [];
        return goals.includes(selectedGoal);
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      list.sort(
        (a, b) =>
          (a.variants[0]?.price.amount ?? 0) -
          (b.variants[0]?.price.amount ?? 0)
      );
    } else if (sortBy === "price-desc") {
      list.sort(
        (a, b) =>
          (b.variants[0]?.price.amount ?? 0) -
          (a.variants[0]?.price.amount ?? 0)
      );
    }

    return list;
  }, [products, selectedFormat, selectedGoal, sortBy]);

  const handleAddToCart = async (product: Product) => {
    const primaryVariant = product.variants[0];
    if (!primaryVariant) return;

    setAddingSlug(product.slug);
    setFeedback(null);
    try {
      await cartProvider.addLines([
        {
          variantId: primaryVariant.id,
          quantity: 1,
        },
      ]);
      setFeedback(`Added ${product.name} to cart`);
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback(`Failed to add ${product.name} to cart`);
    } finally {
      setAddingSlug(null);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setSelectedGoal((current) => (current === goal ? null : goal));
  };

  return (
    <div className="bg-bg text-fg">
      {/* Filters & Sorting Bar */}
      <section
        aria-label="Filter and sort products"
        className="bg-bg-elevated/60 border-b border-border/40 py-5 px-5 sm:px-8 lg:px-18"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            {/* Format filters */}
            <div
              role="group"
              aria-label="Format filter"
              className="flex items-center gap-2 sm:gap-3 flex-wrap"
            >
              <span className="text-xs font-bold tracking-wider uppercase opacity-60 mr-1 select-none">
                FORMAT
              </span>
              <button
                type="button"
                onClick={() => setSelectedFormat("All")}
                aria-pressed={selectedFormat === "All"}
                className={`min-h-[44px] px-4 py-2 rounded-full font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  selectedFormat === "All"
                    ? "bg-gradient-gold text-accent-fg shadow-xs"
                    : "border border-border/60 text-fg hover:border-border hover:bg-border/20"
                }`}
              >
                All <span className="opacity-60 font-medium">{counts.all}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat("Capsules")}
                aria-pressed={selectedFormat === "Capsules"}
                className={`min-h-[44px] px-4 py-2 rounded-full font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  selectedFormat === "Capsules"
                    ? "bg-gradient-gold text-accent-fg shadow-xs"
                    : "border border-border/60 text-fg hover:border-border hover:bg-border/20"
                }`}
              >
                Capsules{" "}
                <span className="opacity-60 font-medium">
                  {counts.capsules}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat("Powders")}
                aria-pressed={selectedFormat === "Powders"}
                className={`min-h-[44px] px-4 py-2 rounded-full font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  selectedFormat === "Powders"
                    ? "bg-gradient-gold text-accent-fg shadow-xs"
                    : "border border-border/60 text-fg hover:border-border hover:bg-border/20"
                }`}
              >
                Powders{" "}
                <span className="opacity-60 font-medium">{counts.powders}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat("Tinctures")}
                aria-pressed={selectedFormat === "Tinctures"}
                className={`min-h-[44px] px-4 py-2 rounded-full font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  selectedFormat === "Tinctures"
                    ? "bg-gradient-gold text-accent-fg shadow-xs"
                    : "border border-border/60 text-fg hover:border-border hover:bg-border/20"
                }`}
              >
                Tinctures{" "}
                <span className="opacity-60 font-medium">
                  {counts.tinctures}
                </span>
              </button>
            </div>

            {/* Goal filters */}
            <div
              role="group"
              aria-label="Goal filter"
              className="flex items-center gap-2 sm:gap-3 flex-wrap"
            >
              <span className="text-xs font-bold tracking-wider uppercase opacity-60 mr-1 select-none">
                GOAL
              </span>
              {["Energy", "Healthy aging", "Beauty", "Daily vitamins"].map(
                (goal) => {
                  const isActive = selectedGoal === goal;
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      aria-pressed={isActive}
                      className={`min-h-[44px] px-4 py-2 rounded-full font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        isActive
                          ? "bg-gradient-gold text-accent-fg shadow-xs"
                          : "border border-border/60 text-fg hover:border-border hover:bg-border/20"
                      }`}
                    >
                      {goal}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Counts and Sorting */}
          <div className="flex items-center justify-between lg:justify-end gap-5 pt-2 lg:pt-0">
            <span className="text-sm opacity-75 font-medium whitespace-nowrap">
              {filteredProducts.length} products
            </span>

            <div className="relative inline-flex items-center">
              <label htmlFor="shop-sort-select" className="sr-only">
                Sort: Best sellers
              </label>
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-h-[44px] appearance-none rounded-xl border border-border/60 bg-bg-elevated px-4 py-2.5 pr-8 text-sm font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
              >
                <option value="best-selling">Sort: Best sellers</option>
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 text-xs opacity-70"
              >
                ▼
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Screen reader live feedback for cart additions */}
      <div role="status" aria-live="polite" className="sr-only">
        {feedback}
      </div>

      {/* Product Grid */}
      <section
        aria-label="Product list"
        className="py-12 lg:py-16 px-5 sm:px-8 lg:px-18"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const primaryVariant = product.variants[0];
            const price = primaryVariant?.price ?? {
              amount: 0,
              currencyCode: "USD",
            };
            const formattedPrice = formatMoney(price, locale);
            const isAdding = addingSlug === product.slug;
            const primaryClaim = product.claims.find((c) => c.isClaim);
            const claimText = primaryClaim
              ? primaryClaim.text
              : product.benefits[0] || "";

            return (
              <article
                key={product.slug}
                aria-labelledby={`product-heading-${product.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-card border border-border/60 bg-bg-elevated text-fg shadow-card transition-all hover:border-accent/40"
              >
                <div>
                  {/* Visual image / render container */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-bg/80 flex items-center justify-center p-6">
                    <Link
                      href={`/human/products/${product.slug}`}
                      className="relative flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      aria-label={`View ${product.name} details`}
                    >
                      <Image
                        src={product.images[0] || "/renders/placeholder.svg"}
                        alt={`${product.name} - ${product.technicalName}`}
                        fill
                        sizes="(min-width: 1280px) 272px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain"
                      />
                    </Link>

                    {/* Format badge */}
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-bg-elevated/90 px-3 py-1 text-xs font-bold text-fg border border-border/40 select-none">
                      {product.format}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2
                      id={`product-heading-${product.slug}`}
                      className="title text-xl font-extrabold uppercase tracking-tight text-fg"
                    >
                      <Link
                        href={`/human/products/${product.slug}`}
                        className="hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
                      >
                        {product.name}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm font-bold text-accent mt-1 line-clamp-1">
                      {product.technicalName}
                    </p>

                    {claimText && (
                      <div className="text-xs text-fg-muted mt-2 min-h-[36px] line-clamp-2">
                        <Claim showDisclaimer={false}>{claimText}</Claim>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-fg-muted">
                      <span
                        className="text-accent font-bold"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span className="opacity-75">Lab-tested every lot</span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-5 pt-0 mt-auto">
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
                    <span className="text-lg font-bold text-fg">
                      {formattedPrice}
                    </span>

                    <Button
                      type="button"
                      variant="primary"
                      size="default"
                      isLoading={isAdding}
                      loadingText="Adding..."
                      onClick={() => handleAddToCart(product)}
                      aria-label={`Add ${product.name} to cart for ${formattedPrice}`}
                      className="min-h-[44px] px-4 rounded-full font-bold text-xs sm:text-sm"
                    >
                      Add to cart
                    </Button>
                  </div>

                  <p className="text-xs font-bold text-accent mt-2">
                    Subscribe &amp; save 15%
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
