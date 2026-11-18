import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { MarketProvider } from "@/lib/market/context";
import { getVisitorMarket } from "@/lib/market/visitor";
import { buildMetadata } from "@/lib/seo";
import { WholesaleApplicationForm } from "./_components/wholesale-application-form";

const partnershipBenefits = [
  {
    title: "Wholesale pricing",
    description:
      "Tiered margins for retail partners. Terms shared after approval.",
  },
  {
    title: "Low opening order",
    description:
      "Start small and reorder as you sell. Minimum to be confirmed.",
  },
  {
    title: "Lot-tested",
    description: "A public lab report for every lot, ready for your customers.",
  },
  {
    title: "Marketing kit",
    description:
      "Shelf talkers, product photos, training sheets and social assets.",
  },
  {
    title: "Dedicated rep",
    description: "One contact for orders, restocks and questions.",
  },
  {
    title: "Ships from NJ",
    description: "Fast fulfillment from our Clifton, New Jersey facility.",
  },
] as const;

const partnerTypes = [
  "Pharmacies & health stores",
  "Gyms & wellness clinics",
  "Practitioners",
  "Veterinary clinics",
  "Pet stores & groomers",
  "Equine & tack shops",
] as const;

const questions = [
  "What is the minimum opening order?",
  "Do you offer exclusive territories?",
  "Can I sell on Amazon or other marketplaces?",
  "Do you provide samples or testers?",
  "What are the payment terms?",
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Wholesale | Nadeon Labs",
  description:
    "Carry Nadeon in your store. Wholesale details: To be confirmed.",
  pathname: "/wholesale",
});

export default async function WholesalePage() {
  const market = await getVisitorMarket();

  return (
    <MarketProvider initialMarket={market}>
      <AnnouncementBar line="human" />
      <Header variant="human" />
      <main id="main-content" className="flex-1 bg-bg text-fg" tabIndex={-1}>
        <section
          data-theme="human"
          className="border-b border-border bg-bg-elevated px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Wholesale
              </p>
              <h1 className="mt-3 max-w-4xl font-archivo text-4xl font-extrabold uppercase tracking-tight text-fg sm:text-6xl lg:text-7xl">
                Carry Nadeon in your store
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-fg-muted sm:text-lg">
                NMN and NAD+ for people and pets, made and tested lot by lot in
                Clifton, New Jersey. For pharmacies, health stores, gyms,
                clinics, vets and pet shops.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#application"
                  className="inline-flex min-h-11 items-center justify-center rounded-pill bg-accent px-6 py-3 text-sm font-bold text-bg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  Apply now
                </Link>
                <button
                  type="button"
                  disabled
                  aria-describedby="line-sheet-note"
                  className="min-h-11 cursor-not-allowed rounded-pill border-2 border-fg px-5 py-2.5 text-sm font-bold text-fg opacity-60"
                >
                  Download line sheet
                </button>
              </div>
              <p id="line-sheet-note" className="mt-3 text-xs text-fg-muted">
                Line sheet: To be confirmed.
              </p>
            </div>
          </div>
        </section>

        <section
          data-theme="human"
          aria-labelledby="partner-benefits-heading"
          className="bg-bg px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Why partner with us
            </p>
            <h2
              id="partner-benefits-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
            >
              Built for retail
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partnershipBenefits.map((benefit) => (
                <li
                  key={benefit.title}
                  className="rounded-card border border-border bg-bg-elevated p-6"
                >
                  <h3 className="font-archivo text-xl font-extrabold text-fg">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                    {benefit.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          data-theme="pet"
          aria-labelledby="partner-types-heading"
          className="bg-bg px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Who we work with
            </p>
            <h2
              id="partner-types-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
            >
              Stores, clinics and practices
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {partnerTypes.map((type) => (
                <li
                  key={type}
                  className="flex min-h-14 items-center rounded-card border border-border bg-bg-elevated px-5 py-3 font-bold text-fg"
                >
                  {type}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-card border border-border bg-bg-elevated p-6">
                <h3 className="font-archivo text-2xl font-extrabold text-fg">
                  Nadeon Human
                </h3>
                <p className="mt-2 text-sm text-fg-muted">
                  7 formulas · capsules, powders, tinctures
                </p>
              </article>
              <article className="rounded-card border border-border bg-bg-elevated p-6">
                <h3 className="font-archivo text-2xl font-extrabold text-fg">
                  Nadeon Pet
                </h3>
                <p className="mt-2 text-sm text-fg-muted">
                  8 formulas · chews, treats, powders, oils
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          data-theme="human"
          aria-labelledby="application-heading"
          className="bg-bg px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  Apply
                </p>
                <h2
                  id="application-heading"
                  className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
                >
                  Become a retailer
                </h2>
                <p className="mt-4 text-base leading-relaxed text-fg-muted">
                  Tell us about your business. A partner manager will reach out
                  with pricing and next steps.
                </p>
                <p className="mt-4 text-sm text-fg-muted">
                  Partners resell in their own physical or online store only. No
                  marketplace resale.
                </p>
                <ol className="mt-8 grid gap-5">
                  <li>
                    <h3 className="font-bold text-fg">1. Apply</h3>
                    <p className="mt-1 text-sm text-fg-muted">
                      Fill in the form below.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-bold text-fg">2. Review</h3>
                    <p className="mt-1 text-sm text-fg-muted">
                      Response time: To be confirmed.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-bold text-fg">3. Onboard</h3>
                    <p className="mt-1 text-sm text-fg-muted">
                      Get pricing, line sheet and your first order.
                    </p>
                  </li>
                </ol>
                <p className="mt-7 text-sm text-fg-muted">
                  Prefer email? To be confirmed.
                </p>
              </div>
              <div
                id="application"
                className="scroll-mt-24 rounded-card border border-border bg-bg-elevated p-5 sm:p-8"
              >
                <h3 className="font-archivo text-2xl font-extrabold text-fg">
                  Wholesale application
                </h3>
                <WholesaleApplicationForm />
              </div>
            </div>
          </div>
        </section>

        <section
          data-theme="pet"
          aria-labelledby="wholesale-faq-heading"
          className="bg-bg px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              FAQ
            </p>
            <h2
              id="wholesale-faq-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
            >
              Wholesale questions
            </h2>
            <div className="mt-7 divide-y divide-border rounded-card border border-border bg-bg-elevated px-5">
              {questions.map((question) => (
                <details key={question} className="py-4">
                  <summary className="flex min-h-11 cursor-pointer items-center py-2 font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    {question}
                  </summary>
                  <p className="pb-2 text-sm text-fg-muted">To be confirmed.</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <TrustStrip data-theme="human" line="human" />
      <Footer />
    </MarketProvider>
  );
}
