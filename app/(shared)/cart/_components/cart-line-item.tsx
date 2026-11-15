"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  cartProvider,
  type CartLineItem as CartLine,
} from "@/lib/providers/client";
import { useMarket } from "@/lib/market";
import type { CartCatalogProduct, RunCartAction } from "./types";

interface CartLineItemProps {
  line: CartLine;
  product?: CartCatalogProduct;
  pending: boolean;
  run: RunCartAction;
}

export function CartLineItem({
  line,
  product,
  pending,
  run,
}: CartLineItemProps) {
  const { formatMoney } = useMarket();
  const [isChanging, setIsChanging] = useState(false);
  const title = product
    ? `${product.name} ${product.technicalName}`
    : line.product.title;
  const plan = product?.sellingPlans.find((p) => p.id === line.sellingPlanId);
  const isSubscription = Boolean(line.sellingPlanId);
  const firstPlan = product?.sellingPlans[0];
  const listPrice = product?.variants.find(
    (v) => v.id === line.variantId
  )?.price;
  const showListPrice =
    listPrice !== undefined && listPrice.amount > line.price.amount;
  const optionsId = `plan-options-${line.id}`;

  return (
    <li className="flex gap-4 border-b border-border/40 py-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card border border-border/30 bg-bg-elevated">
        {line.product.image && (
          <Image
            src={line.product.image}
            alt={line.product.title}
            width={96}
            height={96}
            className="h-full w-full object-contain p-1"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
        <div className="min-w-0 flex-1">
          <h2 className="font-archivo text-base font-extrabold uppercase leading-tight text-fg sm:text-lg">
            {title}
          </h2>
          {product && (
            <p className="mt-0.5 text-xs text-fg-muted">
              {product.format} · {product.servingsPerJar} servings
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
            {isSubscription && product ? (
              <>
                {plan && (
                  <span className="rounded-pill border border-accent/20 bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                    Subscribe &amp; save {plan.discountPercentage}%
                  </span>
                )}
                {plan && (
                  <span>
                    <span aria-hidden="true">↻ </span>Delivered every{" "}
                    {plan.intervalDays} days
                  </span>
                )}
              </>
            ) : (
              <span className="rounded-pill bg-fg/10 px-2.5 py-0.5 text-[11px] font-bold text-fg">
                One-time purchase
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {product && isSubscription && (
              <button
                type="button"
                aria-expanded={isChanging}
                aria-controls={optionsId}
                onClick={() => setIsChanging((v) => !v)}
                className="inline-flex min-h-11 items-center rounded underline hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Change
              </button>
            )}
            {!isSubscription && firstPlan && (
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  run(() =>
                    cartProvider.setLineSellingPlan(line.id, firstPlan.id)
                  )
                }
                className="inline-flex min-h-11 items-center rounded text-fg underline hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
              >
                Switch to subscription, save {firstPlan.discountPercentage}%
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => cartProvider.removeLines([line.id]))}
              className="inline-flex min-h-11 items-center rounded underline hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          {isChanging && product && (
            <fieldset
              id={optionsId}
              className="mt-3 space-y-1 rounded-field border border-border/50 bg-bg-elevated p-3 text-sm"
            >
              <legend className="sr-only">Purchase option for {title}</legend>
              <label className="flex min-h-11 items-center gap-3">
                <input
                  type="radio"
                  name={`purchase-${line.id}`}
                  value=""
                  checked={!isSubscription}
                  disabled={pending}
                  onChange={() =>
                    run(() => cartProvider.setLineSellingPlan(line.id, null))
                  }
                  className="h-4 w-4 accent-accent"
                />
                One-time purchase
              </label>
              {product.sellingPlans.map((option) => (
                <label
                  key={option.id}
                  className="flex min-h-11 items-center gap-3"
                >
                  <input
                    type="radio"
                    name={`purchase-${line.id}`}
                    value={option.id}
                    checked={line.sellingPlanId === option.id}
                    disabled={pending}
                    onChange={() =>
                      run(() =>
                        cartProvider.setLineSellingPlan(line.id, option.id)
                      )
                    }
                    className="h-4 w-4 accent-accent"
                  />
                  {option.name}
                </label>
              ))}
            </fieldset>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:w-auto sm:flex-col sm:items-end sm:gap-2">
          <div className="text-right">
            {showListPrice && (
              <div className="text-xs text-fg-muted line-through">
                {formatMoney(listPrice)}
              </div>
            )}
            <div className="text-sm font-bold text-fg">
              {formatMoney(line.price)}
            </div>
          </div>

          <div className="inline-flex items-center rounded-pill border border-border">
            <button
              type="button"
              aria-label={`Decrease quantity of ${title}`}
              disabled={pending || line.quantity <= 1}
              onClick={() =>
                run(() =>
                  cartProvider.updateLines([
                    { id: line.id, quantity: line.quantity - 1 },
                  ])
                )
              }
              className="h-11 w-11 rounded-pill text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40"
            >
              <span aria-hidden="true">−</span>
            </button>
            <output
              aria-label={`Quantity of ${title}`}
              className="min-w-8 text-center text-sm font-bold"
            >
              {line.quantity}
            </output>
            <button
              type="button"
              aria-label={`Increase quantity of ${title}`}
              disabled={pending}
              onClick={() =>
                run(() =>
                  cartProvider.updateLines([
                    { id: line.id, quantity: line.quantity + 1 },
                  ])
                )
              }
              className="h-11 w-11 rounded-pill text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>

          <div className="text-sm font-bold text-fg">
            {formatMoney(line.total)}
          </div>
        </div>
      </div>
    </li>
  );
}
