import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { contentProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { PetRegulatoryNotice } from "../_components/pet-regulatory-notice";
import { BreedBrowser } from "./_components/breed-browser";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Care guides by breed - Nadeon Pet",
    description:
      "To be confirmed. Health topics by life stage, weight and exercise, food notes and a dose by weight for each breed, reviewed by a vet.",
    pathname: "/pet/breeds",
  });
}

export default async function BreedIndexPage() {
  const [breedIndex, breedGuides] = await Promise.all([
    contentProvider.getBreedIndex(),
    contentProvider.listBreedGuides(),
  ]);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Pet", url: "/pet" },
    { name: "Breed guides", url: "/pet/breeds" },
  ]);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 bg-bg text-fg">
      <JsonLd data={{ ...breadcrumbLd }} id="breed-index-breadcrumb-ld" />

      {/* Hero Section */}
      <section
        aria-labelledby="breed-index-heading"
        className="relative overflow-hidden bg-gradient-to-b from-bg-elevated/90 to-bg px-4 sm:px-6 md:px-12 pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-border/40"
      >
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm text-fg-muted flex items-center gap-2 mb-6"
          >
            <Link href="/pet" className="hover:text-fg transition-colors">
              Pet
            </Link>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <Link href="/pet" className="hover:text-fg transition-colors">
              Journal
            </Link>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <span aria-current="page" className="text-fg font-medium">
              Breed guides
            </span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full bg-fg text-bg text-[11px] font-bold tracking-widest uppercase mb-4 shadow-xs">
            Breed guides
          </span>

          <h1
            id="breed-index-heading"
            className="font-archivo font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-fg leading-none"
          >
            {breedIndex.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-fg-muted max-w-2xl leading-relaxed">
            To be confirmed. Health topics by life stage, weight and exercise,
            food notes and a dose by weight for each breed, reviewed by a vet.
          </p>
        </div>
      </section>

      {/* Interactive Controls & Breed Cards */}
      <section
        aria-label="Breed guides directory"
        className="px-4 sm:px-6 md:px-12 py-10 sm:py-16 max-w-6xl mx-auto"
      >
        <BreedBrowser initialBreeds={breedGuides} breedIndex={breedIndex} />
      </section>

      {/* Pet FDA & Animal Regulatory Notice */}
      <PetRegulatoryNotice />
    </main>
  );
}
