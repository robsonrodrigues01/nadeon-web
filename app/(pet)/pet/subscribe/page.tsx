import React from "react";
import type { Metadata } from "next";
import type { Product } from "@/lib/contracts/catalog";
import { catalogProvider } from "@/lib/providers";
import { getVisitorMarket } from "@/lib/market/visitor";
import { MarketProvider } from "@/lib/market/context";
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
import { SubscriptionFaq } from "./_components/subscription-faq";
import { buildSubscriptionFaqs } from "./_components/subscription-faq-data";
import { BottomCta } from "./_components/bottom-cta";
import { PetRegulatoryNotice } from "../_components/pet-regulatory-notice";
import {
  getSubscriptionDiscountPercentage,
  getSubscriptionIntervals,
  formatIntervalsText,
  getUniqueSellingPlans,
  getProductSubscriptionDiscount,
} from "./_components/plan-utils";

export {
  getSubscriptionDiscountPercentage,
  getSubscriptionIntervals,
  formatIntervalsText,
  getUniqueSellingPlans,
  getProductSubscriptionDiscount,
};

export const getSubscriptionDiscount = getSubscriptionDiscountPercentage;

export async function generateMetadata(): Promise<Metadata> {
  let discountPercentage: number | null = null;
  try {
    const products = await catalogProvider.getProducts({ line: "pet" });
    discountPercentage = getSubscriptionDiscountPercentage(products);
  } catch {
    discountPercentage = null;
  }

  const title = discountPercentage
    ? `Subscribe & Save ${discountPercentage}% - Nadeon Pet`
    : `Subscribe & Save - Nadeon Pet`;
  const description = discountPercentage
    ? `Their daily chew, delivered on your schedule. Save ${discountPercentage}% on every order. Skip, pause or cancel anytime, no calls needed.`
    : `Their daily chew, delivered on your schedule. Save on every order. Skip, pause or cancel anytime, no calls needed.`;

  return buildMetadata({
    title,
    description,
    pathname: "/pet/subscribe",
  });
}

export default async function PetSubscribePage() {
  let market = DEFAULT_MARKET;
  try {
    market = await getVisitorMarket();
  } catch {
    market = DEFAULT_MARKET;
  }

  let petProducts: Product[] = [];
  try {
    petProducts = await catalogProvider.getProducts({ line: "pet" });
  } catch {
    petProducts = [];
  }

  const discountPercentage = getSubscriptionDiscountPercentage(petProducts);
  const intervals = getSubscriptionIntervals(petProducts);
  const frequencyText = formatIntervalsText(intervals);
  const baseIntervalDays = intervals[0] ?? null;
  const freeShippingText = formatFreeShippingLabel(market, "pet");

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Pet", url: "/pet" },
    { name: "Subscribe", url: "/pet/subscribe" },
  ]);

  const faqs = buildSubscriptionFaqs(discountPercentage);
  const faqLd = buildFaqJsonLd(faqs);

  return (
    <MarketProvider initialMarket={market}>
      <main id="main-content" className="flex-1 w-full bg-bg text-fg">
        <JsonLd
          data={breadcrumbLd as unknown as Record<string, unknown>}
          id="pet-subscribe-breadcrumb-ld"
        />
        <JsonLd
          data={faqLd as unknown as Record<string, unknown>}
          id="pet-subscribe-faq-ld"
        />

        {/* 1. Hero with dynamic subscription discount percentage */}
        <Hero discountPercentage={discountPercentage} />

        {/* 2. How it works with dynamic discount and contract intervals */}
        <HowItWorks
          freeShippingText={freeShippingText}
          discountPercentage={discountPercentage}
          frequencyText={frequencyText}
        />

        {/* 3. The Math / What you save derived from selling plans */}
        <WhatYouSave products={petProducts} market={market} />

        {/* 4. Full flexibility and interactive subscription card */}
        <FlexibilitySection
          products={petProducts}
          intervalDays={baseIntervalDays}
        />

        {/* 5. FAQ with dynamic discount percentage */}
        <SubscriptionFaq faqs={faqs} discountPercentage={discountPercentage} />

        {/* 6. Bottom CTA with dynamic discount percentage */}
        <BottomCta
          freeShippingText={freeShippingText}
          discountPercentage={discountPercentage}
        />

        {/* 7. Regulatory notice for animal use / FDA */}
        <PetRegulatoryNotice />
      </main>
    </MarketProvider>
  );
}
