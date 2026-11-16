"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore, type RefObject } from "react";
import { readCookie, useConsent, writeCookie } from "@/lib/consent";
import { FIRST_VISIT_POPUP_COOKIE_NAME } from "./constants";
import type { PopupVariant } from "./first-visit-popup";
import {
  DeferredOverlayBoundary,
  DeferredOverlayFallback,
  useDeferredOverlayReturnFocus,
} from "@/components/layout/deferred-overlay-fallback";

const LazyFirstVisitPopup = dynamic(
  () => import("./first-visit-popup").then((module) => module.FirstVisitPopup),
  {
    ssr: false,
    loading: () => <DeferredOverlayFallback />,
  }
);

const noSubscription = () => () => {};

function LoadedFirstVisitPopup({
  variant,
  returnFocusRef,
}: {
  variant: PopupVariant;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  return (
    <LazyFirstVisitPopup variant={variant} returnFocusRef={returnFocusRef} />
  );
}

export function DeferredFirstVisitPopup({
  variant,
}: {
  variant: PopupVariant;
}) {
  const { isBannerOpen, record } = useConsent();
  const [dismissed, setDismissed] = useState(false);
  const cookieDismissed = useSyncExternalStore(
    noSubscription,
    () => Boolean(readCookie(FIRST_VISIT_POPUP_COOKIE_NAME)),
    () => false
  );
  const consentResolved = Boolean(record?.explicit) && !isBannerOpen;

  if (!consentResolved || cookieDismissed || dismissed) return null;

  return (
    <DeferredOverlayBoundary
      label="welcome offer"
      onEscape={() => {
        writeCookie(FIRST_VISIT_POPUP_COOKIE_NAME, "dismissed", 365);
        setDismissed(true);
      }}
    >
      <FirstVisitPopupWithReturnFocus variant={variant} />
    </DeferredOverlayBoundary>
  );
}

function FirstVisitPopupWithReturnFocus({
  variant,
}: {
  variant: PopupVariant;
}) {
  const returnFocusRef = useDeferredOverlayReturnFocus();
  return (
    <LoadedFirstVisitPopup variant={variant} returnFocusRef={returnFocusRef} />
  );
}
