"use client";

import { openConsentSettings } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="inline-flex min-h-11 items-center rounded-sm underline underline-offset-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      Cookie settings
    </button>
  );
}
