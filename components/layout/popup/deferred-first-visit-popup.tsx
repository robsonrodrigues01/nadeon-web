"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { readCookie, useConsent } from "@/lib/consent";
import { FIRST_VISIT_POPUP_COOKIE_NAME } from "./constants";
import type { PopupVariant } from "./first-visit-popup";

const LazyFirstVisitPopup = dynamic(
  () => import("./first-visit-popup").then((module) => module.FirstVisitPopup),
  {
    ssr: false,
    loading: () => (
      <span className="sr-only" role="status" aria-live="polite">
        Loading welcome offer
      </span>
    ),
  }
);

const noSubscription = () => () => {};

export function DeferredFirstVisitPopup({
  variant,
}: {
  variant: PopupVariant;
}) {
  const { isBannerOpen, record } = useConsent();
  const cookieDismissed = useSyncExternalStore(
    noSubscription,
    () => Boolean(readCookie(FIRST_VISIT_POPUP_COOKIE_NAME)),
    () => false
  );
  const consentResolved = Boolean(record?.explicit) && !isBannerOpen;

  if (!consentResolved || cookieDismissed) return null;

  return <LazyFirstVisitPopup variant={variant} />;
}
