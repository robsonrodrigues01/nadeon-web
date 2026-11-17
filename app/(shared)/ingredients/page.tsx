import type { Metadata } from "next";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { getVisitorMarket } from "@/lib/market/visitor";
import { catalogProvider, contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { IngredientGlossary } from "./_components/ingredient-glossary";

export const metadata: Metadata = buildMetadata({
  title: "Ingredients glossary | Nadeon",
  description: "To be confirmed.",
  pathname: "/ingredients",
});

export default async function IngredientsPage() {
  const [glossary, ingredients, products, market] = await Promise.all([
    contentProvider.getIngredientGlossary(),
    contentProvider.listIngredients(),
    catalogProvider.getProducts(),
    getVisitorMarket(),
  ]);

  const entries = ingredients.map((ingredient) => ({
    ingredient,
    products: products.flatMap((product) => {
      const active = product.actives.find(
        (item) =>
          item.name.trim().toLowerCase() ===
          ingredient.name.trim().toLowerCase()
      );
      if (!active) return [];
      const variant = product.variants[0];
      return [
        {
          name: product.name,
          format: product.format,
          dose: active.amount,
          price: variant
            ? formatMoneyWithMarket(variant.price, market)
            : "To be confirmed",
          href: `/${product.line}/products/${encodeURIComponent(product.slug)}`,
        },
      ];
    }),
  }));

  return (
    <main id="main-content" className="flex-1 bg-bg text-fg" tabIndex={-1}>
      <IngredientGlossary glossary={glossary} entries={entries} />
    </main>
  );
}
