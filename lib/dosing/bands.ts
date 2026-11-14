import type { WeightBand, WeightUnit } from "./types";
import { convertKgToLb } from "./conversion";

/**
 * The 4 canonical weight bands for Nadeon Pet products
 * Matches data/products.schema.ts DosingRangeSchema and catalog section 5.2:
 * 1. Up to 20 lbs (0 - 20 lbs / Up to 9 kg)
 * 2. 21 to 50 lbs (21 - 50 lbs / 9.5 to 23 kg)
 * 3. 51 to 90 lbs (51 - 90 lbs / 23 to 41 kg)
 * 4. Over 90 lbs (91+ lbs / Over 41 kg)
 */
export const STANDARD_WEIGHT_BANDS: readonly WeightBand[] = [
  {
    id: "up-to-20",
    minWeightLbs: 0,
    maxWeightLbs: 20,
    labelLbs: "Up to 20 lbs",
    labelKg: "Up to 9 kg",
    servingDescription: "Up to 20 lbs",
    recommendedIntervalDays: 30,
  },
  {
    id: "21-to-50",
    minWeightLbs: 21,
    maxWeightLbs: 50,
    labelLbs: "21 to 50 lbs",
    labelKg: "9.5 to 23 kg",
    servingDescription: "21 to 50 lbs",
    recommendedIntervalDays: 30,
  },
  {
    id: "51-to-90",
    minWeightLbs: 51,
    maxWeightLbs: 90,
    labelLbs: "51 to 90 lbs",
    labelKg: "23 to 41 kg",
    servingDescription: "51 to 90 lbs",
    recommendedIntervalDays: 30,
  },
  {
    id: "over-90",
    minWeightLbs: 91,
    maxWeightLbs: null,
    labelLbs: "Over 90 lbs",
    labelKg: "Over 41 kg",
    servingDescription: "Over 90 lbs",
    recommendedIntervalDays: 30,
  },
] as const;

/**
 * Finds the corresponding WeightBand for a given weight.
 * Handles boundary conditions smoothly and converts kg to lbs if necessary.
 */
export function getWeightBandForWeight(
  weight: number,
  unit: WeightUnit = "lb"
): WeightBand {
  const weightLbs = unit === "kg" ? convertKgToLb(weight, 4) : weight;

  if (weightLbs <= 20) {
    return STANDARD_WEIGHT_BANDS[0];
  }
  if (weightLbs <= 50) {
    return STANDARD_WEIGHT_BANDS[1];
  }
  if (weightLbs <= 90) {
    return STANDARD_WEIGHT_BANDS[2];
  }
  return STANDARD_WEIGHT_BANDS[3];
}

/**
 * Retrieves a weight band by its unique ID.
 */
export function getWeightBandById(id: string): WeightBand | undefined {
  return STANDARD_WEIGHT_BANDS.find((b) => b.id === id);
}

/**
 * Returns formatted label according to unit ("lb" | "kg").
 */
export function formatBandLabel(band: WeightBand, unit: WeightUnit): string {
  return unit === "kg" ? band.labelKg : band.labelLbs;
}
