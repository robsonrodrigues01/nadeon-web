// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AccountDashboard } from "@/app/(account)/account/_components/dashboard-view";

afterEach(cleanup);

const view = {
  firstName: "A",
  fullName: "A User",
  initial: "A",
  nextDelivery: null,
  activeSubscriptions: [],
  recentOrder: {
    id: "o1",
    orderNumber: "NL-123456",
    statusLabel: "Delivered",
    firstTitle: "Item",
    itemCount: 1,
    totalLabel: "$10",
    lines: [{ variantId: "v1", quantity: 2 }],
  },
  canSkip: false,
  canReschedule: false,
  canEditItems: false,
};

describe("W2-43 account", () => {
  it("renders reorder with contract lines as hidden form data", () => {
    render(<AccountDashboard view={view} />);
    const button = screen.getByRole("button", { name: "Reorder" });
    expect(
      button
        .closest("form")
        ?.querySelector('[name="variantId"]')
        ?.getAttribute("value")
    ).toBe("v1");
    expect(
      button
        .closest("form")
        ?.querySelector('[name="quantity"]')
        ?.getAttribute("value")
    ).toBe("2");
  });
});
