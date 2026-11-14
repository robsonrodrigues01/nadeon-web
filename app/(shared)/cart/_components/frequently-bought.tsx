"use client";

import React from "react";
import Image from "next/image";
import { cartProvider } from "@/lib/providers/client";
import { formatPrice } from "./money";
import type { CartCatalogProduct, RunCartAction } from "./types";

interface FrequentlyBoughtProps {
  products: CartCatalogProduct[];
  pending: boolean;
  run: RunCartAction;
}

export function FrequentlyBought({
  products,
  pending,
  run,
}: FrequentlyBoughtProps) {
  const currency = products[0].variants[0]?.price.currencyCode ?? "USD";
  const total = products.reduce(
    (sum, p) => sum + (p.variants[0]?.price.amount ?? 0),
    0
  );
  const addAll = () =>
    run(() =>
      cartProvider.addLines(
        products.map((p) => ({ variantId: p.variants[0].id, quantity: 1 }))
      )
    );

  return (
    <section
      aria-labelledby="pairs-heading"
      className="mt-10 border-t border-border/40 pt-6"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        Pairs with your cart
      </p>
      <h2
        id="pairs-heading"
        className="font-archivo font-extrabold uppercase text-xl text-fg"
      >
        Frequently bought together
      </h2>

      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {products.map((product) => (
          <li
            key={product.slug}
            className="flex items-center gap-3 rounded-card border border-border bg-bg-elevated p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-card bg-bg">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain p-1"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-fg">{product.name}</h3>
              <p className="truncate text-xs text-fg-muted">
                {product.technicalName}
              </p>
              <p className="text-xs font-bold text-fg">
                {formatPrice(product.variants[0]?.price.amount ?? 0, currency)}
              </p>
            </div>
            <button
              type="button"
              disabled={pending}
              aria-label={`Add ${product.name} to cart`}
              onClick={() =>
                run(() =>
                  cartProvider.addLines([
                    { variantId: product.variants[0].id, quantity: 1 },
                  ])
                )
              }
              className="min-h-11 shrink-0 rounded-pill border border-border px-3 text-xs font-bold text-fg hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
            >
              <span aria-hidden="true">+ </span>Add
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-card bg-bg-elevated p-4">
        <p className="text-sm text-fg">
          Add all three to your routine{" "}
          <span className="text-fg-muted">
            {products.map((p) => p.name).join(" + ")} ·{" "}
            {formatPrice(total, currency)}
          </span>
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={addAll}
          className="min-h-11 rounded-pill bg-gradient-gold px-5 text-sm font-bold text-accent-fg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
        >
          Add all {products.length} to cart
        </button>
      </div>
    </section>
  );
}
