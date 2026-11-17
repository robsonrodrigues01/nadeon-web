import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { accountProvider, petProfileProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { signOutAction } from "../settings/_components/actions";
import { PetProfileManager } from "./_components/pet-profile-manager";

export const metadata: Metadata = buildMetadata({
  title: "My pets | Nadeon Labs",
  pathname: "/account/pets",
  noIndex: true,
});

const navLinks = [
  ["Overview", "/account"],
  ["Orders", "/account/orders"],
  ["Subscriptions", "/account/subscriptions"],
  ["My pets", "/account/pets"],
  ["Addresses", "/account/settings#addresses"],
  ["Profile", "/account/settings"],
] as const;

export default async function AccountPetsPage() {
  const session = await accountProvider.getSession();
  const customer = session ? await accountProvider.getCustomer() : null;
  if (!session || !customer || session.customerId !== customer.id) {
    redirect(await accountProvider.signInUrl("/account/pets"));
  }

  const pets = await petProfileProvider.getPets();

  return (
    <>
      <AnnouncementBar line="pet" />
      <Header variant="pet" />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-[1280px] flex-1 px-5 pb-16 pt-7 sm:px-8 sm:pt-10 lg:px-[72px]"
      >
        <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/account"
                className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Account
              </Link>
            </li>
            <li aria-hidden="true" className="flex items-center">
              /
            </li>
            <li aria-current="page" className="flex min-h-11 items-center">
              My pets
            </li>
          </ol>
        </nav>

        <h1 className="mt-2 font-archivo text-3xl font-extrabold uppercase leading-none sm:text-5xl">
          My pets
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-muted sm:text-base">
          Save each pet. Recommendations: To be confirmed.
        </p>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <aside className="w-full shrink-0 rounded-card border border-border bg-bg-elevated p-4 lg:w-60">
            <p className="border-b border-border px-2 pb-4 font-bold">
              {customer.firstName} {customer.lastName}
            </p>
            <nav aria-label="Account" className="mt-3">
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {navLinks.map(([label, href]) => {
                  const current = label === "My pets";
                  return (
                    <li key={label}>
                      <Link
                        href={href}
                        aria-current={current ? "page" : undefined}
                        className={`inline-flex min-h-11 items-center rounded-field px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${current ? "bg-fg text-bg" : "text-fg/80 hover:bg-border/20 hover:text-fg"}`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <form
              action={signOutAction}
              className="mt-3 border-t border-border pt-3"
            >
              <button
                type="submit"
                className="inline-flex min-h-11 items-center px-4 text-sm font-bold text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Sign out
              </button>
            </form>
          </aside>
          <div className="min-w-0 flex-1">
            <PetProfileManager pets={pets} />
          </div>
        </div>
      </main>
      <Footer line="pet" />
    </>
  );
}
