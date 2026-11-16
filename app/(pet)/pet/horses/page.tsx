import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata, JsonLd, DEFAULT_SITE_URL } from "@/lib/seo";

import { HorseProductsSection } from "./_components/horse-products-section";

export const metadata: Metadata = buildMetadata({
  title: "Shop Horse Formulas - Nadeon Pet",
  description:
    "Top-dress formulas for horses, dosed by weight band. Made in our Clifton, NJ lab.",
  pathname: "/pet/horses",
});

const BARN_NOTES = [
  {
    title: "Barn friendly",
    body: "Store cool and dry.",
  },
  {
    title: "Top-dress on feed",
    body: "Sprinkle on grain once a day. Weight bands on every label.",
  },
  {
    title: "Vet and competition notes",
    body: "Ask your vet before use. Check your federation rules before competing.",
  },
];

export default async function HorsesPage() {
  const products = await catalogProvider.getProducts({ species: "horse" });
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shop for Horses - Nadeon Pet",
    description: metadata.description,
    url: `${DEFAULT_SITE_URL}/pet/horses`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: p.name,
        url: `${DEFAULT_SITE_URL}/pet/products/${p.slug}`,
      })),
    },
  };

  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <JsonLd data={jsonLdData} id="horses-collection-ld" />

      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 pt-6 sm:px-8"
      >
        <ol className="flex flex-wrap gap-2 text-sm text-fg-muted">
          <li>
            <Link href="/pet" className="underline underline-offset-4">
              Pet
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>Shop</li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-bold text-fg">
            Horses
          </li>
        </ol>
      </nav>

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-8">
        <nav aria-label="Species" className="mb-6 flex gap-2">
          <Link
            href="/pet/dogs"
            className="min-h-11 inline-flex items-center rounded-pill border border-border px-4 text-sm font-bold text-fg"
          >
            Dogs
          </Link>
          <Link
            href="/pet/cats"
            className="min-h-11 inline-flex items-center rounded-pill border border-border px-4 text-sm font-bold text-fg"
          >
            Cats
          </Link>
          <Link
            href="/pet/horses"
            aria-current="page"
            className="min-h-11 inline-flex items-center rounded-pill border border-border bg-fg px-4 text-sm font-bold text-bg"
          >
            Horses
          </Link>
        </nav>

        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Nadeon Pet
        </p>
        <h1 className="title mt-2 text-4xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl">
          Shop for horses
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">
          Barn-ready formulas for daily top-dress. Dosed by weight band.
        </p>
      </section>

      <HorseProductsSection products={products} />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-8">
        <Link
          href="/pet/dose-calculator"
          className="min-h-11 inline-flex items-center rounded-pill bg-fg px-6 text-sm font-bold text-bg"
        >
          Dose calculator
        </Link>
      </div>

      <section
        aria-labelledby="barn-notes-heading"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-8"
      >
        <h2
          id="barn-notes-heading"
          className="title text-2xl font-extrabold uppercase text-fg"
        >
          Built for the barn
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {BARN_NOTES.map((note) => (
            <article
              key={note.title}
              className="rounded-card border border-border bg-bg-elevated p-6"
            >
              <h3 className="text-lg font-bold text-fg">{note.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{note.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="horse-quiz-heading"
        className="mx-auto max-w-7xl px-4 pb-16 sm:px-8"
      >
        <div className="rounded-card border border-border bg-bg-elevated p-6 sm:p-10">
          <h2
            id="horse-quiz-heading"
            className="title text-2xl font-extrabold uppercase text-fg"
          >
            Which one for my horse?
          </h2>
          <p className="mt-2 text-fg-muted">A few questions. One match.</p>
          <Link
            href="/pet/quiz"
            className="mt-6 min-h-11 inline-flex items-center rounded-pill bg-fg px-6 text-sm font-bold text-bg"
          >
            Take the quiz
          </Link>
        </div>
      </section>
    </main>
  );
}
