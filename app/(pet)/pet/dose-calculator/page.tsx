import React from "react";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { catalogProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { getDefaultMarket, getMarket } from "@/lib/market/markets";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import { PetRegulatoryNotice } from "../_components/pet-regulatory-notice";
import { DoseCalculator } from "./_components/dose-calculator";

export const metadata: Metadata = buildMetadata({
  title: "Pet Dose Calculator - Nadeon Pet",
  description:
    "Enter your dog, cat or horse's weight, age and activity level to find a daily dose and the Nadeon Pet product that fits.",
  pathname: "/pet/dose-calculator",
});

export default async function DoseCalculatorPage() {
  const petProducts = await catalogProvider.getProducts({ line: "pet" });

  const cookieStore = await cookies();
  const market =
    getMarket(cookieStore.get(MARKET_COOKIE_NAME)?.value) ?? getDefaultMarket();

  // Only images that exist in /public are passed on; missing files are not rendered.
  const productImages: Record<string, string> = {};
  for (const product of petProducts) {
    const src = product.images[0];
    if (src && existsSync(path.join(process.cwd(), "public", src))) {
      productImages[product.slug] = src;
    }
  }

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Pet", url: "/pet" },
    { name: "Dose calculator", url: "/pet/dose-calculator" },
  ]);

  return (
    <main id="main-content" className="flex-1 bg-bg text-fg" tabIndex={-1}>
      <JsonLd data={{ ...breadcrumbLd }} id="dose-calculator-breadcrumb-ld" />

      <section
        aria-labelledby="dose-calculator-heading"
        className="border-b border-border bg-bg-elevated px-5 py-12 sm:px-8 sm:py-16 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/pet" className="underline underline-offset-4">
                  Pet
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>Dose calculator</li>
            </ol>
          </nav>

          <p className="mt-6 text-xs font-bold tracking-[0.14em] text-accent">
            NADEON PET · DOSE CALCULATOR
          </p>
          <h1
            id="dose-calculator-heading"
            className="title mt-3 text-5xl font-extrabold uppercase leading-none tracking-tight sm:text-7xl"
          >
            Find the right dose
          </h1>
          <p className="body mt-4 max-w-2xl text-lg leading-relaxed text-fg/85">
            Tell us about your pet. We show a daily dose and the product that
            fits.
          </p>
        </div>
      </section>

      <div className="px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <DoseCalculator
            products={petProducts}
            market={market}
            productImages={productImages}
          />
        </div>
      </div>

      <PetRegulatoryNotice />
    </main>
  );
}
