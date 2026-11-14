"use client";

import React from "react";
import { Dialog } from "radix-ui";
import {
  cartProvider as defaultCartProvider,
  useCartStore,
  type Cart,
  type CartProvider,
} from "@/lib/providers/client";
import { useCartDrawerStore } from "./use-cart-drawer";
import { CartDrawerShippingBar } from "./cart-drawer-shipping-bar";
import { CartDrawerItem } from "./cart-drawer-item";
import { CartDrawerUpsell } from "./cart-drawer-upsell";
import { CartDrawerEmpty } from "./cart-drawer-empty";
import { CartDrawerFooter } from "./cart-drawer-footer";

export interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  theme?: "human" | "pet";
  cart?: Cart;
  cartProvider?: CartProvider;
}

export function CartDrawer({
  isOpen,
  onClose,
  theme,
  cart: customCart,
  cartProvider = defaultCartProvider,
}: CartDrawerProps) {
  const store = useCartDrawerStore();
  const liveCart = useCartStore((state) => state.cart);

  const cart = customCart ?? liveCart;
  const isControlled = isOpen !== undefined;
  const isDrawerOpen = isControlled ? isOpen : store.isOpen;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (onClose) {
        onClose();
      } else {
        store.close();
      }
    } else if (!isControlled) {
      store.open();
    }
  };

  const resolvedTheme = theme ?? store.theme ?? "human";
  const totalQuantity = cart.totalQuantity ?? 0;
  const isEmpty = !cart.lines || cart.lines.length === 0;

  return (
    <Dialog.Root open={isDrawerOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs transition-opacity duration-300" />
        <Dialog.Content
          data-theme={resolvedTheme}
          aria-describedby="cart-drawer-description"
          className="fixed top-0 right-0 bottom-0 z-50 h-full w-full max-w-[460px] flex flex-col bg-bg text-fg shadow-elevated border-l border-border/30 overflow-hidden outline-none animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 sm:px-7 sm:py-6 border-b border-border/40 shrink-0 bg-bg">
            <Dialog.Title asChild>
              <h2 className="font-archivo font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-fg">
                Your cart ({totalQuantity})
              </h2>
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close cart"
                className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-full border border-border/40 flex items-center justify-center text-fg hover:border-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer text-lg leading-none"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description id="cart-drawer-description" className="sr-only">
            Your shopping cart items, subscription management and checkout
          </Dialog.Description>

          {/* Drawer Body */}
          {isEmpty ? (
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
              <CartDrawerEmpty
                theme={resolvedTheme}
                onClose={() => handleOpenChange(false)}
              />
            </div>
          ) : (
            <>
              {/* Shipping Progress */}
              <CartDrawerShippingBar
                subtotal={cart.subtotalPrice.amount}
                currencyCode={cart.subtotalPrice.currencyCode}
                theme={resolvedTheme}
              />

              {/* Items List & Upsell */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-2 divide-y divide-border/20">
                <div
                  role="region"
                  aria-label="Cart items"
                  className="space-y-1"
                >
                  {cart.lines.map((line) => (
                    <CartDrawerItem
                      key={line.id}
                      item={line}
                      cartProvider={cartProvider}
                      theme={resolvedTheme}
                    />
                  ))}
                </div>

                {/* Additional upsell sale item */}
                <CartDrawerUpsell
                  cart={cart}
                  cartProvider={cartProvider}
                  theme={resolvedTheme}
                />
              </div>

              {/* Footer Checkout & Payment summary */}
              <CartDrawerFooter cart={cart} theme={resolvedTheme} />
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
