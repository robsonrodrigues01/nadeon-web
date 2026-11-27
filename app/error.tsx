"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen flex items-center justify-center bg-bg text-fg font-sans px-5 sm:px-8 py-16"
    >
      <div className="max-w-[600px] text-center">
        <h1 className="font-heading font-extrabold text-[34px] sm:text-[48px] leading-[0.95] tracking-[-0.01em] uppercase">
          Something went wrong
        </h1>
        <p className="mt-4 text-[15px] sm:text-[18px] leading-relaxed">
          We could not load this page right now. Please try again in a moment.
          Your cart is safe.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-fg text-bg rounded-full px-7 py-3 text-[16px] font-bold min-h-[44px] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-opacity cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border-2 border-fg text-fg rounded-full px-6 py-2.5 text-[16px] font-bold min-h-[44px] hover:bg-fg/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
