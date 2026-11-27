import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Cart } from "@/lib/contracts/cart";

export interface CartStoreState {
  cart: Cart;
  setCart: (cart: Cart) => void;
  resetCart: () => void;
}

export function createInitialCart(id?: string): Cart {
  const cartId = id || `cart_${Math.random().toString(36).substring(2, 9)}`;
  return {
    id: cartId,
    lines: [],
    discountCodes: [],
    subtotalPrice: { amount: 0, currencyCode: "USD" },
    totalDiscount: { amount: 0, currencyCode: "USD" },
    totalPrice: { amount: 0, currencyCode: "USD" },
    totalQuantity: 0,
    checkoutUrl: `https://checkout.nadeon.com/mock/${cartId}`,
  };
}

// Memory fallback storage for Node / SSR
const memoryStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (name: string) => store[name] ?? null,
    setItem: (name: string, value: string) => {
      store[name] = value;
    },
    removeItem: (name: string) => {
      delete store[name];
    },
    clear: () => {
      store = {};
    },
  };
})();

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      cart: createInitialCart(),
      setCart: (cart: Cart) => set({ cart }),
      resetCart: () => set({ cart: createInitialCart() }),
    }),
    {
      name: "nadeon-cart-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined" && window.localStorage) {
          return window.localStorage;
        }
        return memoryStorage;
      }),
    }
  )
);
