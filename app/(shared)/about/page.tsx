import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata, buildOrganizationJsonLd, JsonLd } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip, type TrustItem } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import type { Product } from "@/lib/contracts/catalog";
import {
  StorySection,
  WhySection,
  MissionSection,
  ValuesSection,
  ProcessSection,
} from "./_components/sections";
import { LinesSection, ShopLinesSection } from "./_components/lines";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "About | Nadeon Labs",
    description:
      "Nadeon Labs makes NMN and NAD+ formulas for people and pets in our own lab in Clifton, New Jersey, in small numbered lots.",
    pathname: "/about",
  });
}

// Produtos que o design mostra nesta página, na ordem do design.
// Sem o item "Free shipping over $75": o limite de frete vem do mercado, não do código.
const HUMAN_LINE_SLUGS = ["biohack", "full-charge", "renew", "glow"] as const;
const PET_LINE_SLUGS = [
  "more-good-years",
  "golden-years",
  "still-sharp",
  "shine-on",
] as const;

function pick(products: Product[], slugs: readonly string[]): Product[] {
  return slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
}

const TRUST_ITEMS: TrustItem[] = [
  { title: "Made in Clifton, NJ", description: "Our own lab" },
  { title: "Tested every lot", description: "Public lab reports" },
  { title: "60-day guarantee", description: "Love it or refund" },
];

export default async function AboutPage() {
  const [humanAll, petAll] = await Promise.all([
    catalogProvider.getProducts({ line: "human" }),
    catalogProvider.getProducts({ line: "pet" }),
  ]);
  const humanProducts = pick(humanAll, HUMAN_LINE_SLUGS);
  const petProducts = pick(petAll, PET_LINE_SLUGS);

  return (
    <>
      <JsonLd
        id="ld-organization"
        data={buildOrganizationJsonLd() as unknown as Record<string, unknown>}
      />
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <StorySection />
        <WhySection />
        <MissionSection />
        <ValuesSection />
        <ProcessSection />
        <LinesSection
          humanProducts={humanProducts.slice(0, 3)}
          petProducts={petProducts.slice(0, 3)}
        />
        <ShopLinesSection
          humanProducts={humanProducts}
          petProducts={petProducts}
        />
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
