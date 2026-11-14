import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ProductSchema, KitSchema } from "../lib/contracts/catalog.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

/**
 * Loads and validates products and kits from catalog data files
 */
export function loadCatalogData(baseDir = rootDir) {
  const dataFiles = [
    {
      name: "human-a.json",
      path: path.join(baseDir, "data/products/human-a.json"),
      hasKits: false,
    },
    {
      name: "human-b.json",
      path: path.join(baseDir, "data/products/human-b.json"),
      hasKits: true,
    },
    {
      name: "pet-a.json",
      path: path.join(baseDir, "data/products/pet-a.json"),
      hasKits: false,
    },
    {
      name: "pet-b.json",
      path: path.join(baseDir, "data/products/pet-b.json"),
      hasKits: true,
    },
  ];

  const rawProducts = [];
  const rawKits = [];

  for (const fileDef of dataFiles) {
    if (!fs.existsSync(fileDef.path)) {
      throw new Error(`Catalog file not found: ${fileDef.path}`);
    }
    const content = JSON.parse(fs.readFileSync(fileDef.path, "utf8"));
    if (fileDef.hasKits) {
      if (Array.isArray(content.products)) {
        rawProducts.push(...content.products);
      }
      if (Array.isArray(content.kits)) {
        rawKits.push(...content.kits);
      }
    } else if (Array.isArray(content)) {
      rawProducts.push(...content);
    }
  }

  const products = rawProducts.map((p, idx) => {
    const res = ProductSchema.safeParse(p);
    if (!res.success) {
      throw new Error(
        `Product schema validation error at index ${idx}: ${res.error.message}`
      );
    }
    return res.data;
  });

  const kits = rawKits.map((k, idx) => {
    const res = KitSchema.safeParse(k);
    if (!res.success) {
      throw new Error(
        `Kit schema validation error at index ${idx}: ${res.error.message}`
      );
    }
    return res.data;
  });

  return { products, kits };
}

/**
 * Determines Shopify tags for a product
 */
export function getProductTags(product) {
  const tags = [`line:${product.line}`];
  if (product.species) {
    tags.push(`species:${product.species}`);
  }
  if (product.format) {
    const formatTag = product.format
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    tags.push(`format:${formatTag}`);
  }
  tags.push("brand:nadeon");
  if (product.sellingPlans && product.sellingPlans.length > 0) {
    tags.push("subscription:eligible");
  }
  return tags;
}

/**
 * Determines Shopify tags for a kit
 */
export function getKitTags(kit) {
  return [
    `line:${kit.line}`,
    "type:kit",
    "bundle",
    "brand:nadeon",
    "subscription:ineligible",
  ];
}

/**
 * Checks for existing render files in the renders directory
 */
export function checkRenders(
  handles,
  rendersDir = path.join(rootDir, "public/renders")
) {
  const rendersMap = new Map();
  const existsDir = fs.existsSync(rendersDir);
  const filesInDir = existsDir ? fs.readdirSync(rendersDir) : [];

  for (const handle of handles) {
    const matchingFile = filesInDir.find((file) => {
      const parsed = path.parse(file);
      return parsed.name === handle;
    });

    if (matchingFile) {
      rendersMap.set(handle, {
        hasRender: true,
        fileName: matchingFile,
        filePath: `public/renders/${matchingFile}`,
      });
    } else {
      rendersMap.set(handle, {
        hasRender: false,
        fileName: null,
        filePath: null,
      });
    }
  }

  return rendersMap;
}

/**
 * Formats money object
 */
export function formatMoney(money) {
  if (!money) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode || "USD",
  }).format(money.amount);
}

/**
 * Generates the full markdown documentation for shopify-handles.md
 * @param {{ products?: any[], kits?: any[], rendersDir?: string }} [options]
 */
export function generateShopifyHandlesMarkdown({
  products,
  kits,
  rendersDir = path.join(rootDir, "public/renders"),
} = {}) {
  const catalog =
    products && kits ? { products, kits } : loadCatalogData(rootDir);
  const allHandles = [
    ...catalog.products.map((p) => p.handle),
    ...catalog.kits.map((k) => k.handle),
  ];
  const renders = checkRenders(allHandles, rendersDir);

  const humanProducts = catalog.products.filter((p) => p.line === "human");
  const petProducts = catalog.products.filter((p) => p.line === "pet");
  const humanKits = catalog.kits.filter((k) => k.line === "human");
  const petKits = catalog.kits.filter((k) => k.line === "pet");

  const renderedProductsCount = catalog.products.filter(
    (p) => renders.get(p.handle)?.hasRender
  ).length;
  const pendingProductsCount = catalog.products.length - renderedProductsCount;

  const renderedKitsCount = catalog.kits.filter(
    (k) => renders.get(k.handle)?.hasRender
  ).length;
  const pendingKitsCount = catalog.kits.length - renderedKitsCount;

  const lines = [];

  lines.push("# Shopify Handles & Product Catalog Setup Guide");
  lines.push("");
  lines.push(
    "> **Status:** Reference table for manual product and bundle entry into Shopify."
  );
  lines.push(
    "> **Provisional Pricing Notice:** All product and kit prices are provisional as designed in the initial product catalog (see `catalogo-telas-nadeon.md`, section 3) and remain subject to final verification before launch."
  );
  lines.push(
    "> **Renders & Label Textures:** Product label images located in `public/renders/<handle>.<ext>`. Products without existing 3D renders/label textures in the design are marked as **Pendente** (pending)."
  );
  lines.push("");

  // Summary Metrics
  lines.push("## Catalog Summary");
  lines.push("");
  lines.push(
    "| Category | Total Count | Renders Available | Pending Renders |"
  );
  lines.push("| :--- | :--- | :--- | :--- |");
  lines.push(
    `| **Human Products (SKUs)** | ${humanProducts.length} | ${humanProducts.filter((p) => renders.get(p.handle)?.hasRender).length} | ${humanProducts.filter((p) => !renders.get(p.handle)?.hasRender).length} |`
  );
  lines.push(
    `| **Pet Products (SKUs)** | ${petProducts.length} | ${petProducts.filter((p) => renders.get(p.handle)?.hasRender).length} | ${petProducts.filter((p) => !renders.get(p.handle)?.hasRender).length} |`
  );
  lines.push(
    `| **Total Products (SKUs)** | **${catalog.products.length}** | **${renderedProductsCount}** | **${pendingProductsCount}** |`
  );
  lines.push(
    `| **Human Kits & Bundles** | ${humanKits.length} | ${humanKits.filter((k) => renders.get(k.handle)?.hasRender).length} | ${humanKits.filter((k) => !renders.get(k.handle)?.hasRender).length} |`
  );
  lines.push(
    `| **Pet Kits & Bundles** | ${petKits.length} | ${petKits.filter((k) => renders.get(k.handle)?.hasRender).length} | ${petKits.filter((k) => !renders.get(k.handle)?.hasRender).length} |`
  );
  lines.push(
    `| **Total Kits & Bundles** | **${catalog.kits.length}** | **${renderedKitsCount}** | **${pendingKitsCount}** |`
  );
  lines.push("");

  // Master Handles Table
  lines.push("## 1. Master Handles Table (21 Products & 8 Kits)");
  lines.push("");
  lines.push(
    "| Item | Type | Handle | Format / Species | Provisional Price (1 Jar / Base) | Variants (1/2/3 Jars) | Selling Plans | Tags | Render Status |"
  );
  lines.push(
    "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |"
  );

  for (const product of catalog.products) {
    const renderInfo = renders.get(product.handle);
    const renderStatus = renderInfo?.hasRender
      ? `\`${renderInfo.fileName}\``
      : "**Pendente**";
    const variant1 = product.variants.find((v) => v.jars === 1);
    const priceStr = variant1 ? formatMoney(variant1.price) : "N/A";
    const variantsSummary = product.variants
      .map((v) => `${v.jars}J: ${formatMoney(v.price)} (${v.sku || "no-sku"})`)
      .join("<br/>");
    const plansSummary = product.sellingPlans
      .map((p) => `${p.intervalDays}d (-${p.discountPercentage}%)`)
      .join(", ");
    const tagsStr = getProductTags(product).join(", ");
    const speciesInfo = product.species ? ` (${product.species})` : "";

    lines.push(
      `| **${product.name}**<br/>_${product.technicalName}_ | Product (${product.line}) | \`${product.handle}\` | ${product.format}${speciesInfo} | ${priceStr} | ${variantsSummary} | ${plansSummary} | \`${tagsStr}\` | ${renderStatus} |`
    );
  }

  for (const kit of catalog.kits) {
    const renderInfo = renders.get(kit.handle);
    const renderStatus = renderInfo?.hasRender
      ? `\`${renderInfo.fileName}\``
      : "**Pendente**";
    const priceStr = formatMoney(kit.price);
    const itemsSummary = kit.products
      .map((p) => `${p.quantity}x \`${p.productSlug}\``)
      .join("<br/>");
    const tagsStr = getKitTags(kit).join(", ");

    lines.push(
      `| **${kit.name}** | Kit (${kit.line}) | \`${kit.handle}\` | Kit / Bundle | ${priceStr} | Included items:<br/>${itemsSummary} | One-time purchase | \`${tagsStr}\` | ${renderStatus} |`
    );
  }
  lines.push("");

  // Detailed Section: Human Products
  lines.push("## 2. Human Line Products (7 SKUs)");
  lines.push("");
  for (const product of humanProducts) {
    const renderInfo = renders.get(product.handle);
    lines.push(`### ${product.name} (\`${product.handle}\`)`);
    lines.push(`- **Technical Name:** ${product.technicalName}`);
    lines.push(`- **Line:** ${product.line}`);
    lines.push(`- **Format:** ${product.format}`);
    lines.push(
      `- **Net Weight / Serving:** ${product.netWeight} (${product.serving})`
    );
    lines.push(`- **Servings Per Jar:** ${product.servingsPerJar}`);
    lines.push(
      `- **Provisional Price (1 Jar):** ${formatMoney(product.variants[0]?.price)}`
    );
    lines.push(`- **Tags:** \`${getProductTags(product).join(", ")}\``);
    lines.push(
      `- **Render / Label Artwork:** ${
        renderInfo?.hasRender
          ? `\`${renderInfo.filePath}\` (Present)`
          : "**Pendente** (Pending label texture / 3D render)"
      }`
    );
    lines.push("- **Variants (1 / 2 / 3 Jars):**");
    for (const variant of product.variants) {
      lines.push(
        `  - **${variant.title}** (${variant.jars} jar${variant.jars > 1 ? "s" : ""}): SKU \`${variant.sku || "N/A"}\` · Price: ${formatMoney(variant.price)} (Compare at: ${formatMoney(variant.compareAtPrice)})`
      );
    }
    lines.push("- **Subscription Selling Plans:**");
    for (const plan of product.sellingPlans) {
      lines.push(
        `  - **${plan.name}**: Interval ${plan.intervalDays} days · Discount ${plan.discountPercentage}%`
      );
    }
    lines.push("");
  }

  // Detailed Section: Pet Products
  lines.push("## 3. Pet Line Products (14 SKUs)");
  lines.push("");
  lines.push(
    "> **Regulatory Notice:** All Pet line products must include *'For animal use only'*. Equine formulas must display *'Not for horses intended for food'*."
  );
  lines.push("");
  for (const product of petProducts) {
    const renderInfo = renders.get(product.handle);
    lines.push(`### ${product.name} (\`${product.handle}\`)`);
    lines.push(`- **Technical Name:** ${product.technicalName}`);
    lines.push(`- **Line:** ${product.line}`);
    lines.push(`- **Species:** ${product.species || "N/A"}`);
    lines.push(`- **Format:** ${product.format}`);
    lines.push(
      `- **Net Weight / Serving:** ${product.netWeight} (${product.serving})`
    );
    lines.push(`- **Servings Per Jar:** ${product.servingsPerJar}`);
    lines.push(
      `- **Provisional Price (1 Jar):** ${formatMoney(product.variants[0]?.price)}`
    );
    lines.push(`- **Tags:** \`${getProductTags(product).join(", ")}\``);
    lines.push(
      `- **Render / Label Artwork:** ${
        renderInfo?.hasRender
          ? `\`${renderInfo.filePath}\` (Present)`
          : "**Pendente** (Pending label texture / 3D render)"
      }`
    );
    lines.push("- **Variants (1 / 2 / 3 Jars):**");
    for (const variant of product.variants) {
      lines.push(
        `  - **${variant.title}** (${variant.jars} jar${variant.jars > 1 ? "s" : ""}): SKU \`${variant.sku || "N/A"}\` · Price: ${formatMoney(variant.price)} (Compare at: ${formatMoney(variant.compareAtPrice)})`
      );
    }
    lines.push("- **Subscription Selling Plans:**");
    for (const plan of product.sellingPlans) {
      lines.push(
        `  - **${plan.name}**: Interval ${plan.intervalDays} days · Discount ${plan.discountPercentage}%`
      );
    }
    lines.push("");
  }

  // Detailed Section: Kits & Bundles
  lines.push("## 4. Kits & Bundles (8 Kits)");
  lines.push("");
  lines.push("### Human Kits");
  lines.push("");
  for (const kit of humanKits) {
    const renderInfo = renders.get(kit.handle);
    lines.push(`#### ${kit.name} (\`${kit.handle}\`)`);
    lines.push(`- **Description:** ${kit.description}`);
    lines.push(
      `- **Provisional Price:** ${formatMoney(kit.price)} (Compare at: ${formatMoney(kit.compareAtPrice)})`
    );
    lines.push(`- **Tags:** \`${getKitTags(kit).join(", ")}\``);
    lines.push(
      `- **Render Artwork:** ${
        renderInfo?.hasRender
          ? `\`${renderInfo.filePath}\` (Present)`
          : "**Pendente** (Pending kit box render)"
      }`
    );
    lines.push("- **Included Products:**");
    for (const ref of kit.products) {
      lines.push(`  - \`${ref.productSlug}\`: ${ref.quantity} unit(s)`);
    }
    lines.push("");
  }

  lines.push("### Pet Kits");
  lines.push("");
  for (const kit of petKits) {
    const renderInfo = renders.get(kit.handle);
    lines.push(`#### ${kit.name} (\`${kit.handle}\`)`);
    lines.push(`- **Description:** ${kit.description}`);
    lines.push(
      `- **Provisional Price:** ${formatMoney(kit.price)} (Compare at: ${formatMoney(kit.compareAtPrice)})`
    );
    lines.push(`- **Tags:** \`${getKitTags(kit).join(", ")}\``);
    lines.push(
      `- **Render Artwork:** ${
        renderInfo?.hasRender
          ? `\`${renderInfo.filePath}\` (Present)`
          : "**Pendente** (Pending kit box render)"
      }`
    );
    lines.push("- **Included Products:**");
    for (const ref of kit.products) {
      lines.push(`  - \`${ref.productSlug}\`: ${ref.quantity} unit(s)`);
    }
    lines.push("");
  }

  // Instructions for manual Shopify input
  lines.push("## 5. Instructions for Manual Shopify Entry");
  lines.push("");
  lines.push(
    "1. **Title & Technical Name:** Use the exact product name as the main Shopify Title, and technical name in subtitle or metafield `custom.technical_name`."
  );
  lines.push(
    "2. **Handle / URL Slug:** Paste the exact handle specified in this table (e.g., `biohack`, `more-good-years`)."
  );
  lines.push(
    "3. **Variants:** Create 3 variants (Option Name: `Quantity` or `Size`): `1 jar`, `2 jars`, and `3 jars`. Configure the corresponding SKU and provisional price."
  );
  lines.push(
    "4. **Selling Plans:** Set up Shopify Subscriptions App selling plans: 30 days (1 jar), 60 days (2 jars), 90 days (3 jars) with 15% discount."
  );
  lines.push(
    "5. **Product Tags:** Add all tags listed in the product section to ensure automatic collection matching."
  );
  lines.push(
    "6. **Images / Media:** Upload the corresponding render from `public/renders/<handle>.png`. If marked **Pendente**, leave placeholder until the official 3D render is produced."
  );
  lines.push("");

  return lines.join("\n");
}

/**
 * Writes the generated documentation to docs/shopify-handles.md
 */
export function writeShopifyHandlesDoc(
  targetPath = path.join(rootDir, "docs/shopify-handles.md")
) {
  const md = generateShopifyHandlesMarkdown();
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetPath, md, "utf8");
  return { path: targetPath, size: Buffer.byteLength(md, "utf8") };
}

// CLI entry point
const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  try {
    const result = writeShopifyHandlesDoc();
    console.log(
      `✓ Successfully generated Shopify handles doc at ${result.path} (${result.size} bytes)`
    );
  } catch (err) {
    console.error(`❌ Error generating Shopify handles doc: ${err.message}`);
    process.exit(1);
  }
}
