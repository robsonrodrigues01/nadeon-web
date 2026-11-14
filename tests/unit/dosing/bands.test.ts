import { describe, it, expect } from "vitest";
import {
  STANDARD_WEIGHT_BANDS,
  getWeightBandForWeight,
  getWeightBandById,
  formatBandLabel,
} from "@/lib/dosing/bands";

describe("Weight Bands (lib/dosing/bands)", () => {
  it("defines the 4 standard Nadeon pet weight bands with accurate labels", () => {
    expect(STANDARD_WEIGHT_BANDS).toHaveLength(4);

    expect(STANDARD_WEIGHT_BANDS[0]).toMatchObject({
      id: "up-to-20",
      minWeightLbs: 0,
      maxWeightLbs: 20,
      labelLbs: "Up to 20 lbs",
      labelKg: "Up to 9 kg",
    });

    expect(STANDARD_WEIGHT_BANDS[1]).toMatchObject({
      id: "21-to-50",
      minWeightLbs: 21,
      maxWeightLbs: 50,
      labelLbs: "21 to 50 lbs",
      labelKg: "9.5 to 23 kg",
    });

    expect(STANDARD_WEIGHT_BANDS[2]).toMatchObject({
      id: "51-to-90",
      minWeightLbs: 51,
      maxWeightLbs: 90,
      labelLbs: "51 to 90 lbs",
      labelKg: "23 to 41 kg",
    });

    expect(STANDARD_WEIGHT_BANDS[3]).toMatchObject({
      id: "over-90",
      minWeightLbs: 91,
      maxWeightLbs: null,
      labelLbs: "Over 90 lbs",
      labelKg: "Over 41 kg",
    });
  });

  describe("getWeightBandForWeight boundary testing", () => {
    it("handles boundary limits in lbs correctly", () => {
      // 0 to 20 lbs
      expect(getWeightBandForWeight(0).id).toBe("up-to-20");
      expect(getWeightBandForWeight(10).id).toBe("up-to-20");
      expect(getWeightBandForWeight(20).id).toBe("up-to-20");

      // 21 to 50 lbs
      expect(getWeightBandForWeight(20.5).id).toBe("21-to-50");
      expect(getWeightBandForWeight(21).id).toBe("21-to-50");
      expect(getWeightBandForWeight(35).id).toBe("21-to-50");
      expect(getWeightBandForWeight(50).id).toBe("21-to-50");

      // 51 to 90 lbs
      expect(getWeightBandForWeight(50.5).id).toBe("51-to-90");
      expect(getWeightBandForWeight(51).id).toBe("51-to-90");
      expect(getWeightBandForWeight(70).id).toBe("51-to-90");
      expect(getWeightBandForWeight(90).id).toBe("51-to-90");

      // Over 90 lbs
      expect(getWeightBandForWeight(90.5).id).toBe("over-90");
      expect(getWeightBandForWeight(91).id).toBe("over-90");
      expect(getWeightBandForWeight(120).id).toBe("over-90");
    });

    it("handles kg weights by converting to lbs before matching bands", () => {
      // 5 kg ≈ 11.0 lbs -> up-to-20
      expect(getWeightBandForWeight(5, "kg").id).toBe("up-to-20");
      // 9 kg ≈ 19.8 lbs -> up-to-20
      expect(getWeightBandForWeight(9, "kg").id).toBe("up-to-20");
      // 15 kg ≈ 33.1 lbs -> 21-to-50
      expect(getWeightBandForWeight(15, "kg").id).toBe("21-to-50");
      // 30 kg ≈ 66.1 lbs -> 51-to-90
      expect(getWeightBandForWeight(30, "kg").id).toBe("51-to-90");
      // 45 kg ≈ 99.2 lbs -> over-90
      expect(getWeightBandForWeight(45, "kg").id).toBe("over-90");
    });
  });

  describe("getWeightBandById", () => {
    it("retrieves a band by valid id", () => {
      expect(getWeightBandById("21-to-50")?.labelLbs).toBe("21 to 50 lbs");
    });

    it("returns undefined for invalid id", () => {
      expect(getWeightBandById("invalid-id")).toBeUndefined();
    });
  });

  describe("formatBandLabel", () => {
    it("formats band label based on requested unit", () => {
      const band = STANDARD_WEIGHT_BANDS[1];
      expect(formatBandLabel(band, "lb")).toBe("21 to 50 lbs");
      expect(formatBandLabel(band, "kg")).toBe("9.5 to 23 kg");
    });
  });
});
