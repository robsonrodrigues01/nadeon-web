import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { accountProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { MARKET_COOKIE_NAME } from "@/lib/market";
import { AccountOrdersShell } from "../_components/account-orders-shell";
import { OrderDetailView } from "../_components/order-detail-view";
import {
  createOrderFormatters,
  resolveOrderMarket,
} from "../_components/order-market";
import { toOrderDetailView } from "../_components/order-view";

export const metadata = buildMetadata({
  title: "Order details | Nadeon Labs",
  pathname: "/account/orders",
  noIndex: true,
});

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await accountProvider.getSession();
  if (!session) {
    redirect(await accountProvider.signInUrl("/account/orders"));
  }

  const { id } = await params;
  const marketId = (await cookies()).get(MARKET_COOKIE_NAME)?.value;
  const formatters = createOrderFormatters(resolveOrderMarket(marketId));

  const [customer, order] = await Promise.all([
    accountProvider.getCustomer(),
    accountProvider.getOrder(id),
  ]);
  if (!order) {
    notFound();
  }

  return (
    <AccountOrdersShell customer={customer} currentPath="/account/orders">
      <OrderDetailView order={toOrderDetailView(order, formatters)} />
    </AccountOrdersShell>
  );
}
