import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { MARKET_COOKIE_NAME } from "@/lib/market";
import { AccountOrdersShell } from "./_components/account-orders-shell";
import { OrdersBrowser } from "./_components/orders-browser";
import {
  createOrderFormatters,
  resolveOrderMarket,
} from "./_components/order-market";
import { toOrderRowView } from "./_components/order-view";

export const metadata = buildMetadata({
  title: "Orders | Nadeon Labs",
  pathname: "/account/orders",
  noIndex: true,
});

export default async function AccountOrdersPage() {
  const session = await accountProvider.getSession();
  if (!session) {
    redirect(await accountProvider.signInUrl("/account/orders"));
  }

  const marketId = (await cookies()).get(MARKET_COOKIE_NAME)?.value;
  const formatters = createOrderFormatters(resolveOrderMarket(marketId));

  const [customer, orders] = await Promise.all([
    accountProvider.getCustomer(),
    accountProvider.getOrders(),
  ]);

  const rows = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((order) => toOrderRowView(order, formatters));

  return (
    <AccountOrdersShell customer={customer} currentPath="/account/orders">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
          <li>
            <Link href="/account" className="underline underline-offset-4">
              Account
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            Orders
          </li>
        </ol>
      </nav>

      <header className="mt-3 mb-8 flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-fg md:text-5xl">
          Orders
        </h1>
        <p className="text-base text-fg-muted">
          Track shipments, find lot numbers and reorder in one tap.
        </p>
      </header>

      <OrdersBrowser rows={rows} />
    </AccountOrdersShell>
  );
}
