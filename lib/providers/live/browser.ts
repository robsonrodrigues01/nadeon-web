/* eslint-disable @typescript-eslint/no-unused-vars */
// Providers live seguros para o navegador. Este arquivo não pode importar código
// de servidor (integrações de e-mail, chaves, variáveis de ambiente): client.ts o usa.
import type {
  AddCartLineInput,
  Cart,
  CartProvider,
  UpdateCartLineInput,
} from "@/lib/contracts/cart";
import type { GiftCardProvider } from "@/lib/contracts/gift-card";

export const NOT_IMPLEMENTED_MSG = "not implemented: onda 4";

export function liveStub<T extends object>(provider: string): T {
  return new Proxy({} as T, {
    get: () => async () => {
      throw new Error(`not implemented: onda 5 (${provider})`);
    },
  });
}

export class LiveCartProvider implements CartProvider {
  async get(): Promise<Cart | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async create(): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async addLines(_lines: AddCartLineInput[]): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async addKit(
    _kitSlug: string,
    _quantity: number,
    _sellingPlanId?: string | null
  ): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async updateLines(_lines: UpdateCartLineInput[]): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async removeLines(_lineIds: string[]): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async applyDiscount(_code: string): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async setLineSellingPlan(
    _lineId: string,
    _sellingPlanId: string | null
  ): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async checkoutUrl(): Promise<string> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export const liveCartProvider = new LiveCartProvider();
export const liveGiftCardProvider =
  liveStub<GiftCardProvider>("giftCardProvider");
