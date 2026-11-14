import { z } from "zod";

export const LabTestResultSchema = z.object({
  parameter: z.string(),
  specification: z.string(),
  result: z.string(),
  passed: z.boolean(),
});
export type LabTestResult = z.infer<typeof LabTestResultSchema>;

export const LotStatusSchema = z.enum(["passed", "pending", "failed"]);
export type LotStatus = z.infer<typeof LotStatusSchema>;

export const LabLotSchema = z.object({
  lotNumber: z.string(),
  productSlug: z.string(),
  productName: z.string(),
  manufacturedDate: z.string(),
  expiryDate: z.string(),
  coaUrl: z.string(),
  status: LotStatusSchema,
  testResults: z.array(LabTestResultSchema),
});
export type LabLot = z.infer<typeof LabLotSchema>;

export const LabsFilterSchema = z.object({
  productSlug: z.string().optional(),
  status: LotStatusSchema.optional(),
});
export type LabsFilter = z.infer<typeof LabsFilterSchema>;

export interface LabsProvider {
  findLot(lotNumber: string): Promise<LabLot | null>;
  listLots(filter?: LabsFilter): Promise<LabLot[]>;
}
