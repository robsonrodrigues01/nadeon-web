/** @vitest-environment jsdom */
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";

import apiDiscoveryFixture from "../../fixtures/shopify/customer-api-discovery.json";
import tokenFixture from "../../fixtures/shopify/customer-token.json";
import ordersFixture from "../../fixtures/shopify/customer-orders.json";
import ordersEmptyFixture from "../../fixtures/shopify/customer-orders-empty.json";
import orderDetailFixture from "../../fixtures/shopify/customer-order-detail.json";
import orderNotFoundFixture from "../../fixtures/shopify/customer-order-not-found.json";
import addressesFixture from "../../fixtures/shopify/customer-addresses.json";

import { OrderSchema, AddressSchema } from "@/lib/contracts/account";
import {
  LiveAccountProvider,
  SESSION_COOKIE_NAMES,
  type CookieStoreAdapter,
} from "@/lib/providers/live/account";
import {
  deriveFulfillmentStatus,
  mapFinancialStatus,
  normalizeOrderId,
  ORDERS_PAGE_SIZE,
} from "@/lib/providers/live/account-orders";
import { OrderDetailView } from "@/app/(account)/account/orders/_components/order-detail-view";
import { OrderCard } from "@/app/(account)/account/orders/_components/order-card";
import {
  toOrderDetailView,
  toOrderRowView,
} from "@/app/(account)/account/orders/_components/order-view";
import { createOrderFormatters } from "@/app/(account)/account/orders/_components/order-market";
import { DEFAULT_MARKET } from "@/lib/market";

const providerMode = vi.hoisted(() => ({ live: false }));

vi.mock("@/lib/providers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/providers")>();
  return {
    ...actual,
    getLiveProviderKeys: () =>
      providerMode.live ? new Set(["account"]) : new Set<string>(),
    accountProvider: {
      ...actual.accountProvider,
      signInUrl: async (returnTo: string) =>
        `/account/auth/login?returnTo=${encodeURIComponent(returnTo)}`,
    },
  };
});
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));
vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));
vi.mock("@/components/layout/header", () => ({ Header: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));

import TrackOrderPage from "@/app/(shared)/track/page";
import HelpPage from "@/app/(shared)/help/page";

const TEST_SHOP_ID = "999999999";
const GRAPHQL_URL = apiDiscoveryFixture.graphql_api;

function createMemoryCookies(
  initial: Record<string, string> = {}
): CookieStoreAdapter {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    get(name: string) {
      const value = store.get(name);
      return value !== undefined ? { value } : undefined;
    },
    set(name: string, value: string) {
      store.set(name, value);
    },
    delete(name: string) {
      store.delete(name);
    },
  };
}

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as Response;
}

function signedInCookies(): CookieStoreAdapter {
  return createMemoryCookies({
    [SESSION_COOKIE_NAMES.accessToken]: tokenFixture.access_token,
    [SESSION_COOKIE_NAMES.expiresAt]: new Date(
      Date.now() + 30 * 60 * 1000
    ).toISOString(),
    [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
  });
}

function graphqlFetch(
  respond: (body: {
    query: string;
    variables: Record<string, unknown>;
  }) => Response | Promise<Response>
) {
  return vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    if (u.endsWith("/.well-known/customer-account-api")) {
      return jsonResponse(apiDiscoveryFixture);
    }
    if (u === GRAPHQL_URL) {
      return respond(JSON.parse(String(init?.body ?? "{}")));
    }
    return jsonResponse({}, 404);
  });
}

const ORDER_IDS = ordersFixture.data.customer.orders.nodes.map((o) => o.id);

describe("W4-37 live orders and addresses", () => {
  beforeEach(() => {
    vi.stubEnv("SHOPIFY_SHOP_ID", TEST_SHOP_ID);
    vi.stubEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID", "TEST-client-id");
    providerMode.live = false;
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("status mapping", () => {
    it.each([
      ["PAID", "paid"],
      ["PARTIALLY_REFUNDED", "paid"],
      ["REFUNDED", "refunded"],
      ["VOIDED", "refunded"],
      ["PENDING", "pending"],
      ["AUTHORIZED", "pending"],
      ["PARTIALLY_PAID", "pending"],
      ["EXPIRED", "pending"],
      [null, "pending"],
    ])("financial %s -> %s", (raw, expected) => {
      expect(mapFinancialStatus(raw)).toBe(expected);
    });

    it.each([
      ["no fulfillments", [], "processing"],
      [
        "open fulfillment without shipment",
        [{ status: "OPEN", latestShipmentStatus: null }],
        "processing",
      ],
      [
        "label printed only",
        [{ status: "SUCCESS", latestShipmentStatus: "LABEL_PRINTED" }],
        "processing",
      ],
      [
        "success without shipment event",
        [{ status: "SUCCESS", latestShipmentStatus: null }],
        "in_transit",
      ],
      [
        "in transit",
        [{ status: "SUCCESS", latestShipmentStatus: "IN_TRANSIT" }],
        "in_transit",
      ],
      [
        "out for delivery",
        [{ status: "SUCCESS", latestShipmentStatus: "OUT_FOR_DELIVERY" }],
        "in_transit",
      ],
      [
        "delivered",
        [{ status: "SUCCESS", latestShipmentStatus: "DELIVERED" }],
        "delivered",
      ],
      [
        "one delivered and one in transit",
        [
          { status: "SUCCESS", latestShipmentStatus: "DELIVERED" },
          { status: "SUCCESS", latestShipmentStatus: "IN_TRANSIT" },
        ],
        "in_transit",
      ],
      [
        "cancelled fulfillment is ignored",
        [
          { status: "CANCELLED", latestShipmentStatus: "IN_TRANSIT" },
          { status: "SUCCESS", latestShipmentStatus: "DELIVERED" },
        ],
        "delivered",
      ],
      [
        "only cancelled fulfillments",
        [{ status: "CANCELLED", latestShipmentStatus: null }],
        "processing",
      ],
    ])("fulfillments: %s -> %s", (_label, fulfillments, expected) => {
      expect(deriveFulfillmentStatus(fulfillments)).toBe(expected);
    });
  });

  describe("getOrders", () => {
    it("maps recorded orders, requests newest first with a cap, and sends the raw token", async () => {
      let sent: { query: string; variables: Record<string, unknown> } | null =
        null;
      let auth = "";
      const fetchMock = vi.fn(
        async (url: string | URL | Request, init?: RequestInit) => {
          const u = String(url);
          if (u.endsWith("/.well-known/customer-account-api")) {
            return jsonResponse(apiDiscoveryFixture);
          }
          sent = JSON.parse(String(init?.body ?? "{}"));
          auth = (init?.headers as Record<string, string>).Authorization;
          return jsonResponse(ordersFixture);
        }
      );
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: fetchMock,
      });

      const orders = await provider.getOrders();

      expect(auth).toBe(tokenFixture.access_token);
      expect(sent!.query).toContain("sortKey: PROCESSED_AT");
      expect(sent!.query).toContain("reverse: true");
      expect(sent!.variables).toEqual({ first: ORDERS_PAGE_SIZE });
      expect(orders).toHaveLength(4);
      orders.forEach((o) => expect(() => OrderSchema.parse(o)).not.toThrow());

      const [delivered, inTransit, processing, minimal] = orders;
      expect(delivered).toMatchObject({
        id: "gid://shopify/Order/5550001?key=TESTkeyA",
        orderNumber: "NL-100234",
        createdAt: "2026-10-20T15:04:05Z",
        financialStatus: "paid",
        fulfillmentStatus: "delivered",
        total: { amount: 118, currencyCode: "USD" },
        trackingNumber: "1ZTEST0000000001",
        trackingUrl: "https://www.ups.com/track?tracknum=1ZTEST0000000001",
        statusUrl:
          "https://shopify.com/999999999/account/orders/5550001?key=TESTkeyA",
        url: "/account/orders/gid%3A%2F%2Fshopify%2FOrder%2F5550001%3Fkey%3DTESTkeyA",
        canReorder: true,
      });
      expect(delivered.shippingAddress).toMatchObject({
        firstName: "TEST Alex",
        address1: "100 TEST Main St",
        province: "NJ",
        country: "US",
        zip: "07011",
      });
      expect(delivered.items[0]).toEqual({
        title: "TEST BioHack",
        quantity: 1,
        price: { amount: 118, currencyCode: "USD" },
        image: "https://cdn.shopify.com/s/files/TEST/biohack.png",
        variantTitle: "2 Jars",
        variantId: "gid://shopify/ProductVariant/777001",
      });

      expect(inTransit.fulfillmentStatus).toBe("in_transit");
      expect(inTransit.items).toHaveLength(2);
      expect(inTransit.items[1]).toMatchObject({
        quantity: 2,
        price: { amount: 22, currencyCode: "USD" },
      });

      expect(processing).toMatchObject({
        fulfillmentStatus: "processing",
        financialStatus: "pending",
      });
      expect(processing.trackingNumber).toBeUndefined();

      expect(minimal.orderNumber).toBe("100237");
      expect(minimal.financialStatus).toBe("pending");
      expect(minimal.fulfillmentStatus).toBe("processing");
      expect(minimal.total).toEqual({ amount: 0, currencyCode: "USD" });
      expect(minimal.shippingAddress).toBeUndefined();
      expect(minimal.statusUrl).toBeUndefined();
      expect(minimal.trackingNumber).toBeUndefined();
      expect(minimal.items).toHaveLength(1);
      expect(minimal.items[0].image).toBeUndefined();
      expect(minimal.items[0].variantId).toBeUndefined();
      expect(minimal.lines).toEqual([]);
      expect(minimal.canReorder).toBe(false);
    });

    it("returns [] for a customer without orders", async () => {
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse(ordersEmptyFixture)),
      });
      await expect(provider.getOrders()).resolves.toEqual([]);
    });

    it("returns [] without a session and makes no request", async () => {
      const fetchMock = graphqlFetch(() => jsonResponse(ordersFixture));
      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies(),
        fetchImpl: fetchMock,
      });
      await expect(provider.getOrders()).resolves.toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it.each([401, 403])("returns [] on HTTP %s", async (status) => {
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse({}, status)),
      });
      await expect(provider.getOrders()).resolves.toEqual([]);
    });

    it("throws on 5xx and on GraphQL errors instead of falling back to mock", async () => {
      const failing = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse({}, 502)),
      });
      await expect(failing.getOrders()).rejects.toThrow(/502/);

      const gqlError = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() =>
          jsonResponse({ errors: [{ message: "TEST boom" }] })
        ),
      });
      await expect(gqlError.getOrders()).rejects.toThrow(/TEST boom/);
    });
  });

  describe("getOrder", () => {
    const ID = orderDetailFixture.data.order.id;

    it("queries order(id:) and maps the detail", async () => {
      let variables: Record<string, unknown> = {};
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch((body) => {
          variables = body.variables;
          return jsonResponse(orderDetailFixture);
        }),
      });

      const order = await provider.getOrder(ID);
      expect(variables).toEqual({ id: ID });
      expect(order).toMatchObject({
        id: ID,
        orderNumber: "NL-100235",
        fulfillmentStatus: "in_transit",
        total: { amount: 162, currencyCode: "USD" },
        trackingNumber: "1ZTEST0000000002",
        statusUrl:
          "https://shopify.com/999999999/account/orders/5550002?key=TESTkeyB",
      });
      expect(order?.items).toHaveLength(2);
    });

    it("accepts a URL-encoded id from a route param", async () => {
      let variables: Record<string, unknown> = {};
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch((body) => {
          variables = body.variables;
          return jsonResponse(orderDetailFixture);
        }),
      });
      await provider.getOrder(encodeURIComponent(ID));
      expect(variables).toEqual({ id: ID });
    });

    it("returns null when Shopify has no such order for the customer", async () => {
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse(orderNotFoundFixture)),
      });
      await expect(provider.getOrder(ID)).resolves.toBeNull();
    });

    it.each([
      "",
      "ord_1",
      "gid://shopify/Customer/1",
      "%E0%A4%A",
      "gid://shopify/Order/1 }",
    ])(
      "returns null for a malformed id (%s) without a request",
      async (bad) => {
        const fetchMock = graphqlFetch(() => jsonResponse(orderDetailFixture));
        const provider = new LiveAccountProvider({
          cookies: signedInCookies(),
          fetchImpl: fetchMock,
        });
        await expect(provider.getOrder(bad)).resolves.toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
      }
    );

    it("returns null without a session and on 401", async () => {
      const noSession = new LiveAccountProvider({
        cookies: createMemoryCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse(orderDetailFixture)),
      });
      await expect(noSession.getOrder(ID)).resolves.toBeNull();

      const unauthorized = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse({}, 401)),
      });
      await expect(unauthorized.getOrder(ID)).resolves.toBeNull();
    });

    it("throws on 5xx", async () => {
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse({}, 500)),
      });
      await expect(provider.getOrder(ID)).rejects.toThrow(/500/);
    });

    it("normalizeOrderId only accepts order GIDs", () => {
      expect(normalizeOrderId(ORDER_IDS[0])).toBe(ORDER_IDS[0]);
      expect(normalizeOrderId("gid://shopify/Order/12")).toBe(
        "gid://shopify/Order/12"
      );
      expect(normalizeOrderId("12")).toBeNull();
    });
  });

  describe("reorder", () => {
    it("returns the order lines with variant GIDs and quantities", async () => {
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse(orderDetailFixture)),
      });
      const lines = await provider.reorder(orderDetailFixture.data.order.id);
      expect(lines).toEqual([
        {
          variantId: "gid://shopify/ProductVariant/777002",
          quantity: 1,
          image: "https://cdn.shopify.com/s/files/TEST/biohack.png",
          title: "TEST BioHack",
          price: { amount: 118, currencyCode: "USD" },
        },
        {
          variantId: "gid://shopify/ProductVariant/777003",
          quantity: 2,
          image: "https://cdn.shopify.com/s/files/TEST/biohack.png",
          title: "TEST More Good Years",
          price: { amount: 22, currencyCode: "USD" },
        },
      ]);
    });

    it("throws when the order is not found", async () => {
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse(orderNotFoundFixture)),
      });
      await expect(
        provider.reorder(orderDetailFixture.data.order.id)
      ).rejects.toThrow(/Order not found/);
    });
  });

  describe("getAddresses", () => {
    it("maps addresses, flags the default and tolerates missing fields", async () => {
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse(addressesFixture)),
      });
      const addresses = await provider.getAddresses();
      addresses.forEach((a) =>
        expect(() => AddressSchema.parse(a)).not.toThrow()
      );
      expect(addresses.map((a) => a.isDefault)).toEqual([false, true, false]);
      expect(addresses[0]).toMatchObject({
        id: "gid://shopify/CustomerAddress/888000111",
        company: "TEST Co",
        address1: "1 TEST Side St",
        province: "NJ",
      });
      expect(addresses[0].address2).toBeUndefined();
      expect(addresses[0].phone).toBeUndefined();
      expect(addresses[1]).toMatchObject({
        address2: "Apt 4",
        phone: "+15550109999",
      });
      expect(addresses[2]).toMatchObject({
        firstName: "",
        lastName: "",
        province: undefined,
        country: "US",
      });
    });

    it("returns [] without a session or on 401, throws on 5xx", async () => {
      const noSession = new LiveAccountProvider({
        cookies: createMemoryCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse(addressesFixture)),
      });
      await expect(noSession.getAddresses()).resolves.toEqual([]);

      const unauthorized = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse({}, 401)),
      });
      await expect(unauthorized.getAddresses()).resolves.toEqual([]);

      const failing = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse({}, 503)),
      });
      await expect(failing.getAddresses()).rejects.toThrow(/503/);
    });
  });

  describe("lookupGuestOrder", () => {
    it("returns null without any network call", async () => {
      const fetchMock = vi.fn();
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: fetchMock as unknown as typeof fetch,
      });
      await expect(
        provider.lookupGuestOrder("NL-100234", "guest@example.com")
      ).resolves.toBeNull();
      await expect(
        provider.lookupGuestOrder({
          orderNumber: "NL-100234",
          email: "guest@example.com",
        })
      ).resolves.toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("orders UI with live data", () => {
    const formatters = createOrderFormatters(DEFAULT_MARKET);

    async function loadOrders() {
      const provider = new LiveAccountProvider({
        cookies: signedInCookies(),
        fetchImpl: graphqlFetch(() => jsonResponse(ordersFixture)),
      });
      return provider.getOrders();
    }

    it("detail links to the Shopify order status page in a new tab", async () => {
      const [order] = await loadOrders();
      render(<OrderDetailView order={toOrderDetailView(order, formatters)} />);
      const link = screen.getByRole("link", {
        name: /View order status on Shopify/,
      });
      expect(link.getAttribute("href")).toBe(order.statusUrl);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    });

    it("detail renders an order with missing optional fields", async () => {
      const orders = await loadOrders();
      const minimal = orders[3];
      render(
        <OrderDetailView order={toOrderDetailView(minimal, formatters)} />
      );
      expect(
        screen.getByRole("heading", { level: 1, name: "Order #100237" })
      ).toBeTruthy();
      expect(screen.queryByText(/View order status on Shopify/)).toBeNull();
      expect(screen.queryByText("Shipping address")).toBeNull();
      expect(screen.queryByText("Shipment")).toBeNull();
    });

    it("card links to the detail route with an encoded order id", async () => {
      const [order] = await loadOrders();
      render(<OrderCard row={toOrderRowView(order, formatters)} />);
      const details = screen.getByRole("link", { name: "Details" });
      expect(details.getAttribute("href")).toBe(
        `/account/orders/${encodeURIComponent(order.id)}`
      );
    });

    it("card renders an order with missing optional fields", async () => {
      const orders = await loadOrders();
      render(<OrderCard row={toOrderRowView(orders[3], formatters)} />);
      expect(screen.getByText("Order #100237")).toBeTruthy();
    });
  });

  describe("/track and /help in live mode", () => {
    it("/track shows the Shopify explanation and sign-in link, and no lookup form", async () => {
      providerMode.live = true;
      render(await TrackOrderPage());

      expect(
        screen.getByRole("heading", { level: 1, name: "Track your order" })
      ).toBeTruthy();
      expect(
        screen.getByText(/Your order status page is on Shopify/)
      ).toBeTruthy();
      expect(screen.getByText("View your order")).toBeTruthy();
      expect(
        screen.getByText(/Open the order confirmation email from Nadeon Labs/)
      ).toBeTruthy();
      const signIn = screen.getByRole("link", {
        name: "Sign in to see your orders",
      });
      expect(signIn.getAttribute("href")).toBe(
        "/account/auth/login?returnTo=%2Faccount%2Forders"
      );
      expect(document.querySelector("form")).toBeNull();
      expect(screen.queryByLabelText("Order number")).toBeNull();
      expect(screen.queryByRole("button", { name: /Track order/ })).toBeNull();
    });

    it("/track keeps the guest lookup form in mock mode", async () => {
      providerMode.live = false;
      render(await TrackOrderPage());

      expect(
        screen.getByText(
          "No account needed. Enter your order number and the email you used at checkout."
        )
      ).toBeTruthy();
      expect(screen.getByLabelText("Order number")).toBeTruthy();
      expect(screen.getByLabelText("Email")).toBeTruthy();
      expect(screen.queryByText("View your order")).toBeNull();
    });

    it("/help replaces the order lookup form with the Shopify explanation", () => {
      providerMode.live = true;
      render(<HelpPage />);
      const track = document.getElementById("track") as HTMLElement;

      expect(within(track).getByText("View your order")).toBeTruthy();
      expect(
        within(track)
          .getByRole("link", { name: "Sign in to see your orders" })
          .getAttribute("href")
      ).toBe("/account/orders");
      expect(track.querySelector("form")).toBeNull();
      expect(within(track).queryByRole("textbox")).toBeNull();
      expect(
        within(track).queryByRole("button", { name: /Track order/ })
      ).toBeNull();
    });

    it("/help keeps the order lookup form in mock mode", () => {
      providerMode.live = false;
      render(<HelpPage />);
      const track = document.getElementById("track") as HTMLElement;

      expect(within(track).getByLabelText("Order number")).toBeTruthy();
      expect(
        within(track).getByRole("button", { name: "Track order" })
      ).toBeTruthy();
      expect(within(track).queryByText("View your order")).toBeNull();
    });
  });
});
