"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Campaign } from "@/lib/contracts/campaign";
import { campaignConfig as defaultCampaignConfig } from "@/lib/providers";
import { CountdownTimer } from "./countdown-timer";
import type { AnnouncementBarProps } from "./types";

const DEFAULT_FALLBACK_COUNTDOWN = "2026-11-30T23:59:59-05:00";

export function AnnouncementBar({
  line = "human",
  campaign: propCampaign,
  campaignConfig = defaultCampaignConfig,
  forceBlackFriday = false,
  shippingHref,
  subscribeHref,
  quizHref,
  saleHref,
  countdownEnd,
  now,
  className = "",
}: AnnouncementBarProps) {
  const [fetchedCampaign, setFetchedCampaign] = useState<
    Campaign | null | undefined
  >(undefined);

  useEffect(() => {
    if (propCampaign !== undefined) {
      return;
    }

    let isMounted = true;
    campaignConfig
      .getActiveCampaign()
      .then((active) => {
        if (isMounted) {
          setFetchedCampaign(active);
        }
      })
      .catch((err) => {
        console.error("[AnnouncementBar] Error loading active campaign:", err);
        if (isMounted) {
          setFetchedCampaign(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [campaignConfig, propCampaign]);

  const resolvedCampaign =
    propCampaign !== undefined ? propCampaign : fetchedCampaign;

  const isBlackFriday =
    forceBlackFriday || Boolean(resolvedCampaign && resolvedCampaign.isActive);

  // Default routes according to catalog
  const isHuman = line === "human";
  const defaultShippingHref = "/faq";
  const defaultSubscribeHref = "/account/subscriptions";
  const defaultQuizHref = isHuman ? "/human/quiz" : "/pet/quiz";
  const defaultSaleHref = isHuman ? "/human" : "/pet";

  const targetShippingHref = shippingHref ?? defaultShippingHref;
  const targetSubscribeHref = subscribeHref ?? defaultSubscribeHref;
  const targetQuizHref = quizHref ?? defaultQuizHref;
  const targetSaleHref = saleHref ?? defaultSaleHref;

  if (isBlackFriday) {
    const bannerText =
      resolvedCampaign?.bannerText || "BLACK FRIDAY · UP TO 25% OFF";
    const targetCountdown =
      countdownEnd ??
      resolvedCampaign?.countdownEnd ??
      DEFAULT_FALLBACK_COUNTDOWN;

    const barThemeStyles = isHuman
      ? "bg-bg-elevated text-product-amber border-b border-border"
      : "text-product-amber border-b border-border";

    const customPetInlineStyle = isHuman
      ? undefined
      : { backgroundColor: "var(--accent-fg)" };

    return (
      <aside
        aria-label="Black Friday Announcement"
        style={customPetInlineStyle}
        className={`w-full min-h-[44px] flex items-center justify-center transition-colors text-[11px] md:text-[13px] font-bold tracking-wider py-2 px-4 ${barThemeStyles} ${className}`}
      >
        <Link
          href={targetSaleHref}
          className="w-full flex items-center justify-center gap-2 md:gap-3.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
          aria-label={`${bannerText} - Shop the sale`}
        >
          <span className="whitespace-nowrap">{bannerText}</span>

          <span
            className="opacity-50 hidden sm:inline select-none"
            aria-hidden="true"
          >
            ·
          </span>

          <span className="hidden md:inline whitespace-nowrap">ENDS IN</span>

          <CountdownTimer
            countdownEnd={targetCountdown}
            line={line}
            now={now}
          />

          <span
            className="opacity-50 hidden sm:inline select-none"
            aria-hidden="true"
          >
            ·
          </span>

          <span className="underline underline-offset-4 whitespace-nowrap">
            Shop the sale →
          </span>
        </Link>
      </aside>
    );
  }

  // Standard Human / Pet Announcement Bar
  const standardThemeStyles = isHuman
    ? "bg-bg-elevated text-product-amber"
    : "bg-product-amber text-accent-fg";

  const freeShippingText = isHuman
    ? "FREE SHIPPING OVER $75"
    : "FREE SHIPPING OVER $49";
  const quizText = isHuman ? "TAKE THE QUIZ" : "FIND THE RIGHT FORMULA";

  return (
    <aside
      aria-label="Store Announcement"
      className={`w-full min-h-[44px] flex items-center justify-center text-[11px] md:text-[13px] font-bold tracking-wider py-2 px-4 ${standardThemeStyles} ${className}`}
    >
      <nav
        aria-label="Announcement notices"
        className="flex items-center justify-center flex-wrap gap-2 md:gap-3"
      >
        <Link
          href={targetShippingHref}
          className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-0.5 px-1"
        >
          {freeShippingText}
        </Link>

        <span className="opacity-50 select-none" aria-hidden="true">
          ·
        </span>

        <Link
          href={targetSubscribeHref}
          className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-0.5 px-1"
        >
          <span className="hidden md:inline">SUBSCRIBE &amp; SAVE 15%</span>
          <span className="md:hidden">SAVE 15% ON SUBSCRIPTIONS</span>
        </Link>

        <span
          className="opacity-50 hidden md:inline select-none"
          aria-hidden="true"
        >
          ·
        </span>

        <Link
          href={targetQuizHref}
          className="hidden md:inline-flex hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-0.5 px-1"
        >
          {quizText}
        </Link>
      </nav>
    </aside>
  );
}
