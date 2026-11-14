import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountProvider, subscriptionProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import { getDefaultMarket, getMarket } from "@/lib/market/markets";
import { AccountNav } from "./_components/account-nav";
import { SubscriptionCard } from "./_components/subscription-card";
import { listedSubscriptions } from "./_components/format";

export const metadata = buildMetadata({
  title: "Subscriptions | Nadeon Labs",
  pathname: "/account/subscriptions",
  noIndex: true,
});

const SELF_PATH = "/account/subscriptions";

export default async function SubscriptionsPage() {
  const session = await accountProvider.getSession();
  if (!session) {
    redirect(await accountProvider.signInUrl(SELF_PATH));
  }

  const [customer, subscriptions, capabilities] = await Promise.all([
    accountProvider.getCustomer(),
    subscriptionProvider.list(),
    subscriptionProvider.capabilities(),
  ]);
  const market =
    getMarket((await cookies()).get(MARKET_COOKIE_NAME)?.value) ??
    getDefaultMarket();

  const listed = listedSubscriptions(subscriptions);
  const activeCount = listed.filter((sub) => sub.status === "active").length;

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
              <li aria-current="page" className="text-fg">
                Subscriptions
              </li>
            </ol>
          </nav>

          <header className="flex flex-col gap-2">
            <h1 className="font-archivo text-4xl font-extrabold uppercase leading-none text-fg md:text-5xl">
              Subscriptions
            </h1>
            <p className="text-base text-fg-muted">
              {activeCount} active {activeCount === 1 ? "plan" : "plans"}.
              Change anything before the next charge.
            </p>
          </header>

          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <AccountNav current="subscriptions" customer={customer} />

            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <p className="rounded-card border border-accent/40 bg-accent/10 px-5 py-4 text-sm text-fg">
                We email you 3 days before every charge. Changes made before
                then apply to that delivery.
              </p>

              {listed.length > 0 ? (
                <ul className="flex flex-col gap-6">
                  {listed.map((subscription) => (
                    <li key={subscription.id}>
                      <SubscriptionCard
                        subscription={subscription}
                        capabilities={capabilities}
                        market={market}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}

              <section
                aria-labelledby="add-to-box"
                className="flex flex-col gap-4 rounded-card border-2 border-dashed border-border p-5 md:flex-row md:items-center md:justify-between md:p-7"
              >
                <div className="flex flex-col gap-2">
                  <h2
                    id="add-to-box"
                    className="font-archivo text-xl font-extrabold text-fg"
                  >
                    Add a product to your next box
                  </h2>
                  <p className="text-sm text-fg-muted">
                    It ships with your next delivery. No extra shipping.
                  </p>
                </div>
                <Button href="/human/shop" variant="primary">
                  Browse formulas
                </Button>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer line="human" />
    </>
  );
}
