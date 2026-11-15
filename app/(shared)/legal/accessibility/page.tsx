import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import {
  AccessibilityHero,
  AccessibilityContent,
} from "./_components/accessibility-content";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility Statement | Nadeon Labs",
  description:
    "Nadeon Labs is committed to making our website accessible to all customers and visitors, including people with disabilities.",
  pathname: "/legal/accessibility",
});

export default function AccessibilityPage() {
  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1">
        <AccessibilityHero />
        <AccessibilityContent />
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
