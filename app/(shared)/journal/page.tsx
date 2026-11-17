import type { Metadata } from "next";
import { contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { JournalBrowser } from "./_components/journal-browser";

export const metadata: Metadata = buildMetadata({
  title: "The Nadeon Journal",
  description: "To be confirmed",
  pathname: "/journal",
});

export default async function HumanJournalPage() {
  const [page, articles] = await Promise.all([
    contentProvider.getJournalPage("human"),
    contentProvider.listJournalArticles("human"),
  ]);

  if (!page) return null;
  return <JournalBrowser page={page} articles={articles} />;
}
