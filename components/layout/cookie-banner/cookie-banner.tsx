"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useConsent } from "@/lib/consent";
import { CookieSettingsModal } from "./cookie-settings-modal";

export interface CookieBannerProps {
  isOpen?: boolean;
  inline?: boolean;
  forceVisible?: boolean;
  className?: string;
}

export function CookieBanner({
  isOpen,
  inline = false,
  forceVisible = false,
  className = "",
}: CookieBannerProps) {
  const bannerRef = useRef<HTMLElement>(null);
  const {
    isBannerOpen,
    isSettingsOpen,
    acceptAll,
    rejectNonEssential,
    openSettings,
  } = useConsent();
  const isVisible = forceVisible || (isOpen ?? isBannerOpen);

  // Banner fixo: enquanto aberto, reserva o espaço dele no fim da página para não cobrir CTAs.
  useEffect(() => {
    if (inline || !isVisible) return;
    const banner = bannerRef.current;
    if (!banner) return;
    const body = document.body;
    const previous = body.style.paddingBottom;
    const apply = () => {
      body.style.paddingBottom = `${banner.getBoundingClientRect().height}px`;
    };
    apply();
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
    observer?.observe(banner);
    return () => {
      observer?.disconnect();
      if (previous) body.style.paddingBottom = previous;
      else body.style.removeProperty("padding-bottom");
    };
  }, [inline, isVisible]);

  if (!isVisible && !isSettingsOpen) {
    return null;
  }

  const containerClasses = inline
    ? `w-full rounded-[20px] bg-bg-elevated text-fg border border-border p-4 sm:p-6 md:px-7 md:py-5 shadow-elevated ${className}`
    : `fixed z-50 left-3 right-3 bottom-3 sm:left-6 sm:right-6 sm:bottom-6 max-w-6xl mx-auto rounded-[20px] bg-bg-elevated text-fg border border-border p-4 sm:p-6 md:px-7 md:py-5 shadow-elevated transition-transform duration-200 animate-in fade-in slide-in-from-bottom-4 ${className}`;

  return (
    <>
      {isVisible && (
        <section
          ref={bannerRef}
          role="region"
          aria-label="Cookie consent banner"
          className={containerClasses}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            {/* Informational Copy */}
            <div className="flex-1">
              <h2 className="font-extrabold text-base sm:text-[17px] text-fg tracking-tight">
                We use cookies
              </h2>
              <p className="text-xs sm:text-sm text-fg-muted mt-1 leading-relaxed">
                We use essential cookies to run the store, and optional cookies
                for analytics and ads. You choose. See our{" "}
                <Link
                  href="/legal/privacy"
                  className="underline underline-offset-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs font-medium"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/legal/do-not-sell"
                  className="underline underline-offset-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs font-medium"
                >
                  Do Not Sell My Info
                </Link>
                .
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={openSettings}
                className="min-h-11 px-3 py-2 text-xs sm:text-sm font-bold underline text-fg hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full transition-colors cursor-pointer"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="flex-1 sm:flex-none min-h-11 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full border-2 border-border text-fg hover:border-fg hover:bg-fg/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer whitespace-nowrap text-center"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 sm:flex-none min-h-11 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-full bg-fg text-bg hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer whitespace-nowrap text-center font-bold"
              >
                Accept all
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Categories modal when user clicks Settings */}
      {!inline && <CookieSettingsModal />}
    </>
  );
}
