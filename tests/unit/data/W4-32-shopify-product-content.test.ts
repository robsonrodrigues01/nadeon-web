import { describe, expect, it } from "vitest";
import {
  METAFIELD_DEFINITIONS,
  buildContentMetafields,
  syncProductContent,
} from "../../../scripts/shopify-product-content.mjs";

const product = {
  handle: "sample-chew",
  name: "Sample Chew",
  technicalName: "Senior · NMN 75 mg",
  line: "pet",
  species: "dog",
  format: "Soft chews",
  color: "#ffc35a",
  images: ["/renders/sample.png"],
  actives: [{ name: "NMN", amount: "75 mg" }],
  serving: "1 to 4 soft chews depending on weight",
  servingsPerJar: 60,
  netWeight: "60 soft chews",
  variants: [],
  sellingPlans: [],
  benefits: ["Supports energy*", "Made in the USA"],
  howToUse: "Give daily with food.",
  faq: [{ question: "Is it safe?", answer: "Talk to your vet.*" }],
  related: ["other-chew"],
  claims: [
    { text: "Supports energy*", isClaim: true },
    { text: "Vet formulated", isClaim: false },
  ],
  dosingByWeight: [
    {
      minWeightLbs: 0,
      maxWeightLbs: 25,
      dose: "1 chew",
      servingDescription: "1 chew daily",
    },
  ],
};

type Field = {
  namespace: string;
  key: string;
  type: string | undefined;
  value: string;
};
const byKey = (fields: Field[]): Record<string, Field> =>
  Object.fromEntries(fields.map((f) => [f.key, f]));

describe("W4-32 buildContentMetafields", () => {
  it("maps every content field to a typed metafield in the nadeon namespace", () => {
    const fields = byKey(buildContentMetafields(product));

    expect(Object.values(fields).every((f) => f.namespace === "nadeon")).toBe(
      true
    );
    expect(fields.technical_name).toMatchObject({
      type: "single_line_text_field",
      value: "Senior · NMN 75 mg",
    });
    expect(fields.line.value).toBe("pet");
    expect(fields.species.value).toBe("dog");
    expect(fields.format.value).toBe("Soft chews");
    expect(fields.color).toMatchObject({ type: "color", value: "#FFC35A" });
    expect(fields.serving.value).toBe("1 to 4 soft chews depending on weight");
    expect(fields.servings_per_jar).toMatchObject({
      type: "number_integer",
      value: "60",
    });
    expect(fields.net_weight.value).toBe("60 soft chews");
    expect(fields.how_to_use).toMatchObject({
      type: "multi_line_text_field",
      value: "Give daily with food.",
    });
    expect(fields.benefits).toMatchObject({
      type: "list.single_line_text_field",
      value: '["Supports energy*","Made in the USA"]',
    });
    expect(fields.claims.value).toBe('["Supports energy*","Vet formulated"]');
    expect(fields.related.value).toBe('["other-chew"]');
    expect(fields.actives).toMatchObject({
      type: "json",
      value: '[{"name":"NMN","amount":"75 mg"}]',
    });
    expect(JSON.parse(fields.faq.value)).toEqual(product.faq);
    expect(JSON.parse(fields.dosing_by_weight.value)).toEqual(
      product.dosingByWeight
    );
  });

  it("only uses keys and types that have a definition", () => {
    const definitions = new Map(
      METAFIELD_DEFINITIONS.map((d) => [d.key, d.type])
    );
    for (const field of buildContentMetafields(product)) {
      expect(definitions.get(field.key)).toBe(field.type);
    }
  });

  it("skips empty optional content instead of writing blanks", () => {
    const fields = byKey(
      buildContentMetafields({
        ...product,
        species: null,
        dosingByWeight: [],
        related: [],
      })
    );
    expect(fields.species).toBeUndefined();
    expect(fields.dosing_by_weight).toBeUndefined();
    expect(fields.related).toBeUndefined();
  });
});

type Variables = {
  handle?: string;
  definition?: { ownerType: string; access: { storefront: string } };
  metafields?: { ownerId: string }[];
};
type Call = {
  query: string;
  variables: Variables;
  mutation: boolean;
};
type UserError = { field: string[]; message: string };

function fakeShopify({
  existingKeys = [] as string[],
  productIds = {} as Record<string, string>,
  userErrors = [] as UserError[],
}) {
  const calls: Call[] = [];
  const execute = async (
    query: string,
    variables: Variables = {},
    options: { mutation?: boolean } = {}
  ) => {
    calls.push({ query, variables, mutation: Boolean(options.mutation) });
    if (query.includes("metafieldDefinitions"))
      return {
        metafieldDefinitions: { nodes: existingKeys.map((key) => ({ key })) },
      };
    if (query.includes("productByIdentifier")) {
      const id = productIds[variables.handle ?? ""];
      return { productByIdentifier: id ? { id } : null };
    }
    if (query.includes("metafieldDefinitionCreate"))
      return {
        metafieldDefinitionCreate: {
          createdDefinition: { id: "d" },
          userErrors,
        },
      };
    if (query.includes("metafieldsSet"))
      return { metafieldsSet: { metafields: [], userErrors } };
    throw new Error(`unexpected query: ${query.slice(0, 40)}`);
  };
  return { calls, execute };
}

describe("W4-32 syncProductContent", () => {
  const products = [product, { ...product, handle: "not-in-shopify" }];

  it("dry-run reads the store and never sends a mutation", async () => {
    const shop = fakeShopify({
      existingKeys: ["technical_name"],
      productIds: { "sample-chew": "gid://shopify/Product/1" },
    });

    const summary = await syncProductContent({
      products,
      execute: shop.execute,
      apply: false,
    });

    expect(shop.calls.some((c) => c.mutation)).toBe(false);
    expect(summary.applied).toBe(false);
    expect(summary.definitionsToCreate).toHaveLength(
      METAFIELD_DEFINITIONS.length - 1
    );
    expect(summary.definitionsToCreate).not.toContain("technical_name");
    expect(summary.productsFound).toEqual(["sample-chew"]);
    expect(summary.productsMissing).toEqual(["not-in-shopify"]);
  });

  it("apply creates only missing definitions and writes each found product", async () => {
    const shop = fakeShopify({
      existingKeys: ["technical_name"],
      productIds: { "sample-chew": "gid://shopify/Product/1" },
    });

    const summary = await syncProductContent({
      products,
      execute: shop.execute,
      apply: true,
    });

    const creates = shop.calls.filter((c) =>
      c.query.includes("metafieldDefinitionCreate")
    );
    expect(creates).toHaveLength(METAFIELD_DEFINITIONS.length - 1);
    expect(creates.every((c) => c.mutation)).toBe(true);
    expect(
      creates.every(
        (c) =>
          c.variables.definition?.ownerType === "PRODUCT" &&
          c.variables.definition?.access.storefront === "PUBLIC_READ"
      )
    ).toBe(true);

    const sets = shop.calls.filter((c) => c.query.includes("metafieldsSet"));
    expect(sets).toHaveLength(1);
    expect(sets[0].mutation).toBe(true);
    expect(
      sets[0].variables.metafields?.every(
        (m) => m.ownerId === "gid://shopify/Product/1"
      )
    ).toBe(true);
    expect(summary.applied).toBe(true);
    expect(summary.productsMissing).toEqual(["not-in-shopify"]);
  });

  it("stops on Shopify user errors instead of reporting success", async () => {
    const shop = fakeShopify({
      existingKeys: METAFIELD_DEFINITIONS.map((d) => d.key),
      productIds: { "sample-chew": "gid://shopify/Product/1" },
      userErrors: [{ field: ["value"], message: "Value is invalid" }],
    });

    await expect(
      syncProductContent({
        products: [product],
        execute: shop.execute,
        apply: true,
      })
    ).rejects.toThrow(/sample-chew.*Value is invalid/);
  });
});
