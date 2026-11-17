import { describe, expect, it } from "vitest";
import { checkCatalog } from "../../../scripts/check-shopify-catalog.mjs";

const local = [{
  handle: "sample",
  variants: [{ sku: "SAMPLE-1", title: "1 jar", price: { amount: 10, currencyCode: "USD" } }],
  sellingPlans: [{ intervalDays: 30, discountPercentage: 15 }],
}];
const fixture = [{
  handle: "sample",
  variants: [{ sku: "SAMPLE-1", title: "1 jar", price: { amount: "10.00", currencyCode: "USD" } }],
  sellingPlans: [{ intervalDays: 30, discountPercentage: 15 }],
}];

describe("Shopify catalog comparison", () => {
  it("passes when catalog data matches the recorded fixture", async () => {
    await expect(checkCatalog({ products: local, fetchProducts: async () => fixture })).resolves.toEqual([]);
  });

  it("reports a different variant price", async () => {
    const remote = [{ ...fixture[0], variants: [{ ...fixture[0].variants[0], price: { amount: "12.00", currencyCode: "USD" } }] }];
    await expect(checkCatalog({ products: local, fetchProducts: async () => remote })).resolves.toContain("sample: preço de SAMPLE-1 difere (local 10 USD, Shopify 12.00 USD)");
  });

  it("reports a missing handle", async () => {
    await expect(checkCatalog({ products: local, fetchProducts: async () => [] })).resolves.toContain("sample: produto ausente na Shopify");
  });
});
