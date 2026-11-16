"use server";

import { formsProvider } from "@/lib/providers";
import {
  PrivacyRequestInputSchema,
  type PrivacyRequestType,
} from "@/lib/contracts/forms";

export type PrivacyFormState =
  | { status: "idle" }
  | {
      status: "success";
      id: string;
      email: string;
      requestType: PrivacyRequestType;
    }
  | { status: "invalid"; error?: string }
  | { status: "error"; error?: string };

export async function submitPrivacyRequest(
  _previousState: PrivacyFormState,
  formData: FormData
): Promise<PrivacyFormState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const firstName = (formData.get("firstName") as string | null)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string | null)?.trim() ?? "";
  const rawRequestType =
    (formData.get("requestType") as string | null)?.trim() ?? "do_not_sell";
  const stateOfResidence = (formData.get("state") as string | null)?.trim();
  const phone = (formData.get("phone") as string | null)?.trim();
  const requestorType = (
    formData.get("requestorType") as string | null
  )?.trim();
  const correctionDetails = (
    formData.get("correctionDetails") as string | null
  )?.trim();
  const confirmAccuracy = formData.get("confirmAccuracy");

  if (!confirmAccuracy) {
    return {
      status: "invalid",
      error: "Please confirm that the information provided is accurate.",
    };
  }

  // Map request type to contract
  let requestType: PrivacyRequestType = "do_not_sell";
  if (rawRequestType === "access") {
    requestType = "access";
  } else if (rawRequestType === "delete") {
    requestType = "delete";
  } else if (rawRequestType === "correct") {
    // contract only has access | delete | opt_out | do_not_sell
    requestType = "opt_out";
  } else {
    requestType = "do_not_sell";
  }

  const detailsParts: string[] = [];
  if (stateOfResidence) detailsParts.push(`State: ${stateOfResidence}`);
  if (phone) detailsParts.push(`Phone: ${phone}`);
  if (requestorType) detailsParts.push(`Requestor: ${requestorType}`);
  if (correctionDetails) detailsParts.push(`Correction: ${correctionDetails}`);
  const details =
    detailsParts.length > 0 ? detailsParts.join(" | ") : undefined;

  const parsed = PrivacyRequestInputSchema.safeParse({
    email,
    firstName,
    lastName,
    state: stateOfResidence,
    requestType,
    details,
  });

  if (!parsed.success) {
    return { status: "invalid" };
  }

  try {
    const result = await formsProvider.sendPrivacyRequest(parsed.data);
    if (!result.success) {
      console.error(
        "[PrivacyRequest] Provider rejected submission:",
        result.message
      );
      return {
        status: "error",
        error: "Unable to submit request. Please try again.",
      };
    }
    return {
      status: "success",
      id: result.id,
      email: parsed.data.email,
      requestType: parsed.data.requestType,
    };
  } catch (err) {
    console.error("[PrivacyRequest] Submission failed:", err);
    return {
      status: "error",
      error: "Unable to submit request. Please try again.",
    };
  }
}
