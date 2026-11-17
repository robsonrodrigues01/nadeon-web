// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import SharedLayout from "@/app/(shared)/layout";
import { ConsentProvider, writeCookie } from "@/lib/consent";
import { OrderLookup } from "@/app/(shared)/track/_components/order-lookup";
import { TrackResult } from "@/app/(shared)/track/_components/track-result";
import { DEFAULT_MARKET } from "@/lib/market";
import { GuestOrderTrackingSchema } from "@/lib/contracts/account";

describe("W4-26 accessible cookie controls and order lookup states", () => {
  beforeEach(() => {
    document.cookie = "nadeon_consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("revokes optional consent from an accessible footer button", async () => {
    writeCookie(
      "nadeon_consent",
      JSON.stringify({
        version: "1.0",
        timestamp: "2026-11-17T12:00:00.000Z",
        country: "DE",
        explicit: true,
        preferences: { necessary: true, analytics: true, marketing: true },
      })
    );
    render(
      <SharedLayout>
        <Footer />
      </SharedLayout>
    );

    const button = screen.getByRole("button", { name: "Cookie settings" });
    expect(button.tagName).toBe("BUTTON");
    fireEvent.click(button);

    expect(await screen.findByRole("dialog")).toBeDefined();
    fireEvent.click(screen.getByLabelText("Analytics Cookies"));
    fireEvent.click(screen.getByLabelText("Marketing Cookies"));
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    const savedConsent = decodeURIComponent(document.cookie);
    expect(savedConsent).toContain('"analytics":false');
    expect(savedConsent).toContain('"marketing":false');
  });

  it("returns focus to main content when the consent banner closes", async () => {
    render(
      <ConsentProvider initialCountry="DE">
        <main id="main-content" tabIndex={-1}>
          Main content
        </main>
        <CookieBanner />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Accept all" }));

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("main"));
    });
  });

  it("announces lookup errors as alerts", () => {
    render(
      <OrderLookup signInHref="/account" errorMessage="No order found." />
    );

    expect(screen.getByRole("alert").textContent).toBe("No order found.");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("keeps successful order results announced as status", () => {
    const order = GuestOrderTrackingSchema.parse({
      orderNumber: "TEST-NL-0001",
      createdAt: "2026-11-17T12:00:00.000Z",
      fulfillmentStatus: "delivered",
      items: [],
    });
    render(<TrackResult order={order} market={DEFAULT_MARKET} />);

    expect(screen.getByRole("status").textContent).toContain("TEST-NL-0001");
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
