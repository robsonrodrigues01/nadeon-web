import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SERVER_KEYS = {
  catalog: ["catalogProvider"],
  cart: ["cartProvider"],
  account: ["accountProvider"],
  pets: ["petProfileProvider"],
  subscription: ["subscriptionProvider"],
  reviews: ["reviewsProvider"],
  forms: ["formsProvider"],
  labs: ["labsProvider"],
  campaign: ["campaignConfig"],
  content: ["contentProvider"],
  "email-preferences": ["emailPreferencesProvider"],
  "gift-card": ["giftCardProvider"],
  offers: ["offersProvider"],
  "store-locator": ["storeLocatorProvider"],
  wholesale: ["wholesaleProvider"],
} as const;

type ProviderKey = (typeof SERVER_KEYS)[keyof typeof SERVER_KEYS][number];
const ALL_KEYS = Object.values(SERVER_KEYS).flat() as ProviderKey[];

async function loadServer(env: Record<string, string>) {
  vi.resetModules();
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  return import("@/lib/providers");
}

describe("W4-31 server provider selection", () => {
  beforeEach(() => {
    vi.stubEnv("PROVIDERS", "");
    vi.stubEnv("PROVIDERS_LIVE", "");
    vi.stubEnv("MAILYTE_MODE", "mock");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("turns only the listed provider live and keeps the rest on mock", async () => {
    const mod = await loadServer({ PROVIDERS_LIVE: "catalog" });
    const live = mod.getProviders("live");
    const mock = mod.getProviders("mock");
    const selected = mod.getProviders();

    expect(selected.catalogProvider).toBe(live.catalogProvider);
    expect(mod.catalogProvider).toBe(live.catalogProvider);
    for (const key of ALL_KEYS.filter((k) => k !== "catalogProvider")) {
      expect(selected[key]).toBe(mock[key]);
      expect(mod[key]).toBe(mock[key]);
    }
  });

  it("accepts a comma list with spaces and mixed case", async () => {
    const mod = await loadServer({
      PROVIDERS_LIVE: " Catalog , cart,account ,pets ",
    });
    const live = mod.getProviders("live");
    const mock = mod.getProviders("mock");

    expect(mod.catalogProvider).toBe(live.catalogProvider);
    expect(mod.cartProvider).toBe(live.cartProvider);
    expect(mod.accountProvider).toBe(live.accountProvider);
    expect(mod.petProfileProvider).toBe(live.petProfileProvider);
    expect(mod.subscriptionProvider).toBe(mock.subscriptionProvider);
  });

  it.each(Object.entries(SERVER_KEYS))(
    "maps the key %s to its provider",
    async (key, [providerKey]) => {
      const mod = await loadServer({ PROVIDERS_LIVE: key });
      expect(mod.getProviders()[providerKey]).toBe(
        mod.getProviders("live")[providerKey]
      );
    }
  );

  it("keeps PROVIDERS=live turning every provider live", async () => {
    const mod = await loadServer({ PROVIDERS: "live" });
    const live = mod.getProviders("live");
    for (const key of ALL_KEYS) expect(mod[key]).toBe(live[key]);
  });

  it("lets PROVIDERS_LIVE=mailyte turn Mailyte live", async () => {
    const mod = await loadServer({ PROVIDERS_LIVE: "mailyte" });
    expect(mod.mailyteProvider).toBe(mod.liveMailyteProvider);
    expect(mod.getProviders().mailyteProvider).toBe(mod.liveMailyteProvider);
  });

  it("fails loudly on an unknown key instead of silently using mock data", async () => {
    await expect(
      loadServer({ PROVIDERS_LIVE: "catalog,catalogue" })
    ).rejects.toThrow(/PROVIDERS_LIVE.*catalogue/);
  });

  it("never answers with mock data when a live provider fails", async () => {
    const mod = await loadServer({ PROVIDERS_LIVE: "catalog" });
    await expect(mod.catalogProvider.getProducts()).rejects.toThrow();
  });
});

describe("W4-31 browser provider selection", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_PROVIDERS", "");
    vi.stubEnv("NEXT_PUBLIC_PROVIDERS_LIVE", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  async function loadClient(env: Record<string, string>) {
    vi.resetModules();
    for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
    return import("@/lib/providers/client");
  }

  it("turns only the cart live from NEXT_PUBLIC_PROVIDERS_LIVE", async () => {
    const mod = await loadClient({ NEXT_PUBLIC_PROVIDERS_LIVE: "cart" });
    expect(mod.cartProvider).toBe(mod.liveCartProvider);
    expect(mod.giftCardProvider).toBe(mod.mockGiftCardProvider);
  });

  it("turns only the gift card live from NEXT_PUBLIC_PROVIDERS_LIVE", async () => {
    const mod = await loadClient({ NEXT_PUBLIC_PROVIDERS_LIVE: "gift-card" });
    expect(mod.cartProvider).toBe(mod.mockCartProvider);
    expect(mod.giftCardProvider).toBe(mod.liveGiftCardProvider);
  });

  it("keeps NEXT_PUBLIC_PROVIDERS=live turning both live", async () => {
    const mod = await loadClient({ NEXT_PUBLIC_PROVIDERS: "live" });
    expect(mod.cartProvider).toBe(mod.liveCartProvider);
    expect(mod.giftCardProvider).toBe(mod.liveGiftCardProvider);
  });

  it("defaults to mock when nothing is set", async () => {
    const mod = await loadClient({});
    expect(mod.cartProvider).toBe(mod.mockCartProvider);
    expect(mod.giftCardProvider).toBe(mod.mockGiftCardProvider);
  });

  it("fails loudly on an unknown browser key", async () => {
    await expect(
      loadClient({ NEXT_PUBLIC_PROVIDERS_LIVE: "catalog" })
    ).rejects.toThrow(/NEXT_PUBLIC_PROVIDERS_LIVE.*catalog/);
  });
});
