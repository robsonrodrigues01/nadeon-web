import { describe, it, expect } from "vitest";
import {
  getDoseForProduct,
  calculateDose,
  getSpeciesDosingTable,
} from "@/lib/dosing/calculator";
import type { Product } from "@/lib/contracts/catalog";

const mockDogProduct: Pick<
  Product,
  "slug" | "name" | "species" | "dosingByWeight"
> = {
  slug: "more-good-years",
  name: "More Good Years",
  species: "dog",
  dosingByWeight: [
    {
      minWeightLbs: 0,
      maxWeightLbs: 20,
      dose: "1 chew daily",
      servingDescription: "Up to 20 lbs",
    },
    {
      minWeightLbs: 21,
      maxWeightLbs: 50,
      dose: "2 chews daily",
      servingDescription: "21 to 50 lbs",
    },
    {
      minWeightLbs: 51,
      maxWeightLbs: 90,
      dose: "3 chews daily",
      servingDescription: "51 to 90 lbs",
    },
    {
      minWeightLbs: 91,
      maxWeightLbs: null,
      dose: "4 chews daily",
      servingDescription: "Over 90 lbs",
    },
  ],
};

const mockOilProduct: Pick<
  Product,
  "slug" | "name" | "species" | "dosingByWeight"
> = {
  slug: "more-good-years-oil",
  name: "More Good Years Oil",
  species: "dog",
  dosingByWeight: [
    {
      minWeightLbs: 0,
      maxWeightLbs: 20,
      dose: "0.5 mL daily",
      servingDescription: "Up to 20 lbs",
    },
    {
      minWeightLbs: 21,
      maxWeightLbs: 50,
      dose: "1 mL daily",
      servingDescription: "21 to 50 lbs",
    },
    {
      minWeightLbs: 51,
      maxWeightLbs: 90,
      dose: "1.5 to 2 mL daily",
      servingDescription: "51 to 90 lbs",
    },
    {
      minWeightLbs: 91,
      maxWeightLbs: null,
      dose: "2.5 mL daily",
      servingDescription: "Over 90 lbs",
    },
  ],
};

describe("Dose Calculator (lib/dosing/calculator)", () => {
  describe("getDoseForProduct", () => {
    it("matches exact integer boundary limits for dog chew product", () => {
      // 0 to 20 lbs
      expect(getDoseForProduct(mockDogProduct, 0)?.dose).toBe("1 chew daily");
      expect(getDoseForProduct(mockDogProduct, 15)?.dose).toBe("1 chew daily");
      expect(getDoseForProduct(mockDogProduct, 20)?.dose).toBe("1 chew daily");

      // 21 to 50 lbs
      expect(getDoseForProduct(mockDogProduct, 21)?.dose).toBe("2 chews daily");
      expect(getDoseForProduct(mockDogProduct, 35)?.dose).toBe("2 chews daily");
      expect(getDoseForProduct(mockDogProduct, 50)?.dose).toBe("2 chews daily");

      // 51 to 90 lbs
      expect(getDoseForProduct(mockDogProduct, 51)?.dose).toBe("3 chews daily");
      expect(getDoseForProduct(mockDogProduct, 75)?.dose).toBe("3 chews daily");
      expect(getDoseForProduct(mockDogProduct, 90)?.dose).toBe("3 chews daily");

      // Over 90 lbs
      expect(getDoseForProduct(mockDogProduct, 91)?.dose).toBe("4 chews daily");
      expect(getDoseForProduct(mockDogProduct, 120)?.dose).toBe(
        "4 chews daily"
      );
    });

    it("handles float boundaries between integer thresholds gracefully", () => {
      // 20.4 lbs -> 20 (1 chew daily)
      expect(getDoseForProduct(mockDogProduct, 20.4)?.dose).toBe(
        "1 chew daily"
      );
      // 20.6 lbs -> rounds/transitions into 21 to 50 lbs band (2 chews daily)
      expect(getDoseForProduct(mockDogProduct, 20.6)?.dose).toBe(
        "2 chews daily"
      );

      // 50.4 lbs -> 50 (2 chews daily)
      expect(getDoseForProduct(mockDogProduct, 50.4)?.dose).toBe(
        "2 chews daily"
      );
      // 50.6 lbs -> 51 to 90 (3 chews daily)
      expect(getDoseForProduct(mockDogProduct, 50.6)?.dose).toBe(
        "3 chews daily"
      );
    });

    it("handles kg weight input correctly", () => {
      // 9 kg ≈ 19.8 lbs -> 1 chew daily
      expect(getDoseForProduct(mockDogProduct, 9, "kg")?.dose).toBe(
        "1 chew daily"
      );
      // 15 kg ≈ 33.1 lbs -> 2 chews daily
      expect(getDoseForProduct(mockDogProduct, 15, "kg")?.dose).toBe(
        "2 chews daily"
      );
    });

    it("works with oil product liquid measurements", () => {
      expect(getDoseForProduct(mockOilProduct, 10)?.dose).toBe("0.5 mL daily");
      expect(getDoseForProduct(mockOilProduct, 30)?.dose).toBe("1 mL daily");
      expect(getDoseForProduct(mockOilProduct, 65)?.dose).toBe(
        "1.5 to 2 mL daily"
      );
      expect(getDoseForProduct(mockOilProduct, 100)?.dose).toBe("2.5 mL daily");
    });

    it("returns null if product has empty dosingByWeight", () => {
      const emptyProduct = { ...mockDogProduct, dosingByWeight: [] };
      expect(getDoseForProduct(emptyProduct, 25)).toBeNull();
    });
  });

  describe("calculateDose (Dog / Cat / Horse)", () => {
    it("calculates dog dose with daily schedule and starter guideline", () => {
      const result = calculateDose({
        species: "dog",
        weight: 35,
        unit: "lb",
        age: "senior",
        activity: "moderate",
        product: mockDogProduct as Product,
      });

      expect(result.species).toBe("dog");
      expect(result.weightLbs).toBe(35);
      expect(result.weightKg).toBe(15.9);
      expect(result.dose).toBe("2 chews daily");
      expect(result.servingDescription).toBe("21 to 50 lbs");
      expect(result.dailySchedule).toEqual({
        morning: "1 chew with breakfast",
        evening: "1 chew with dinner",
      });
      expect(result.starterGuideline).toContain("half dose");
    });

    it("calculates cat dose correctly for feline weights", () => {
      const result = calculateDose({
        species: "cat",
        weight: 9,
        unit: "lb",
        age: "adult",
        activity: "moderate",
      });

      expect(result.species).toBe("cat");
      expect(result.dose).toBe("0.5 mL daily");
      expect(result.dailySchedule?.morning).toBe("0.5 mL with morning meal");
    });

    it("calculates horse dose correctly across equine weight categories", () => {
      // Light horse / 900 lbs
      const lightHorse = calculateDose({
        species: "horse",
        weight: 900,
        unit: "lb",
      });
      expect(lightHorse.species).toBe("horse");
      expect(lightHorse.dose).toBe("1.5 scoops daily");

      // Regular horse / 1200 lbs
      const regularHorse = calculateDose({
        species: "horse",
        weight: 1200,
        unit: "lb",
      });
      expect(regularHorse.dose).toBe("2 scoops daily");
      expect(regularHorse.dailySchedule).toEqual({
        morning: "1 scoop with morning feed",
        evening: "1 scoop with evening feed",
      });
    });
  });

  describe("getSpeciesDosingTable", () => {
    it("returns standard 4 weight bands table for dog", () => {
      const table = getSpeciesDosingTable("dog");
      expect(table).toHaveLength(4);
      expect(table[0].bandLabel).toBe("Up to 20 lbs");
      expect(table[0].dose).toBe("1 chew daily");
      expect(table[3].bandLabel).toBe("Over 90 lbs");
      expect(table[3].dose).toBe("4 chews daily");
    });

    it("returns feline dosing table", () => {
      const table = getSpeciesDosingTable("cat");
      expect(table.length).toBeGreaterThan(0);
      expect(table[0].dose).toContain("mL");
    });

    it("returns equine dosing table with pony, light horse, horse, draft", () => {
      const table = getSpeciesDosingTable("horse");
      expect(table).toHaveLength(4);
      expect(table[0].bandLabel).toContain("Pony");
      expect(table[1].bandLabel).toContain("Light horse");
      expect(table[2].bandLabel).toContain("Horse");
      expect(table[3].bandLabel).toContain("Draft");
    });
  });
});
