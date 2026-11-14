import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AccountDashboardView } from "./view-model";
import { signOutAction, skipNextDeliveryAction } from "./actions";

const NAV_ITEMS = [
  { label: "Overview", href: "/account", current: true },
  { label: "Orders", href: "/account/orders", current: false },
  { label: "Subscriptions", href: "/account/subscriptions", current: false },
  { label: "Addresses", href: "/account/settings", current: false },
  { label: "Profile", href: "/account/settings", current: false },
] as const;

const EYEBROW = "text-xs font-bold uppercase tracking-[0.12em] text-accent";
const CARD =
  "rounded-card border border-border bg-bg-elevated p-6 lg:p-7 flex flex-col";
const BADGE =
  "inline-flex items-center gap-1.5 rounded-pill border border-accent px-3 py-1 text-xs font-bold text-accent whitespace-nowrap";
const BIG_NUMBER =
  "font-archivo font-extrabold uppercase leading-[0.95] text-[34px] text-fg";

function items(count: number): string {
  return `${count} ${count === 1 ? "item" : "items"}`;
}

export function AccountDashboard({ view }: { view: AccountDashboardView }) {
  const { nextDelivery, recentOrder, activeSubscriptions } = view;

  return (
    <div className="px-5 pt-6 pb-16 lg:px-[72px] lg:pt-11 lg:pb-[90px]">
      <p className="text-xs text-fg-muted">Account / Overview</p>
      <h1 className="font-archivo font-extrabold uppercase leading-[0.95] text-[30px] lg:text-[48px] mt-2 mb-6 lg:mb-9 tracking-[-0.01em]">
        My account
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <aside className="rounded-card border border-border bg-bg-elevated p-4 lg:w-[260px] lg:shrink-0 lg:p-5">
          <div className="flex items-center gap-3 border-b border-border px-2.5 pb-4 mb-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-archivo font-extrabold text-accent-fg"
            >
              {view.initial}
            </span>
            <p className="font-bold">{view.fullName}</p>
          </div>

          <nav aria-label="Account">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold lg:rounded-field lg:px-4 ${
                      item.current
                        ? "bg-accent/10 text-accent lg:shadow-[inset_3px_0_0_var(--accent)]"
                        : "text-fg/80 hover:text-accent"
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form
            action={signOutAction}
            className="mt-3 border-t border-border pt-3"
          >
            <Button type="submit" variant="link" size="default">
              Sign out
            </Button>
          </form>

          <div className="mt-4 rounded-field border border-dashed border-border p-4 text-sm text-fg-muted">
            <p>Need help?</p>
            <Link
              href="/help#contact"
              className="font-bold text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Contact us
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <h2 className="font-archivo font-extrabold uppercase leading-[0.95] text-[26px] lg:text-[34px] text-fg">
            Hi, {view.firstName}
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
            {nextDelivery && (
              <section aria-labelledby="next-delivery-title" className={CARD}>
                <div className="flex items-start justify-between gap-2.5">
                  <h3 id="next-delivery-title" className={EYEBROW}>
                    Next delivery
                  </h3>
                  <span className={BADGE}>Active</span>
                </div>
                <p className={`${BIG_NUMBER} mt-3`}>{nextDelivery.dateLabel}</p>
                {nextDelivery.shipsTo && (
                  <p className="mt-1.5 text-sm text-fg-muted">
                    Ships to {nextDelivery.shipsTo}
                  </p>
                )}

                <ul className="mt-5 flex flex-col gap-3">
                  {nextDelivery.lines.map((line) => (
                    <li
                      key={line.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold">{line.title}</p>
                        <p className="text-sm text-fg-muted">
                          Qty {line.quantity}
                        </p>
                      </div>
                      <p className="font-bold">{line.priceLabel}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-fg-muted">Delivery total</span>
                  <span className="text-lg font-extrabold">
                    {nextDelivery.totalLabel}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {view.canSkip && (
                    <form action={skipNextDeliveryAction}>
                      <input
                        type="hidden"
                        name="subscriptionId"
                        value={nextDelivery.subscriptionId}
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        Skip this delivery
                      </Button>
                    </form>
                  )}
                  {view.canReschedule && (
                    <Button
                      href="/account/subscriptions"
                      variant="secondary"
                      size="sm"
                    >
                      Change date
                    </Button>
                  )}
                  {view.canEditItems && (
                    <Button
                      href="/account/subscriptions"
                      variant="secondary"
                      size="sm"
                    >
                      Edit items
                    </Button>
                  )}
                </div>
              </section>
            )}

            <div className="flex flex-col gap-6">
              <section aria-labelledby="subscriptions-title" className={CARD}>
                <h3 id="subscriptions-title" className={EYEBROW}>
                  Active subscriptions
                </h3>
                <p className={`${BIG_NUMBER} mt-3`}>
                  {activeSubscriptions.length}
                </p>
                {activeSubscriptions.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1 text-sm text-fg-muted">
                    {activeSubscriptions.map((sub) => (
                      <li key={sub.id}>
                        {sub.title} · every {sub.intervalDays} days
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href="/account/subscriptions"
                  className="mt-4 self-start text-sm font-bold text-accent underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Manage subscriptions →
                </Link>
              </section>

              {recentOrder && (
                <section aria-labelledby="recent-order-title" className={CARD}>
                  <div className="flex items-start justify-between gap-2.5">
                    <h3 id="recent-order-title" className={EYEBROW}>
                      Recent order
                    </h3>
                    <span className={BADGE}>{recentOrder.statusLabel}</span>
                  </div>
                  <p className="mt-3 font-bold">{recentOrder.firstTitle}</p>
                  <p className="text-sm text-fg-muted">
                    Order {recentOrder.orderNumber}
                  </p>
                  <p className="text-sm text-fg-muted">
                    {items(recentOrder.itemCount)} · {recentOrder.totalLabel}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <Button
                      href={`/account/orders/${recentOrder.id}`}
                      variant="secondary"
                      size="sm"
                    >
                      View order
                    </Button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
