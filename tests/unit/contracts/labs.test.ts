import { describe, it, expect } from "vitest";
import { mockLabsProvider } from "@/lib/providers/mock/labs";
import { LabLotSchema } from "@/lib/contracts/labs";

describe("LabsProvider Contract", () => {
  it("findLot returns null for non-existent lot number", async () => {
    const lot = await mockLabsProvider.findLot("NL-000000");
    expect(lot).toBeNull();
  });

  it("listLots returns valid list satisfying LabLotSchema", async () => {
    const lots = await mockLabsProvider.listLots();
    expect(Array.isArray(lots)).toBe(true);
    for (const lot of lots) {
      expect(() => LabLotSchema.parse(lot)).not.toThrow();
    }
  });
});
