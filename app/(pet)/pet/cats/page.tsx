import Link from "next/link";
import { notFound } from "next/navigation";
import type { Product } from "@/lib/contracts/catalog";
import { catalogProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { DEFAULT_MARKET } from "@/lib/market/markets";
import { ProductCard } from "@/components/commerce/product-card/product-card";
import { Button } from "@/components/ui/button";
import { CatFilters, type CatFilterOption } from "./_components/cat-filters";
import { CatKitCard } from "./_components/cat-kit-card";
import {
  savePercent,
  type CatKitView,
  type CatSort,
} from "./_components/cat-query";

// Design copy: the only FAQ in the cat board with an answer. The other four
// questions have no answer text in the design, so they stay out of the page.
const CAT_FAQS: { question: string; answer: string }[] = [
  {
    question: "How do I give drops to my cat?",
    answer:
      "Follow the weight chart on the label and ask your vet before starting.",
  },
];

export const metadata = buildMetadata({
  title: "Shop for cats",
  description: "Small doses for small bodies.",
  pathname: "/pet/cats",
});

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function distinct<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export default async function CatsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const format = one(params.format).toLowerCase();
  const sort: CatSort =
    one(params.sort) === "best-selling" ? "best-selling" : "featured";
  const locale = DEFAULT_MARKET.locale;

  const [collection, petProducts, kits] = await Promise.all([
    catalogProvider.getCollection(
      "cats",
      { line: "pet", species: "cat" },
      sort === "best-selling" ? "best-selling" : undefined
    ),
    catalogProvider.getProducts({ line: "pet" }),
    catalogProvider.getKits("pet"),
  ]);

  if (!collection) {
    notFound();
  }

  const catProducts: Product[] = collection.products;
  const total = catProducts.length;

  // Format options come only from the catalog data, never from fixed labels.
  const formats: CatFilterOption[] = distinct(
    catProducts.map((p) => p.format)
  ).map((label) => ({
    value: label.toLowerCase(),
    label,
    count: catProducts.filter((p) => p.format === label).length,
  }));

  const visibleProducts = catProducts.filter(
    (p) => !format || p.format.toLowerCase() === format
  );

  const bySlug = new Map(petProducts.map((p) => [p.slug, p]));
  const catKits: CatKitView[] = kits.flatMap((kit) => {
    const members = kit.products.map((ref) => ({
      product: bySlug.get(ref.productSlug),
      quantity: ref.quantity,
    }));
    const catMembers = members.flatMap((m) =>
      m.product && m.product.species === "cat"
        ? [{ product: m.product, quantity: m.quantity }]
        : []
    );
    if (catMembers.length === 0 || catMembers.length !== members.length) {
      return [];
    }
    return [
      {
        slug: kit.slug,
        name: kit.name,
        description: kit.description,
        productNames: catMembers.map((m) => m.product.name),
        formats: distinct(catMembers.map((m) => m.product.format)),
        price: kit.price,
        compareAtPrice: kit.compareAtPrice,
        savePercent: savePercent(kit.price, kit.compareAtPrice),
        lines: catMembers.flatMap((m) =>
          m.product.variants[0]
            ? [{ variantId: m.product.variants[0].id, quantity: m.quantity }]
            : []
        ),
      },
    ];
  });

  // The first kit feeds the "[Kit name] kits" banner; the card grid lists all.
  const featuredKit = catKits[0];

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Pet", url: "/pet" },
    { name: "Shop", url: null },
    { name: "Cats", url: "/pet/cats" },
  ]);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={{ ...breadcrumb }} id="breadcrumb-jsonld" />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-fg-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/pet" className="underline">
              Pet
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>Shop</li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-fg">
            Cats
          </li>
        </ol>
      </nav>

      <header className="mb-8 flex flex-col gap-2">
        <p className="label text-xs font-bold uppercase tracking-wider text-accent">
          Nadeon Pet
        </p>
        <h1 className="title text-4xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl">
          Shop for cats
        </h1>
        <p className="text-base text-fg-muted">Small doses for small bodies.</p>
      </header>

      <nav aria-label="Species" className="mb-6 flex flex-wrap gap-2">
        <Button href="/pet/dogs" variant="secondary" size="sm">
          Dogs
        </Button>
        <Button
          href="/pet/cats"
          variant="primary"
          size="sm"
          aria-current="page"
        >
          Cats
        </Button>
        <Button href="/pet/horses" variant="secondary" size="sm">
          Horses
        </Button>
      </nav>

      <CatFilters
        basePath="/pet/cats"
        format={format}
        sort={sort}
        total={total}
        formats={formats}
      />

      <section aria-label="Products" className="mt-8">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} locale={locale} />
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="cat-quiz-banner-title"
        className="mt-12 flex flex-col gap-4 rounded-card border border-border bg-bg-elevated p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2
            id="cat-quiz-banner-title"
            className="title text-2xl font-extrabold uppercase tracking-tight text-fg"
          >
            Which one for my cat?
          </h2>
          <p className="text-sm text-fg-muted">A few questions. One match.</p>
        </div>
        <Button href="/pet/quiz" variant="primary">
          Take the quiz
        </Button>
      </section>

      {featuredKit && (
        <section
          aria-labelledby="cat-kit-banner-title"
          className="mt-6 flex flex-col gap-4 rounded-card border border-border bg-bg-elevated p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2
              id="cat-kit-banner-title"
              className="title text-2xl font-extrabold uppercase tracking-tight text-fg"
            >
              {featuredKit.name} kits
            </h2>
            {featuredKit.savePercent !== null &&
              featuredKit.productNames.length === 2 && (
                <p className="text-sm text-fg-muted">
                  Pair two formulas and save {featuredKit.savePercent}%.
                </p>
              )}
          </div>
          <Button href="#cat-kits" variant="primary">
            See kits
          </Button>
        </section>
      )}

      {catKits.length > 0 && (
        <section
          id="cat-kits"
          aria-labelledby="cat-kits-title"
          className="mt-12"
        >
          <p className="label text-xs font-bold uppercase tracking-wider text-accent">
            Kits · Bundle &amp; save
          </p>
          <h2
            id="cat-kits-title"
            className="title mb-6 text-3xl font-extrabold uppercase tracking-tight text-fg"
          >
            Cat kits
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catKits.map((kit) => (
              <li key={kit.slug}>
                <CatKitCard kit={kit} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="cat-science-title" className="mt-12">
        <p className="label text-xs font-bold uppercase tracking-wider text-accent">
          Cat science
        </p>
        <h2
          id="cat-science-title"
          className="title mb-6 text-3xl font-extrabold uppercase tracking-tight text-fg"
        >
          Why cats are different
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            aria-hidden="true"
            className="aspect-4/3 w-full rounded-card border border-border bg-bg-elevated"
          />
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="title text-xl font-extrabold uppercase tracking-tight text-fg">
                Small bodies, small doses
              </h3>
              <p className="mt-2 text-sm text-fg-muted">
                Cats need precise amounts.
              </p>
            </div>
            <div>
              <h3 className="title text-xl font-extrabold uppercase tracking-tight text-fg">
                Picky eaters
              </h3>
              <p className="mt-2 text-sm text-fg-muted">
                {distinct(catProducts.map((p) => p.format)).join(", ")} that
                mixes into wet food without changing taste.
              </p>
            </div>
            <div>
              <h3 className="title text-xl font-extrabold uppercase tracking-tight text-fg">
                Ask your vet
              </h3>
              <p className="mt-2 text-sm text-fg-muted">
                Especially for cats with a health condition or on medication.
              </p>
            </div>
            <div>
              <Button href="/pet/dose-calculator" variant="secondary">
                Read the guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="cat-pet-quiz-title"
        className="mt-12 flex flex-col gap-4 rounded-card border border-border bg-bg-elevated p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="label text-xs font-bold uppercase tracking-wider text-accent">
            Pet quiz
          </p>
          <h2
            id="cat-pet-quiz-title"
            className="title text-2xl font-extrabold uppercase tracking-tight text-fg"
          >
            Not sure what your cat needs?
          </h2>
          <p className="text-sm text-fg-muted">
            Answer a few questions about age, weight and what your cat needs.
          </p>
        </div>
        <Button href="/pet/quiz" variant="primary">
          Take the quiz
        </Button>
      </section>

      <section aria-labelledby="cat-faq-title" className="mt-12">
        <p className="label text-xs font-bold uppercase tracking-wider text-accent">
          FAQ
        </p>
        <h2
          id="cat-faq-title"
          className="title mb-6 text-3xl font-extrabold uppercase tracking-tight text-fg"
        >
          Cat questions
        </h2>
        <ul className="flex flex-col gap-3">
          {CAT_FAQS.map((item) => (
            <li key={item.question}>
              <details className="rounded-card border border-border bg-bg-elevated p-4">
                <summary className="min-h-11 cursor-pointer text-base font-bold text-fg">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm text-fg-muted">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
