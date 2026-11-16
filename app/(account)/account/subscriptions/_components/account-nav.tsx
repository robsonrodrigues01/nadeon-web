import Link from "next/link";
import type { CustomerProfile } from "@/lib/contracts/account";
import { customerInitial } from "./format";
import { signOutAccount } from "./subscription-actions";

export type AccountSection =
  "overview" | "orders" | "subscriptions" | "addresses" | "profile" | "rewards";

const SECTIONS: { key: AccountSection; label: string; href: string }[] = [
  { key: "overview", label: "Overview", href: "/account" },
  { key: "orders", label: "Orders", href: "/account/orders" },
  {
    key: "subscriptions",
    label: "Subscriptions",
    href: "/account/subscriptions",
  },
  { key: "addresses", label: "Addresses", href: "/account/profile#addresses" },
  { key: "profile", label: "Profile", href: "/account/profile" },
  { key: "rewards", label: "Rewards", href: "/rewards" },
];

interface AccountNavProps {
  current: AccountSection;
  customer: CustomerProfile | null;
}

const itemBase =
  "flex min-h-11 shrink-0 items-center gap-3 rounded-full border border-border px-4 py-2 text-sm font-bold lg:rounded-card lg:border-0 lg:py-3 lg:text-base";

/**
 * Account navigation: a horizontal pill row on mobile, a sidebar on desktop.
 * One list serves both layouts, so every link exists once in the DOM.
 */
export function AccountNav({ current, customer }: AccountNavProps) {
  return (
    <aside className="flex w-full flex-col gap-4 lg:w-64 lg:shrink-0">
      {customer ? (
        <div className="hidden items-center gap-3 border-b border-border pb-4 md:flex">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-bold text-accent-fg"
          >
            {customerInitial(customer.firstName)}
          </span>
          <p className="font-bold text-fg">
            {customer.firstName} {customer.lastName}
          </p>
        </div>
      ) : null}

      <nav aria-label="Account">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {SECTIONS.map((section) => {
            const isCurrent = section.key === current;
            return (
              <li key={section.key}>
                <Link
                  href={section.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`${itemBase} ${
                    isCurrent
                      ? "border-accent bg-accent/10 text-accent md:shadow-none"
                      : "text-fg opacity-80"
                  }`}
                >
                  {section.label}
                </Link>
              </li>
            );
          })}
          <li className="md:mt-4 md:border-t md:border-border md:pt-4">
            <form action={signOutAccount}>
              <button
                type="submit"
                className={`${itemBase} w-full text-fg opacity-60 md:w-auto`}
              >
                Sign out
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
