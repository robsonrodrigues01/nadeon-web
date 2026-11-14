/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import W103Section from "@/app/(shared)/dev/kit/sections/W1-03";

describe("W1-03 DevKit Showcase Section", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders showcase section with Human and Pet header variants", () => {
    render(<W103Section />);

    // Section title
    expect(
      screen.getByRole("heading", { name: "Global Navigation Header" })
    ).toBeDefined();

    // Human & Pet variant headings
    expect(screen.getByText("Human Line Header (Dark Theme)")).toBeDefined();
    expect(screen.getByText("Pet Line Header (Cream Theme)")).toBeDefined();

    // Check presence of banners
    const banners = screen.getAllByRole("banner");
    expect(banners.length).toBe(2);
  });
});
