import type { Metadata } from "next";
import { catalogProvider, labsProvider } from "@/lib/providers";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildOrganizationJsonLd,
  JsonLd,
} from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip, type TrustItem } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { LotBrowser } from "./_components/lot-browser";
import { LotResult } from "./_components/lot-result";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Lab Results | Nadeon Labs",
    description:
      "Look up the third-party certificate of analysis (COA) for the exact lot in your hand.",
    pathname: "/lab-results",
  });
}

const TRUST_ITEMS: TrustItem[] = [
  { title: "Made in Clifton, NJ", description: "Our own lab" },
  { title: "Tested every lot", description: "Public lab reports" },
  { title: "60-day guarantee", description: "Love it or refund" },
];

interface LabResultsPageProps {
  searchParams: Promise<{ lot?: string }>;
}

export default async function LabResultsPage({
  searchParams,
}: LabResultsPageProps) {
  const { lot: lotParam = "" } = await searchParams;
  const [lots, humanProducts, petProducts] = await Promise.all([
    labsProvider.listLots(),
    catalogProvider.getProducts({ line: "human" }),
    catalogProvider.getProducts({ line: "pet" }),
  ]);

  // Busca fica desligada enquanto não houver nenhum laudo publicado.
  const searchEnabled = lots.length > 0;
  const foundLot =
    searchEnabled && lotParam.trim()
      ? await labsProvider.findLot(lotParam.trim())
      : null;

  const lineBySlug: Record<string, "human" | "pet"> = {};
  for (const product of humanProducts) lineBySlug[product.slug] = "human";
  for (const product of petProducts) lineBySlug[product.slug] = "pet";

  return (
    <>
      <JsonLd
        id="ld-organization"
        data={buildOrganizationJsonLd() as unknown as Record<string, unknown>}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Lab Results", url: "/lab-results" },
          ]) as unknown as Record<string, unknown>
        }
      />
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1">
        <section
          aria-labelledby="lab-results-hero"
          className="w-full border-b border-border bg-bg py-14 text-fg sm:py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:items-start lg:px-12">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
                Lab Results
              </p>
              <h1
                id="lab-results-hero"
                className="font-archivo text-4xl font-extrabold uppercase text-fg sm:text-5xl"
              >
                Every lot, tested.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
                Look up the third-party certificate of analysis (COA) for the
                exact lot in your hand. Human and pet products.
              </p>
            </div>

            <div className="space-y-6 rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8">
              <form action="/lab-results" method="get" className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="lot-number"
                    className="text-sm font-bold text-fg"
                  >
                    Lot number
                  </label>
                  <input
                    id="lot-number"
                    name="lot"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    aria-describedby="lot-number-hint"
                    disabled={!searchEnabled}
                    defaultValue={lotParam}
                    className="min-h-11 w-full rounded-field border border-border bg-bg px-4 py-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!searchEnabled}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Find my lot
                </button>
              </form>

              <div
                id="lot-number-hint"
                className="space-y-2 text-sm text-fg-muted"
              >
                <p className="font-bold text-fg">Where is my lot number?</p>
                <p>
                  Printed on the bottom of the label, next to the best-by date.
                  It starts with NL.
                </p>
              </div>

              {foundLot ? <LotResult lot={foundLot} /> : null}
            </div>
          </div>
        </section>

        <section className="w-full bg-bg py-14 text-fg sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <LotBrowser lots={lots} lineBySlug={lineBySlug} />
          </div>
        </section>

        <section
          aria-labelledby="about-testing-heading"
          className="w-full border-t border-border bg-bg-elevated py-14 text-fg sm:py-20"
        >
          <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-8 lg:px-12">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
                About our testing
              </p>
              <h2
                id="about-testing-heading"
                className="font-archivo text-2xl font-extrabold uppercase text-fg sm:text-3xl"
              >
                Reading your COA
              </h2>
            </div>
            <dl className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <dt className="font-bold text-fg">What is a COA?</dt>
                <dd className="text-fg-muted leading-relaxed">
                  A certificate of analysis is the lab report for one specific
                  lot. It lists each test, the method, the limit and the result.
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="font-bold text-fg">Who tests it?</dt>
                <dd className="text-fg-muted leading-relaxed">
                  An independent, third-party lab, separate from our own
                  in-house checks.
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="font-bold text-fg">Can&apos;t find your lot?</dt>
                <dd className="text-fg-muted leading-relaxed">
                  New lots appear within a few days of release. If yours is
                  missing, contact us and we will send the COA by email.
                </dd>
              </div>
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/about" variant="secondary">
                How we make it
              </Button>
              <Button href="/help" variant="secondary">
                Contact us
              </Button>
            </div>
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
