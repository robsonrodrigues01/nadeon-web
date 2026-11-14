"use client";

import React, { useState } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { FirstVisitPopup } from "@/components/layout/popup";

function W122Showcase() {
  const [selectedTheme, setSelectedTheme] = useState<"human" | "pet">("human");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCookieBannerOpen, setIsCookieBannerOpen] = useState(false);

  const handleOpenDrawer = (theme: "human" | "pet") => {
    setSelectedTheme(theme);
    setIsDrawerOpen(true);
  };

  const handleOpenPopup = (theme: "human" | "pet") => {
    setSelectedTheme(theme);
    setIsPopupOpen(true);
  };

  return (
    <section
      id="section-w1-22"
      aria-labelledby="section-w1-22-title"
      className="mb-16 border-t border-border pt-10"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="label rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider">
            Task W1-22 · Wave 1 Final Integration
          </span>
          <span className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
            Layout Shells &amp; Global State
          </span>
        </div>
        <h2
          id="section-w1-22-title"
          className="title text-2xl sm:text-4xl font-black uppercase text-fg"
        >
          Full Shell Integration (Human &amp; Pet)
        </h2>
        <p className="lead text-fg-muted text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Complete end-to-end integration of Wave 1 layout shells for Human and
          Pet lines, combining announcement bar, responsive navigation header
          with reactive cart drawer trigger, trust strip, newsletter
          subscription, footer with regulatory notices, cookie consent banner,
          and first-visit discount popup.
        </p>
      </div>

      {/* Global Interactive Verification Controls */}
      <div className="mb-10 rounded-card border border-border bg-bg-elevated p-6 shadow-card">
        <h3 className="font-archivo text-base font-bold uppercase tracking-wide text-fg mb-4">
          Interactive Overlay Controls
        </h3>
        <form
          aria-label="Shell Overlay Verification Controls"
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div>
            <label
              htmlFor="w1-22-line-selector"
              className="block text-xs font-bold uppercase tracking-wider text-fg mb-1.5"
            >
              Active Line Theme
            </label>
            <select
              id="w1-22-line-selector"
              value={selectedTheme}
              onChange={(e) =>
                setSelectedTheme(e.target.value as "human" | "pet")
              }
              className="w-full min-h-11 rounded-lg border border-border bg-bg px-3 py-2 text-xs font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="human">Human Line (Dark Theme)</option>
              <option value="pet">Pet Line (Cream Theme)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => handleOpenDrawer(selectedTheme)}
              className="w-full min-h-11 px-4 py-2.5 rounded-full bg-gradient-gold text-accent-fg font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Open {selectedTheme === "human" ? "Human" : "Pet"} Cart Drawer
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => handleOpenPopup(selectedTheme)}
              className="w-full min-h-11 px-4 py-2.5 rounded-full border border-border bg-bg text-fg font-bold text-xs uppercase tracking-wider hover:border-accent hover:text-accent active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Trigger 10% Discount Popup
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setIsCookieBannerOpen((prev) => !prev)}
              className="w-full min-h-11 px-4 py-2.5 rounded-full border border-border bg-bg text-fg font-bold text-xs uppercase tracking-wider hover:border-accent hover:text-accent active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Toggle Cookie Banner ({isCookieBannerOpen ? "Hide" : "Show"})
            </button>
          </div>
        </form>
      </div>

      {/* Side-by-Side Theme Shells */}
      <div className="space-y-12">
        {/* Human Shell Preview */}
        <div className="rounded-card border border-border overflow-hidden bg-bg-elevated p-1 shadow-card">
          <div className="p-4 border-b border-border bg-bg-elevated flex items-center justify-between">
            <div>
              <h3 className="font-archivo text-base font-bold text-fg uppercase tracking-wide">
                Human Line Complete Shell
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Route: /human · Dark theme with gold accents · Free shipping
                over $75 · FDA disclaimer
              </p>
            </div>
            <span className="label text-xs uppercase px-2.5 py-1 rounded-full bg-border text-fg font-bold">
              Theme: Human
            </span>
          </div>

          <div
            data-theme="human"
            className="bg-bg text-fg overflow-hidden rounded-b-card border border-border/50 divide-y divide-border/40"
          >
            <AnnouncementBar line="human" />
            <Header variant="human" />
            <div className="p-8 sm:p-12 text-center bg-bg">
              <span className="label text-xs uppercase px-3 py-1 rounded-full bg-border text-fg-muted font-bold">
                Main Page Slot
              </span>
              <h4 className="title text-2xl sm:text-3xl font-extrabold uppercase text-fg mt-3">
                Cellular Longevity for Humans
              </h4>
              <p className="text-sm text-fg-muted max-w-xl mx-auto mt-2">
                NMN, NAD+, Resveratrol and mitochondrial optimization backed by
                rigorous clinical research.
              </p>
            </div>
            <TrustStrip line="human" />
            <Newsletter variant="human" />
            <Footer line="human" />
          </div>
        </div>

        {/* Pet Shell Preview */}
        <div className="rounded-card border border-border overflow-hidden bg-bg p-1 shadow-card">
          <div className="p-4 border-b border-border bg-bg-elevated flex items-center justify-between">
            <div>
              <h3 className="font-archivo text-base font-bold text-fg uppercase tracking-wide">
                Pet Line Complete Shell
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Route: /pet · Cream theme with espresso accents · Free shipping
                over $49 · For animal use only
              </p>
            </div>
            <span className="label text-xs uppercase px-2.5 py-1 rounded-full bg-border text-fg font-bold">
              Theme: Pet
            </span>
          </div>

          <div
            data-theme="pet"
            className="bg-bg text-fg overflow-hidden rounded-b-card border border-border/50 divide-y divide-border/40"
          >
            <AnnouncementBar line="pet" />
            <Header variant="pet" />
            <div className="p-8 sm:p-12 text-center bg-bg">
              <span className="label text-xs uppercase px-3 py-1 rounded-full bg-border text-fg-muted font-bold">
                Main Page Slot
              </span>
              <h4 className="title text-2xl sm:text-3xl font-extrabold uppercase text-fg mt-3">
                Cellular Health for Dogs, Cats &amp; Horses
              </h4>
              <p className="text-sm text-fg-muted max-w-xl mx-auto mt-2">
                Veterinarian formulated cellular nutrition tailored to each pet
                weight and life stage.
              </p>
            </div>
            <TrustStrip line="pet" />
            <Newsletter variant="pet" />
            <Footer line="pet" />
          </div>
        </div>
      </div>

      {/* Inline Cookie Banner Verification */}
      {isCookieBannerOpen && (
        <div className="mt-8">
          <CookieBanner inline forceVisible />
        </div>
      )}

      {/* Cart Drawer Instance */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        theme={selectedTheme}
      />

      {/* First Visit Popup Instance */}
      {isPopupOpen && (
        <FirstVisitPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          variant={selectedTheme}
          forceOpen
        />
      )}
    </section>
  );
}

export default function W122Section() {
  return <W122Showcase />;
}
