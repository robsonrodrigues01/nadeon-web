import Link from "next/link";
import type { CustomerProfile } from "@/lib/contracts/account";
import { cn } from "@/lib/utils";

const ACCOUNT_NAV = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Subscriptions", href: "/account/subscriptions" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Profile", href: "/account/profile" },
  { label: "Rewards", href: "/rewards" },
];

export interface AccountSidebarProps {
  customer: CustomerProfile | null;
  currentPath: string;
}

export function AccountSidebar({ customer, currentPath }: AccountSidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-[260px]" aria-label="Account">
      <div className="flex flex-col gap-3 rounded-card border border-border bg-bg-elevated p-4 lg:p-5">
        {customer && (
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-gold text-base font-extrabold text-accent-fg"
            >
              {customer.firstName.charAt(0).toUpperCase()}
            </span>
            <p className="font-bold text-fg">
              {customer.firstName} {customer.lastName}
            </p>
          </div>
        )}
        <nav aria-label="Account sections">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {ACCOUNT_NAV.map((item) => {
              const isCurrent = item.href === currentPath;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-3 rounded-field px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isCurrent
                        ? "bg-accent/10 text-accent"
                        : "text-fg/80 hover:text-fg"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
