"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import {
  useConsent,
  syncShopifyCustomerPrivacy,
  initShopifyCustomerPrivacy,
  isShopifyCustomerPrivacyEnabled,
} from "@/lib/consent";

export function MeasurementScripts() {
  const { hasConsent, record } = useConsent();
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const analyticsAllowed = hasConsent("analytics");
  const marketingAllowed = hasConsent("marketing");
  const previouslyAllowed = useRef({ analytics: false, marketing: false });
  const previousRecord = useRef<typeof record | undefined>(undefined);

  useEffect(() => {
    if (isShopifyCustomerPrivacyEnabled()) {
      initShopifyCustomerPrivacy();
    }
  }, []);

  useEffect(() => {
    const trackers = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
      clarity?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
      _fbq?: (...args: unknown[]) => void;
    };
    const analyticsChanged =
      previouslyAllowed.current.analytics !== analyticsAllowed;
    const marketingChanged =
      previouslyAllowed.current.marketing !== marketingAllowed;
    const recordChanged = previousRecord.current !== record;

    if (analyticsChanged) {
      trackers.gtag?.("consent", "update", {
        analytics_storage: analyticsAllowed ? "granted" : "denied",
      });
      trackers.clarity?.("consent", analyticsAllowed);
    }
    if (marketingChanged) {
      trackers.fbq?.("consent", marketingAllowed ? "grant" : "revoke");
    }

    if (
      analyticsChanged ||
      marketingChanged ||
      (recordChanged &&
        (record !== null || previousRecord.current !== undefined))
    ) {
      syncShopifyCustomerPrivacy({
        analytics: analyticsAllowed,
        marketing: marketingAllowed,
      });
    }

    if (
      (previouslyAllowed.current.analytics && !analyticsAllowed) ||
      (previouslyAllowed.current.marketing && !marketingAllowed)
    ) {
      window.location.reload();
    }
    previouslyAllowed.current = {
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
    };
    previousRecord.current = record;
  }, [analyticsAllowed, marketingAllowed, record]);

  return (
    <>
      {analyticsAllowed && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}', { send_page_view: false }); gtag('event', 'page_view', { page_location: location.pathname });`}
          </Script>
        </>
      )}
      {analyticsAllowed && clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      )}
      {marketingAllowed && metaPixelId && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
          </Script>
        </>
      )}
    </>
  );
}
