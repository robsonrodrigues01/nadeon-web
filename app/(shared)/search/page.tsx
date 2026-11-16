import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import { getDefaultMarket, getMarket } from "@/lib/market/markets";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Footer } from "@/components/layout/footer";
import { SearchField } from "./_components/search-field";
import { SearchResults } from "./_components/search-results";
import {
  SearchPopularAndQuiz,
  SearchTrySuggestions,
} from "./_components/search-suggestions";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; format?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Search Nadeon Human",
    description: "Search Nadeon Human products.",
    pathname: "/search",
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", format = "" } = await searchParams;
  const query = q.trim();
  // Search is scoped to the Human line, as in the design; Pet results stay out.
  const matches = query
    ? (await catalogProvider.search(query)).filter((p) => p.line === "human")
    : [];
  const cookieStore = await cookies();
  const market =
    getMarket(cookieStore.get(MARKET_COOKIE_NAME)?.value) ?? getDefaultMarket();

  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <section
          aria-labelledby="search-heading"
          className="px-5 py-8 sm:px-8 lg:px-18"
        >
          <h1
            id="search-heading"
            className="title text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-4xl"
          >
            Search Nadeon Human
          </h1>
          <div className="mt-6">
            <SearchField key={query} initialQuery={query} />
          </div>
          <SearchTrySuggestions />
        </section>

        {query && (
          <SearchResults
            query={query}
            matches={matches}
            activeFormat={format.trim().toLowerCase()}
            market={market}
          />
        )}

        <SearchPopularAndQuiz />
      </main>

      <TrustStrip line="human" />
      <Footer line="human" />
    </>
  );
}
