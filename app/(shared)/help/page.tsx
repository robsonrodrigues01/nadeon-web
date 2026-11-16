import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "./_components/contact-form";
import { TrackForm } from "./_components/track-form";

export const metadata: Metadata = buildMetadata({
  title: "Help | Nadeon Labs",
  description: "Send us a message or track your order.",
  pathname: "/help",
});

// Assuntos do formulário: os mesmos abas de FAQ do catálogo (seção 5.7).
const TOPICS = [
  "Products",
  "Orders & Shipping",
  "Subscriptions",
  "Pets",
  "Quality",
] as const;

const POPULAR_LINKS = [
  {
    label: "Shipping & returns",
    href: "/shipping-returns",
    description: "Rates, times and our 60-day guarantee",
  },
  {
    label: "Manage subscription",
    href: "/faq",
    description: "Skip, pause or cancel",
  },
  {
    label: "Lab results",
    href: "/lab-results",
    description: "Find the COA for your lot",
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Quick answers by topic",
  },
] as const;

const linkButtonClass =
  "inline-flex min-h-11 items-center rounded-full border border-border px-5 font-bold text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default function HelpPage() {
  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <header className="max-w-2xl">
            <h1 className="font-archivo text-3xl font-bold text-fg sm:text-4xl">
              How can we help?
            </h1>
            <p className="mt-3 text-base text-fg-muted">
              Send us a message or track your order below. For quick answers,
              try the{" "}
              <Link
                href="/faq"
                className="font-bold text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                FAQ →
              </Link>{" "}
              first.
            </p>
            <nav
              aria-label="Help sections"
              className="mt-6 flex flex-wrap gap-3"
            >
              <Link href="#contact" className={linkButtonClass}>
                <span aria-hidden="true">↓</span>&nbsp;Contact us
              </Link>
              <Link href="#track" className={linkButtonClass}>
                <span aria-hidden="true">↓</span>&nbsp;Track your order
              </Link>
            </nav>
          </header>

          <div className="mt-12 grid scroll-mt-24 gap-8 lg:grid-cols-2">
            <section
              id="contact"
              aria-labelledby="contact-heading"
              className="scroll-mt-24 rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Contact us
              </p>
              <h2
                id="contact-heading"
                className="mt-2 font-archivo text-2xl font-bold text-fg"
              >
                Talk to a real person
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                Questions about a formula, your order or your pet? Our small
                team in Clifton, NJ reads every message.
              </p>
              <ContactForm topics={TOPICS} />
            </section>

            <section
              id="track"
              aria-labelledby="track-heading"
              className="scroll-mt-24 rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Track your order
              </p>
              <h2
                id="track-heading"
                className="mt-2 font-archivo text-2xl font-bold text-fg"
              >
                Where is my order?
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                Enter your order number and the email you used at checkout.
              </p>
              <TrackForm />
              <p className="mt-6 text-sm text-fg-muted">
                Your order number is in your confirmation email and starts with
                NL.
              </p>
            </section>
          </div>

          <section aria-labelledby="more-help-heading" className="mt-14">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              More help
            </p>
            <h2
              id="more-help-heading"
              className="mt-2 font-archivo text-xl font-bold text-fg"
            >
              Popular links
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {POPULAR_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex min-h-11 flex-col gap-1 rounded-card border border-border p-5 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="font-bold text-fg">
                      {link.label}{" "}
                      <span aria-hidden="true" className="text-accent">
                        →
                      </span>
                    </span>
                    <span className="text-sm text-fg-muted">
                      {link.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link
                href="#contact"
                className="inline-flex min-h-11 items-center font-bold text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                Report a problem
              </Link>
            </p>
          </section>
        </div>
      </main>

      <TrustStrip line="human" />
      <Newsletter variant="human" />
      <Footer line="human" />
    </>
  );
}
