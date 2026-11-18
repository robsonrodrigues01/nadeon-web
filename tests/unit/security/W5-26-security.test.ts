import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  accountProviderMock,
  reviewsProviderMock,
  formsProviderMock,
  wholesaleProviderMock,
} = vi.hoisted(() => ({
  accountProviderMock: {
    getSession: vi.fn(),
    getCustomer: vi.fn(),
    getOrders: vi.fn(),
  },
  reviewsProviderMock: { submit: vi.fn() },
  formsProviderMock: { subscribe: vi.fn(), sendApplication: vi.fn() },
  wholesaleProviderMock: { submit: vi.fn() },
}));

vi.mock("@/lib/providers", () => ({
  accountProvider: accountProviderMock,
  reviewsProvider: reviewsProviderMock,
  formsProvider: formsProviderMock,
  wholesaleProvider: wholesaleProviderMock,
}));

import { submitReviewAction } from "@/app/(shared)/reviews/write/actions";
import { registerForCourse } from "@/app/(shared)/courses/[curso]/actions";
import { submitAffiliateApplication } from "@/app/(shared)/affiliates/actions";
import { submitProfessionalApplication } from "@/app/(shared)/professionals/actions";
import { submitWholesaleApplication } from "@/app/(shared)/wholesale/actions";

const owner = {
  id: "customer_TEST_owner",
  firstName: "TEST Owner",
  lastName: "TEST Shopper",
  email: "owner@example.test",
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
      productSlug: "daily-chew",
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

function validReviewForm(extra: Record<string, string> = {}) {
  return form({
    orderId: deliveredOrder.id,
    productSlug: "daily-chew",
    rating: "5",
    title: "TEST review title",
    body: "TEST review body",
    authorName: "TEST Reviewer",
    ownExperience: "yes",
    termsAccepted: "yes",
    ...extra,
  });
}

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return /\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name) ? [file] : [];
  });
}

describe("W5-26: Wave 5 security verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    accountProviderMock.getSession.mockResolvedValue({
      accessToken: "TEST-session",
      expiresAt: "2099-01-01T00:00:00.000Z",
      customerId: owner.id,
    });
    accountProviderMock.getCustomer.mockResolvedValue(owner);
    accountProviderMock.getOrders.mockResolvedValue([deliveredOrder]);
    reviewsProviderMock.submit.mockResolvedValue({ id: "rev_TEST" });
    formsProviderMock.subscribe.mockResolvedValue({ success: true });
    formsProviderMock.sendApplication.mockResolvedValue({ success: true });
    wholesaleProviderMock.submit.mockResolvedValue({ id: "wholesale_TEST" });
  });

  afterEach(() => vi.restoreAllMocks());

  it("rejects review submission when the session is null", async () => {
    accountProviderMock.getSession.mockResolvedValue(null);

    const result = await submitReviewAction(
      { status: "idle" },
      validReviewForm()
    );

    expect(result).toEqual({
      status: "error",
      message: "Sign in to submit a review.",
    });
    expect(accountProviderMock.getCustomer).not.toHaveBeenCalled();
    expect(accountProviderMock.getOrders).not.toHaveBeenCalled();
    expect(reviewsProviderMock.submit).not.toHaveBeenCalled();
  });

  it("rejects a real delivered order owned by another customer", async () => {
    const foreignOrder = {
      ...deliveredOrder,
      id: "ord_TEST_foreign_owner",
      email: "different-owner@example.test",
    };
    accountProviderMock.getOrders.mockResolvedValue([foreignOrder]);

    const result = await submitReviewAction(
      { status: "idle" },
      validReviewForm({ orderId: foreignOrder.id })
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not verify this order.",
    });
    expect(accountProviderMock.getOrders).toHaveBeenCalledOnce();
    expect(reviewsProviderMock.submit).not.toHaveBeenCalled();
  });

  it("rejects invalid review data without crashing (Zod validation)", async () => {
    const result = await submitReviewAction(
      { status: "idle" },
      validReviewForm({ rating: "10" })
    );
    expect(result.status).toBe("invalid");
  });

  it("validates course registration with Zod and rejects malformed email", async () => {
    const result = await registerForCourse(
      { success: null, message: "" },
      form({
        courseSlug: "30-day-longevity",
        firstName: "TEST John",
        email: "not-an-email",
      })
    );
    expect(result.success).toBe(false);
  });

  it("validates affiliates application with Zod and rejects duplicate parameter injection", async () => {
    const formData = new FormData();
    formData.append("fullName", "TEST Jane Doe");
    formData.append("fullName", "TEST Injected Value");
    formData.append("email", "jane@example.test");

    const result = await submitAffiliateApplication(
      { status: "idle" },
      formData
    );
    expect(result.status).toBe("invalid");
  });

  it("validates professional application with Zod and rejects invalid profession enum", async () => {
    const result = await submitProfessionalApplication(
      { status: "idle" },
      form({
        fullName: "TEST Dr Smith",
        profession: "Astronaut",
        licenseOrCredential: "TEST-LIC-123",
        practice: "TEST clinic",
        state: "TEST-CA",
        email: "smith@example.test",
        phone: "TEST-555-1234",
        audience: "human",
        recommendationModel: "clinic",
        licenseConfirmation: "on",
        termsAccepted: "on",
      })
    );
    expect(result.status).toBe("invalid");
  });

  it("does not log wholesale application name, email, or address", async () => {
    const pii = {
      name: "TEST PII Contact Name",
      email: "test.pii@example.test",
      address: "TEST PII Address 742 Evergreen Terrace",
    };
    const loggers = ["log", "info", "warn", "error", "debug"].map((level) =>
      vi.spyOn(console, level as "log").mockImplementation(() => {})
    );

    const result = await submitWholesaleApplication(
      { status: "idle" },
      form({
        businessName: "TEST Business",
        contactName: pii.name,
        email: pii.email,
        phone: "TEST PII Phone",
        businessType: "Pet stores & groomers",
        state: "TEST State",
        locationCount: "1",
        resellerPermitOrEin: "TEST Permit",
        estimatedMonthlyOrder: "TEST Range",
        productLines: "pet",
        description: pii.address,
        termsAccepted: "on",
      })
    );

    expect(result.status).toBe("submitted");
    const logs = loggers
      .flatMap((logger) => logger.mock.calls)
      .flat()
      .map((value) =>
        typeof value === "string" ? value : JSON.stringify(value)
      )
      .join(" ");
    for (const value of Object.values(pii)) expect(logs).not.toContain(value);
  });

  it("blocks direct mock-provider imports outside the provider registry", () => {
    const files = ["app", "components", "lib", "scripts"].flatMap(sourceFiles);
    const violations: string[] = [];
    const importPattern =
      /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|^\s*import\s*)["']([^"']+)["']/gm;

    for (const file of files) {
      if (file.startsWith(path.join("lib", "providers") + path.sep)) continue;
      const source = fs.readFileSync(file, "utf8");
      for (const match of source.matchAll(importPattern)) {
        if (/(?:^|\/)lib\/providers\/mock(?:\/|$)/.test(match[1])) {
          violations.push(`${file}: ${match[1]}`);
        }
      }
    }

    // Test files are excluded because contract tests intentionally instantiate mock providers.
    expect(violations).toEqual([]);
  });
});
