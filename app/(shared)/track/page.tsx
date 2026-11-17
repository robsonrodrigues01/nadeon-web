import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { accountProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { DEFAULT_MARKET, getMarket, MARKET_COOKIE_NAME } from "@/lib/market";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Footer } from "@/components/layout/footer";
import { TrackView } from "./_components/track-view";
import { TrackOrderSchema } from "./_components/schema";
import type { Order } from "@/lib/contracts/account";

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
    email?: string;
  }>;
}

export default async function TrackOrderPage({
  searchParams,
}: TrackOrderPageProps = {}) {
  const params = searchParams ? await searchParams : undefined;
  const rawOrderNumber = params?.orderNumber?.trim();
  const rawEmail = params?.email?.trim();

  const cookieStore = await cookies();
  const marketId = cookieStore.get(MARKET_COOKIE_NAME)?.value;
  const market = getMarket(marketId) ?? DEFAULT_MARKET;

  let initialOrder: Order | null = null;
  let initialErrorMessage: string | undefined;

  // Suporte de compatibilidade para links com parâmetros e testes unitários existentes
  if (rawOrderNumber && rawEmail) {
    const parsed = TrackOrderSchema.safeParse({
      orderNumber: rawOrderNumber,
      email: rawEmail,
    });
    if (!parsed.success) {
      initialErrorMessage = "Check the order number and email.";
    } else {
      try {
        initialOrder = await accountProvider.lookupGuestOrder(
          parsed.data.orderNumber,
          parsed.data.email
        );
      } catch {
        initialErrorMessage = "Unable to look up your order. Please try again.";
      }
      if (!initialOrder && !initialErrorMessage) {
        initialErrorMessage =
          "No order found with that number and email. Please check your confirmation email.";
      }
    }
  }

  const signInHref = await accountProvider.signInUrl("/track");

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
              No account needed. Enter your order number and the email you used
              at checkout.
            </p>
          </header>

          <div className="mt-10">
            <TrackView
              signInHref={signInHref}
              market={market}
              initialOrder={initialOrder}
              initialErrorMessage={initialErrorMessage}
              initialOrderNumber={rawOrderNumber}
              initialEmail={rawEmail}
            />
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
