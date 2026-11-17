import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { getVisitorMarket } from "@/lib/market/visitor";
import { CompareFormulas } from "./_components/compare-formulas";

export const metadata: Metadata = buildMetadata({
  title: "Compare formulas | Nadeon Human",
  description: "To be confirmed.",
  pathname: "/human/compare",
});

export default async function ComparePage() {
  const [products, market] = await Promise.all([
    catalogProvider.getProducts({ line: "human" }),
    getVisitorMarket(),
  ]);

  return (
    <main id="main-content" className="flex-1 bg-bg text-fg" tabIndex={-1}>
      <CompareFormulas products={products} market={market} />
    </main>
  );
}
