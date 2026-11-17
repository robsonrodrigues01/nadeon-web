import type { OffersProvider } from "@/lib/contracts/offers";

export class MockOffersProvider implements OffersProvider {
  async list() {
    // Board promotion values remain placeholders; publish only after approval.
    return [];
  }

  async get() {
    return null;
  }
}

export const mockOffersProvider = new MockOffersProvider();
