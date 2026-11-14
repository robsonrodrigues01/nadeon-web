import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata, buildProductJsonLd, JsonLd } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrustStrip } from "@/components/brand/trust-strip";
import { PurchaseOptions } from "@/components/commerce/purchase-options";
import { Claim } from "@/components/commerce/product-card/claim";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { getVisitorMarket } from "@/lib/market/visitor";

import { Gallery } from "./_components/gallery";
import { DetailsTabs } from "./_components/details-tabs";
import { ScienceSection } from "./_components/science-section";
import { AudienceComparison } from "./_components/audience-comparison";
import { KitAndPairs } from "./_components/kit-and-pairs";
import { ReviewsSection } from "./_components/reviews-section";
import { FaqSection } from "./_components/faq-section";
import { StickyBar } from "./_components/sticky-bar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await catalogProvider.getProducts({ line: "human" });
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalogProvider.getProduct(slug);

  if (!product || product.line !== "human") {
    return {
      title: "Product Not Found | Nadeon Labs",
    };
  }

  return buildMetadata({
    title: product.name,
    description: product.technicalName,
    pathname: `/human/products/${product.slug}`,
    openGraph: {
      images: product.images,
    },
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const market = await getVisitorMarket();
  const product = await catalogProvider.getProduct(slug);

  if (!product || product.line !== "human") {
    notFound();
  }

  const [kit, allHumanProducts] = await Promise.all([
    catalogProvider.getKit("energy-duo"),
    catalogProvider.getProducts({ line: "human" }),
  ]);

  const relatedProducts = allHumanProducts.filter(
    (p) => p.slug !== product.slug
  );
  const jsonLdData = buildProductJsonLd(product);

  // Price only from the catalog; a missing variant or plan hides that price
  const primaryVariant = product.variants[0];
  const primaryPlan = product.sellingPlans[0];
  const price = primaryVariant?.price;
  const formattedBasePrice = price
    ? formatMoneyWithMarket(
        { amount: price.amount, currencyCode: price.currencyCode },
        market
      )
    : null;
  const formattedDiscountedPrice =
    price && primaryPlan
      ? formatMoneyWithMarket(
          {
            amount: Number(
              (
                price.amount *
                ((100 - primaryPlan.discountPercentage) / 100)
              ).toFixed(2)
            ),
            currencyCode: price.currencyCode,
          },
          market
        )
      : null;

  return (
    <>
      <JsonLd
        data={jsonLdData as unknown as Record<string, unknown>}
        id="product-schema-jsonld"
      />

      {/* Global Announcements & Navigation */}
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main className="min-h-screen bg-bg text-fg">
        {/* Breadcrumb Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-18 pt-6 pb-4">
          <nav
            aria-label="Breadcrumb"
            className="text-xs font-semibold text-fg-muted"
          >
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="select-none text-fg-muted/40">
                /
              </li>
              <li>
                <Link
                  href="/human"
                  className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
                >
                  Human
                </Link>
              </li>
              <li aria-hidden="true" className="select-none text-fg-muted/40">
                /
              </li>
              <li>
                <Link
                  href="/human/shop"
                  className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
                >
                  Shop
                </Link>
              </li>
              <li aria-hidden="true" className="select-none text-fg-muted/40">
                /
              </li>
              <li aria-current="page" className="text-fg font-bold">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>

        {/* Product Hero Section */}
        <section
          aria-label="Product overview and purchase options"
          className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-18 pb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-7">
              <Gallery product={product} />
            </div>

            {/* Buying & Description Column */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* Format Badge */}
              <div className="flex items-center gap-2">
                <span className="rounded-pill bg-bg-elevated border border-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-product-amber">
                  {product.format} · PURE NMN
                </span>
              </div>

              {/* Title & Technical Subtitle */}
              <div>
                <h1 className="font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-fg tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm font-bold text-fg-muted mt-1.5">
                  {product.technicalName} · {product.netWeight} ·{" "}
                  {product.servingsPerJar} servings
                </p>
              </div>

              {/* Review & Lab Summary Line */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="rounded-pill bg-product-amber/15 px-2 py-0.5 font-bold text-product-amber">
                  New
                </span>
                <span className="text-fg-muted">
                  No reviews yet · be the first
                </span>
                <span className="text-border select-none" aria-hidden="true">
                  |
                </span>
                <span className="text-fg-muted">
                  first lots publishing soon
                </span>
              </div>

              {/* Price Headline */}
              <div className="flex items-baseline gap-2 py-1">
                {formattedBasePrice && (
                  <span className="font-archivo text-2xl sm:text-3xl font-black text-fg">
                    {formattedBasePrice}
                  </span>
                )}
                {formattedDiscountedPrice && (
                  <span className="text-xs sm:text-sm font-semibold text-fg-muted">
                    or {formattedDiscountedPrice} with Subscribe &amp; Save
                  </span>
                )}
              </div>

              {/* Bullet Points / Claims */}
              <ul className="space-y-2.5 text-sm" role="list">
                {product.claims.map((claim) => (
                  <li key={claim.text} className="flex items-start gap-2.5">
                    <span
                      className="text-accent font-bold select-none"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    {claim.isClaim ? (
                      <Claim showDisclaimer>{claim.text}</Claim>
                    ) : (
                      <span className="text-fg-muted">{claim.text}</span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Link See Supplement Facts */}
              <div>
                <a
                  href="#supplement-facts"
                  className="inline-flex min-h-11 items-center font-bold text-xs uppercase tracking-wider text-accent underline underline-offset-4 hover:text-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  See Supplement Facts
                </a>
              </div>

              {/* Onda 1 Purchase Options Component */}
              <PurchaseOptions product={product} />

              {/* Guarantee & Trust Footnote */}
              <div className="space-y-3 pt-3 text-xs text-fg-muted border-t border-border/40">
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold" aria-hidden="true">
                    ✓
                  </span>
                  <span>
                    <strong className="text-fg">
                      60-day money-back guarantee.
                    </strong>{" "}
                    Love it or get a full refund.
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 text-[11px] font-semibold text-fg-muted/80 flex-wrap">
                  <span>60-day guarantee</span>
                  <span>·</span>
                  <span>Made in Clifton, NJ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Inside the jar / Details Tabs */}
        <DetailsTabs product={product} />

        {/* Section 4: Science Section */}
        <ScienceSection productName={product.name} />

        {/* Section 5: Target Audience & Competitor Comparison */}
        <AudienceComparison productName={product.name} />

        {/* Section 6: Kit & Pairs Well With */}
        <KitAndPairs
          kit={kit}
          relatedProducts={relatedProducts}
          market={market}
        />

        {/* Section 7: Reviews */}
        <ReviewsSection productName={product.name} />

        {/* Section 8: FAQ */}
        <FaqSection productName={product.name} />

        {/* Section 9: Brand Trust Strip */}
        <TrustStrip line="human" />
      </main>

      {/* Global Footer */}
      <Footer line="human" />

      {/* Sticky Bottom Bar on Scroll */}
      <StickyBar product={product} market={market} />
    </>
  );
}
