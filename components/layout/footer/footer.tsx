import React from "react";
import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";
import { CrossLineCard } from "./cross-line-card";
import { FooterNav } from "./footer-nav";
import {
  COMPANY_IDENTITY,
  LEGAL_LINKS,
  PAYMENT_METHODS,
  REGULATORY_STATEMENTS,
  SOCIAL_LINKS,
} from "./footer-data";
import type { FooterProps } from "./types";

export function Footer({ line = "human", className = "" }: FooterProps) {
  const isPet = line === "pet";
  const regulatoryText = REGULATORY_STATEMENTS[line];

  return (
    <footer
      data-theme="human"
      role="contentinfo"
      className={`w-full bg-bg text-fg border-t border-border transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 lg:pt-16 pb-8 lg:pb-12">
        {/* Top Grid: Newsletter + Cross promo + Navigation */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 justify-between">
          {/* Left Column: Newsletter, Social icons, Cross-line card */}
          <div className="w-full lg:max-w-md flex flex-col gap-7">
            <NewsletterForm line={line} />

            {/* Social Channels */}
            <div className="flex flex-col gap-2">
              <span className="sr-only">Social media links</span>
              <ul
                className="flex items-center gap-2.5 flex-wrap"
                aria-label="Social channels"
              >
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow Nadeon on ${social.name}`}
                      className="w-11 h-11 rounded-full border border-fg/30 flex items-center justify-center text-xs font-bold text-fg hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cross Line Navigation Card */}
            <CrossLineCard line={line} />
          </div>

          {/* Right Column: Multi-column Navigation */}
          <div className="flex-1 lg:pl-4">
            <FooterNav line={line} />
          </div>
        </div>

        {/* Big Brand Wordmark */}
        <div
          className="overflow-hidden py-10 sm:py-12 select-none"
          aria-hidden="true"
        >
          <div
            className={`font-heading font-black tracking-tighter text-center uppercase whitespace-nowrap leading-none ${
              isPet
                ? "text-accent opacity-90"
                : "bg-gradient-gold bg-clip-text text-transparent opacity-95"
            } text-[58px] sm:text-[90px] md:text-[120px] lg:text-[150px]`}
          >
            <span className="inline sm:hidden">Nadeon</span>
            <span className="hidden sm:inline">Nadeon Labs</span>
          </div>
        </div>

        {/* Bottom Legal, Regulatory & Payment Badges */}
        <div className="border-t border-fg/15 pt-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-xs text-fg/60">
          <div className="max-w-3xl space-y-2">
            <p className="leading-relaxed">{regulatoryText}</p>
            <p className="leading-normal flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                © {COMPANY_IDENTITY.copyrightYear}{" "}
                {COMPANY_IDENTITY.companyName}
                {" · "}
                {COMPANY_IDENTITY.address}
              </span>
              {LEGAL_LINKS.map((legal) => (
                <React.Fragment key={legal.href}>
                  <span aria-hidden="true">·</span>
                  <Link
                    href={legal.href}
                    className="hover:text-accent hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm py-0.5"
                  >
                    {legal.label}
                  </Link>
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* Payment Badges */}
          <div
            role="region"
            aria-label="Accepted payment methods"
            className="flex items-center gap-1.5 flex-wrap shrink-0"
          >
            {PAYMENT_METHODS.map((badge) => (
              <span
                key={badge}
                className="border border-fg/25 rounded-md px-2 py-1 text-[10px] font-bold tracking-wider text-fg/80 uppercase select-none"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
