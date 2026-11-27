import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadProducts } from "./check-shopify-catalog.mjs";

const NAMESPACE = "nadeon";

const text = (key, name, description) => ({
  key,
  name,
  description,
  type: "single_line_text_field",
});

export const METAFIELD_DEFINITIONS = [
  text(
    "technical_name",
    "Technical name",
    "Subtitle under the product name, e.g. NMN 500 mg"
  ),
  text("line", "Line", "human or pet"),
  text("species", "Species", "dog, cat or horse (pet line only)"),
  text("format", "Format", "Capsules, Soft chews, Oils..."),
  {
    key: "color",
    name: "Brand color",
    description: "Label color used on the site",
    type: "color",
  },
  text("serving", "Serving", "How much to take per serving"),
  {
    key: "servings_per_jar",
    name: "Servings per jar",
    description: "Number of servings in one jar",
    type: "number_integer",
  },
  text("net_weight", "Net weight", "Contents of one jar, e.g. 60 capsules"),
  {
    key: "how_to_use",
    name: "How to use",
    description: "Usage instructions",
    type: "multi_line_text_field",
  },
  {
    key: "benefits",
    name: "Benefits",
    description: "Every benefit is shown as a claim with the FDA disclaimer",
    type: "list.single_line_text_field",
  },
  {
    key: "claims",
    name: "Claims",
    description: "Every item is shown as a claim with the FDA disclaimer",
    type: "list.single_line_text_field",
  },
  {
    key: "related",
    name: "Related products",
    description: "Handles of related products",
    type: "list.single_line_text_field",
  },
  {
    key: "actives",
    name: "Active ingredients",
    description: "JSON list of {name, amount}",
    type: "json",
  },
  {
    key: "faq",
    name: "FAQ",
    description: "JSON list of {question, answer}",
    type: "json",
  },
  {
    key: "dosing_by_weight",
    name: "Dosing by weight",
    description:
      "JSON list of {minWeightLbs, maxWeightLbs, dose, servingDescription}",
    type: "json",
  },
];

const TYPES = new Map(METAFIELD_DEFINITIONS.map((d) => [d.key, d.type]));

const SIZE_KEYS = new Set([
  "net_weight",
  "servings_per_jar",
  "serving",
  "dosing_by_weight",
]);

export function buildContentMetafields(product, { skipSize = false } = {}) {
  const values = {
    technical_name: product.technicalName,
    line: product.line,
    species: product.species,
    format: product.format,
    color: product.color?.toUpperCase(),
    serving: product.serving,
    servings_per_jar:
      product.servingsPerJar == null ? null : String(product.servingsPerJar),
    net_weight: product.netWeight,
    how_to_use: product.howToUse,
    benefits: listValue(product.benefits),
    claims: listValue(product.claims?.map((claim) => claim.text)),
    related: listValue(product.related),
    actives: listValue(product.actives),
    faq: listValue(product.faq),
    dosing_by_weight: listValue(product.dosingByWeight),
  };
  return Object.entries(values)
    .filter(([, value]) => value != null && value !== "")
    .filter(([key]) => !(skipSize && SIZE_KEYS.has(key)))
    .map(([key, value]) => ({
      namespace: NAMESPACE,
      key,
      type: TYPES.get(key),
      value,
    }));
}

function listValue(list) {
  return Array.isArray(list) && list.length ? JSON.stringify(list) : null;
}

const DEFINITIONS_QUERY = `query ExistingDefinitions { metafieldDefinitions(first: 100, ownerType: PRODUCT, namespace: "${NAMESPACE}") { nodes { key } } }`;
const PRODUCT_QUERY = `query ProductId($handle: String!) { productByIdentifier(identifier: { handle: $handle }) { id } }`;
const CREATE_DEFINITION = `mutation CreateDefinition($definition: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $definition) { createdDefinition { id } userErrors { field message } } }`;
const SET_METAFIELDS = `mutation SetContent($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { metafields { key } userErrors { field message } } }`;

function assertNoUserErrors(label, userErrors) {
  if (userErrors?.length)
    throw new Error(`${label}: ${userErrors.map((e) => e.message).join("; ")}`);
}

/**
 * @param {{
 *   products: object[];
 *   execute: (query: string, variables?: object, options?: { mutation?: boolean }) => Promise<any>;
 *   apply?: boolean;
 *   skipSizeFor?: string[];
 * }} options
 */
export async function syncProductContent({
  products,
  execute,
  apply = false,
  skipSizeFor = [],
}) {
  const skipSize = new Set(skipSizeFor);
  const existing = await execute(DEFINITIONS_QUERY);
  const existingKeys = new Set(
    existing.metafieldDefinitions.nodes.map((node) => node.key)
  );
  const missingDefinitions = METAFIELD_DEFINITIONS.filter(
    (definition) => !existingKeys.has(definition.key)
  );

  if (apply) {
    for (const definition of missingDefinitions) {
      const result = await execute(
        CREATE_DEFINITION,
        {
          definition: {
            ...definition,
            namespace: NAMESPACE,
            ownerType: "PRODUCT",
            access: { storefront: "PUBLIC_READ" },
          },
        },
        { mutation: true }
      );
      assertNoUserErrors(
        `definition ${definition.key}`,
        result.metafieldDefinitionCreate.userErrors
      );
    }
  }

  const productsFound = [];
  const productsMissing = [];
  let metafieldsWritten = 0;
  for (const product of products) {
    const found = await execute(PRODUCT_QUERY, { handle: product.handle });
    const id = found.productByIdentifier?.id;
    if (!id) {
      productsMissing.push(product.handle);
      continue;
    }
    productsFound.push(product.handle);
    const metafields = buildContentMetafields(product, {
      skipSize: skipSize.has(product.handle),
    }).map((field) => ({
      ...field,
      ownerId: id,
    }));
    if (apply) {
      const result = await execute(
        SET_METAFIELDS,
        { metafields },
        { mutation: true }
      );
      assertNoUserErrors(product.handle, result.metafieldsSet.userErrors);
      metafieldsWritten += metafields.length;
    }
  }

  return {
    applied: apply,
    definitionsToCreate: missingDefinitions.map((definition) => definition.key),
    productsFound,
    productsMissing,
    metafieldsWritten,
  };
}

/** Runs GraphQL through the Shopify CLI, which holds the store login made by `shopify store auth`. */
export function createCliExecutor({ store, cli = "shopify" }) {
  return async (query, variables = {}, { mutation = false } = {}) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nadeon-shopify-"));
    try {
      const queryFile = path.join(dir, "query.graphql");
      const variableFile = path.join(dir, "variables.json");
      const outputFile = path.join(dir, "output.json");
      fs.writeFileSync(queryFile, query);
      fs.writeFileSync(variableFile, JSON.stringify(variables));
      execFileSync(
        cli,
        [
          "store",
          "execute",
          "--store",
          store,
          "--no-input",
          "--query-file",
          queryFile,
          "--variable-file",
          variableFile,
          "--output-file",
          outputFile,
          ...(mutation ? ["--allow-mutations"] : []),
        ],
        { stdio: ["ignore", "ignore", "pipe"] }
      );
      const output = JSON.parse(fs.readFileSync(outputFile, "utf8"));
      return output.data ?? output;
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  };
}

const isCli =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const apply = process.argv.includes("--apply");
  const skipSizeArg = process.argv.find((arg) =>
    arg.startsWith("--skip-size=")
  );
  const skipSizeFor = skipSizeArg
    ? skipSizeArg.slice("--skip-size=".length).split(",").filter(Boolean)
    : [];
  if (!store) {
    console.error(
      "Defina SHOPIFY_STORE_DOMAIN (use node --env-file=.env.local)."
    );
    process.exitCode = 2;
  } else {
    try {
      const summary = await syncProductContent({
        products: loadProducts(),
        execute: createCliExecutor({
          store,
          cli: process.env.SHOPIFY_CLI ?? "shopify",
        }),
        apply,
        skipSizeFor,
      });
      console.log(JSON.stringify(summary, null, 2));
      if (!apply)
        console.log("Dry-run: nada foi gravado. Rode com --apply para gravar.");
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
