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

  it("measures Pet focus ring accent against light surfaces with 3:1 threshold", () => {
    const pairs = getContrastReport().pairs;
    const petFocusBg = pairs.find(
      (pair) => pair.theme === "pet" && pair.name === "accent UI/bg"
    );
    const petFocusElevated = pairs.find(
      (pair) => pair.theme === "pet" && pair.name === "accent UI/bg-elevated"
    );

    expect(petFocusBg).toBeDefined();
    expect(petFocusBg?.foreground).toBe("#e0a63c");
    expect(petFocusBg?.background).toBe("#fff6ea");
    expect(petFocusBg?.minimum).toBe(3);
    expect(petFocusBg?.ratio).toBeCloseTo(2.03, 2);
    expect(petFocusBg?.ratio).toBeLessThan(3);

    expect(petFocusElevated).toBeDefined();
    expect(petFocusElevated?.foreground).toBe("#e0a63c");
    expect(petFocusElevated?.background).toBe("#ffffff");
    expect(petFocusElevated?.minimum).toBe(3);
    expect(petFocusElevated?.ratio).toBeCloseTo(2.17, 2);
    expect(petFocusElevated?.ratio).toBeLessThan(3);
  });

  it("evaluates Pet product amber only on composed dark surfaces without false positives on light bg", () => {
    const pairs = getContrastReport().pairs;
    const petPairs = pairs.filter((pair) => pair.theme === "pet");

    expect(petPairs.some((pair) => pair.name === "product-amber text/bg")).toBe(
      false
    );
    expect(
      petPairs.some((pair) => pair.name === "product-amber text/bg-elevated")
    ).toBe(false);

    const pawIcon = petPairs.find(
      (pair) => pair.name === "product-amber icon/fg surface"
    );
    expect(pawIcon).toBeDefined();
    expect(pawIcon?.category).toBe("ui");
    expect(pawIcon?.minimum).toBe(3);
    expect(pawIcon?.ratio).toBeGreaterThanOrEqual(3);

    const bannerText = petPairs.find(
      (pair) => pair.name === "product-amber text/accent-fg banner"
    );
    expect(bannerText).toBeDefined();
    expect(bannerText?.category).toBe("text");
    expect(bannerText?.minimum).toBe(4.5);
    expect(bannerText?.ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("identifies exactly the 6 real composed below-threshold pairs in Pet theme", () => {
    const pairs = getContrastReport().pairs;
    const failures = pairs.filter((pair) => pair.ratio < pair.minimum);
    const petFailures = failures.filter((pair) => pair.theme === "pet");

    expect(petFailures.map((pair) => pair.name)).toEqual([
      "accent UI/bg",
      "accent UI/bg-elevated",
      "product-coral text/bg",
      "product-coral text/bg-elevated",
      "product-mint text/bg",
      "product-mint text/bg-elevated",
    ]);
  });
});
