// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ConsentProvider, useConsent } from "@/lib/consent";
import { MeasurementScripts } from "@/components/layout/measurement-scripts";
import { CookieBanner } from "@/components/layout/cookie-banner";
import {
  createShopifyCustomerPrivacyMock,
  createShopifyMock,
  type ShopifyMock,
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
  let shopifyGlobalMock: ShopifyMock;

  beforeEach(() => {
    shopifyGlobalMock = createShopifyMock();
    (window as Window & { Shopify?: unknown }).Shopify = shopifyGlobalMock;
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
    vi.stubGlobal("location", { reload: vi.fn() });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    delete (window as Window & { Shopify?: unknown }).Shopify;
    delete (window as Window & { gtag?: unknown }).gtag;
    delete (window as Window & { clarity?: unknown }).clarity;
    delete (window as Window & { fbq?: unknown }).fbq;
  });

  it("does not call Shopify Customer Privacy API or loadFeatures when environment variable is unset", () => {
    render(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
        <CookieBanner forceVisible={true} />
        <ConsentTestControls />
      </ConsentProvider>
    );

    // Click Accept All
    fireEvent.click(screen.getByRole("button", { name: /^accept all$/i }));
    expect(shopifyGlobalMock.loadCalls).toHaveLength(0);
    expect(shopifyGlobalMock.customerPrivacy).toBeUndefined();

    // Click Reject
    fireEvent.click(screen.getByText("Trigger Reject"));
    expect(shopifyGlobalMock.loadCalls).toHaveLength(0);
    expect(shopifyGlobalMock.customerPrivacy).toBeUndefined();

    // Click Revoke
    fireEvent.click(screen.getByText("Trigger Revoke Both"));
    expect(shopifyGlobalMock.loadCalls).toHaveLength(0);
    expect(shopifyGlobalMock.customerPrivacy).toBeUndefined();
  });

  it("calls loadFeatures and sets tracking consent with granted consent when user accepts cookies", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");

    render(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
        <CookieBanner forceVisible={true} />
      </ConsentProvider>
    );

    // Accept via cookie banner
    fireEvent.click(screen.getByRole("button", { name: /accept all/i }));

    expect(shopifyGlobalMock.loadCalls).toEqual([
      [{ name: "consent-tracking-api", version: "0.2" }],
    ]);
    expect(shopifyGlobalMock.customerPrivacy?.history).toHaveLength(1);
    expect(shopifyGlobalMock.customerPrivacy?.currentConsent).toEqual({
      analytics: true,
      marketing: true,
      preferences: true,
      sale_of_data: true,
      headlessStorefront: true,
      storefrontRootDomain: expect.any(String),
    });
    expect(shopifyGlobalMock.customerPrivacy?.getTrackingConsent?.()).toBe(
      "yes"
    );
    expect(shopifyGlobalMock.customerPrivacy?.userCanBeTracked?.()).toBe(true);
  });

  it("calls loadFeatures and sets tracking consent with denied consent when user rejects cookies", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");

    render(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
        <CookieBanner forceVisible={true} />
      </ConsentProvider>
    );

    // Reject non-essential via cookie banner
    fireEvent.click(
      screen.getByRole("button", { name: /reject non-essential/i })
    );

    expect(shopifyGlobalMock.loadCalls).toEqual([
      [{ name: "consent-tracking-api", version: "0.2" }],
    ]);
    expect(shopifyGlobalMock.customerPrivacy?.history).toHaveLength(1);
    expect(shopifyGlobalMock.customerPrivacy?.currentConsent).toEqual({
      analytics: false,
      marketing: false,
      preferences: true,
      sale_of_data: false,
      headlessStorefront: true,
      storefrontRootDomain: expect.any(String),
    });
    expect(shopifyGlobalMock.customerPrivacy?.getTrackingConsent?.()).toBe(
      "no"
    );
    expect(shopifyGlobalMock.customerPrivacy?.userCanBeTracked?.()).toBe(false);
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

    // Initial mount with explicit consent triggers loadFeatures and syncs to Shopify
    expect(shopifyGlobalMock.customerPrivacy?.history).toHaveLength(1);
    expect(shopifyGlobalMock.customerPrivacy?.getTrackingConsent?.()).toBe(
      "yes"
    );

    // Revoke consent
    fireEvent.click(screen.getByText("Trigger Revoke Both"));

    expect(
      shopifyGlobalMock.customerPrivacy?.history.length
    ).toBeGreaterThanOrEqual(2);
    expect(shopifyGlobalMock.customerPrivacy?.currentConsent).toEqual({
      analytics: false,
      marketing: false,
      preferences: true,
      sale_of_data: false,
      headlessStorefront: true,
      storefrontRootDomain: expect.any(String),
    });
    expect(shopifyGlobalMock.customerPrivacy?.getTrackingConsent?.()).toBe(
      "no"
    );
  });

  it("delays reload on revocation until Shopify confirmation callback executes", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });

    let triggerConfirmation: (() => void) | null = null;
    const delayedPrivacyMock = {
      ...createShopifyCustomerPrivacyMock(),
      setTrackingConsent: vi.fn((_consent, callback) => {
        triggerConfirmation = callback || null;
      }),
    };

    (window as Window & { Shopify?: unknown }).Shopify = {
      customerPrivacy: delayedPrivacyMock,
      loadFeatures: vi.fn((_, cb) => cb()),
    };

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

    // Revoke consent
    fireEvent.click(screen.getByText("Trigger Revoke Both"));

    // Reload must NOT have occurred before Shopify confirms
    expect(reload).not.toHaveBeenCalled();

    // Shopify confirms
    expect(triggerConfirmation).not.toBeNull();
    triggerConfirmation!();

    // Reload occurs after confirmation
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("delays reload on revocation when loadFeatures is still loading until confirmation", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });

    let triggerLoadFeatures: (() => void) | null = null;
    let triggerConsentConfirm: (() => void) | null = null;
    const privacyMock = {
      ...createShopifyCustomerPrivacyMock(),
      setTrackingConsent: vi.fn((_consent, callback) => {
        triggerConsentConfirm = callback || null;
      }),
    };

    const mockShopify = {
      loadFeatures: vi.fn((_features, callback) => {
        triggerLoadFeatures = () => {
          mockShopify.customerPrivacy = privacyMock as unknown as undefined;
          callback();
        };
      }),
      customerPrivacy: undefined,
    };

    (window as Window & { Shopify?: unknown }).Shopify = mockShopify;

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

    fireEvent.click(screen.getByText("Trigger Revoke Both"));

    // Must not reload before loadFeatures completes
    expect(reload).not.toHaveBeenCalled();

    // Finish loadFeatures
    expect(triggerLoadFeatures).not.toBeNull();
    triggerLoadFeatures!();
    expect(reload).not.toHaveBeenCalled();

    // Finish consent confirmation
    expect(triggerConsentConfirm).not.toBeNull();
    triggerConsentConfirm!();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("does not reload when Shopify confirmation hangs on revocation", () => {
    vi.useFakeTimers();
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");
    const reload = vi.fn();
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.stubGlobal("location", { reload });

    let lateConfirmation: (() => void) | undefined;
    const hangingPrivacyMock = {
      ...createShopifyCustomerPrivacyMock(),
      setTrackingConsent: vi.fn((_consent, callback) => {
        lateConfirmation = callback;
      }),
    };

    (window as Window & { Shopify?: unknown }).Shopify = {
      customerPrivacy: hangingPrivacyMock,
      loadFeatures: vi.fn((_, cb) => cb()),
    };

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

    fireEvent.click(screen.getByText("Trigger Revoke Both"));
    expect(reload).not.toHaveBeenCalled();

    // Advance timers by 1500ms
    vi.advanceTimersByTime(1600);
    expect(reload).not.toHaveBeenCalled();
    expect(screen.queryAllByTestId("script")).toHaveLength(0);
    expect(consoleError).toHaveBeenCalledWith(
      "Shopify tracking consent update timed out"
    );
    lateConfirmation?.();
    expect(reload).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("keeps measurement disabled and does not reload when Shopify rejects revocation", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-123");
    vi.stubEnv("NEXT_PUBLIC_CLARITY_ID", "clarity-123");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "meta-123");
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const privacyMock = {
      ...createShopifyCustomerPrivacyMock(),
      setTrackingConsent: vi.fn(() => {
        throw new Error(
          "failure detail must not be logged: private@example.com"
        );
      }),
    };
    (window as Window & { Shopify?: unknown }).Shopify = {
      customerPrivacy: privacyMock,
      loadFeatures: vi.fn((_, callback) => callback()),
    };

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

    expect(screen.getAllByTestId("script")).toHaveLength(4);
    fireEvent.click(screen.getByText("Trigger Revoke Both"));

    expect(screen.queryAllByTestId("script")).toHaveLength(0);
    expect(reload).not.toHaveBeenCalled();
    expect(consoleError.mock.calls.flat().join(" ")).not.toContain(
      "private@example.com"
    );
  });

  it("does not reload when Shopify fails to load its privacy feature", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-123");
    vi.stubEnv("NEXT_PUBLIC_CLARITY_ID", "clarity-123");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "meta-123");
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (window as Window & { Shopify?: unknown }).Shopify = {
      loadFeatures: vi.fn((_, callback) =>
        callback(new Error("private@example.com failure detail"))
      ),
    };

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

    expect(screen.getAllByTestId("script")).toHaveLength(4);
    fireEvent.click(screen.getByText("Trigger Revoke Both"));

    expect(screen.queryAllByTestId("script")).toHaveLength(0);
    expect(reload).not.toHaveBeenCalled();
    expect(consoleError.mock.calls.flat().join(" ")).not.toContain(
      "private@example.com"
    );
  });

  it("synchronizes directly without calling loadFeatures again when customerPrivacy is already pre-loaded", () => {
    vi.stubEnv("NEXT_PUBLIC_SHOPIFY_CUSTOMER_PRIVACY", "true");
    const directPrivacyMock = createShopifyCustomerPrivacyMock();
    const loadFeaturesSpy = vi.fn();

    (window as Window & { Shopify?: unknown }).Shopify = {
      loadFeatures: loadFeaturesSpy,
      customerPrivacy: directPrivacyMock,
    };

    render(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
        <CookieBanner forceVisible={true} />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /accept all/i }));

    // loadFeatures is not needed because customerPrivacy is already available
    expect(loadFeaturesSpy).toHaveLength(0);
    expect(directPrivacyMock.history).toHaveLength(1);
    expect(directPrivacyMock.currentConsent).toEqual({
      analytics: true,
      marketing: true,
      preferences: true,
      sale_of_data: true,
      headlessStorefront: true,
      storefrontRootDomain: expect.any(String),
    });
  });

  it("createShopifyMock and createShopifyCustomerPrivacyMock properly handle statuses and resets", () => {
    const mock = createShopifyMock();
    expect(mock.loadCalls).toHaveLength(0);
    expect(mock.customerPrivacy).toBeUndefined();

    mock.loadFeatures(
      [{ name: "consent-tracking-api", version: "0.2" }],
      () => {}
    );
    expect(mock.loadCalls).toHaveLength(1);
    expect(mock.customerPrivacy).toBeDefined();

    expect(mock.customerPrivacy?.getTrackingConsent?.()).toBe("pending");
    expect(mock.customerPrivacy?.userCanBeTracked?.()).toBe(false);

    mock.customerPrivacy?.setTrackingConsent({
      analytics: true,
      marketing: false,
      preferences: true,
      sale_of_data: false,
    });
    expect(mock.customerPrivacy?.getTrackingConsent?.()).toBe("partial");
    expect(mock.customerPrivacy?.userCanBeTracked?.()).toBe(true);

    mock.reset();
    expect(mock.customerPrivacy).toBeUndefined();
    expect(mock.loadCalls).toHaveLength(0);
  });
});
