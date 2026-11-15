// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { OrderActions } from "@/app/(account)/account/orders/_components/order-actions";
import { OrderSchema } from "@/lib/contracts/account";
import {
  toOrderDetailView,
  toOrderRowView,
} from "@/app/(account)/account/orders/_components/order-view";

const addLines = vi.fn();
vi.mock("@/lib/providers/client", () => ({
  cartProvider: { addLines: (...args: unknown[]) => addLines(...args) },
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("W2-40 order actions", () => {
  it("preserves order lines and URL in both view models", () => {
    const order = OrderSchema.parse({
      id: "order-1",
      orderNumber: "NL-100001",
      createdAt: "2026-11-06T14:14:00.000Z",
      financialStatus: "paid",
      fulfillmentStatus: "delivered",
      items: [],
      total: { amount: 0, currencyCode: "USD" },
      lines: [{ variantId: "variant-1", quantity: 2 }],
      url: "/account/orders/order-1",
    });
    const formatters = {
      money: () => "$0.00",
      date: () => "Nov 6, 2026",
      country: () => "United States",
    };

    expect(toOrderRowView(order, formatters)).toMatchObject({
      lines: [{ variantId: "variant-1", quantity: 2 }],
      url: "/account/orders/order-1",
    });
    expect(toOrderDetailView(order, formatters)).toMatchObject({
      lines: [{ variantId: "variant-1", quantity: 2 }],
      url: "/account/orders/order-1",
    });
  });

  it("reorders the contract lines through the client cart provider", async () => {
    addLines.mockResolvedValue({});
    render(
      <OrderActions
        lines={[{ variantId: "variant-1", quantity: 2 }]}
        showBuyAgain
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Buy again" }));

    await waitFor(() =>
      expect(addLines).toHaveBeenCalledWith([
        { variantId: "variant-1", quantity: 2 },
      ])
    );
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("copies the supplied order URL", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<OrderActions orderUrl="/account/orders/order-1" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/account/orders/order-1`
      )
    );
    expect(await screen.findByRole("status")).toBeTruthy();
  });
});
