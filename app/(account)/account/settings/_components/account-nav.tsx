import Link from "next/link";
import { signOutAction } from "./actions";

const NAV_LINKS = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Subscriptions", href: "/account/subscriptions" },
  { label: "Addresses", href: "#addresses" },
  { label: "Profile", href: "/account/settings" },
] as const;

const LINK_CLASS =
  "flex min-h-11 items-center rounded-field px-4 text-sm font-bold text-fg/85 transition-colors hover:bg-border/20 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export interface AccountNavProps {
  firstName: string;
  lastName: string;
}

export function AccountNav({ firstName, lastName }: AccountNavProps) {
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <aside className="w-full shrink-0 lg:w-[260px]">
      <div className="rounded-card border border-border bg-bg-elevated p-4">
        <div className="flex items-center gap-3 border-b border-border px-2.5 pb-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-heading text-lg font-extrabold text-accent-fg"
          >
            {initial}
          </span>
          <p className="font-bold text-fg">
            {firstName} {lastName}
          </p>
        </div>

        <nav aria-label="Account" className="mt-3">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {NAV_LINKS.map((link) => {
              const current = link.label === "Profile";
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={
                      current
                        ? `${LINK_CLASS} bg-accent/10 text-accent shadow-[inset_3px_0_0_var(--accent)]`
                        : LINK_CLASS
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <form
          action={signOutAction}
          className="mt-2 border-t border-border pt-2"
        >
          <button type="submit" className={`${LINK_CLASS} w-full opacity-70`}>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
