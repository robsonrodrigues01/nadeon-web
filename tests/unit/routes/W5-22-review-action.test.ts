import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { accountProviderMock, reviewsProviderMock } = vi.hoisted(() => ({
  accountProviderMock: {
    getSession: vi.fn(),
    getCustomer: vi.fn(),
    getOrders: vi.fn(),
  },
  reviewsProviderMock: { submit: vi.fn() },
}));

vi.mock("@/lib/providers", () => ({
  accountProvider: accountProviderMock,
  reviewsProvider: reviewsProviderMock,
}));

import { submitReviewAction } from "@/app/(shared)/reviews/write/actions";

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
      quantity: 1,
      price: { amount: 20, currencyCode: "USD" },
    },
  ],
  total: { amount: 20, currencyCode: "USD" },
};

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

function validForm(extra: Record<string, string> = {}) {
  return form({
    orderId: deliveredOrder.id,
    productSlug: "test-product",
    rating: "5",
    title: "TEST review title",
    body: "TEST review body",
    authorName: "TEST Reviewer",
    ownExperience: "yes",
    termsAccepted: "yes",
    ...extra,
  });
}

describe("W5-22 review submission security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    accountProviderMock.getSession.mockResolvedValue({
      accessToken: "TEST-token",
      expiresAt: "2099-01-01T00:00:00.000Z",
      customerId: owner.id,
    });
    accountProviderMock.getCustomer.mockResolvedValue(owner);
    accountProviderMock.getOrders.mockResolvedValue([deliveredOrder]);
    reviewsProviderMock.submit.mockResolvedValue({
      id: "rev_TEST_submitted",
      productSlug: "test-product",
      rating: 5,
      title: "TEST review title",
      body: "TEST review body",
      authorName: "TEST Reviewer",
      verifiedBuyer: true,
      helpfulVotes: 0,
      createdAt: "2026-10-01T00:00:00.000Z",
      images: [],
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("rejects invalid fields before calling the reviews provider", async () => {
    const result = await submitReviewAction(
      { status: "idle", message: "" },
      validForm({ rating: "6" })
    );

    expect(result.status).toBe("invalid");
    expect(reviewsProviderMock.submit).not.toHaveBeenCalled();
  });

  it("requires a matching authenticated customer before reading orders", async () => {
    accountProviderMock.getSession.mockResolvedValue(null);
    const noSession = await submitReviewAction(
      { status: "idle", message: "" },
      validForm()
    );
    expect(noSession.status).toBe("error");
    expect(accountProviderMock.getOrders).not.toHaveBeenCalled();

    accountProviderMock.getSession.mockResolvedValue({
      accessToken: "TEST-token",
      expiresAt: "2099-01-01T00:00:00.000Z",
      customerId: "customer_TEST_foreign",
    });
    const foreignSession = await submitReviewAction(
      { status: "idle", message: "" },
      validForm()
    );
    expect(foreignSession.status).toBe("error");
    expect(reviewsProviderMock.submit).not.toHaveBeenCalled();
  });

  it.each([
    ["not in the customer's orders", []],
    ["not delivered", [{ ...deliveredOrder, fulfillmentStatus: "in_transit" }]],
    ["refunded", [{ ...deliveredOrder, financialStatus: "refunded" }]],
    ["does not contain the product", [{ ...deliveredOrder, items: [] }]],
  ])("rejects an order that is %s", async (_reason, orders) => {
    accountProviderMock.getOrders.mockResolvedValue(orders);
    const result = await submitReviewAction(
      { status: "idle", message: "" },
      validForm()
    );

    expect(result.status).toBe("error");
    expect(reviewsProviderMock.submit).not.toHaveBeenCalled();
  });

  it("rejects a client-supplied verification email", async () => {
    const result = await submitReviewAction(
      { status: "idle", message: "" },
      validForm({ authorEmail: "attacker@example.test" })
    );

    expect(result.status).toBe("invalid");
    expect(reviewsProviderMock.submit).not.toHaveBeenCalled();
  });

  it("derives the verification email from the owner and does not log PII", async () => {
    const loggers = ["log", "info", "warn", "error", "debug"].map((level) =>
      vi.spyOn(console, level as "log").mockImplementation(() => {})
    );
    const publicName = "TEST Public Reviewer";

    const result = await submitReviewAction(
      { status: "idle", message: "" },
      validForm({ authorName: publicName })
    );

    expect(result.status).toBe("success");
    expect(reviewsProviderMock.submit).toHaveBeenCalledWith({
      orderId: deliveredOrder.id,
      productSlug: "test-product",
      rating: 5,
      title: "TEST review title",
      body: "TEST review body",
      authorName: publicName,
      authorEmail: owner.email,
      termsAccepted: true,
    });
    const logs = loggers
      .flatMap((logger) => logger.mock.calls)
      .flat()
      .join(" ");
    expect(logs).not.toContain(owner.email);
    expect(logs).not.toContain(publicName);
    expect(JSON.stringify(result)).not.toContain(owner.email);
  });
});
