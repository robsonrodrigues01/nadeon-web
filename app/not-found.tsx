import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "404 - Page Wandered Off | Nadeon Labs",
  description:
    "We followed the paw prints but could not find it. It may have moved, or the link has a typo.",
  pathname: "/404",
  noIndex: true,
});

function PawIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="22" cy="42" rx="9" ry="12" transform="rotate(-25 22 42)" />
      <ellipse cx="39" cy="24" rx="9.5" ry="13" transform="rotate(-8 39 24)" />
      <ellipse cx="61" cy="24" rx="9.5" ry="13" transform="rotate(8 61 24)" />
      <ellipse cx="78" cy="42" rx="9" ry="12" transform="rotate(25 78 42)" />
      <path d="M50 48 C 38 48 28 60 24 70 C 20 80 26 90 36 89 C 42 88 46 85 50 85 C 54 85 58 88 64 89 C 74 90 80 80 76 70 C 72 60 62 48 50 48 Z" />
    </svg>
  );
}

function NadeonLeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="leaf-grad-404" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(248, 220, 134)" />
          <stop offset="50%" stopColor="rgb(224, 166, 60)" />
          <stop offset="100%" stopColor="rgb(185, 122, 34)" />
        </linearGradient>
      </defs>
      <path
        d="M16 2 C8 6 4 14 6 22 C8 28 14 30 16 30 C18 30 24 28 26 22 C28 14 24 6 16 2 Z"
        fill="url(#leaf-grad-404)"
      />
      <path
        d="M16 4 V28"
        stroke="rgb(22, 16, 12)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const POPULAR_CARDS = [
  {
    category: "Dogs",
    description: "Soft chews, treats and powder",
    href: "/pet/dogs",
    bgGradient:
      "bg-[linear-gradient(160deg,rgb(226,240,212),rgb(169,204,142))]",
    preview: {
      type: "jar",
      labelBg: "bg-[rgb(169,204,142)]",
      name: "More Good Years",
      technical: "Senior · NMN 75 mg",
    },
  },
  {
    category: "Cats",
    description: "Joint drops",
    href: "/pet/cats",
    bgGradient:
      "bg-[linear-gradient(160deg,rgb(237,227,251),rgb(201,178,236))]",
    preview: {
      type: "bottle",
      labelBg: "bg-[rgb(201,178,236)]",
      name: "High Jump",
      technical: "Joint drops",
    },
  },
  {
    category: "Horses",
    description: "Joint top-dress",
    href: "/pet/horses",
    bgGradient:
      "bg-[linear-gradient(160deg,rgb(255,220,192),rgb(244,169,112))]",
    preview: {
      type: "jar",
      labelBg: "bg-[rgb(244,169,112)]",
      name: "Long Stride",
      technical: "Horse joint",
    },
  },
  {
    category: "Find the right formula",
    description: "Take the 60-second quiz",
    href: "/pet/quiz",
    bgGradient:
      "bg-[linear-gradient(160deg,rgb(221,238,251),rgb(163,204,239))]",
    preview: {
      type: "jar",
      labelBg: "bg-[rgb(163,204,239)]",
      name: "Still Sharp",
      technical: "Calm · NMN 50 mg",
    },
  },
] as const;

const HUMAN_PILLS = [
  { label: "Shop Human →", href: "/human" },
  { label: "BioHack →", href: "/human/products/biohack" },
  { label: "Science →", href: "/science" },
  { label: "Take the quiz →", href: "/human/quiz" },
  { label: "Help center →", href: "/help" },
] as const;

export default function NotFound() {
  return (
    <div
      data-theme="pet"
      className="min-h-screen flex flex-col bg-bg text-fg font-sans"
    >
      <AnnouncementBar line="pet" />
      <Header variant="pet" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {/* 404 Hero with Paw Prints Trail */}
        <section
          aria-labelledby="not-found-heading"
          className="relative overflow-hidden bg-[linear-gradient(160deg,rgb(255,237,176)_0%,rgb(255,220,192)_50%,rgb(221,238,251)_100%)] text-center px-5 sm:px-8 lg:px-[72px] pt-12 pb-24 sm:pt-16 sm:pb-32 lg:pt-[100px] lg:pb-[170px]"
        >
          {/* Paw Prints Decorative Trail */}
          <div
            aria-hidden="true"
            className="absolute left-[4%] top-[92%] rotate-[80deg] opacity-50 pointer-events-none"
          >
            <PawIcon className="w-[30px] h-[30px] lg:w-[46px] lg:h-[46px] text-fg" />
          </div>
          <div
            aria-hidden="true"
            className="absolute left-[14%] sm:left-[24%] top-[87%] sm:top-[89%] rotate-[75deg] sm:rotate-[80deg] opacity-[0.42] pointer-events-none"
          >
            <PawIcon className="w-[30px] h-[30px] lg:w-[46px] lg:h-[46px] text-fg" />
          </div>
          <div
            aria-hidden="true"
            className="absolute left-[25%] sm:left-[44%] top-[92%] sm:top-[93%] rotate-[85deg] sm:rotate-[90deg] opacity-[0.34] pointer-events-none"
          >
            <PawIcon className="w-[30px] h-[30px] lg:w-[46px] lg:h-[46px] text-fg" />
          </div>
          <div
            aria-hidden="true"
            className="absolute left-[36%] sm:left-[64%] top-[87%] sm:top-[89%] rotate-[80deg] sm:rotate-[85deg] opacity-[0.27] pointer-events-none"
          >
            <PawIcon className="w-[30px] h-[30px] lg:w-[46px] lg:h-[46px] text-fg" />
          </div>
          <div
            aria-hidden="true"
            className="absolute left-[47%] sm:left-[84%] top-[92%] sm:top-[93%] rotate-[90deg] opacity-20 pointer-events-none"
          >
            <PawIcon className="w-[30px] h-[30px] lg:w-[46px] lg:h-[46px] text-fg" />
          </div>
          <div
            aria-hidden="true"
            className="hidden sm:block absolute left-[58%] top-[87%] rotate-[85deg] opacity-[0.14] pointer-events-none"
          >
            <PawIcon className="w-[46px] h-[46px] text-fg" />
          </div>
          <div
            aria-hidden="true"
            className="hidden sm:block absolute left-[69%] top-[92%] rotate-[90deg] opacity-[0.09] pointer-events-none"
          >
            <PawIcon className="w-[46px] h-[46px] text-fg" />
          </div>
          <div
            aria-hidden="true"
            className="hidden sm:block absolute left-[80%] top-[87%] rotate-[90deg] opacity-[0.05] pointer-events-none"
          >
            <PawIcon className="w-[46px] h-[46px] text-fg" />
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* 4 🐾 4 Graphic */}
            <div
              aria-label="404 error"
              role="img"
              className="font-heading font-extrabold tracking-[-0.01em] text-[120px] sm:text-[180px] lg:text-[260px] leading-[0.85] text-fg opacity-95 select-none"
            >
              <span>4</span>
              <span className="inline-block align-middle mx-1 sm:mx-2 lg:mx-2.5">
                <PawIcon className="w-24 h-24 sm:w-36 sm:h-36 lg:w-[210px] lg:h-[210px] text-fg" />
              </span>
              <span>4</span>
            </div>

            {/* Heading */}
            <h1
              id="not-found-heading"
              className="mt-4.5 sm:mt-6 lg:mt-6.5 font-heading font-extrabold text-[34px] sm:text-[48px] lg:text-[64px] leading-[0.95] tracking-[-0.01em] uppercase text-fg"
            >
              This page wandered off
            </h1>

            {/* Subtitle */}
            <p className="mt-3.5 text-[15px] sm:text-[18px] lg:text-[20px] leading-relaxed max-w-[600px] mx-auto text-fg">
              We followed the paw prints but could not find it. It may have
              moved, or the link has a typo.
            </p>

            {/* Search Form */}
            <form
              action="/search"
              method="GET"
              role="search"
              className="mt-6 sm:mt-7 lg:mt-[34px] max-w-[520px] mx-auto flex flex-col sm:flex-row gap-2"
            >
              <label htmlFor="not-found-search-input" className="sr-only">
                Search chews, oils, articles
              </label>
              <div className="relative flex-1">
                <span
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-fg/50 text-[16px] pointer-events-none"
                  aria-hidden="true"
                >
                  ⌕
                </span>
                <input
                  id="not-found-search-input"
                  name="q"
                  type="search"
                  placeholder="Search chews, oils, articles"
                  className="w-full bg-white border-[1.5px] border-fg/20 rounded-full pl-10 pr-5 py-3.5 text-[15px] text-fg placeholder:text-fg/50 focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
                />
              </div>
              <button
                type="submit"
                className="bg-fg text-bg rounded-full px-7.5 py-3.5 lg:py-4 font-bold text-[16px] whitespace-nowrap hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px] transition-opacity cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/pet"
                className="inline-flex items-center justify-center bg-fg text-bg rounded-full px-5.5 lg:px-7.5 py-2.5 lg:py-4 text-[14px] lg:text-[16px] font-bold whitespace-nowrap hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px] transition-opacity"
              >
                Back to Pet home
              </Link>
              <Link
                href="/pet/dogs"
                className="inline-flex items-center justify-center border-2 border-fg text-fg rounded-full px-5 py-2 text-[14px] font-bold whitespace-nowrap hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px] transition-colors"
              >
                Shop dog chews
              </Link>
            </div>
          </div>
        </section>

        {/* Popular with the pack */}
        <section
          aria-labelledby="pack-favorites-title"
          className="bg-bg text-fg px-5 sm:px-8 lg:px-[72px] py-11 sm:py-16 lg:py-[90px]"
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[rgb(185,122,34)]">
              TRY ONE OF THESE
            </p>
            <h2
              id="pack-favorites-title"
              className="mt-2.5 mb-6 sm:mb-8 lg:mb-11 font-heading font-extrabold text-[32px] sm:text-[44px] lg:text-[56px] leading-[0.95] tracking-[-0.01em] uppercase text-fg"
            >
              Popular with the pack
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-[22px]">
              {POPULAR_CARDS.map((card) => (
                <Link
                  key={card.category}
                  href={card.href}
                  className={`group rounded-[20px] ${card.bgGradient} p-4.5 sm:p-5 lg:p-[26px] flex flex-row lg:flex-col justify-between items-center lg:items-stretch gap-3.5 lg:gap-4 lg:min-h-[300px] text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-transform hover:-translate-y-0.5`}
                >
                  <div>
                    <h3 className="font-heading font-extrabold text-[20px] lg:text-[26px] leading-[0.95] tracking-[-0.01em]">
                      {card.category}
                    </h3>
                    <p className="text-[14px] opacity-75 mt-1.5">
                      {card.description}
                    </p>
                    <span className="inline-block font-bold text-[14px] mt-3 group-hover:underline">
                      Go →
                    </span>
                  </div>

                  {/* Visual Illustration */}
                  <div
                    aria-hidden="true"
                    className="shrink-0 self-center lg:self-center"
                  >
                    {card.preview.type === "bottle" ? (
                      <div className="w-[70px] lg:w-[110px] h-[82px] lg:h-[129px] flex flex-col items-center justify-end">
                        <div className="w-2 lg:w-3.5 h-4 lg:h-6 bg-[rgb(42,23,16)] rounded-t-sm" />
                        <div className="w-4 lg:w-6.5 h-1 lg:h-1.5 bg-[rgb(185,122,34)]" />
                        <div className="w-9 lg:w-14 h-12 lg:h-20 rounded-md bg-[linear-gradient(90deg,rgb(59,26,8),rgb(122,58,18)_45%,rgb(42,18,6))] relative shadow-md overflow-hidden flex items-center justify-center">
                          <div
                            className={`absolute inset-x-0 top-[22%] h-[52%] ${card.preview.labelBg} flex items-center justify-center text-center px-1`}
                          >
                            <span className="font-heading font-extrabold text-[7px] lg:text-[8px] leading-tight text-[rgb(42,23,16)]">
                              {card.preview.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-[70px] lg:w-[110px] h-[82px] lg:h-[129px] flex flex-col items-center justify-end">
                        <div className="w-[54px] lg:w-[85px] h-3 lg:h-5 bg-[rgb(42,23,16)] rounded-t-md shadow-inner" />
                        <div className="w-[70px] lg:w-[110px] h-16 lg:h-[103px] bg-white rounded-md relative shadow-md overflow-hidden">
                          <div
                            className={`absolute inset-x-0 top-[16%] h-[62%] ${card.preview.labelBg} flex flex-col items-center justify-center gap-0.5 text-center px-1.5`}
                          >
                            <PawIcon className="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 text-[rgb(42,23,16)] opacity-90" />
                            <span className="font-heading font-extrabold text-[9px] lg:text-[14px] leading-tight text-[rgb(42,23,16)] uppercase">
                              {card.preview.name}
                            </span>
                            <span className="text-[5px] lg:text-[6px] font-bold tracking-wider text-[rgb(42,23,16)] opacity-85 uppercase">
                              {card.preview.technical}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Looking for Nadeon Human? Banner */}
        <section
          aria-labelledby="human-crossline-title"
          className="bg-[radial-gradient(ellipse_at_25%_40%,rgb(62,46,34),rgb(22,16,12)_75%)] text-[rgb(255,246,234)] px-5 sm:px-8 lg:px-[72px] py-9 sm:py-12 lg:py-16"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-[60px]">
            <div className="flex items-center gap-4.5">
              <NadeonLeafIcon className="w-12 h-12 lg:w-[72px] lg:h-[72px] shrink-0" />
              <div>
                <h2
                  id="human-crossline-title"
                  className="font-heading font-extrabold text-[24px] sm:text-[32px] lg:text-[38px] leading-[0.95] tracking-[-0.01em] uppercase bg-gradient-gold bg-clip-text text-transparent"
                >
                  Looking for Nadeon Human?
                </h2>
                <p className="mt-1.5 text-[14px] lg:text-[16px] text-white/80">
                  NMN and NAD+ capsules, powders and tinctures for people.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 max-w-[520px] lg:justify-end">
              {HUMAN_PILLS.map((pill) => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="inline-flex items-center border-[1.5px] border-[rgba(217,164,67,0.53)] rounded-full px-4 py-2 text-[14px] font-bold text-[rgb(255,246,234)] whitespace-nowrap hover:bg-[rgba(217,164,67,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(217,164,67)] min-h-[44px] transition-colors"
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer line="pet" />
    </div>
  );
}
