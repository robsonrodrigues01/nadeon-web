"use server";

import { formsProvider } from "@/lib/providers";
import type { FormSubmissionResult } from "@/lib/contracts/forms";

export async function subscribeNewsletter(
  list: string,
  email: string,
  consent = true
): Promise<FormSubmissionResult> {
  return formsProvider.subscribe(list, email, consent);
}

// Alias for convenience
export const subscribe = subscribeNewsletter;
