"use server";

import { accountProvider } from "@/lib/providers";
import { TrackOrderSchema } from "./schema";
import type { Order } from "@/lib/contracts/account";

/**
 * Consulta de pedido de visitante via lookupGuestOrder (estado B do design).
 */
export async function lookupOrder(formData: FormData): Promise<Order | null> {
  const parsed = TrackOrderSchema.safeParse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return null;
  }
  return accountProvider.lookupGuestOrder(
    parsed.data.orderNumber,
    parsed.data.email
  );
}
