import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { catalogProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
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

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Pet", url: "/pet" },
    { name: "Dose calculator", url: "/pet/dose-calculator" },
  ]);

  return (
    <main id="main-content" className="flex-1 bg-bg text-fg">
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
          <DoseCalculator products={petProducts} />
        </div>
      </div>

      <PetRegulatoryNotice />
    </main>
  );
}
