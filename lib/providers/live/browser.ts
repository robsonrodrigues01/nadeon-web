// Providers live seguros para o navegador. Este arquivo não pode importar código
// de servidor (integrações de e-mail, chaves, variáveis de ambiente): client.ts o usa.
import type { GiftCardProvider } from "@/lib/contracts/gift-card";
import {
  LiveCartProvider,
  liveCartProvider,
  type LiveCartProviderOptions,
  CART_STORAGE_KEY,
  normalizeShopifyCart,
} from "./cart";

export const NOT_IMPLEMENTED_MSG = "not implemented: onda 4";

export function liveStub<T extends object>(provider: string): T {
  return new Proxy({} as T, {
    get: () => async () => {
      throw new Error(`not implemented: onda 5 (${provider})`);
    },
  });
}

export {
  LiveCartProvider,
  liveCartProvider,
  type LiveCartProviderOptions,
  CART_STORAGE_KEY,
  normalizeShopifyCart,
};

export const liveGiftCardProvider =
  liveStub<GiftCardProvider>("giftCardProvider");
