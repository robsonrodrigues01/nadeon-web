"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { accountProvider, subscriptionProvider } from "@/lib/providers";
import type { Subscription } from "@/lib/contracts/subscription";
import { CANCEL_REASONS } from "./cancel-reasons";

const LIST_PATH = "/account/subscriptions";

const IdSchema = z.string().min(1);

export type SubscriptionActionState =
  | { status: "idle" }
  | { status: "success"; message: string; subscription: Subscription }
  | { status: "error"; message: string };

function readString(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

async function getAuthenticatedCustomer() {
  const session =
    typeof accountProvider.getSession === "function"
      ? await accountProvider.getSession()
      : null;
  const customer =
    session && typeof accountProvider.getCustomer === "function"
      ? await accountProvider.getCustomer()
      : null;
  return customer;
}

async function verifySubscriptionOwnership(
  subscriptionId: string
): Promise<boolean> {
  if (typeof subscriptionProvider.list !== "function") {
    return false;
  }
  const subscriptions = await subscriptionProvider.list();
  return subscriptions.some((s) => s.id === subscriptionId);
}

/** Runs one subscription change, then returns to the list with fresh data. */
async function changeAndReturn(
  formData: FormData,
  change: (id: string) => Promise<unknown>
): Promise<void> {
  const customer = await getAuthenticatedCustomer();
  if (!customer) {
    const loginUrl =
      typeof accountProvider.signInUrl === "function"
        ? await accountProvider.signInUrl(LIST_PATH)
        : `/account/login?returnTo=${encodeURIComponent(LIST_PATH)}`;
    redirect(loginUrl);
  }

  const id = IdSchema.safeParse(readString(formData, "id"));
  if (!id.success) {
    redirect(LIST_PATH);
  }

  const isOwner = await verifySubscriptionOwnership(id.data);
  if (!isOwner) {
    redirect(LIST_PATH);
  }

  await change(id.data);
  revalidatePath(LIST_PATH);
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
  const customer = await getAuthenticatedCustomer();
  if (!customer) {
    const loginUrl =
      typeof accountProvider.signInUrl === "function"
        ? await accountProvider.signInUrl(LIST_PATH)
        : `/account/login?returnTo=${encodeURIComponent(LIST_PATH)}`;
    redirect(loginUrl);
  }

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

  const isOwner = await verifySubscriptionOwnership(parsed.data.id);
  if (!isOwner) {
    redirect(LIST_PATH);
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

async function updateWithFeedback(
  formData: FormData,
  update: (id: string) => Promise<Subscription>,
  message: string
): Promise<SubscriptionActionState> {
  const customer = await getAuthenticatedCustomer();
  if (!customer) {
    return {
      status: "error",
      message: "You must be signed in to manage subscriptions.",
    };
  }

  const id = IdSchema.safeParse(readString(formData, "id"));
  if (!id.success) {
    return {
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    };
  }

  const isOwner = await verifySubscriptionOwnership(id.data);
  if (!isOwner) {
    return {
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    };
  }

  try {
    const subscription = await update(id.data);
    revalidatePath(LIST_PATH);
    return { status: "success", message, subscription };
  } catch {
    return {
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    };
  }
}

export async function skipSubscriptionWithFeedback(
  _previousState: SubscriptionActionState,
  formData: FormData
): Promise<SubscriptionActionState> {
  return updateWithFeedback(
    formData,
    (id) => subscriptionProvider.skip(id),
    "Next delivery skipped."
  );
}

export async function pauseSubscriptionWithFeedback(
  _previousState: SubscriptionActionState,
  formData: FormData
): Promise<SubscriptionActionState> {
  return updateWithFeedback(
    formData,
    (id) => subscriptionProvider.pause(id),
    "Subscription paused."
  );
}

export async function cancelSubscriptionWithFeedback(
  _previousState: SubscriptionActionState,
  formData: FormData
): Promise<SubscriptionActionState> {
  const customer = await getAuthenticatedCustomer();
  if (!customer) {
    return {
      status: "error",
      message: "You must be signed in to manage subscriptions.",
    };
  }

  const parsed = CancelInputSchema.safeParse({
    id: readString(formData, "id"),
    reason: readString(formData, "reason"),
    feedback: readString(formData, "feedback") || undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Choose a cancellation reason before continuing.",
    };
  }

  const isOwner = await verifySubscriptionOwnership(parsed.data.id);
  if (!isOwner) {
    return {
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    };
  }

  return updateWithFeedback(
    formData,
    (id) =>
      subscriptionProvider.cancel(id, parsed.data.reason, parsed.data.feedback),
    "Cancellation complete."
  );
}
