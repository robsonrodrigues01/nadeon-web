"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  accountProvider,
  cartProvider,
  subscriptionProvider,
} from "@/lib/providers";

const IdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/);

const ReorderInputSchema = z
  .object({
    variantIds: z.array(IdSchema).min(1).max(20),
    quantities: z.array(z.coerce.number().int().min(1).max(99)).min(1).max(20),
  })
  .refine(
    ({ variantIds, quantities }) => variantIds.length === quantities.length
  );

export async function skipNextDeliveryAction(
  formData: FormData
): Promise<void> {
  const parsed = IdSchema.safeParse(formData.get("subscriptionId"));
  if (!parsed.success) {
    throw new Error("subscriptionId is required");
  }
  await subscriptionProvider.skip(parsed.data);
  revalidatePath("/account");
}

export async function signOutAction(): Promise<void> {
  await accountProvider.signOut();
  redirect(await accountProvider.signInUrl("/account"));
}

export async function reorderAction(formData: FormData): Promise<void> {
  const parsed = ReorderInputSchema.safeParse({
    variantIds: formData.getAll("variantId"),
    quantities: formData.getAll("quantity"),
  });
  if (!parsed.success) {
    throw new Error("Valid order lines are required");
  }
  const lines = parsed.data.variantIds.map((variantId, index) => ({
    variantId,
    quantity: parsed.data.quantities[index],
  }));
  await cartProvider.addLines(lines);
  redirect("/cart");
}
