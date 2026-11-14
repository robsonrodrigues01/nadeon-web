import type {
  CustomerProfile,
  FulfillmentStatus,
  Order,
} from "@/lib/contracts/account";
import type { Money } from "@/lib/contracts/catalog";
import type {
  Subscription,
  SubscriptionCapabilities,
} from "@/lib/contracts/subscription";
import { formatMoneyWithMarket, type Market } from "@/lib/market";

export const FULFILLMENT_LABELS: Record<FulfillmentStatus, string> = {
  processing: "Processing",
  in_transit: "In transit",
  delivered: "Delivered",
};

export interface NextDeliveryLine {
  id: string;
  title: string;
  quantity: number;
  priceLabel: string;
}

export interface NextDelivery {
  subscriptionId: string;
  dateLabel: string;
  shipsTo: string | null;
  lines: NextDeliveryLine[];
  totalLabel: string;
}

export interface ActiveSubscriptionItem {
  id: string;
  title: string;
  intervalDays: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  statusLabel: string;
  firstTitle: string;
  itemCount: number;
  totalLabel: string;
}

export interface AccountDashboardView {
  firstName: string;
  fullName: string;
  initial: string;
  nextDelivery: NextDelivery | null;
  activeSubscriptions: ActiveSubscriptionItem[];
  recentOrder: RecentOrder | null;
  canSkip: boolean;
  canReschedule: boolean;
  canEditItems: boolean;
}

export interface BuildAccountDashboardInput {
  customer: CustomerProfile;
  subscriptions: Subscription[];
  orders: Order[];
  capabilities: SubscriptionCapabilities;
  market: Market;
}

function money(value: Money, market: Market): string {
  return formatMoneyWithMarket(value, market);
}

function dateLabel(iso: string, market: Market): string {
  return new Intl.DateTimeFormat(market.locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/**
 * Converts provider data into what the dashboard shows.
 * Prices always go through formatMoneyWithMarket (rule 14).
 * Data the contracts do not carry (rewards, referral link, Reorder) is not built here.
 */
export function buildAccountDashboard({
  customer,
  subscriptions,
  orders,
  capabilities,
  market,
}: BuildAccountDashboardInput): AccountDashboardView {
  const active = subscriptions
    .filter((s) => s.status === "active")
    .sort((a, b) => a.nextBillingDate.localeCompare(b.nextBillingDate));

  const [soonest] = active;
  const nextDelivery: NextDelivery | null = soonest
    ? {
        subscriptionId: soonest.id,
        dateLabel: dateLabel(soonest.nextBillingDate, market),
        shipsTo: soonest.deliveryAddress?.province
          ? `${soonest.deliveryAddress.city}, ${soonest.deliveryAddress.province}`
          : (soonest.deliveryAddress?.city ?? null),
        lines: soonest.lines.map((line) => ({
          id: line.id,
          title: line.productTitle,
          quantity: line.quantity,
          priceLabel: money(line.price, market),
        })),
        totalLabel: money(soonest.estimatedTotal, market),
      }
    : null;

  const latest = [...orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  )[0];
  const recentOrder: RecentOrder | null = latest
    ? {
        id: latest.id,
        orderNumber: latest.orderNumber,
        statusLabel: FULFILLMENT_LABELS[latest.fulfillmentStatus],
        firstTitle: latest.items[0]?.title ?? "",
        itemCount: latest.items.reduce((sum, item) => sum + item.quantity, 0),
        totalLabel: money(latest.total, market),
      }
    : null;

  const fullName = `${customer.firstName} ${customer.lastName}`.trim();

  return {
    firstName: customer.firstName,
    fullName,
    initial: customer.firstName.charAt(0).toUpperCase(),
    nextDelivery,
    activeSubscriptions: active.map((s) => ({
      id: s.id,
      title: s.lines[0]?.productTitle ?? "",
      intervalDays: s.intervalDays,
    })),
    recentOrder,
    canSkip: capabilities.canSkip,
    canReschedule: capabilities.canReschedule,
    canEditItems: capabilities.canChangeQuantity || capabilities.canSwapProduct,
  };
}
