"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  FirstVisitPopup,
  FIRST_VISIT_POPUP_COOKIE_NAME,
} from "@/components/layout/popup";

const emptySubscribe = () => () => {};

function FirstVisitPopupShowcase() {
  const [activeModal, setActiveModal] = useState<"human" | "pet" | null>(null);
  const [cookieVersion, setCookieVersion] = useState(0);

  const cookieStatus = useSyncExternalStore(
    emptySubscribe,
    () => {
      // Re-read when cookieVersion changes
      void cookieVersion;
      if (typeof document === "undefined") return "None (Eligible)";
      const match = document.cookie.match(
        new RegExp(`(?:^|;\\s*)${FIRST_VISIT_POPUP_COOKIE_NAME}=([^;]*)`)
      );
      return match ? decodeURIComponent(match[1]) : "None (Eligible)";
    },
    () => "None (Eligible)"
  );

  const resetCookie = () => {
    if (typeof document === "undefined") return;
    document.cookie = `${FIRST_VISIT_POPUP_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setCookieVersion((v) => v + 1);
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setCookieVersion((v) => v + 1);
  };

  return (
    <section aria-labelledby="section-w1-09-title" className="mb-16">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-border">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Wave 1 · W1-09
        </span>
        <h2
          id="section-w1-09-title"
          className="title text-2xl sm:text-3xl font-black uppercase text-fg"
        >
          First Visit 10% Discount Popup
        </h2>
        <p className="lead text-fg-muted text-sm mt-1 max-w-3xl leading-relaxed">
          High-conversion first-visit discount dialog compliant with Section 3
          of the site catalog and Design Boards 70 (Desktop &amp; Mobile).
          Features accessible modal dialog semantics, keyboard focus trap, Esc
          dismissal, cookie-banner consent gating, one-time visitor cookie
          persistence, and direct newsletter server action dispatch.
        </p>
      </div>

      {/* Interactive Controls & Live Modal Triggers */}
      <div className="mb-8 p-6 rounded-card bg-bg-elevated border border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="label text-xs uppercase tracking-wider text-accent font-bold">
            Interactive Test Controls
          </span>
          <p className="body text-xs text-fg-muted mt-1">
            Visitor Cookie Status (
            <code className="font-mono text-accent">
              {FIRST_VISIT_POPUP_COOKIE_NAME}
            </code>
            ): <span className="font-bold text-fg">{cookieStatus}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModal("human")}
            className="min-h-[44px] px-4 py-2 text-xs font-bold rounded-full bg-gradient-gold text-accent-fg hover:brightness-105 transition-all shadow-sm cursor-pointer"
          >
            Launch Human Modal
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("pet")}
            className="min-h-[44px] px-4 py-2 text-xs font-bold rounded-full bg-fg text-bg hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            Launch Pet Modal
          </button>
          <button
            type="button"
            onClick={resetCookie}
            className="min-h-[44px] px-4 py-2 text-xs font-bold rounded-full border border-border text-fg hover:border-fg transition-colors cursor-pointer"
          >
            Clear Visitor Cookie
          </button>
        </div>
      </div>

      {/* Live Overlay Modal when triggered */}
      {activeModal && (
        <FirstVisitPopup
          variant={activeModal}
          isOpen={true}
          onDismiss={handleModalClose}
          onSuccess={handleModalClose}
        />
      )}

      {/* Inline Showcase Grid */}
      <div className="space-y-8">
        <div>
          <h3 className="label text-xs uppercase tracking-wider text-fg-muted font-bold mb-3">
            1. Human Line Variant (Inline Preview)
          </h3>
          <div
            data-theme="human"
            className="bg-bg text-fg p-6 sm:p-8 rounded-card border border-border shadow-card flex justify-center"
          >
            <FirstVisitPopup
              variant="human"
              forceOpen={true}
              inline={true}
              cookieName="demo_human_preview"
            />
          </div>
        </div>

        <div>
          <h3 className="label text-xs uppercase tracking-wider text-fg-muted font-bold mb-3">
            2. Pet Line Variant (Inline Preview)
          </h3>
          <div
            data-theme="pet"
            className="bg-bg text-fg p-6 sm:p-8 rounded-card border border-border shadow-card flex justify-center"
          >
            <FirstVisitPopup
              variant="pet"
              forceOpen={true}
              inline={true}
              cookieName="demo_pet_preview"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function W109Section() {
  return <FirstVisitPopupShowcase />;
}
