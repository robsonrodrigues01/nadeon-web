"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  accountProvider,
  emailPreferencesProvider,
  mailyteProvider,
} from "@/lib/providers";
import {
  EmailUnsubscribeReasonSchema,
  SaveEmailPreferencesInputSchema,
} from "@/lib/contracts/email-preferences";
import type { EmailPreferences } from "@/lib/contracts/email-preferences";

export type EmailPreferencesActionState = {
  status: "idle" | "success" | "invalid" | "error";
  intent?: "save" | "unsubscribe" | "resubscribe";
  message?: string;
  preferences?: EmailPreferences;
};

const IntentSchema = z.enum(["save", "unsubscribe", "resubscribe"]);
const UnsubscribeFormSchema = z
  .object({
    confirm: z.literal("yes"),
    reason: EmailUnsubscribeReasonSchema.optional(),
  })
  .strict();

const ConfirmFormSchema = z.object({ confirm: z.literal("yes") }).strict();

async function getOwner() {
  const session = await accountProvider.getSession();
  if (!session) return null;
  const customer = await accountProvider.getCustomer();
  return customer && customer.id === session.customerId ? customer : null;
}

function failed(
  status: "invalid" | "error",
  intent?: EmailPreferencesActionState["intent"]
): EmailPreferencesActionState {
  return {
    status,
    intent,
    message: "To be confirmed",
  };
}

async function savePreferencesAction(
  _previous: EmailPreferencesActionState,
  formData: FormData
): Promise<EmailPreferencesActionState> {
  const parsed = SaveEmailPreferencesInputSchema.safeParse({
    topics: {
      subscriptionReminders: formData.has("subscriptionReminders"),
      humanNews: formData.has("humanNews"),
      petNews: formData.has("petNews"),
      journal: formData.has("journal"),
      offers: formData.has("offers"),
    },
    frequency: formData.get("frequency") || null,
  });
  if (!parsed.success) return failed("invalid", "save");

  try {
    const owner = await getOwner();
    if (!owner) return failed("error", "save");
    const current = await emailPreferencesProvider.getPreferences();
    if (current.unsubscribedAll) return failed("error", "save");

    const preferences = await emailPreferencesProvider.savePreferences(
      parsed.data
    );
    revalidatePath("/account/email-preferences");
    return {
      status: "success",
      intent: "save",
      message: "To be confirmed",
      preferences,
    };
  } catch {
    return failed("error", "save");
  }
}

async function unsubscribeAction(
  _previous: EmailPreferencesActionState,
  formData: FormData
): Promise<EmailPreferencesActionState> {
  const parsed = UnsubscribeFormSchema.safeParse({
    confirm: formData.get("confirm"),
    reason: formData.get("reason") || undefined,
  });
  if (!parsed.success) return failed("invalid", "unsubscribe");

  try {
    const owner = await getOwner();
    if (!owner) return failed("error", "unsubscribe");

    await mailyteProvider.updateContactStatus({
      email: owner.email,
      status: "unsubscribed",
    });
    const preferences = await emailPreferencesProvider.unsubscribe(
      parsed.data.reason
    );
    revalidatePath("/account/email-preferences");
    return { status: "success", intent: "unsubscribe", preferences };
  } catch {
    return failed("error", "unsubscribe");
  }
}

async function resubscribeAction(
  _previous: EmailPreferencesActionState,
  formData: FormData
): Promise<EmailPreferencesActionState> {
  const parsed = ConfirmFormSchema.safeParse({
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return failed("invalid", "resubscribe");

  try {
    const owner = await getOwner();
    if (!owner) return failed("error", "resubscribe");

    await mailyteProvider.updateContactStatus({
      email: owner.email,
      status: "subscribed",
      consentedAt: new Date().toISOString(),
      consentSource: "account email preferences: resubscribe",
    });
    const preferences = await emailPreferencesProvider.resubscribe();
    revalidatePath("/account/email-preferences");
    return { status: "success", intent: "resubscribe", preferences };
  } catch {
    return failed("error", "resubscribe");
  }
}

export async function emailPreferencesAction(
  previous: EmailPreferencesActionState,
  formData: FormData
): Promise<EmailPreferencesActionState> {
  const parsed = IntentSchema.safeParse(formData.get("intent"));
  if (!parsed.success) return failed("invalid");

  if (parsed.data === "save") return savePreferencesAction(previous, formData);
  if (parsed.data === "unsubscribe")
    return unsubscribeAction(previous, formData);
  return resubscribeAction(previous, formData);
}
