import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata, DEFAULT_SITE_URL, JsonLd } from "@/lib/seo";
import { Claim } from "@/components/commerce/product-card/claim";
import type { Product } from "@/lib/contracts/catalog";
import {
  buildKitView,
  formatKitMoney,
  marketOffer,
} from "@/app/(pet)/pet/kits/_components/kit-format";
import { getRequestMarket } from "@/app/(pet)/pet/kits/_components/request-market";

interface PetKitPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PetKitPageProps): Promise<Metadata> {
  const { slug } = await params;
  const kit = await catalogProvider.getKit(slug);
  if (!kit || kit.line !== "pet") return {};

  return buildMetadata({
    title: `${kit.name} - Nadeon Pet`,
    description: kit.description,
    pathname: `/pet/kits/${kit.slug}`,
  });
}

export default async function PetKitPage({ params }: PetKitPageProps) {
  const { slug } = await params;
  const kit = await catalogProvider.getKit(slug);
  if (!kit || kit.line !== "pet") notFound();

  const market = await getRequestMarket();
  const products = await catalogProvider.getProducts({ line: "pet" });
  const productsBySlug = new Map<string, Product>(
    products.map((product) => [product.slug, product] as const)
  );
  const view = buildKitView(kit, productsBySlug, market);

  const offer = marketOffer(kit.price, market);
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: kit.name,
    description: kit.description,
    url: `${DEFAULT_SITE_URL}/pet/kits/${kit.slug}`,
    offers: {
      "@type": "Offer",
      price: offer.amount,
      priceCurrency: offer.currencyCode,
      url: `${DEFAULT_SITE_URL}/pet/kits/${kit.slug}`,
    },
  };

  return (
    <>
      <JsonLd data={jsonLdData} id="pet-kit-product-ld" />

      <main id="main-content" className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-18 lg:py-16">
          <nav
            aria-label="Breadcrumb"
            className="text-xs font-bold text-fg-muted"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/pet"
                  className="underline-offset-4 hover:underline"
                >
                  Pet
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/pet/kits"
                  className="underline-offset-4 hover:underline"
                >
                  Kits &amp; bundles
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{kit.name}</li>
            </ol>
          </nav>

          <h1 className="font-archivo mt-8 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-fg sm:text-7xl">
            {kit.name}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg sm:text-xl">
            <Claim>{kit.description}</Claim>
          </p>

          <div className="mt-8 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold text-fg">
              {view.price}
            </span>
            {view.compareAtPrice && (
              <s className="text-base text-fg-muted">{view.compareAtPrice}</s>
            )}
            {view.savings && (
              <span className="text-sm font-bold text-accent">
                You save {view.savings}
              </span>
            )}
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 items-center justify-center rounded-pill bg-fg px-6 py-3 text-base font-extrabold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add kit to cart
            </button>
          </div>

          <ul
            aria-label="Products in this kit"
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {kit.products.map((ref) => {
              const product = productsBySlug.get(ref.productSlug);
              if (!product) return null;
              return (
                <li key={ref.productSlug}>
                  <Link
                    href={`/pet/products/${product.slug}`}
                    className="flex flex-col gap-1 rounded-card border border-border bg-bg-elevated p-5 shadow-card transition-colors hover:border-fg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="text-lg font-extrabold text-fg">
                      {product.name}
                      {ref.quantity > 1 ? ` × ${ref.quantity}` : ""}
                    </span>
                    <span className="text-sm text-fg-muted">
                      {product.technicalName}
                    </span>
                    {product.variants[0] && (
                      <span className="text-sm font-bold text-fg">
                        {formatKitMoney(product.variants[0].price, market)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
