"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import { ProductCard } from "@/components/commerce/product-card";
import { PawIcon } from "./hero";

export type NeedFilter =
  "All" | "Longevity" | "Joints" | "Calm" | "Skin & coat";
export type FormatFilter = "All" | "Chews" | "Treats" | "Oils" | "Powder";
export type SortOption =
  "best-selling" | "featured" | "price-asc" | "price-desc" | "title-asc";

const NEEDS: readonly NeedFilter[] = [
  "Longevity",
  "Joints",
  "Calm",
  "Skin & coat",
] as const;

const FORMATS: readonly { label: FormatFilter; key: FormatFilter }[] = [
  { label: "All", key: "All" },
  { label: "Chews", key: "Chews" },
  { label: "Treats", key: "Treats" },
  { label: "Oils", key: "Oils" },
  { label: "Powder", key: "Powder" },
] as const;

export function getProductNeed(product: Product): NeedFilter {
  const combined =
    `${product.name} ${product.technicalName} ${product.benefits.join(" ")}`.toLowerCase();
  if (
    combined.includes("joint") ||
    combined.includes("hip") ||
    combined.includes("mobility")
  ) {
    return "Joints";
  }
  if (
    combined.includes("calm") ||
    combined.includes("sharp") ||
    combined.includes("behavior")
  ) {
    return "Calm";
  }
  if (
    combined.includes("skin") ||
    combined.includes("coat") ||
    combined.includes("shine")
  ) {
    return "Skin & coat";
  }
  return "Longevity";
}

export function matchesFormat(product: Product, format: FormatFilter): boolean {
  if (format === "All") return true;
  const f = product.format.toLowerCase();
  if (format === "Chews") return f.includes("chew");
  if (format === "Treats") return f.includes("treat");
  if (format === "Oils") return f.includes("oil");
  if (format === "Powder") return f.includes("powder");
  return true;
}

export interface DogProductsSectionProps {
  initialProducts: Product[];
}

export function DogProductsSection({
  initialProducts,
}: DogProductsSectionProps) {
  const [selectedNeed, setSelectedNeed] = useState<NeedFilter>("All");
  const [selectedFormat, setSelectedFormat] = useState<FormatFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("best-selling");

  // Calculate counts for each format filter based on initial products
  const formatCounts = useMemo(() => {
    const counts: Record<FormatFilter, number> = {
      All: initialProducts.length,
      Chews: 0,
      Treats: 0,
      Oils: 0,
      Powder: 0,
    };
    for (const p of initialProducts) {
      if (matchesFormat(p, "Chews")) counts.Chews++;
      if (matchesFormat(p, "Treats")) counts.Treats++;
      if (matchesFormat(p, "Oils")) counts.Oils++;
      if (matchesFormat(p, "Powder")) counts.Powder++;
    }
    return counts;
  }, [initialProducts]);

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let result = initialProducts.filter((product) => {
      const matchN =
        selectedNeed === "All" || getProductNeed(product) === selectedNeed;
      const matchF = matchesFormat(product, selectedFormat);
      return matchN && matchF;
    });

    if (sortOption === "price-asc") {
      result = [...result].sort(
        (a, b) =>
          (a.variants[0]?.price.amount ?? 0) -
          (b.variants[0]?.price.amount ?? 0)
      );
    } else if (sortOption === "price-desc") {
      result = [...result].sort(
        (a, b) =>
          (b.variants[0]?.price.amount ?? 0) -
          (a.variants[0]?.price.amount ?? 0)
      );
    } else if (sortOption === "title-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    // "best-selling" and "featured" preserve curated default catalog sequence

    return result;
  }, [initialProducts, selectedNeed, selectedFormat, sortOption]);

  const toggleNeed = (need: NeedFilter) => {
    setSelectedNeed((prev) => (prev === need ? "All" : need));
  };

  return (
    <section aria-label="Dog Products" className="bg-bg border-b border-border">
      {/* Filter and sorting toolbar */}
      <div className="bg-bg/90 border-b border-border/60 px-6 py-5 sm:px-12 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4">
            {/* NEED Filter Group */}
            <div
              role="group"
              aria-label="Filter by need"
              className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
            >
              <span className="label mr-2 text-xs font-bold text-fg-muted tracking-wider uppercase select-none">
                NEED
              </span>
              {NEEDS.map((need) => {
                const isActive = selectedNeed === need;
                return (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center rounded-pill px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive
                        ? "bg-fg text-bg shadow-xs"
                        : "bg-bg-elevated text-fg border border-border hover:border-fg/40"
                    }`}
                  >
                    {need}
                  </button>
                );
              })}
            </div>

            {/* FORMAT Filter Group */}
            <div
              role="group"
              aria-label="Filter by format"
              className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
            >
              <span className="label mr-2 text-xs font-bold text-fg-muted tracking-wider uppercase select-none">
                FORMAT
              </span>
              {FORMATS.map(({ label, key }) => {
                const isActive = selectedFormat === key;
                const count = formatCounts[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFormat(key)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive
                        ? "bg-fg text-bg shadow-xs"
                        : "bg-bg-elevated text-fg border border-border hover:border-fg/40"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-xs ${
                        isActive ? "text-bg/80 font-medium" : "text-fg-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Toolbar: Product count + Sort selector */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
            <span className="text-sm font-medium text-fg-muted whitespace-nowrap">
              {displayedProducts.length} products for dogs
            </span>

            <div className="relative">
              <label htmlFor="dog-sort-select" className="sr-only">
                Sort products
              </label>
              <select
                id="dog-sort-select"
                aria-label="Sort products"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="cursor-pointer appearance-none rounded-card border border-border bg-bg-elevated py-2.5 pl-4 pr-10 text-xs sm:text-sm font-bold text-fg shadow-xs transition-colors hover:border-fg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="best-selling">Sort: Best sellers</option>
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Sort: Price: Low to High</option>
                <option value="price-desc">Sort: Price: High to Low</option>
                <option value="title-asc">Sort: Name: A to Z</option>
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-fg-muted select-none"
              >
                ▼
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                headingLevel={2}
              />
            ))}

            {/* Promo Card: Which one for my dog? */}
            <div className="flex flex-col justify-between rounded-card bg-fg p-6 sm:p-7 text-bg shadow-card">
              <div>
                <PawIcon className="h-10 w-10 text-product-amber" />
                <h2 className="title mt-4 text-2xl font-extrabold uppercase leading-tight text-bg">
                  Which one for my dog?
                </h2>
                <p className="body mt-2 text-sm text-bg/80 leading-relaxed">
                  Age, size and needs. Five questions, one routine.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/pet/quiz"
                  className="inline-flex items-center justify-center rounded-pill bg-bg px-5 py-2.5 text-sm font-extrabold text-fg transition-all hover:bg-bg/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Take the quiz
                </Link>
              </div>
            </div>

            {/* Promo Card: Chew + oil bundles */}
            <div className="flex flex-col justify-center gap-3 rounded-card border-2 border-dashed border-fg/30 p-6 sm:p-7 bg-bg/40">
              <h2 className="title text-2xl font-extrabold uppercase leading-tight text-fg">
                Chew + oil bundles
              </h2>
              <p className="body text-sm text-fg/80 leading-relaxed">
                Pair a daily chew with the matching oil and save 15%.
              </p>
              <div className="mt-2">
                <Link
                  href="#bundles"
                  className="inline-flex items-center justify-center rounded-pill border-2 border-fg px-5 py-2 text-sm font-extrabold text-fg transition-all hover:bg-fg hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  See bundles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
