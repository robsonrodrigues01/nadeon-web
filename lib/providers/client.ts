import type { CartProvider } from "@/lib/contracts/cart";
import type { GiftCardProvider } from "@/lib/contracts/gift-card";
import { mockCartProvider, useCartStore } from "./mock/cart";
import { MockGiftCardProvider, mockGiftCardProvider } from "./mock/gift-card";
import { liveCartProvider, liveGiftCardProvider } from "./live";

const isLive = process.env.PROVIDERS === "live";

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
