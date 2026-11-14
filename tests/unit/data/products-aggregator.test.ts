import { describe, it, expect } from "vitest";
import { getAllProducts, getAllKits, products, kits } from "@/data/products";
import { ProductSchema, KitSchema } from "@/data/products.schema";

describe("Products Aggregator (data/products.ts)", () => {
  it("aggregates exactly 21 SKUs across the 4 data files", () => {
    const all = getAllProducts();
    expect(all).toHaveLength(21);
    expect(products).toHaveLength(21);
  });

  it("aggregates exactly 8 kits across human-b and pet-b", () => {
    const allKits = getAllKits();
    expect(allKits).toHaveLength(8);
    expect(kits).toHaveLength(8);
  });

  it("every aggregated product strictly satisfies ProductSchema", () => {
    for (const product of getAllProducts()) {
      const parsed = ProductSchema.safeParse(product);
      expect(parsed.success).toBe(true);
    }
  });

  it("every aggregated kit strictly satisfies KitSchema", () => {
    for (const kit of getAllKits()) {
      const parsed = KitSchema.safeParse(kit);
      expect(parsed.success).toBe(true);
    }
  });

  it("guarantees unique slugs and handles across all products", () => {
    const all = getAllProducts();
    const slugs = new Set<string>();
    const handles = new Set<string>();

    for (const p of all) {
      expect(slugs.has(p.slug)).toBe(false);
      slugs.add(p.slug);

      expect(handles.has(p.handle)).toBe(false);
      handles.add(p.handle);
    }

    expect(slugs.size).toBe(21);
    expect(handles.size).toBe(21);
  });

  it("guarantees unique slugs and handles across all kits", () => {
    const allKits = getAllKits();
    const slugs = new Set<string>();
    const handles = new Set<string>();

    for (const k of allKits) {
      expect(slugs.has(k.slug)).toBe(false);
      slugs.add(k.slug);

      expect(handles.has(k.handle)).toBe(false);
      handles.add(k.handle);
    }

    expect(slugs.size).toBe(8);
    expect(handles.size).toBe(8);
  });

  it("correctly segments products by line and species", () => {
    const all = getAllProducts();
    const humanProducts = all.filter((p) => p.line === "human");
    const petProducts = all.filter((p) => p.line === "pet");

    // 5 human-a + 2 human-b = 7 human products
    expect(humanProducts).toHaveLength(7);
    // 10 pet-a + 4 pet-b = 14 pet products
    expect(petProducts).toHaveLength(14);

    const dogProducts = all.filter((p) => p.species === "dog");
    const catProducts = all.filter((p) => p.species === "cat");
    const horseProducts = all.filter((p) => p.species === "horse");

    expect(dogProducts).toHaveLength(10);
    expect(catProducts).toHaveLength(2);
    expect(horseProducts).toHaveLength(2);
  });

  it("all kit product references point to existing products in the catalog", () => {
    const productSlugs = new Set(getAllProducts().map((p) => p.slug));
    for (const kit of getAllKits()) {
      for (const ref of kit.products) {
        expect(productSlugs.has(ref.productSlug)).toBe(true);
      }
    }
  });
});
