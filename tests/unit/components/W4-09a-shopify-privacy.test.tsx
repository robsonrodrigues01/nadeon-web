// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ConsentProvider, useConsent } from "@/lib/consent";
import { MeasurementScripts } from "@/components/layout/measurement-scripts";
import { CookieBanner } from "@/components/layout/cookie-banner";
import {
  createShopifyCustomerPrivacyMock,
  type ShopifyCustomerPrivacyMock,
} from "@/lib/consent/shopify-privacy";

vi.mock("next/script", () => ({
  default: ({
    id,
    src,
    children,
  }: {
    id?: string;
    src?: string;
    children?: string;
  }) => (
    <span data-testid="script" data-id={id} data-src={src}>
      {children}
    </span>
  ),
}));

function ConsentTestControls() {
  const { acceptAll, rejectNonEssential, updateConsent, resetConsent } =
    useConsent();
  return (
    <div>
      <button onClick={acceptAll}>Trigger Accept</button>
      <button onClick={rejectNonEssential}>Trigger Reject</button>
      <button
        onClick={() => updateConsent({ analytics: false, marketing: false })}
      >
        Trigger Revoke Both
      </button>
      <button onClick={resetConsent}>Trigger Reset</button>
    </div>
  );
}

describe("W4-09a Shopify Customer Privacy bridge", () => {
  let shopifyMock: ShopifyCustomerPrivacyMock;

  beforeEach(() => {
    shopifyMock = createShopifyCustomerPrivacyMock();
    (window as Window & { Shopify?: unknown }).Shopify = {
      customerPrivacy: shopifyMock,
    };
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
    vi.stubGlobal("location", { reload: vi.fn() });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    delete (window as Window & { Shopify?: unknown }).Shopify;
    delete (window as Window & { gtag?: unknown }).gtag;
    delete (window as Window & { clarity?: unknown }).clarity;
    delete (window as Window & { fbq?: unknown }).fbq;
  });

  it("does not call Shopify Customer Privacy API when environment variable is unset", () => {
    render(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
        <CookieBanner forceVisible={true} />
        <ConsentTestControls />
      </ConsentProvider>
    );

    // Click Accept All
    fireEvent.click(screen.getByRole("button", { name: /^accept all$/i }));
    expect(shopifyMock.history).toHaveLength(0);

    // Click Reject
    fireEvent.click(screen.getByText("Trigger Reject"));
    expect(shopifyMock.history).toHaveLength(0);

    // Click Revoke
    fireEvent.click(screen.getByText("Trigger Revoke Both"));
    expect(shopifyMock.history).toHaveLength(0);
  });

  it("calls setTrackingConsent with granted consent when user accepts cookies", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");

    render(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
        <CookieBanner forceVisible={true} />
      </ConsentProvider>
    );

    expect(shopifyMock.history).toHaveLength(0);

    // Accept via cookie banner
    fireEvent.click(screen.getByRole("button", { name: /accept all/i }));

    expect(shopifyMock.history).toHaveLength(1);
    expect(shopifyMock.currentConsent).toEqual({
      analytics: true,
      marketing: true,
      preferences: true,
      sale_of_data: true,
    });
    expect(shopifyMock.getTrackingConsent?.()).toBe("yes");
    expect(shopifyMock.userCanBeTracked?.()).toBe(true);
  });

  it("calls setTrackingConsent with denied consent when user rejects cookies", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");

    render(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
        <CookieBanner forceVisible={true} />
      </ConsentProvider>
    );

    expect(shopifyMock.history).toHaveLength(0);

    // Reject non-essential via cookie banner
    fireEvent.click(
      screen.getByRole("button", { name: /reject non-essential/i })
    );

    expect(shopifyMock.history).toHaveLength(1);
    expect(shopifyMock.currentConsent).toEqual({
      analytics: false,
      marketing: false,
      preferences: true,
      sale_of_data: false,
    });
    expect(shopifyMock.getTrackingConsent?.()).toBe("no");
    expect(shopifyMock.userCanBeTracked?.()).toBe(false);
  });

  it("calls setTrackingConsent when consent is revoked", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });

    render(
      <ConsentProvider
        initialCountry="GB"
        initialRecord={{
          version: "1.0",
          timestamp: "2026-11-17T00:00:00.000Z",
          country: "GB",
          explicit: true,
          preferences: { necessary: true, analytics: true, marketing: true },
        }}
      >
        <MeasurementScripts />
        <ConsentTestControls />
      </ConsentProvider>
    );

    // Initial mount with explicit consent syncs to Shopify
    expect(shopifyMock.history).toHaveLength(1);
    expect(shopifyMock.getTrackingConsent?.()).toBe("yes");

    // Revoke consent
    fireEvent.click(screen.getByText("Trigger Revoke Both"));

    expect(shopifyMock.history.length).toBeGreaterThanOrEqual(2);
    expect(shopifyMock.currentConsent).toEqual({
      analytics: false,
      marketing: false,
      preferences: true,
      sale_of_data: false,
    });
    expect(shopifyMock.getTrackingConsent?.()).toBe("no");
  });

  it("createShopifyCustomerPrivacyMock properly handles status checks and resets", () => {
    const mock = createShopifyCustomerPrivacyMock();
    expect(mock.getTrackingConsent?.()).toBe("pending");
    expect(mock.userCanBeTracked?.()).toBe(false);

    mock.setTrackingConsent({
      analytics: true,
      marketing: false,
      preferences: true,
      sale_of_data: false,
    });
    expect(mock.getTrackingConsent?.()).toBe("partial");
    expect(mock.userCanBeTracked?.()).toBe(true);

    mock.reset();
    expect(mock.currentConsent).toBeNull();
    expect(mock.history).toHaveLength(0);
    expect(mock.getTrackingConsent?.()).toBe("pending");
  });
});
