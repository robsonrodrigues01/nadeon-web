import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API_VERSION = "2026-10";

export function loadProducts(dataDir = path.join(rootDir, "data/products")) {
  return fs.readdirSync(dataDir).filter((name) => name.endsWith(".json")).flatMap((name) => {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
    return Array.isArray(data) ? data : data.products ?? [];
  });
}

export async function fetchShopifyProducts(handles, { domain, token, fetchImpl = fetch }) {
  const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`;
  const query = `query CatalogCheck($handle: String!) { product(handle: $handle) { handle variants(first: 100) { nodes { sku title price { amount currencyCode } compareAtPrice { amount currencyCode } } } sellingPlanGroups(first: 100) { nodes { sellingPlans(first: 100) { nodes { name options { name value } priceAdjustments { adjustmentValue { ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage } } } } } } } } }`;
  const products = [];
  for (const handle of handles) {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", "x-shopify-storefront-access-token": token },
      body: JSON.stringify({ query, variables: { handle } }),
    });
    if (!response.ok) throw new Error(`Shopify request failed (${response.status}) for ${handle}`);
    const body = await response.json();
    if (body.errors?.length) throw new Error(`Shopify GraphQL error for ${handle}: ${body.errors.map((error) => error.message).join("; ")}`);
    if (body.data?.product) products.push(normalizeShopifyProduct(body.data.product));
  }
  return products;
}

function normalizeShopifyProduct(product) {
  return {
    handle: product.handle,
    variants: product.variants.nodes.map((variant) => ({ sku: variant.sku, title: variant.title, price: variant.price, compareAtPrice: variant.compareAtPrice })),
    sellingPlans: product.sellingPlanGroups.nodes.flatMap((group) => group.sellingPlans.nodes.map((plan) => ({
      name: plan.name,
      intervalDays: Number(plan.options.find((option) => /delivery frequency|frequency/i.test(option.name))?.value?.match(/\d+/)?.[0]) || Number(plan.name.match(/every\s+(\d+)\s+days?/i)?.[1]) || null,
      discountPercentage: plan.priceAdjustments[0]?.adjustmentValue?.adjustmentPercentage ?? 0,
    }))),
  };
}

export function compareCatalog(localProducts, shopifyProducts) {
  const differences = [];
  const remoteByHandle = new Map(shopifyProducts.map((product) => [product.handle, product]));
  for (const local of localProducts) {
    const remote = remoteByHandle.get(local.handle);
    if (!remote) {
      differences.push(`${local.handle}: produto ausente na Shopify`);
      continue;
    }
    for (const variant of local.variants) {
      const actual = remote.variants.find((candidate) => candidate.sku === variant.sku);
      if (!actual) {
        differences.push(`${local.handle}: variante ${variant.sku ?? variant.title} ausente na Shopify`);
        continue;
      }
      if (Number(actual.price.amount) !== Number(variant.price.amount) || actual.price.currencyCode !== variant.price.currencyCode) {
        differences.push(`${local.handle}: preço de ${variant.sku ?? variant.title} difere (local ${variant.price.amount} ${variant.price.currencyCode}, Shopify ${actual.price.amount} ${actual.price.currencyCode})`);
      }
      if (variant.compareAtPrice && (!actual.compareAtPrice || Number(actual.compareAtPrice.amount) !== Number(variant.compareAtPrice.amount) || actual.compareAtPrice.currencyCode !== variant.compareAtPrice.currencyCode)) {
        differences.push(`${local.handle}: preço de comparação de ${variant.sku ?? variant.title} difere`);
      }
    }
    for (const variant of remote.variants) {
      if (!local.variants.some((candidate) => candidate.sku === variant.sku)) differences.push(`${local.handle}: variante Shopify ${variant.sku ?? variant.title} não existe no catálogo local`);
    }
    for (const plan of local.sellingPlans) {
      if (!remote.sellingPlans.some((candidate) => candidate.intervalDays === plan.intervalDays && candidate.discountPercentage === plan.discountPercentage)) {
        differences.push(`${local.handle}: selling plan de ${plan.intervalDays} dias com ${plan.discountPercentage}% de desconto ausente na Shopify`);
      }
    }
    for (const plan of remote.sellingPlans) {
      if (!local.sellingPlans.some((candidate) => candidate.intervalDays === plan.intervalDays && candidate.discountPercentage === plan.discountPercentage)) {
        differences.push(`${local.handle}: selling plan Shopify de ${plan.intervalDays ?? "frequência desconhecida"} dias com ${plan.discountPercentage}% não existe no catálogo local`);
      }
    }
  }
  for (const product of shopifyProducts) {
    if (!localProducts.some((candidate) => candidate.handle === product.handle)) differences.push(`${product.handle}: produto Shopify não existe no catálogo local`);
  }
  return differences;
}

export async function checkCatalog({ products = loadProducts(), fetchProducts = fetchShopifyProducts, credentials } = {}) {
  const remote = await fetchProducts(products.map((product) => product.handle), credentials);
  return compareCatalog(products, remote);
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) {
    console.error("Credenciais ausentes: defina SHOPIFY_STORE_DOMAIN e SHOPIFY_STOREFRONT_ACCESS_TOKEN.");
    process.exitCode = 2;
  } else {
    try {
      const differences = await checkCatalog({ credentials: { domain, token } });
      if (differences.length) {
        console.error(`Catálogo Shopify diverge (${differences.length} diferenças):\n${differences.map((item) => `- ${item}`).join("\n")}`);
        process.exitCode = 1;
      } else console.log("Catálogo local corresponde à Shopify.");
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
