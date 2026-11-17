// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";

// Mocks para providers consumidos exclusivamente via contrato
const mockLookupGuestOrder = vi.fn();
const mockSendContact = vi.fn();
const mockAddLines = vi.fn();

vi.mock("@/lib/providers", () => ({
  accountProvider: {
    lookupGuestOrder: (...args: unknown[]) => mockLookupGuestOrder(...args),
    signInUrl: vi.fn().mockResolvedValue("/account/login?returnTo=%2Ftrack"),
  },
  formsProvider: {
    sendContact: (...args: unknown[]) => mockSendContact(...args),
  },
}));

vi.mock("@/lib/providers/client", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/providers/client")>();
  return {
    ...actual,
    cartProvider: {
      ...actual.cartProvider,
      addLines: (...args: unknown[]) => mockAddLines(...args),
    },
  };
});

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
  }),
}));

import TrackOrderPage from "@/app/(shared)/track/page";
import { OrderLookup } from "@/app/(shared)/track/_components/order-lookup";
import { TrackView } from "@/app/(shared)/track/_components/track-view";
import { TrackResult } from "@/app/(shared)/track/_components/track-result";
import { lookupOrderAction } from "@/app/(shared)/track/_components/actions";
import { DEFAULT_MARKET } from "@/lib/market";
import {
  lookupOrder as helpLookupOrder,
  sendContactMessage,
} from "@/app/(shared)/help/_components/actions";
import { OrderCard } from "@/app/(account)/account/orders/_components/order-card";
import { OrderDetailView } from "@/app/(account)/account/orders/_components/order-detail-view";
import { OrderActions } from "@/app/(account)/account/orders/_components/order-actions";
import {
  toOrderRowView,
  toOrderDetailView,
} from "@/app/(account)/account/orders/_components/order-view";
import { OrderSchema, type Order } from "@/lib/contracts/account";

describe("W4-00b: Routes Integration & Contract Bindings", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockLookupGuestOrder.mockReset();
    mockSendContact.mockReset();
    mockAddLines.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe("1. /track Estado B e acessibilidade de erro", () => {
    const sampleGuestOrder: Order = OrderSchema.parse({
      id: "ord_TEST_0001",
      orderNumber: "TEST-NL-0001",
      createdAt: "2026-11-10T12:00:00.000Z",
      financialStatus: "paid",
      fulfillmentStatus: "delivered",
      email: "test@example.com",
      items: [
        {
          title: "BioHack - 2 Jars (60 days)",
          quantity: 1,
          price: { amount: 118, currencyCode: "USD" },
          image: "/renders/biohack.png",
          variantTitle: "2 Jars",
          variantId: "var_biohack_1",
        },
      ],
      lines: [
        {
          variantId: "var_biohack_1",
          quantity: 1,
          image: "/renders/biohack.png",
          title: "BioHack - 2 Jars (60 days)",
          price: { amount: 118, currencyCode: "USD" },
        },
      ],
      total: { amount: 118, currencyCode: "USD" },
      trackingNumber: "1Z9999999999999999",
      trackingUrl: "https://www.ups.com/track?tracknum=1Z9999999999999999",
      url: "/account/orders/ord_TEST_0001",
      copyLink: "/account/orders/ord_TEST_0001",
      statusUrl: "https://track.nadeonlabs.com/orders/TEST-NL-0001",
      canReorder: true,
    });

    it("renderiza o Estado B com detalhes do pedido, miniatura e link de cópia via consulta por POST Server Action", async () => {
      mockLookupGuestOrder.mockResolvedValue(sampleGuestOrder);

      const formData = new FormData();
      formData.set("orderNumber", "TEST-NL-0001");
      formData.set("email", "test@example.com");

      const result = await lookupOrderAction(formData);
      expect(result.status).toBe("found");

      if (result.status === "found") {
        render(<TrackResult order={result.order} market={DEFAULT_MARKET} />);

        expect(mockLookupGuestOrder).toHaveBeenCalledWith(
          "TEST-NL-0001",
          "test@example.com"
        );
        expect(
          screen.getByRole("heading", { name: "Order #TEST-NL-0001" })
        ).toBeDefined();
        expect(screen.getAllByText("Delivered").length).toBeGreaterThan(0);

        // Confere renderização da miniatura da imagem (Next Image com alt descritivo)
        const thumbnail = screen.getByRole("img", {
          name: "BioHack - 2 Jars (60 days)",
        });
        expect(thumbnail).toBeDefined();
        expect(thumbnail.getAttribute("src")).toContain("biohack.png");

        // Confere botão de cópia do link do pedido
        expect(screen.getByRole("button", { name: "Copy link" })).toBeDefined();
      }
    });

    it("exibe mensagem de erro acessível com aria-describedby e role status", () => {
      render(
        <OrderLookup
          signInHref="/account/login"
          errorMessage="No order found with that number and email. Please check your confirmation email."
          initialValues={{
            orderNumber: "TEST-NL-9999",
            email: "notfound@example.com",
          }}
        />
      );

      const errorEl = screen.getByRole("status");
      expect(errorEl.textContent).toContain("No order found");
      expect(errorEl.getAttribute("id")).toBe("order-lookup-error");

      const orderInput = screen.getByLabelText("Order number");
      expect(orderInput.getAttribute("aria-invalid")).toBe("true");
      expect(orderInput.getAttribute("aria-describedby")).toContain(
        "order-lookup-error"
      );

      const emailInput = screen.getByLabelText("Email");
      expect(emailInput.getAttribute("aria-invalid")).toBe("true");
      expect(emailInput.getAttribute("aria-describedby")).toContain(
        "order-lookup-error"
      );
    });

    it("executa lookupOrderAction via Server Action POST sem colocar email na URL nem logar PII", async () => {
      mockLookupGuestOrder.mockResolvedValue(sampleGuestOrder);
      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const consoleInfoSpy = vi
        .spyOn(console, "info")
        .mockImplementation(() => {});

      const formData = new FormData();
      formData.set("orderNumber", "TEST-NL-0001");
      formData.set("email", "test@example.com");

      const result = await lookupOrderAction(formData);
      expect(result.status).toBe("found");
      if (result.status === "found") {
        expect(result.order.orderNumber).toBe("TEST-NL-0001");
      }

      // Garante que o provider foi chamado corretamente
      expect(mockLookupGuestOrder).toHaveBeenCalledWith(
        "TEST-NL-0001",
        "test@example.com"
      );

      // Garante zero logs de dados pessoais
      const logs = [...consoleLogSpy.mock.calls, ...consoleInfoSpy.mock.calls]
        .flat()
        .join(" ");
      expect(logs).not.toContain("test@example.com");

      consoleLogSpy.mockRestore();
      consoleInfoSpy.mockRestore();
    });

    it("TrackView transiciona do formulário para o pedido ao submeter uma busca encontrada", async () => {
      mockLookupGuestOrder.mockResolvedValue(sampleGuestOrder);
      render(<TrackView signInHref="/account/login" market={DEFAULT_MARKET} />);

      // Inicialmente em Estado A (formulário de busca)
      expect(
        screen.getByRole("heading", { name: "Find your order" })
      ).toBeDefined();
      expect(
        screen.queryByRole("heading", { name: /Order #TEST-NL-0001/ })
      ).toBeNull();

      fireEvent.change(screen.getByLabelText("Order number"), {
        target: { value: "TEST-NL-0001" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.submit(screen.getByLabelText("Order number").closest("form")!);

      expect(
        await screen.findByRole("heading", { name: "Order #TEST-NL-0001" })
      ).toBeDefined();
      expect(
        screen.queryByRole("heading", { name: "Find your order" })
      ).toBeNull();
      expect(mockLookupGuestOrder).toHaveBeenCalledWith(
        "TEST-NL-0001",
        "test@example.com"
      );
    });

    it("TrackOrderPage não consulta pedido via searchParams nem lê e-mail da URL", async () => {
      mockLookupGuestOrder.mockResolvedValue(sampleGuestOrder);

      const jsx = await TrackOrderPage({
        searchParams: Promise.resolve({
          orderNumber: "TEST-NL-0001",
          email: "url@example.com",
        }),
      });
      render(jsx);

      // Garante que o provider não foi chamado por query string
      expect(mockLookupGuestOrder).not.toHaveBeenCalled();
      // Permanece no formulário de busca
      expect(
        screen.getByRole("heading", { name: "Find your order" })
      ).toBeDefined();
      expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe(
        ""
      );
    });
  });

  describe("2. /help: Track order e Send me a copy", () => {
    it("Track order consulta status real com contagem de itens e tracking url", async () => {
      mockLookupGuestOrder.mockResolvedValue({
        id: "ord_TEST_0002",
        orderNumber: "TEST-NL-0002",
        fulfillmentStatus: "in_transit",
        trackingNumber: "1Z8888888888888888",
        trackingUrl: "https://www.ups.com/track?tracknum=1Z8888888888888888",
        items: [
          {
            title: "More Good Years Soft Chews - 1 Jar",
            quantity: 1,
            price: { amount: 44, currencyCode: "USD" },
            image: "/renders/more-good-years.png",
          },
        ],
      });

      const formData = new FormData();
      formData.set("orderNumber", "TEST-NL-0002");
      formData.set("email", "test@example.com");

      const result = await helpLookupOrder({ status: "idle" }, formData);

      expect(mockLookupGuestOrder).toHaveBeenCalledWith(
        "TEST-NL-0002",
        "test@example.com"
      );
      expect(result).toEqual({
        status: "found",
        orderNumber: "TEST-NL-0002",
        fulfillmentStatus: "in_transit",
        trackingNumber: "1Z8888888888888888",
        trackingUrl: "https://www.ups.com/track?tracknum=1Z8888888888888888",
        itemCount: 1,
      });
    });

    it("Send me a copy propaga copy: true para formsProvider.sendContact", async () => {
      mockSendContact.mockResolvedValue({
        success: true,
        id: "contact_mock_123",
        message: "Contact message sent successfully (copy requested)",
      });

      const formData = new FormData();
      formData.set("name", "Test Customer");
      formData.set("email", "test@example.com");
      formData.set("topic", "order_help");
      formData.set("message", "Inquiry regarding my shipment.");
      formData.set("orderNumber", "TEST-NL-0001");
      formData.set("copy", "on");

      const result = await sendContactMessage({ status: "idle" }, formData);

      expect(mockSendContact).toHaveBeenCalledWith({
        name: "Test Customer",
        email: "test@example.com",
        topic: "order_help",
        message: "Inquiry regarding my shipment.",
        orderNumber: "TEST-NL-0001",
        copy: true,
      });
      expect(result).toEqual({ status: "sent" });
    });
  });

  describe("3. Pedidos da conta: Copy link, Reorder e miniaturas", () => {
    const testOrder: Order = OrderSchema.parse({
      id: "ord_TEST_0001",
      orderNumber: "TEST-NL-0001",
      createdAt: "2026-11-10T12:00:00.000Z",
      financialStatus: "paid",
      fulfillmentStatus: "delivered",
      email: "test@example.com",
      items: [
        {
          title: "BioHack - 2 Jars (60 days)",
          quantity: 2,
          price: { amount: 118, currencyCode: "USD" },
          image: "/renders/biohack.png",
          variantTitle: "2 Jars",
          variantId: "var_biohack_1",
        },
      ],
      lines: [
        {
          variantId: "var_biohack_1",
          quantity: 2,
          image: "/renders/biohack.png",
          title: "BioHack - 2 Jars (60 days)",
          price: { amount: 118, currencyCode: "USD" },
        },
      ],
      total: { amount: 118, currencyCode: "USD" },
      trackingNumber: "1Z9999999999999999",
      trackingUrl: "https://www.ups.com/track?tracknum=1Z9999999999999999",
      url: "/account/orders/ord_TEST_0001",
      copyLink: "/account/orders/ord_TEST_0001",
      canReorder: true,
    });

    const formatters = {
      money: () => "$118.00",
      date: () => "Nov 10, 2026",
      country: () => "United States",
    };

    it("toOrderRowView e toOrderDetailView preservam copyLink, canReorder e imagens", () => {
      const rowView = toOrderRowView(testOrder, formatters);
      expect(rowView.copyLink).toBe("/account/orders/ord_TEST_0001");
      expect(rowView.canReorder).toBe(true);
      expect(rowView.items?.[0]?.image).toBe("/renders/biohack.png");

      const detailView = toOrderDetailView(testOrder, formatters);
      expect(detailView.copyLink).toBe("/account/orders/ord_TEST_0001");
      expect(detailView.canReorder).toBe(true);
      expect(detailView.items[0]?.image).toBe("/renders/biohack.png");
    });

    it("OrderCard renderiza miniatura do produto, botão Copy link e botão Buy again", async () => {
      const rowView = toOrderRowView(testOrder, formatters);
      render(<OrderCard row={rowView} />);

      // Miniatura renderizada com imagem e alt
      const img = screen.getByRole("img", {
        name: "BioHack - 2 Jars (60 days)",
      });
      expect(img).toBeDefined();
      expect(img.getAttribute("src")).toContain("biohack.png");

      // Botão Copy link presente
      expect(screen.getByRole("button", { name: "Copy link" })).toBeDefined();

      // Botão Buy again presente
      expect(screen.getByRole("button", { name: "Buy again" })).toBeDefined();
    });

    it("OrderDetailView renderiza miniatura do item na listagem", () => {
      const detailView = toOrderDetailView(testOrder, formatters);
      render(<OrderDetailView order={detailView} />);

      const img = screen.getByRole("img", {
        name: "BioHack - 2 Jars (60 days)",
      });
      expect(img).toBeDefined();
      expect(img.getAttribute("src")).toContain("biohack.png");
      expect(screen.getByRole("button", { name: "Copy link" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Buy again" })).toBeDefined();
    });

    it("OrderActions aciona navigator.clipboard.writeText com copyLink e atualiza status acessível", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText },
      });

      render(
        <OrderActions
          copyLink="/account/orders/ord_TEST_0001"
          lines={testOrder.lines}
          showBuyAgain
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));

      await waitFor(() => {
        expect(writeText).toHaveBeenCalledWith(
          `${window.location.origin}/account/orders/ord_TEST_0001`
        );
      });

      const statusEl = await screen.findByRole("status");
      expect(statusEl.textContent).toBe("Link copied");
    });

    it("OrderActions aciona cartProvider.addLines com as linhas do pedido", async () => {
      mockAddLines.mockResolvedValue({});

      render(
        <OrderActions
          lines={testOrder.lines}
          canReorder={true}
          showBuyAgain={true}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "Buy again" }));

      await waitFor(() => {
        expect(mockAddLines).toHaveBeenCalledWith(testOrder.lines);
      });

      const statusEl = await screen.findByRole("status");
      expect(statusEl.textContent).toBe("Added to cart");
    });
  });
});
