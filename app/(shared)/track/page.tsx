import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { accountProvider, getLiveProviderKeys } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { DEFAULT_MARKET, getMarket, MARKET_COOKIE_NAME } from "@/lib/market";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Footer } from "@/components/layout/footer";
import { ShopifyOrderStatusNotice } from "./_components/shopify-order-status-notice";
import { TrackView } from "./_components/track-view";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Track your order | Nadeon Labs",
    pathname: "/track",
    noIndex: true,
  });
}

const HELP_LINKS = [
  {
    label: "Shipping & returns",
    href: "/shipping-returns",
    description: "Rates, delivery times and our 60-day guarantee",
  },
  {
    label: "Subscription help",
    href: "/faq",
    description: "Skip, pause, swap or cancel",
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

interface TrackOrderPageProps {
  searchParams?: Promise<{
    orderNumber?: string;
  }>;
}

export default async function TrackOrderPage({
  searchParams,
}: TrackOrderPageProps = {}) {
  const params = searchParams ? await searchParams : undefined;
  const rawOrderNumber = params?.orderNumber?.trim();

  const cookieStore = await cookies();
  const marketId = cookieStore.get(MARKET_COOKIE_NAME)?.value;
  const market = getMarket(marketId) ?? DEFAULT_MARKET;

  const isLive = getLiveProviderKeys().has("account");
  const signInHref = await accountProvider.signInUrl(
    isLive ? "/account/orders" : "/track"
  );

  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
              <li>
                <Link
                  href="/help"
                  className="inline-flex min-h-11 items-center rounded-sm hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Help
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-bold text-fg">
                Track your order
              </li>
            </ol>
          </nav>

          <header className="mt-6 max-w-2xl">
            <h1 className="font-archivo text-4xl sm:text-5xl lg:text-7xl font-extrabold uppercase tracking-tight text-fg leading-none">
              Track your order
            </h1>
            <p className="mt-3 text-base text-fg-muted">
              {isLive
                ? "Your order status page is on Shopify. No account needed."
                : "No account needed. Enter your order number and the email you used at checkout."}
            </p>
          </header>

          <div className="mt-10">
            {isLive ? (
              <section
                aria-labelledby="shopify-status-heading"
                className="max-w-2xl rounded-card border border-border p-6 sm:p-8"
              >
                <h2
                  id="shopify-status-heading"
                  className="font-archivo text-xl font-bold text-fg"
                >
                  Find your order status
                </h2>
                <div className="mt-5">
                  <ShopifyOrderStatusNotice signInHref={signInHref} />
                </div>
              </section>
            ) : (
              <TrackView
                signInHref={signInHref}
                market={market}
                initialOrderNumber={rawOrderNumber}
              />
            )}
          </div>

          <section aria-labelledby="help-links-heading" className="mt-14">
            <h2
              id="help-links-heading"
              className="font-archivo text-xl font-bold text-fg"
            >
              Popular help links
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {HELP_LINKS.map((link) => (
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
          </section>
        </div>
      </main>

      <TrustStrip line="human" />
      <Footer line="human" />
    </>
  );
}
