"use client";

import React, { useState } from "react";
import { CartDrawer, openCartDrawer } from "@/components/commerce/cart-drawer";
import { useCartStore, cartProvider, type Cart } from "@/lib/providers/client";

const mockHumanCart: Cart = {
  id: "cart_human_demo",
  lines: [
    {
      id: "line_biohack",
      variantId: "var_biohack_1",
      quantity: 1,
      sellingPlanId: "plan_biohack_30d",
      sellingPlanTitle: "1 jar every 30 days (15% off)",
      product: {
        id: "biohack",
        title: "BioHack",
        handle: "biohack",
        line: "human",
      },
      price: { amount: 50.15, currencyCode: "USD" },
      total: { amount: 50.15, currencyCode: "USD" },
    },
    {
      id: "line_renew",
      variantId: "var_renew_1",
      quantity: 1,
      sellingPlanId: null,
      product: {
        id: "renew",
        title: "Renew",
        handle: "renew",
        line: "human",
      },
      price: { amount: 65, currencyCode: "USD" },
      total: { amount: 65, currencyCode: "USD" },
    },
  ],
  discountCodes: [],
  subtotalPrice: { amount: 115.15, currencyCode: "USD" },
  totalDiscount: { amount: 8.85, currencyCode: "USD" },
  totalPrice: { amount: 115.15, currencyCode: "USD" },
  totalQuantity: 2,
  checkoutUrl: "https://checkout.nadeon.com/mock/cart_human_demo",
};

const mockPetCart: Cart = {
  id: "cart_pet_demo",
  lines: [
    {
      id: "line_mgy",
      variantId: "var_mgy_1",
      quantity: 1,
      sellingPlanId: "plan_more_good_years_30d",
      sellingPlanTitle: "Delivery every 30 days (15% off)",
      product: {
        id: "more-good-years",
        title: "More Good Years",
        handle: "more-good-years",
        line: "pet",
      },
      price: { amount: 37.4, currencyCode: "USD" },
      total: { amount: 37.4, currencyCode: "USD" },
    },
    {
      id: "line_good_days",
      variantId: "var_good_days_1",
      quantity: 1,
      sellingPlanId: null,
      product: {
        id: "good-days",
        title: "Good Days",
        handle: "good-days",
        line: "pet",
      },
      price: { amount: 29, currencyCode: "USD" },
      total: { amount: 29, currencyCode: "USD" },
    },
  ],
  discountCodes: [],
  subtotalPrice: { amount: 66.4, currencyCode: "USD" },
  totalDiscount: { amount: 6.6, currencyCode: "USD" },
  totalPrice: { amount: 66.4, currencyCode: "USD" },
  totalQuantity: 2,
  checkoutUrl: "https://checkout.nadeon.com/mock/cart_pet_demo",
};

const mockEmptyCart: Cart = {
  id: "cart_empty_demo",
  lines: [],
  discountCodes: [],
  subtotalPrice: { amount: 0, currencyCode: "USD" },
  totalDiscount: { amount: 0, currencyCode: "USD" },
  totalPrice: { amount: 0, currencyCode: "USD" },
  totalQuantity: 0,
  checkoutUrl: "https://checkout.nadeon.com/mock/cart_empty_demo",
};

export default function W114Section() {
  const { setCart } = useCartStore();
  const [activeTheme, setActiveTheme] = useState<"human" | "pet">("human");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenVariant = (theme: "human" | "pet", initialCart: Cart) => {
    setCart(initialCart);
    setActiveTheme(theme);
    setIsDrawerOpen(true);
  };

  const handleOpenGlobalHelper = (theme: "human" | "pet") => {
    openCartDrawer(theme);
  };

  return (
    <section
      aria-labelledby="section-w1-14-title"
      className="mb-16 border-t border-border pt-10"
    >
      <div className="mb-6">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Task W1-14 · Cart Drawer
        </span>
        <h2
          id="section-w1-14-title"
          className="title text-2xl sm:text-3xl font-black uppercase text-fg"
        >
          Shopping Cart Drawer (Human &amp; Pet)
        </h2>
        <p className="lead text-fg-muted text-sm sm:text-base mt-1 max-w-3xl">
          Accessible sliding drawer dialog connected to CartProvider with
          subscription toggle (Subscribe &amp; save 15% vs One-time purchase),
          frequency switcher, quantity modifier, upsell add-on (+ Add), free
          shipping progress bar, and express checkout badges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Human Theme Variant Card */}
        <div className="rounded-card border border-border overflow-hidden bg-bg-elevated p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="label text-xs uppercase px-2.5 py-1 rounded-full bg-border text-fg font-bold">
                Variant: Human
              </span>
              <span className="text-xs text-accent font-bold">
                Dark theme · Gold accent
              </span>
            </div>

            <h3 className="font-archivo text-xl font-bold uppercase text-fg mb-2">
              Human Cart Drawer
            </h3>
            <p className="text-xs text-fg-muted mb-6 leading-relaxed">
              Features dark background, gold gradient highlights, threshold at
              $75 for free shipping, Prime upsell card, and FDA disclaimer.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenVariant("human", mockHumanCart)}
              className="min-h-11 px-5 py-2.5 text-xs font-bold rounded-full bg-gradient-gold text-accent-fg hover:brightness-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              Open Human Drawer (2 items)
            </button>
            <button
              type="button"
              onClick={() => handleOpenVariant("human", mockEmptyCart)}
              className="min-h-11 px-4 py-2.5 text-xs font-bold rounded-full border border-border text-fg hover:border-accent hover:text-accent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              Open Empty Human
            </button>
          </div>
        </div>

        {/* Pet Theme Variant Card */}
        <div className="rounded-card border border-border overflow-hidden bg-bg p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="label text-xs uppercase px-2.5 py-1 rounded-full bg-border text-fg font-bold">
                Variant: Pet
              </span>
              <span className="text-xs text-accent font-bold">
                Cream theme · Espresso accent
              </span>
            </div>

            <h3 className="font-archivo text-xl font-bold uppercase text-fg mb-2">
              Pet Cart Drawer
            </h3>
            <p className="text-xs text-fg-muted mb-6 leading-relaxed">
              Features light cream background, green progress bar at $49
              threshold, Golden Years Oil recommendation, and &quot;For animal
              use only&quot; compliance disclaimer.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenVariant("pet", mockPetCart)}
              className="min-h-11 px-5 py-2.5 text-xs font-bold rounded-full bg-fg text-bg hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              Open Pet Drawer (2 items)
            </button>
            <button
              type="button"
              onClick={() => handleOpenVariant("pet", mockEmptyCart)}
              className="min-h-11 px-4 py-2.5 text-xs font-bold rounded-full border border-border text-fg hover:border-accent hover:text-accent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              Open Empty Pet
            </button>
          </div>
        </div>
      </div>

      {/* Helper trigger test */}
      <div className="mt-8 p-4 rounded-card border border-border/40 bg-bg-elevated/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-xs uppercase text-fg">
            Global Header Trigger Hook
          </h4>
          <p className="text-xs text-fg-muted mt-0.5">
            Tests opening the cart drawer via `openCartDrawer()` custom event
            designed for the global header counter.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenGlobalHelper("human")}
          className="min-h-11 px-4 py-2 text-xs font-bold rounded-full border border-accent text-accent hover:bg-accent/10 transition-colors cursor-pointer"
        >
          Dispatch openCartDrawer() Event
        </button>
      </div>

      {/* Cart Drawer Component Instance */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        theme={activeTheme}
        cartProvider={cartProvider}
      />
    </section>
  );
}
