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

  it("throws 'not implemented: onda 4' on all live provider methods", async () => {
    const live = getProviders("live");

    await expect(live.catalogProvider.getProducts()).rejects.toThrow(
      "not implemented: onda 4"
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
});
