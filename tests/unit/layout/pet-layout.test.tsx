/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  within,
} from "@testing-library/react";
import PetLayout from "@/app/(pet)/pet/layout";
import { useCartStore } from "@/lib/providers/client";

describe("Pet Layout (W1-22)", () => {
  beforeEach(() => {
    useCartStore.getState().resetCart();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders complete shell with announcement bar, header, trust strip, newsletter, footer, and overlays in Pet variant", async () => {
    const jsx = await PetLayout({
      children: <section data-testid="page-content">Pet Home Content</section>,
    });
    const { container } = render(jsx);

    // Pet line theme container
    const shell = container.querySelector('[data-theme="pet"]');
    expect(shell).toBeDefined();
    expect(shell).not.toBeNull();

    // Announcement bar (Pet text)
    expect(screen.getByText(/FREE SHIPPING OVER \$49/i)).toBeDefined();

    // Header with banner role and Pet navigation
    const header = screen.getByRole("banner");
    expect(header).toBeDefined();
    const headerNav = within(header);
    expect(headerNav.getByRole("link", { name: "Dogs" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "Cats" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "Horses" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "Quiz" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "Subscribe" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "About" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: /Shop Human/i })).toBeDefined();

    // Page content rendered
    expect(screen.getByTestId("page-content")).toBeDefined();
    expect(screen.getByText("Pet Home Content")).toBeDefined();

    // Trust strip
    expect(screen.getByText(/Made in Clifton, NJ/i)).toBeDefined();
    expect(screen.getByText(/Tested every lot/i)).toBeDefined();

    // Newsletter section (Pet variant: "Join the pack")
    const newsletterHeadings = await screen.findAllByText(/Join the pack/i);
    expect(newsletterHeadings.length).toBeGreaterThanOrEqual(1);
    const emailInputs = await screen.findAllByRole("textbox", {
      name: /email/i,
    });
    expect(emailInputs.length).toBeGreaterThanOrEqual(1);

    // Footer with contentinfo role and Pet regulatory statements
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeDefined();
    const footerNav = within(footer);
    expect(
      footerNav.getByRole("link", { name: /Switch to Nadeon Human/i })
    ).toBeDefined();
    expect(footerNav.getByText(/For animal use only/i)).toBeDefined();
  });

  it("triggers cart drawer event when clicking cart button in header", async () => {
    const eventSpy = vi.fn();
    window.addEventListener("nadeon:open-cart", eventSpy);

    const jsx = await PetLayout({
      children: <div>Child</div>,
    });
    render(jsx);

    const cartLinks = screen.getAllByRole("link", { name: /cart/i });
    expect(cartLinks.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(cartLinks[0]);

    expect(eventSpy).toHaveBeenCalled();
    window.removeEventListener("nadeon:open-cart", eventSpy);
  });
});
