/**
 * @vitest-environment jsdom
 */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
const addLines = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/providers/client", () => ({
  cartProvider: { addLines: (...args: unknown[]) => addLines(...args) },
}));

import { ReorderButton } from "@/app/(account)/account/_components/reorder-button";

afterEach(() => {
  cleanup();
  push.mockReset();
  addLines.mockReset();
});

const lines = [
  { variantId: "gid://shopify/ProductVariant/1", quantity: 2 },
  { variantId: "gid://shopify/ProductVariant/2", quantity: 1 },
];

describe("W4-37 dashboard reorder uses the browser cart", () => {
  it("adds the order lines to the browser cart and opens /cart", async () => {
    addLines.mockResolvedValue({});
    render(<ReorderButton lines={lines} />);

    await userEvent.click(screen.getByRole("button", { name: "Reorder" }));

    expect(addLines).toHaveBeenCalledWith(lines);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/cart"));
  });

  it("stays on the page and tells the visitor when adding fails", async () => {
    addLines.mockRejectedValue(new Error("Shopify down"));
    render(<ReorderButton lines={lines} />);

    await userEvent.click(screen.getByRole("button", { name: "Reorder" }));

    expect((await screen.findByRole("status")).textContent).toBe(
      "Unable to add items to cart"
    );
    expect(push).not.toHaveBeenCalled();
  });
});
