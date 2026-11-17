"use client";

import React from "react";
import type { GiftCardDesign } from "@/lib/contracts/gift-card";

interface GiftCardPreviewProps {
  design: GiftCardDesign;
  onSelectDesign: (design: GiftCardDesign) => void;
  amountFormatted: string;
  recipientName: string;
  senderName: string;
  message: string;
}

const DESIGNS: {
  id: GiftCardDesign;
  label: string;
  bgStyle: string;
  textStyle: string;
}[] = [
  {
    id: "espresso",
    label: "Espresso",
    bgStyle: "bg-bg-elevated border-accent/40 text-fg shadow-elevated",
    textStyle: "text-fg",
  },
  {
    id: "sunset",
    label: "Sunset",
    bgStyle:
      "bg-gradient-gold border-accent-border/50 text-accent-fg shadow-elevated",
    textStyle: "text-accent-fg",
  },
  {
    id: "cream",
    label: "Cream",
    bgStyle:
      "bg-[var(--fg)] border-accent-border/40 text-[var(--bg)] shadow-elevated",
    textStyle: "text-[var(--bg)]",
  },
];

export function GiftCardPreview({
  design,
  onSelectDesign,
  amountFormatted,
  recipientName,
  senderName,
  message,
}: GiftCardPreviewProps) {
  const currentDesign = DESIGNS.find((d) => d.id === design) ?? DESIGNS[0];
  const displayTo = recipientName.trim()
    ? recipientName.trim()
    : "[Recipient name]";
  const displayFrom = senderName.trim() ? senderName.trim() : "[Sender name]";
  const displayMessage = message.trim()
    ? message.trim()
    : "[Personal message appears here]";

  return (
    <div className="flex flex-col gap-6">
      {/* Live Preview Card */}
      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-fg-muted mb-3.5">
          LIVE PREVIEW
        </div>
        <div
          aria-label="Gift card live preview"
          className={`w-full aspect-[1.586] rounded-[22px] sm:rounded-[26px] p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden shadow-elevated border transition-all duration-300 ${currentDesign.bgStyle}`}
        >
          {/* Card Top Row */}
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="font-archivo font-extrabold text-xl sm:text-2xl tracking-tight">
                Nadeon <span className="font-normal">Labs</span>
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase opacity-85">
              GIFT CARD
            </span>
          </div>

          {/* Card Bottom Row */}
          <div className="relative z-10">
            <div className="text-xs sm:text-sm font-medium opacity-80 truncate">
              To: {displayTo} · From: {displayFrom}
            </div>
            <div className="flex justify-between items-end mt-1.5 sm:mt-2">
              <span className="font-archivo font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none">
                {amountFormatted}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest opacity-70">
                CODE · XXXX-XXXX
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Design Selector */}
      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-fg-muted mb-2.5">
          CARD DESIGN
        </div>
        <div
          role="group"
          aria-label="Select card design"
          className="grid grid-cols-3 gap-3"
        >
          {DESIGNS.map((item) => {
            const isSelected = item.id === design;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectDesign(item.id)}
                aria-label={item.label}
                aria-pressed={isSelected}
                className={`flex flex-col items-center gap-2 p-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-accent bg-accent/5 ring-2 ring-accent/30"
                    : "border-transparent hover:border-border/80"
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`w-full aspect-[1.586] rounded-lg p-2.5 flex flex-col justify-between shadow-sm border ${item.bgStyle}`}
                >
                  <div className="text-[9px] font-archivo font-extrabold leading-tight">
                    Nadeon <span className="font-normal">Labs</span>
                  </div>
                  <div className="text-xs font-archivo font-extrabold leading-none">
                    $$$
                  </div>
                </div>
                <span className="text-xs font-bold text-fg">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Email Preview */}
      <div className="rounded-2xl border border-border/80 bg-bg-elevated/40 p-5 sm:p-6 mt-1">
        <div className="text-xs font-bold tracking-widest uppercase text-fg-muted">
          EMAIL PREVIEW
        </div>
        <div className="mt-3 font-extrabold text-sm sm:text-base text-fg">
          {displayFrom} sent you a Nadeon Labs gift card
        </div>
        <div className="mt-2 text-xs sm:text-sm text-fg-muted italic leading-relaxed">
          “{displayMessage}”
        </div>
        <div className="mt-4">
          <span className="inline-block rounded-full bg-gradient-gold px-4 py-2 text-xs font-bold text-accent-fg">
            Shop with your card
          </span>
        </div>
      </div>
    </div>
  );
}
