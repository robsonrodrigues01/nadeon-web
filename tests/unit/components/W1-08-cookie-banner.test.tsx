// @vitest-environment jsdom
import React, { useState } from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import {
  CookieBanner,
  CookieSettingsModal,
} from "@/components/layout/cookie-banner";
import {
  ConsentProvider,
  ConsentGate,
  isUsCountry,
  getDefaultConsent,
  parseConsentCookie,
  serializeConsentRecord,
  CONSENT_COOKIE_NAME,
} from "@/lib/consent";

describe("W1-08 Cookie Banner & Consent System", () => {
  beforeEach(() => {
    // Clear cookies and DOM
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Jurisdiction and Consent Rules", () => {
    it("identifies US country codes correctly", () => {
      expect(isUsCountry("US")).toBe(true);
      expect(isUsCountry("USA")).toBe(true);
      expect(isUsCountry("us")).toBe(true);
      expect(isUsCountry("usa")).toBe(true);
      expect(isUsCountry("CA")).toBe(false);
      expect(isUsCountry("GB")).toBe(false);
      expect(isUsCountry("BR")).toBe(false);
      expect(isUsCountry(null)).toBe(false);
      expect(isUsCountry(undefined)).toBe(false);
      expect(isUsCountry("")).toBe(false);
    });

    it("applies opt-out in the US (analytics and marketing enabled by default)", () => {
      const consent = getDefaultConsent("US", false);
      expect(consent.necessary).toBe(true);
      expect(consent.analytics).toBe(true);
      expect(consent.marketing).toBe(true);
    });

    it("disables marketing in US when GPC is asserted", () => {
      const consent = getDefaultConsent("US", true);
      expect(consent.necessary).toBe(true);
      expect(consent.analytics).toBe(true);
      expect(consent.marketing).toBe(false);
    });

    it("applies opt-in outside the US (analytics and marketing disabled by default)", () => {
      const nonUsConsent = getDefaultConsent("FR", false);
      expect(nonUsConsent.necessary).toBe(true);
      expect(nonUsConsent.analytics).toBe(false);
      expect(nonUsConsent.marketing).toBe(false);

      const defaultConsent = getDefaultConsent(null, false);
      expect(defaultConsent.necessary).toBe(true);
      expect(defaultConsent.analytics).toBe(false);
      expect(defaultConsent.marketing).toBe(false);
    });

    it("serializes and parses consent cookies properly", () => {
      const record = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        country: "US",
        explicit: true,
        preferences: {
          necessary: true as const,
          analytics: true,
          marketing: false,
        },
      };

      const serialized = serializeConsentRecord(record);
      const parsed = parseConsentCookie(serialized);

      expect(parsed).not.toBeNull();
      expect(parsed?.version).toBe("1.0");
      expect(parsed?.preferences.necessary).toBe(true);
      expect(parsed?.preferences.analytics).toBe(true);
      expect(parsed?.preferences.marketing).toBe(false);
      expect(parsed?.explicit).toBe(true);
    });
  });

  describe("CookieBanner Component & Semantic Elements", () => {
    it("reserves the banner height while open and removes it when closed", () => {
      const observe = vi.fn();
      const disconnect = vi.fn();
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(private callback: ResizeObserverCallback) {}
          observe(target: Element) {
            vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
              height: 180,
            } as DOMRect);
            observe(target);
            this.callback(
              [{ target } as ResizeObserverEntry],
              this as unknown as ResizeObserver
            );
          }
          disconnect() {
            disconnect();
          }
        }
      );

      function Harness() {
        const [isOpen, setIsOpen] = useState(true);
        return (
          <ConsentProvider initialCountry="US" forceBannerOpen={true}>
            <CookieBanner isOpen={isOpen} />
            <button type="button" onClick={() => setIsOpen(false)}>
              Close banner
            </button>
          </ConsentProvider>
        );
      }
      render(<Harness />);
      const banner = screen.getByRole("region", {
        name: /cookie consent banner/i,
      });
      expect(observe).toHaveBeenCalledWith(banner);
      expect(document.body.style.paddingBottom).toBe("180px");

      fireEvent.click(screen.getByRole("button", { name: "Close banner" }));
      expect(disconnect).toHaveBeenCalled();
      expect(document.body.style.paddingBottom).toBe("");
      vi.unstubAllGlobals();
    });

    it("does not reserve space for the inline banner", () => {
      render(
        <ConsentProvider initialCountry="US" forceBannerOpen={true}>
          <CookieBanner inline forceVisible={true} />
        </ConsentProvider>
      );
      expect(document.body.style.paddingBottom).toBe("");
    });

    it("renders banner with required semantic buttons and links", () => {
      render(
        <ConsentProvider initialCountry="US" forceBannerOpen={true}>
          <CookieBanner inline forceVisible={true} />
        </ConsentProvider>
      );

      // Section region
      const region = screen.getByRole("region", {
        name: /cookie consent banner/i,
      });
      expect(region).toBeDefined();

      // Heading
      expect(
        screen.getByRole("heading", { level: 2, name: /we use cookies/i })
      ).toBeDefined();

      // Semantic Links
      const privacyLink = screen.getByRole("link", { name: /privacy policy/i });
      expect(privacyLink.getAttribute("href")).toBe("/legal/privacy");

      const doNotSellLink = screen.getByRole("link", {
        name: /do not sell my info/i,
      });
      expect(doNotSellLink.getAttribute("href")).toBe("/legal/do-not-sell");

      // Semantic Buttons
      const settingsBtn = screen.getByRole("button", { name: /^settings$/i });
      expect(settingsBtn).toBeDefined();
      expect(settingsBtn.getAttribute("type")).toBe("button");

      const rejectBtn = screen.getByRole("button", {
        name: /reject non-essential/i,
      });
      expect(rejectBtn).toBeDefined();
      expect(rejectBtn.getAttribute("type")).toBe("button");

      const acceptBtn = screen.getByRole("button", { name: /accept all/i });
      expect(acceptBtn).toBeDefined();
      expect(acceptBtn.getAttribute("type")).toBe("button");
    });

    it("clicking 'Accept all' sets all consent to true, writes cookie and closes banner", () => {
      render(
        <ConsentProvider initialCountry="DE" forceBannerOpen={true}>
          <CookieBanner forceVisible={true} />
        </ConsentProvider>
      );

      const acceptBtn = screen.getByRole("button", { name: /accept all/i });
      fireEvent.click(acceptBtn);

      expect(document.cookie).toContain(CONSENT_COOKIE_NAME);
      const decoded = decodeURIComponent(document.cookie);
      expect(decoded).toContain('"analytics":true');
      expect(decoded).toContain('"marketing":true');
    });

    it("clicking 'Reject non-essential' disables optional cookies, writes cookie and closes banner", () => {
      render(
        <ConsentProvider initialCountry="US" forceBannerOpen={true}>
          <CookieBanner forceVisible={true} />
        </ConsentProvider>
      );

      const rejectBtn = screen.getByRole("button", {
        name: /reject non-essential/i,
      });
      fireEvent.click(rejectBtn);

      expect(document.cookie).toContain(CONSENT_COOKIE_NAME);
      const decoded = decodeURIComponent(document.cookie);
      expect(decoded).toContain('"analytics":false');
      expect(decoded).toContain('"marketing":false');
    });
  });

  describe("CookieSettingsModal Component & Semantic Fields", () => {
    it("renders dialog with fieldset, legend, checkboxes, and action buttons", () => {
      render(
        <ConsentProvider initialCountry="US">
          <CookieSettingsModal inline isOpen={true} />
        </ConsentProvider>
      );

      // Dialog
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeDefined();

      // Heading
      expect(
        screen.getByRole("heading", { level: 2, name: /cookie settings/i })
      ).toBeDefined();

      // Fieldset legend
      expect(
        screen.getByText(/cookie categories and permissions/i)
      ).toBeDefined();

      // Necessary checkbox (disabled & checked)
      const necessaryCheckbox = screen.getByLabelText(
        /strictly necessary cookies/i
      ) as HTMLInputElement;
      expect(necessaryCheckbox).toBeDefined();
      expect(necessaryCheckbox.checked).toBe(true);
      expect(necessaryCheckbox.disabled).toBe(true);

      // Analytics checkbox (togglable)
      const analyticsCheckbox = screen.getByLabelText(
        /analytics cookies/i
      ) as HTMLInputElement;
      expect(analyticsCheckbox).toBeDefined();
      expect(analyticsCheckbox.disabled).toBe(false);

      // Marketing checkbox (togglable)
      const marketingCheckbox = screen.getByLabelText(
        /marketing cookies/i
      ) as HTMLInputElement;
      expect(marketingCheckbox).toBeDefined();
      expect(marketingCheckbox.disabled).toBe(false);

      // Buttons
      const saveBtn = screen.getByRole("button", { name: /save preferences/i });
      expect(saveBtn).toBeDefined();
      expect(saveBtn.getAttribute("type")).toBe("button");

      const rejectBtn = screen.getByRole("button", {
        name: /reject non-essential/i,
      });
      expect(rejectBtn).toBeDefined();

      const acceptBtn = screen.getByRole("button", { name: /accept all/i });
      expect(acceptBtn).toBeDefined();

      const closeBtn = screen.getByRole("button", {
        name: /close cookie settings/i,
      });
      expect(closeBtn).toBeDefined();
    });

    it("allows toggling categories and saving preferences", () => {
      render(
        <ConsentProvider initialCountry="US">
          <CookieSettingsModal inline isOpen={true} />
        </ConsentProvider>
      );

      const analyticsCheckbox = screen.getByLabelText(
        /analytics cookies/i
      ) as HTMLInputElement;
      const marketingCheckbox = screen.getByLabelText(
        /marketing cookies/i
      ) as HTMLInputElement;

      // Uncheck marketing and analytics
      fireEvent.click(analyticsCheckbox);
      expect(analyticsCheckbox.checked).toBe(false);

      fireEvent.click(marketingCheckbox);
      expect(marketingCheckbox.checked).toBe(false);

      // Save preferences
      const saveBtn = screen.getByRole("button", { name: /save preferences/i });
      fireEvent.click(saveBtn);

      expect(document.cookie).toContain(CONSENT_COOKIE_NAME);
      const decoded = decodeURIComponent(document.cookie);
      expect(decoded).toContain('"marketing":false');
    });
  });

  describe("ConsentGate Component", () => {
    function GateTestConsumer() {
      return (
        <div>
          <ConsentGate category="necessary">
            <span data-testid="necessary-content">Necessary active</span>
          </ConsentGate>

          <ConsentGate
            category="analytics"
            fallback={<span data-testid="analytics-fallback">Blocked</span>}
          >
            <span data-testid="analytics-content">Analytics active</span>
          </ConsentGate>

          <ConsentGate
            category="marketing"
            fallback={<span data-testid="marketing-fallback">Blocked</span>}
          >
            <span data-testid="marketing-content">Marketing active</span>
          </ConsentGate>
        </div>
      );
    }

    it("only renders children when consent is granted", () => {
      // In Non-US with no consent, analytics and marketing should show fallback
      const { rerender } = render(
        <ConsentProvider initialCountry="FR">
          <GateTestConsumer />
        </ConsentProvider>
      );

      expect(screen.getByTestId("necessary-content")).toBeDefined();
      expect(screen.getByTestId("analytics-fallback")).toBeDefined();
      expect(screen.queryByTestId("analytics-content")).toBeNull();
      expect(screen.getByTestId("marketing-fallback")).toBeDefined();
      expect(screen.queryByTestId("marketing-content")).toBeNull();

      // With granted consent record
      const grantedRecord = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        country: "FR",
        explicit: true,
        preferences: {
          necessary: true as const,
          analytics: true,
          marketing: false,
        },
      };

      rerender(
        <ConsentProvider initialRecord={grantedRecord}>
          <GateTestConsumer />
        </ConsentProvider>
      );

      expect(screen.getByTestId("necessary-content")).toBeDefined();
      expect(screen.getByTestId("analytics-content")).toBeDefined();
      expect(screen.queryByTestId("analytics-fallback")).toBeNull();
      expect(screen.getByTestId("marketing-fallback")).toBeDefined();
      expect(screen.queryByTestId("marketing-content")).toBeNull();
    });
  });
});
