import type React from "react";
import { campaignConfig } from "@/lib/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { DeferredNewsletter } from "@/components/brand/newsletter/deferred-newsletter";
import { Footer } from "@/components/layout/footer";
import { DeferredCartDrawer } from "@/components/commerce/cart-drawer/deferred-cart-drawer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { DeferredFirstVisitPopup } from "@/components/layout/popup/deferred-first-visit-popup";
import { ConsentProvider } from "@/lib/consent";
import { MeasurementScripts } from "@/components/layout/measurement-scripts";

export default async function HumanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const campaign = await campaignConfig.getActiveCampaign();

  return (
    <ConsentProvider>
      <MeasurementScripts />
      <div
        data-theme="human"
        className="min-h-full flex-1 flex flex-col bg-bg text-fg"
      >
        <AnnouncementBar line="human" campaign={campaign} />
        <Header variant="human" />
        <div className="flex-1">{children}</div>
        <TrustStrip line="human" />
        <DeferredNewsletter variant="human" />
        <Footer line="human" />
        <DeferredCartDrawer theme="human" />
        <CookieBanner />
        <DeferredFirstVisitPopup variant="human" />
      </div>
    </ConsentProvider>
  );
}
