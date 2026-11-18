// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkipLink } from "@/components/layout/skip-link";
import { OrdersBrowser } from "@/app/(account)/account/orders/_components/orders-browser";
import type { OrderRowView } from "@/app/(account)/account/orders/_components/order-view";
import { Header } from "@/components/layout/header/header";
import { MarketProvider } from "@/lib/market";
import { ReviewForm } from "@/app/(shared)/reviews/write/_components/review-form";

afterEach(cleanup);

const mockOrderRows: OrderRowView[] = [
  {
    id: "ord_1",
    orderNumber: "TEST-001",
    status: "delivered",
    statusLabel: "Delivered",
    placedLabel: "Nov 1, 2026",
    totalLabel: "€98.00",
    itemTitles: ["NMN 15000"],
    searchText: "test-001 nmn 15000",
  },
  {
    id: "ord_2",
    orderNumber: "TEST-002",
    status: "in_transit",
    statusLabel: "In transit",
    placedLabel: "Nov 5, 2026",
    totalLabel: "€50.00",
    itemTitles: ["NAD+ Booster"],
    searchText: "test-002 nad+ booster",
  },
];

describe("W5-39 keyboard accessibility & navigation", () => {
  it("Skip link shifts focus to main-content landmark on keyboard activation", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SkipLink />
        <main id="main-content" tabIndex={-1}>
          <h1>Main Content Area</h1>
        </main>
      </div>
    );

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });
    const mainLandmark = screen.getByRole("main");

    // Tab into skip link
    await user.tab();
    expect(document.activeElement).toBe(skipLink);

    // Press Enter to activate skip link
    await user.keyboard("{Enter}");
    expect(document.activeElement).toBe(mainLandmark);
  });

  it("Account orders filter tabs are operable with keyboard (Tab + Enter/Space)", async () => {
    const user = userEvent.setup();
    render(<OrdersBrowser rows={mockOrderRows} />);

    const allFilter = screen.getByRole("button", { name: /^all/i });
    const processingFilter = screen.getByRole("button", { name: "Processing" });
    const deliveredFilter = screen.getByRole("button", { name: "Delivered" });

    // Initial state: "All" is active
    expect(allFilter.getAttribute("aria-pressed")).toBe("true");

    // Tab to processing filter and activate with Space
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(processingFilter);
    await user.keyboard(" ");
    expect(processingFilter.getAttribute("aria-pressed")).toBe("true");
    expect(allFilter.getAttribute("aria-pressed")).toBe("false");

    // Tab to delivered filter and activate with Enter
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(deliveredFilter);
    await user.keyboard("{Enter}");
    expect(deliveredFilter.getAttribute("aria-pressed")).toBe("true");
    expect(processingFilter.getAttribute("aria-pressed")).toBe("false");
  });

  it("Header mobile navigation dialog closes on Escape and returns focus to menu button", async () => {
    const user = userEvent.setup();
    render(
      <MarketProvider>
        <Header />
      </MarketProvider>
    );

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    menuButton.focus();
    expect(document.activeElement).toBe(menuButton);

    // Open mobile menu via click
    fireEvent.click(menuButton);
    const navRegion = screen.getByRole("region", {
      name: /mobile navigation menu/i,
    });
    expect(navRegion).toBeDefined();

    // Press Escape to dismiss menu
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("region", { name: /mobile navigation menu/i })
    ).toBeNull();
    expect(document.activeElement).toBe(menuButton);
  });

  it("Review form fields are keyboard navigable and focusable via Tab", async () => {
    const user = userEvent.setup();
    render(
      <ReviewForm
        orderId="ord_TEST_0001"
        productSlug="biohack"
        displayName="Alex"
        email="test@example.com"
      />
    );

    const titleInput = screen.getByLabelText(/review title/i);
    const bodyInput = screen.getByLabelText(/your review/i);
    const nameInput = screen.getByLabelText(/display name/i);
    const submitBtn = screen.getByRole("button", { name: /submit review/i });

    titleInput.focus();
    expect(document.activeElement).toBe(titleInput);

    await user.tab();
    expect(document.activeElement).toBe(bodyInput);

    await user.tab();
    expect(document.activeElement).toBe(nameInput);
    expect(submitBtn).toBeDefined();
  });
});
