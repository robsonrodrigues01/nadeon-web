"use client";

import React from "react";
import { CartDrawerItem } from "@/components/commerce/cart-drawer/cart-drawer-item";
import { cartProvider, type CartLineItem } from "@/lib/providers/client";

// Linhas de kit com o preço do kit (catálogo: Energy Duo $105, Chew + Oil $75).
const humanKitLine: CartLineItem = {
  id: "line_energy_duo",
  variantId: "kit:energy-duo",
  quantity: 1,
  sellingPlanId: null,
  product: {
    id: "energy-duo",
    title: "Energy Duo",
    handle: "energy-duo",
    line: "human",
  },
  kit: {
    slug: "energy-duo",
    name: "Energy Duo",
    items: [
      { title: "BioHack", quantity: 1 },
      { title: "Renew", quantity: 1 },
    ],
  },
  price: { amount: 105, currencyCode: "USD" },
  total: { amount: 105, currencyCode: "USD" },
};

const petKitLine: CartLineItem = {
  id: "line_chew_oil",
  variantId: "kit:chew-oil",
  quantity: 1,
  sellingPlanId: "plan_more_good_years_30d",
  sellingPlanTitle: "Delivery every 30 days (15% off)",
  product: {
    id: "chew-oil",
    title: "Chew + Oil",
    handle: "chew-oil",
    line: "pet",
  },
  kit: {
    slug: "chew-oil",
    name: "Chew + Oil",
    items: [
      { title: "More Good Years", quantity: 1 },
      { title: "More Good Years Oil", quantity: 1 },
    ],
  },
  price: { amount: 63.75, currencyCode: "USD" },
  total: { amount: 63.75, currencyCode: "USD" },
};

export default function W124Section() {
  return (
    <section
      aria-labelledby="section-w1-24-title"
      className="mb-16 border-t border-border pt-10"
    >
      <div className="mb-6">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Task W1-24 · Cart kit line
        </span>
        <h2
          id="section-w1-24-title"
          className="title text-2xl sm:text-3xl font-black uppercase text-fg"
        >
          Kit line in cart drawer (Human &amp; Pet)
        </h2>
        <p className="lead text-fg-muted text-sm sm:text-base mt-1 max-w-3xl">
          Kit lines charge the kit price, list the included items, and keep
          quantity and remove controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          data-theme="human"
          className="rounded-card border border-border overflow-hidden bg-bg-elevated p-6 shadow-card"
        >
          <span className="label inline-block text-xs uppercase px-2.5 py-1 rounded-full bg-border text-fg font-bold mb-4">
            Variant: Human
          </span>
          <ul
            aria-label="Human kit cart lines"
            className="divide-y divide-border/20"
          >
            <li>
              <CartDrawerItem
                item={humanKitLine}
                cartProvider={cartProvider}
                theme="human"
              />
            </li>
          </ul>
        </div>

        <div
          data-theme="pet"
          className="rounded-card border border-border overflow-hidden bg-bg-elevated p-6 shadow-card"
        >
          <span className="label inline-block text-xs uppercase px-2.5 py-1 rounded-full bg-border text-fg font-bold mb-4">
            Variant: Pet
          </span>
          <ul
            aria-label="Pet kit cart lines"
            className="divide-y divide-border/20"
          >
            <li>
              <CartDrawerItem
                item={petKitLine}
                cartProvider={cartProvider}
                theme="pet"
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
