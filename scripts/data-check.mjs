import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ProductSchema, KitSchema } from "../lib/contracts/catalog.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const DATA_FILES = [
  {
    name: "human-a.json",
    path: path.join(rootDir, "data/products/human-a.json"),
    hasKits: false,
  },
  {
    name: "human-b.json",
    path: path.join(rootDir, "data/products/human-b.json"),
    hasKits: true,
  },
  {
    name: "pet-a.json",
    path: path.join(rootDir, "data/products/pet-a.json"),
    hasKits: false,
  },
  {
    name: "pet-b.json",
    path: path.join(rootDir, "data/products/pet-b.json"),
    hasKits: true,
  },
];

export function runDataCheck() {
  const allProducts = [];
  const allKits = [];
  const errors = [];

  for (const fileDef of DATA_FILES) {
    if (!fs.existsSync(fileDef.path)) {
      errors.push(`Missing data file: ${fileDef.name} at ${fileDef.path}`);
      continue;
    }

    let parsed;
    try {
      const raw = fs.readFileSync(fileDef.path, "utf8");
      parsed = JSON.parse(raw);
    } catch (err) {
      errors.push(`Invalid JSON in ${fileDef.name}: ${err.message}`);
      continue;
    }

    let productsInFile = [];
    let kitsInFile = [];

    if (fileDef.hasKits) {
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        errors.push(
          `${fileDef.name} must be an object with { products, kits }`
        );
        continue;
      }
      if (!Array.isArray(parsed.products)) {
        errors.push(`${fileDef.name} missing 'products' array`);
      } else {
        productsInFile = parsed.products;
      }
      if (!Array.isArray(parsed.kits)) {
        errors.push(`${fileDef.name} missing 'kits' array`);
      } else {
        kitsInFile = parsed.kits;
      }
    } else {
      if (!Array.isArray(parsed)) {
        errors.push(`${fileDef.name} must be an array of products`);
        continue;
      }
      productsInFile = parsed;
    }

    // Validate products against ProductSchema
    for (let i = 0; i < productsInFile.length; i++) {
      const prod = productsInFile[i];
      const validation = ProductSchema.safeParse(prod);
      if (!validation.success) {
        errors.push(
          `[${fileDef.name}] Product at index ${i} (${prod?.slug || "unknown"}) failed ProductSchema: ${validation.error.message}`
        );
      } else {
        allProducts.push({ source: fileDef.name, data: validation.data });
      }
    }

    // Validate kits against KitSchema
    for (let i = 0; i < kitsInFile.length; i++) {
      const kit = kitsInFile[i];
      const validation = KitSchema.safeParse(kit);
      if (!validation.success) {
        errors.push(
          `[${fileDef.name}] Kit at index ${i} (${kit?.slug || "unknown"}) failed KitSchema: ${validation.error.message}`
        );
      } else {
        allKits.push({ source: fileDef.name, data: validation.data });
      }
    }
  }

  // Check uniqueness of product slugs and handles
  const productSlugs = new Map();
  const productHandles = new Map();

  for (const { source, data } of allProducts) {
    if (productSlugs.has(data.slug)) {
      errors.push(
        `Duplicate product slug "${data.slug}" found in ${source} (already in ${productSlugs.get(data.slug)})`
      );
    } else {
      productSlugs.set(data.slug, source);
    }

    if (productHandles.has(data.handle)) {
      errors.push(
        `Duplicate product handle "${data.handle}" found in ${source} (already in ${productHandles.get(data.handle)})`
      );
    } else {
      productHandles.set(data.handle, source);
    }
  }

  // Check uniqueness of kit slugs and handles
  const kitSlugs = new Map();
  const kitHandles = new Map();

  for (const { source, data } of allKits) {
    if (kitSlugs.has(data.slug)) {
      errors.push(
        `Duplicate kit slug "${data.slug}" found in ${source} (already in ${kitSlugs.get(data.slug)})`
      );
    } else {
      kitSlugs.set(data.slug, source);
    }

    if (kitHandles.has(data.handle)) {
      errors.push(
        `Duplicate kit handle "${data.handle}" found in ${source} (already in ${kitHandles.get(data.handle)})`
      );
    } else {
      kitHandles.set(data.handle, source);
    }

    // Verify all kit products reference existing product slugs
    for (const ref of data.products) {
      if (!productSlugs.has(ref.productSlug)) {
        errors.push(
          `[${source}] Kit "${data.slug}" references nonexistent productSlug "${ref.productSlug}"`
        );
      }
    }
  }

  // Verify total SKU count
  const EXPECTED_PRODUCTS_COUNT = 21;
  if (allProducts.length !== EXPECTED_PRODUCTS_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_PRODUCTS_COUNT} products across all 4 JSON files, found ${allProducts.length}`
    );
  }

  if (errors.length > 0) {
    console.error(`\n❌ Data check failed with ${errors.length} error(s):\n`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    return false;
  }

  console.log(
    `✓ Data check passed: ${allProducts.length} products and ${allKits.length} kits verified across 4 files.`
  );
  console.log(`  All products and kits strictly satisfy Zod schemas.`);
  console.log(
    `  All slugs and handles are unique, and all kit product references are valid.`
  );
  return true;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  const success = runDataCheck();
  process.exit(success ? 0 : 1);
}
