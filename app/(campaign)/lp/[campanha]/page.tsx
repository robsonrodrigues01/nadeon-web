import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Claim } from "@/components/commerce/product-card/claim";
import { CountdownTimer } from "@/components/layout/announcement-bar";
import type { Campaign } from "@/lib/contracts/campaign";
import type { JournalArticle } from "@/lib/contracts/content";
import { campaignConfig, contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Advertisement | Nadeon Labs",
  description: "To be confirmed.",
  pathname: "/lp/[campanha]",
});

type CampaignTemplate = "listicle" | "product" | "seasonal";

function getTemplate(slug: string): {
  type: CampaignTemplate;
  contentSlug: string;
} {
  if (slug === "black-friday") {
    return { type: "seasonal", contentSlug: slug };
  }

  const separator = slug.indexOf("-");
  const prefix = slug.slice(0, separator);
  if (prefix === "listicle" || prefix === "product" || prefix === "seasonal") {
    return { type: prefix, contentSlug: slug.slice(separator + 1) };
  }
  notFound();
}

function ArticleSections({ article }: { article: JournalArticle | null }) {
  if (!article) return <p>Editorial content: To be confirmed.</p>;

  return (
    <>
      {article.sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="font-archivo text-2xl font-bold text-fg">
            {section.title}
          </h2>
          <p className="leading-relaxed text-fg-muted">
            {section.body.includes("*") ? (
              <Claim showDisclaimer>{section.body}</Claim>
            ) : (
              section.body
            )}
          </p>
        </section>
      ))}
    </>
  );
}

function PetDisclaimer({
  article,
  isPet,
}: {
  article: JournalArticle | null;
  isPet: boolean;
}) {
  if (!isPet) return null;

  return (
    <p className="border-t border-border pt-4 text-sm text-fg-muted">
      For animal use only.
      {article?.species.includes("horse") &&
        " Equine products: not for horses intended for food."}
    </p>
  );
}

function OfferPending({ campaign }: { campaign: Campaign }) {
  return (
    <section className="space-y-3 rounded-card border border-border bg-bg-elevated p-6">
      <h2 className="font-archivo text-2xl font-bold text-fg">
        Exclusive reader offer
      </h2>
      <p>Offer details: {campaign.discountCode ?? "To be confirmed"}.</p>
      <p>Price: To be confirmed.</p>
    </section>
  );
}

export default async function CampaignLandingPage({
  params,
}: {
  params: Promise<{ campanha: string }>;
}) {
  const { campanha } = await params;
  const template = getTemplate(campanha);
  const campaign = await campaignConfig.getActiveCampaign();
  if (!campaign?.isActive || campaign.id !== campanha) notFound();

  const article =
    template.type === "seasonal"
      ? null
      : await contentProvider.getJournalArticle(template.contentSlug);

  if (template.type === "seasonal") {
    const countdown = campaign.countdownEnd
      ? new Date(campaign.countdownEnd)
      : null;
    const hasCountdown = countdown && Number.isFinite(countdown.getTime());

    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl space-y-10 px-5 py-10 sm:px-8 lg:py-16"
      >
        <header className="space-y-5 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-fg-muted">
            Nadeon Pet ·{" "}
            {campaign.bannerText ?? "Campaign dates: To be confirmed."}
          </p>
          <h1 className="font-archivo text-4xl font-black text-fg sm:text-6xl">
            {campaign.heroTitle ?? campaign.name}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-fg-muted">
            Campaign details: To be confirmed.
          </p>
          {hasCountdown && (
            <CountdownTimer countdownEnd={campaign.countdownEnd!} line="pet" />
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pet/kits"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-accent-fg focus-visible:outline-2 focus-visible:outline-accent"
            >
              Shop {campaign.name}
            </Link>
            <Link
              href="/pet/kits"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 py-3 font-bold text-fg focus-visible:outline-2 focus-visible:outline-accent"
            >
              See gift sets
            </Link>
          </div>
        </header>
        <section className="grid gap-4 rounded-card border border-border p-6 sm:grid-cols-3">
          <h2 className="font-archivo text-xl font-bold sm:col-span-3">
            Shipping deadlines: To be confirmed.
          </h2>
          <p>Offer tiers: To be confirmed.</p>
          <p>Gift options: To be confirmed.</p>
          <p>Gift set details: To be confirmed.</p>
        </section>
        <PetDisclaimer article={null} isPet />
      </main>
    );
  }

  const isPet = template.type === "listicle";
  const title = article?.title ?? "To be confirmed";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-4xl space-y-10 px-5 py-10 sm:px-8 lg:py-16"
    >
      <header className="space-y-4">
        <p className="font-bold uppercase tracking-widest text-fg-muted">
          Advertisement
        </p>
        <p className="text-sm font-semibold text-fg-muted">
          {isPet ? "Sponsored by Nadeon Labs" : "Paid content from Nadeon Labs"}
        </p>
        <p className="text-sm text-fg-muted">
          {article?.category ?? "Section: To be confirmed"}
        </p>
        <h1 className="font-archivo text-4xl font-black text-fg sm:text-6xl">
          {title}
        </h1>
        <p className="text-lg leading-relaxed text-fg-muted">
          {article?.excerpt ?? "Editorial summary: To be confirmed."}
        </p>
        <p className="text-sm text-fg-muted">
          By To be confirmed · To be confirmed ·{" "}
          {article?.readingMinutes
            ? `${article.readingMinutes} min read`
            : "Reading time: To be confirmed"}
        </p>
      </header>
      {template.type === "product" && (
        <section className="space-y-4">
          <h2 className="font-archivo text-3xl font-bold text-fg">
            From capsule to cell
          </h2>
          <p>Product explanation: To be confirmed.</p>
          <p>Product facts: To be confirmed.</p>
          <p>Comparison data: To be confirmed.</p>
        </section>
      )}
      <article className="space-y-8">
        <ArticleSections article={article} />
        {template.type === "listicle" && (
          <p>Customer testimonial: To be confirmed.</p>
        )}
      </article>
      <OfferPending campaign={campaign} />
      <p className="text-sm text-fg-muted">
        {isPet
          ? "This page is an advertisement and not a news article. Sponsored content from Nadeon Labs. This content is for education only and is not veterinary advice."
          : "This page is an advertisement and not a news article. Sponsored content from Nadeon Labs. Talk to your doctor before starting any supplement."}
      </p>
      <PetDisclaimer article={article} isPet={isPet} />
    </main>
  );
}
