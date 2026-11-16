"use server";

import { formsProvider, accountProvider } from "@/lib/providers";
import { ContactInputSchema } from "@/lib/contracts/forms";
import { TrackOrderSchema } from "@/app/(shared)/track/_components/schema";

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "invalid" }
  | { status: "error" };

export type TrackState =
  | { status: "idle" }
  | { status: "invalid" }
  | { status: "not_found" }
  | {
      status: "found";
      orderNumber: string;
      fulfillmentStatus: string;
      trackingNumber?: string;
      trackingUrl?: string;
      itemCount: number;
    }
  | { status: "error" };

export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  const rawCopy = formData.get("copy");
  const copy = rawCopy === "on" || rawCopy === "true" ? true : undefined;

  const parsed = ContactInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
    orderNumber: formData.get("orderNumber") || undefined,
    copy,
  });
  if (!parsed.success) {
    return { status: "invalid" };
  }

  try {
    const result = await formsProvider.sendContact(parsed.data);
    return result.success ? { status: "sent" } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}

export async function lookupOrder(
  _previous: TrackState,
  formData: FormData
): Promise<TrackState> {
  const parsed = TrackOrderSchema.safeParse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { status: "invalid" };
  }

  try {
    const order = await accountProvider.lookupGuestOrder(
      parsed.data.orderNumber,
      parsed.data.email
    );
    if (!order) {
      return { status: "not_found" };
    }
    return {
      status: "found",
      orderNumber: order.orderNumber,
      fulfillmentStatus: order.fulfillmentStatus,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      itemCount: order.items.length,
    };
  } catch {
    return { status: "error" };
  }
}
