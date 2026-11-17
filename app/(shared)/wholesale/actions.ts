"use server";

import { WholesaleApplicationInputSchema } from "@/lib/contracts/wholesale";
import { wholesaleProvider } from "@/lib/providers";

export type WholesaleApplicationState = {
  status: "idle" | "invalid" | "submitted" | "error";
};

export async function submitWholesaleApplication(
  _previousState: WholesaleApplicationState,
  formData: FormData
): Promise<WholesaleApplicationState> {
  const getText = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : undefined;
  };
  const optionalText = (name: string) => getText(name) || undefined;

  const parsed = WholesaleApplicationInputSchema.safeParse({
    businessName: getText("businessName"),
    contactName: getText("contactName"),
    email: getText("email"),
    phone: getText("phone"),
    website: optionalText("website"),
    businessType: getText("businessType"),
    state: getText("state"),
    locationCount: getText("locationCount"),
    resellerPermitOrEin: getText("resellerPermitOrEin"),
    estimatedMonthlyOrder: getText("estimatedMonthlyOrder"),
    productLines: formData
      .getAll("productLines")
      .filter((value): value is string => typeof value === "string"),
    description: optionalText("description"),
    termsAccepted: formData.get("termsAccepted") === "on",
  });

  if (!parsed.success) return { status: "invalid" };

  try {
    await wholesaleProvider.submit(parsed.data);
    return { status: "submitted" };
  } catch {
    return { status: "error" };
  }
}
