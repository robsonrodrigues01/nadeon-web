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
import { SubscribeFaq, SUBSCRIBE_FAQS } from "./_components/subscribe-faq";
import { BottomCta } from "./_components/bottom-cta";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Subscribe & Save 15% | Nadeon Human",
    description:
      "Your daily NMN and NAD+, delivered on your schedule. Save 15% on every box with free shipping and full flexibility.",
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

  const breadcrumbsLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Human", url: "/human" },
    { name: "Subscribe", url: "/human/subscribe" },
  ]);
  const faqLd = buildFaqJsonLd(SUBSCRIBE_FAQS);

  return (
    <main id="main-content" className="flex-1 bg-bg text-fg">
      <JsonLd data={{ ...breadcrumbsLd }} id="breadcrumb-jsonld" />
      <JsonLd data={{ ...faqLd }} id="faq-jsonld" />
      <Hero />
      <HowItWorks />
      <MathComparison products={products} market={market} />
      <FrequencySection />
      <FlexibilitySection />
      <SubscribeFaq />
      <BottomCta />
    </main>
  );
}
