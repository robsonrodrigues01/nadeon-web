"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { accountProvider } from "@/lib/providers";
import {
  PetInputSchema,
  ProfileInputSchema,
  type Pet,
} from "@/lib/contracts/account";
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

// Devolve o pet quando salvou, para atualizar a árvore cliente e fechar o formulário.
export async function savePetAction(formData: FormData): Promise<Pet | null> {
  const weight = text(formData, "weightLbs");
  const birthDate = text(formData, "birthDate");
  const parsed = PetInputSchema.safeParse({
    id: text(formData, "id") || undefined,
    name: text(formData, "name"),
    species: text(formData, "species"),
    breed: text(formData, "breed"),
    birthDate: birthDate || undefined,
    weightLbs: weight ? Number(weight) : undefined,
    activityLevel: text(formData, "activityLevel") || undefined,
    concerns: formData.getAll("concerns").map(String),
    photoUrl: text(formData, "photoUrl") || undefined,
  });
  if (!parsed.success) return null;

  const saved = await accountProvider.savePet(parsed.data);
  revalidatePath("/account/settings");
  return saved;
}
