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
import GiftCardPage, { generateMetadata } from "@/app/(shared)/gift-card/page";
import { GiftCardPurchaseForm } from "@/app/(shared)/gift-card/_components/gift-card-purchase-form";
import type { GiftCardPurchaseInput } from "@/lib/contracts/gift-card";
import { MockGiftCardProvider } from "@/lib/providers/mock/gift-card";
import { DEFAULT_MARKET } from "@/lib/market";
import { cartProvider } from "@/lib/providers/client";

describe("W5-06 /gift-card Route & Semantic Controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("exports valid metadata for /gift-card", async () => {
    const meta = await generateMetadata();
    expect(JSON.stringify(meta.title)).toMatch(/gift card/i);
  });

  it("renders page with semantic headings, breadcrumbs, live preview, and FAQ", async () => {
    const page = await GiftCardPage();
    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: /give a gift card/i })
    ).toBeDefined();

    // Breadcrumbs
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeDefined();
    expect(nav.textContent).toContain("Home");
    expect(nav.textContent).toContain("Human");
    expect(nav.textContent).toContain("Gift card");

    // Live preview and card designs
    expect(screen.getByText("LIVE PREVIEW")).toBeDefined();
    expect(screen.getByRole("button", { name: /espresso/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /sunset/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /cream/i })).toBeDefined();

    // Section 5 fields & controls
    expect(screen.getByLabelText(/recipient name/i)).toBeDefined();
    expect(screen.getByLabelText(/recipient email/i)).toBeDefined();
    expect(screen.getByLabelText(/your name/i)).toBeDefined();
    expect(screen.getByLabelText(/message/i)).toBeDefined();

    // Delivery controls
    expect(screen.getByRole("button", { name: /send today/i })).toBeDefined();
    expect(
      screen.getByRole("button", { name: /schedule a date/i })
    ).toBeDefined();

    // Add to cart button
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeDefined();

    // How it works
    expect(screen.getByText("HOW IT WORKS")).toBeDefined();
    expect(screen.getByText("Three simple steps")).toBeDefined();
    expect(screen.getByText("Pick and personalize")).toBeDefined();
    expect(screen.getByText("We email it")).toBeDefined();
    expect(screen.getByText("They shop")).toBeDefined();

    // FAQ section
    expect(screen.getByText("Gift card questions")).toBeDefined();
    expect(screen.getByText("How do they redeem the gift card?")).toBeDefined();
  });

  it("updates Live Preview and Email Preview reactively as user types", async () => {
    const mockProvider = new MockGiftCardProvider();
    render(
      <GiftCardPurchaseForm provider={mockProvider} market={DEFAULT_MARKET} />
    );

    const recipientInput = screen.getByLabelText(/recipient name/i);
    const senderInput = screen.getByLabelText(/your name/i);
    const messageInput = screen.getByLabelText(/message/i);

    fireEvent.change(recipientInput, { target: { value: "Eleanor" } });
    fireEvent.change(senderInput, { target: { value: "Marcus" } });
    fireEvent.change(messageInput, { target: { value: "Happy birthday!" } });

    // Live Card Preview should show "To: Eleanor · From: Marcus"
    expect(screen.getByText(/To: Eleanor · From: Marcus/i)).toBeDefined();

    // Email Preview should show Marcus and the message
    expect(
      screen.getByText(/Marcus sent you a Nadeon Labs gift card/i)
    ).toBeDefined();
    expect(screen.getByText(/“Happy birthday!”/i)).toBeDefined();
  });

  it("allows switching between card designs (espresso, sunset, cream)", async () => {
    const mockProvider = new MockGiftCardProvider();
    render(
      <GiftCardPurchaseForm provider={mockProvider} market={DEFAULT_MARKET} />
    );

    const sunsetBtn = screen.getByRole("button", { name: /sunset/i });
    fireEvent.click(sunsetBtn);
    expect(sunsetBtn.getAttribute("aria-pressed")).toBe("true");

    const creamBtn = screen.getByRole("button", { name: /cream/i });
    fireEvent.click(creamBtn);
    expect(creamBtn.getAttribute("aria-pressed")).toBe("true");
    expect(sunsetBtn.getAttribute("aria-pressed")).toBe("false");
  });

  it("supports preset amounts and custom amount selection formatted by market currency", async () => {
    const mockProvider = new MockGiftCardProvider();
    render(
      <GiftCardPurchaseForm provider={mockProvider} market={DEFAULT_MARKET} />
    );

    // Preset amounts $50, $100, etc.
    const amount50Btn = screen.getByRole("button", { name: "$50.00" });
    fireEvent.click(amount50Btn);
    expect(amount50Btn.getAttribute("aria-pressed")).toBe("true");

    // Add to cart reflects the selected amount with market currency
    expect(
      screen.getByRole("button", { name: /add to cart · \$50\.00/i })
    ).toBeDefined();

    // Custom amount
    const customBtn = screen.getByRole("button", { name: /custom amount/i });
    fireEvent.click(customBtn);
    const customInput = screen.getByLabelText(/enter custom amount/i);
    fireEvent.change(customInput, { target: { value: "75" } });

    expect(
      screen.getByRole("button", { name: /add to cart · \$75\.00/i })
    ).toBeDefined();
  });

  it("validates delivery date with ISO 8601 when scheduling a date", async () => {
    const mockProvider = new MockGiftCardProvider();
    render(
      <GiftCardPurchaseForm provider={mockProvider} market={DEFAULT_MARKET} />
    );

    const scheduleBtn = screen.getByRole("button", {
      name: /schedule a date/i,
    });
    fireEvent.click(scheduleBtn);

    const dateInput = screen.getByLabelText(/delivery date/i);
    expect(dateInput).toBeDefined();

    // Set ISO 8601 date
    fireEvent.change(dateInput, { target: { value: "2026-12-25" } });
    expect((dateInput as HTMLInputElement).value).toBe("2026-12-25");
  });

  it("announces validation errors with role='alert' when required fields are missing", async () => {
    const mockProvider = new MockGiftCardProvider();
    render(
      <GiftCardPurchaseForm provider={mockProvider} market={DEFAULT_MARKET} />
    );

    const submitBtn = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(submitBtn);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeDefined();
    expect(alert.textContent).toMatch(/required|valid/i);
  });

  it("submits valid purchase through provider.preparePurchase and adds to cart", async () => {
    const mockProvider = new MockGiftCardProvider();
    const prepareSpy = vi.spyOn(mockProvider, "preparePurchase");
    const addLineSpy = vi
      .spyOn(cartProvider, "addLines")
      .mockResolvedValue({} as never);

    render(
      <GiftCardPurchaseForm provider={mockProvider} market={DEFAULT_MARKET} />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/recipient name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/recipient email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Enjoy!" },
    });

    const submitBtn = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(prepareSpy).toHaveBeenCalledTimes(1);
      expect(addLineSpy).toHaveBeenCalledTimes(1);
    });

    const calledInput = prepareSpy.mock.calls[0][0] as GiftCardPurchaseInput;
    expect(calledInput.recipientName).toBe("John Doe");
    expect(calledInput.recipientEmail).toBe("john@example.com");
    expect(calledInput.senderName).toBe("Jane Doe");
    expect(calledInput.message).toBe("Enjoy!");
    expect(calledInput.amount.currencyCode).toBe(DEFAULT_MARKET.currency.code);
    expect(calledInput.deliveryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); // ISO 8601 date
  });

  it("renders terms with 'To be confirmed' and prevents buying gift cards with gift cards rule", async () => {
    const page = await GiftCardPage();
    render(page);

    expect(screen.getByText(/terms: to be confirmed/i)).toBeDefined();
    expect(
      screen.getByText(/cannot be used to purchase additional gift cards/i)
    ).toBeDefined();
  });
});
