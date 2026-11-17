import type { CartProvider } from "@/lib/contracts/cart";
import type { GiftCardProvider } from "@/lib/contracts/gift-card";
import { mockCartProvider, useCartStore } from "./mock/cart";
import { MockGiftCardProvider } from "./mock/gift-card";
import { liveCartProvider } from "./live";

const isLive = process.env.PROVIDERS === "live";

export const cartProvider: CartProvider = isLive
  ? liveCartProvider
  : mockCartProvider;

// Temporário até o registry expor giftCardProvider na W5-00c
export const giftCardProvider: GiftCardProvider = new MockGiftCardProvider();

export {
  useCartStore,
  mockCartProvider,
  liveCartProvider,
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
