import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ProductSchema, KitSchema } from "@/data/products.schema";
import petBData from "@/data/products/pet-b.json";

describe("Pet B Catalog Data (pet-b.json: Cats, Horses & Kits)", () => {
  const filePath = path.resolve(process.cwd(), "data/products/pet-b.json");

  it("file exists and is valid JSON with products and kits keys", () => {
    expect(fs.existsSync(filePath)).toBe(true);
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    expect(parsed).toHaveProperty("products");
    expect(parsed).toHaveProperty("kits");
    expect(Array.isArray(parsed.products)).toBe(true);
    expect(Array.isArray(parsed.kits)).toBe(true);
  });

  describe("Products (High Jump, Purr Mode, Long Stride, Solid Ground)", () => {
    it("contains exactly 4 products", () => {
      expect(petBData.products).toHaveLength(4);
      const slugs = petBData.products.map((p) => p.slug);
      expect(slugs).toEqual([
        "high-jump",
        "purr-mode",
        "long-stride",
        "solid-ground",
      ]);
    });

    it("every product satisfies ProductSchema", () => {
      for (const product of petBData.products) {
        const parsed = ProductSchema.safeParse(product);
        expect(parsed.success).toBe(true);
        expect(product.line).toBe("pet");
        expect(["cat", "horse"]).toContain(product.species);
        expect(product.variants.length).toBe(3);
        expect(product.sellingPlans.length).toBe(3);
        expect(product.benefits.length).toBeGreaterThan(0);
        expect(product.claims.length).toBeGreaterThan(0);
      }
    });

    it("validates High Jump feline drops from design catalog", () => {
      const highJump = petBData.products.find((p) => p.slug === "high-jump");
      expect(highJump).toBeDefined();
      expect(highJump?.name).toBe("High Jump");
      expect(highJump?.species).toBe("cat");
      expect(highJump?.format).toBe("Drops");
      expect(highJump?.variants[0].price.amount).toBe(32);
      expect(highJump?.variants[0].price.currencyCode).toBe("USD");
      expect(
        highJump?.sellingPlans.every((sp) => sp.discountPercentage === 15)
      ).toBe(true);
    });

    it("validates Purr Mode feline drops from design catalog", () => {
      const purrMode = petBData.products.find((p) => p.slug === "purr-mode");
      expect(purrMode).toBeDefined();
      expect(purrMode?.name).toBe("Purr Mode");
      expect(purrMode?.species).toBe("cat");
      expect(purrMode?.format).toBe("Drops");
      expect(purrMode?.variants[0].price.amount).toBe(32);
      expect(purrMode?.variants[0].price.currencyCode).toBe("USD");
      expect(
        purrMode?.sellingPlans.every((sp) => sp.discountPercentage === 15)
      ).toBe(true);
    });

    it("validates Long Stride equine top-dress from design catalog", () => {
      const longStride = petBData.products.find(
        (p) => p.slug === "long-stride"
      );
      expect(longStride).toBeDefined();
      expect(longStride?.name).toBe("Long Stride");
      expect(longStride?.species).toBe("horse");
      expect(longStride?.format).toBe("Top-dress");
      expect(longStride?.variants[0].price.amount).toBe(59);
      expect(longStride?.variants[0].price.currencyCode).toBe("USD");
      expect(
        longStride?.sellingPlans.every((sp) => sp.discountPercentage === 15)
      ).toBe(true);
    });

    it("validates Solid Ground equine top-dress from design catalog", () => {
      const solidGround = petBData.products.find(
        (p) => p.slug === "solid-ground"
      );
      expect(solidGround).toBeDefined();
      expect(solidGround?.name).toBe("Solid Ground");
      expect(solidGround?.species).toBe("horse");
      expect(solidGround?.format).toBe("Top-dress");
      expect(solidGround?.variants[0].price.amount).toBe(59);
      expect(solidGround?.variants[0].price.currencyCode).toBe("USD");
      expect(
        solidGround?.sellingPlans.every((sp) => sp.discountPercentage === 15)
      ).toBe(true);
    });
  });

  describe("Kits (Chew + Oil, Chew + Good Days, Senior Starter, Cat Care)", () => {
    it("contains exactly 4 kits", () => {
      expect(petBData.kits).toHaveLength(4);
      const slugs = petBData.kits.map((k) => k.slug);
      expect(slugs).toEqual([
        "chew-oil",
        "chew-good-days",
        "senior-starter",
        "cat-care",
      ]);
    });

    it("every kit strictly satisfies KitSchema", () => {
      for (const kit of petBData.kits) {
        const parsed = KitSchema.safeParse(kit);
        expect(parsed.success).toBe(true);
        expect(kit.line).toBe("pet");
        expect(kit.price.currencyCode).toBe("USD");
        expect(kit.images.length).toBeGreaterThan(0);
      }
    });

    it("validates Chew + Oil kit pricing and product references", () => {
      const kit = petBData.kits.find((k) => k.slug === "chew-oil");
      expect(kit).toBeDefined();
      expect(kit?.name).toBe("Chew + Oil");
      expect(kit?.price.amount).toBe(75);
      expect(kit?.compareAtPrice?.amount).toBe(88);
      expect(kit?.products).toEqual([
        { productSlug: "more-good-years", quantity: 1 },
        { productSlug: "more-good-years-oil", quantity: 1 },
      ]);
    });

    it("validates Chew + Good Days kit pricing and product references", () => {
      const kit = petBData.kits.find((k) => k.slug === "chew-good-days");
      expect(kit).toBeDefined();
      expect(kit?.name).toBe("Chew + Good Days");
      expect(kit?.price.amount).toBe(62);
      expect(kit?.compareAtPrice?.amount).toBe(73);
      expect(kit?.products).toEqual([
        { productSlug: "more-good-years", quantity: 1 },
        { productSlug: "good-days", quantity: 1 },
      ]);
    });

    it("validates Senior Starter kit pricing and product references", () => {
      const kit = petBData.kits.find((k) => k.slug === "senior-starter");
      expect(kit).toBeDefined();
      expect(kit?.name).toBe("Senior Starter");
      expect(kit?.price.amount).toBe(99);
      expect(kit?.compareAtPrice?.amount).toBe(117);
      expect(kit?.products).toEqual([
        { productSlug: "more-good-years", quantity: 1 },
        { productSlug: "golden-years-oil", quantity: 1 },
        { productSlug: "good-days", quantity: 1 },
      ]);
    });

    it("validates Cat Care kit pricing and product references", () => {
      const kit = petBData.kits.find((k) => k.slug === "cat-care");
      expect(kit).toBeDefined();
      expect(kit?.name).toBe("Cat Care");
      expect(kit?.price.amount).toBe(54);
      expect(kit?.compareAtPrice?.amount).toBe(64);
      expect(kit?.products).toEqual([
        { productSlug: "high-jump", quantity: 1 },
        { productSlug: "purr-mode", quantity: 1 },
      ]);
    });
  });
});
