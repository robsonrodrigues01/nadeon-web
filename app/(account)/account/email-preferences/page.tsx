import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { accountProvider, emailPreferencesProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { EmailPreferencesForm } from "./_components/email-preferences-form";

export const metadata: Metadata = buildMetadata({
  title: "Email preferences | Nadeon Labs",
  pathname: "/account/email-preferences",
  noIndex: true,
});

export default async function EmailPreferencesPage() {
  const session = await accountProvider.getSession();
  const customer = session ? await accountProvider.getCustomer() : null;
  if (!session || !customer || session.customerId !== customer.id) {
    redirect(await accountProvider.signInUrl("/account/email-preferences"));
  }

  const preferences = await emailPreferencesProvider.getPreferences();
  const theme =
    (await cookies()).get("nadeon_theme")?.value === "pet" ? "pet" : "human";
  const [localPart = "", domain = ""] = customer.email.split("@");
  const maskedEmail = `${localPart.slice(0, 1)}••••@${domain}`;

  return (
    <>
      <AnnouncementBar line={theme} />
      <Header variant={theme} />
      <main id="main-content" tabIndex={-1} className="flex-1 bg-bg text-fg">
        <header className="border-b border-border bg-bg-elevated px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-fg-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/account"
                    className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Account
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">Email preferences</li>
              </ol>
            </nav>
            <p className="text-sm text-fg-muted">Email preferences</p>
            <h1 className="mt-3 font-archivo text-4xl font-extrabold uppercase sm:text-6xl">
              Email preferences
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg-muted sm:text-lg">
              Choose what we send and how often. Update anytime.
            </p>
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
          <EmailPreferencesForm
            initialPreferences={preferences}
            maskedEmail={maskedEmail}
            shopHref={theme === "pet" ? "/pet" : "/human/shop"}
          />
        </div>
      </main>
      <Footer line={theme} />
    </>
  );
}
