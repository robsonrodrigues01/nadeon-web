import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { accountProvider, subscriptionProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import { getDefaultMarket, getMarket } from "@/lib/market/markets";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { AccountNav } from "../../_components/account-nav";
import { CancelSteps } from "../../_components/cancel-steps";
import { formatShortDate, productTitle } from "../../_components/format";

export const metadata = buildMetadata({
  title: "Cancel subscription | Nadeon Labs",
  pathname: "/account/subscriptions",
  noIndex: true,
});

interface CancelPageProps {
  params: Promise<{ id: string }>;
}

const STEPS = ["Reason", "Offers", "Confirm"] as const;

export default async function CancelSubscriptionPage({
  params,
}: CancelPageProps) {
  const { id } = await params;
  const session = await accountProvider.getSession();
  if (!session) {
    redirect(
      await accountProvider.signInUrl(
        `/account/subscriptions/${encodeURIComponent(id)}/cancel`
      )
    );
  }

  const [subscription, capabilities, customer] = await Promise.all([
    subscriptionProvider.get(id),
    subscriptionProvider.capabilities(),
    accountProvider.getCustomer(),
  ]);
  if (!subscription || subscription.status === "cancelled") {
    notFound();
  }

  const market =
    getMarket((await cookies()).get(MARKET_COOKIE_NAME)?.value) ??
    getDefaultMarket();
  const title = productTitle(subscription.lines);
  const image = subscription.lines.find((line) => line.image)?.image;

  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1 bg-bg-elevated text-fg">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-12 md:py-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
              <li>
                <Link href="/account" className="underline underline-offset-4">
                  Account
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/account/subscriptions"
                  className="underline underline-offset-4"
                >
                  Subscriptions
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-fg">
                Cancel subscription
              </li>
            </ol>
          </nav>

          <h1 className="font-archivo text-4xl font-extrabold uppercase leading-none text-fg md:text-5xl">
            Cancel subscription
          </h1>

          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <AccountNav current="subscriptions" customer={customer} />

            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <Link
                href="/account/subscriptions"
                className="text-sm font-bold text-fg-muted underline underline-offset-4"
              >
                ← Back to subscriptions
              </Link>

              <div className="flex items-center gap-4 rounded-card bg-bg p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-card bg-gradient-sunrise">
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-fg">
                    {title} · every {subscription.intervalDays} days
                  </p>
                  <p className="text-sm text-fg-muted">
                    {formatMoneyWithMarket(subscription.estimatedTotal, market)}{" "}
                    per delivery · next charge{" "}
                    {formatShortDate(
                      subscription.nextBillingDate,
                      market.locale
                    )}
                  </p>
                </div>
              </div>

              <ol className="flex items-center gap-3 text-sm font-bold">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                        index === 0
                          ? "border-accent bg-gradient-gold text-accent-fg"
                          : "border-border text-fg-muted"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={index === 0 ? "text-fg" : "text-fg-muted"}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <CancelSteps
                subscription={subscription}
                capabilities={capabilities}
                locale={market.locale}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer line="human" />
    </>
  );
}
