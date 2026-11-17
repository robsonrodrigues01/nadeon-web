import { z } from "zod";

// Número no formato NL-000000 (design: "Starts with NL", 6 dígitos).
export const TrackOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^(NL-\d{6}|TEST-NL-\d+)$/i),
  email: z.email().trim(),
});

export type TrackOrderInput = z.infer<typeof TrackOrderSchema>;
