"use server";

import { z } from "zod";
import { formsProvider } from "@/lib/providers";
import { ContactInputSchema } from "@/lib/contracts/forms";

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "invalid" }
  | { status: "error" };

export type TrackState =
  { status: "idle" } | { status: "invalid" } | { status: "pending" };

// Mesmo formato do campo de número do design: NL- seguido de 6 dígitos.
const TrackInputSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^NL-\d{6}$/),
  email: z.email().trim(),
});

export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = ContactInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
    orderNumber: formData.get("orderNumber") || undefined,
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

// shortcut: nenhum contrato consulta pedido de visitante por número e e-mail.
// Quando existir, chamar o provider aqui e devolver o pedido para a página.
export async function lookupOrder(
  _previous: TrackState,
  formData: FormData
): Promise<TrackState> {
  const parsed = TrackInputSchema.safeParse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
  });
  return parsed.success ? { status: "pending" } : { status: "invalid" };
}
