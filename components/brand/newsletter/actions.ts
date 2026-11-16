"use server";

import { formsProvider } from "@/lib/providers";
import type { FormSubmissionResult } from "@/lib/contracts/forms";

export async function subscribeNewsletter(
  list: string,
  email: string,
  consent = true
): Promise<FormSubmissionResult> {
  try {
    const result = await formsProvider.subscribe(list, email, consent);
    if (!result.success) {
      return {
        success: false,
        id: "",
        message: "Unable to complete subscription. Please try again.",
      };
    }
    return result;
  } catch {
    return {
      success: false,
      id: "",
      message: "Unable to complete subscription. Please try again.",
    };
  }
}

// Alias for convenience
export const subscribe = subscribeNewsletter;
