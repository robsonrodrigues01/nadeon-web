import type { Metadata } from "next";
import Link from "next/link";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { getVisitorMarket } from "@/lib/market/visitor";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { PetRegulatoryNotice } from "../../_components/pet-regulatory-notice";
import { ConcernProductCard } from "./_components/concern-product-card";
import { ConcernFilters } from "./_components/concern-filters";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ problema: string }>;
}): Promise<Metadata> {
  const { problema } = await params;
  return buildMetadata({
    title: "To be confirmed | Nadeon Pet",
    description: "To be confirmed.",
    pathname: `/pet/concern/${encodeURIComponent(problema)}`,
  });
}

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function ConcernPage({
  params,
  searchParams,
}: {
  params: Promise<{ problema: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ problema }, query, market] = await Promise.all([
    params,
    searchParams,
    getVisitorMarket(),
  ]);
  const baseFilter = { line: "pet" as const, species: "dog" as const };
  const isGenericCollection = [
    "all",
    "human",
    "pet",
    "dogs",
    "cats",
    "horses",
  ].includes(problema.toLowerCase());
  const [baseCollection, recommendedCollection] = await Promise.all([
    isGenericCollection
      ? null
      : catalogProvider.getCollection(problema, baseFilter),
    isGenericCollection
      ? null
      : catalogProvider.getCollection(problema, baseFilter, "featured"),
  ]);

  const formats = [
    ...new Set(baseCollection?.products.map((product) => product.format) ?? []),
  ];
  const requestedFormat = first(query.format);
  const format =
    formats.find(
      (item) => item.toLowerCase() === requestedFormat.toLowerCase()
    ) ?? "";
  const filteredCollection = format
    ? await catalogProvider.getCollection(
        problema,
        { ...baseFilter, format },
        "featured"
      )
    : null;
  const collection =
    filteredCollection ?? recommendedCollection ?? baseCollection;
  const products =
    collection?.products.filter(
      (product) => !format || product.format === format
    ) ?? [];

  return (
    <>
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-fg-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/pet" className="underline underline-offset-4">
                  Pet
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/pet/dogs" className="underline underline-offset-4">
                  Shop by concern
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">To be confirmed</li>
            </ol>
          </nav>

          <section
            aria-labelledby="concern-heading"
            className="rounded-card bg-bg-elevated px-5 py-10 sm:px-10 sm:py-16"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Shop by concern
            </p>
            <h1
              id="concern-heading"
              className="mt-3 max-w-4xl font-archivo text-4xl font-extrabold uppercase leading-tight text-fg sm:text-6xl"
            >
              Dealing with To be confirmed? You are not alone.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-fg-muted">
              To be confirmed.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#routine"
                className="inline-flex min-h-11 items-center rounded-pill bg-fg px-6 font-bold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                See the routine
              </Link>
              <Link
                href="/help#contact"
                className="inline-flex min-h-11 items-center rounded-pill border border-border px-6 font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Talk to us
              </Link>
            </div>
          </section>

          <section aria-labelledby="causes-heading" className="py-12 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              WHAT CAUSES IT
            </p>
            <h2
              id="causes-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
            >
              Why To be confirmed happens
            </h2>
            <p className="mt-3 max-w-2xl text-fg-muted">To be confirmed.</p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((number) => (
                <li
                  key={number}
                  className="rounded-card border border-border bg-bg-elevated p-5"
                >
                  <p className="text-sm font-bold text-accent">{number}</p>
                  <h3 className="mt-3 font-bold text-fg">To be confirmed</h3>
                  <p className="mt-2 text-sm text-fg-muted">To be confirmed.</p>
                </li>
              ))}
            </ol>
          </section>

          <section
            id="routine"
            aria-labelledby="routine-heading"
            className="scroll-mt-8 rounded-card border border-border p-5 sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              RECOMMENDED ROUTINE
            </p>
            <h2
              id="routine-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
            >
              Your To be confirmed routine
            </h2>
            <p className="mt-3 text-fg-muted">To be confirmed.</p>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((step) => (
                <li key={step} className="rounded-card bg-bg-elevated p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">
                    STEP {step} · To be confirmed
                  </p>
                  <h3 className="mt-3 font-bold text-fg">To be confirmed</h3>
                  <p className="mt-2 text-sm text-fg-muted">To be confirmed.</p>
                </li>
              ))}
            </ol>
            <button
              type="button"
              disabled
              className="mt-6 inline-flex min-h-11 cursor-not-allowed items-center rounded-pill bg-fg/40 px-6 font-bold text-bg"
            >
              Add full routine to cart
            </button>
          </section>

          <section
            aria-labelledby="products-heading"
            className="py-12 sm:py-16"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  SHOP To be confirmed
                </p>
                <h2
                  id="products-heading"
                  className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
                >
                  All products for To be confirmed
                </h2>
                <p className="mt-2 text-sm text-fg-muted">
                  {collection ? products.length : "To be confirmed"} products
                  for To be confirmed
                </p>
              </div>
              <ConcernFilters formats={formats} selectedFormat={format} />
            </div>
            {products.length ? (
              <ul
                aria-label="Products"
                className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {products.map((product) => (
                  <li key={product.slug}>
                    <ConcernProductCard
                      product={product}
                      price={
                        product.variants[0]
                          ? formatMoneyWithMarket(
                              product.variants[0].price,
                              market
                            )
                          : "To be confirmed"
                      }
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-7 rounded-card border border-border bg-bg-elevated p-6 text-fg-muted">
                To be confirmed.
              </p>
            )}
          </section>

          <section
            aria-labelledby="vet-note-heading"
            className="grid gap-4 rounded-card bg-bg-elevated p-6 sm:grid-cols-[1fr_2fr] sm:p-8"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                A NOTE FROM OUR VET
              </p>
              <h2
                id="vet-note-heading"
                className="mt-2 font-archivo text-2xl font-extrabold uppercase text-fg"
              >
                To be confirmed
              </h2>
            </div>
            <p className="text-fg-muted">To be confirmed.</p>
          </section>

          <section
            id="related-concerns"
            aria-labelledby="related-heading"
            className="py-12 sm:py-16"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  RELATED CONCERNS
                </p>
                <h2
                  id="related-heading"
                  className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
                >
                  Also looking into
                </h2>
              </div>
              <Link
                href="#related-concerns"
                className="inline-flex min-h-11 items-center font-bold text-fg underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                All concerns →
              </Link>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <li
                  key={item}
                  className="rounded-card border border-border p-4 text-center text-sm font-bold text-fg"
                >
                  To be confirmed
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq-heading" className="pb-12 sm:pb-16">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
            >
              To be confirmed questions
            </h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {[
                "What helps with To be confirmed?",
                "How long does the routine take to work?",
                "Can I use it with my dog's medication?",
                "Which product should I start with?",
                "When should I see my vet?",
              ].map((question) => (
                <details key={question} className="group py-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center py-2 font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    {question}
                  </summary>
                  <p className="pb-2 text-sm text-fg-muted">To be confirmed.</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <PetRegulatoryNotice />
    </>
  );
}
