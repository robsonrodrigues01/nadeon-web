import {
  ProductSchema,
  KitSchema,
  type Product,
  type Kit,
} from "@/data/products.schema";
import humanAProducts from "@/data/products/human-a.json";
import humanBData from "@/data/products/human-b.json";
import petAProducts from "@/data/products/pet-a.json";
import petBData from "@/data/products/pet-b.json";

function loadAndValidateCatalog(): { products: Product[]; kits: Kit[] } {
  const rawProducts = [
    ...(humanAProducts as unknown[]),
    ...(humanBData.products as unknown[]),
    ...(petAProducts as unknown[]),
    ...(petBData.products as unknown[]),
  ];

  const rawKits = [
    ...(humanBData.kits as unknown[]),
    ...(petBData.kits as unknown[]),
  ];

  const validatedProducts: Product[] = rawProducts.map((p, index) => {
    const result = ProductSchema.safeParse(p);
    if (!result.success) {
      throw new Error(
        `Product schema validation failed at index ${index}: ${result.error.message}`
      );
    }
    return result.data;
  });

  const validatedKits: Kit[] = rawKits.map((k, index) => {
    const result = KitSchema.safeParse(k);
    if (!result.success) {
      throw new Error(
        `Kit schema validation failed at index ${index}: ${result.error.message}`
      );
    }
    return result.data;
  });

  // Verify product slugs and handles uniqueness
  const productSlugs = new Set<string>();
  const productHandles = new Set<string>();
  for (const product of validatedProducts) {
    if (productSlugs.has(product.slug)) {
      throw new Error(`Duplicate product slug detected: "${product.slug}"`);
    }
    productSlugs.add(product.slug);

    if (productHandles.has(product.handle)) {
      throw new Error(`Duplicate product handle detected: "${product.handle}"`);
    }
    productHandles.add(product.handle);
  }

  // Verify kit slugs and handles uniqueness
  const kitSlugs = new Set<string>();
  const kitHandles = new Set<string>();
  for (const kit of validatedKits) {
    if (kitSlugs.has(kit.slug)) {
      throw new Error(`Duplicate kit slug detected: "${kit.slug}"`);
    }
    kitSlugs.add(kit.slug);

    if (kitHandles.has(kit.handle)) {
      throw new Error(`Duplicate kit handle detected: "${kit.handle}"`);
    }
    kitHandles.add(kit.handle);
  }

  return { products: validatedProducts, kits: validatedKits };
}

const { products, kits } = loadAndValidateCatalog();

export { products, kits };

export function getAllProducts(): Product[] {
  return [...products];
}

export function getAllKits(): Kit[] {
  return [...kits];
}
