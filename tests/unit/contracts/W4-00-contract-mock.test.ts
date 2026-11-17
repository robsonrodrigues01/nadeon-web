import { describe, it, expect, beforeEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  OrderSchema,
  OrderItemSchema,
  OrderLineSchema,
  GuestOrderLookupInputSchema,
  type Order,
  type GuestOrderLookupInput,
} from "@/lib/contracts/account";
import { ContactInputSchema, type ContactInput } from "@/lib/contracts/forms";
import { mockAccountProvider } from "@/lib/providers/mock/account";
import { mockFormsProvider } from "@/lib/providers/mock/forms";
import { LiveAccountProvider } from "@/lib/providers/live";

const publicDir = path.resolve(process.cwd(), "public");

describe("W4-00: Contract & Mock (Pre-Wave 4)", () => {
  beforeEach(() => {
    mockFormsProvider.clearLastContactSubmission();
  });

  describe("(1) Consulta de pedido de visitante por número + e-mail (/track estado B)", () => {
    it("validates GuestOrderLookupInputSchema with required order number and valid email", () => {
      const valid: GuestOrderLookupInput = {
        orderNumber: "TEST-NL-0001",
        email: "test@example.com",
      };
      const parsed = GuestOrderLookupInputSchema.parse(valid);
      expect(parsed.orderNumber).toBe("TEST-NL-0001");
      expect(parsed.email).toBe("test@example.com");

      expect(() =>
        GuestOrderLookupInputSchema.parse({
          orderNumber: "",
          email: "test@example.com",
        })
      ).toThrow();

      expect(() =>
        GuestOrderLookupInputSchema.parse({
          orderNumber: "TEST-NL-0001",
          email: "invalid-email",
        })
      ).toThrow();
    });

    it("lookupGuestOrder accepts orderNumber and email and returns only tracking fields", async () => {
      const order = await mockAccountProvider.lookupGuestOrder(
        "TEST-NL-0001",
        "test@example.com"
      );
      expect(order).not.toBeNull();
      expect(order?.orderNumber).toBe("TEST-NL-0001");
      expect(order).toEqual({
        orderNumber: "TEST-NL-0001",
        createdAt: expect.any(String),
        fulfillmentStatus: "delivered",
        items: expect.any(Array),
        trackingNumber: "1Z9999999999999999",
        trackingUrl: expect.any(String),
      });
    });

    it("lookupGuestOrder accepts GuestOrderLookupInput object and returns order", async () => {
      const order = await mockAccountProvider.lookupGuestOrder({
        orderNumber: "TEST-NL-0001",
        email: "test@example.com",
      });
      expect(order).not.toBeNull();
      expect(order?.orderNumber).toBe("TEST-NL-0001");
      expect(order?.fulfillmentStatus).toBe("delivered");
      expect(order).not.toHaveProperty("email");
      expect(order).not.toHaveProperty("total");
    });

    it("is case-insensitive and trims whitespace on both order number and email", async () => {
      const order = await mockAccountProvider.lookupGuestOrder(
        "  test-nl-0002  ",
        "  TEST@EXAMPLE.COM  "
      );
      expect(order).not.toBeNull();
      expect(order?.orderNumber).toBe("TEST-NL-0002");
    });

    it("returns null when order number does not match email or does not exist", async () => {
      const notFoundWrongEmail = await mockAccountProvider.lookupGuestOrder(
        "TEST-NL-0001",
        "intruder@example.invalid"
      );
      expect(notFoundWrongEmail).toBeNull();

      const notFoundOrder = await mockAccountProvider.lookupGuestOrder(
        "TEST-NL-0000",
        "test@example.com"
      );
      expect(notFoundOrder).toBeNull();
    });

    it("throws not implemented in LiveAccountProvider with TODO comment", async () => {
      const live = new LiveAccountProvider();
      await expect(
        live.lookupGuestOrder("TEST-NL-0001", "test@example.com")
      ).rejects.toThrow(/not implemented: onda 4/);
    });
  });

  describe("(2) Copy link e Reorder de um pedido da conta", () => {
    it("orders have url, copyLink, and lines for copying and reordering", async () => {
      const orders = await mockAccountProvider.getOrders();
      expect(orders.length).toBeGreaterThan(0);

      for (const order of orders) {
        expect(order.url).toBeTruthy();
        expect(order.copyLink).toBeTruthy();
        expect(order.copyLink).toBe(order.url);
        expect(order.canReorder).toBe(true);
        expect(order.lines).toBeDefined();
        expect(order.lines!.length).toBeGreaterThan(0);

        for (const line of order.lines!) {
          expect(line.variantId).toBeTruthy();
          expect(line.quantity).toBeGreaterThan(0);
          expect(OrderLineSchema.parse(line)).toBeDefined();
        }
      }
    });

    it("mockAccountProvider.reorder returns order lines for a valid order", async () => {
      const lines = await mockAccountProvider.reorder("TEST-NL-0001");
      expect(lines.length).toBeGreaterThan(0);
      expect(lines[0].variantId).toBe("var_biohack_1");
      expect(lines[0].quantity).toBe(1);
    });

    it("mockAccountProvider.reorder also looks up by order id", async () => {
      const lines = await mockAccountProvider.reorder("ord_TEST_0002");
      expect(lines.length).toBeGreaterThan(0);
      expect(lines[0].variantId).toBe("var_mgy_2");
      expect(lines[0].quantity).toBe(1);
    });

    it("mockAccountProvider.reorder throws an error for unknown order", async () => {
      await expect(
        mockAccountProvider.reorder("ord_unknown_999")
      ).rejects.toThrow(/Order not found/);
    });

    it("LiveAccountProvider.reorder throws not implemented error", async () => {
      const live = new LiveAccountProvider();
      await expect(live.reorder("ord_TEST_0001")).rejects.toThrow(
        /not implemented: onda 4/
      );
    });
  });

  describe("(3) Miniaturas (imagem) dos itens do pedido", () => {
    it("validates OrderItemSchema with thumbnail image", () => {
      const item = OrderItemSchema.parse({
        title: "BioHack - 2 Jars (60 days)",
        quantity: 1,
        price: { amount: 118, currencyCode: "USD" },
        image: "/renders/biohack.png",
        variantTitle: "2 Jars",
        variantId: "var_biohack_1",
      });
      expect(item.image).toBe("/renders/biohack.png");
    });

    it("every item in mock account orders contains a valid thumbnail image pointing to public/", async () => {
      const orders = await mockAccountProvider.getOrders();
      expect(orders.length).toBeGreaterThan(0);

      for (const order of orders) {
        expect(order.items.length).toBeGreaterThan(0);
        for (const item of order.items) {
          expect(item.image).toBeTruthy();
          const relativeAsset = item.image!.replace(/^\//, "");
          const absoluteAsset = path.join(publicDir, relativeAsset);
          expect(
            fs.existsSync(absoluteAsset),
            `Thumbnail asset ${item.image} must exist in public/`
          ).toBe(true);
        }
      }
    });

    it("every reorder line in mock account orders also contains a thumbnail image pointing to public/", async () => {
      const orders = await mockAccountProvider.getOrders();
      for (const order of orders) {
        if (order.lines) {
          for (const line of order.lines) {
            expect(line.image).toBeTruthy();
            const relativeAsset = line.image!.replace(/^\//, "");
            const absoluteAsset = path.join(publicDir, relativeAsset);
            expect(
              fs.existsSync(absoluteAsset),
              `Order line thumbnail ${line.image} must exist in public/`
            ).toBe(true);
          }
        }
      }
    });
  });

  describe("(4) Campo copy em ContactInput para 'Send me a copy' em /help", () => {
    it("ContactInputSchema validates copy boolean field (true, false, undefined)", () => {
      const withCopyTrue = ContactInputSchema.parse({
        name: "Test User",
        email: "test@example.com",
        topic: "Shipping",
        message: "When does my order ship?",
        copy: true,
      });
      expect(withCopyTrue.copy).toBe(true);

      const withCopyFalse = ContactInputSchema.parse({
        name: "Test User",
        email: "test@example.com",
        topic: "Shipping",
        message: "When does my order ship?",
        copy: false,
      });
      expect(withCopyFalse.copy).toBe(false);

      const withoutCopy = ContactInputSchema.parse({
        name: "Test User",
        email: "test@example.com",
        topic: "Shipping",
        message: "When does my order ship?",
      });
      expect(withoutCopy.copy).toBeUndefined();
    });

    it("mockFormsProvider.sendContact records copy flag and responds successfully", async () => {
      const payload: ContactInput = {
        name: "Test User",
        email: "test@example.com",
        topic: "order_help",
        message: "Please send me a copy of this correspondence.",
        orderNumber: "TEST-NL-0001",
        copy: true,
      };

      const result = await mockFormsProvider.sendContact(payload);
      expect(result.success).toBe(true);
      expect(result.message).toContain("copy requested");

      const lastSubmission = mockFormsProvider.getLastContactSubmission();
      expect(lastSubmission).toBeDefined();
      expect(lastSubmission?.type).toBe("contact");
      expect(lastSubmission?.id).toMatch(/^contact_/);
      expect(lastSubmission?.copy).toBe(true);

      // Garante que nenhum dado pessoal (nome, email, mensagem, pedido) é retido em memória
      const submissionRecord = lastSubmission as unknown as Record<
        string,
        unknown
      >;
      expect(submissionRecord.name).toBeUndefined();
      expect(submissionRecord.email).toBeUndefined();
      expect(submissionRecord.message).toBeUndefined();
      expect(submissionRecord.orderNumber).toBeUndefined();
    });
  });

  describe("(5) Consulta real de status no Track order de /help", () => {
    it("returns real fulfillment status (delivered, in_transit) instead of generic pending", async () => {
      const deliveredOrder = await mockAccountProvider.lookupGuestOrder(
        "TEST-NL-0001",
        "test@example.com"
      );
      expect(deliveredOrder).not.toBeNull();
      expect(deliveredOrder?.fulfillmentStatus).toBe("delivered");
      expect(deliveredOrder).not.toHaveProperty("financialStatus");
      expect(deliveredOrder?.trackingNumber).toBe("1Z9999999999999999");
      expect(deliveredOrder?.trackingUrl).toContain("ups.com");
      expect(deliveredOrder?.items.length).toBe(1);

      const inTransitOrder = await mockAccountProvider.lookupGuestOrder(
        "TEST-NL-0002",
        "test@example.com"
      );
      expect(inTransitOrder).not.toBeNull();
      expect(inTransitOrder?.fulfillmentStatus).toBe("in_transit");
      expect(inTransitOrder?.trackingNumber).toBe("1Z8888888888888888");
      expect(inTransitOrder?.items.length).toBe(1);
    });

    it("supports synthetic test orders labeled with TEST according to rule 138", () => {
      // Synthetic fixture restricted to test, labeled with TEST
      const testOrder: Order = OrderSchema.parse({
        id: "ord_TEST_0001",
        orderNumber: "TEST-NL-999999",
        createdAt: new Date().toISOString(),
        financialStatus: "paid",
        fulfillmentStatus: "processing",
        email: "test.customer@example.invalid",
        items: [
          {
            title: "TEST Product Item",
            quantity: 1,
            price: { amount: 59, currencyCode: "USD" },
            image: "/renders/biohack.png",
          },
        ],
        total: { amount: 59, currencyCode: "USD" },
        url: "/account/orders/ord_TEST_0001",
        copyLink: "/account/orders/ord_TEST_0001",
        canReorder: true,
      });

      expect(testOrder.orderNumber).toBe("TEST-NL-999999");
      expect(testOrder.fulfillmentStatus).toBe("processing");
      expect(testOrder.copyLink).toBe("/account/orders/ord_TEST_0001");
      expect(testOrder.items[0].image).toBe("/renders/biohack.png");
    });
  });
});
