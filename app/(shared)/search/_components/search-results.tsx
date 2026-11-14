import React from "react";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import type { Market } from "@/lib/market/types";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { SearchResultItem } from "./search-result-item";

export interface SearchResultsProps {
  query: string;
  matches: Product[];
  activeFormat: string;
  market: Market;
}

function searchHref(query: string, format?: string): string {
  const params = new URLSearchParams({ q: query });
  if (format) params.set("format", format);
  return `/search?${params.toString()}`;
}

export function SearchResults({
  query,
  matches,
  activeFormat,
  market,
}: SearchResultsProps) {
  const formats = Array.from(new Set(matches.map((p) => p.format)));
  const visible = activeFormat
    ? matches.filter((p) => p.format.toLowerCase() === activeFormat)
    : matches;

  return (
    <section
      aria-labelledby="search-results-heading"
      className="px-5 py-8 sm:px-8 lg:px-18"
    >
      <h2
        id="search-results-heading"
        className="title text-2xl font-extrabold text-fg"
      >
        {visible.length} results for “{query}”
      </h2>

      <nav aria-label="Filter by format" className="mt-4">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={searchHref(query)}
              aria-current={activeFormat ? undefined : "page"}
              className="inline-flex min-h-11 items-center rounded-pill border border-border px-4 text-sm font-bold text-fg aria-[current=page]:bg-accent aria-[current=page]:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              All ({matches.length})
            </Link>
          </li>
          {formats.map((format) => {
            const count = matches.filter((p) => p.format === format).length;
            const isActive = activeFormat === format.toLowerCase();
            return (
              <li key={format}>
                <Link
                  href={searchHref(query, format.toLowerCase())}
                  aria-current={isActive ? "page" : undefined}
                  className="inline-flex min-h-11 items-center rounded-pill border border-border px-4 text-sm font-bold text-fg aria-[current=page]:bg-accent aria-[current=page]:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {format} ({count})
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-fg-muted">
        Products
      </h3>
      {visible.length > 0 ? (
        <ul className="mt-2">
          {visible.map((product) => (
            <li key={product.slug}>
              <SearchResultItem
                product={product}
                priceLabel={
                  product.variants[0]
                    ? formatMoneyWithMarket(product.variants[0].price, market)
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
