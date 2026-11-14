// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import { OrderSchema, type Order } from "@/lib/contracts/account";
import OrdersPage, { metadata } from "@/app/(account)/account/orders/page";
import { OrdersBrowser } from "@/app/(account)/account/orders/_components/orders-browser";
import {
  toOrderRowView,
  type OrderRowView,
} from "@/app/(account)/account/orders/_components/order-view";
import {
  createOrderFormatters,
  resolveOrderMarket,
} from "@/app/(account)/account/orders/_components/order-market";
import { DEFAULT_MARKET, formatMoneyWithMarket, getMarket } from "@/lib/market";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

const PLACEHOLDERS = /\[X\]|\$XX|\(example\)/i;
const DAY_MS = 86_400_000;
const daysAgo = (days: number) =>
  new Date(Date.now() - days * DAY_MS).toISOString();

const processingOrder: Order = OrderSchema.parse({
  id: "ord_200001",
  orderNumber: "NL-200001",
  createdAt: daysAgo(1),
  financialStatus: "paid",
  fulfillmentStatus: "processing",
  items: [
    {
      title: "Full Charge - 1 Jar",
      quantity: 1,
      price: { amount: 69, currencyCode: "USD" },
    },
  ],
  total: { amount: 69, currencyCode: "USD" },
});

const inTransitOrder: Order = OrderSchema.parse({
  id: "ord_200002",
  orderNumber: "NL-200002",
  createdAt: daysAgo(4),
  financialStatus: "paid",
  fulfillmentStatus: "in_transit",
  items: [
    {
      title: "BioHack - 1 Jar",
      quantity: 1,
      price: { amount: 59, currencyCode: "USD" },
    },
  ],
  total: { amount: 59, currencyCode: "USD" },
  trackingNumber: "1Z200002",
  trackingUrl: "https://www.ups.com/track?tracknum=1Z200002",
});

const deliveredOrder: Order = OrderSchema.parse({
  id: "ord_200003",
  orderNumber: "NL-200003",
  createdAt: daysAgo(20),
  financialStatus: "paid",
  fulfillmentStatus: "delivered",
  items: [
    {
      title: "Prime - Pure NAD+ powder",
      quantity: 2,
      price: { amount: 54, currencyCode: "USD" },
    },
  ],
  total: { amount: 108, currencyCode: "USD" },
});

const formatters = createOrderFormatters(DEFAULT_MARKET);
const rows: OrderRowView[] = [
  processingOrder,
  inTransitOrder,
  deliveredOrder,
].map((order) => toOrderRowView(order, formatters));

function renderBrowser() {
  return render(<OrdersBrowser rows={rows} />);
}

function articleFor(orderNumber: string): HTMLElement {
  const heading = screen.getByRole("heading", {
    name: `Order #${orderNumber}`,
  });
  const article = heading.closest("article");
  if (!article) throw new Error(`No article for ${orderNumber}`);
  return article;
}

afterEach(() => {
  cleanup();
});

describe("W2-20 /account/orders metadata", () => {
  it("is private and not indexed", () => {
    expect(metadata.title).toBe("Orders | Nadeon Labs");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});

describe("W2-20 /account/orders controls (catalog 5.4)", () => {
  it("exposes the search field as a labelled search input", () => {
    renderBrowser();
    const search = screen.getByRole("searchbox", {
      name: "Search by order or product",
    });
    expect(search.tagName).toBe("INPUT");
    expect(search.getAttribute("type")).toBe("search");
  });

  it("groups the status filters in a fieldset with a legend", () => {
    renderBrowser();
    const group = screen.getByRole("group", { name: "Order status" });
    expect(group.tagName).toBe("FIELDSET");
    expect(within(group).getAllByRole("button")).toHaveLength(4);
  });

  it("renders the four filter buttons with the All count", () => {
    renderBrowser();
    expect(
      screen.getByRole("button", { name: "All (3)", pressed: true })
    ).toBeTruthy();
    for (const name of ["Processing", "In transit", "Delivered"]) {
      expect(screen.getByRole("button", { name, pressed: false })).toBeTruthy();
    }
  });

  it("filters by status and marks the active button", () => {
    renderBrowser();
    fireEvent.click(screen.getByRole("button", { name: "In transit" }));

    expect(
      screen.getByRole("button", { name: "In transit", pressed: true })
    ).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(articleFor("NL-200002")).toBeTruthy();
  });

  it("searches by order number and product title", () => {
    renderBrowser();
    const search = screen.getByRole("searchbox", {
      name: "Search by order or product",
    });

    fireEvent.change(search, { target: { value: "full charge" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(articleFor("NL-200001")).toBeTruthy();

    fireEvent.change(search, { target: { value: "nl-200003" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(articleFor("NL-200003")).toBeTruthy();
  });

  it("announces when no order matches", () => {
    renderBrowser();
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search by order or product" }),
      { target: { value: "no such product" } }
    );
    expect(screen.getByRole("status").textContent).toContain(
      "No orders found."
    );
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});

describe("W2-20 /account/orders row actions by status", () => {
  it("processing order offers Edit address and Details", () => {
    renderBrowser();
    const card = articleFor("NL-200001");
    const edit = within(card).getByRole("link", { name: "Edit address" });
    expect(edit.getAttribute("href")).toBe("/account/settings");
    expect(
      within(card).getByRole("link", { name: "Details" }).getAttribute("href")
    ).toBe("/account/orders/ord_200001");
    expect(
      within(card).queryByRole("button", { name: "Track package" })
    ).toBeNull();
  });

  it("in-transit order offers Track package in a new tab and Details", () => {
    renderBrowser();
    const card = articleFor("NL-200002");
    const track = within(card).getByRole("link", { name: /Track package/ });
    expect(track.getAttribute("href")).toBe(
      "https://www.ups.com/track?tracknum=1Z200002"
    );
    expect(track.getAttribute("target")).toBe("_blank");
    expect(track.getAttribute("rel")).toBe("noopener noreferrer");
    expect(
      within(card).getByRole("link", { name: "Details" }).getAttribute("href")
    ).toBe("/account/orders/ord_200002");
  });

  it("delivered order offers Buy again (disabled until variants are exposed) and Details", () => {
    renderBrowser();
    const card = articleFor("NL-200003");
    expect(
      (
        within(card).getByRole("button", {
          name: "Buy again",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    expect(
      within(card).getByRole("link", { name: "Details" }).getAttribute("href")
    ).toBe("/account/orders/ord_200003");
  });
});

describe("W2-20 /account/orders content", () => {
  it("formats totals with the market formatter, not a hard-coded symbol", () => {
    renderBrowser();
    const expected = formatMoneyWithMarket(
      { amount: 108, currencyCode: "USD" },
      DEFAULT_MARKET
    );
    expect(within(articleFor("NL-200003")).getByText(expected)).toBeTruthy();
  });

  it("never renders design placeholders", () => {
    renderBrowser();
    expect(document.body.textContent ?? "").not.toMatch(PLACEHOLDERS);
  });

  it("route renders the heading and breadcrumb with the mock account provider", async () => {
    render(await OrdersPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Orders" })
    ).toBeTruthy();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(breadcrumb)
        .getByRole("link", { name: "Account" })
        .getAttribute("href")
    ).toBe("/account");
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
  });
});

describe("W2-20 market resolution", () => {
  it("falls back to the default market for unknown or missing ids", () => {
    expect(resolveOrderMarket(undefined).id).toBe(DEFAULT_MARKET.id);
    expect(resolveOrderMarket("zz-unknown").id).toBe(DEFAULT_MARKET.id);
  });

  it("uses the market selected by the shopper", () => {
    const ca = getMarket("ca");
    expect(ca).toBeDefined();
    expect(resolveOrderMarket("ca").id).toBe("ca");
  });
});
