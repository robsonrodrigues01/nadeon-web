import React from "react";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import {
  buildMetadata,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  JsonLd,
} from "@/lib/seo";

import { Hero } from "./_components/hero";
import { DailyRoutine } from "./_components/daily-routine";
import { AgeBands } from "./_components/age-bands";
import { HowItWorks } from "./_components/how-it-works";
import { IngredientsSection } from "./_components/ingredients-section";
import { LabelComparison } from "./_components/label-comparison";
import { WhatToExpect } from "./_components/what-to-expect";
import { BundleSection } from "./_components/bundle-section";
import { SubscribeSection } from "./_components/subscribe-section";
import { LabResultsSection } from "./_components/lab-results-section";
import { OurStory } from "./_components/our-story";
import { ReviewsSection } from "./_components/reviews-section";
import { JournalSection } from "./_components/journal-section";
import { FaqAccordion } from "./_components/faq-accordion";
import { HUMAN_FAQS } from "./_components/faqs-data";
import { buildKitLines } from "./_components/kit-lines";
import { CrossLineBanner } from "./_components/cross-line-banner";
import { BottomCta } from "./_components/bottom-cta";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Nadeon Human | Cellular Longevity & Energy",
    description:
      "Clean NMN and NAD+ formulas, tested lot by lot in our Clifton, New Jersey lab.",
    pathname: "/human",
  });
}

export default async function HumanPage() {
  const [products, energyDuoKit] = await Promise.all([
    catalogProvider.getProducts({ line: "human" }),
    catalogProvider.getKit("energy-duo"),
  ]);

  const kitLines = buildKitLines(energyDuoKit, products);
  const breadcrumbsLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Human", url: "/human" },
  ]);
  const faqLd = buildFaqJsonLd(HUMAN_FAQS);

  return (
    <>
      <JsonLd data={{ ...breadcrumbsLd }} id="breadcrumb-jsonld" />
      <JsonLd data={{ ...faqLd }} id="faq-jsonld" />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Hero energyDuoKit={energyDuoKit} kitLines={kitLines} />
        <DailyRoutine products={products} />
        <AgeBands />
        <HowItWorks />
        <IngredientsSection />
        <LabelComparison />
        <WhatToExpect />
        <BundleSection kit={energyDuoKit} kitLines={kitLines} />
        <SubscribeSection />
        <LabResultsSection />
        <OurStory />
        <ReviewsSection />
        <JournalSection />
        <FaqAccordion />
        <CrossLineBanner />
        <BottomCta />
      </main>
    </>
  );
}
