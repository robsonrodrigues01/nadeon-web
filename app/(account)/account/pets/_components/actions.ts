"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { accountProvider, petProfileProvider } from "@/lib/providers";
import {
  PetActivityLevelSchema,
  PetSpeciesSchema,
  type Pet,
  type PetInput,
} from "@/lib/contracts/account";

export type PetActionState = {
  status: "idle" | "success" | "invalid" | "error";
  message?: string;
};

const SavePetFormSchema = z
  .object({
    id: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).max(100),
    species: PetSpeciesSchema,
    breed: z.string().trim().min(1).max(100),
    birthDate: z.iso.date().optional(),
    weightLbs: z.number().positive().optional(),
    activityLevel: PetActivityLevelSchema.optional(),
  })
  .strict();

const RemovePetFormSchema = z.object({ id: z.string().trim().min(1) }).strict();

async function hasAccountOwner(): Promise<boolean> {
  const session = await accountProvider.getSession();
  if (!session) return false;
  const customer = await accountProvider.getCustomer();
  return Boolean(customer && customer.id === session.customerId);
}

function getText(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function result(
  status: Exclude<PetActionState["status"], "idle">
): PetActionState {
  return { status, message: "To be confirmed" };
}

export async function savePetAction(
  _previous: PetActionState,
  formData: FormData
): Promise<PetActionState> {
  const parsed = SavePetFormSchema.safeParse({
    id: getText(formData, "id"),
    name: getText(formData, "name"),
    species: getText(formData, "species"),
    breed: getText(formData, "breed"),
    birthDate: getText(formData, "birthDate"),
    weightLbs: getText(formData, "weightLbs")
      ? Number(getText(formData, "weightLbs"))
      : undefined,
    activityLevel: getText(formData, "activityLevel"),
  });
  if (!parsed.success) return result("invalid");

  try {
    if (!(await hasAccountOwner())) return result("error");

    const pets = await petProfileProvider.getPets();
    const existing = parsed.data.id
      ? pets.find((pet) => pet.id === parsed.data.id)
      : undefined;
    if (parsed.data.id && !existing) return result("error");

    const pet: PetInput = {
      ...parsed.data,
      concerns: existing?.concerns ?? [],
      photoUrl: existing?.photoUrl,
    };
    await petProfileProvider.savePet(pet);
    revalidatePath("/account/pets");
    return result("success");
  } catch {
    return result("error");
  }
}

export async function removePetAction(
  _previous: PetActionState,
  formData: FormData
): Promise<PetActionState> {
  const parsed = RemovePetFormSchema.safeParse({ id: getText(formData, "id") });
  if (!parsed.success) return result("invalid");

  try {
    if (!(await hasAccountOwner())) return result("error");
    const pets: Pet[] = await petProfileProvider.getPets();
    if (!pets.some((pet) => pet.id === parsed.data.id)) return result("error");

    await petProfileProvider.removePet(parsed.data.id);
    revalidatePath("/account/pets");
    return result("success");
  } catch {
    return result("error");
  }
}
