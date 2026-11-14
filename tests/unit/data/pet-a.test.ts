import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ProductSchema, type Product } from "@/data/products.schema";

describe("Pet Dogs Catalog Data (pet-a.json)", () => {
  const filePath = path.resolve(process.cwd(), "data/products/pet-a.json");

  it("file exists and is valid JSON", () => {
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(content);
    expect(Array.isArray(parsed)).toBe(true);
  });

  it("contains all 10 real dog products defined in design and catalog", () => {
    const content = fs.readFileSync(filePath, "utf-8");
    const products: Product[] = JSON.parse(content);

    const expectedSlugs = [
      "more-good-years",
      "golden-years",
      "still-sharp",
      "shine-on",
      "good-days",
      "second-wind",
      "more-good-years-oil",
      "golden-years-oil",
      "still-sharp-oil",
      "shine-on-oil",
    ];

    expect(products.length).toBe(10);
    const slugs = products.map((p) => p.slug);
    expect(slugs).toEqual(expectedSlugs);
  });

  it("every product satisfies ProductSchema", () => {
    const content = fs.readFileSync(filePath, "utf-8");
    const products: Product[] = JSON.parse(content);

    for (const product of products) {
      const parsed = ProductSchema.safeParse(product);
      expect(parsed.success).toBe(true);
      expect(product.line).toBe("pet");
      expect(product.species).toBe("dog");
      expect(product.variants.length).toBe(3);
      expect(product.sellingPlans.length).toBe(3);
      expect(product.benefits.length).toBeGreaterThan(0);
      expect(product.claims.length).toBeGreaterThan(0);
    }
  });

  it("has dosingByWeight filled in across the 4 weight bands for all 10 products", () => {
    const content = fs.readFileSync(filePath, "utf-8");
    const products: Product[] = JSON.parse(content);

    for (const product of products) {
      expect(product.dosingByWeight).toHaveLength(4);

      const [band1, band2, band3, band4] = product.dosingByWeight;

      // Band 1: Up to 20 lbs
      expect(band1.minWeightLbs).toBe(0);
      expect(band1.maxWeightLbs).toBe(20);
      expect(band1.servingDescription).toBe("Up to 20 lbs");
      expect(band1.dose.length).toBeGreaterThan(0);

      // Band 2: 21 to 50 lbs
      expect(band2.minWeightLbs).toBe(21);
      expect(band2.maxWeightLbs).toBe(50);
      expect(band2.servingDescription).toBe("21 to 50 lbs");
      expect(band2.dose.length).toBeGreaterThan(0);

      // Band 3: 51 to 90 lbs
      expect(band3.minWeightLbs).toBe(51);
      expect(band3.maxWeightLbs).toBe(90);
      expect(band3.servingDescription).toBe("51 to 90 lbs");
      expect(band3.dose.length).toBeGreaterThan(0);

      // Band 4: Over 90 lbs
      expect(band4.minWeightLbs).toBe(91);
      expect(band4.maxWeightLbs).toBeNull();
      expect(band4.servingDescription).toBe("Over 90 lbs");
      expect(band4.dose.length).toBeGreaterThan(0);
    }
  });

  it("correctly matches formats and prices from the design catalog", () => {
    const content = fs.readFileSync(filePath, "utf-8");
    const products: Product[] = JSON.parse(content);

    const chews = products.filter((p) => p.format === "Soft chews");
    expect(chews).toHaveLength(4);
    for (const chew of chews) {
      expect(chew.variants[0].price.amount).toBe(44);
    }

    const goodDays = products.find((p) => p.slug === "good-days");
    expect(goodDays?.format).toBe("Treats");
    expect(goodDays?.variants[0].price.amount).toBe(29);

    const secondWind = products.find((p) => p.slug === "second-wind");
    expect(secondWind?.format).toBe("Powder");
    expect(secondWind?.variants[0].price.amount).toBe(39);

    const oils = products.filter((p) => p.format === "Oils");
    expect(oils).toHaveLength(4);
    for (const oil of oils) {
      expect(oil.variants[0].price.amount).toBe(44);
    }
  });
});
