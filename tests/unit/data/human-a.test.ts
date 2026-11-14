import { describe, it, expect } from "vitest";
import humanAProducts from "@/data/products/human-a.json";
import { ProductSchema } from "@/data/products.schema";

describe("Human A Products Data (Capsules & Powders)", () => {
  it("contains exactly the 5 target products", () => {
    expect(Array.isArray(humanAProducts)).toBe(true);
    expect(humanAProducts).toHaveLength(5);

    const names = humanAProducts.map((p) => p.name);
    expect(names).toEqual(["BioHack", "Full Charge", "Renew", "Glow", "Prime"]);

    const slugs = humanAProducts.map((p) => p.slug);
    expect(slugs).toEqual(["biohack", "full-charge", "renew", "glow", "prime"]);
  });

  it("validates every product against ProductSchema", () => {
    for (const rawProduct of humanAProducts) {
      const parsed = ProductSchema.safeParse(rawProduct);
      if (!parsed.success) {
        // Output detailed validation error if any
        expect.fail(
          `Product ${rawProduct.name} failed schema validation: ${JSON.stringify(parsed.error.format())}`
        );
      }
      expect(parsed.success).toBe(true);
    }
  });

  it("sets line to 'human' and species to null for all products", () => {
    for (const product of humanAProducts) {
      expect(product.line).toBe("human");
      expect(product.species).toBeNull();
    }
  });

  it("assigns the correct formats per design and catalog", () => {
    const formatMap = Object.fromEntries(
      humanAProducts.map((p) => [p.slug, p.format])
    );

    expect(formatMap["biohack"]).toBe("Capsules");
    expect(formatMap["full-charge"]).toBe("Capsules");
    expect(formatMap["renew"]).toBe("Capsules");
    expect(formatMap["glow"]).toBe("Powders");
    expect(formatMap["prime"]).toBe("Powders");
  });

  it("includes variants for 1, 2, and 3 jars for every product", () => {
    for (const product of humanAProducts) {
      expect(product.variants).toHaveLength(3);

      const jars = product.variants.map((v) => v.jars);
      expect(jars).toEqual([1, 2, 3]);

      for (const variant of product.variants) {
        expect(variant.price.amount).toBeGreaterThan(0);
        expect(variant.price.currencyCode).toBe("USD");
        expect(variant.compareAtPrice?.amount).toBeGreaterThanOrEqual(
          variant.price.amount
        );
        expect(variant.sku).toBeDefined();
      }

      // 1 jar base price matches design
      const basePrice = product.variants[0].price.amount;
      if (product.slug === "biohack") expect(basePrice).toBe(59);
      if (product.slug === "full-charge") expect(basePrice).toBe(69);
      if (product.slug === "renew") expect(basePrice).toBe(65);
      if (product.slug === "glow") expect(basePrice).toBe(59);
      if (product.slug === "prime") expect(basePrice).toBe(49);

      // Multi-jar discount verifies compareAtPrice corresponds to unit multiples
      expect(product.variants[1].compareAtPrice?.amount).toBe(basePrice * 2);
      expect(product.variants[2].compareAtPrice?.amount).toBe(basePrice * 3);
    }
  });

  it("includes selling plans (30, 60, 90 days) with 15% discount for every product", () => {
    for (const product of humanAProducts) {
      expect(product.sellingPlans).toHaveLength(3);

      const intervals = product.sellingPlans.map((p) => p.intervalDays);
      expect(intervals).toEqual([30, 60, 90]);

      for (const plan of product.sellingPlans) {
        expect(plan.discountPercentage).toBe(15);
        expect(plan.name).toBeDefined();
        expect(plan.id).toBeDefined();
      }
    }
  });

  it("defines active ingredients, benefits, howToUse, and lab transparency", () => {
    for (const product of humanAProducts) {
      expect(product.actives.length).toBeGreaterThan(0);
      for (const active of product.actives) {
        expect(active.name.length).toBeGreaterThan(0);
        expect(active.amount.length).toBeGreaterThan(0);
      }

      expect(product.benefits.length).toBeGreaterThan(0);
      expect(product.howToUse.length).toBeGreaterThan(0);
      expect(product.servingsPerJar).toBe(30);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.dosingByWeight).toEqual([]);
    }
  });

  it("complies with FDA claims rule: statements with asterisks must have isClaim: true", () => {
    for (const product of humanAProducts) {
      expect(product.claims.length).toBeGreaterThan(0);
      for (const claim of product.claims) {
        if (claim.text.includes("*")) {
          expect(claim.isClaim).toBe(true);
        }
      }
    }
  });
});
