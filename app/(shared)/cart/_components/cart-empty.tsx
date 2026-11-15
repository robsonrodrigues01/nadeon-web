import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useMarket } from "@/lib/market";
import type { CartCatalogProduct } from "./types";

export function CartEmpty({
  catalog = [],
  pending = false,
  error = false,
  onAddToCart,
}: {
  catalog?: CartCatalogProduct[];
  pending?: boolean;
  error?: boolean;
  onAddToCart?: (product: CartCatalogProduct) => void;
}) {
  const { formatMoney } = useMarket();
  return (
    <>
      <section className="mx-auto flex w-full flex-col items-center px-4 py-12 text-center sm:py-20">
        <h1 className="font-archivo text-3xl font-extrabold uppercase text-fg sm:text-5xl">
          Your cart is empty
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base">
          Nothing in the bowl yet. Let&apos;s find something your best friend
          will love, or answer a few quick questions and we&apos;ll suggest a
          formula.
        </p>
        <nav
          aria-label="Shop pet categories"
          className="mt-6 flex flex-wrap justify-center gap-3"
        >
          {[
            ["Shop dogs", "/pet/dogs"],
            ["Shop cats", "/pet/cats"],
            ["Shop horses", "/pet/horses"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center rounded-pill border border-border px-5 font-bold text-fg hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/human/quiz"
            className="inline-flex min-h-11 items-center rounded-pill bg-gradient-gold px-6 font-bold text-accent-fg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Take the quiz
          </Link>
          <Link
            href="/pet/quiz"
            className="inline-flex min-h-11 items-center rounded-pill border border-border px-6 font-bold text-fg hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Take the pet quiz
          </Link>
        </nav>
      </section>
      <section
        aria-labelledby="best-sellers-heading"
        className="bg-bg-elevated px-4 py-12 sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            Pet favorites
          </p>
          <h2
            id="best-sellers-heading"
            className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
          >
            Best sellers
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {catalog.slice(0, 4).map((product) => (
              <li
                key={product.slug}
                className="overflow-hidden rounded-card border border-border bg-bg"
              >
                <Link
                  href={`/pet/products/${product.slug}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="relative aspect-square bg-bg-elevated">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-6"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-archivo text-lg font-extrabold text-fg">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-fg-muted">
                      {product.technicalName}
                    </p>
                    <p className="mt-3 font-bold text-fg">
                      {formatMoney(product.variants[0].price)}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onAddToCart?.(product)}
                    className="min-h-11 w-full rounded-pill bg-fg px-4 font-bold text-bg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Add to cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {error && (
            <p role="alert" className="mt-4 text-sm font-bold text-fg">
              Could not update your cart. Try again.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
