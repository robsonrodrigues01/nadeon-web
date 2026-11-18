import { describe, expect, it } from "vitest";
import {
  getContrastRatio,
  getContrastReport,
} from "../../../scripts/check-contrast.mjs";

describe("W5-29 WCAG contrast checker", () => {
  it("calculates the known black-on-white WCAG ratio", () => {
    expect(getContrastRatio("#000000", "#ffffff")).toBe(21);
  });

  it("reports text, button, link, large-text, and UI pairs for both themes", () => {
    const pairs = getContrastReport().pairs;
    const labels = new Set(pairs.map((pair) => pair.category));

    expect(labels).toEqual(
      new Set(["text", "link", "large text", "button", "ui"])
    );
    expect(pairs.some((pair) => pair.name === "accent-text/bg")).toBe(true);
    expect(pairs.some((pair) => pair.name.includes("gradient stop"))).toBe(
      true
    );
    expect(pairs.some((pair) => pair.theme === "human")).toBe(true);
    expect(pairs.some((pair) => pair.theme === "pet")).toBe(true);
    expect(
      pairs
        .filter((pair) => pair.category === "large text")
        .every((pair) => pair.minimum === 3)
    ).toBe(true);
    expect(
      pairs
        .filter(
          (pair) => pair.category !== "large text" && pair.category !== "ui"
        )
        .every((pair) => pair.minimum === 4.5)
    ).toBe(true);
    expect(
      pairs
        .filter((pair) => pair.category === "ui")
        .every((pair) => pair.minimum === 3)
    ).toBe(true);
  });
});
