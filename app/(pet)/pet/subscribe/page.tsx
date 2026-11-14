import React from "react";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { getVisitorMarket } from "@/lib/market/visitor";
import { DEFAULT_MARKET } from "@/lib/market/markets";
import { formatFreeShippingLabel } from "@/lib/market/shipping";
import {
  buildMetadata,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  JsonLd,
} from "@/lib/seo";

import { Hero } from "./_components/hero";
import { HowItWorks } from "./_components/how-it-works";
import { WhatYouSave } from "./_components/what-you-save";
import { FlexibilitySection } from "./_components/flexibility-section";
import {
  SubscriptionFaq,
  SUBSCRIPTION_FAQS,
} from "./_components/subscription-faq";
import { BottomCta } from "./_components/bottom-cta";
import { PetRegulatoryNotice } from "../_components/pet-regulatory-notice";

export const metadata: Metadata = buildMetadata({
  title: "Subscribe & Save 15% - Nadeon Pet",
  description:
    "Their daily chew, delivered on your schedule. Save 15% on every order. Skip, pause or cancel anytime, no calls needed.",
  pathname: "/pet/subscribe",
});

export default async function PetSubscribePage() {
  let market = DEFAULT_MARKET;
  try {
    market = await getVisitorMarket();
  } catch {
    market = DEFAULT_MARKET;
  }

  const petProducts = await catalogProvider.getProducts({ line: "pet" });
  const freeShippingText = formatFreeShippingLabel(market, "pet");

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Pet", url: "/pet" },
    { name: "Subscribe", url: "/pet/subscribe" },
  ]);

  const faqLd = buildFaqJsonLd(SUBSCRIPTION_FAQS);

  return (
    <main id="main-content" className="flex-1 w-full bg-bg text-fg">
      <JsonLd
        data={breadcrumbLd as unknown as Record<string, unknown>}
        id="pet-subscribe-breadcrumb-ld"
      />
      <JsonLd
        data={faqLd as unknown as Record<string, unknown>}
        id="pet-subscribe-faq-ld"
      />

      {/* 1. Hero */}
      <Hero />

      {/* 2. How it works */}
      <HowItWorks freeShippingText={freeShippingText} />

      {/* 3. The Math / What you save */}
      <WhatYouSave products={petProducts} market={market} />

      {/* 4. Full flexibility and interactive subscription card */}
      <FlexibilitySection />

      {/* 5. FAQ */}
      <SubscriptionFaq />

      {/* 6. Bottom CTA */}
      <BottomCta freeShippingText={freeShippingText} />

      {/* 7. Regulatory notice for animal use / FDA */}
      <PetRegulatoryNotice />
    </main>
  );
}
