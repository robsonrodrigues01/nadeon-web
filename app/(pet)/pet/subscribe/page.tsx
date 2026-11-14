import React from "react";
import type { Metadata } from "next";
import type { Product } from "@/lib/contracts/catalog";
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
  buildSubscriptionFaqs,
} from "./_components/subscription-faq";
import { BottomCta } from "./_components/bottom-cta";
import { PetRegulatoryNotice } from "../_components/pet-regulatory-notice";

export function getSubscriptionDiscount(products: Product[]): number {
  for (const product of products) {
    for (const plan of product.sellingPlans ?? []) {
      if (
        typeof plan.discountPercentage === "number" &&
        plan.discountPercentage > 0
      ) {
        return plan.discountPercentage;
      }
    }
  }
  return 15;
}

export function getSubscriptionIntervals(products: Product[]): number[] {
  const intervals = new Set<number>();
  for (const product of products) {
    for (const plan of product.sellingPlans ?? []) {
      if (typeof plan.intervalDays === "number" && plan.intervalDays > 0) {
        intervals.add(plan.intervalDays);
      }
    }
  }
  const sorted = Array.from(intervals).sort((a, b) => a - b);
  return sorted.length > 0 ? sorted : [30, 60, 90];
}

export function formatIntervalsText(intervals: number[]): string {
  if (intervals.length === 0) return "30, 60 or 90 days";
  if (intervals.length === 1) return `${intervals[0]} days`;
  const leading = intervals.slice(0, -1).join(", ");
  const last = intervals[intervals.length - 1];
  return `${leading} or ${last} days`;
}

export async function generateMetadata(): Promise<Metadata> {
  let discountPercentage = 15;
  try {
    const products = await catalogProvider.getProducts({ line: "pet" });
    discountPercentage = getSubscriptionDiscount(products);
  } catch {
    discountPercentage = 15;
  }

  return buildMetadata({
    title: `Subscribe & Save ${discountPercentage}% - Nadeon Pet`,
    description: `Their daily chew, delivered on your schedule. Save ${discountPercentage}% on every order. Skip, pause or cancel anytime, no calls needed.`,
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

  const petProducts = await catalogProvider.getProducts({ line: "pet" });
  const discountPercentage = getSubscriptionDiscount(petProducts);
  const intervals = getSubscriptionIntervals(petProducts);
  const frequencyText = formatIntervalsText(intervals);
  const baseIntervalDays = intervals[0] ?? 30;
  const freeShippingText = formatFreeShippingLabel(market, "pet");

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Pet", url: "/pet" },
    { name: "Subscribe", url: "/pet/subscribe" },
  ]);

  const faqs = buildSubscriptionFaqs(discountPercentage);
  const faqLd = buildFaqJsonLd(faqs);

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
      <FlexibilitySection intervalDays={baseIntervalDays} />

      {/* 5. FAQ with dynamic discount percentage */}
      <SubscriptionFaq discountPercentage={discountPercentage} />

      {/* 6. Bottom CTA with dynamic discount percentage */}
      <BottomCta
        freeShippingText={freeShippingText}
        discountPercentage={discountPercentage}
      />

      {/* 7. Regulatory notice for animal use / FDA */}
      <PetRegulatoryNotice />
    </main>
  );
}
