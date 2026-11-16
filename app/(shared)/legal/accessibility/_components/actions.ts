"use server";

import { formsProvider } from "@/lib/providers";
import { FeedbackInputSchema } from "./schema";

export type FeedbackFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; error?: string }
  | { status: "error"; error?: string };

export async function submitAccessibilityFeedback(
  _previousState: FeedbackFormState,
  formData: FormData
): Promise<FeedbackFormState> {
  const parsed = FeedbackInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    pageOrFeature: formData.get("pageOrFeature") || undefined,
    description: formData.get("description"),
    preferredReply: formData.get("preferredReply") || undefined,
    assistiveTech: formData.get("assistiveTech") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "invalid",
      error:
        parsed.error.issues[0]?.message ||
        "Please fill in all required fields.",
    };
  }

  const details = [
    parsed.data.pageOrFeature
      ? `Page or feature: ${parsed.data.pageOrFeature}`
      : null,
    parsed.data.preferredReply
      ? `Preferred reply format: ${parsed.data.preferredReply}`
      : null,
    parsed.data.assistiveTech
      ? `Assistive technology used: ${parsed.data.assistiveTech}`
      : null,
    `Issue description:\n${parsed.data.description}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const res = await formsProvider.sendContact({
      name: parsed.data.name,
      email: parsed.data.email,
      topic: "accessibility",
      message: details,
    });

    if (res.success) {
      return { status: "success" };
    }
    console.error("[AccessibilityFeedback] Provider rejected submission", {
      code: "provider_rejected",
    });
    return {
      status: "error",
      error: "Unable to submit feedback. Please try again.",
    };
  } catch {
    console.error("[AccessibilityFeedback] Submission failed", {
      code: "provider_error",
    });
    return {
      status: "error",
      error: "Unable to submit feedback. Please try again.",
    };
  }
}
