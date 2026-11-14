// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import W1_15Section from "@/app/(shared)/dev/kit/sections/W1-15";

describe("W1-15 Dev Kit Section", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders showcase section with Human and Pet lines", async () => {
    const jsx = await W1_15Section();
    render(jsx);

    // Section container
    const section = screen.getByRole("region", {
      name: /quiz engine & routine builder/i,
    });
    expect(section).toBeTruthy();
    expect(section.getAttribute("id")).toBe("w1-15-showcase");

    // Headings
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /quiz engine & routine builder/i,
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /personalized nad\+ routine quiz/i,
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /dog, cat & horse longevity plan quiz/i,
      })
    ).toBeTruthy();

    // Human & Pet theme boundaries
    const humanBlock = document.querySelector('[data-theme="human"]');
    const petBlock = document.querySelector('[data-theme="pet"]');
    expect(humanBlock).toBeTruthy();
    expect(petBlock).toBeTruthy();
  });
});
