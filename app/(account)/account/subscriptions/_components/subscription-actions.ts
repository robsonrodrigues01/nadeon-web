"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { accountProvider, subscriptionProvider } from "@/lib/providers";
import { CANCEL_REASONS } from "./cancel-reasons";

const LIST_PATH = "/account/subscriptions";

const IdSchema = z.string().min(1);

function readString(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

/** Runs one subscription change, then returns to the list with fresh data. */
async function changeAndReturn(
  formData: FormData,
  change: (id: string) => Promise<unknown>
): Promise<void> {
  const id = IdSchema.safeParse(readString(formData, "id"));
  if (id.success) {
    await change(id.data);
    revalidatePath(LIST_PATH);
  }
  redirect(LIST_PATH);
}

export async function skipSubscription(formData: FormData): Promise<void> {
  await changeAndReturn(formData, (id) => subscriptionProvider.skip(id));
}

export async function pauseSubscription(formData: FormData): Promise<void> {
  await changeAndReturn(formData, (id) => subscriptionProvider.pause(id));
}

export async function changeSubscriptionFrequency(
  formData: FormData
): Promise<void> {
  const interval = z.coerce
    .number()
    .int()
    .positive()
    .safeParse(readString(formData, "intervalDays"));
  await changeAndReturn(formData, (id) =>
    interval.success
      ? subscriptionProvider.changeFrequency(id, interval.data)
      : Promise.resolve(null)
  );
}

const CancelInputSchema = z.object({
  id: IdSchema,
  reason: z.enum(CANCEL_REASONS),
  feedback: z.string().trim().max(1000).optional(),
});

export async function cancelSubscription(formData: FormData): Promise<void> {
  const id = readString(formData, "id") ?? "";
  const parsed = CancelInputSchema.safeParse({
    id,
    reason: readString(formData, "reason"),
    feedback: readString(formData, "feedback") || undefined,
  });
  if (!parsed.success) {
    // Missing or unknown reason: send the customer back to step 1.
    redirect(id ? `${LIST_PATH}/${encodeURIComponent(id)}/cancel` : LIST_PATH);
  }

  await subscriptionProvider.cancel(
    parsed.data.id,
    parsed.data.reason,
    parsed.data.feedback
  );
  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function signOutAccount(): Promise<void> {
  await accountProvider.signOut();
  redirect("/");
}
