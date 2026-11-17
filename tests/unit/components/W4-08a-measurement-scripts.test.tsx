// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { ConsentProvider, useConsent } from "@/lib/consent";
import { MeasurementScripts } from "@/components/layout/measurement-scripts";

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

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  delete (window as Window & { gtag?: unknown }).gtag;
  delete (window as Window & { clarity?: unknown }).clarity;
  delete (window as Window & { fbq?: unknown }).fbq;
  delete (window as Window & { dataLayer?: unknown }).dataLayer;
});

describe("W4-08a measurement scripts", () => {
  it("loads no scripts before consent", () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-123");
    vi.stubEnv("NEXT_PUBLIC_CLARITY_ID", "clarity-123");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "meta-123");

    const html = renderToStaticMarkup(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
      </ConsentProvider>
    );

    expect(html).not.toContain('data-testid="script"');
  });

  it("loads only configured scripts allowed by consent", () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-123");
    vi.stubEnv("NEXT_PUBLIC_CLARITY_ID", "");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "meta-123");

    const html = renderToStaticMarkup(
      <ConsentProvider
        initialCountry="GB"
        initialRecord={{
          version: "1.0",
          timestamp: "2026-11-17T00:00:00.000Z",
          country: "GB",
          explicit: true,
          preferences: { necessary: true, analytics: true, marketing: false },
        }}
      >
        <MeasurementScripts />
      </ConsentProvider>
    );

    expect(html.match(/data-testid="script"/g)).toHaveLength(2);
    expect(html).toContain("G-123");
    expect(html).toContain("ga4-init");
    expect(html).not.toContain("clarity-init");
    expect(html).not.toContain("meta-pixel-init");
  });

  it("disables initialized trackers when their consent is revoked", () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-123");
    vi.stubEnv("NEXT_PUBLIC_CLARITY_ID", "clarity-123");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "meta-123");

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
        <ConsentControls />
      </ConsentProvider>
    );

    expect(screen.getAllByTestId("script")).toHaveLength(4);
    const gtag = vi.fn();
    const clarity = vi.fn();
    const fbq = vi.fn();
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    Object.assign(window, { gtag, clarity, fbq, dataLayer: [] });
    fireEvent.click(screen.getByRole("button", { name: "Revoke analytics" }));
    fireEvent.click(screen.getByRole("button", { name: "Revoke marketing" }));

    expect(screen.queryAllByTestId("script")).toHaveLength(0);
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
    });
    expect(clarity).toHaveBeenCalledWith("consent", false);
    expect(fbq).toHaveBeenCalledWith("consent", "revoke");
    expect(reload).toHaveBeenCalledTimes(2);
    expect((window as Window & { gtag?: unknown }).gtag).toBe(gtag);
    expect((window as Window & { clarity?: unknown }).clarity).toBe(clarity);
    expect((window as Window & { fbq?: unknown }).fbq).toBe(fbq);
  });

  it("disables GA4 automatic page views and strips query strings from manual views", () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-123");
    vi.stubEnv("NEXT_PUBLIC_CLARITY_ID", "");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");

    const html = renderToStaticMarkup(
      <ConsentProvider
        initialCountry="GB"
        initialRecord={{
          version: "1.0",
          timestamp: "2026-11-17T00:00:00.000Z",
          country: "GB",
          explicit: true,
          preferences: { necessary: true, analytics: true, marketing: false },
        }}
      >
        <MeasurementScripts />
      </ConsentProvider>
    );

    expect(html).toContain("send_page_view: false");
    expect(html).toContain("page_location: location.pathname");
    expect(html).not.toContain("location.href");
  });
});

function ConsentControls() {
  const { updateConsent } = useConsent();
  return (
    <>
      <button onClick={() => updateConsent({ analytics: false })}>
        Revoke analytics
      </button>
      <button onClick={() => updateConsent({ marketing: false })}>
        Revoke marketing
      </button>
    </>
  );
}
