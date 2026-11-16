import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountProvider, subscriptionProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { MARKET_COOKIE_NAME, getDefaultMarket, getMarket } from "@/lib/market";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountDashboard } from "./_components/dashboard-view";
import { buildAccountDashboard } from "./_components/view-model";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "My account | Nadeon Labs",
    pathname: "/account",
    noIndex: true,
  });
}

export default async function AccountPage() {
  const session = await accountProvider.getSession();
  const customer = session ? await accountProvider.getCustomer() : null;
  if (!customer) {
    redirect(await accountProvider.signInUrl("/account"));
  }

  // Mercado escolhido pelo cliente, lido do cookie para o SSR bater com o navegador.
  const marketId = (await cookies()).get(MARKET_COOKIE_NAME)?.value;
  const market = getMarket(marketId) ?? getDefaultMarket();

  const [subscriptions, orders, capabilities] = await Promise.all([
    subscriptionProvider.list(),
    accountProvider.getOrders(),
    subscriptionProvider.capabilities(),
  ]);

  const view = buildAccountDashboard({
    customer,
    subscriptions,
    orders,
    capabilities,
    market,
  });

  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <AccountDashboard view={view} />
      </main>

      <Footer line="human" />
    </>
  );
}
