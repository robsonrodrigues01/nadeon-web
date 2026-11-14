import React from "react";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import {
  buildMetadata,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  JsonLd,
} from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Footer } from "@/components/layout/footer";
import { ShopHero } from "./_components/shop-hero";
import { ShopCollection } from "./_components/shop-collection";
import { BetterTogetherSection } from "./_components/better-together";
import { QuizBanner } from "./_components/quiz-banner";
import { ShoppingFaqSection } from "./_components/shopping-faq";
import { SHOPPING_FAQS } from "./_components/types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Shop All Human Formulas | Nadeon Labs",
    description:
      "NMN and NAD+ in capsules, powders and tinctures. Tested lot by lot in our Clifton, NJ lab.",
    pathname: "/human/shop",
  });
}

export default async function HumanShopPage() {
  const [products, kits] = await Promise.all([
    catalogProvider.getProducts({ line: "human" }),
    catalogProvider.getKits("human"),
  ]);

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Human", url: "/human" },
    { name: "Shop", url: "/human/shop" },
  ]);

  const faqSchema = buildFaqJsonLd(SHOPPING_FAQS);

  return (
    <>
      <JsonLd
        id="shop-structured-data"
        data={[
          breadcrumbsSchema as unknown as Record<string, unknown>,
          faqSchema as unknown as Record<string, unknown>,
        ]}
      />

      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1">
        <ShopHero />
        <ShopCollection products={products} />
        <BetterTogetherSection kits={kits} products={products} />
        <QuizBanner />
        <ShoppingFaqSection />
      </main>

      <TrustStrip line="human" />
      <Footer line="human" />
    </>
  );
}
