/** @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ProductSchema } from "@/lib/contracts/catalog";
import { Claim } from "@/components/commerce/product-card/claim";
import { LiveCatalogProvider } from "@/lib/providers/live/catalog";
import productsFixture from "../../fixtures/shopify/products.json";
import productBiohackFixture from "../../fixtures/shopify/product-biohack.json";
import productNoSizeFixture from "../../fixtures/shopify/product-no-size.json";
import productNotFoundFixture from "../../fixtures/shopify/product-not-found.json";
import graphqlErrorFixture from "../../fixtures/shopify/graphql-error.json";

function createMockFetch(responses: Record<string, unknown> | unknown) {
  return vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
    const bodyStr = typeof init?.body === "string" ? init.body : "";
    let parsedBody: { query?: string; variables?: Record<string, unknown> } =
      {};
    try {
      parsedBody = JSON.parse(bodyStr);
    } catch {
      // ignore
    }

    const handle = parsedBody.variables?.handle as string | undefined;

    type NodeWithHandle = { handle?: string };
    type ProductsFixtureShape = {
      data?: {
        products?: {
          nodes?: NodeWithHandle[];
        };
      };
    };

    const fixtureObj = responses as ProductsFixtureShape;
    if (fixtureObj?.data?.products?.nodes && handle) {
      const found = fixtureObj.data.products.nodes.find(
        (node) => node.handle === handle
      );
      const singleProductResponse = { data: { product: found ?? null } };
      return {
        ok: true,
        status: 200,
        json: async () => singleProductResponse,
        text: async () => JSON.stringify(singleProductResponse),
      } as unknown as Response;
    }

    if (
      typeof responses === "object" &&
      responses !== null &&
      !("data" in responses) &&
      !("errors" in responses)
    ) {
      const responseData =
        (handle && (responses as Record<string, unknown>)[handle]) ||
        (responses as Record<string, unknown>)["default"] ||
        productsFixture;
      return {
        ok: true,
        status: 200,
        json: async () => responseData,
        text: async () => JSON.stringify(responseData),
      } as unknown as Response;
    }

    return {
      ok: true,
      status: 200,
      json: async () => responses,
      text: async () => JSON.stringify(responses),
    } as unknown as Response;
  });
}

describe("W4-33 LiveCatalogProvider", () => {
  const credentials = {
    domain: "TEST-store.myshopify.com",
    privateToken: "TEST-private-token-12345",
  };

  it("throws clear configuration error if credentials are missing", async () => {
    const provider = new LiveCatalogProvider({
      domain: "",
      privateToken: "",
      publicToken: "",
      fetchImpl: createMockFetch(productsFixture),
    });

    await expect(provider.getProducts()).rejects.toThrow(
      /Shopify Storefront configuration error/i
    );
  });

  it("succeeds with private token header (Shopify-Storefront-Private-Token)", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      domain: "TEST-store.myshopify.com",
      privateToken: "TEST-private-token",
      fetchImpl: mockFetch,
    });

    const products = await provider.getProducts();
    expect(products.length).toBeGreaterThan(0);

    const callInit = mockFetch.mock.calls[0][1];
    expect(callInit?.headers).toMatchObject({
      "Shopify-Storefront-Private-Token": "TEST-private-token",
    });
  });

  it("falls back to public token header (X-Shopify-Storefront-Access-Token)", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      domain: "TEST-store.myshopify.com",
      publicToken: "TEST-public-token",
      fetchImpl: mockFetch,
    });

    const products = await provider.getProducts();
    expect(products.length).toBeGreaterThan(0);

    const callInit = mockFetch.mock.calls[0][1];
    expect(callInit?.headers).toMatchObject({
      "X-Shopify-Storefront-Access-Token": "TEST-public-token",
    });
  });

  it("maps product correctly and strictly satisfies ProductSchema", async () => {
    const mockFetch = createMockFetch(productBiohackFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const product = await provider.getProduct("biohack");
    expect(product).not.toBeNull();
    expect(() => ProductSchema.parse(product)).not.toThrow();

    expect(product?.name).toBe("BioHack");
    expect(product?.slug).toBe("biohack");
    expect(product?.handle).toBe("biohack");
    expect(product?.technicalName).toBe("NMN 500 mg");
    expect(product?.line).toBe("human");
    expect(product?.species).toBeNull();
    expect(product?.format).toBe("Capsules");
    expect(product?.color).toBe("#1A0A2C");
    expect(product?.serving).toBe(
      "2 capsules daily with water, in the morning"
    );
    expect(product?.servingsPerJar).toBe(30);
    expect(product?.netWeight).toBe("60 capsules");
    expect(product?.actives).toEqual([
      { name: "NMN (β-nicotinamide mononucleotide)", amount: "500 mg" },
    ]);
    expect(product?.images).toEqual(["/renders/biohack.png"]);
  });

  it("handles missing size fields without inventing data", async () => {
    const mockFetch = createMockFetch(productNoSizeFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const product = await provider.getProduct("sample-no-size");
    expect(product).not.toBeNull();
    expect(() => ProductSchema.parse(product)).not.toThrow();

    expect(product?.serving).toBeUndefined();
    expect(product?.servingsPerJar).toBeUndefined();
    expect(product?.netWeight).toBeUndefined();
    expect(product?.dosingByWeight).toEqual([]);
  });

  it("parses jars from variant title or quantity option into 1, 2, or 3", async () => {
    const mockFetch = createMockFetch(productBiohackFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const product = await provider.getProduct("biohack");
    expect(product?.variants).toHaveLength(3);

    expect(product?.variants[0]).toMatchObject({
      id: "gid://shopify/ProductVariant/2000000001",
      jars: 1,
      title: "1 jar",
      price: { amount: 59, currencyCode: "USD" },
      compareAtPrice: { amount: 59, currencyCode: "USD" },
      sku: "NAD-HUM-BIO-1",
    });

    expect(product?.variants[1]).toMatchObject({
      id: "gid://shopify/ProductVariant/2000000002",
      jars: 2,
      price: { amount: 106, currencyCode: "USD" },
      compareAtPrice: { amount: 118, currencyCode: "USD" },
    });

    expect(product?.variants[2]).toMatchObject({
      id: "gid://shopify/ProductVariant/2000000003",
      jars: 3,
      price: { amount: 150, currencyCode: "USD" },
      compareAtPrice: { amount: 177, currencyCode: "USD" },
    });
  });

  it("maps selling plans with frequency intervals and discount percentages", async () => {
    const mockFetch = createMockFetch(productBiohackFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const product = await provider.getProduct("biohack");
    expect(product?.sellingPlans).toHaveLength(2);

    expect(product?.sellingPlans[0]).toMatchObject({
      id: "gid://shopify/SellingPlan/3000000001",
      name: "Delivery every 30 days",
      intervalDays: 30,
      discountPercentage: 10,
    });

    expect(product?.sellingPlans[1]).toMatchObject({
      id: "gid://shopify/SellingPlan/3000000002",
      name: "Delivery every 2 months",
      intervalDays: 60,
      discountPercentage: 15,
    });
  });

  it("returns empty array when product has no selling plans", async () => {
    const mockFetch = createMockFetch(productNoSizeFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const product = await provider.getProduct("sample-no-size");
    expect(product?.sellingPlans).toEqual([]);
  });

  it("guarantees every benefit from Shopify gets asterisk and renders as a claim", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const product = await provider.getProduct("sample-no-asterisk");
    expect(product).not.toBeNull();

    // Raw fixture benefits were ["Boosts cellular metabolism", "Improves sleep quality"] without asterisk
    expect(product?.benefits[0]).toBe("Boosts cellular metabolism*");
    expect(product?.benefits[1]).toBe("Improves sleep quality*");

    // Metafield claims mapped with isClaim: true
    expect(product?.claims).toEqual([
      { text: "Boosts cellular metabolism*", isClaim: true },
      { text: "Improves sleep quality*", isClaim: true },
    ]);

    // Renders inside <Claim>
    const benefitsList = product?.benefits ?? [];
    const { container } = render(
      <div>
        {benefitsList.map((b) => (
          <Claim key={b} showDisclaimer={true}>
            {b}
          </Claim>
        ))}
      </div>
    );

    expect(screen.getByText("Boosts cellular metabolism*")).toBeDefined();
    expect(container.querySelectorAll("span.inline").length).toBe(2);
    // FDA notice appears
    expect(
      screen.getAllByText(/These statements have not been evaluated/i).length
    ).toBe(2);
  });

  it("preserves local 3D renders when present, otherwise uses Shopify images or placeholder", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    // biohack has public/renders/biohack.png
    const biohack = await provider.getProduct("biohack");
    expect(biohack?.images).toEqual(["/renders/biohack.png"]);

    // sample-no-size has no local render, but has Shopify image
    const sampleNoSize = await provider.getProduct("sample-no-size");
    expect(sampleNoSize?.images).toEqual([
      "https://cdn.shopify.com/s/files/1/0000/products/sample-no-size.png",
    ]);

    // sample-no-asterisk has neither local render nor Shopify images -> placeholder.svg
    const sampleNoImages = await provider.getProduct("sample-no-asterisk");
    expect(sampleNoImages?.images).toEqual(["/renders/placeholder.svg"]);
  });

  it("filters products by line, species, and format", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const humanProducts = await provider.getProducts({ line: "human" });
    expect(humanProducts.every((p) => p.line === "human")).toBe(true);

    const dogProducts = await provider.getProducts({ species: "dog" });
    expect(dogProducts.every((p) => p.species === "dog")).toBe(true);
    expect(dogProducts.map((p) => p.slug)).toContain("more-good-years");

    const catProducts = await provider.getProducts({ species: "cat" });
    expect(catProducts.every((p) => p.species === "cat")).toBe(true);
    expect(catProducts.map((p) => p.slug)).toContain("cat-longevity");

    const horseProducts = await provider.getProducts({ species: "horse" });
    expect(horseProducts.every((p) => p.species === "horse")).toBe(true);
    expect(horseProducts.map((p) => p.slug)).toContain("horse-vitality");

    const capsuleProducts = await provider.getProducts({ format: "Capsules" });
    expect(capsuleProducts.every((p) => p.format === "Capsules")).toBe(true);
  });

  it("returns collection with parity to mock catalog and null for unknown collection", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const allCollection = await provider.getCollection("all");
    expect(allCollection?.title).toBe("All Products");
    expect(allCollection?.products.length).toBe(6);

    const humanCollection = await provider.getCollection("human");
    expect(humanCollection?.title).toBe("Nadeon Human Longevity");
    expect(humanCollection?.products.every((p) => p.line === "human")).toBe(
      true
    );

    const petCollection = await provider.getCollection("pet");
    expect(petCollection?.title).toBe("Nadeon Pet Longevity");
    expect(petCollection?.products.every((p) => p.line === "pet")).toBe(true);

    const dogsCollection = await provider.getCollection("dogs");
    expect(dogsCollection?.title).toBe("Canine Formulas");
    expect(dogsCollection?.products.every((p) => p.species === "dog")).toBe(
      true
    );

    const unknownCollection =
      await provider.getCollection("invalid-collection");
    expect(unknownCollection).toBeNull();
  });

  it("sorts collections by price-asc, price-desc, and title-asc", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const priceAsc = await provider.getCollection(
      "all",
      undefined,
      "price-asc"
    );
    const prices =
      priceAsc?.products.map((p) => p.variants[0].price.amount) ?? [];
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }

    const priceDesc = await provider.getCollection(
      "all",
      undefined,
      "price-desc"
    );
    const descPrices =
      priceDesc?.products.map((p) => p.variants[0].price.amount) ?? [];
    for (let i = 1; i < descPrices.length; i++) {
      expect(descPrices[i]).toBeLessThanOrEqual(descPrices[i - 1]);
    }

    const titleAsc = await provider.getCollection(
      "all",
      undefined,
      "title-asc"
    );
    const titles = titleAsc?.products.map((p) => p.name) ?? [];
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sortedTitles);
  });

  it("returns null for unknown product handle", async () => {
    const mockFetch = createMockFetch(productNotFoundFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const missing = await provider.getProduct("non-existent-product");
    expect(missing).toBeNull();
  });

  it("searches products by name, technical name, format, or active ingredient", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const res1 = await provider.search("BioHack");
    expect(res1.map((p) => p.slug)).toContain("biohack");

    const res2 = await provider.search("NMN");
    expect(res2.length).toBeGreaterThan(0);

    const res3 = await provider.search("Resveratrol");
    expect(res3.map((p) => p.slug)).toContain("sample-no-size");

    const empty = await provider.search("    ");
    expect(empty).toEqual([]);

    const noMatches = await provider.search("xyznonexistentterm999");
    expect(noMatches).toEqual([]);
  });

  it("kits return empty array / null at launch in live provider", async () => {
    const mockFetch = createMockFetch(productsFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    const kits = await provider.getKits();
    expect(kits).toEqual([]);

    const humanKits = await provider.getKits("human");
    expect(humanKits).toEqual([]);

    const kit = await provider.getKit("any-kit");
    expect(kit).toBeNull();
  });

  it("throws on HTTP error without mock fallback", async () => {
    const mockFetch = vi.fn(async () => ({
      ok: false,
      status: 502,
      text: async () => "Bad Gateway",
    })) as unknown as typeof fetch;

    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    await expect(provider.getProducts()).rejects.toThrow(
      /Shopify Storefront request failed \(502\)/
    );
  });

  it("throws on GraphQL errors without mock fallback", async () => {
    const mockFetch = createMockFetch(graphqlErrorFixture);
    const provider = new LiveCatalogProvider({
      ...credentials,
      fetchImpl: mockFetch,
    });

    await expect(provider.getProducts()).rejects.toThrow(
      /Shopify Storefront GraphQL error.*Storefront access denied/
    );
  });
});
