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
import HumanLayout from "@/app/(human)/human/layout";
import { useCartStore } from "@/lib/providers/client";

describe("Human Layout (W1-22)", () => {
  beforeEach(() => {
    useCartStore.getState().resetCart();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders complete shell with announcement bar, header, trust strip, newsletter, footer, and overlays", async () => {
    const jsx = await HumanLayout({
      children: (
        <section data-testid="page-content">Human Home Content</section>
      ),
    });
    const { container } = render(jsx);

    // Human line theme container
    const shell = container.querySelector('[data-theme="human"]');
    expect(shell).toBeDefined();
    expect(shell).not.toBeNull();

    // Announcement bar (Human text)
    expect(screen.getByText(/FREE SHIPPING OVER \$75/i)).toBeDefined();

    // Header with banner role and Human navigation
    const header = screen.getByRole("banner");
    expect(header).toBeDefined();
    const headerNav = within(header);
    expect(headerNav.getByRole("link", { name: "Shop" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "Science" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "Quiz" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "Subscribe" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: "About" })).toBeDefined();
    expect(headerNav.getByRole("link", { name: /Shop Pet/i })).toBeDefined();

    // Page content rendered
    expect(screen.getByTestId("page-content")).toBeDefined();
    expect(screen.getByText("Human Home Content")).toBeDefined();

    // Trust strip
    expect(screen.getByText(/Made in Clifton, NJ/i)).toBeDefined();
    expect(screen.getByText(/Tested every lot/i)).toBeDefined();

    // Newsletter section
    const newsletterHeadings = screen.getAllByText(/Join the Nadeon list/i);
    expect(newsletterHeadings.length).toBeGreaterThanOrEqual(1);
    const emailInputs = screen.getAllByRole("textbox", { name: /email/i });
    expect(emailInputs.length).toBeGreaterThanOrEqual(1);

    // Footer with contentinfo role
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeDefined();
    const footerNav = within(footer);
    expect(
      footerNav.getByRole("link", { name: /Switch to Nadeon Pet/i })
    ).toBeDefined();
  });

  it("triggers cart drawer event when clicking cart button in header", async () => {
    const eventSpy = vi.fn();
    window.addEventListener("nadeon:open-cart", eventSpy);

    const jsx = await HumanLayout({
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
