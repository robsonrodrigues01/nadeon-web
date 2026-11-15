// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderLookup } from "@/app/(shared)/track/_components/order-lookup";

describe("W2-43 track results", () => {
  it("renders support actions and the contract tracking URL", () => {
    render(
      <OrderLookup
        signInHref="/account"
        order={{
          id: "o",
          orderNumber: "NL-123456",
          createdAt: "2026-01-01",
          financialStatus: "paid",
          fulfillmentStatus: "in_transit",
          items: [],
          total: { amount: 1, currencyCode: "USD" },
          trackingNumber: "T123",
          trackingUrl: "https://carrier.example/t123",
        }}
      />
    );
    expect(
      screen.getByRole("link", { name: /Track shipment/ }).getAttribute("href")
    ).toBe("https://carrier.example/t123");
    expect(
      screen
        .getByRole("link", { name: "Report a problem" })
        .getAttribute("href")
    ).toContain("subject=problem");
    expect(
      screen.getByRole("link", { name: "Start a return" }).getAttribute("href")
    ).toContain("subject=return");
  });
});
