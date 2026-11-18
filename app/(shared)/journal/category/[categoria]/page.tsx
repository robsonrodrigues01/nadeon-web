import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrustStrip } from "@/components/brand/trust-strip";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { JournalBrowser } from "@/app/(shared)/journal/_components/journal-browser";

type JournalCategoryRouteProps = {
  params: Promise<{ categoria: string }>;
};

export async function generateMetadata({
  params,
}: JournalCategoryRouteProps): Promise<Metadata> {
  const { categoria } = await params;
  const category = await contentProvider.getJournalCategory(categoria);

  return buildMetadata({
    title: category?.title ?? "Journal",
    description: category?.description ?? "To be confirmed",
    pathname: `/journal/category/${categoria}`,
  });
}

export default async function JournalCategoryPage({
  params,
}: JournalCategoryRouteProps) {
  const { categoria } = await params;
  const category = await contentProvider.getJournalCategory(categoria);
  if (!category) notFound();

  const [page, articles] = await Promise.all([
    contentProvider.getJournalPage(category.audience),
    contentProvider.listArticlesByCategory(category.slug),
  ]);
  if (!page) notFound();

  const line = category.audience === "pet" ? "pet" : "human";
  return (
    <div data-theme={line} className="flex min-h-full flex-1 flex-col">
      <AnnouncementBar line={line} />
      <Header variant={line} />
      <JournalBrowser page={page} articles={articles} category={category} />
      <TrustStrip line={line} />
      <Footer line={line} />
    </div>
  );
}
