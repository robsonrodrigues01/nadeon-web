"use server";

import { accountProvider } from "@/lib/providers";
import { TrackOrderSchema } from "./schema";
import {
  GuestOrderTrackingSchema,
  type GuestOrderTracking,
} from "@/lib/contracts/account";

export type TrackActionResult =
  | { status: "found"; order: GuestOrderTracking }
  | { status: "not_found"; errorMessage: string }
  | { status: "invalid"; errorMessage: string; field?: "orderNumber" | "email" }
  | { status: "error"; errorMessage: string };

/**
 * Consulta de pedido de visitante via lookupGuestOrder (estado B do design).
 * Mantido para compatibilidade com testes unitários existentes de W2-18.
 */
export async function lookupOrder(
  formData: FormData
): Promise<GuestOrderTracking | null> {
  const parsed = TrackOrderSchema.safeParse({
    orderNumber: String(formData.get("orderNumber") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
  });
  if (!parsed.success) {
    return null;
  }
  return accountProvider.lookupGuestOrder(
    parsed.data.orderNumber,
    parsed.data.email
  );
}

/**
 * Server Action invocada por POST para consulta de visitante sem expor e-mail na URL.
 */
export async function lookupOrderAction(
  payloadOrFormData: FormData | TrackActionResult,
  maybeFormData?: FormData
): Promise<TrackActionResult> {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : payloadOrFormData instanceof FormData
        ? payloadOrFormData
        : new FormData();

  const parsed = TrackOrderSchema.safeParse({
    orderNumber: String(formData.get("orderNumber") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
  });
  if (!parsed.success) {
    const field = String(parsed.error.issues[0]?.path[0] ?? "orderNumber") as
      "orderNumber" | "email";
    return {
      status: "invalid",
      errorMessage: "Check the order number and email.",
      field,
    };
  }

  try {
    const order = await accountProvider.lookupGuestOrder(
      parsed.data.orderNumber,
      parsed.data.email
    );
    if (!order) {
      return {
        status: "not_found",
        errorMessage:
          "No order found with that number and email. Please check your confirmation email.",
      };
    }
    return { status: "found", order: GuestOrderTrackingSchema.parse(order) };
  } catch {
    return {
      status: "error",
      errorMessage: "Unable to look up your order. Please try again.",
    };
  }
}
