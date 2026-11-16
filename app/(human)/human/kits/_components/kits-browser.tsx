"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";
import { KitAddToCart } from "./kit-add-to-cart";
import { KitPrice } from "./kit-price";
import type { KitView } from "./kit-view";
import type { Market } from "@/lib/market/types";

type Filter = "all" | "duo" | "trio";

const FILTERS: Array<{
  id: Filter;
  label: string;
  matches: (k: KitView) => boolean;
}> = [
  { id: "all", label: "All kits", matches: () => true },
  { id: "duo", label: "Duos", matches: (k) => k.itemCount === 2 },
  { id: "trio", label: "Trios", matches: (k) => k.itemCount === 3 },
];

export interface KitsBrowserProps {
  market: Market;
  kits: KitView[];
}

export function KitsBrowser({ kits, market }: KitsBrowserProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  const visible = kits.filter(active.matches);

  return (
    <section aria-label="Kits" className="flex flex-col gap-8">
      <div
        role="group"
        aria-label="Filter kits"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`min-h-11 rounded-pill border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              filter === f.id
                ? "border-accent bg-accent text-accent-fg"
                : "border-border text-fg hover:border-accent"
            }`}
          >
            {f.label} {kits.filter(f.matches).length}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((kit, index) => (
          <li key={kit.slug}>
            <article
              aria-labelledby={`kit-${kit.slug}`}
              className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-bg-elevated shadow-card"
            >
              {kit.image && (
                <div className="relative aspect-[4/3] bg-bg">
                  <Image
                    src={kit.image}
                    alt={kit.name}
                    width={640}
                    height={480}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wider text-fg-muted">
                    {kit.itemsLabel}
                  </p>
                  <div className="flex gap-2">
                    {kit.isBestValue && (
                      <span className="shrink-0 rounded-pill bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent-fg">
                        BEST VALUE
                      </span>
                    )}
                    {kit.savingsPercent > 0 && (
                      <span className="shrink-0 rounded-pill border border-accent px-2 py-0.5 text-xs font-bold text-accent">
                        SAVE {kit.savingsPercent}%
                      </span>
                    )}
                  </div>
                </div>
                <h2
                  id={`kit-${kit.slug}`}
                  className="text-xl font-bold text-fg"
                >
                  {kit.name}
                </h2>
                <p className="text-sm text-fg">
                  <Claim>{kit.description}</Claim>
                </p>
                <KitPrice
                  market={market}
                  price={kit.price}
                  compareAtPrice={kit.compareAtPrice}
                  savings={kit.savings}
                />
                <div className="mt-auto flex flex-col gap-2 pt-2">
                  <KitAddToCart
                    kitName={kit.name}
                    kitSlug={kit.slug}
                    disabled={!kit.canAddToCart}
                  />
                  <Button
                    variant="secondary"
                    href={`/human/kits/${kit.slug}`}
                    className="w-full"
                  >
                    View details
                  </Button>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
