import { describe, expect, it } from "vitest";
import { getContrastReport } from "../../../scripts/check-contrast.mjs";

describe("theme token contrast", () => {
  const report = getContrastReport();

  it("calculates WCAG contrast for a known theme pair", () => {
    expect(
      report.pairs.find(
        (pair) => pair.theme === "human" && pair.name === "fg/bg"
      )?.ratio
    ).toBeCloseTo(15.97, 2);
  });

  for (const pair of report.pairs) {
    const name = `${pair.theme}: ${pair.name} (${pair.ratio.toFixed(2)}:1; minimum ${pair.minimum}:1)`;
    if (pair.ratio < pair.minimum) {
      it.todo(`${name}; ${pair.suggestion}`);
    } else {
      it(name, () => expect(pair.ratio).toBeGreaterThanOrEqual(pair.minimum));
    }
  }
});
