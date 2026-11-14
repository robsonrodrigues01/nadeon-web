import type { Address } from "@/lib/contracts/account";
import type {
  Subscription,
  SubscriptionLineItem,
} from "@/lib/contracts/subscription";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Subscriptions cancelled earlier are not listed on the account page. */
export function listedSubscriptions(subscriptions: Subscription[]) {
  return subscriptions.filter((sub) => sub.status !== "cancelled");
}

export function formatShortDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

/** Lowest allowed interval longer than the current one, if the provider offers any. */
export function nextLongerInterval(
  current: number,
  allowed: number[]
): number | undefined {
  return allowed.filter((days) => days > current).sort((a, b) => a - b)[0];
}

export function shipsTo(address?: Address): string | undefined {
  const label = [address?.city, address?.province].filter(Boolean).join(", ");
  return label || undefined;
}

export function productTitle(lines: SubscriptionLineItem[]): string {
  return lines.map((line) => line.productTitle).join(" + ");
}

export function totalQuantity(lines: SubscriptionLineItem[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function customerInitial(firstName: string): string {
  return firstName.trim().charAt(0).toUpperCase();
}
