import type { CartProvider } from "@/lib/contracts/cart";
import type { GiftCardProvider } from "@/lib/contracts/gift-card";
import { mockCartProvider, useCartStore } from "./mock/cart";
import { MockGiftCardProvider, mockGiftCardProvider } from "./mock/gift-card";
import { liveCartProvider, liveGiftCardProvider } from "./live/browser";

// Só NEXT_PUBLIC_ chega ao navegador; manter igual a PROVIDERS do servidor.
const isLive = process.env.NEXT_PUBLIC_PROVIDERS === "live";

export const cartProvider: CartProvider = isLive
  ? liveCartProvider
  : mockCartProvider;

export const giftCardProvider: GiftCardProvider = isLive
  ? liveGiftCardProvider
  : mockGiftCardProvider;

export {
  useCartStore,
  mockCartProvider,
  mockGiftCardProvider,
  liveCartProvider,
  liveGiftCardProvider,
  MockGiftCardProvider,
};
export type {
  Cart,
  CartKit,
  CartLineItem,
  CartDiscountCode,
  CartProvider,
  AddCartLineInput,
  UpdateCartLineInput,
} from "@/lib/contracts/cart";
export type { GiftCardProvider } from "@/lib/contracts/gift-card";
