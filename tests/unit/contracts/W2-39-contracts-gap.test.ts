import { describe, it, expect } from "vitest";
import { ContactInputSchema, type ContactInput } from "@/lib/contracts/forms";
import {
  OrderSchema,
  OrderItemSchema,
  OrderLineSchema,
  type Order,
  type OrderLine,
} from "@/lib/contracts/account";
import { mockFormsProvider } from "@/lib/providers/mock/forms";
import { mockAccountProvider } from "@/lib/providers/mock/account";
import { LiveAccountProvider } from "@/lib/providers/live";

describe("W2-39: Contracts Gaps", () => {
  describe("(1) forms.ts: ContactInput copy?: boolean", () => {
    it("accepts contact payload with copy = true", async () => {
      const payload: ContactInput = {
        name: "Test User",
        email: "test@example.com",
        topic: "order_help",
        message: "Need help with order",
        orderNumber: "NL-100234",
        copy: true,
      };

      const parsed = ContactInputSchema.parse(payload);
      expect(parsed.copy).toBe(true);

      const result = await mockFormsProvider.sendContact(payload);
      expect(result.success).toBe(true);
    });

    it("accepts contact payload with copy = false", () => {
      const parsed = ContactInputSchema.parse({
        name: "Test User",
        email: "test@example.com",
        topic: "order_help",
        message: "Need help with order",
        copy: false,
      });
      expect(parsed.copy).toBe(false);
    });

    it("accepts contact payload without copy (optional field)", () => {
      const parsed = ContactInputSchema.parse({
        name: "Test User",
        email: "test@example.com",
        topic: "order_help",
        message: "Need help with order",
      });
      expect(parsed.copy).toBeUndefined();
    });
  });

  describe("(2) account.ts: AccountProvider.lookupGuestOrder", () => {
    it("returns order for valid orderNumber and matching email", async () => {
      const order = await mockAccountProvider.lookupGuestOrder(
        "TEST-NL-0001",
        "test@example.com"
      );
      expect(order).not.toBeNull();
      expect(order?.orderNumber).toBe("TEST-NL-0001");
      expect(order).not.toHaveProperty("email");
    });

    it("is case-insensitive and trims whitespace on orderNumber and email", async () => {
      const order = await mockAccountProvider.lookupGuestOrder(
        " test-nl-0001 ",
        " TEST@EXAMPLE.COM "
      );
      expect(order).not.toBeNull();
      expect(order?.orderNumber).toBe("TEST-NL-0001");
    });

    it("also looks up by order id", async () => {
      const order = await mockAccountProvider.lookupGuestOrder(
        "ord_TEST_0001",
        "test@example.com"
      );
      expect(order).not.toBeNull();
      expect(order?.orderNumber).toBe("TEST-NL-0001");
    });

    it("returns null if order number exists but email does not match", async () => {
      const order = await mockAccountProvider.lookupGuestOrder(
        "TEST-NL-0001",
        "wrong.email@example.com"
      );
      expect(order).toBeNull();
    });

    it("returns null if order number does not exist", async () => {
      const order = await mockAccountProvider.lookupGuestOrder(
        "NL-999999",
        "test@example.com"
      );
      expect(order).toBeNull();
    });

    it("returns null for empty orderNumber or email", async () => {
      expect(
        await mockAccountProvider.lookupGuestOrder("", "test@test.com")
      ).toBeNull();
      expect(
        await mockAccountProvider.lookupGuestOrder("TEST-NL-0001", "")
      ).toBeNull();
    });

    it("throws not implemented in LiveAccountProvider", async () => {
      const live = new LiveAccountProvider();
      await expect(
        live.lookupGuestOrder("TEST-NL-0001", "test@test.com")
      ).rejects.toThrow(/not implemented: onda 4/);
    });
  });

  describe("(3) Order fields for Reorder/Buy again and Copy link", () => {
    it("validates OrderLineSchema with variantId and positive quantity", () => {
      const line: OrderLine = OrderLineSchema.parse({
        variantId: "var_biohack_1",
        quantity: 2,
      });
      expect(line.variantId).toBe("var_biohack_1");
      expect(line.quantity).toBe(2);

      expect(() =>
        OrderLineSchema.parse({ variantId: "var_1", quantity: 0 })
      ).toThrow();
    });

    it("validates OrderItemSchema with optional variantId", () => {
      const itemWithVariant = OrderItemSchema.parse({
        title: "BioHack",
        quantity: 1,
        price: { amount: 59, currencyCode: "USD" },
        variantId: "var_biohack_1",
      });
      expect(itemWithVariant.variantId).toBe("var_biohack_1");

      const itemWithoutVariant = OrderItemSchema.parse({
        title: "BioHack",
        quantity: 1,
        price: { amount: 59, currencyCode: "USD" },
      });
      expect(itemWithoutVariant.variantId).toBeUndefined();
    });

    it("validates OrderSchema with lines, url, statusUrl, and email", () => {
      const fullOrder: Order = OrderSchema.parse({
        id: "ord_custom_test",
        orderNumber: "NL-888888",
        createdAt: "2026-11-14T00:00:00Z",
        financialStatus: "paid",
        fulfillmentStatus: "delivered",
        email: "customer@example.com",
        items: [
          {
            title: "BioHack",
            quantity: 2,
            price: { amount: 118, currencyCode: "USD" },
            variantId: "var_biohack_1",
          },
        ],
        lines: [
          {
            variantId: "var_biohack_1",
            quantity: 2,
          },
        ],
        total: { amount: 118, currencyCode: "USD" },
        url: "/account/orders/ord_custom_test",
        statusUrl: "https://track.nadeonlabs.com/orders/NL-888888",
      });

      expect(fullOrder.lines?.[0].variantId).toBe("var_biohack_1");
      expect(fullOrder.lines?.[0].quantity).toBe(2);
      expect(fullOrder.url).toBe("/account/orders/ord_custom_test");
      expect(fullOrder.statusUrl).toBe(
        "https://track.nadeonlabs.com/orders/NL-888888"
      );
      expect(fullOrder.email).toBe("customer@example.com");
    });

    it("maintains backwards compatibility for orders without the new optional fields", () => {
      const minimalOrder = OrderSchema.parse({
        id: "ord_legacy",
        orderNumber: "NL-111111",
        createdAt: "2026-11-14T00:00:00Z",
        financialStatus: "paid",
        fulfillmentStatus: "processing",
        items: [
          {
            title: "BioHack",
            quantity: 1,
            price: { amount: 59, currencyCode: "USD" },
          },
        ],
        total: { amount: 59, currencyCode: "USD" },
      });

      expect(minimalOrder.lines).toBeUndefined();
      expect(minimalOrder.url).toBeUndefined();
      expect(minimalOrder.statusUrl).toBeUndefined();
      expect(minimalOrder.email).toBeUndefined();
    });

    it("mock orders contain lines and links enabling reorder and copy link", async () => {
      const orders = await mockAccountProvider.getOrders();
      expect(orders.length).toBeGreaterThan(0);

      for (const order of orders) {
        expect(order.lines).toBeDefined();
        expect(order.lines!.length).toBeGreaterThan(0);
        for (const line of order.lines!) {
          expect(line.variantId).toBeTruthy();
          expect(line.quantity).toBeGreaterThan(0);
        }
        expect(order.url).toBeTruthy();
        expect(order.statusUrl).toBeTruthy();
        expect(order.email).toBe("test@example.com");
      }
    });
  });
});
