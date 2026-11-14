"use client";

import { useCallback } from "react";
import { useConsent } from "@/lib/consent";
import {
  track,
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackSubscribeNewsletter,
  trackQuizComplete,
  trackPurchase,
} from "./track";
import {
  type AnalyticsEventName,
  type AnalyticsEventMap,
  type TrackOptions,
  type TrackResult,
  type ViewItemPayload,
  type AddToCartPayload,
  type BeginCheckoutPayload,
  type SubscribeNewsletterPayload,
  type QuizCompletePayload,
  type PurchasePayload,
} from "./types";

/**
 * React hook to dispatch analytics events bound to the current ConsentContext.
 */
export function useAnalytics() {
  const { hasConsent } = useConsent();
  const isAnalyticsAllowed = hasConsent("analytics");

  const trackWithContext = useCallback(
    <E extends AnalyticsEventName>(
      event: E,
      payload: AnalyticsEventMap[E],
      options?: TrackOptions
    ): TrackResult<E> => {
      return track(event, payload, {
        consent: isAnalyticsAllowed,
        ...options,
      });
    },
    [isAnalyticsAllowed]
  );

  return {
    hasConsent: isAnalyticsAllowed,
    track: trackWithContext,
    trackEvent: trackWithContext,
    trackViewItem: (payload: ViewItemPayload, options?: TrackOptions) =>
      trackViewItem(payload, { consent: isAnalyticsAllowed, ...options }),
    trackAddToCart: (payload: AddToCartPayload, options?: TrackOptions) =>
      trackAddToCart(payload, { consent: isAnalyticsAllowed, ...options }),
    trackBeginCheckout: (
      payload: BeginCheckoutPayload,
      options?: TrackOptions
    ) =>
      trackBeginCheckout(payload, {
        consent: isAnalyticsAllowed,
        ...options,
      }),
    trackSubscribeNewsletter: (
      payload: SubscribeNewsletterPayload,
      options?: TrackOptions
    ) =>
      trackSubscribeNewsletter(payload, {
        consent: isAnalyticsAllowed,
        ...options,
      }),
    trackQuizComplete: (payload: QuizCompletePayload, options?: TrackOptions) =>
      trackQuizComplete(payload, {
        consent: isAnalyticsAllowed,
        ...options,
      }),
    trackPurchase: (payload: PurchasePayload, options?: TrackOptions) =>
      trackPurchase(payload, { consent: isAnalyticsAllowed, ...options }),
  };
}
