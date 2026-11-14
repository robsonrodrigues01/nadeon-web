"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { accountProvider } from "@/lib/providers";
import { ProfileInputSchema } from "@/lib/contracts/account";
import { parseBirthday } from "./birthday";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

// Entrada inválida não grava nada; a página não tem texto de erro no design.
export async function saveProfileAction(formData: FormData): Promise<void> {
  const birthDate = parseBirthday(text(formData, "birthDate"));
  const parsed = ProfileInputSchema.safeParse({
    firstName: text(formData, "firstName"),
    lastName: text(formData, "lastName"),
    email: text(formData, "email"),
    phone: text(formData, "phone") || undefined,
    birthDate: birthDate ?? undefined,
    profileType: text(formData, "profileType") || undefined,
  });

  if (
    !parsed.success ||
    birthDate === null ||
    !parsed.data.firstName ||
    !parsed.data.lastName
  ) {
    return;
  }

  await accountProvider.updateProfile(parsed.data);
  revalidatePath("/account/settings");
}

export async function signOutAction(): Promise<void> {
  await accountProvider.signOut();
  redirect("/");
}
