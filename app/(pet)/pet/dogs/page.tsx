import { getVisitorMarket } from "@/lib/market/visitor";
import { MarketProvider } from "@/lib/market/context";
import React from "react";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata, JsonLd } from "@/lib/seo";

import { Hero } from "./_components/hero";
import { DogProductsSection } from "./_components/dog-products-section";
import { DoseByWeightSection } from "./_components/dose-by-weight-section";
import { BundlesSection } from "./_components/bundles-section";
import { CatsAndHorsesSection } from "./_components/cats-and-horses-section";

export const metadata: Metadata = buildMetadata({
  title: "Shop Dog Formulas - Nadeon Pet",
  description:
    "NMN soft chews, treats, oils and powder. Dosed by weight, vet-reviewed, made in our Clifton, NJ lab.",
  pathname: "/pet/dogs",
});

export default async function DogsPage() {
  const market = await getVisitorMarket();
  const bundleKits = await catalogProvider.getKits("pet");
  const [dogProducts, catProducts, horseProducts] = await Promise.all([
    catalogProvider.getProducts({ species: "dog" }),
    catalogProvider.getProducts({ species: "cat" }),
    catalogProvider.getProducts({ species: "horse" }),
  ]);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shop for Dogs - Nadeon Pet",
    description:
      "NMN soft chews, treats, oils and powder. Dosed by weight, vet-reviewed, made in our Clifton, NJ lab.",
    url: "https://nadeonlabs.com/pet/dogs",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: dogProducts.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: p.name,
        url: `https://nadeonlabs.com/pet/products/${p.slug}`,
      })),
    },
  };

  return (
    <MarketProvider initialMarket={market}>
      <>
        <JsonLd data={jsonLdData} id="dogs-collection-ld" />

        <main id="main-content" className="flex-1" tabIndex={-1}>
          {/* 1. Hero Section */}
          <Hero />

          {/* 2. Products Section with NEED & FORMAT filters and sort */}
          <DogProductsSection initialProducts={dogProducts} />

          {/* 3. Dose by weight table */}
          <DoseByWeightSection />

          {/* 4. Chew + oil bundles */}
          <BundlesSection kits={bundleKits} market={market} />

          {/* 5. Cats and Horses Section */}
          <CatsAndHorsesSection products={[...catProducts, ...horseProducts]} />
        </main>
      </>
    </MarketProvider>
  );
}
