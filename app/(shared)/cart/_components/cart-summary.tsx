"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { cartProvider, type Cart } from "@/lib/providers/client";
import { useMarket } from "@/lib/market";
import type { CartCatalogProduct, RunCartAction } from "./types";
import { redirectToCheckout } from "./checkout";

interface CartSummaryProps {
  cart: Cart;
  catalog: Map<string, CartCatalogProduct>;
  pending: boolean;
  run: RunCartAction;
}

export function CartSummary({ cart, catalog, pending, run }: CartSummaryProps) {
  const { formatMoney } = useMarket();
  const [code, setCode] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);
  const currencyCode = cart.totalPrice.currencyCode;

  // Subtotal pelo preço de lista; a economia de assinatura é a diferença para o preço da linha.
  let listSubtotal = 0;
  let subscriptionSavings = 0;
  for (const line of cart.lines) {
    const product = catalog.get(line.product.handle);
    const listUnit =
      product?.variants.find((v) => v.id === line.variantId)?.price.amount ??
      line.price.amount;
    listSubtotal += listUnit * line.quantity;
    if (line.sellingPlanId) {
      subscriptionSavings += (listUnit - line.price.amount) * line.quantity;
    }
  }
  const subtotalMoney = {
    amount: Number(listSubtotal.toFixed(2)),
    currencyCode,
  };
  const savingsMoney = {
    amount: Number(subscriptionSavings.toFixed(2)),
    currencyCode,
  };
  const hasSubscription = cart.lines.some((line) => line.sellingPlanId);
  const appliedCodes = cart.discountCodes.filter((d) => d.applicable);

  const handleApply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed || pending) return;
    run(() => cartProvider.applyDiscount(trimmed));
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    setCheckoutError(false);
    try {
      redirectToCheckout(await cartProvider.checkoutUrl());
    } catch {
      setCheckoutError(true);
      setCheckingOut(false);
    }
  };

  return (
    <section
      aria-labelledby="order-summary-heading"
      className="rounded-card border border-border bg-bg-elevated p-5 sm:p-6"
    >
      <h2
        id="order-summary-heading"
        className="font-archivo text-lg font-extrabold uppercase text-fg"
      >
        Order summary
      </h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt>
            Subtotal ({cart.totalQuantity}{" "}
            {cart.totalQuantity === 1 ? "item" : "items"})
          </dt>
          <dd className="font-bold">{formatMoney(subtotalMoney)}</dd>
        </div>
        {subscriptionSavings > 0 && (
          <div className="flex justify-between gap-4 text-accent">
            <dt>Subscription savings</dt>
            <dd className="font-bold">−{formatMoney(savingsMoney)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>Shipping</dt>
          <dd>Calculated at checkout</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Estimated tax</dt>
          <dd>Calculated at checkout</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border/50 pt-3 text-base">
          <dt className="font-bold">Total</dt>
          <dd className="font-extrabold">{formatMoney(cart.totalPrice)}</dd>
        </div>
      </dl>

      <form onSubmit={handleApply} className="mt-5">
        <label htmlFor="promo-code" className="block text-sm font-bold text-fg">
          Promo code
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="promo-code"
            name="promo-code"
            type="text"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="min-h-11 min-w-0 flex-1 rounded-field border border-border bg-bg px-3 text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 rounded-pill border border-border px-4 text-sm font-bold text-fg hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
          >
            Apply
          </button>
        </div>
        {appliedCodes.length > 0 && (
          <ul
            className="mt-2 flex flex-wrap gap-2 text-xs"
            aria-label="Applied codes"
          >
            {appliedCodes.map((d) => (
              <li
                key={d.code}
                className="rounded-pill bg-fg/10 px-2.5 py-1 font-bold"
              >
                {d.code}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-fg-muted">
          One code per order. Kit and Subscribe &amp; Save prices already
          include their discount.
        </p>
      </form>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={pending || checkingOut}
          className="min-h-11 w-full rounded-pill bg-gradient-gold px-6 py-3 text-sm font-bold text-accent-fg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
        >
          Checkout securely
        </button>
        {checkoutError && (
          <p
            role="alert"
            className="mt-3 text-center text-sm font-bold text-fg"
          >
            Could not update your cart. Try again.
          </p>
        )}
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-fg-muted">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Secure checkout · Skip or cancel subscriptions anytime
        </p>
        <p className="mt-2 text-center text-xs text-fg-muted">
          Taxes and shipping calculated at checkout
        </p>
        {hasSubscription && (
          <p className="mt-2 text-center text-xs text-fg-muted">
            Subscription price applies to every delivery while subscribed.
          </p>
        )}
      </div>
    </section>
  );
}
