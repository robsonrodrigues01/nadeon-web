// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import W1_10Section from "@/app/(shared)/dev/kit/sections/W1-10";

describe("W1-10 Analytics Section Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders semantic section with title and both Human and Pet themes", () => {
    render(<W1_10Section />);

    const section = screen.getByRole("region", {
      name: /analytics & event tracking/i,
    });
    expect(section).toBeDefined();

    expect(screen.getByText(/Theme: Human \(Dark, Warm\)/i)).toBeDefined();
    expect(screen.getByText(/Theme: Pet \(Light, Warm\)/i)).toBeDefined();
  });

  it("renders accessible form inputs with labels in both variants", () => {
    render(<W1_10Section />);

    // 2 inputs for Product Name (one Human, one Pet)
    const productNameInputs = screen.getAllByLabelText(/Product Name/i);
    expect(productNameInputs).toHaveLength(2);
    expect((productNameInputs[0] as HTMLInputElement).value).toBe("BioHack");
    expect((productNameInputs[1] as HTMLInputElement).value).toBe(
      "More Good Years"
    );

    // 2 inputs for SKU / Slug
    const skuInputs = screen.getAllByLabelText(/SKU \/ Slug/i);
    expect(skuInputs).toHaveLength(2);
    expect((skuInputs[0] as HTMLInputElement).value).toBe("biohack");
    expect((skuInputs[1] as HTMLInputElement).value).toBe("more-good-years");

    // 2 inputs for Unit Price
    const priceInputs = screen.getAllByLabelText(/Unit Price \(USD\)/i);
    expect(priceInputs).toHaveLength(2);
    expect((priceInputs[0] as HTMLInputElement).value).toBe("59");
    expect((priceInputs[1] as HTMLInputElement).value).toBe("44");

    // 2 inputs for Quantity
    const quantityInputs = screen.getAllByLabelText(/Quantity/i);
    expect(quantityInputs).toHaveLength(2);
    expect((quantityInputs[0] as HTMLInputElement).value).toBe("1");
  });

  it("renders semantic fieldsets with legends for parameters and event dispatchers", () => {
    render(<W1_10Section />);

    const paramLegends = screen.getAllByText("Sample Product Parameters");
    expect(paramLegends).toHaveLength(2);

    const dispatchLegends = screen.getAllByText("Dispatch Analytics Events");
    expect(dispatchLegends).toHaveLength(2);
  });

  it("dispatches view_item and updates activity stream when consent is granted", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<W1_10Section />);

    const humanContainer = screen
      .getByText(/Theme: Human \(Dark, Warm\)/i)
      .closest('[data-theme="human"]') as HTMLElement;
    expect(humanContainer).not.toBeNull();

    const viewItemBtn = within(humanContainer).getByRole("button", {
      name: /Track view_item/i,
    });
    fireEvent.click(viewItemBtn);

    // Verifies console dispatch
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics]",
      "view_item",
      expect.objectContaining({
        item_id: "biohack",
        item_name: "BioHack",
        line: "human",
      })
    );

    // Verifies activity stream entry
    const trackedBadges = within(humanContainer).getAllByText("Tracked");
    expect(trackedBadges.length).toBeGreaterThan(0);

    consoleSpy.mockRestore();
  });

  it("blocks events and logs Blocked status when consent is revoked", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<W1_10Section />);

    const humanContainer = screen
      .getByText(/Theme: Human \(Dark, Warm\)/i)
      .closest('[data-theme="human"]') as HTMLElement;

    // Revoke consent
    const revokeBtn = within(humanContainer).getByRole("button", {
      name: /Revoke consent/i,
    });
    fireEvent.click(revokeBtn);

    // Click track add_to_cart
    const addToCartBtn = within(humanContainer).getByRole("button", {
      name: /Track add_to_cart/i,
    });
    fireEvent.click(addToCartBtn);

    // Console should not be called with event
    expect(consoleSpy).not.toHaveBeenCalled();

    // Verifies blocked badge in activity log
    const blockedBadge = within(humanContainer).getByText("Blocked");
    expect(blockedBadge).toBeDefined();

    const blockedReason = within(humanContainer).getByText(
      /Blocked: consent_denied/i
    );
    expect(blockedReason).toBeDefined();

    consoleSpy.mockRestore();
  });

  it("allows re-granting consent and dispatches subsequent events", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<W1_10Section />);

    const petContainer = screen
      .getByText(/Theme: Pet \(Light, Warm\)/i)
      .closest('[data-theme="pet"]') as HTMLElement;

    // First revoke
    fireEvent.click(
      within(petContainer).getByRole("button", { name: /Revoke consent/i })
    );

    // Then grant
    fireEvent.click(
      within(petContainer).getByRole("button", { name: /Grant consent/i })
    );

    // Dispatch quiz_complete
    const quizBtn = within(petContainer).getByRole("button", {
      name: /Track quiz_complete/i,
    });
    fireEvent.click(quizBtn);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics]",
      "quiz_complete",
      expect.objectContaining({
        line: "pet",
        recommended_slug: "more-good-years",
      })
    );

    consoleSpy.mockRestore();
  });

  it("triggers begin_checkout, subscribe_newsletter and purchase events correctly", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<W1_10Section />);

    const humanContainer = screen
      .getByText(/Theme: Human \(Dark, Warm\)/i)
      .closest('[data-theme="human"]') as HTMLElement;

    // Begin checkout
    fireEvent.click(
      within(humanContainer).getByRole("button", {
        name: /Track begin_checkout/i,
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics]",
      "begin_checkout",
      expect.objectContaining({ line: "human", value: 59 })
    );

    // Subscribe newsletter
    fireEvent.click(
      within(humanContainer).getByRole("button", {
        name: /Track subscribe_newsletter/i,
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics]",
      "subscribe_newsletter",
      expect.objectContaining({ list: "newsletter-human" })
    );

    // Purchase
    fireEvent.click(
      within(humanContainer).getByRole("button", {
        name: /Track purchase/i,
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Analytics]",
      "purchase",
      expect.objectContaining({ line: "human", value: 59 })
    );

    consoleSpy.mockRestore();
  });

  it("allows clearing the activity log", () => {
    render(<W1_10Section />);

    const humanContainer = screen
      .getByText(/Theme: Human \(Dark, Warm\)/i)
      .closest('[data-theme="human"]') as HTMLElement;

    // Trigger an event to generate a log entry
    fireEvent.click(
      within(humanContainer).getByRole("button", {
        name: /Track view_item/i,
      })
    );

    const clearLogBtn = within(humanContainer).getByRole("button", {
      name: /Clear log/i,
    });
    fireEvent.click(clearLogBtn);

    expect(
      within(humanContainer).getByText(/No events triggered yet/i)
    ).toBeDefined();
  });
});
