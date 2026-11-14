import React from "react";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata, DEFAULT_SITE_URL, JsonLd } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrustStrip } from "@/components/brand/trust-strip";
import type { Product } from "@/lib/contracts/catalog";

import {
  averageKitSavingsPercent,
  buildKitView,
} from "./_components/kit-format";
import { KitCatalog } from "./_components/kit-catalog";
import { getRequestMarket } from "./_components/request-market";
import {
  BuildOwnKit,
  HowKitsWork,
  KitsHero,
} from "./_components/kits-sections";

export const metadata: Metadata = buildMetadata({
  title: "Kits & Bundles - Nadeon Pet",
  description:
    "Formulas that work well together, priced below buying them one by one. Doses by weight on every label.",
  pathname: "/pet/kits",
});

export default async function PetKitsPage() {
  const market = await getRequestMarket();
  const [kits, products] = await Promise.all([
    catalogProvider.getKits("pet"),
    catalogProvider.getProducts({ line: "pet" }),
  ]);

  const productsBySlug = new Map<string, Product>(
    products.map((product) => [product.slug, product] as const)
  );
  const kitViews = kits.map((kit) => buildKitView(kit, productsBySlug, market));
  const savingsPercent = averageKitSavingsPercent(kits);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kits & Bundles - Nadeon Pet",
    description:
      "Formulas that work well together, priced below buying them one by one. Doses by weight on every label.",
    url: `${DEFAULT_SITE_URL}/pet/kits`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: kits.map((kit, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: kit.name,
        url: `${DEFAULT_SITE_URL}/pet/kits/${kit.slug}`,
      })),
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <JsonLd data={jsonLdData} id="pet-kits-collection-ld" />

      <AnnouncementBar line="pet" />
      <Header variant="pet" />

      <main id="main-content" className="flex-1">
        <KitsHero savingsPercent={savingsPercent} />

        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-18 lg:py-16">
          <KitCatalog kits={kitViews} />
        </div>

        <BuildOwnKit savingsPercent={savingsPercent} />
        <HowKitsWork savingsPercent={savingsPercent} />
        <TrustStrip line="pet" />
      </main>

      <Footer line="pet" />
    </div>
  );
}
