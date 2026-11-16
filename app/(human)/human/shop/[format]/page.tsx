import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogProvider } from "@/lib/providers";
import {
  CatalogSortSchema,
  type CatalogSort,
  type Product,
  type ProductFaq,
} from "@/lib/contracts/catalog";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildMetadata,
} from "@/lib/seo";
import {
  SHOP_FORMATS,
  getShopFormat,
  type ShopFormat,
} from "./_components/format-config";
import { getHumanShopGoals } from "./_components/format-goals";
import { FormatHero } from "./_components/format-hero";
import { ShopProducts } from "./_components/shop-products";
import { CompareFormats } from "./_components/compare-formats";
import { QuizTeaser } from "./_components/quiz-teaser";
import { FormatFaq } from "./_components/format-faq";

type RouteParams = { format: string };
type PageProps = {
  params: Promise<RouteParams>;
  searchParams: Promise<{
    sort?: string | string[];
    goal?: string | string[];
  }>;
};

export function generateStaticParams(): RouteParams[] {
  return SHOP_FORMATS.map((f) => ({ format: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { format } = await params;
  const shopFormat = getShopFormat(format);
  if (!shopFormat) return {};
  return buildMetadata({
    title: `Shop ${shopFormat.label.toLowerCase()}`,
    pathname: `/human/shop/${shopFormat.slug}`,
  });
}

function parseSort(raw: string | string[] | undefined): CatalogSort {
  const parsed = CatalogSortSchema.safeParse(raw);
  return parsed.success ? parsed.data : "featured";
}

function countFor(products: Product[], format: ShopFormat): number {
  return products.filter(
    (p) => p.format.toLowerCase() === format.catalogFormat.toLowerCase()
  ).length;
}

function uniqueFaqs(products: Product[]): ProductFaq[] {
  const seen = new Set<string>();
  const faqs: ProductFaq[] = [];
  for (const product of products) {
    for (const faq of product.faq) {
      if (seen.has(faq.question)) continue;
      seen.add(faq.question);
      faqs.push(faq);
    }
  }
  return faqs;
}

export default async function ShopByFormatPage({
  params,
  searchParams,
}: PageProps) {
  const { format: formatSlug } = await params;
  const current = getShopFormat(formatSlug);
  if (!current) notFound();

  const query = await searchParams;
  const sort = parseSort(query.sort);

  const [collection, humanProducts] = await Promise.all([
    catalogProvider.getCollection(
      "human",
      { line: "human", format: current.catalogFormat },
      sort === "featured" ? undefined : sort
    ),
    catalogProvider.getProducts({ line: "human" }),
  ]);
  if (!collection) notFound();

  const products = collection.products;
  // Objetivo válido e com produtos neste formato; qualquer outro valor vira "All".
  const goals = getHumanShopGoals()
    .map((goal) => ({
      ...goal,
      count: products.filter((p) => goal.productSlugs.has(p.slug)).length,
    }))
    .filter((goal) => goal.count > 0);
  const activeGoal = goals.find((goal) => goal.id === query.goal) ?? null;
  const shownProducts = activeGoal
    ? products.filter((p) => activeGoal.productSlugs.has(p.slug))
    : products;
  const tabs = SHOP_FORMATS.map((format) => ({
    format,
    count: countFor(humanProducts, format),
  }));
  const faqs = uniqueFaqs(products);
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Human", url: "/human" },
    { name: "Shop", url: "/human/shop" },
    { name: current.label, url: `/human/shop/${current.slug}` },
  ]);

  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd
        data={breadcrumb as unknown as Record<string, unknown>}
        id="breadcrumb-jsonld"
      />
      {faqs.length > 0 && (
        <JsonLd
          data={buildFaqJsonLd(faqs) as unknown as Record<string, unknown>}
          id="faq-jsonld"
        />
      )}

      <FormatHero
        current={current}
        tabs={tabs}
        jarNames={products.slice(0, 3).map((p) => p.name)}
      />
      <ShopProducts
        format={current}
        products={shownProducts}
        sort={sort}
        goals={goals.map(({ id, label }) => ({ id, label }))}
        activeGoal={activeGoal?.id ?? null}
      />
      <CompareFormats current={current} formats={SHOP_FORMATS} />
      <QuizTeaser />
      <FormatFaq title={current.faqTitle} faqs={faqs} />
    </main>
  );
}
