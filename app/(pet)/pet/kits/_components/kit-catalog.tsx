"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Claim } from "@/components/commerce/product-card/claim";
import type { KitView } from "./kit-format";

type KitFilter = "all" | "duos" | "trios";

const FILTERS: readonly { key: KitFilter; label: string }[] = [
  { key: "all", label: "All kits" },
  { key: "duos", label: "Duos" },
  { key: "trios", label: "Trios" },
];

function matchesFilter(kit: KitView, filter: KitFilter): boolean {
  if (filter === "duos") return kit.productCount === 2;
  if (filter === "trios") return kit.productCount === 3;
  return true;
}

export function KitCatalog({ kits }: { kits: KitView[] }) {
  const [filter, setFilter] = useState<KitFilter>("all");

  const visible = useMemo(
    () => kits.filter((kit) => matchesFilter(kit, filter)),
    [kits, filter]
  );

  return (
    <section aria-labelledby="kits-catalog-heading" className="w-full">
      <h2 id="kits-catalog-heading" className="sr-only">
        Kits
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter kits"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((item) => {
            const count = kits.filter((kit) =>
              matchesFilter(kit, item.key)
            ).length;
            const pressed = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilter(item.key)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-pill border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  pressed
                    ? "border-fg bg-fg text-bg"
                    : "border-border bg-bg-elevated text-fg hover:border-fg/40"
                }`}
              >
                {item.label}
                <span className="opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <span className="text-sm font-bold text-fg-muted">
          {visible.length} {visible.length === 1 ? "kit" : "kits"}
        </span>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {visible.map((kit) => (
          <li key={kit.slug}>
            <article
              aria-labelledby={`kit-${kit.slug}`}
              className="flex h-full flex-col justify-between gap-6 rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-3">
                  <ul className="flex flex-wrap items-center gap-2">
                    {kit.products.map((product, index) => (
                      <li
                        key={product.slug}
                        className="flex items-center gap-2"
                      >
                        {index > 0 && (
                          <span
                            aria-hidden="true"
                            className="font-bold text-fg-muted"
                          >
                            +
                          </span>
                        )}
                        <span className="rounded-field border border-border bg-bg p-3">
                          <span className="block text-sm font-extrabold text-fg">
                            {product.name}
                          </span>
                          <span className="block text-xs text-fg-muted">
                            {product.detail}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  {kit.badge && (
                    <span className="shrink-0 rounded-pill bg-accent px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent-fg">
                      {kit.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h2
                    id={`kit-${kit.slug}`}
                    className="font-archivo text-3xl font-extrabold uppercase leading-none tracking-tight text-fg"
                  >
                    {kit.name}
                  </h2>
                  <p className="text-sm font-bold text-fg-muted">
                    {kit.productNames}
                  </p>
                  <p className="text-base text-fg">
                    <Claim>{kit.description}</Claim>
                  </p>
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-fg">
                    {kit.price}
                  </span>
                  {kit.compareAtPrice && (
                    <s className="text-base text-fg-muted">
                      {kit.compareAtPrice}
                    </s>
                  )}
                  {kit.savings && (
                    <span className="text-sm font-bold text-accent">
                      You save {kit.savings}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 items-center justify-center rounded-pill bg-fg px-5 py-2.5 text-sm font-extrabold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add kit to cart
                </button>
                <Link
                  href={`/pet/kits/${kit.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-pill border border-border bg-bg px-5 py-2.5 text-sm font-extrabold text-fg transition-colors hover:border-fg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  View details
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
