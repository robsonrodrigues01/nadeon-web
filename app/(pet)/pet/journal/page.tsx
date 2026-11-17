import type { Metadata } from "next";
import { contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { JournalBrowser } from "@/app/(shared)/journal/_components/journal-browser";

export const metadata: Metadata = buildMetadata({
  title: "The Pet Journal",
  description: "To be confirmed",
  pathname: "/pet/journal",
});

export default async function PetJournalPage() {
  const [page, articles] = await Promise.all([
    contentProvider.getJournalPage("pet"),
    contentProvider.listJournalArticles("pet"),
  ]);

  if (!page) return null;
  return <JournalBrowser page={page} articles={articles} />;
}
