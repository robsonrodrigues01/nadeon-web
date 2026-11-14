// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import {
  CartDrawer,
  openCartDrawer,
  closeCartDrawer,
  useCartDrawerStore,
} from "@/components/commerce/cart-drawer";
import type { Cart, CartProvider } from "@/lib/providers/client";
import W114Section from "@/app/(shared)/dev/kit/sections/W1-14";

describe("CartDrawer Component (W1-14)", () => {
  let mockCart: Cart;
  let mockCartProvider: CartProvider;

  beforeEach(() => {
    useCartDrawerStore.setState({ isOpen: false, theme: "human" });

    mockCart = {
      id: "cart_test_123",
      lines: [
        {
          id: "line_biohack_1",
          variantId: "var_biohack_1",
          quantity: 1,
          sellingPlanId: "plan_biohack_30d",
          sellingPlanTitle: "1 jar every 30 days (15% off)",
          product: {
            id: "biohack",
            title: "BioHack",
            handle: "biohack",
            image: "/images/products/biohack-front.webp",
            line: "human",
          },
          price: { amount: 50.15, currencyCode: "USD" },
          total: { amount: 50.15, currencyCode: "USD" },
        },
        {
          id: "line_renew_1",
          variantId: "var_renew_1",
          quantity: 1,
          sellingPlanId: null,
          product: {
            id: "renew",
            title: "Renew",
            handle: "renew",
            image: "/images/products/renew-front.webp",
            line: "human",
          },
          price: { amount: 65, currencyCode: "USD" },
          total: { amount: 65, currencyCode: "USD" },
        },
      ],
      discountCodes: [],
      subtotalPrice: { amount: 115.15, currencyCode: "USD" },
      totalDiscount: { amount: 8.85, currencyCode: "USD" },
      totalPrice: { amount: 115.15, currencyCode: "USD" },
      totalQuantity: 2,
      checkoutUrl: "https://checkout.nadeon.com/mock/cart_test_123",
    };

    mockCartProvider = {
      get: vi.fn().mockResolvedValue(mockCart),
      create: vi.fn().mockResolvedValue(mockCart),
      addLines: vi.fn().mockResolvedValue(mockCart),
      addKit: vi.fn().mockResolvedValue(mockCart),
      updateLines: vi.fn().mockResolvedValue(mockCart),
      removeLines: vi.fn().mockResolvedValue(mockCart),
      applyDiscount: vi.fn().mockResolvedValue(mockCart),
      setLineSellingPlan: vi.fn().mockResolvedValue(mockCart),
      checkoutUrl: vi.fn().mockResolvedValue(mockCart.checkoutUrl),
    };
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders accessible dialog with cart title, close button and item count", () => {
    const onClose = vi.fn();
    render(
      <CartDrawer
        isOpen={true}
        onClose={onClose}
        theme="human"
        cart={mockCart}
        cartProvider={mockCartProvider}
      />
    );

    // Dialog title
    const heading = screen.getByRole("heading", { name: /your cart \(2\)/i });
    expect(heading).toBeDefined();

    // Close button
    const closeBtn = screen.getByRole("button", { name: /close cart/i });
    expect(closeBtn).toBeDefined();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders product items with Intl formatted prices, images, and routine information", () => {
    render(
      <CartDrawer
        isOpen={true}
        theme="human"
        cart={mockCart}
        cartProvider={mockCartProvider}
      />
    );

    expect(screen.getByText("BioHack")).toBeDefined();
    expect(screen.getByText("Renew")).toBeDefined();

    // Check images with alt
    expect(screen.getByAltText("BioHack")).toBeDefined();
    expect(screen.getByAltText("Renew")).toBeDefined();

    // Formatted prices
    expect(screen.getByText("$50.15")).toBeDefined();
    expect(screen.getByText("$65.00")).toBeDefined();
  });

  it("handles subscription vs one-time purchase alternation, Change link and Switch link", async () => {
    render(
      <CartDrawer
        isOpen={true}
        theme="human"
        cart={mockCart}
        cartProvider={mockCartProvider}
      />
    );

    // BioHack is on subscription
    expect(screen.getByText(/subscribe & save 15%/i)).toBeDefined();
    expect(screen.getByText(/↻ delivered every 30 days/i)).toBeDefined();

    // Change frequency link button
    const changeBtn = screen.getByRole("button", {
      name: /change subscription frequency for biohack/i,
    });
    expect(changeBtn).toBeDefined();
    fireEvent.click(changeBtn);

    // Frequency schedule options revealed
    expect(
      screen.getByText(/delivery every 60 days \(15% off\)/i)
    ).toBeDefined();

    // Click switch to one-time inside change menu
    const switchToOneTimeBtn = screen.getByRole("button", {
      name: /switch to one-time purchase/i,
    });
    fireEvent.click(switchToOneTimeBtn);

    await waitFor(() => {
      expect(mockCartProvider.setLineSellingPlan).toHaveBeenCalledWith(
        "line_biohack_1",
        null
      );
    });

    // Renew is one-time purchase
    expect(screen.getByText(/one-time purchase/i)).toBeDefined();
    const switchToSubBtn = screen.getByRole("button", {
      name: /switch renew to subscription and save 15%/i,
    });
    expect(switchToSubBtn).toBeDefined();

    fireEvent.click(switchToSubBtn);
    await waitFor(() => {
      expect(mockCartProvider.setLineSellingPlan).toHaveBeenCalledWith(
        "line_renew_1",
        "plan_renew_30d"
      );
    });
  });

  it("handles quantity decrease, increase and item removal via semantic buttons", async () => {
    render(
      <CartDrawer
        isOpen={true}
        theme="human"
        cart={mockCart}
        cartProvider={mockCartProvider}
      />
    );

    // Quantity buttons
    const incBiohack = screen.getByRole("button", {
      name: /increase quantity of biohack/i,
    });
    const decBiohack = screen.getByRole("button", {
      name: /decrease quantity of biohack/i,
    });

    fireEvent.click(incBiohack);
    await waitFor(() => {
      expect(mockCartProvider.updateLines).toHaveBeenCalledWith([
        { id: "line_biohack_1", quantity: 2 },
      ]);
    });

    fireEvent.click(decBiohack);
    await waitFor(() => {
      expect(mockCartProvider.removeLines).toHaveBeenCalledWith([
        "line_biohack_1",
      ]);
    });

    // Remove button
    const removeRenew = screen.getByRole("button", {
      name: /remove renew from cart/i,
    });
    fireEvent.click(removeRenew);
    await waitFor(() => {
      expect(mockCartProvider.removeLines).toHaveBeenCalledWith([
        "line_renew_1",
      ]);
    });
  });

  it("renders additional upsell item (+ Add) and adds variant to cart", async () => {
    render(
      <CartDrawer
        isOpen={true}
        theme="human"
        cart={mockCart}
        cartProvider={mockCartProvider}
      />
    );

    expect(screen.getByText("Prime")).toBeDefined();
    expect(screen.getByText(/250 mg of pure nad\+ per scoop\*/i)).toBeDefined();

    const addBtn = screen.getByRole("button", {
      name: /add prime to cart/i,
    });
    expect(addBtn).toBeDefined();

    fireEvent.click(addBtn);
    await waitFor(() => {
      expect(mockCartProvider.addLines).toHaveBeenCalledWith([
        { variantId: "var_prime_1", quantity: 1 },
      ]);
    });
  });

  it("renders Pet variant with $49 threshold, Golden Years Oil upsell and animal use disclaimer", async () => {
    const petCart: Cart = {
      ...mockCart,
      lines: [
        {
          id: "line_mgy_1",
          variantId: "var_mgy_1",
          quantity: 1,
          sellingPlanId: "plan_more_good_years_30d",
          sellingPlanTitle: "Delivery every 30 days (15% off)",
          product: {
            id: "more-good-years",
            title: "More Good Years",
            handle: "more-good-years",
            line: "pet",
          },
          price: { amount: 37.4, currencyCode: "USD" },
          total: { amount: 37.4, currencyCode: "USD" },
        },
      ],
      subtotalPrice: { amount: 37.4, currencyCode: "USD" },
      totalPrice: { amount: 37.4, currencyCode: "USD" },
      totalQuantity: 1,
    };

    render(
      <CartDrawer
        isOpen={true}
        theme="pet"
        cart={petCart}
        cartProvider={mockCartProvider}
      />
    );

    // Threshold Pet check ($49)
    expect(screen.getByText(/free shipping at \$49\.00/i)).toBeDefined();

    // Upsell Pet check
    expect(screen.getByText("Golden Years Oil")).toBeDefined();
    const addPetUpsell = screen.getByRole("button", {
      name: /add golden years oil to cart/i,
    });
    fireEvent.click(addPetUpsell);
    await waitFor(() => {
      expect(mockCartProvider.addLines).toHaveBeenCalledWith([
        { variantId: "var_golden_years_oil_1", quantity: 1 },
      ]);
    });

    // Animal use regulatory disclaimer
    expect(screen.getByText(/for animal use only\./i)).toBeDefined();
  });

  it("renders unlocked free shipping progress bar when subtotal exceeds threshold", () => {
    render(
      <CartDrawer
        isOpen={true}
        theme="human"
        cart={mockCart} // subtotal is 115.15 > 75
        cartProvider={mockCartProvider}
      />
    );

    expect(screen.getByText(/you unlocked/i)).toBeDefined();
    expect(screen.getAllByText(/free shipping/i).length).toBeGreaterThanOrEqual(
      2
    );
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "75"
    );
  });

  it("renders subtotal, subscription savings, checkout button and express checkout options", () => {
    render(
      <CartDrawer
        isOpen={true}
        theme="human"
        cart={mockCart}
        cartProvider={mockCartProvider}
      />
    );

    // Subtotal and savings
    expect(screen.getByText("Subtotal")).toBeDefined();
    expect(screen.getByText("Subscription savings")).toBeDefined();
    expect(screen.getByText("−$8.85")).toBeDefined();

    // Checkout button
    const checkoutBtn = screen.getByRole("button", {
      name: /checkout \$115\.15/i,
    });
    expect(checkoutBtn).toBeDefined();

    // Express payment buttons
    expect(
      screen.getByRole("button", { name: /pay with apple pay/i })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /pay with google pay/i })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /pay with paypal/i })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /pay with shop pay/i })
    ).toBeDefined();

    // FDA disclaimer
    expect(
      screen.getByText(/these statements have not been evaluated/i)
    ).toBeDefined();
  });

  it("renders empty cart state when cart has no lines", () => {
    const emptyCart: Cart = {
      id: "empty_cart",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 0, currencyCode: "USD" },
      totalDiscount: { amount: 0, currencyCode: "USD" },
      totalPrice: { amount: 0, currencyCode: "USD" },
      totalQuantity: 0,
      checkoutUrl: "https://checkout.nadeon.com/mock/empty",
    };

    render(
      <CartDrawer
        isOpen={true}
        theme="human"
        cart={emptyCart}
        cartProvider={mockCartProvider}
      />
    );

    expect(screen.getByText(/your cart is empty/i)).toBeDefined();
    expect(screen.getByRole("link", { name: /shop all/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /take the quiz/i })).toBeDefined();
  });

  it("opens via openCartDrawer helper and custom events", async () => {
    render(<CartDrawer cart={mockCart} cartProvider={mockCartProvider} />);

    // Initially closed
    expect(screen.queryByText("BioHack")).toBeNull();

    // Open via helper
    openCartDrawer("human");

    await waitFor(() => {
      expect(screen.getByText("BioHack")).toBeDefined();
    });

    // Close via helper
    closeCartDrawer();

    await waitFor(() => {
      expect(screen.queryByText("BioHack")).toBeNull();
    });
  });

  it("renders W1-14 vitrine section without errors", () => {
    render(<W114Section />);

    expect(
      screen.getByRole("heading", {
        name: /shopping cart drawer \(human & pet\)/i,
      })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /open human drawer \(2 items\)/i })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /open pet drawer \(2 items\)/i })
    ).toBeDefined();
  });
});
