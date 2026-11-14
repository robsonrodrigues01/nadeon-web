import type { CartProvider } from "@/lib/contracts/cart";
import { mockCartProvider, useCartStore } from "./mock/cart";
import { liveCartProvider } from "./live";

const isLive = process.env.PROVIDERS === "live";

export const cartProvider: CartProvider = isLive
  ? liveCartProvider
  : mockCartProvider;

export { useCartStore, mockCartProvider, liveCartProvider };
export type {
  Cart,
  CartLineItem,
  CartDiscountCode,
  CartProvider,
  AddCartLineInput,
  UpdateCartLineInput,
} from "@/lib/contracts/cart";
