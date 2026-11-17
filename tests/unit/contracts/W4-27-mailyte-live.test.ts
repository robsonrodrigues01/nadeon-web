import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LiveMailyteProvider } from "@/lib/providers/live";
import { getProviders, getProvidersMode } from "@/lib/providers";
import { mockMailyteProvider } from "@/lib/providers/mock/mailyte";

describe("LiveMailyteProvider", () => {
  beforeEach(() => {
    vi.stubEnv("MAILYTE_API_KEY", "mk_test_fixture");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("is selected with the existing live provider mode", () => {
    vi.stubEnv("PROVIDERS", "live");
    expect(getProvidersMode()).toBe("live");
    expect(getProviders().mailyteProvider).toBeInstanceOf(LiveMailyteProvider);
    expect(getProviders("mock").mailyteProvider).toBe(mockMailyteProvider);
  });

  it("sends accepted checkout events with the Shopify webhook ID as unique_id", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: "Accepted",
          data: { accepted: 1, duplicates: 0, rejected: [] },
          code: 200,
        }),
        { status: 202 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await new LiveMailyteProvider().sendCheckoutStarted({
      checkoutId: "TEST-checkout-42",
      idempotencyKey: "TEST-shopify-webhook-42",
      email: "buyer@example.test",
      totalPrice: "49.00",
      currency: "USD",
      lineItemsCount: 2,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://app.mailyte.com/api/v1/contact-events",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer mk_test_fixture",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "checkout_started",
          email: "buyer@example.test",
          unique_id: "TEST-shopify-webhook-42",
          properties: {
            totalPrice: "49.00",
            currency: "USD",
            lineItemsCount: 2,
          },
        }),
      })
    );
    expect(result).toEqual({
      success: true,
      eventId: "TEST-shopify-webhook-42",
      uniqueId: "TEST-shopify-webhook-42",
    });
  });

  it("uses the Shopify webhook ID for order_completed events too", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: "Accepted",
          data: { accepted: 1, duplicates: 0, rejected: [] },
          code: 200,
        }),
        { status: 202 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await new LiveMailyteProvider().sendOrderCompleted({
      orderId: "TEST-order-42",
      idempotencyKey: "TEST-shopify-webhook-43",
      email: "buyer@example.test",
    });

    expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toMatchObject(
      {
        event: "order_completed",
        unique_id: "TEST-shopify-webhook-43",
      }
    );
    expect(result.uniqueId).toBe("TEST-shopify-webhook-43");
  });

  it("does not report success when a 202 response contains rejected events", async () => {
    const logSpies = [
      vi.spyOn(console, "error").mockImplementation(() => undefined),
      vi.spyOn(console, "warn").mockImplementation(() => undefined),
      vi.spyOn(console, "info").mockImplementation(() => undefined),
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            message: "Accepted",
            data: {
              accepted: 0,
              duplicates: 0,
              rejected: [
                { index: 0, reason: "Invalid buyer@example.test address" },
              ],
            },
            code: 200,
          }),
          { status: 202 }
        )
      )
    );

    const request = new LiveMailyteProvider().sendCheckoutStarted({
      checkoutId: "TEST-checkout-42",
      email: "buyer@example.test",
    });

    await expect(request).rejects.toMatchObject({
      message: "Mailyte rejected 1 contact event(s)",
    });
    for (const spy of logSpies) expect(spy).not.toHaveBeenCalled();
  });

  it("uses the HTTP status instead of the response body code", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            message: "Accepted",
            data: { accepted: 1, duplicates: 0, rejected: [] },
            code: 200,
          }),
          { status: 200 }
        )
      )
    );

    await expect(
      new LiveMailyteProvider().sendCheckoutStarted({
        checkoutId: "TEST-checkout-42",
        email: "buyer@example.test",
      })
    ).rejects.toThrow("Mailyte request failed (200)");
  });

  it("handles 403 without exposing the response body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Missing contact_events:write for buyer@example.test", {
          status: 403,
        })
      )
    );

    await expect(
      new LiveMailyteProvider().sendCheckoutStarted({
        checkoutId: "TEST-checkout-42",
        email: "buyer@example.test",
      })
    ).rejects.toMatchObject({
      message:
        "Mailyte request forbidden (403); missing scope: contact_events:write",
    });
  });

  it("includes Retry-After seconds for rate limited responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Rate limit for buyer@example.test", {
          status: 429,
          headers: { "Retry-After": "17" },
        })
      )
    );

    await expect(
      new LiveMailyteProvider().sendCheckoutStarted({
        checkoutId: "TEST-checkout-42",
        email: "buyer@example.test",
      })
    ).rejects.toThrow("Mailyte rate limited (429); Retry-After: 17 seconds");
  });

  it("does not call the API when MAILYTE_API_KEY is missing", async () => {
    vi.stubEnv("MAILYTE_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new LiveMailyteProvider().sendCheckoutStarted({
        checkoutId: "TEST-checkout-42",
        email: "buyer@example.test",
      })
    ).rejects.toThrow("MAILYTE_API_KEY is required for the live provider");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
