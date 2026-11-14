import type { DosingRange, Species } from "@/lib/contracts/catalog";

export type WeightUnit = "lb" | "kg";

export type PetSpecies = NonNullable<Species>; // "dog" | "cat" | "horse"

export type PetAgeGroup = "young" | "adult" | "senior";

export type ActivityLevel = "low" | "moderate" | "high";

export type StandardWeightBandId =
  "up-to-20" | "21-to-50" | "51-to-90" | "over-90";

export interface WeightBand {
  id: StandardWeightBandId | string;
  minWeightLbs: number;
  maxWeightLbs: number | null;
  labelLbs: string;
  labelKg: string;
  servingDescription?: string;
  recommendedIntervalDays?: number;
}

export interface DoseResult {
  dose: string;
  servingDescription: string;
  dailySchedule?: {
    morning: string;
    evening: string;
  };
  matchedRange?: DosingRange;
  species: PetSpecies;
  weightLbs: number;
  weightKg: number;
  starterGuideline?: string;
}
