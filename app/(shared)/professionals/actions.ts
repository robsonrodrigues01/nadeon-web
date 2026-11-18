"use server";

import { z } from "zod";
import { formsProvider } from "@/lib/providers";

const ProfessionalApplicationSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  profession: z.enum([
    "Medical doctor (MD, DO)",
    "Nutritionist or dietitian",
    "Personal trainer",
    "Health coach",
    "Veterinarian (DVM)",
    "Vet tech",
    "Animal trainer",
    "Groomer",
    "Other",
  ]),
  licenseOrCredential: z.string().trim().min(1).max(200),
  practice: z.string().trim().min(1).max(160),
  state: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(1).max(40),
  audience: z.enum(["human", "pet"]),
  recommendationModel: z.enum(["clinic", "referral", "both"]),
  audienceProfile: z.string().trim().max(2000).optional(),
  licenseConfirmation: z.literal("on"),
  termsAccepted: z.literal("on"),
});

const formFields = [
  "fullName",
  "profession",
  "licenseOrCredential",
  "practice",
  "state",
  "email",
  "phone",
  "audience",
  "recommendationModel",
  "audienceProfile",
  "licenseConfirmation",
  "termsAccepted",
] as const;

export type ProfessionalApplicationState = {
  status: "idle" | "invalid" | "submitted" | "error";
};

export async function submitProfessionalApplication(
  _previousState: ProfessionalApplicationState,
  formData: FormData
): Promise<ProfessionalApplicationState> {
  if (formFields.some((field) => formData.getAll(field).length > 1)) {
    return { status: "invalid" };
  }

  const rawValues = Object.fromEntries(
    formFields.map((field) => [field, formData.get(field) ?? undefined])
  );
  const parsed = ProfessionalApplicationSchema.safeParse(rawValues);
  if (!parsed.success) return { status: "invalid" };

  const {
    fullName,
    profession,
    licenseOrCredential,
    practice,
    state,
    email,
    phone,
    audience,
    recommendationModel,
    audienceProfile,
  } = parsed.data;

  try {
    const result = await formsProvider.sendApplication("professionals", {
      name: fullName,
      email,
      organization: practice,
      phone,
      details: {
        profession,
        licenseOrCredential,
        state,
        audience,
        recommendationModel,
        audienceProfile,
        licenseConfirmed: true,
        termsAccepted: true,
      },
    });
    return { status: result.success ? "submitted" : "error" };
  } catch {
    return { status: "error" };
  }
}
