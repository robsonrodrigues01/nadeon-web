import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { PrivacyHero, PrivacyContent } from "./_components/privacy-content";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Nadeon Labs",
  description:
    "Privacy Policy explaining how Nadeon Labs collects, uses, and protects your personal information.",
  pathname: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1">
        <PrivacyHero />
        <PrivacyContent />
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
