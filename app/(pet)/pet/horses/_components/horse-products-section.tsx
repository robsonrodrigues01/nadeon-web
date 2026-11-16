"use client";

import React, { useId, useMemo, useState } from "react";
import { ProductCard } from "@/components/commerce/product-card";
import type { Product } from "@/lib/contracts/catalog";

export type HorseSort = "featured" | "price-asc" | "price-desc" | "title-asc";

export interface HorseProductsSectionProps {
  products: Product[];
}

const SORT_LABELS: Record<HorseSort, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "title-asc": "Name: A to Z",
};

const ALL = "all";

export function HorseProductsSection({ products }: HorseProductsSectionProps) {
  const sortId = useId();
  const [format, setFormat] = useState<string>(ALL);
  const [sort, setSort] = useState<HorseSort>("featured");

  // Formats come from the catalog data, never from fixed design labels.
  const formats = useMemo(
    () => Array.from(new Set(products.map((p) => p.format))),
    [products]
  );

  const visible = useMemo(() => {
    const filtered =
      format === ALL
        ? [...products]
        : products.filter((p) => p.format === format);
    const price = (p: Product) => p.variants[0]?.price.amount ?? 0;
    if (sort === "price-asc") filtered.sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") filtered.sort((a, b) => price(b) - price(a));
    if (sort === "title-asc")
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [products, format, sort]);

  const countLabel = `${visible.length} ${visible.length === 1 ? "product" : "products"} for horses`;

  return (
    <section
      aria-label="Horse formulas"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-8"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Format" className="flex flex-wrap gap-2">
          {[ALL, ...formats].map((value) => {
            const count =
              value === ALL
                ? products.length
                : products.filter((p) => p.format === value).length;
            const label = value === ALL ? "All" : value;
            const pressed = format === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFormat(value)}
                className={`min-h-11 rounded-pill border border-border px-4 text-sm font-bold ${
                  pressed ? "bg-fg text-bg" : "bg-bg-elevated text-fg"
                }`}
              >
                {label} {count}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor={sortId} className="text-sm font-bold text-fg">
            Sort
          </label>
          <select
            id={sortId}
            value={sort}
            onChange={(e) => setSort(e.target.value as HorseSort)}
            className="min-h-11 rounded-field border border-border bg-bg-elevated px-3 text-sm text-fg"
          >
            {(Object.keys(SORT_LABELS) as HorseSort[]).map((value) => (
              <option key={value} value={value}>
                {SORT_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-6 text-sm text-fg-muted">{countLabel}</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} headingLevel={2} />
        ))}
      </div>
    </section>
  );
}
