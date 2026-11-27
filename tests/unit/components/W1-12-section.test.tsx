// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import W1_12Section from "@/app/(shared)/dev/kit/sections/W1-12";

describe("W1-12 Dev Kit Section", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders showcase section with Human and Pet lines and market pricing proof", async () => {
    const jsx = await W1_12Section();
    render(jsx);

    // Section container
    const section = screen.getByRole("region", {
      name: /product card & purchase options/i,
    });
    expect(section).toBeTruthy();
    expect(section.getAttribute("id")).toBe("w1-12-showcase");

    // Headings
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /product card & purchase options/i,
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /biohack cellular optimizer/i,
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /more good years chews/i,
      })
    ).toBeTruthy();

    // Human & Pet theme boundaries
    const humanBlock = document.querySelector('[data-theme="human"]');
    const petBlock = document.querySelector('[data-theme="pet"]');
    expect(humanBlock).toBeTruthy();
    expect(petBlock).toBeTruthy();

    // USD currency formatting proof section
    expect(screen.getByText(/USD Currency Formatting/i)).toBeTruthy();
    expect(screen.getByText("US Market (USD)")).toBeTruthy();
  });
});
