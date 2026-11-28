// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
const addLines = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/providers/client", () => ({
  cartProvider: { addLines: (...args: unknown[]) => addLines(...args) },
}));

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
  it("reorders the contract lines through the browser cart", async () => {
    addLines.mockResolvedValue({});
    render(<AccountDashboard view={view} />);

    await userEvent.click(screen.getByRole("button", { name: "Reorder" }));

    expect(addLines).toHaveBeenCalledWith([{ variantId: "v1", quantity: 2 }]);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/cart"));
  });
});
