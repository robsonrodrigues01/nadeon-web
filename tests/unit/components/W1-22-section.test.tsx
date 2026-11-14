/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import W122Section from "@/app/(shared)/dev/kit/sections/W1-22";
import { useCartStore } from "@/lib/providers/client";

describe("W1-22 DevKit Showcase Section", () => {
  beforeEach(() => {
    useCartStore.getState().resetCart();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders showcase section with semantic heading, controls form, select and buttons", () => {
    render(<W122Section />);

    // Section root
    const section = screen.getByRole("region", {
      name: /full shell integration \(human & pet\)/i,
    });
    expect(section).toBeDefined();

    // Semantic form controls
    const form = screen.getByRole("form", {
      name: /shell overlay verification controls/i,
    });
    expect(form).toBeDefined();

    // Line selector
    const select = screen.getByRole("combobox", { name: /active line theme/i });
    expect(select).toBeDefined();
    expect(select.getAttribute("id")).toBe("w1-22-line-selector");

    // Action buttons
    expect(
      screen.getByRole("button", { name: /open human cart drawer/i })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /trigger 10% discount popup/i })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /toggle cookie banner/i })
    ).toBeDefined();
  });

  it("renders both Human and Pet shell previews with all global components", () => {
    const { container } = render(<W122Section />);

    // Both themes present
    const humanShell = container.querySelector('[data-theme="human"]');
    const petShell = container.querySelector('[data-theme="pet"]');
    expect(humanShell).not.toBeNull();
    expect(petShell).not.toBeNull();

    // Announcement bar content
    expect(
      screen.getAllByText(/FREE SHIPPING OVER \$75/i).length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/FREE SHIPPING OVER \$49/i).length
    ).toBeGreaterThanOrEqual(1);

    // Headings and line slots
    expect(screen.getByText(/Cellular Longevity for Humans/i)).toBeDefined();
    expect(
      screen.getByText(/Cellular Health for Dogs, Cats & Horses/i)
    ).toBeDefined();

    // Trust strips
    const trustElements = screen.getAllByText(/Made in Clifton, NJ/i);
    expect(trustElements.length).toBeGreaterThanOrEqual(2);

    // Regulatory compliance text in footers
    expect(
      screen.getAllByText(/For animal use only/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("switches theme in control select and triggers cart drawer dialog", () => {
    render(<W122Section />);

    const select = screen.getByRole("combobox", { name: /active line theme/i });
    fireEvent.change(select, { target: { value: "pet" } });

    const openPetDrawerBtn = screen.getByRole("button", {
      name: /open pet cart drawer/i,
    });
    expect(openPetDrawerBtn).toBeDefined();

    fireEvent.click(openPetDrawerBtn);

    // Dialog opens
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(
      within(dialog).getByRole("heading", { name: /your cart \(/i })
    ).toBeDefined();
  });

  it("triggers first-visit 10% popup overlay when button clicked", () => {
    render(<W122Section />);

    const triggerPopupBtn = screen.getByRole("button", {
      name: /trigger 10% discount popup/i,
    });
    fireEvent.click(triggerPopupBtn);

    // First visit popup appears with email field
    expect(screen.getByRole("heading", { name: /10% off/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /close dialog/i })).toBeDefined();
  });

  it("toggles cookie banner when toggle button clicked", () => {
    render(<W122Section />);

    const toggleBtn = screen.getByRole("button", {
      name: /toggle cookie banner \(show\)/i,
    });
    fireEvent.click(toggleBtn);

    // Cookie banner is displayed
    const cookieRegion = screen.getByRole("region", {
      name: /cookie consent banner/i,
    });
    expect(cookieRegion).toBeDefined();
    expect(screen.getByText(/We use cookies/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /accept all/i })).toBeDefined();
    expect(
      screen.getByRole("button", { name: /reject non-essential/i })
    ).toBeDefined();
  });
});
