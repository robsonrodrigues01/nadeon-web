import { describe, it, expect } from "vitest";
import humanBData from "@/data/products/human-b.json";
import { ProductSchema, KitSchema } from "@/data/products.schema";

describe("Human B Dataset (Tinctures and Kits)", () => {
  describe("Products (Powerhouse and Daylight)", () => {
    it("has exactly 2 tinctures", () => {
      expect(humanBData.products).toHaveLength(2);
    });

    it("every product strictly satisfies ProductSchema", () => {
      for (const product of humanBData.products) {
        const parsed = ProductSchema.safeParse(product);
        expect(parsed.success).toBe(true);
        if (!parsed.success) {
          console.error(parsed.error);
        }
      }
    });

    it("validates Powerhouse tincture attributes and pricing from design", () => {
      const powerhouse = humanBData.products.find(
        (p) => p.slug === "powerhouse"
      );
      expect(powerhouse).toBeDefined();
      expect(powerhouse?.name).toBe("Powerhouse");
      expect(powerhouse?.technicalName).toBe("Mito Oil");
      expect(powerhouse?.line).toBe("human");
      expect(powerhouse?.species).toBeNull();
      expect(powerhouse?.format).toBe("Tinctures");
      expect(powerhouse?.variants[0].price.amount).toBe(45);
      expect(powerhouse?.variants[0].price.currencyCode).toBe("USD");
      expect(
        powerhouse?.actives.some(
          (a) => a.name.includes("Ubiquinol") && a.amount === "100 mg"
        )
      ).toBe(true);
      expect(powerhouse?.sellingPlans).toHaveLength(3);
      expect(
        powerhouse?.sellingPlans.every((plan) => plan.discountPercentage === 15)
      ).toBe(true);
      expect(powerhouse?.claims.some((c) => c.isClaim)).toBe(true);
      expect(powerhouse?.dosingByWeight).toEqual([]);
    });

    it("validates Daylight tincture attributes and pricing from design", () => {
      const daylight = humanBData.products.find((p) => p.slug === "daylight");
      expect(daylight).toBeDefined();
      expect(daylight?.name).toBe("Daylight");
      expect(daylight?.technicalName).toBe("D3 + K2");
      expect(daylight?.line).toBe("human");
      expect(daylight?.species).toBeNull();
      expect(daylight?.format).toBe("Tinctures");
      expect(daylight?.variants[0].price.amount).toBe(29);
      expect(daylight?.variants[0].price.currencyCode).toBe("USD");
      expect(
        daylight?.actives.some(
          (a) => a.name.includes("D3") && a.amount === "2,000 IU"
        )
      ).toBe(true);
      expect(
        daylight?.actives.some(
          (a) => a.name.includes("K2") && a.amount === "100 mcg"
        )
      ).toBe(true);
      expect(daylight?.sellingPlans).toHaveLength(3);
      expect(
        daylight?.sellingPlans.every((plan) => plan.discountPercentage === 15)
      ).toBe(true);
      expect(daylight?.claims.some((c) => c.isClaim)).toBe(true);
      expect(daylight?.dosingByWeight).toEqual([]);
    });
  });

  describe("Kits (Energy Duo, Beauty Duo, Morning Stack, Full Routine)", () => {
    it("has exactly 4 kits", () => {
      expect(humanBData.kits).toHaveLength(4);
    });

    it("every kit strictly satisfies KitSchema", () => {
      for (const kit of humanBData.kits) {
        const parsed = KitSchema.safeParse(kit);
        expect(parsed.success).toBe(true);
        if (!parsed.success) {
          console.error(parsed.error);
        }
      }
    });

    it("validates Energy Duo kit", () => {
      const energyDuo = humanBData.kits.find((k) => k.slug === "energy-duo");
      expect(energyDuo).toBeDefined();
      expect(energyDuo?.name).toBe("Energy Duo");
      expect(energyDuo?.line).toBe("human");
      expect(energyDuo?.price.amount).toBe(105);
      expect(energyDuo?.compareAtPrice?.amount).toBe(124);
      expect(energyDuo?.products).toEqual([
        { productSlug: "biohack", quantity: 1 },
        { productSlug: "renew", quantity: 1 },
      ]);
    });

    it("validates Beauty Duo kit", () => {
      const beautyDuo = humanBData.kits.find((k) => k.slug === "beauty-duo");
      expect(beautyDuo).toBeDefined();
      expect(beautyDuo?.name).toBe("Beauty Duo");
      expect(beautyDuo?.line).toBe("human");
      expect(beautyDuo?.price.amount).toBe(92);
      expect(beautyDuo?.compareAtPrice?.amount).toBe(108);
      expect(beautyDuo?.products).toEqual([
        { productSlug: "glow", quantity: 1 },
        { productSlug: "prime", quantity: 1 },
      ]);
    });

    it("validates Morning Stack kit", () => {
      const morningStack = humanBData.kits.find(
        (k) => k.slug === "morning-stack"
      );
      expect(morningStack).toBeDefined();
      expect(morningStack?.name).toBe("Morning Stack");
      expect(morningStack?.line).toBe("human");
      expect(morningStack?.price.amount).toBe(75);
      expect(morningStack?.compareAtPrice?.amount).toBe(88);
      expect(morningStack?.products).toEqual([
        { productSlug: "biohack", quantity: 1 },
        { productSlug: "daylight", quantity: 1 },
      ]);
    });

    it("validates Full Routine kit", () => {
      const fullRoutine = humanBData.kits.find(
        (k) => k.slug === "full-routine"
      );
      expect(fullRoutine).toBeDefined();
      expect(fullRoutine?.name).toBe("Full Routine");
      expect(fullRoutine?.line).toBe("human");
      expect(fullRoutine?.price.amount).toBe(144);
      expect(fullRoutine?.compareAtPrice?.amount).toBe(169);
      expect(fullRoutine?.products).toEqual([
        { productSlug: "biohack", quantity: 1 },
        { productSlug: "renew", quantity: 1 },
        { productSlug: "powerhouse", quantity: 1 },
      ]);
    });
  });
});
