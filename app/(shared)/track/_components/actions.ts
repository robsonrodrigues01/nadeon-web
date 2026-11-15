"use server";

import { accountProvider } from "@/lib/providers";
import { TrackOrderSchema } from "./schema";

export async function lookupOrder(formData: FormData): Promise<{
  orderNumber: string;
  email: string;
  order: Awaited<ReturnType<typeof accountProvider.lookupGuestOrder>>;
} | null> {
  const parsed = TrackOrderSchema.safeParse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
  });
  if (!parsed.success) return null;
  const order = await accountProvider.lookupGuestOrder(
    parsed.data.orderNumber,
    parsed.data.email
  );
  return order
    ? { orderNumber: parsed.data.orderNumber, email: parsed.data.email, order }
    : null;
}
