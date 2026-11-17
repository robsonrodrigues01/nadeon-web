// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  track,
  trackEvent,
  hasAnalyticsConsent,
  AnalyticsEventSchemas,
  type ViewItemPayload,
  type AddToCartPayload,
  type BeginCheckoutPayload,
  type SubscribeNewsletterPayload,
  type QuizCompletePayload,
  type PurchasePayload,
} from "@/lib/analytics";
import { CONSENT_COOKIE_NAME, COUNTRY_COOKIE_NAME } from "@/lib/consent";

const gtagMock = vi.fn();
const clarityMock = vi.fn();
const measurementTrackers = window as typeof window & {
  gtag?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
};

describe("lib/analytics/track.ts", () => {
  beforeEach(() => {
    // Reset cookies
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
    vi.clearAllMocks();
    measurementTrackers.gtag = gtagMock;
    measurementTrackers.clarity = clarityMock;
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    delete measurementTrackers.gtag;
    delete measurementTrackers.clarity;
    vi.unstubAllEnvs();
  });

  describe("Consent Enforcement", () => {
    it("returns false for hasAnalyticsConsent when no cookie is set and outside US", () => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=CA`;
      expect(hasAnalyticsConsent()).toBe(false);
    });

    it("returns true for hasAnalyticsConsent when no cookie is set but in US (opt-out default)", () => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=US`;
      expect(hasAnalyticsConsent()).toBe(true);
    });

    it("returns false when nadeon_consent cookie has analytics: false even in US", () => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=US`;
      document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify({
          version: "1.0",
          explicit: true,
          preferences: { necessary: true, analytics: false, marketing: false },
        })
      )}`;
      expect(hasAnalyticsConsent()).toBe(false);
    });

    it("returns true when nadeon_consent cookie has analytics: true in non-US", () => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=GB`;
      document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify({
          version: "1.0",
          explicit: true,
          preferences: { necessary: true, analytics: true, marketing: false },
        })
      )}`;
      expect(hasAnalyticsConsent()).toBe(true);
    });

    it("fails closed for malformed consent cookie even under US opt-out default", () => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=US`;
      document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify({
          version: "1.0",
          explicit: "false",
          preferences: {
            necessary: true,
            analytics: "false",
            marketing: false,
          },
        })
      )}`;

      expect(hasAnalyticsConsent()).toBe(false);
    });

    it("fails closed for an empty consent cookie even under US opt-out default", () => {
      expect(
        hasAnalyticsConsent(
          `${COUNTRY_COOKIE_NAME}=US; ${CONSENT_COOKIE_NAME}=`
        )
      ).toBe(false);
    });

    it("does not fire track event when analytics consent is denied", () => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=CA`;
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const validPayload: ViewItemPayload = {
        item_id: "biohack",
        item_name: "BioHack",
        price: 59,
        currency: "USD",
        line: "human",
      };

      const result = track("view_item", validPayload);

      expect(result.tracked).toBe(false);
      expect(result.reason).toBe("consent_denied");
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(gtagMock).not.toHaveBeenCalled();
      expect(clarityMock).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("fires track event when analytics consent is granted", () => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=US`;
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const validPayload: ViewItemPayload = {
        item_id: "biohack",
        item_name: "BioHack",
        price: 59,
        currency: "USD",
        line: "human",
      };

      const result = track("view_item", validPayload);

      expect(result.tracked).toBe(true);
      expect(result.event).toBe("view_item");
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics]",
        "view_item",
        expect.objectContaining({ item_id: "biohack" })
      );

      consoleSpy.mockRestore();
    });

    it("respects explicit consent option override in track()", () => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=CA`; // default is denied
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const validPayload: ViewItemPayload = {
        item_id: "renew",
        item_name: "Renew",
        price: 65,
        currency: "USD",
        line: "human",
      };

      // Force consent = true
      const resultGranted = track("view_item", validPayload, { consent: true });
      expect(resultGranted.tracked).toBe(true);
      expect(consoleSpy).toHaveBeenCalledTimes(1);

      // Force consent = false
      const resultDenied = track("view_item", validPayload, { consent: false });
      expect(resultDenied.tracked).toBe(false);
      expect(resultDenied.reason).toBe("consent_denied");
      expect(consoleSpy).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });
  });

  describe("Typed Events & Zod Validation", () => {
    beforeEach(() => {
      // Grant consent for validation tests
      document.cookie = `${COUNTRY_COOKIE_NAME}=US`;
    });

    it("tracks view_item with valid payload and validates schema", () => {
      const payload: ViewItemPayload = {
        item_id: "biohack",
        item_name: "BioHack",
        price: 59,
        currency: "USD",
        line: "human",
        item_category: "Capsules",
      };

      const result = track("view_item", payload);
      expect(result.tracked).toBe(true);
      expect(result.payload).toEqual(payload);
    });

    it("rejects invalid view_item payload with ZodError", () => {
      expect(() =>
        track("view_item", {
          item_id: "",
          // missing item_name, price, currency, line
        } as unknown as ViewItemPayload)
      ).toThrow();
    });

    it("tracks add_to_cart with valid payload", () => {
      const payload: AddToCartPayload = {
        item_id: "full-charge",
        item_name: "Full Charge",
        price: 69,
        quantity: 2,
        currency: "USD",
        line: "human",
        frequency: "subscription",
        subscription_interval: "30_days",
      };

      const result = track("add_to_cart", payload);
      expect(result.tracked).toBe(true);
      expect(result.payload).toEqual(payload);
    });

    it("tracks begin_checkout with valid payload", () => {
      const payload: BeginCheckoutPayload = {
        value: 128,
        currency: "USD",
        item_count: 2,
        line: "human",
        cart_id: "cart_abc123",
      };

      const result = track("begin_checkout", payload);
      expect(result.tracked).toBe(true);
      expect(result.payload?.value).toBe(128);
    });

    it("tracks subscribe_newsletter with valid payload", () => {
      const payload: SubscribeNewsletterPayload = {
        list: "newsletter-human",
        source: "footer",
        line: "human",
      };

      const result = track("subscribe_newsletter", payload);
      expect(result.tracked).toBe(true);
      expect(result.payload?.list).toBe("newsletter-human");
    });

    it("tracks quiz_complete with valid payload", () => {
      const payload: QuizCompletePayload = {
        quiz_id: "pet_formula_quiz",
        line: "pet",
        species: "dog",
        recommended_slug: "more-good-years",
        answers_count: 5,
      };

      const result = track("quiz_complete", payload);
      expect(result.tracked).toBe(true);
      expect(result.payload?.recommended_slug).toBe("more-good-years");
    });

    it("tracks purchase with valid payload", () => {
      const payload: PurchasePayload = {
        transaction_id: "ord_xyz987",
        value: 149.5,
        currency: "USD",
        item_count: 3,
        line: "mixed",
        shipping: 0,
        tax: 9.5,
      };

      const result = track("purchase", payload);
      expect(result.tracked).toBe(true);
      expect(result.payload?.transaction_id).toBe("ord_xyz987");
    });

    it("trackEvent is an alias for track", () => {
      const payload: ViewItemPayload = {
        item_id: "glow",
        item_name: "Glow",
        price: 59,
        currency: "USD",
        line: "human",
      };

      const result = trackEvent("view_item", payload);
      expect(result.tracked).toBe(true);
    });
  });

  describe("Environment Routing: Dev vs Production (measurement loader)", () => {
    beforeEach(() => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=US`;
    });

    it("logs to console in non-production mode without dispatching production events", () => {
      vi.stubEnv("NODE_ENV", "development");
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const payload: ViewItemPayload = {
        item_id: "biohack",
        item_name: "BioHack",
        price: 59,
        currency: "USD",
        line: "human",
      };

      track("view_item", payload);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics]",
        "view_item",
        expect.objectContaining({ item_id: "biohack" })
      );
      expect(gtagMock).not.toHaveBeenCalled();
      expect(clarityMock).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("dispatches sanitized events to the consent-gated measurement loader in production", () => {
      vi.stubEnv("NODE_ENV", "production");
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const payload: ViewItemPayload = {
        item_id: "prime",
        item_name: "Prime",
        price: 49,
        currency: "USD",
        line: "human",
      };

      track("view_item", payload);

      expect(gtagMock).toHaveBeenCalledWith(
        "event",
        "view_item",
        expect.objectContaining({
          item_id: "prime",
          item_name: "Prime",
          price: 49,
          currency: "USD",
          line: "human",
        })
      );
      expect(clarityMock).toHaveBeenCalledWith("event", "view_item");

      track("search", {
        search_term: "customer@example.com",
        line: "human",
        results_count: 2,
      });
      expect(gtagMock).toHaveBeenCalledWith("event", "search", {
        line: "human",
        results_count: 2,
      });
      expect(clarityMock).toHaveBeenCalledWith("event", "search");
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Plano v3 Section 6.5 Extended Events", () => {
    beforeEach(() => {
      document.cookie = `${COUNTRY_COOKIE_NAME}=US`;
    });

    it("validates view_item_list schema", () => {
      const parsed = AnalyticsEventSchemas.view_item_list.parse({
        item_list_id: "human-capsules",
        item_list_name: "Human Capsules Collection",
        line: "human",
      });
      expect(parsed.line).toBe("human");
    });

    it("validates search schema", () => {
      const parsed = AnalyticsEventSchemas.search.parse({
        search_term: "NMN 500mg",
        line: "human",
        results_count: 3,
      });
      expect(parsed.search_term).toBe("NMN 500mg");
    });

    it("validates lab_lookup schema", () => {
      const parsed = AnalyticsEventSchemas.lab_lookup.parse({
        lot_number: "LOT-BH-2026-01",
        line: "human",
        success: true,
      });
      expect(parsed.lot_number).toBe("LOT-BH-2026-01");
    });
  });
});
