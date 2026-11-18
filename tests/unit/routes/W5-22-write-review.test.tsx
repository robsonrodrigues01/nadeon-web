// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { accountProviderMock, notFoundMock, redirectMock } = vi.hoisted(() => ({
  accountProviderMock: {
    getSession: vi.fn(),
    getCustomer: vi.fn(),
    getOrders: vi.fn(),
    signInUrl: vi.fn(),
  },
  notFoundMock: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  redirectMock: vi.fn((target: string) => {
    throw new Error(`REDIRECT:${target}`);
  }),
}));

vi.mock("@/lib/providers", () => ({ accountProvider: accountProviderMock }));
vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
  redirect: redirectMock,
}));
vi.mock("@/app/(shared)/reviews/write/actions", () => ({
  submitReviewAction: vi.fn(),
}));
vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));
vi.mock("@/components/layout/header", () => ({ Header: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));
vi.mock("@/components/brand/trust-strip", () => ({ TrustStrip: () => null }));

import WriteReviewPage from "@/app/(shared)/reviews/write/page";

const owner = {
  id: "customer_TEST_owner",
  firstName: "TEST Owner",
  lastName: "TEST Shopper",
  email: "review-owner@example.test",
};
const deliveredOrder = {
  id: "ord_TEST_owned",
  orderNumber: "TEST-ORDER-1",
  createdAt: "2026-10-01T00:00:00.000Z",
  financialStatus: "paid",
  fulfillmentStatus: "delivered",
  email: owner.email,
  items: [
    {
      title: "TEST Product",
      productSlug: "test-product",
      variantTitle: "TEST Format",
      quantity: 1,
      price: { amount: 20, currencyCode: "USD" },
    },
  ],
  total: { amount: 20, currencyCode: "USD" },
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
  accountProviderMock.getSession.mockResolvedValue({
    accessToken: "TEST-token",
    expiresAt: "2099-01-01T00:00:00.000Z",
    customerId: owner.id,
  });
  accountProviderMock.getCustomer.mockResolvedValue(owner);
  accountProviderMock.getOrders.mockResolvedValue([deliveredOrder]);
  accountProviderMock.signInUrl.mockResolvedValue("/account/login");
});

describe("W5-22 /reviews/write", () => {
  it("renders a review form only for a delivered purchased item", async () => {
    render(
      await WriteReviewPage({
        searchParams: Promise.resolve({
          orderId: deliveredOrder.id,
          productSlug: "test-product",
        }),
      })
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Write a review" })
    ).toBeTruthy();
    expect(screen.getByText("TEST Product")).toBeTruthy();
    expect(screen.getByText("TEST Format")).toBeTruthy();
    expect(
      screen.getByText(/Verified buyer, from order #TEST-ORDER-1/)
    ).toBeTruthy();
    expect(screen.getByRole("group", { name: "Overall rating" })).toBeTruthy();
    expect(screen.getByLabelText("Review title")).toBeTruthy();
    expect(
      screen.getByLabelText("Your review", { selector: "textarea" })
    ).toBeTruthy();
    expect(screen.getByLabelText("Display name")).toBeTruthy();
    expect(screen.getByDisplayValue(owner.email)).toHaveProperty(
      "readOnly",
      true
    );
    expect(
      screen.getByRole("checkbox", { name: /own experience/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("checkbox", { name: /review terms/i })
    ).toBeTruthy();
  });

  it("requires sign-in and hides invalid, foreign, unpaid, or unpurchased orders", async () => {
    accountProviderMock.getSession.mockResolvedValue(null);
    await expect(
      WriteReviewPage({
        searchParams: Promise.resolve({
          orderId: deliveredOrder.id,
          productSlug: "test-product",
        }),
      })
    ).rejects.toThrow("REDIRECT:/account/login");

    accountProviderMock.getSession.mockResolvedValue({
      accessToken: "TEST-token",
      expiresAt: "2099-01-01T00:00:00.000Z",
      customerId: owner.id,
    });
    accountProviderMock.getOrders.mockResolvedValue([
      { ...deliveredOrder, email: "foreign@example.test" },
    ]);
    await expect(
      WriteReviewPage({
        searchParams: Promise.resolve({
          orderId: deliveredOrder.id,
          productSlug: "test-product",
        }),
      })
    ).rejects.toThrow("NOT_FOUND");

    accountProviderMock.getOrders.mockResolvedValue([
      { ...deliveredOrder, fulfillmentStatus: "processing" },
    ]);
    await expect(
      WriteReviewPage({
        searchParams: Promise.resolve({
          orderId: deliveredOrder.id,
          productSlug: "test-product",
        }),
      })
    ).rejects.toThrow("NOT_FOUND");

    accountProviderMock.getOrders.mockResolvedValue([deliveredOrder]);
    await expect(
      WriteReviewPage({
        searchParams: Promise.resolve({
          orderId: deliveredOrder.id,
          productSlug: "not-purchased",
        }),
      })
    ).rejects.toThrow("NOT_FOUND");
  });
});
