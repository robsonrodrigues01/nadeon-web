import React from "react";
import Link from "next/link";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata, buildOrganizationJsonLd, JsonLd } from "@/lib/seo";
import { Claim } from "@/components/commerce/product-card/claim";
import { LineChoiceButton } from "./_components/line-choice-button";
import { JarPreview, type JarData } from "./_components/jar-preview";

export const metadata = buildMetadata({
  title: "Nadeon Labs | Cellular Longevity for Humans and Pets",
  description:
    "Targeted cellular longevity formulas for humans and companion animals. High-purity NMN and NAD+ supplements backed by third-party testing.",
  pathname: "/",
});

export default async function EntrancePage() {
  const [humanProducts, petProducts] = await Promise.all([
    catalogProvider.getProducts({ line: "human" }),
    catalogProvider.getProducts({ line: "pet" }),
  ]);

  const biohack = humanProducts.find((p) => p.slug === "biohack");
  const fullCharge = humanProducts.find((p) => p.slug === "full-charge");
  const renew = humanProducts.find((p) => p.slug === "renew");

  const moreGoodYears = petProducts.find((p) => p.slug === "more-good-years");
  const goldenYears = petProducts.find((p) => p.slug === "golden-years");
  const stillSharp = petProducts.find((p) => p.slug === "still-sharp");

  const biohackTechnical =
    biohack?.technicalName === "Cellular Longevity & NAD+ Optimizer"
      ? "NMN 500 mg"
      : (biohack?.technicalName ?? "NMN 500 mg");

  const humanJars: JarData[] = [
    {
      slug: "biohack",
      name: biohack?.name ?? "BioHack",
      technicalName: biohackTechnical,
      capColor: "bg-[rgb(255,241,214)]",
      bodyColor: "bg-[rgb(244,238,230)]",
      labelBg: "bg-[rgb(26,10,44)]",
      labelFg: "text-[rgb(255,241,214)]",
      uppercaseName: false,
    },
    {
      slug: "full-charge",
      name: fullCharge?.name ?? "Full Charge",
      technicalName: fullCharge?.technicalName ?? "NMN 4-in-1",
      capColor: "bg-[rgb(255,241,214)]",
      bodyColor: "bg-[rgb(244,238,230)]",
      labelBg: "bg-[rgb(22,16,12)]",
      labelFg: "text-[rgb(255,241,214)]",
      uppercaseName: false,
    },
    {
      slug: "renew",
      name: renew?.name ?? "Renew",
      technicalName: renew?.technicalName ?? "NAD+ + Resveratrol",
      capColor: "bg-[var(--product-rose)]",
      bodyColor: "bg-[rgb(244,238,230)]",
      labelBg: "bg-[rgb(46,7,22)]",
      labelFg: "text-[var(--product-rose)]",
      uppercaseName: false,
    },
  ];

  const petJars: JarData[] = [
    {
      slug: "more-good-years",
      name: moreGoodYears?.name ?? "More Good Years",
      technicalName: moreGoodYears?.technicalName ?? "Senior · NMN 75 mg",
      capColor: "bg-[rgb(42,23,16)]",
      bodyColor: "bg-white",
      labelBg: "bg-[rgb(169,204,142)]",
      labelFg: "text-[rgb(42,23,16)]",
      uppercaseName: true,
    },
    {
      slug: "golden-years",
      name: goldenYears?.name ?? "Golden Years",
      technicalName: goldenYears?.technicalName ?? "Joints · NMN 50 mg",
      capColor: "bg-[rgb(42,23,16)]",
      bodyColor: "bg-white",
      labelBg: "bg-[rgb(242,201,90)]",
      labelFg: "text-[rgb(42,23,16)]",
      uppercaseName: true,
    },
    {
      slug: "still-sharp",
      name: stillSharp?.name ?? "Still Sharp",
      technicalName: stillSharp?.technicalName ?? "Calm · NMN 50 mg",
      capColor: "bg-[rgb(42,23,16)]",
      bodyColor: "bg-white",
      labelBg: "bg-[rgb(163,204,239)]",
      labelFg: "text-[rgb(42,23,16)]",
      uppercaseName: true,
    },
  ];

  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <>
      <JsonLd data={organizationJsonLd as unknown as Record<string, unknown>} />
      <main
        className="relative w-full min-h-screen overflow-hidden flex flex-col lg:flex-row bg-[rgb(255,246,234)] text-[rgb(42,23,16)] font-sans"
        id="main-content"
        tabIndex={-1}
      >
        {/* Floating Top Center Brand Badge */}
        <header
          role="banner"
          className="absolute left-1/2 top-6 lg:top-[34px] -translate-x-1/2 z-20 bg-[rgba(22,16,12,0.92)] border border-[rgb(217,164,67)] rounded-full px-3.5 py-2 lg:px-[22px] lg:py-3 shadow-lg pointer-events-auto"
        >
          <nav aria-label="Home" className="flex">
            <Link
              href="/"
              aria-label="Nadeon Labs Homepage"
              className="flex items-center gap-1.5 lg:gap-2.25 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(217,164,67)] rounded-full"
            >
              <svg
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
                className="w-[22px] h-[22px] lg:w-[30px] lg:h-[30px] shrink-0"
              >
                <defs>
                  <linearGradient
                    id="header-nadeon-gold-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgb(248,220,134)" />
                    <stop offset="50%" stopColor="rgb(224,166,60)" />
                    <stop offset="100%" stopColor="rgb(185,122,34)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="url(#header-nadeon-gold-grad)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="7"
                  fill="url(#header-nadeon-gold-grad)"
                />
              </svg>
              <span className="font-archivo font-extrabold text-[13px] lg:text-[18px] leading-none whitespace-nowrap bg-gradient-gold bg-clip-text text-transparent">
                Nadeon <span className="font-normal">Labs</span>
              </span>
            </Link>
          </nav>
        </header>

        {/* Human Side (Left / Top on mobile) */}
        <section
          aria-labelledby="human-section-title"
          className="relative w-full lg:w-1/2 h-[422px] lg:h-auto lg:min-h-screen bg-[radial-gradient(ellipse_70%_60%_at_30%_30%,rgb(62,46,34),rgb(22,16,12)_75%)] text-[rgb(255,246,234)] p-[22px] lg:p-16 flex flex-col justify-end lg:justify-center gap-3 lg:gap-[22px] overflow-hidden"
        >
          {/* Subtle noise / glow overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-white/5 opacity-[0.22] mix-blend-screen pointer-events-none"
          />

          {/* Category Tag */}
          <p className="relative text-[11px] lg:text-[13px] font-bold tracking-[0.14em] uppercase bg-gradient-gold bg-clip-text text-transparent">
            FOR YOU
          </p>

          {/* Heading */}
          <h1
            id="human-section-title"
            className="relative font-archivo font-extrabold text-[56px] lg:text-[128px] leading-[0.95] tracking-[-0.01em] text-[rgb(255,246,234)]"
          >
            Human
          </h1>

          {/* Description with <Claim> */}
          <div className="relative text-[13px] lg:text-[18px] leading-[1.4] max-w-[300px] lg:max-w-[440px] opacity-90 text-[rgb(255,246,234)]">
            <Claim>
              NMN and NAD<sup>+</sup> for cellular energy, focus and healthy
              aging.*
            </Claim>
          </div>

          {/* Desktop Jars Row */}
          <div className="relative hidden lg:flex gap-[18px] items-end my-3.5">
            {humanJars.map((jar) => (
              <JarPreview key={jar.slug} jar={jar} size="desktop" />
            ))}
          </div>

          {/* Mobile Jars Row */}
          <div className="flex lg:hidden absolute right-4 top-[84px] gap-2 items-end">
            {humanJars.map((jar) => (
              <JarPreview key={jar.slug} jar={jar} size="mobile" />
            ))}
          </div>

          {/* Action / Navigation Button */}
          <div className="relative">
            <LineChoiceButton
              line="human"
              href="/human"
              aria-label="Buy Human"
              className="bg-[rgb(255,246,234)] text-[rgb(42,23,16)] px-[22px] py-[11px] lg:px-[30px] lg:py-4 text-[14px] lg:text-[16px] shadow-md focus-visible:ring-[rgb(248,220,134)]"
            >
              Buy Human →
            </LineChoiceButton>
          </div>
        </section>

        {/* Pet Side (Right / Bottom on mobile) */}
        <section
          aria-labelledby="pet-section-title"
          className="relative w-full lg:w-1/2 h-[422px] lg:h-auto lg:min-h-screen bg-[rgb(255,246,234)] text-[rgb(42,23,16)] p-[22px] pb-[58px] lg:p-16 flex flex-col justify-end lg:justify-center gap-3 lg:gap-[22px] overflow-hidden"
        >
          {/* Decorative Background Shapes */}
          <div
            aria-hidden="true"
            className="absolute -right-[30px] -top-[30px] lg:-right-[60px] lg:top-10 w-[200px] h-[200px] lg:w-[420px] lg:h-[420px] rounded-full bg-[rgb(255,237,176)] opacity-80 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute right-[120px] -bottom-[60px] lg:right-[260px] lg:-bottom-[80px] w-[160px] h-[160px] lg:w-[360px] lg:h-[360px] rounded-full bg-[rgb(221,238,251)] opacity-80 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute right-5 bottom-4.5 lg:right-10 lg:bottom-10 pointer-events-none"
          >
            <svg
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
              className="w-[60px] h-[60px] lg:w-[140px] lg:h-[140px] text-[rgb(42,23,16)] opacity-[0.08]"
            >
              <ellipse
                cx="22"
                cy="42"
                rx="9"
                ry="12"
                transform="rotate(-25 22 42)"
              />
              <ellipse
                cx="39"
                cy="24"
                rx="9.5"
                ry="13"
                transform="rotate(-8 39 24)"
              />
              <ellipse
                cx="61"
                cy="24"
                rx="9.5"
                ry="13"
                transform="rotate(8 61 24)"
              />
              <ellipse
                cx="78"
                cy="42"
                rx="9"
                ry="12"
                transform="rotate(25 78 42)"
              />
              <path d="M50 48 C 38 48 28 60 24 70 C 20 80 26 90 36 89 C 42 88 46 85 50 85 C 54 85 58 88 64 89 C 74 90 80 80 76 70 C 72 60 62 48 50 48 Z" />
            </svg>
          </div>

          {/* Category Tag */}
          <p className="relative text-[11px] lg:text-[13px] font-bold tracking-[0.14em] uppercase text-[rgb(185,122,34)]">
            FOR YOUR PACK
          </p>

          {/* Heading */}
          <h2
            id="pet-section-title"
            className="relative font-archivo font-extrabold text-[56px] lg:text-[128px] leading-[0.95] tracking-[-0.01em] text-[rgb(42,23,16)]"
          >
            Pet
          </h2>

          {/* Description with <Claim> */}
          <div className="relative text-[13px] lg:text-[18px] leading-[1.4] max-w-[300px] lg:max-w-[440px] text-[rgb(42,23,16)]">
            <Claim>
              NMN soft chews, oils and drops for dogs, cats and horses.*
            </Claim>
          </div>

          {/* Desktop Jars Row */}
          <div className="relative hidden lg:flex gap-[18px] items-end my-3.5">
            {petJars.map((jar) => (
              <JarPreview key={jar.slug} jar={jar} size="desktop" />
            ))}
          </div>

          {/* Mobile Jars Row */}
          <div className="flex lg:hidden absolute right-4 top-7 gap-2 items-end">
            {petJars.map((jar) => (
              <JarPreview key={jar.slug} jar={jar} size="mobile" />
            ))}
          </div>

          {/* Action / Navigation Button */}
          <div className="relative">
            <LineChoiceButton
              line="pet"
              href="/pet"
              aria-label="Buy Pet"
              className="bg-[rgb(42,23,16)] text-[rgb(255,246,234)] px-[22px] py-[11px] lg:px-[30px] lg:py-4 text-[14px] lg:text-[16px] shadow-md focus-visible:ring-[rgb(42,23,16)]"
            >
              Buy Pet →
            </LineChoiceButton>
          </div>
        </section>

        {/* Global FDA Disclaimer Footer Bar */}
        <footer
          role="contentinfo"
          className="absolute left-0 right-0 bottom-0 z-20 px-3 py-1.5 lg:px-6 lg:py-2.5 text-[8px] lg:text-[10px] leading-[1.35] text-[rgb(42,23,16)] bg-[rgba(255,246,234,0.85)] text-center backdrop-blur-xs"
        >
          *These statements have not been evaluated by the Food and Drug
          Administration. These products are not intended to diagnose, treat,
          cure or prevent any disease.
        </footer>
      </main>
    </>
  );
}
