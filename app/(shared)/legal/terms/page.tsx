import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { TermsHero, TermsContent } from "./_components/terms-content";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Nadeon Labs",
  description:
    "Terms of Service governing your use of nadeonlabs.com and purchases from Nadeon Labs.",
  pathname: "/legal/terms",
});

export default function TermsPage() {
  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <TermsHero />
        <TermsContent />
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
