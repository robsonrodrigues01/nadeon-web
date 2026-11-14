import { describe, it, expect } from "vitest";
import {
  convertLbToKg,
  convertKgToLb,
  formatWeight,
  LB_TO_KG_FACTOR,
  KG_TO_LB_FACTOR,
} from "@/lib/dosing/conversion";

describe("Dosing Unit Conversion (lib/dosing/conversion)", () => {
  it("exports accurate conversion factors", () => {
    expect(LB_TO_KG_FACTOR).toBeCloseTo(0.45359237, 7);
    expect(KG_TO_LB_FACTOR).toBeCloseTo(2.20462262, 7);
  });

  describe("convertLbToKg", () => {
    it("converts 0 lb to 0 kg", () => {
      expect(convertLbToKg(0)).toBe(0);
    });

    it("converts standard weight thresholds accurately", () => {
      // 20 lbs ≈ 9.07 kg -> rounded to 1 decimal: 9.1 kg (or 9 kg integer / default 1 decimal)
      expect(convertLbToKg(20, 1)).toBe(9.1);
      // 50 lbs ≈ 22.68 kg -> 22.7 kg
      expect(convertLbToKg(50, 1)).toBe(22.7);
      // 90 lbs ≈ 40.82 kg -> 40.8 kg
      expect(convertLbToKg(90, 1)).toBe(40.8);
    });

    it("handles negative and invalid inputs safely", () => {
      expect(convertLbToKg(-5)).toBe(0);
      expect(convertLbToKg(NaN)).toBe(0);
    });
  });

  describe("convertKgToLb", () => {
    it("converts 0 kg to 0 lb", () => {
      expect(convertKgToLb(0)).toBe(0);
    });

    it("converts kg back to lbs with precision", () => {
      expect(convertKgToLb(9.07185, 1)).toBe(20);
      expect(convertKgToLb(22.6796, 1)).toBe(50);
      expect(convertKgToLb(40.8233, 1)).toBe(90);
    });

    it("handles negative and invalid inputs safely", () => {
      expect(convertKgToLb(-10)).toBe(0);
      expect(convertKgToLb(NaN)).toBe(0);
    });
  });

  describe("formatWeight", () => {
    it("formats weight with unit string", () => {
      expect(formatWeight(20, "lb")).toBe("20 lb");
      expect(formatWeight(9.1, "kg")).toBe("9.1 kg");
    });

    it("supports custom precision and locale formatting", () => {
      expect(formatWeight(20.456, "lb", { precision: 1 })).toBe("20.5 lb");
      expect(formatWeight(9.07, "kg", { precision: 0 })).toBe("9 kg");
    });
  });
});
