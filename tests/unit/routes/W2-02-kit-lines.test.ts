import { describe, it, expect } from "vitest";
import { buildKitLines } from "@/app/(human)/human/_components/kit-lines";
import type { Kit, Product } from "@/lib/contracts/catalog";

const variant = (id: string, jars: number) => ({
  id,
  jars,
  title: `${jars} Jar`,
  price: { amount: 50 * jars, currencyCode: "USD" },
});

const product = (slug: string, variants: ReturnType<typeof variant>[]) =>
  ({ slug, variants }) as unknown as Product;

const kit = (productSlugs: Array<[string, number]>) =>
  ({
    slug: "energy-duo",
    products: productSlugs.map(([productSlug, quantity]) => ({
      productSlug,
      quantity,
    })),
  }) as unknown as Kit;

const products = [
  product("biohack", [
    variant("var_biohack_1", 1),
    variant("var_biohack_2", 2),
  ]),
  product("renew", [variant("var_renew_1", 1)]),
];

describe("W2-02 buildKitLines", () => {
  it("maps each kit item to the variant with the same jar count", () => {
    expect(
      buildKitLines(
        kit([
          ["biohack", 1],
          ["renew", 1],
        ]),
        products
      )
    ).toEqual([
      { variantId: "var_biohack_1", quantity: 1 },
      { variantId: "var_renew_1", quantity: 1 },
    ]);
  });

  it("returns no lines when a kit item has no matching variant", () => {
    expect(
      buildKitLines(
        kit([
          ["biohack", 3],
          ["renew", 1],
        ]),
        products
      )
    ).toEqual([]);
  });

  it("returns no lines when the kit is missing", () => {
    expect(buildKitLines(null, products)).toEqual([]);
  });
});
