import type { Metadata } from "next";
import { buildFaqJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip, type TrustItem } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { FaqBrowser } from "./_components/faq-browser";
import {
  FAQ_CATEGORIES,
  FAQ_ENTRIES,
  DESIGN_FAQ_ENTRIES,
} from "./_components/faq-content";
import { NotFoundBanner, StillStuck } from "./_components/faq-help";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "FAQ | Nadeon Labs",
    description:
      "Quick answers about our formulas, orders, subscriptions, pets and quality.",
    pathname: "/faq",
  });
}

// Sem o item "Free shipping over $75": o limite de frete vem do mercado, não do código.
const TRUST_ITEMS: TrustItem[] = [
  { title: "Made in Clifton, NJ", description: "Our own lab" },
  { title: "Tested every lot", description: "Public lab reports" },
  { title: "60-day guarantee", description: "Love it or refund" },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        id="ld-faq"
        data={
          buildFaqJsonLd(DESIGN_FAQ_ENTRIES) as unknown as Record<
            string,
            unknown
          >
        }
      />
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1">
        <FaqBrowser
          entries={FAQ_ENTRIES}
          categories={FAQ_CATEGORIES}
          aside={<StillStuck />}
        >
          <p className="inline-block rounded-pill bg-gradient-gold px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-fg">
            Help center
          </p>
          <h1 className="mt-4 font-archivo text-4xl font-extrabold uppercase leading-[0.95] text-fg sm:text-6xl sm:text-center lg:text-7xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-base text-fg-muted sm:text-lg">
            Quick answers about our formulas, orders, subscriptions, pets and
            quality.
          </p>
        </FaqBrowser>
        <NotFoundBanner />
      </main>

      <TrustStrip line="human" items={TRUST_ITEMS} />
      <Newsletter
        variant="human"
        title="Join the Nadeon list"
        subtitle="10% off your first order, plus new science, launches and members-only offers. No spam."
        buttonText="Get 10% off"
      />
      <Footer line="human" />
    </>
  );
}
