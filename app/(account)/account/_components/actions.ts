"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  accountProvider,
  cartProvider,
  subscriptionProvider,
} from "@/lib/providers";

export async function skipNextDeliveryAction(
  formData: FormData
): Promise<void> {
  const subscriptionId = formData.get("subscriptionId");
  if (typeof subscriptionId !== "string" || subscriptionId.length === 0) {
    throw new Error("subscriptionId is required");
  }
  await subscriptionProvider.skip(subscriptionId);
  revalidatePath("/account");
}

export async function signOutAction(): Promise<void> {
  await accountProvider.signOut();
  redirect(await accountProvider.signInUrl("/account"));
}

export async function reorderAction(formData: FormData): Promise<void> {
  const variantIds = formData.getAll("variantId");
  const quantities = formData.getAll("quantity");
  const lines = variantIds.map((variantId, index) => ({
    variantId: String(variantId),
    quantity: Number(quantities[index]),
  }));
  if (
    !lines.length ||
    lines.some(
      (line) =>
        !line.variantId || !Number.isInteger(line.quantity) || line.quantity < 1
    )
  ) {
    throw new Error("Valid order lines are required");
  }
  await cartProvider.addLines(lines);
  redirect("/cart");
}
