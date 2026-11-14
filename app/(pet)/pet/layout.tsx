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

export default async function PetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const campaign = await campaignConfig.getActiveCampaign();

  return (
    <ConsentProvider>
      <div
        data-theme="pet"
        className="min-h-full flex-1 flex flex-col bg-bg text-fg"
      >
        <AnnouncementBar line="pet" campaign={campaign} />
        <Header variant="pet" />
        <div className="flex-1">{children}</div>
        <TrustStrip line="pet" />
        <Newsletter variant="pet" />
        <Footer line="pet" />
        <CartDrawer theme="pet" />
        <CookieBanner />
        <FirstVisitPopup variant="pet" />
      </div>
    </ConsentProvider>
  );
}
