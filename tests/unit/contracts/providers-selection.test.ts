import { describe, it, expect } from "vitest";
import { getProviders, getProvidersMode } from "@/lib/providers";

describe("Providers Selection & Stubs", () => {
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
