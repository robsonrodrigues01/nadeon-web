import type { CartProvider } from "@/lib/contracts/cart";
import type { GiftCardProvider } from "@/lib/contracts/gift-card";
import { mockCartProvider, useCartStore } from "./mock/cart";
import { MockGiftCardProvider, mockGiftCardProvider } from "./mock/gift-card";
import { liveCartProvider, liveGiftCardProvider } from "./live/browser";
import { parseLiveList } from "./live-list";

const BROWSER_LIVE_KEYS = ["cart", "gift-card"] as const;

// Só NEXT_PUBLIC_ chega ao navegador; manter igual a PROVIDERS/PROVIDERS_LIVE do servidor.
const live =
  process.env.NEXT_PUBLIC_PROVIDERS === "live"
    ? new Set(BROWSER_LIVE_KEYS)
    : parseLiveList(
        "NEXT_PUBLIC_PROVIDERS_LIVE",
        process.env.NEXT_PUBLIC_PROVIDERS_LIVE,
        BROWSER_LIVE_KEYS
      );

export const cartProvider: CartProvider = live.has("cart")
  ? liveCartProvider
  : mockCartProvider;

export const giftCardProvider: GiftCardProvider = live.has("gift-card")
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
