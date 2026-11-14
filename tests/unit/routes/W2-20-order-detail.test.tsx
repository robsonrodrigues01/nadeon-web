// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { OrderSchema, type Order } from "@/lib/contracts/account";
import OrderDetailPage, {
  metadata,
} from "@/app/(account)/account/orders/[id]/page";
import { OrderDetailView } from "@/app/(account)/account/orders/_components/order-detail-view";
import {
  formatAddressLines,
  toOrderDetailView,
} from "@/app/(account)/account/orders/_components/order-view";
import { createOrderFormatters } from "@/app/(account)/account/orders/_components/order-market";
import { DEFAULT_MARKET, formatMoneyWithMarket } from "@/lib/market";
import { mockAccountProvider } from "@/lib/providers/mock/account";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

const PLACEHOLDERS = /\[X\]|\$XX|\(example\)/i;
const formatters = createOrderFormatters(DEFAULT_MARKET);

const noTrackingOrder: Order = OrderSchema.parse({
  id: "ord_300001",
  orderNumber: "NL-300001",
  createdAt: new Date("2026-11-06T14:14:00Z").toISOString(),
  financialStatus: "paid",
  fulfillmentStatus: "processing",
  items: [
    {
      title: "Full Charge - 1 Jar",
      quantity: 1,
      price: { amount: 69, currencyCode: "USD" },
      variantTitle: "NMN 4-in-1",
    },
  ],
  total: { amount: 69, currencyCode: "USD" },
});

afterEach(() => {
  cleanup();
});

describe("W2-20 /account/orders/[id] metadata", () => {
  it("is private and not indexed", () => {
    expect(metadata.title).toBe("Order details | Nadeon Labs");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});

describe("W2-20 /account/orders/[id] buttons (catalog 5.4)", () => {
  it("Buy again is a disabled button until order variants are exposed", () => {
    render(
      <OrderDetailView order={toOrderDetailView(noTrackingOrder, formatters)} />
    );
    expect(
      (screen.getByRole("button", { name: "Buy again" }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
  });

  it("Get help links to the help page", () => {
    render(
      <OrderDetailView order={toOrderDetailView(noTrackingOrder, formatters)} />
    );
    expect(
      screen.getByRole("link", { name: "Get help" }).getAttribute("href")
    ).toBe("/help");
  });

  it("Get help with this order links to the help page", () => {
    render(
      <OrderDetailView order={toOrderDetailView(noTrackingOrder, formatters)} />
    );
    expect(
      screen
        .getByRole("link", { name: "Get help with this order" })
        .getAttribute("href")
    ).toBe("/help");
  });

  it("Start a return is a disabled button until returns exist", () => {
    render(
      <OrderDetailView order={toOrderDetailView(noTrackingOrder, formatters)} />
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Start a return",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
  });

  it("Track package links out in a new tab when the order has tracking", () => {
    const order = OrderSchema.parse({
      ...noTrackingOrder,
      fulfillmentStatus: "in_transit",
      trackingNumber: "1Z300001",
      trackingUrl: "https://www.ups.com/track?tracknum=1Z300001",
    });
    render(<OrderDetailView order={toOrderDetailView(order, formatters)} />);

    const track = screen.getByRole("link", { name: /Track package/ });
    expect(track.getAttribute("href")).toBe(
      "https://www.ups.com/track?tracknum=1Z300001"
    );
    expect(track.getAttribute("target")).toBe("_blank");
    expect(track.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("W2-20 /account/orders/[id] content", () => {
  it("omits the shipment section when there is no tracking number", () => {
    render(
      <OrderDetailView order={toOrderDetailView(noTrackingOrder, formatters)} />
    );
    expect(screen.queryByRole("heading", { name: "Shipment" })).toBeNull();
  });

  it("lists items with variant, quantity and market price", () => {
    render(
      <OrderDetailView order={toOrderDetailView(noTrackingOrder, formatters)} />
    );
    expect(screen.getByRole("heading", { name: "Items (1)" })).toBeTruthy();
    expect(screen.getByText("Full Charge - 1 Jar")).toBeTruthy();
    expect(screen.getByText(/NMN 4-in-1 · Qty 1/)).toBeTruthy();
    const price = formatMoneyWithMarket(
      { amount: 69, currencyCode: "USD" },
      DEFAULT_MARKET
    );
    // The same amount also appears as the order total, so scope to the item list.
    const items = screen.getByRole("heading", { name: "Items (1)" })
      .parentElement as HTMLElement;
    expect(items.textContent).toContain(price);
  });

  it("shows the total in the payment summary and no lines the contract lacks", () => {
    const { container } = render(
      <OrderDetailView order={toOrderDetailView(noTrackingOrder, formatters)} />
    );
    const summary = screen.getByRole("heading", { name: "Payment summary" })
      .parentElement as HTMLElement;
    expect(within(summary).getByText("Total")).toBeTruthy();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/Subtotal|Tax|Lot |Carrier|UPS ·/);
  });

  it("renders the shipping address from the order", () => {
    render(
      <OrderDetailView
        order={toOrderDetailView(
          OrderSchema.parse({
            ...noTrackingOrder,
            shippingAddress: mockAddress(),
          }),
          formatters
        )}
      />
    );
    const address = screen.getByRole("heading", {
      name: "Shipping address",
    }).parentElement as HTMLElement;
    expect(within(address).getByText("Alex Morgan")).toBeTruthy();
    expect(within(address).getByText("Austin, TX 78701")).toBeTruthy();
    expect(within(address).getByText("United States")).toBeTruthy();
  });

  it("never renders design placeholders", () => {
    render(
      <OrderDetailView order={toOrderDetailView(noTrackingOrder, formatters)} />
    );
    expect(document.body.textContent ?? "").not.toMatch(PLACEHOLDERS);
  });
});

describe("W2-20 /account/orders/[id] route", () => {
  it("calls notFound for an unknown order id", async () => {
    await expect(
      OrderDetailPage({ params: Promise.resolve({ id: "ord_missing" }) })
    ).rejects.toThrow("NOT_FOUND");
  });

  it("renders the mock order from the account provider", async () => {
    const [mockOrder] = await mockAccountProvider.getOrders();
    render(
      await OrderDetailPage({ params: Promise.resolve({ id: mockOrder.id }) })
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: `Order #${mockOrder.orderNumber}`,
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "← All orders" }).getAttribute("href")
    ).toBe("/account/orders");
  });
});

function mockAddress() {
  return {
    id: "addr_test",
    firstName: "Alex",
    lastName: "Morgan",
    address1: "742 Evergreen Terrace",
    address2: "Apt 4B",
    city: "Austin",
    province: "TX",
    zip: "78701",
    country: "US",
    isDefault: true,
  };
}

describe("W2-20 formatAddressLines", () => {
  it("skips missing optional lines", () => {
    const lines = formatAddressLines(
      { ...mockAddress(), address2: undefined, province: undefined },
      "United States"
    );
    expect(lines).toEqual([
      "Alex Morgan",
      "742 Evergreen Terrace",
      "Austin, 78701",
      "United States",
    ]);
  });
});
