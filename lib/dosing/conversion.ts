import type { WeightUnit } from "./types";

/**
 * Standard international conversion factor between pounds (lb) and kilograms (kg).
 * 1 lb = 0.45359237 kg
 */
export const LB_TO_KG_FACTOR = 0.45359237;

/**
 * Reciprocal conversion factor: 1 kg = 2.2046226218487757 lb
 */
export const KG_TO_LB_FACTOR = 1 / LB_TO_KG_FACTOR;

/**
 * Converts pounds (lbs) to kilograms (kg).
 * Safely guards against negative numbers and NaN.
 */
export function convertLbToKg(lbs: number, precision = 1): number {
  if (typeof lbs !== "number" || isNaN(lbs) || lbs <= 0) {
    return 0;
  }
  const kg = lbs * LB_TO_KG_FACTOR;
  const factor = Math.pow(10, precision);
  return Math.round(kg * factor) / factor;
}

/**
 * Converts kilograms (kg) to pounds (lbs).
 * Safely guards against negative numbers and NaN.
 */
export function convertKgToLb(kg: number, precision = 1): number {
  if (typeof kg !== "number" || isNaN(kg) || kg <= 0) {
    return 0;
  }
  const lbs = kg * KG_TO_LB_FACTOR;
  const factor = Math.pow(10, precision);
  return Math.round(lbs * factor) / factor;
}

/**
 * Formats a weight value with unit label ("lb" or "kg").
 */
export function formatWeight(
  weight: number,
  unit: WeightUnit,
  options?: { locale?: string; precision?: number }
): string {
  const precision = options?.precision ?? (Number.isInteger(weight) ? 0 : 1);
  const factor = Math.pow(10, precision);
  const rounded = Math.round(weight * factor) / factor;

  const formattedNum = new Intl.NumberFormat(options?.locale || "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(rounded);

  return `${formattedNum} ${unit}`;
}
