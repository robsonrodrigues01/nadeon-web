import {
  StoreSearchSchema,
  type StoreLocation,
  type StoreLocatorProvider,
} from "@/lib/contracts/store-locator";

const stores: StoreLocation[] = [];

export class MockStoreLocatorProvider implements StoreLocatorProvider {
  async search(input: Parameters<StoreLocatorProvider["search"]>[0]) {
    const parsed = StoreSearchSchema.parse(input);
    return stores.filter(
      (store) =>
        store.zip === parsed.zip &&
        store.distanceMiles <= parsed.radiusMiles &&
        (!parsed.line ||
          parsed.line === "all" ||
          store.lines.includes(parsed.line))
    );
  }
}

export const mockStoreLocatorProvider = new MockStoreLocatorProvider();
