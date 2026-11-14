// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import W1_13Section from "@/app/(shared)/dev/kit/sections/W1-13";

describe("W1-13 Dev Kit Section Showcase", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders showcase section with Human and Pet lines, accessible selector and dose calculator", async () => {
    const jsx = await W1_13Section();
    render(jsx);

    // Section container
    const section = screen.getByRole("region", {
      name: /dosing by weight & weight selector/i,
    });
    expect(section).toBeTruthy();
    expect(section.getAttribute("id")).toBe("w1-13-showcase");

    // Headings
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /dosing by weight & weight selector/i,
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /pet line dosing & calculator/i,
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /human line serving protocol/i,
      })
    ).toBeTruthy();

    // Theme boundaries
    const petBlock = document.querySelector('[data-theme="pet"]');
    const humanBlock = document.querySelector('[data-theme="human"]');
    expect(petBlock).toBeTruthy();
    expect(humanBlock).toBeTruthy();

    // Pet regulatory notices
    expect(
      screen.getAllByText(/for animal use only/i).length
    ).toBeGreaterThanOrEqual(1);

    // Form semantic elements: fieldsets, radiogroups, inputs, buttons
    const fieldsets = screen.getAllByRole("group");
    expect(fieldsets.length).toBeGreaterThan(0);

    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(0);

    // Unit toggle buttons
    const lbButtons = screen.getAllByRole("button", { name: /^lb$/i });
    const kgButtons = screen.getAllByRole("button", { name: /^kg$/i });
    expect(lbButtons.length).toBeGreaterThanOrEqual(1);
    expect(kgButtons.length).toBeGreaterThanOrEqual(1);

    // Standard 4 weight bands in Pet section
    expect(
      screen.getAllByLabelText("Up to 20 lbs").length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByLabelText("21 to 50 lbs").length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByLabelText("51 to 90 lbs").length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByLabelText("Over 90 lbs").length
    ).toBeGreaterThanOrEqual(1);
  });
});
