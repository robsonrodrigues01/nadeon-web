import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import {
  ProductSchema,
  KitSchema,
  CollectionSchema,
} from "@/lib/contracts/catalog";

describe("CatalogProvider Contract", () => {
  it("getProducts returns valid products satisfying ProductSchema", async () => {
    const products = await mockCatalogProvider.getProducts();
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      expect(() => ProductSchema.parse(product)).not.toThrow();
      expect("money" in product).toBe(false); // Money is nested in variants
      expect(product.variants.length).toBeGreaterThan(0);
      for (const variant of product.variants) {
        expect(variant.price).toHaveProperty("amount");
        expect(variant.price).toHaveProperty("currencyCode");
      }
    }
  });

  it("filters products by line, species, and format", async () => {
    const humanProducts = await mockCatalogProvider.getProducts({
      line: "human",
    });
    expect(humanProducts.every((p) => p.line === "human")).toBe(true);

    const dogProducts = await mockCatalogProvider.getProducts({
      species: "dog",
    });
    expect(dogProducts.every((p) => p.species === "dog")).toBe(true);

    const capsuleProducts = await mockCatalogProvider.getProducts({
      format: "Capsules",
    });
    expect(capsuleProducts.every((p) => p.format === "Capsules")).toBe(true);
  });

  it("getProduct returns full details for valid slug (BioHack and More Good Years)", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    expect(biohack).not.toBeNull();
    expect(biohack?.name).toBe("BioHack");
    expect(biohack?.line).toBe("human");
    expect(biohack?.actives.length).toBeGreaterThan(0);
    expect(biohack?.sellingPlans.length).toBeGreaterThan(0);
    expect(biohack?.claims.some((c) => c.isClaim)).toBe(true);

    const mgy = await mockCatalogProvider.getProduct("more-good-years");
    expect(mgy).not.toBeNull();
    expect(mgy?.name).toBe("More Good Years");
    expect(mgy?.line).toBe("pet");
    expect(mgy?.species).toBe("dog");
    expect(mgy?.dosingByWeight.length).toBeGreaterThan(0);
  });

  it("getProduct returns null for non-existent slug", async () => {
    const missing = await mockCatalogProvider.getProduct(
      "non-existent-product-12345"
    );
    expect(missing).toBeNull();
  });

  it("getCollection returns valid collection with products", async () => {
    const humanCollection = await mockCatalogProvider.getCollection("human");
    expect(humanCollection).not.toBeNull();
    expect(() => CollectionSchema.parse(humanCollection)).not.toThrow();
    expect(humanCollection?.products.every((p) => p.line === "human")).toBe(
      true
    );

    const nonExistent =
      await mockCatalogProvider.getCollection("invalid-collection");
    expect(nonExistent).toBeNull();
  });

  it("getKits returns valid kits satisfying KitSchema", async () => {
    const kits = await mockCatalogProvider.getKits();
    expect(kits.length).toBeGreaterThan(0);

    for (const kit of kits) {
      expect(() => KitSchema.parse(kit)).not.toThrow();
      expect(kit.price).toHaveProperty("amount");
      expect(kit.price).toHaveProperty("currencyCode");
    }

    const humanKits = await mockCatalogProvider.getKits("human");
    expect(humanKits.every((k) => k.line === "human")).toBe(true);

    const duo = await mockCatalogProvider.getKit("the-duo");
    expect(duo).not.toBeNull();
    expect(duo?.name).toContain("BioHack");
  });

  it("search returns matching products by query", async () => {
    const searchResults = await mockCatalogProvider.search("NAD+");
    expect(searchResults.length).toBeGreaterThan(0);

    const emptyResults = await mockCatalogProvider.search(
      "xyznonexistentterm999"
    );
    expect(emptyResults).toEqual([]);

    const whitespaceResults = await mockCatalogProvider.search("   ");
    expect(whitespaceResults).toEqual([]);
  });

  it("confirms that every image referenced in mock catalog exists in public/", async () => {
    const products = await mockCatalogProvider.getProducts();
    const kits = await mockCatalogProvider.getKits();
    const publicDir = path.resolve(process.cwd(), "public");

    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(product.images.length).toBeGreaterThan(0);
      for (const img of product.images) {
        const relativePath = img.replace(/^\//, "");
        const absolutePath = path.join(publicDir, relativePath);
        expect(
          fs.existsSync(absolutePath),
          `Product image ${img} for ${product.slug} does not exist at ${absolutePath}`
        ).toBe(true);
      }
    }

    expect(kits.length).toBeGreaterThan(0);
    for (const kit of kits) {
      expect(kit.images.length).toBeGreaterThan(0);
      for (const img of kit.images) {
        const relativePath = img.replace(/^\//, "");
        const absolutePath = path.join(publicDir, relativePath);
        expect(
          fs.existsSync(absolutePath),
          `Kit image ${img} for ${kit.slug} does not exist at ${absolutePath}`
        ).toBe(true);
      }
    }

    for (const slug of ["the-duo", "pet-vitality-duo"]) {
      const kit = await mockCatalogProvider.getKit(slug);
      expect(kit).not.toBeNull();
      for (const img of kit!.images) {
        const relativePath = img.replace(/^\//, "");
        const absolutePath = path.join(publicDir, relativePath);
        expect(
          fs.existsSync(absolutePath),
          `Kit image ${img} for fallback ${slug} does not exist at ${absolutePath}`
        ).toBe(true);
      }
    }
  });
});
