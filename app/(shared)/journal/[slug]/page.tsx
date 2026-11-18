import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Claim } from "@/components/commerce/product-card/claim";
import { contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";

const PENDING = "To be confirmed";

function MarkedClaim({ text }: { text: string }) {
  return <Claim showDisclaimer={text.includes("*")}>{text}</Claim>;
}

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await contentProvider.getJournalArticle(slug);
  if (!article) notFound();

  return buildMetadata({
    title: article.title,
    description: PENDING,
    pathname: `/journal/${article.slug}`,
  });
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await contentProvider.getJournalArticle(slug);
  if (!article) notFound();

  const journalPath = article.audience === "pet" ? "/pet/journal" : "/journal";
  const isPet = article.audience === "pet";

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 bg-bg text-fg">
      <article className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-fg-muted">
          <Link href={journalPath} className="underline underline-offset-4">
            Journal
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{article.category}</span>
        </nav>

        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            {article.category}
            {article.audience === "pet" && article.species.length > 0
              ? ` · ${article.species.join(", ")}`
              : ""}
          </p>
          <p className="mt-3 text-sm text-fg-muted">
            {article.readingMinutes
              ? `${article.readingMinutes} min read`
              : PENDING}
          </p>
          <h1 className="mt-4 font-archivo text-4xl font-extrabold sm:text-6xl">
            {isPet ? <MarkedClaim text={article.title} /> : article.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            {isPet ? <Claim showDisclaimer>{article.excerpt}</Claim> : PENDING}
          </p>
          <div className="mt-6 space-y-1 text-sm text-fg-muted">
            <p>{PENDING}</p>
            <p>Reviewed by: {article.reviewer || PENDING}</p>
            <p>Published: {article.publishedAt || PENDING}</p>
            <p>Updated: {article.updatedAt || PENDING}</p>
          </div>
        </header>

        <section
          aria-labelledby="article-contents"
          className="mt-12 rounded-2xl border border-border p-6"
        >
          <h2 id="article-contents" className="font-archivo text-xl font-bold">
            In this article
          </h2>
          <ol className="mt-4 space-y-3">
            {article.sections.map((section, index) => (
              <li key={section.title}>
                <a
                  className="min-h-11 text-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  href={`#section-${index + 1}`}
                >
                  {String(index + 1).padStart(2, "0")}{" "}
                  {isPet ? <MarkedClaim text={section.title} /> : section.title}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0 space-y-10">
            <p className="border-l-2 border-accent pl-5 text-sm text-fg-muted">
              {PENDING}
            </p>
            {article.sections.map((section, index) => (
              <section
                key={section.title}
                id={`section-${index + 1}`}
                aria-labelledby={`section-title-${index + 1}`}
                className="scroll-mt-8"
              >
                <h2
                  id={`section-title-${index + 1}`}
                  className="font-archivo text-2xl font-bold sm:text-3xl"
                >
                  <span className="mr-3 text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {isPet ? <MarkedClaim text={section.title} /> : section.title}
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed">
                  {PENDING}
                </p>
              </section>
            ))}
            {article.audience === "pet" && (
              <p
                role="note"
                className="border-t border-border pt-6 text-sm text-fg-muted"
              >
                For animal use only. This content is for education only and is
                not veterinary advice. Talk to your veterinarian before starting
                any supplement.
              </p>
            )}
          </div>
          <aside className="h-fit rounded-2xl border border-border p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              {article.audience === "pet"
                ? "Senior dog?"
                : "Not sure where to start?"}
            </p>
            <p className="mt-3 font-semibold">{PENDING}</p>
          </aside>
        </div>

        <footer className="mt-14 border-t border-border pt-8">
          <Link
            href={journalPath}
            className="min-h-11 inline-flex items-center underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            All articles
          </Link>
        </footer>
      </article>
    </main>
  );
}
