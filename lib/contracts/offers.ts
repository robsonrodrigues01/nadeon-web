import { z } from "zod";

export const OfferSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  code: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  discount: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("percentage"),
      amount: z.number().positive().max(100),
    }),
    z.object({
      type: z.literal("buy_x_get_y"),
      buy: z.number().int().positive(),
      get: z.number().int().positive(),
    }),
  ]),
});
export type Offer = z.infer<typeof OfferSchema>;

export interface OffersProvider {
  list(): Promise<Offer[]>;
  get(id: string): Promise<Offer | null>;
}
