import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip, type TrustItem } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  ScienceHero,
  WhatNadDoesSection,
  NmnPathwaySection,
  NadDeclineSection,
} from "./_components/science-sections";
import { IngredientsSection } from "./_components/ingredients-section";
import { ScienceFaq, type ScienceFaqItem } from "./_components/science-faq";
import { buildIngredientCards } from "./_components/ingredient-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "The Science",
    description:
      "NAD+ is a coenzyme found in every living cell. Here is what it does, how NMN becomes NAD+, and how we test what goes into every jar.",
    pathname: "/science",
  });
}

// Só as perguntas com resposta no design. As demais ficam fora até ter texto aprovado.
const FAQ_ITEMS: ScienceFaqItem[] = [
  {
    question: "Is NMN the same as NAD+?",
    answer:
      "No. NMN is a precursor, the building block your cells convert into NAD+ in a single enzyme step. NAD+ is the coenzyme itself. We make formulas with each, and some people use both.",
  },
];

const TRUST_ITEMS: TrustItem[] = [
  { title: "Made in Clifton, NJ", description: "Our own lab" },
  { title: "Tested every lot", description: "Public lab reports" },
  { title: "60-day guarantee", description: "Love it or refund" },
];

export default async function SciencePage() {
  const humanProducts = await catalogProvider.getProducts({ line: "human" });
  const ingredients = buildIngredientCards(humanProducts);

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Science", url: "/science" },
          ]) as unknown as Record<string, unknown>
        }
      />
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1">
        <ScienceHero />
        <WhatNadDoesSection />
        <NmnPathwaySection />
        <NadDeclineSection />
        <IngredientsSection ingredients={ingredients} />

        <section
          aria-labelledby="science-faq-title"
          className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
        >
          <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-8">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
                  FAQ
                </p>
                <h2
                  id="science-faq-title"
                  className="font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg"
                >
                  Science questions
                </h2>
              </div>
              <Button href="/faq" variant="link">
                All FAQs
              </Button>
            </div>
            <ScienceFaq items={FAQ_ITEMS} />
            <p role="note" className="text-xs text-fg-muted leading-relaxed">
              *These statements have not been evaluated by the Food and Drug
              Administration. These products are not intended to diagnose,
              treat, cure or prevent any disease.
            </p>
          </div>
        </section>
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
