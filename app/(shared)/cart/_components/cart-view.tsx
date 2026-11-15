"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cartProvider, type Cart } from "@/lib/providers/client";
import { CartEmpty } from "./cart-empty";
import { CartLineItem } from "./cart-line-item";
import { CartSummary } from "./cart-summary";
import { FrequentlyBought } from "./frequently-bought";
import { useMarket, formatFreeShippingLabel } from "@/lib/market";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import type { CartCatalogProduct, RunCartAction } from "./types";

// Produtos da seção "Frequently bought together" do design (slugs do catálogo).
const PAIRS_WITH_CART = ["prime", "full-charge", "daylight"];

export function CartView({
  catalog,
  petBestSellers = [],
}: {
  catalog: CartCatalogProduct[];
  petBestSellers?: CartCatalogProduct[];
}) {
  const { market } = useMarket();
  // undefined = carregando; null = sem carrinho.
  const [cart, setCart] = useState<Cart | null | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    cartProvider
      .get()
      .then((c) => active && setCart(c))
      .catch(() => active && setCart(null));
    return () => {
      active = false;
    };
  }, []);

  const run: RunCartAction = async (action) => {
    setPending(true);
    setError(false);
    try {
      setCart(await action());
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  const productByHandle = new Map(catalog.map((p) => [p.handle, p]));
  const lines = cart?.lines ?? [];
  const isEmpty = cart !== undefined && (cart === null || lines.length === 0);

  if (isEmpty) {
    return (
      <CartEmpty
        catalog={petBestSellers}
        pending={pending}
        error={error}
        onAddToCart={(product) =>
          run(() =>
            cartProvider.addLines([
              { variantId: product.variants[0].id, quantity: 1 },
            ])
          )
        }
      />
    );
  }

  const pairs = PAIRS_WITH_CART.map((slug) =>
    catalog.find((p) => p.slug === slug)
  ).filter((p): p is CartCatalogProduct => Boolean(p));

  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      aria-busy={cart === undefined}
    >
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-fg-muted">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/"
              className="underline hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            Cart
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg">
          Your cart
        </h1>
        <Link
          href="/human/shop"
          className="inline-flex min-h-11 items-center text-sm font-bold underline hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          <span aria-hidden="true">← </span>Continue shopping
        </Link>
      </div>

      {cart && (
        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <div>
            {market.freeShipping?.pet != null &&
              formatFreeShippingLabel(market, "pet") && (
                <div className="pb-6">
                  <p className="mb-2 text-sm text-fg">
                    {cart.subtotalPrice.amount >= market.freeShipping.pet ? (
                      <span>
                        You unlocked <strong>free shipping</strong> ✓
                      </span>
                    ) : (
                      <span>
                        Add{" "}
                        <strong>
                          {formatMoneyWithMarket(
                            {
                              amount:
                                market.freeShipping.pet -
                                cart.subtotalPrice.amount,
                              currencyCode: market.currency.code,
                            },
                            market
                          )}
                        </strong>{" "}
                        more to unlock free shipping
                      </span>
                    )}
                  </p>
                  <div
                    role="progressbar"
                    aria-label="Free shipping progress"
                    aria-valuenow={Math.min(
                      cart.subtotalPrice.amount,
                      market.freeShipping.pet
                    )}
                    aria-valuemin={0}
                    aria-valuemax={market.freeShipping.pet}
                    className="relative h-2 overflow-hidden rounded-full bg-fg/15"
                  >
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((cart.subtotalPrice.amount / market.freeShipping.pet) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1.5 text-right text-[11px] text-fg-muted">
                    {formatFreeShippingLabel(market, "pet")}
                  </p>
                </div>
              )}
            <ul aria-label="Items in your cart">
              {lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  product={productByHandle.get(line.product.handle)}
                  pending={pending}
                  run={run}
                />
              ))}
            </ul>

            {error && (
              <p role="alert" className="mt-4 text-sm font-bold text-fg">
                Could not update your cart. Try again.
              </p>
            )}

            {pairs.length > 0 && (
              <FrequentlyBought products={pairs} pending={pending} run={run} />
            )}
          </div>

          <div className="mt-8 lg:mt-0">
            <CartSummary
              cart={cart}
              catalog={productByHandle}
              pending={pending}
              run={run}
            />
          </div>
        </div>
      )}
    </div>
  );
}
