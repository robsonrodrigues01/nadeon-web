import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { catalogProvider } from "@/lib/providers";
import {
  buildMetadata,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  JsonLd,
} from "@/lib/seo";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import { getDefaultMarket, getMarket } from "@/lib/market/markets";

import { Hero } from "./_components/hero";
import { HowItWorks } from "./_components/how-it-works";
import { MathComparison } from "./_components/math-comparison";
import { FrequencySection } from "./_components/frequency-section";
import { FlexibilitySection } from "./_components/flexibility-section";
import { SubscribeFaq, getSubscribeFaqs } from "./_components/subscribe-faq";
import { BottomCta } from "./_components/bottom-cta";
import {
  getSubscriptionDiscountPercentage,
  getUniqueSellingPlans,
} from "./_components/plan-utils";

export async function generateMetadata(): Promise<Metadata> {
  let discountPercentage: number | null = null;
  try {
    const products = await catalogProvider.getProducts({ line: "human" });
    discountPercentage = getSubscriptionDiscountPercentage(products);
  } catch {
    discountPercentage = null;
  }

  const title = discountPercentage
    ? `Subscribe & Save ${discountPercentage}% | Nadeon Human`
    : `Subscribe & Save | Nadeon Human`;
  const description = discountPercentage
    ? `Your daily NMN and NAD+, delivered on your schedule. Save ${discountPercentage}% on every box with free shipping and full flexibility.`
    : `Your daily NMN and NAD+, delivered on your schedule. Save on every box with free shipping and full flexibility.`;

  return buildMetadata({
    title,
    description,
    pathname: "/human/subscribe",
  });
}

export default async function SubscribePage() {
  let market = getDefaultMarket();
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get(MARKET_COOKIE_NAME)?.value;
    const found = getMarket(cookieVal);
    if (found) {
      market = found;
    }
  } catch {
    market = getDefaultMarket();
  }

  const products = await catalogProvider.getProducts({ line: "human" });
  const discountPercentage = getSubscriptionDiscountPercentage(products);
  const sellingPlans = getUniqueSellingPlans(products);
  const intervals = sellingPlans.map((p) => p.intervalDays);
  const faqs = getSubscribeFaqs(discountPercentage);

  const breadcrumbsLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Human", url: "/human" },
    { name: "Subscribe", url: "/human/subscribe" },
  ]);
  const faqLd = buildFaqJsonLd(faqs);

  return (
    <main id="main-content" className="flex-1 bg-bg text-fg">
      <JsonLd data={{ ...breadcrumbsLd }} id="breadcrumb-jsonld" />
      <JsonLd data={{ ...faqLd }} id="faq-jsonld" />
      <Hero discountPercentage={discountPercentage} />
      <HowItWorks
        discountPercentage={discountPercentage}
        intervals={intervals}
      />
      <MathComparison products={products} market={market} />
      <FrequencySection plans={sellingPlans} />
      <FlexibilitySection />
      <SubscribeFaq faqs={faqs} discountPercentage={discountPercentage} />
      <BottomCta discountPercentage={discountPercentage} />
    </main>
  );
}
