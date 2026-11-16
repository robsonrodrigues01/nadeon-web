"use server";

import { formsProvider } from "@/lib/providers";
import { z } from "zod";
import {
  PrivacyRequestInputSchema,
  type PrivacyRequestType,
} from "@/lib/contracts/forms";

const PrivacyFormSchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  requestType: z.enum(["access", "delete", "correct", "do_not_sell"]),
  state: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(40).optional(),
  requestorType: z.enum(["consumer", "agent"]).optional(),
  correctionDetails: z.string().trim().max(2000).optional(),
  confirmAccuracy: z.literal("on"),
});

const PRIVACY_FORM_FIELDS = [
  "email",
  "firstName",
  "lastName",
  "requestType",
  "state",
  "phone",
  "requestorType",
  "correctionDetails",
  "confirmAccuracy",
] as const;

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
  if (PRIVACY_FORM_FIELDS.some((field) => formData.getAll(field).length > 1)) {
    return { status: "invalid" };
  }

  const rawValues = Object.fromEntries(
    PRIVACY_FORM_FIELDS.map((field) => [
      field,
      formData.get(field) ?? undefined,
    ])
  );
  const form = PrivacyFormSchema.safeParse(rawValues);
  if (!form.success) {
    return rawValues.confirmAccuracy === "on"
      ? { status: "invalid" }
      : {
          status: "invalid",
          error: "Please confirm that the information provided is accurate.",
        };
  }

  const {
    email,
    firstName,
    lastName,
    requestType: rawRequestType,
    state: stateOfResidence,
    phone,
    requestorType,
    correctionDetails,
  } = form.data;

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
      console.error("[PrivacyRequest] Provider rejected submission", {
        code: "provider_rejected",
      });
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
  } catch {
    console.error("[PrivacyRequest] Submission failed", {
      code: "provider_error",
    });
    return {
      status: "error",
      error: "Unable to submit request. Please try again.",
    };
  }
}
