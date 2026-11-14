import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogProvider } from "@/lib/providers";
import {
  buildMetadata,
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  JsonLd,
} from "@/lib/seo";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import { PetBreadcrumbs } from "./_components/pet-breadcrumbs";
import { PetGallery } from "./_components/pet-gallery";
import { PetPurchaseCard } from "./_components/pet-purchase-card";
import { PetInsideSection } from "./_components/pet-inside-section";
import { PetScienceSection } from "./_components/pet-science-section";
import { PetExpectSection } from "./_components/pet-expect-section";
import { PetAudienceSection } from "./_components/pet-audience-section";
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
      title: "Pet Product Not Found",
      description: "The requested pet longevity product could not be located.",
      noIndex: true,
    });
  }

  const description =
    product.benefits?.[0] ||
    `${product.name} - ${product.technicalName}. Dedicated cellular longevity for ${product.species || "pets"}.`;

  return buildMetadata({
    title: `${product.name} | Cellular Longevity for Pets`,
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

  const petKits = await catalogProvider.getKits("pet");

  // Filter kits related to this product or line
  const relatedKits = petKits.filter((kit) =>
    kit.products.some((ref) => ref.productSlug === product.slug)
  );
  const displayKits = relatedKits.length > 0 ? relatedKits : petKits;

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

  // Build JSON-LD structured data
  const productJsonLd = buildProductJsonLd(product);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Pet", url: "/pet" },
    { name: speciesLabel, url: speciesHref },
    { name: product.name, url: `/pet/products/${product.slug}` },
  ]);
  const faqJsonLd =
    product.faq && product.faq.length > 0 ? buildFaqJsonLd(product.faq) : null;

  // Without variants there is no price: the purchase card and sticky bar stay out
  const hasVariants = product.variants.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      {/* Structured SEO Data */}
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

      {/* Global Pet Layout Header with Announcement */}
      <AnnouncementBar line="pet" />
      <Header variant="pet" />

      {/* Main Product Page Content */}
      <main id="main-content" className="flex-1 pb-16">
        {/* Top Product Hero Block */}
        <section
          aria-label="Product overview and purchase"
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 pb-8 sm:pb-12"
        >
          <PetBreadcrumbs product={product} />

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Gallery Column (Desktop 6.5 cols / Mobile full) */}
            <div className="lg:col-span-6 xl:col-span-6">
              <PetGallery product={product} />
            </div>

            {/* Purchase Form Column (Desktop 5.5 cols / Mobile full) */}
            <div className="lg:col-span-6 xl:col-span-6">
              {hasVariants && <PetPurchaseCard product={product} />}
            </div>
          </div>
        </section>

        {/* Section 1: What is inside & Supplement facts */}
        <PetInsideSection product={product} />

        {/* Section 2: The Science */}
        <PetScienceSection product={product} />

        {/* Section 3: What to Expect */}
        <PetExpectSection />

        {/* Section 4: Who It Is For */}
        <PetAudienceSection product={product} />

        {/* Section 6: Veterinarian Review */}
        <PetVetSection />

        {/* Section 7: Featured Kits */}
        <PetKitsSection kits={displayKits} />

        {/* Section 8: Reviews Summary & Empty State */}
        <PetReviewsSection />

        {/* Section 9: Lab Report & Lot Lookup */}
        <PetLabSearch />

        {/* Section 10: Product FAQ Accordion */}
        <PetFaqSection product={product} />

        {/* Sticky Mobile/Desktop Add-to-cart Bar */}
        {hasVariants && <PetStickyBar product={product} />}
      </main>

      {/* Global Pet Layout Footer */}
      <Footer line="pet" />
    </div>
  );
}
