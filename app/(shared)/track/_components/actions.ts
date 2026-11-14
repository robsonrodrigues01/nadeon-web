"use server";

import { TrackOrderSchema } from "./schema";

// shortcut: nenhum contrato consulta pedido de visitante por número e e-mail, então
// a ação só valida a entrada. Quando o contrato existir, chamar o provider aqui e
// devolver o resultado para a página (estado B do design).
export async function lookupOrder(formData: FormData): Promise<void> {
  TrackOrderSchema.safeParse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
  });
}
