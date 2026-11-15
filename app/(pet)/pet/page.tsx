import React from "react";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import {
  buildMetadata,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
  JsonLd,
} from "@/lib/seo";
import { PET_FAQS } from "./_components/faq-data";
import {
  HeroCarousel,
  WhoForSection,
  ShopByNeedSection,
  DoseByWeightSection,
  BestSellersSection,
  TasteTestSection,
  ByLifeStageSection,
  WhyNmnSection,
  WhatToExpectSection,
  QualityInNumbersSection,
  ChewOrOilSection,
  SubscribeSaveSection,
  ReviewsSection,
  PackUgcSection,
  JournalSection,
  FaqSection,
  AndForYouSection,
  BottomCtaBanner,
  PetRegulatoryNotice,
} from "./_components";

export const metadata: Metadata = buildMetadata({
  title: "Nadeon Pet | Cellular Longevity for Dogs, Cats & Horses",
  description:
    "Tasty soft chews, treats, oils and drops with NMN, made in small numbered lots in Clifton, New Jersey.",
  pathname: "/pet",
});

export default async function PetPage() {
  const petProducts = await catalogProvider.getProducts({ line: "pet" });

  const faqSchema = buildFaqJsonLd(PET_FAQS);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Pet", url: "/pet" },
  ]);

  return (
    <>
      <JsonLd
        data={faqSchema as unknown as Record<string, unknown>}
        id="pet-faq-jsonld"
      />
      <JsonLd
        data={breadcrumbSchema as unknown as Record<string, unknown>}
        id="pet-breadcrumb-jsonld"
      />

      <main id="main-content" className="flex-1 w-full bg-bg text-fg">
        <HeroCarousel />
        <WhoForSection />
        <ShopByNeedSection />
        <DoseByWeightSection />
        <BestSellersSection products={petProducts} />
        <TasteTestSection />
        <ByLifeStageSection />
        <WhyNmnSection />
        <WhatToExpectSection />
        <QualityInNumbersSection />
        <ChewOrOilSection />
        <SubscribeSaveSection />
        <ReviewsSection />
        <PackUgcSection />
        <JournalSection />
        <FaqSection />
        <AndForYouSection />
        <BottomCtaBanner />
        <PetRegulatoryNotice />
      </main>
    </>
  );
}
