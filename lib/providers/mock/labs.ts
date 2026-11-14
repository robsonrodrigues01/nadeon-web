import fs from "node:fs";
import path from "node:path";
import {
  type LabLot,
  type LabsFilter,
  type LabsProvider,
  LabLotSchema,
} from "@/lib/contracts/labs";

function loadLotsFromDisk(): LabLot[] {
  try {
    const filePath = path.resolve(process.cwd(), "data/labs.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.map((lot) => LabLotSchema.parse(lot));
      }
    }
  } catch (err) {
    console.error("[MockLabsProvider] Error reading data/labs.json:", err);
  }
  return [];
}

export class MockLabsProvider implements LabsProvider {
  async findLot(lotNumber: string): Promise<LabLot | null> {
    const term = lotNumber.trim().toUpperCase();
    const lots = loadLotsFromDisk();
    const found = lots.find((l) => l.lotNumber.toUpperCase() === term);
    return found ? { ...found } : null;
  }

  async listLots(filter?: LabsFilter): Promise<LabLot[]> {
    let lots = loadLotsFromDisk();

    if (filter?.productSlug) {
      lots = lots.filter((l) => l.productSlug === filter.productSlug);
    }
    if (filter?.status) {
      lots = lots.filter((l) => l.status === filter.status);
    }

    return lots.map((l) => ({ ...l }));
  }
}

export const mockLabsProvider = new MockLabsProvider();
