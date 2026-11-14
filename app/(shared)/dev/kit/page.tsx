import React from "react";
import process from "node:process";
import { notFound } from "next/navigation";
import { catalogProvider } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import { ProductCardMin } from "@/components/commerce/product-card-min";

export const dynamic = "force-dynamic";

export default async function DevKitPage() {
  const isDev = process.env.NODE_ENV === "development";
  const isPreview = process.env.VERCEL_ENV === "preview";
  const isExplicit = process.env.DEV_KIT === "1";
  const isVercelProd = process.env.VERCEL_ENV === "production";

  // Restricted to development and preview environments; returns 404 in production
  if (
    isVercelProd ||
    (!isDev &&
      !isPreview &&
      !isExplicit &&
      process.env.NODE_ENV === "production")
  ) {
    notFound();
  }

  // Load products from CatalogProvider mock
  const [biohack, moreGoodYears] = await Promise.all([
    catalogProvider.getProduct("biohack"),
    catalogProvider.getProduct("more-good-years"),
  ]);

  const productColors = [
    {
      name: "--product-amber",
      label: "Amber",
      varStyle: "var(--product-amber)",
    },
    {
      name: "--product-coral",
      label: "Coral",
      varStyle: "var(--product-coral)",
    },
    {
      name: "--product-lilac",
      label: "Lilac",
      varStyle: "var(--product-lilac)",
    },
    { name: "--product-rose", label: "Rose", varStyle: "var(--product-rose)" },
    { name: "--product-sky", label: "Sky", varStyle: "var(--product-sky)" },
    { name: "--product-mint", label: "Mint", varStyle: "var(--product-mint)" },
  ];

  const structuralTokens = [
    { name: "--bg", label: "Background" },
    { name: "--bg-elevated", label: "Elevated" },
    { name: "--fg", label: "Foreground" },
    { name: "--fg-muted", label: "Muted" },
    { name: "--border", label: "Border" },
    { name: "--accent", label: "Accent" },
  ];

  return (
    <main className="min-h-screen bg-bg text-fg px-4 py-10 sm:px-8 max-w-7xl mx-auto">
      <header className="mb-10 pb-6 border-b border-border">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Design System &amp; Brand Kit
        </span>
        <h1 className="hero text-4xl sm:text-6xl font-black uppercase tracking-tight text-fg">
          Nadeon Dev Kit
        </h1>
        <p className="lead text-fg-muted mt-2 max-w-2xl">
          Visual verification workbench for tokens, typographic scale, component
          states, and multi-market catalog rendering.
        </p>
      </header>

      {/* Global Brand Tokens & Product Colors */}
      <section aria-labelledby="section-tokens" className="mb-12">
        <h2
          id="section-tokens"
          className="title text-2xl font-black uppercase mb-6 text-fg"
        >
          Tokens &amp; Color Palette
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Brand Gradients */}
          <div className="rounded-card border border-border bg-bg-elevated p-5 shadow-card">
            <h3 className="label text-fg-muted text-xs uppercase mb-3 font-bold">
              Brand Gradients
            </h3>
            <div className="space-y-3">
              <div>
                <div
                  className="h-14 rounded-field shadow-sm flex items-center justify-center font-bold text-sm text-[var(--accent-fg)]"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                >
                  --gradient-gold
                </div>
                <span className="text-xs text-fg-muted mt-1 block">
                  Primary Gold Gradient
                </span>
              </div>
              <div>
                <div
                  className="h-14 rounded-field shadow-sm flex items-center justify-center font-bold text-sm text-white"
                  style={{ backgroundImage: "var(--gradient-sunrise)" }}
                >
                  --gradient-sunrise
                </div>
                <span className="text-xs text-fg-muted mt-1 block">
                  Sunrise Gradient
                </span>
              </div>
            </div>
          </div>

          {/* Product Colors */}
          <div className="rounded-card border border-border bg-bg-elevated p-5 shadow-card md:col-span-1 lg:col-span-2">
            <h3 className="label text-fg-muted text-xs uppercase mb-3 font-bold">
              Product Colors (Identical in both themes)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {productColors.map((color) => (
                <div
                  key={color.name}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-14 h-14 rounded-full border border-border shadow-sm mb-2"
                    style={{ backgroundColor: color.varStyle }}
                    aria-label={color.label}
                  />
                  <span className="text-xs font-bold text-fg">
                    {color.label}
                  </span>
                  <span className="text-[10px] text-fg-muted font-mono">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Theme Demonstrations: Human & Pet */}
      <section aria-labelledby="section-themes" className="mb-12">
        <h2
          id="section-themes"
          className="title text-2xl font-black uppercase mb-6 text-fg"
        >
          Theme Comparison: Human vs Pet
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HUMAN THEME */}
          <div
            data-theme="human"
            className="rounded-card border-2 border-border bg-bg text-fg p-6 shadow-card flex flex-col gap-8"
          >
            <div className="border-b border-border pb-4">
              <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-1">
                Theme: Human (Dark, Warm)
              </span>
              <h3 className="title text-xl font-bold uppercase text-fg">
                Human Longevity Line
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {structuralTokens.map((t) => (
                  <span
                    key={t.name}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-field border border-border bg-bg-elevated text-fg-muted"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Typography Scale */}
            <div>
              <h4 className="label text-fg-muted text-xs uppercase mb-3 font-bold">
                Typographic Scale
              </h4>
              <div className="space-y-4 rounded-card border border-border bg-bg-elevated p-4">
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    hero (Archivo 800)
                  </span>
                  <div className="hero text-fg">CELLULAR ENERGY*</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    title (Archivo 800)
                  </span>
                  <div className="title text-fg">BUILD YOUR ROUTINE</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    lead (DM Sans 500)
                  </span>
                  <p className="lead text-fg">
                    Clean NMN &amp; NAD+ formulas, tested lot by lot.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    body (DM Sans 400)
                  </span>
                  <p className="body text-fg-muted">
                    BioHack replenishes cellular NAD+ levels and activates
                    sirtuins for daily longevity.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    label (DM Sans 700)
                  </span>
                  <span className="label text-accent font-bold">
                    NMN · NAD+ · MADE IN USA
                  </span>
                </div>
              </div>
            </div>

            {/* Button Component Showcase */}
            <div>
              <h4 className="label text-fg-muted text-xs uppercase mb-3 font-bold">
                Button Component: Variants &amp; States
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-card border border-border bg-bg-elevated p-4">
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Primary (Default)
                  </span>
                  <Button variant="primary" className="w-full">
                    Shop best sellers
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Secondary (Outline)
                  </span>
                  <Button variant="secondary" className="w-full">
                    Take the quiz
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Link Variant
                  </span>
                  <Button variant="link" className="w-full justify-start">
                    See Supplement Facts →
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    As Next.js Link
                  </span>
                  <Button
                    variant="secondary"
                    href="#section-tokens"
                    className="w-full"
                  >
                    Anchor Link
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Disabled State
                  </span>
                  <Button variant="primary" disabled className="w-full">
                    Sold out
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Loading State
                  </span>
                  <Button
                    variant="primary"
                    isLoading
                    loadingText="Adding..."
                    className="w-full"
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Card Minimal - Human */}
            <div>
              <h4 className="label text-fg-muted text-xs uppercase mb-3 font-bold">
                Product Card (CatalogProvider Mock)
              </h4>
              {biohack && <ProductCardMin product={biohack} />}
            </div>
          </div>

          {/* PET THEME */}
          <div
            data-theme="pet"
            className="rounded-card border-2 border-border bg-bg text-fg p-6 shadow-card flex flex-col gap-8"
          >
            <div className="border-b border-border pb-4">
              <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-1">
                Theme: Pet (Light, Warm)
              </span>
              <h3 className="title text-xl font-bold uppercase text-fg">
                Pet Longevity Line
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {structuralTokens.map((t) => (
                  <span
                    key={t.name}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-field border border-border bg-bg-elevated text-fg-muted"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Typography Scale */}
            <div>
              <h4 className="label text-fg-muted text-xs uppercase mb-3 font-bold">
                Typographic Scale
              </h4>
              <div className="space-y-4 rounded-card border border-border bg-bg-elevated p-4">
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    hero (Archivo 800)
                  </span>
                  <div className="hero text-fg">MORE GOOD YEARS*</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    title (Archivo 800)
                  </span>
                  <div className="title text-fg">CANINE VITALITY CHEWS</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    lead (DM Sans 500)
                  </span>
                  <p className="lead text-fg">
                    Veterinary formulated cellular vitality for mature dogs.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    body (DM Sans 400)
                  </span>
                  <p className="body text-fg-muted">
                    Maintains youthful energy, mobility, and playfulness in
                    senior canine companions.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">
                    label (DM Sans 700)
                  </span>
                  <span className="label text-accent font-bold">
                    FOR ANIMAL USE ONLY
                  </span>
                </div>
              </div>
            </div>

            {/* Button Component Showcase */}
            <div>
              <h4 className="label text-fg-muted text-xs uppercase mb-3 font-bold">
                Button Component: Variants &amp; States
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-card border border-border bg-bg-elevated p-4">
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Primary (Default)
                  </span>
                  <Button variant="primary" className="w-full">
                    Shop pet line
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Secondary (Outline)
                  </span>
                  <Button variant="secondary" className="w-full">
                    Pet wellness quiz
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Link Variant
                  </span>
                  <Button variant="link" className="w-full justify-start">
                    View dosing chart →
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    As Next.js Link
                  </span>
                  <Button
                    variant="secondary"
                    href="#section-tokens"
                    className="w-full"
                  >
                    Anchor Link
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Disabled State
                  </span>
                  <Button variant="primary" disabled className="w-full">
                    Temporarily out
                  </Button>
                </div>
                <div>
                  <span className="text-[10px] text-fg-muted block mb-1">
                    Loading State
                  </span>
                  <Button
                    variant="primary"
                    isLoading
                    loadingText="Saving..."
                    className="w-full"
                  >
                    Subscribe &amp; Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Card Minimal - Pet */}
            <div>
              <h4 className="label text-fg-muted text-xs uppercase mb-3 font-bold">
                Product Card (CatalogProvider Mock)
              </h4>
              {moreGoodYears && <ProductCardMin product={moreGoodYears} />}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
