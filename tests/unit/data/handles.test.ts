import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAllProducts, getAllKits } from "@/data/products";
import {
  getProductTags,
  getKitTags,
  checkRenders,
  generateShopifyHandlesMarkdown,
} from "../../../scripts/shopify-handles.mjs";

const rootDir = path.resolve(__dirname, "../../..");
const rendersDir = path.join(rootDir, "public/renders");
const docPath = path.join(rootDir, "docs/shopify-handles.md");

describe("Shopify Handles and Catalog Integrity", () => {
  const products = getAllProducts();
  const kits = getAllKits();

  it("contains exactly 21 products across human and pet lines", () => {
    expect(products.length).toBe(21);
    const humanCount = products.filter((p) => p.line === "human").length;
    const petCount = products.filter((p) => p.line === "pet").length;
    expect(humanCount).toBe(7);
    expect(petCount).toBe(14);
  });

  it("contains exactly 8 kits across human and pet lines", () => {
    expect(kits.length).toBe(8);
    const humanKits = kits.filter((k) => k.line === "human").length;
    const petKits = kits.filter((k) => k.line === "pet").length;
    expect(humanKits).toBe(4);
    expect(petKits).toBe(4);
  });

  it("ensures all handles follow valid Shopify handle formatting", () => {
    const handleRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const allHandles = new Set<string>();

    for (const product of products) {
      expect(product.handle).toMatch(handleRegex);
      expect(allHandles.has(product.handle)).toBe(false);
      allHandles.add(product.handle);
    }

    for (const kit of kits) {
      expect(kit.handle).toMatch(handleRegex);
      expect(allHandles.has(kit.handle)).toBe(false);
      allHandles.add(kit.handle);
    }

    expect(allHandles.size).toBe(29);
  });

  it("ensures every product has 1, 2, and 3 jars variants with valid SKUs and provisional pricing", () => {
    for (const product of products) {
      expect(product.variants.length).toBe(3);
      const jars = product.variants.map((v) => v.jars).sort();
      expect(jars).toEqual([1, 2, 3]);

      for (const variant of product.variants) {
        expect(variant.sku).toBeDefined();
        expect(variant.sku).toMatch(/^NAD-(HUM|PET)-[A-Z0-9]+-[123]$/);
        expect(variant.price.amount).toBeGreaterThan(0);
        expect(variant.price.currencyCode).toBe("USD");
      }
    }
  });

  it("ensures every product has 3 selling plans (30, 60, 90 days) with discounts", () => {
    for (const product of products) {
      expect(product.sellingPlans.length).toBe(3);
      const intervals = product.sellingPlans
        .map((p) => p.intervalDays)
        .sort((a, b) => a - b);
      expect(intervals).toEqual([30, 60, 90]);

      for (const plan of product.sellingPlans) {
        expect(plan.discountPercentage).toBe(15);
      }
    }
  });

  it("generates correct tags for products and kits", () => {
    const biohack = products.find((p) => p.handle === "biohack");
    expect(biohack).toBeDefined();
    const biohackTags = getProductTags(biohack);
    expect(biohackTags).toContain("line:human");
    expect(biohackTags).toContain("format:capsules");
    expect(biohackTags).toContain("brand:nadeon");
    expect(biohackTags).toContain("subscription:eligible");

    const moreGoodYears = products.find((p) => p.handle === "more-good-years");
    expect(moreGoodYears).toBeDefined();
    const mgyTags = getProductTags(moreGoodYears);
    expect(mgyTags).toContain("line:pet");
    expect(mgyTags).toContain("species:dog");
    expect(mgyTags).toContain("brand:nadeon");
    expect(mgyTags).toContain("subscription:eligible");

    const energyDuo = kits.find((k) => k.handle === "energy-duo");
    expect(energyDuo).toBeDefined();
    const kitTags = getKitTags(energyDuo);
    expect(kitTags).toContain("line:human");
    expect(kitTags).toContain("type:kit");
    expect(kitTags).toContain("bundle");
    expect(kitTags).toContain("brand:nadeon");
  });

  it("detects the 9 copied renders and marks the remaining 12 products and 8 kits as pending", () => {
    const allHandles = [
      ...products.map((p) => p.handle),
      ...kits.map((k) => k.handle),
    ];
    const renders = checkRenders(allHandles, rendersDir);

    const expectedRenders = [
      "biohack",
      "full-charge",
      "renew",
      "powerhouse",
      "daylight",
      "more-good-years",
      "golden-years",
      "still-sharp",
      "shine-on",
    ];

    for (const handle of expectedRenders) {
      const render = renders.get(handle);
      expect(render?.hasRender).toBe(true);
      expect(fs.existsSync(path.join(rendersDir, `${handle}.png`))).toBe(true);
    }

    const pendingProducts = products.filter(
      (p) => !expectedRenders.includes(p.handle)
    );
    expect(pendingProducts.length).toBe(12);
    for (const p of pendingProducts) {
      expect(renders.get(p.handle)?.hasRender).toBe(false);
    }

    for (const k of kits) {
      expect(renders.get(k.handle)?.hasRender).toBe(false);
    }
  });

  it("ensures docs/shopify-handles.md exists and contains all handles and provisional pricing", () => {
    expect(fs.existsSync(docPath)).toBe(true);
    const content = fs.readFileSync(docPath, "utf8");

    // All product handles present
    for (const product of products) {
      expect(content).toContain(`\`${product.handle}\``);
      expect(content).toContain(product.name);
    }

    // All kit handles present
    for (const kit of kits) {
      expect(content).toContain(`\`${kit.handle}\``);
      expect(content).toContain(kit.name);
    }

    // Contains provisional notice and pending markers
    expect(content).toContain("Provisional Pricing Notice");
    expect(content).toContain("**Pendente**");

    // Contains generated structure and headers
    const generated = generateShopifyHandlesMarkdown({
      products,
      kits,
      rendersDir,
    });
    expect(generated).toContain("Master Handles Table");
    expect(generated).toContain("Human Line Products");
    expect(generated).toContain("Pet Line Products");
    expect(generated).toContain("Kits & Bundles");
    expect(content).toContain("Master Handles Table");
    expect(content).toContain("Human Line Products");
    expect(content).toContain("Pet Line Products");
    expect(content).toContain("Kits & Bundles");
  });
});
