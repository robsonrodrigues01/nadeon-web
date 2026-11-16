import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import {
  DoNotSellHero,
  DoNotSellContent,
} from "./_components/do-not-sell-content";

export const metadata: Metadata = buildMetadata({
  title: "Do Not Sell or Share My Personal Information | Nadeon Labs",
  description:
    "Exercise your privacy choices and opt out of the sale or sharing of your personal information under California and other US state privacy laws.",
  pathname: "/legal/do-not-sell",
});

export default function DoNotSellPage() {
  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <DoNotSellHero />
        <DoNotSellContent />
      </main>

      <TrustStrip line="human" />
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
