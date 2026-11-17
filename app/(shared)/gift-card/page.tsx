import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { buildMetadata } from "@/lib/seo";
import { DEFAULT_MARKET, getMarket, MARKET_COOKIE_NAME } from "@/lib/market";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { GiftCardPurchaseForm } from "./_components/gift-card-purchase-form";
import { GiftCardHowItWorks, GiftCardFaq } from "./_components/gift-card-faq";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Give a gift card | Nadeon Labs",
    description:
      "Let them choose their own To be confirmed. Delivered by email, on the date you pick.",
    pathname: "/gift-card",
  });
}

export default async function GiftCardPage() {
  let market = DEFAULT_MARKET;
  try {
    const cookieStore = await cookies();
    market =
      getMarket(cookieStore.get(MARKET_COOKIE_NAME)?.value) ?? DEFAULT_MARKET;
  } catch {
    market = DEFAULT_MARKET;
  }

  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" tabIndex={-1} className="flex-1 bg-bg text-fg">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-bg-elevated/80 to-bg px-4 sm:px-6 md:px-12 pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-border/40">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            <nav
              aria-label="Breadcrumb"
              className="text-xs sm:text-sm text-fg-muted flex items-center gap-2 mb-6"
            >
              <Link href="/" className="hover:text-fg transition-colors">
                Home
              </Link>
              <span aria-hidden="true" className="opacity-40">
                /
              </span>
              <Link href="/human" className="hover:text-fg transition-colors">
                Human
              </Link>
              <span aria-hidden="true" className="opacity-40">
                /
              </span>
              <span aria-current="page" className="text-fg font-medium">
                Gift card
              </span>
            </nav>

            <span className="text-xs font-bold tracking-widest uppercase bg-gradient-gold bg-clip-text text-transparent">
              NADEON LABS GIFT CARD
            </span>
            <h1 className="mt-2 font-archivo font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-fg leading-none">
              Give a gift card
            </h1>
            <p className="mt-4 text-base sm:text-lg text-fg-muted max-w-2xl leading-relaxed">
              Let them choose their own To be confirmed. Delivered by email, on
              the date you pick.
            </p>
          </div>
        </div>

        {/* Form and Preview */}
        <section
          aria-label="Gift card selection and purchase"
          className="px-4 sm:px-6 md:px-12 py-12 sm:py-16"
        >
          <GiftCardPurchaseForm market={market} />
        </section>

        {/* How it works */}
        <GiftCardHowItWorks />

        {/* FAQ */}
        <GiftCardFaq />

        {/* Trust strip */}
        <TrustStrip line="human" />

        {/* Newsletter */}
        <Newsletter variant="human" />
      </main>

      <Footer line="human" />
    </>
  );
}
