import type { DosingRange, Product } from "@/lib/contracts/catalog";
import type {
  DoseResult,
  PetAgeGroup,
  PetSpecies,
  ActivityLevel,
  WeightUnit,
} from "./types";
import { convertKgToLb, convertLbToKg } from "./conversion";
import { STANDARD_WEIGHT_BANDS } from "./bands";

export interface CalculateDoseParams {
  species: PetSpecies;
  weight: number;
  unit?: WeightUnit;
  age?: PetAgeGroup;
  activity?: ActivityLevel;
  product?: Pick<
    Product,
    "slug" | "name" | "species" | "dosingByWeight"
  > | null;
}

export interface SpeciesTableRow {
  bandLabel: string;
  dose: string;
  notes?: string;
}

/**
 * Pure function: calculates daily schedule breakdown based on dose string.
 */
function buildDailySchedule(
  dose: string,
  species: PetSpecies
): { morning: string; evening: string } {
  const mealContext =
    species === "horse"
      ? "feed"
      : species === "cat"
        ? "meal"
        : species === "dog"
          ? "breakfast"
          : "meal";

  const eveningMealContext =
    species === "horse" ? "feed" : species === "dog" ? "dinner" : "meal";

  if (dose.includes("1 chew") || dose.includes("1 treat")) {
    const item = dose.includes("treat") ? "treat" : "chew";
    return {
      morning: `1 ${item} with ${mealContext}`,
      evening: `None`,
    };
  }
  if (dose.includes("2 chews") || dose.includes("2 treats")) {
    const item = dose.includes("treat") ? "treat" : "chew";
    return {
      morning: `1 ${item} with ${mealContext}`,
      evening: `1 ${item} with ${eveningMealContext}`,
    };
  }
  if (dose.includes("3 chews")) {
    return {
      morning: `2 chews with ${mealContext}`,
      evening: `1 chew with ${eveningMealContext}`,
    };
  }
  if (dose.includes("4 chews")) {
    return {
      morning: `2 chews with ${mealContext}`,
      evening: `2 chews with ${eveningMealContext}`,
    };
  }
  if (dose.includes("0.5 mL")) {
    return {
      morning: `0.5 mL with ${mealContext === "breakfast" ? "breakfast" : "morning meal"}`,
      evening: `None`,
    };
  }
  if (dose.includes("1 mL")) {
    return {
      morning: `0.5 mL with ${mealContext === "breakfast" ? "breakfast" : "morning meal"}`,
      evening: `0.5 mL with ${eveningMealContext}`,
    };
  }
  if (dose.includes("1 scoop")) {
    return {
      morning: `1 scoop with morning ${mealContext}`,
      evening: `None`,
    };
  }
  if (dose.includes("1.5 scoops")) {
    return {
      morning: `1 scoop with morning ${mealContext}`,
      evening: `0.5 scoop with evening ${mealContext}`,
    };
  }
  if (dose.includes("2 scoops")) {
    return {
      morning: `1 scoop with morning ${mealContext}`,
      evening: `1 scoop with evening ${mealContext}`,
    };
  }
  if (dose.includes("3 scoops")) {
    return {
      morning: `2 scoops with morning ${mealContext}`,
      evening: `1 scoop with evening ${mealContext}`,
    };
  }

  return {
    morning: `${dose} with morning ${mealContext}`,
    evening: `None`,
  };
}

/**
 * Finds the dosing range from a product's dosingByWeight schema for a given weight.
 */
export function getDoseForProduct(
  product: Pick<Product, "dosingByWeight" | "species" | "name">,
  weight: number,
  unit: WeightUnit = "lb"
): DosingRange | null {
  if (!product.dosingByWeight || product.dosingByWeight.length === 0) {
    return null;
  }

  const weightLbs = unit === "kg" ? convertKgToLb(weight, 4) : weight;
  const effectiveWeight = Math.round(weightLbs);

  const matched = product.dosingByWeight.find((range) => {
    const minMatch = effectiveWeight >= range.minWeightLbs;
    const maxMatch =
      range.maxWeightLbs === null || effectiveWeight <= range.maxWeightLbs;
    return minMatch && maxMatch;
  });

  if (matched) {
    return matched;
  }

  // Fallback to closest range if outside defined thresholds
  if (effectiveWeight < product.dosingByWeight[0].minWeightLbs) {
    return product.dosingByWeight[0];
  }
  return product.dosingByWeight[product.dosingByWeight.length - 1];
}

/**
 * Calculates pet dose considering species, weight, age, activity, and optional product.
 */
export function calculateDose(params: CalculateDoseParams): DoseResult {
  const { species, weight, unit = "lb", product } = params;

  const weightLbs =
    unit === "kg" ? convertKgToLb(weight, 1) : Math.round(weight * 10) / 10;
  const weightKg =
    unit === "lb" ? convertLbToKg(weight, 1) : Math.round(weight * 10) / 10;

  const starterGuideline =
    "Start with half dose for the first 3 to 5 days, then transition to full dose.";

  // If a product with dosingByWeight is provided, use its catalog rules
  if (product && product.dosingByWeight && product.dosingByWeight.length > 0) {
    const range = getDoseForProduct(product, weightLbs, "lb");
    if (range) {
      return {
        dose: range.dose,
        servingDescription: range.servingDescription,
        dailySchedule: buildDailySchedule(range.dose, species),
        matchedRange: range,
        species,
        weightLbs,
        weightKg,
        starterGuideline,
      };
    }
  }

  // Standard species fallback rules
  if (species === "cat") {
    const isOver10 = weightLbs > 10;
    const dose = isOver10 ? "1 mL daily" : "0.5 mL daily";
    const servingDescription = isOver10 ? "Over 10 lbs" : "Up to 10 lbs";
    return {
      dose,
      servingDescription,
      dailySchedule: buildDailySchedule(dose, "cat"),
      species: "cat",
      weightLbs,
      weightKg,
      starterGuideline,
    };
  }

  if (species === "horse") {
    let dose = "2 scoops daily";
    let servingDescription = "Horse (1,100 to 1,400 lbs)";

    if (weightLbs < 800) {
      dose = "1 scoop daily";
      servingDescription = "Pony (< 800 lbs)";
    } else if (weightLbs <= 1100) {
      dose = "1.5 scoops daily";
      servingDescription = "Light horse (800 to 1,100 lbs)";
    } else if (weightLbs <= 1400) {
      dose = "2 scoops daily";
      servingDescription = "Horse (1,100 to 1,400 lbs)";
    } else {
      dose = "3 scoops daily";
      servingDescription = "Draft (> 1,400 lbs)";
    }

    return {
      dose,
      servingDescription,
      dailySchedule: buildDailySchedule(dose, "horse"),
      species: "horse",
      weightLbs,
      weightKg,
      starterGuideline,
    };
  }

  // Dog default fallback based on standard 4 weight bands
  let dose = "2 chews daily";
  let servingDescription = "21 to 50 lbs";

  if (weightLbs <= 20) {
    dose = "1 chew daily";
    servingDescription = "Up to 20 lbs";
  } else if (weightLbs <= 50) {
    dose = "2 chews daily";
    servingDescription = "21 to 50 lbs";
  } else if (weightLbs <= 90) {
    dose = "3 chews daily";
    servingDescription = "51 to 90 lbs";
  } else {
    dose = "4 chews daily";
    servingDescription = "Over 90 lbs";
  }

  return {
    dose,
    servingDescription,
    dailySchedule: buildDailySchedule(dose, "dog"),
    species: "dog",
    weightLbs,
    weightKg,
    starterGuideline,
  };
}

/**
 * Returns reference table for Quick Reference section by species.
 */
export function getSpeciesDosingTable(species: PetSpecies): SpeciesTableRow[] {
  if (species === "cat") {
    return [
      {
        bandLabel: "Up to 10 lbs",
        dose: "0.5 mL daily",
        notes: "Administer via dropper directly or with meal",
      },
      {
        bandLabel: "Over 10 lbs",
        dose: "1 mL daily",
        notes: "Split 0.5 mL morning and 0.5 mL evening",
      },
    ];
  }

  if (species === "horse") {
    return [
      {
        bandLabel: "Pony (< 800 lbs)",
        dose: "1 scoop daily",
        notes: "Top-dress onto morning feed",
      },
      {
        bandLabel: "Light horse (800 to 1,100 lbs)",
        dose: "1.5 scoops daily",
        notes: "Split between morning and evening feed",
      },
      {
        bandLabel: "Horse (1,100 to 1,400 lbs)",
        dose: "2 scoops daily",
        notes: "1 scoop morning, 1 scoop evening",
      },
      {
        bandLabel: "Draft (> 1,400 lbs)",
        dose: "3 scoops daily",
        notes: "2 scoops morning, 1 scoop evening",
      },
    ];
  }

  // Dog table
  return STANDARD_WEIGHT_BANDS.map((band, idx) => {
    const chews = idx + 1;
    return {
      bandLabel: band.labelLbs,
      dose: `${chews} ${chews === 1 ? "chew" : "chews"} daily`,
      notes:
        chews > 1
          ? "Split between morning and evening meals"
          : "Administer with morning meal",
    };
  });
}
