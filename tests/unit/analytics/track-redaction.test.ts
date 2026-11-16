// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  track,
  sanitizeForAnalyticsLog,
  type ViewItemPayload,
  type PurchasePayload,
} from "@/lib/analytics";
import { COUNTRY_COOKIE_NAME } from "@/lib/consent";

describe("W3-64 analytical logger redaction (no PII or free text)", () => {
  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `${COUNTRY_COOKIE_NAME}=US`,
    });
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("sanitizeForAnalyticsLog unit checks", () => {
    it("strips email, personal names, addresses, and free text from log payload", () => {
      const dirty = {
        item_id: "biohack_1",
        email: "private@domain.com",
        user_email: "test@domain.com",
        name: "John Doe",
        first_name: "John",
        last_name: "Doe",
        address: "123 Main St, New York, NY",
        street: "123 Main St",
        city: "New York",
        zip: "10001",
        postal_code: "10001",
        search_term: "free text query for biohack",
        query: "free text query",
        message: "user feedback text",
        details: "confidential details",
        description: "long free text description",
        price: 59,
        currency: "USD",
        line: "human",
      };

      const sanitized = sanitizeForAnalyticsLog(dirty);

      expect(sanitized).toEqual({
        item_id: "biohack_1",
        price: 59,
        currency: "USD",
        line: "human",
      });

      const serialized = JSON.stringify(sanitized);
      expect(serialized).not.toContain("private@domain.com");
      expect(serialized).not.toContain("John");
      expect(serialized).not.toContain("Doe");
      expect(serialized).not.toContain("Main St");
      expect(serialized).not.toContain("10001");
      expect(serialized).not.toContain("free text");
      expect(serialized).not.toContain("user feedback");
    });

    it("strips values containing embedded email addresses", () => {
      const input = {
        item_id: "item_99",
        promo_code: "PROMO_friend_friend@example.com",
        valid_code: "DISCOUNT10",
      };

      const sanitized = sanitizeForAnalyticsLog(input);
      expect(sanitized).toEqual({
        item_id: "item_99",
        valid_code: "DISCOUNT10",
      });
      expect(JSON.stringify(sanitized)).not.toContain("friend@example.com");
    });
  });

  describe("track() logger behavior in non-production", () => {
    it("logs only event type, id, and non-personal fields for view_item", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const payload: ViewItemPayload = {
        item_id: "biohack",
        item_name: "BioHack",
        price: 59,
        currency: "USD",
        line: "human",
        item_category: "Capsules",
      };

      track("view_item", payload);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const [tag, event, loggedPayload] = consoleSpy.mock.calls[0];

      expect(tag).toBe("[Analytics]");
      expect(event).toBe("view_item");
      expect(loggedPayload).toEqual({
        item_id: "biohack",
        item_name: "BioHack",
        price: 59,
        currency: "USD",
        line: "human",
        item_category: "Capsules",
      });
    });

    it("logs purchase with transaction_id, value, and non-personal order aggregates", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const payload: PurchasePayload = {
        transaction_id: "txn_order_12345",
        value: 120,
        currency: "USD",
        item_count: 2,
        line: "human",
        shipping: 5,
        tax: 8.5,
      };

      track("purchase", payload);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const [tag, event, loggedPayload] = consoleSpy.mock.calls[0];

      expect(tag).toBe("[Analytics]");
      expect(event).toBe("purchase");
      expect(loggedPayload).toEqual({
        transaction_id: "txn_order_12345",
        value: 120,
        currency: "USD",
        item_count: 2,
        line: "human",
        shipping: 5,
        tax: 8.5,
      });
    });

    it("does not log free-text search_term in search analytics event", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      track("search", {
        search_term: "NMN Longevity formula for user@example.com",
        line: "human",
        results_count: 4,
      });

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const [tag, event, loggedPayload] = consoleSpy.mock.calls[0];

      expect(tag).toBe("[Analytics]");
      expect(event).toBe("search");
      expect(loggedPayload).toEqual({
        line: "human",
        results_count: 4,
      });

      const serialized = JSON.stringify(loggedPayload);
      expect(serialized).not.toContain("search_term");
      expect(serialized).not.toContain("NMN Longevity");
      expect(serialized).not.toContain("user@example.com");
    });
  });
});
