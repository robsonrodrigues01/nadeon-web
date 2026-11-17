import crypto from "crypto";
import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { POST } from "@/app/api/webhooks/route";
import { mockMailyteProvider } from "@/lib/providers/mock/mailyte";

const revalidatePathMock = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

function signPayload(body: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");
}

describe("POST /api/webhooks", () => {
  const TEST_SECRET = "TEST_webhook_secret_key_1234567890";
  let originalEnvSecret: string | undefined;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    originalEnvSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    process.env.SHOPIFY_WEBHOOK_SECRET = TEST_SECRET;
    mockMailyteProvider.clearRecordedEvents();
    revalidatePathMock.mockClear();
    consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.SHOPIFY_WEBHOOK_SECRET = originalEnvSecret;
    consoleInfoSpy.mockRestore();
  });

  it("returns 401 when SHOPIFY_WEBHOOK_SECRET is not configured", async () => {
    delete process.env.SHOPIFY_WEBHOOK_SECRET;

    const request = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": "fake-hmac",
        "x-shopify-topic": "checkouts/create",
      },
      body: JSON.stringify({ id: "TEST-1" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    expect(await response.text()).toContain("missing secret");
  });

  it("returns 401 when x-shopify-hmac-sha256 header is missing", async () => {
    const request = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-topic": "checkouts/create",
      },
      body: JSON.stringify({ id: "TEST-1" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    expect(await response.text()).toContain("missing HMAC header");
  });

  it("returns 401 when HMAC signature is invalid", async () => {
    const body = JSON.stringify({ id: "TEST-checkout-1" });
    const wrongSignature = signPayload(body, "WRONG_SECRET");

    const request = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": wrongSignature,
        "x-shopify-topic": "checkouts/create",
      },
      body,
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    expect(await response.text()).toContain("invalid HMAC signature");
  });

  it("returns 400 when body is not valid JSON", async () => {
    const invalidBody = "invalid-json-{";
    const signature = signPayload(invalidBody, TEST_SECRET);

    const request = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": signature,
        "x-shopify-topic": "checkouts/create",
      },
      body: invalidBody,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("invalid JSON payload");
  });

  it("returns 400 when body is null or non-object JSON", async () => {
    for (const invalidPayload of ["null", "123", '"plain string"', "[]"]) {
      const signature = signPayload(invalidPayload, TEST_SECRET);

      const request = new Request("http://localhost:3000/api/webhooks", {
        method: "POST",
        headers: {
          "x-shopify-hmac-sha256": signature,
          "x-shopify-topic": "checkouts/create",
        },
        body: invalidPayload,
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      expect(await response.text()).toContain("invalid JSON payload");
    }
  });

  it("returns 400 when expected fields are missing for a topic", async () => {
    // Missing checkout id / token
    const emptyCheckoutBody = JSON.stringify({ email: "test@example.com" });
    const checkoutSig = signPayload(emptyCheckoutBody, TEST_SECRET);
    const checkoutReq = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": checkoutSig,
        "x-shopify-topic": "checkouts/create",
      },
      body: emptyCheckoutBody,
    });
    const checkoutRes = await POST(checkoutReq);
    expect(checkoutRes.status).toBe(400);
    expect(await checkoutRes.text()).toContain("missing checkout id");

    // Missing order id
    const emptyOrderBody = JSON.stringify({ email: "test@example.com" });
    const orderSig = signPayload(emptyOrderBody, TEST_SECRET);
    const orderReq = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": orderSig,
        "x-shopify-topic": "orders/create",
      },
      body: emptyOrderBody,
    });
    const orderRes = await POST(orderReq);
    expect(orderRes.status).toBe(400);
    expect(await orderRes.text()).toContain("missing order id");

    // Missing product id and handle
    const emptyProductBody = JSON.stringify({ title: "TEST" });
    const productSig = signPayload(emptyProductBody, TEST_SECRET);
    const productReq = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": productSig,
        "x-shopify-topic": "products/update",
      },
      body: emptyProductBody,
    });
    const productRes = await POST(productReq);
    expect(productRes.status).toBe(400);
    expect(await productRes.text()).toContain("missing product id or handle");
  });

  it("returns 400 for invalid checkout and order emails without logging them", async () => {
    for (const [topic, payload] of [
      [
        "checkouts/create",
        {
          id: "TEST-invalid-email-checkout",
          email: "private.person@example.com ",
        },
      ],
      [
        "orders/create",
        {
          id: "TEST-invalid-email-order",
          email: "private.person@example.com ",
        },
      ],
    ] as const) {
      const body = JSON.stringify(payload);
      const request = new Request("http://localhost:3000/api/webhooks", {
        method: "POST",
        headers: {
          "x-shopify-hmac-sha256": signPayload(body, TEST_SECRET),
          "x-shopify-topic": topic,
        },
        body,
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      expect((await response.text()).toLowerCase()).not.toContain(
        "private.person"
      );
    }

    const allLogs = consoleInfoSpy.mock.calls
      .map((call: unknown[]) => call.join(" "))
      .join(" ");
    expect(allLogs).not.toContain("private.person@example.com");
  });

  it("processes checkouts/create and triggers Mailyte checkout_started without logging PII", async () => {
    const payload = {
      id: "TEST-checkout-9901",
      token: "TEST-token-9901",
      email: "test.shopper@example.com",
      total_price: "149.00",
      currency: "USD",
      line_items: [{ id: 1, title: "TEST Product" }],
      abandoned_checkout_url: "https://example.com/checkout/TEST-checkout-9901",
    };
    const body = JSON.stringify(payload);
    const signature = signPayload(body, TEST_SECRET);

    const request = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": signature,
        "x-shopify-topic": "checkouts/create",
      },
      body,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });

    const lastEvent = mockMailyteProvider.getLastEvent();
    expect(lastEvent).toBeDefined();
    expect(lastEvent?.eventName).toBe("checkout_started");
    expect(lastEvent?.uniqueId).toBe("TEST-checkout-9901");

    // Strict no-PII in console checks
    const allLogs = consoleInfoSpy.mock.calls
      .map((call: unknown[]) => call.join(" "))
      .join(" ");
    expect(allLogs).toContain("topic=checkouts/create");
    expect(allLogs).toContain("id=TEST-checkout-9901");
    expect(allLogs).not.toContain("test.shopper@example.com");
  });

  it("uses Shopify webhook IDs to ignore repeated checkout and order deliveries", async () => {
    const deliveries = [
      [
        "checkouts/create",
        "TEST-delivery-checkout",
        { id: "TEST-checkout-9902" },
      ],
      ["orders/create", "TEST-delivery-order", { id: "TEST-order-8803" }],
    ] as const;

    for (const [topic, webhookId, payload] of deliveries) {
      const body = JSON.stringify(payload);
      const makeRequest = () =>
        new Request("http://localhost:3000/api/webhooks", {
          method: "POST",
          headers: {
            "x-shopify-hmac-sha256": signPayload(body, TEST_SECRET),
            "x-shopify-topic": topic,
            "x-shopify-webhook-id": webhookId,
          },
          body,
        });

      expect((await POST(makeRequest())).status).toBe(200);
      expect((await POST(makeRequest())).status).toBe(200);
    }

    expect(mockMailyteProvider.getRecordedEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventName: "checkout_started",
          uniqueId: "TEST-delivery-checkout",
        }),
        expect.objectContaining({
          eventName: "order_completed",
          uniqueId: "TEST-delivery-order",
        }),
      ])
    );
    expect(mockMailyteProvider.getRecordedEvents()).toHaveLength(2);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("processes orders/create and triggers Mailyte order_completed without logging PII", async () => {
    const payload = {
      id: "TEST-order-8802",
      order_number: 1088,
      email: "test.customer@example.com",
      total_price: "220.00",
      currency: "USD",
      line_items: [{ id: 101, title: "TEST Kit" }],
    };
    const body = JSON.stringify(payload);
    const signature = signPayload(body, TEST_SECRET);

    const request = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": signature,
        "x-shopify-topic": "orders/create",
      },
      body,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });

    const lastEvent = mockMailyteProvider.getLastEvent();
    expect(lastEvent).toBeDefined();
    expect(lastEvent?.eventName).toBe("order_completed");
    expect(lastEvent?.uniqueId).toBe("TEST-order-8802");

    // Strict no-PII in console checks
    const allLogs = consoleInfoSpy.mock.calls
      .map((call: unknown[]) => call.join(" "))
      .join(" ");
    expect(allLogs).toContain("topic=orders/create");
    expect(allLogs).toContain("id=TEST-order-8802");
    expect(allLogs).not.toContain("test.customer@example.com");
  });

  it("processes products/update and revalidates product and catalog routes", async () => {
    const payload = {
      id: 7701,
      handle: "TEST-super-blend",
      title: "TEST Super Blend",
    };
    const body = JSON.stringify(payload);
    const signature = signPayload(body, TEST_SECRET);

    const request = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": signature,
        "x-shopify-topic": "products/update",
      },
      body,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });

    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/human/products/TEST-super-blend"
    );
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/pet/products/TEST-super-blend"
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/human/shop");
    expect(revalidatePathMock).toHaveBeenCalledWith("/pet/dogs");
    expect(revalidatePathMock).toHaveBeenCalledWith("/pet/cats");
    expect(revalidatePathMock).toHaveBeenCalledWith("/pet/horses");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
  });

  it("handles unknown topics gracefully with status 200", async () => {
    const payload = { id: "TEST-unknown-1" };
    const body = JSON.stringify(payload);
    const signature = signPayload(body, TEST_SECRET);

    const request = new Request("http://localhost:3000/api/webhooks", {
      method: "POST",
      headers: {
        "x-shopify-hmac-sha256": signature,
        "x-shopify-topic": "customers/update",
      },
      body,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });

    const allLogs = consoleInfoSpy.mock.calls
      .map((call: unknown[]) => call.join(" "))
      .join(" ");
    expect(allLogs).toContain("topic=customers/update status=ignored");
  });
});
