"use client";

import { useState } from "react";
import Link from "next/link";
import { Newsletter } from "@/components/brand/newsletter";
import type {
  JournalArticleSummary,
  JournalCategory,
  JournalPage,
} from "@/lib/contracts/content";

export function JournalBrowser({
  page,
  articles,
  category: categoryPage,
}: {
  page: JournalPage;
  articles: JournalArticleSummary[];
  category?: JournalCategory;
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [species, setSpecies] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleArticles = articles.filter((article) => {
    const matchesQuery =
      `${article.title} ${article.excerpt} ${article.category}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    const matchesSpecies =
      species === "all" ||
      article.species.includes(species as "dog" | "cat" | "horse");
    return matchesQuery && matchesCategory && matchesSpecies;
  });

  return (
    <main
      id="main-content"
      tabIndex={-1}
      data-theme={categoryPage?.audience === "pet" ? "pet" : undefined}
      className="flex-1 bg-bg text-fg"
    >
      <section className="border-b border-border px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {categoryPage ? (
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-fg-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href={
                      categoryPage.audience === "pet"
                        ? "/pet/journal"
                        : "/journal"
                    }
                    className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Journal
                  </Link>
                </li>
                {categoryPage.audience === "pet" && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li className="inline-flex min-h-11 items-center">Dogs</li>
                  </>
                )}
                <li aria-hidden="true">/</li>
                <li
                  aria-current="page"
                  className="inline-flex min-h-11 items-center"
                >
                  {categoryPage.title}
                </li>
              </ol>
            </nav>
          ) : (
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              {page.eyebrow}
            </p>
          )}
          <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-archivo text-5xl font-extrabold uppercase sm:text-7xl">
                {categoryPage?.title ?? page.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
                {categoryPage?.description ?? page.description}
              </p>
              {categoryPage && (
                <p className="mt-4 text-sm text-fg-muted">
                  Reviewed by {categoryPage.reviewer}
                </p>
              )}
            </div>
            {!categoryPage && (
              <label className="flex min-h-12 items-center gap-3 rounded-full border border-border px-5 focus-within:ring-2 focus-within:ring-accent lg:w-80">
                <span aria-hidden="true" className="text-xl">
                  ⌕
                </span>
                <input
                  aria-label="Search the journal"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Search the journal"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted"
                />
              </label>
            )}
          </div>

          <div
            className="mt-8 flex flex-wrap gap-2"
            role="group"
            aria-label={
              categoryPage
                ? "Every article in this category"
                : "Journal categories"
            }
          >
            {(categoryPage
              ? ["All", ...categoryPage.subcategories]
              : page.categories
            ).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={selectedCategory === item}
                onClick={() => setSelectedCategory(item)}
                className={`min-h-11 rounded-full border px-5 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${selectedCategory === item ? "border-transparent bg-gradient-gold text-accent-fg" : "border-border text-fg"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {page.audience === "pet" && !categoryPage && (
            <label className="mt-6 flex min-h-11 w-fit items-center gap-3 text-sm font-bold">
              Species
              <select
                value={species}
                onChange={(event) => setSpecies(event.currentTarget.value)}
                className="min-h-11 rounded-full border border-border bg-bg px-4 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="all">All pets</option>
                {page.species
                  .filter((item) => item !== "All pets")
                  .map((item) => (
                    <option
                      key={item}
                      value={item.toLowerCase().replace(/s$/, "")}
                    >
                      {item}
                    </option>
                  ))}
              </select>
            </label>
          )}
        </div>
      </section>

      <section
        aria-labelledby="articles-title"
        className="bg-bg-elevated px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              {!categoryPage && (
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  LATEST
                </p>
              )}
              <h2
                id="articles-title"
                className="mt-2 font-archivo text-3xl font-extrabold uppercase sm:text-5xl"
              >
                {categoryPage
                  ? "Every article in this category"
                  : "All articles"}
              </h2>
            </div>
            <p className="text-sm text-fg-muted" aria-live="polite">
              Showing {Math.min(visibleCount, visibleArticles.length)} of{" "}
              {visibleArticles.length} articles
            </p>
          </div>
          {visibleArticles.length ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.slice(0, visibleCount).map((article) => (
                <li key={article.slug}>
                  <article className="flex h-full flex-col rounded-card border border-border bg-bg p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">
                      {article.category}
                      {article.readingMinutes
                        ? ` · ${article.readingMinutes} min read`
                        : ""}
                    </p>
                    {article.species.length > 0 && (
                      <p className="mt-2 text-sm text-fg-muted">
                        {article.species.join(" · ")}
                      </p>
                    )}
                    <h3 className="mt-4 font-archivo text-xl font-bold">
                      {article.title}
                    </h3>
                    <p className="mt-3 flex-1 leading-relaxed text-fg-muted">
                      {article.excerpt}
                    </p>
                    <button
                      type="button"
                      disabled
                      className="mt-6 min-h-11 self-start rounded-full bg-gradient-gold px-6 font-bold uppercase text-accent-fg opacity-60"
                    >
                      Read the article
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-card border border-border p-8 text-fg-muted">
              To be confirmed
            </p>
          )}
          {visibleArticles.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 6)}
              className="mx-auto mt-8 flex min-h-11 items-center rounded-full border border-border px-6 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Load more articles
            </button>
          )}
        </div>
      </section>

      {page.audience === "pet" && !categoryPage && (
        <section
          aria-labelledby="breed-title"
          className="px-5 py-14 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-7xl rounded-card border border-border p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-fg-muted">
              BREED GUIDES
            </p>
            <h2
              id="breed-title"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase"
            >
              Know your breed
            </h2>
            <p className="mt-3 text-fg-muted">To be confirmed</p>
          </div>
        </section>
      )}

      {categoryPage?.audience === "pet" ? (
        <section className="px-5 py-14 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl rounded-card bg-gradient-sunrise p-6 sm:p-10">
            <h2 className="font-archivo text-2xl font-extrabold uppercase sm:text-3xl">
              Not sure what your dog needs?
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
              Answer 6 quick questions about age, size and goals. Get a formula
              and a dose by weight.
            </p>
            <Link
              href="/pet/quiz"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-fg px-6 font-bold uppercase text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Take the 60-second quiz
            </Link>
          </div>
        </section>
      ) : !categoryPage ? (
        <section className="px-5 py-14 sm:px-8 lg:px-12">
          <div
            data-theme="pet"
            className="mx-auto max-w-7xl rounded-card bg-gradient-sunrise p-6 sm:p-10"
          >
            <p className="mb-4 inline-flex min-h-8 items-center rounded-full bg-fg px-4 text-xs font-bold uppercase tracking-widest text-bg">
              Newsletter
            </p>
            <Newsletter
              variant={page.audience}
              title="One good read a week"
              subtitle={
                page.audience === "pet"
                  ? "Vet-reviewed tips for dogs, cats and horses, new guides and 10% off their first jar. No spam, unsubscribe anytime."
                  : "New articles, research summaries and routine tips. Plus 10% off your first order. No spam, unsubscribe anytime."
              }
              buttonText="Subscribe"
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
