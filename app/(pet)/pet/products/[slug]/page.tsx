import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { catalogProvider, reviewsProvider } from "@/lib/providers";
import { DEFAULT_MARKET, getMarket } from "@/lib/market/markets";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import {
  buildMetadata,
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  JsonLd,
} from "@/lib/seo";

// Header, announcement bar, trust strip, newsletter and footer come from
// app/(pet)/pet/layout.tsx. This page must not render them again.

import { PetBreadcrumbs } from "./_components/pet-breadcrumbs";
import { PetGallery } from "./_components/pet-gallery";
import { PetPurchaseCard } from "./_components/pet-purchase-card";
import { PetInsideSection } from "./_components/pet-inside-section";
import { PetScienceSection } from "./_components/pet-science-section";
import { PetExpectSection } from "./_components/pet-expect-section";
import { PetVetSection } from "./_components/pet-vet-section";
import { PetKitsSection } from "./_components/pet-kits-section";
import { PetReviewsSection } from "./_components/pet-reviews-section";
import { PetLabSearch } from "./_components/pet-lab-search";
import { PetFaqSection } from "./_components/pet-faq-section";
import { PetStickyBar } from "./_components/pet-sticky-bar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await catalogProvider.getProducts({ line: "pet" });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await catalogProvider.getProduct(slug);

  if (!product || product.line !== "pet") {
    return buildMetadata({
      title: "Product not found",
      description: "This product is not available.",
      noIndex: true,
    });
  }

  const description = product.benefits[0] ?? product.technicalName;

  return buildMetadata({
    title: product.name,
    description,
    pathname: `/pet/products/${product.slug}`,
    openGraph: {
      title: `${product.name} | Nadeon Pet`,
      description,
      images: product.images,
    },
  });
}

export default async function PetProductDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const product = await catalogProvider.getProduct(slug);

  if (!product || product.line !== "pet") {
    notFound();
  }

  // Market from the cookie set by the country selector; default when absent
  const marketId = (await cookies()).get(MARKET_COOKIE_NAME)?.value;
  const market = getMarket(marketId) ?? DEFAULT_MARKET;

  // Only kits that include this product. No fallback to other kits.
  const petKits = await catalogProvider.getKits("pet");
  const relatedKits = petKits.filter((kit) =>
    kit.products.some((ref) => ref.productSlug === product.slug)
  );

  const [reviewSummary, reviewList] = await Promise.all([
    reviewsProvider.summary(product.slug),
    reviewsProvider.list({ productSlug: product.slug, limit: 5 }),
  ]);

  const speciesLabel =
    product.species === "cat"
      ? "Cats"
      : product.species === "horse"
        ? "Horses"
        : "Dogs";

  const speciesHref =
    product.species === "cat"
      ? "/pet/cats"
      : product.species === "horse"
        ? "/pet/horses"
        : "/pet/dogs";

  const productJsonLd = buildProductJsonLd(product);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Pet", url: "/pet" },
    { name: speciesLabel, url: speciesHref },
    { name: product.name, url: `/pet/products/${product.slug}` },
  ]);
  // Same list is rendered in PetFaqSection, so visible FAQ and JSON-LD match
  const faqJsonLd = product.faq.length > 0 ? buildFaqJsonLd(product.faq) : null;

  // Without variants there is no price: the purchase card and sticky bar stay out
  const hasVariants = product.variants.length > 0;

  return (
    <>
      <JsonLd
        id="product-jsonld"
        data={productJsonLd as unknown as Record<string, unknown>}
      />
      <JsonLd
        id="breadcrumb-jsonld"
        data={breadcrumbJsonLd as unknown as Record<string, unknown>}
      />
      {faqJsonLd && (
        <JsonLd
          id="faq-jsonld"
          data={faqJsonLd as unknown as Record<string, unknown>}
        />
      )}

      <main id="main-content" className="flex-1 pb-16" tabIndex={-1}>
        <section
          aria-label="Product overview and purchase"
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 pb-8 sm:pb-12"
        >
          <PetBreadcrumbs product={product} />

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-6 xl:col-span-6">
              <PetGallery product={product} />
            </div>

            <div className="lg:col-span-6 xl:col-span-6">
              {hasVariants && (
                <PetPurchaseCard
                  product={product}
                  reviewSummary={reviewSummary}
                  market={market}
                />
              )}
            </div>
          </div>
        </section>

        <PetInsideSection product={product} />
        <PetScienceSection product={product} />
        <PetExpectSection />
        <PetVetSection />
        <PetKitsSection kits={relatedKits} market={market} />
        <PetReviewsSection
          summary={reviewSummary}
          reviews={reviewList.reviews}
        />
        <PetLabSearch />
        <PetFaqSection product={product} />

        {hasVariants && <PetStickyBar product={product} market={market} />}
      </main>
    </>
  );
}
