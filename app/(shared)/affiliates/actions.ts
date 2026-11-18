"use server";

import { formsProvider } from "@/lib/providers";
import { AffiliateApplicationSchema } from "./application-schema";

const formFields = [
  "fullName",
  "email",
  "socialHandles",
  "contentLinks",
  "audienceSize",
  "niche",
  "guidelinesAccepted",
  "disclosureAccepted",
] as const;

export type AffiliateApplicationState = {
  status: "idle" | "invalid" | "submitted" | "error";
};

export async function submitAffiliateApplication(
  _previousState: AffiliateApplicationState,
  formData: FormData
): Promise<AffiliateApplicationState> {
  if (formFields.some((field) => formData.getAll(field).length > 1)) {
    return { status: "invalid" };
  }

  const rawValues = Object.fromEntries(
    formFields.map((field) => [field, formData.get(field) ?? undefined])
  );
  const parsed = AffiliateApplicationSchema.safeParse(rawValues);
  if (!parsed.success) return { status: "invalid" };

  const { fullName, email, socialHandles, contentLinks, audienceSize, niche } =
    parsed.data;

  try {
    const result = await formsProvider.sendApplication("affiliates", {
      name: fullName,
      email,
      details: {
        socialHandles,
        contentLinks,
        audienceSize,
        niche,
        guidelinesAccepted: true,
        disclosureAccepted: true,
      },
    });
    return { status: result.success ? "submitted" : "error" };
  } catch {
    return { status: "error" };
  }
}
