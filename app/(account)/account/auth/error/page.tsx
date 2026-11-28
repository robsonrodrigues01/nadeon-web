import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign-in error | Nadeon Labs",
  pathname: "/account/auth/error",
  noIndex: true,
});

export default function AccountAuthErrorPage() {
  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center bg-bg px-5 py-16 font-sans text-fg sm:px-8"
      >
        <div className="max-w-[560px] text-center">
          <h1 className="font-heading text-[32px] font-extrabold uppercase leading-[0.98] tracking-[-0.01em] sm:text-[44px]">
            We couldn&apos;t sign you in
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-fg/80 sm:text-[18px]">
            Your sign-in link expired or could not be verified. Request a fresh
            code to continue to your account.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/account"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-fg px-7 py-3 text-[16px] font-bold text-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Try again
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-6 py-2.5 text-[16px] font-bold text-fg transition-colors hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer line="human" />
    </>
  );
}
