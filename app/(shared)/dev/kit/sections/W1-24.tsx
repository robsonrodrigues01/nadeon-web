"use client";

import React, { useEffect, useState } from "react";
import { CartDrawerItem } from "@/components/commerce/cart-drawer/cart-drawer-item";
import { cartProvider, type CartLineItem } from "@/lib/providers/client";

// Preços e itens vêm do CartProvider (catálogo), não de valores fixos aqui.
const HUMAN_KIT = { slug: "energy-duo", plan: null };
const PET_KIT = { slug: "chew-oil", plan: "plan_more_good_years_30d" };

export default function W124Section() {
  const [lines, setLines] = useState<CartLineItem[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      // create() zera o carrinho do navegador, assim a vitrine não acumula quantidades
      await cartProvider.create();
      await cartProvider.addKit(HUMAN_KIT.slug, 1, HUMAN_KIT.plan);
      const cart = await cartProvider.addKit(PET_KIT.slug, 1, PET_KIT.plan);
      if (active) setLines(cart.lines);
    })();
    return () => {
      active = false;
    };
  }, []);

  const humanLine = lines.find((l) => l.kit?.slug === HUMAN_KIT.slug);
  const petLine = lines.find((l) => l.kit?.slug === PET_KIT.slug);

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
            {humanLine && (
              <li>
                <CartDrawerItem item={humanLine} cartProvider={cartProvider} />
              </li>
            )}
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
            {petLine && (
              <li>
                <CartDrawerItem item={petLine} cartProvider={cartProvider} />
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
