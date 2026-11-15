// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrackResult } from "@/app/(shared)/track/_components/track-result";
import { DEFAULT_MARKET } from "@/lib/market";
import { OrderSchema } from "@/lib/contracts/account";

describe("W2-43 track results", () => {
  it("renders support actions and the contract tracking URL", () => {
    render(
      <TrackResult
        market={DEFAULT_MARKET}
        order={OrderSchema.parse({
          id: "o",
          orderNumber: "NL-123456",
          createdAt: "2026-01-01",
          financialStatus: "paid",
          fulfillmentStatus: "in_transit",
          items: [],
          total: { amount: 1, currencyCode: "USD" },
          trackingNumber: "T123",
          trackingUrl: "https://carrier.example/t123",
        })}
      />
    );
    expect(
      screen
        .getByRole("link", { name: /Track on carrier/ })
        .getAttribute("href")
    ).toBe("https://carrier.example/t123");
    expect(
      screen
        .getByRole("link", { name: "Report a problem" })
        .getAttribute("href")
    ).toBe("/help?subject=problem&order=NL-123456");
    expect(
      screen.getByRole("link", { name: "Start a return" }).getAttribute("href")
    ).toBe("/help?subject=return&order=NL-123456");
  });
});
