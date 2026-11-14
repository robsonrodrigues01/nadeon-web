"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accountProvider, subscriptionProvider } from "@/lib/providers";

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
