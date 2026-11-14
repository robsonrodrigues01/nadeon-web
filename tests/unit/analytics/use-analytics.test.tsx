// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ConsentProvider } from "@/lib/consent";
import { useAnalytics } from "@/lib/analytics";

describe("lib/analytics/use-analytics.ts", () => {
  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
    vi.clearAllMocks();
  });

  it("provides active consent boolean from ConsentProvider", () => {
    // Wrap with ConsentProvider configured with US country (opt-out default = true)
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider initialCountry="US">{children}</ConsentProvider>
    );

    const { result } = renderHook(() => useAnalytics(), { wrapper });
    expect(result.current.hasConsent).toBe(true);
  });

  it("dispatches events via hook when consent is allowed", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider initialCountry="US">{children}</ConsentProvider>
    );

    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      const res = result.current.trackViewItem({
        item_id: "biohack",
        item_name: "BioHack",
        price: 59,
        currency: "USD",
        line: "human",
      });
      expect(res.tracked).toBe(true);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics]",
      "view_item",
      expect.objectContaining({ item_id: "biohack" })
    );

    consoleSpy.mockRestore();
  });

  it("does not dispatch when consent is rejected in ConsentProvider", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConsentProvider
        initialRecord={{
          version: "1.0",
          country: "US",
          timestamp: new Date().toISOString(),
          explicit: true,
          preferences: {
            necessary: true,
            analytics: false,
            marketing: false,
          },
        }}
      >
        {children}
      </ConsentProvider>
    );

    const { result } = renderHook(() => useAnalytics(), { wrapper });
    expect(result.current.hasConsent).toBe(false);

    act(() => {
      const res = result.current.trackAddToCart({
        item_id: "renew",
        item_name: "Renew",
        price: 65,
        quantity: 1,
        currency: "USD",
        line: "human",
      });
      expect(res.tracked).toBe(false);
      expect(res.reason).toBe("consent_denied");
    });

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
