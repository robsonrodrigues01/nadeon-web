// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const redirectMock = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  })
);

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import AccountOrderDetailPage from "@/app/(account)/account/orders/[id]/page";
import { signOutAccount } from "@/app/(account)/account/subscriptions/_components/subscription-actions";
import { CartDrawerFooter } from "@/components/commerce/cart-drawer/cart-drawer-footer";
import { CartDrawerShippingBar } from "@/components/commerce/cart-drawer/cart-drawer-shipping-bar";
import { Claim } from "@/components/commerce/product-card/claim";
import type { Cart } from "@/lib/providers/client";
import { accountProvider } from "@/lib/providers";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  redirectMock.mockClear();
});

describe("W5-31 high-risk behavior gaps", () => {
  it("redirects an unauthenticated order-detail request to sign in", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue(null);
    vi.spyOn(accountProvider, "signInUrl").mockResolvedValue(
      "/account/login?returnTo=%2Faccount%2Forders"
    );

    await expect(
      AccountOrderDetailPage({
        params: Promise.resolve({ id: "ord_TEST_300001" }),
      })
    ).rejects.toThrow("REDIRECT:/account/login?returnTo=%2Faccount%2Forders");
    expect(accountProvider.signInUrl).toHaveBeenCalledWith("/account/orders");
  });

  it("signs out before redirecting the subscription account to home", async () => {
    const signOut = vi.spyOn(accountProvider, "signOut").mockResolvedValue();

    await expect(signOutAccount()).rejects.toThrow("REDIRECT:/");

    expect(signOut).toHaveBeenCalledOnce();
    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("calls the checkout action when the cart footer button is activated", () => {
    const onCheckout = vi.fn();
    const cart = {
      subtotalPrice: { amount: 74.99, currencyCode: "USD" },
      totalDiscount: { amount: 0, currencyCode: "USD" },
      totalPrice: { amount: 74.99, currencyCode: "USD" },
      checkoutUrl: "https://checkout.example.test/cart",
    } as Cart;

    render(<CartDrawerFooter cart={cart} onCheckout={onCheckout} />);
    fireEvent.click(screen.getByRole("button", { name: "Checkout $74.99" }));

    expect(onCheckout).toHaveBeenCalledOnce();
  });

  it("reports the exact remaining shipping amount and unlocks at the Pet threshold", () => {
    const { rerender } = render(
      <CartDrawerShippingBar subtotal={74.99} theme="human" />
    );

    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "SPAN" &&
          element.textContent === "Add $0.01 more to unlock free shipping"
      )
    ).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "74.99"
    );

    rerender(<CartDrawerShippingBar subtotal={49} theme="pet" />);

    expect(screen.getByText(/you unlocked/i)).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "49"
    );
    expect(screen.getByText("Free shipping at $49.00")).toBeTruthy();
  });

  it("shows the FDA notice only when a claim requires its disclaimer", () => {
    const { rerender } = render(
      <Claim showDisclaimer>Supports healthy aging*</Claim>
    );

    expect(screen.getByRole("note").textContent).toContain(
      "These statements have not been evaluated by the Food and Drug Administration"
    );

    rerender(<Claim>Supports healthy aging</Claim>);
    expect(screen.queryByRole("note")).toBeNull();
  });
});
