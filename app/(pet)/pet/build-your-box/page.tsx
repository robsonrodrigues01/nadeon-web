import React from "react";
import type { Metadata } from "next";
import { catalogProvider, subscriptionProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { PetRegulatoryNotice } from "../_components/pet-regulatory-notice";
import { BoxBuilder } from "./_components/box-builder";
import { doseGuide } from "./_components/box-helpers";

export const metadata: Metadata = buildMetadata({
  title: "Build your box - Nadeon Pet",
  description:
    "Build a subscription box for your dog, cat or horse. Doses worked out by weight, save on every box.",
  pathname: "/pet/build-your-box",
});

export default async function BuildYourBoxPage() {
  const [products, capabilities] = await Promise.all([
    catalogProvider.getProducts({ line: "pet" }),
    subscriptionProvider.capabilities(),
  ]);

  const intervals = [...capabilities.allowedIntervalDays].sort((a, b) => a - b);
  const savePercentage = Math.max(
    0,
    ...products.flatMap((p) => p.sellingPlans.map((s) => s.discountPercentage))
  );

  return (
    <main id="main-content" className="flex-1 bg-bg text-fg">
      <JsonLd
        id="build-your-box-breadcrumb-ld"
        data={{
          ...buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Pet", url: "/pet" },
            { name: "Build your box", url: "/pet/build-your-box" },
          ]),
        }}
      />
      <BoxBuilder
        products={products}
        intervals={intervals}
        savePercentage={savePercentage}
        doseGuide={doseGuide(products)}
      />
      <PetRegulatoryNotice />
    </main>
  );
}
