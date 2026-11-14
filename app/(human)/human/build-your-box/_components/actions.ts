"use server";

import { z } from "zod";
import { cartProvider, catalogProvider } from "@/lib/providers";
import { MAX_JARS_PER_LINE } from "./box-math";

const StartBoxInputSchema = z.object({
  intervalDays: z.number().int().positive(),
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        quantity: z.number().int().min(1).max(MAX_JARS_PER_LINE),
      })
    )
    .min(1)
    .max(20),
});

export type StartBoxResult =
  { ok: true; lineCount: number } | { ok: false; error: string };

/**
 * Re-resolves every line against the catalog on the server: the client
 * only sends slugs, quantities and a frequency, never variant or plan ids.
 */
export async function startBoxSubscription(
  input: unknown
): Promise<StartBoxResult> {
  const parsed = StartBoxInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check your selection and try again." };
  }

  const { intervalDays, items } = parsed.data;
  const products = await catalogProvider.getProducts({ line: "human" });

  const lines = [];
  for (const item of items) {
    const product = products.find((p) => p.slug === item.slug);
    const variant = product?.variants.find((v) => v.jars === 1);
    const plan = product?.sellingPlans.find(
      (p) => p.intervalDays === intervalDays
    );
    if (!variant || !plan) {
      return { ok: false, error: "Check your selection and try again." };
    }
    lines.push({
      variantId: variant.id,
      quantity: item.quantity,
      sellingPlanId: plan.id,
    });
  }

  await cartProvider.addLines(lines);
  return { ok: true, lineCount: lines.length };
}
