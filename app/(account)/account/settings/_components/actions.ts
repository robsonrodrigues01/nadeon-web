"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { accountProvider, formsProvider } from "@/lib/providers";
import {
  PetInputSchema,
  ProfileInputSchema,
  type CustomerProfile,
  type Pet,
  type ProfileInput,
} from "@/lib/contracts/account";
import { parseBirthday } from "./birthday";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseProfile(formData: FormData): ProfileInput | null {
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
    return null;
  }

  return parsed.data;
}

export type ProfileFormState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "invalid"; message?: string }
  | { status: "success"; profile: CustomerProfile; message: string }
  | { status: "error"; message: string };

export async function saveProfileWithFeedback(
  _previousState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session =
    typeof accountProvider.getSession === "function"
      ? await accountProvider.getSession()
      : null;
  const customer =
    session && typeof accountProvider.getCustomer === "function"
      ? await accountProvider.getCustomer()
      : null;
  if (!customer) {
    return {
      status: "error",
      message: "You must be signed in to update your profile.",
    };
  }

  const parsed = parseProfile(formData);
  if (!parsed) {
    return {
      status: "invalid",
      message: "Please check your profile details and try again.",
    };
  }

  try {
    const profile = await accountProvider.updateProfile(parsed);
    revalidatePath("/account/settings");
    return { status: "success", profile, message: "Profile saved." };
  } catch {
    return {
      status: "error",
      message: "We couldn't save your profile. Please try again.",
    };
  }
}

export async function saveProfileFormAction(
  previousState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  return saveProfileWithFeedback(previousState, formData);
}

export async function saveProfileAction(
  formData: FormData
): Promise<ProfileFormState> {
  return saveProfileWithFeedback({ status: "idle" }, formData);
}

export async function signOutAction(): Promise<void> {
  await accountProvider.signOut();
  redirect("/");
}

// Devolve o pet quando salvou, para atualizar a árvore cliente e fechar o formulário.
export async function savePetAction(formData: FormData): Promise<Pet | null> {
  const session =
    typeof accountProvider.getSession === "function"
      ? await accountProvider.getSession()
      : null;
  const customer =
    session && typeof accountProvider.getCustomer === "function"
      ? await accountProvider.getCustomer()
      : null;
  if (!customer) {
    return null;
  }

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

  if (parsed.data.id) {
    const pets =
      typeof accountProvider.getPets === "function"
        ? await accountProvider.getPets()
        : [];
    const ownsPet = pets.some((p) => p.id === parsed.data.id);
    if (!ownsPet) {
      return null;
    }
  }

  const saved = await accountProvider.savePet(parsed.data);
  revalidatePath("/account/settings");
  return saved;
}

const DeleteAccountFormSchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  requestType: z.literal("delete"),
  confirmAccuracy: z.literal("on"),
});

const DELETE_ACCOUNT_FORM_FIELDS = [
  "email",
  "firstName",
  "lastName",
  "requestType",
  "confirmAccuracy",
] as const;

export type DeleteAccountFormState =
  | { status: "idle" }
  | { status: "success"; id: string }
  | { status: "invalid"; error?: string }
  | { status: "error"; error?: string };

export async function requestAccountDeletionAction(
  _previousState: DeleteAccountFormState,
  formData: FormData
): Promise<DeleteAccountFormState> {
  if (
    DELETE_ACCOUNT_FORM_FIELDS.some(
      (field) => formData.getAll(field).length > 1
    )
  ) {
    return {
      status: "invalid",
      error: "Unable to submit request. Please try again.",
    };
  }

  const rawValues = Object.fromEntries(
    DELETE_ACCOUNT_FORM_FIELDS.map((field) => [
      field,
      formData.get(field) ?? undefined,
    ])
  );

  const parsed = DeleteAccountFormSchema.safeParse(rawValues);
  if (!parsed.success) {
    return {
      status: "invalid",
      error: "Unable to submit request. Please try again.",
    };
  }

  // Só o dono da conta pede a exclusão: exige sessão e usa o e-mail dela, nunca o do formulário.
  const session =
    typeof accountProvider.getSession === "function"
      ? await accountProvider.getSession()
      : null;
  const customer =
    session && typeof accountProvider.getCustomer === "function"
      ? await accountProvider.getCustomer()
      : null;
  if (!customer?.email) {
    return {
      status: "error",
      error: "Sign in to request account deletion.",
    };
  }

  try {
    const result = await formsProvider.sendPrivacyRequest({
      email: customer.email,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      requestType: "delete",
    });

    if (!result.success) {
      return {
        status: "error",
        error: "Unable to submit request. Please try again.",
      };
    }

    return {
      status: "success",
      id: result.id,
    };
  } catch {
    return {
      status: "error",
      error: "Unable to submit request. Please try again.",
    };
  }
}
