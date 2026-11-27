import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { getProviders, getProvidersMode } from "@/lib/providers";

describe("Providers Selection & Stubs", () => {
  beforeEach(() => {
    vi.stubEnv("PROVIDERS", "mock");
    vi.stubEnv("MAILYTE_MODE", "mock");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("defaults to mock mode", () => {
    const mode = getProvidersMode();
    expect(mode).toBe("mock");
  });

  it("returns mock providers by default", async () => {
    const providers = getProviders("mock");
    expect(providers.catalogProvider).toBeDefined();
    const products = await providers.catalogProvider.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  it.each([
    {
      providers: "mock",
      mailyteMode: "mock",
      othersLive: false,
      mailyteLive: false,
    },
    {
      providers: "mock",
      mailyteMode: "live",
      othersLive: false,
      mailyteLive: true,
    },
    {
      providers: "live",
      mailyteMode: "mock",
      othersLive: true,
      mailyteLive: true,
    },
    {
      providers: "live",
      mailyteMode: "live",
      othersLive: true,
      mailyteLive: true,
    },
  ])(
    "selects providers for PROVIDERS=$providers and MAILYTE_MODE=$mailyteMode",
    async ({ providers, mailyteMode, othersLive, mailyteLive }) => {
      vi.stubEnv("PROVIDERS", providers);
      vi.stubEnv("MAILYTE_MODE", mailyteMode);
      vi.resetModules();

      const providersModule = await import("@/lib/providers");
      const selected = providersModule.getProviders();
      const globalLive = providersModule.getProviders("live");
      const globalMock = providersModule.getProviders("mock");

      expect(providersModule.getProvidersMode()).toBe(providers);
      const otherProviderKeys = [
        "catalogProvider",
        "cartProvider",
        "accountProvider",
        "subscriptionProvider",
        "reviewsProvider",
        "formsProvider",
        "labsProvider",
        "campaignConfig",
        "contentProvider",
        "emailPreferencesProvider",
        "giftCardProvider",
        "offersProvider",
        "storeLocatorProvider",
        "wholesaleProvider",
      ] as const;
      for (const key of otherProviderKeys) {
        const expectedProvider = othersLive ? globalLive[key] : globalMock[key];
        expect(selected[key]).toBe(expectedProvider);
        expect(providersModule[key]).toBe(expectedProvider);
      }
      expect(selected.mailyteProvider).toBe(
        mailyteLive
          ? providersModule.liveMailyteProvider
          : providersModule.mockMailyteProvider
      );
      expect(providersModule.mailyteProvider).toBe(
        mailyteLive
          ? providersModule.liveMailyteProvider
          : providersModule.mockMailyteProvider
      );
    }
  );

  it("throws clear configuration error on live catalog and 'not implemented: onda 4' on other live provider methods", async () => {
    const live = getProviders("live");

    await expect(live.catalogProvider.getProducts()).rejects.toThrow(
      /Shopify Storefront configuration error/i
    );
    await expect(live.cartProvider.get()).rejects.toThrow(
      "not implemented: onda 4"
    );
    await expect(live.accountProvider.getSession()).rejects.toThrow(
      "not implemented: onda 4"
    );
    await expect(live.subscriptionProvider.list()).rejects.toThrow(
      "not implemented: onda 4"
    );
    await expect(live.reviewsProvider.list()).rejects.toThrow(
      "not implemented: onda 4"
    );
    await expect(
      live.formsProvider.subscribe("list", "test@example.com", true)
    ).rejects.toThrow("not implemented: onda 4");
    await expect(live.labsProvider.findLot("123")).rejects.toThrow(
      "not implemented: onda 4"
    );
    await expect(live.campaignConfig.getActiveCampaign()).rejects.toThrow(
      "not implemented: onda 4"
    );
  });

  it("selects all onda 5 providers from the registry and exposes their live stubs", async () => {
    vi.resetModules();
    const providersModule = await import("@/lib/providers");
    const mock = providersModule.getProviders("mock");
    const live = providersModule.getProviders("live");
    const providerExports = [
      ["contentProvider", "mockContentProvider", "liveContentProvider"],
      [
        "emailPreferencesProvider",
        "mockEmailPreferencesProvider",
        "liveEmailPreferencesProvider",
      ],
      ["giftCardProvider", "mockGiftCardProvider", "liveGiftCardProvider"],
      ["offersProvider", "mockOffersProvider", "liveOffersProvider"],
      [
        "storeLocatorProvider",
        "mockStoreLocatorProvider",
        "liveStoreLocatorProvider",
      ],
      ["wholesaleProvider", "mockWholesaleProvider", "liveWholesaleProvider"],
    ] as const;

    for (const [key, mockExport, liveExport] of providerExports) {
      expect(mock[key]).toBe(providersModule[mockExport]);
      expect(live[key]).toBe(providersModule[liveExport]);
    }

    await expect(live.contentProvider.listIngredients()).rejects.toThrow(
      "not implemented: onda 5 (contentProvider)"
    );
    await expect(
      live.emailPreferencesProvider.getPreferences()
    ).rejects.toThrow("not implemented: onda 5 (emailPreferencesProvider)");
    await expect(live.giftCardProvider.getDesigns()).rejects.toThrow(
      "not implemented: onda 5 (giftCardProvider)"
    );
    await expect(live.offersProvider.list()).rejects.toThrow(
      "not implemented: onda 5 (offersProvider)"
    );
    await expect(
      live.storeLocatorProvider.search({ zip: "10001", radiusMiles: 50 })
    ).rejects.toThrow("not implemented: onda 5 (storeLocatorProvider)");
    await expect(live.wholesaleProvider.submit({} as never)).rejects.toThrow(
      "not implemented: onda 5 (wholesaleProvider)"
    );
  });
});
