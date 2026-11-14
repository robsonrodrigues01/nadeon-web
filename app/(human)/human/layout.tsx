import type React from "react";
import { campaignConfig } from "@/lib/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { FirstVisitPopup } from "@/components/layout/popup";
import { ConsentProvider } from "@/lib/consent";

export default async function HumanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const campaign = await campaignConfig.getActiveCampaign();

  return (
    <ConsentProvider>
      <div
        data-theme="human"
        className="min-h-full flex-1 flex flex-col bg-bg text-fg"
      >
        <AnnouncementBar line="human" campaign={campaign} />
        <Header variant="human" />
        <div className="flex-1">{children}</div>
        <TrustStrip line="human" />
        <Newsletter variant="human" />
        <Footer line="human" />
        <CartDrawer theme="human" />
        <CookieBanner />
        <FirstVisitPopup variant="human" />
      </div>
    </ConsentProvider>
  );
}
