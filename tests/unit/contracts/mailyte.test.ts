import { describe, expect, it, beforeEach } from "vitest";
import { MockMailyteProvider } from "@/lib/providers/mock/mailyte";

describe("MockMailyteProvider", () => {
  let provider: MockMailyteProvider;

  beforeEach(() => {
    provider = new MockMailyteProvider();
  });

  it("records checkout_started event without storing PII in memory", async () => {
    const result = await provider.sendCheckoutStarted({
      checkoutId: "TEST-checkout-001",
      email: "test.customer@example.com",
      totalPrice: "89.00",
      currency: "USD",
      lineItemsCount: 2,
      abandonedCheckoutUrl: "https://example.com/checkout/TEST-checkout-001",
    });

    expect(result.success).toBe(true);
    expect(result.uniqueId).toBe("TEST-checkout-001");
    expect(result.eventId).toMatch(/^m_evt_/);

    const recorded = provider.getRecordedEvents();
    expect(recorded).toHaveLength(1);
    expect(recorded[0].eventName).toBe("checkout_started");
    expect(recorded[0].uniqueId).toBe("TEST-checkout-001");

    // Strict PII check: recorded event must not store email or PII
    const recordedRaw = JSON.stringify(recorded);
    expect(recordedRaw).not.toContain("test.customer@example.com");
  });

  it("records order_completed event without storing PII in memory", async () => {
    const result = await provider.sendOrderCompleted({
      orderId: "TEST-order-555",
      orderNumber: "TEST-NL-555",
      email: "test.buyer@example.com",
      totalPrice: "120.00",
      currency: "USD",
      lineItemsCount: 1,
    });

    expect(result.success).toBe(true);
    expect(result.uniqueId).toBe("TEST-order-555");
    expect(result.eventId).toMatch(/^m_evt_/);

    const recorded = provider.getRecordedEvents();
    expect(recorded).toHaveLength(1);
    expect(recorded[0].eventName).toBe("order_completed");
    expect(recorded[0].uniqueId).toBe("TEST-order-555");

    // Strict PII check: recorded event must not store email or PII
    const recordedRaw = JSON.stringify(recorded);
    expect(recordedRaw).not.toContain("test.buyer@example.com");
  });

  it("rejects invalid events failing schema validation", async () => {
    await expect(
      // @ts-expect-error testing invalid payload
      provider.trackEvent({
        eventName: "TEST-custom",
        // missing uniqueId
      })
    ).rejects.toThrow();
  });
});
