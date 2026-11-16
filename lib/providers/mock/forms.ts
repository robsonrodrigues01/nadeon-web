import {
  type ApplicationInput,
  type ApplicationType,
  type ContactInput,
  type FormSubmissionResult,
  type FormsProvider,
  type PrivacyRequestInput,
  ApplicationInputSchema,
  ContactInputSchema,
  FormSubmissionResultSchema,
  PrivacyRequestInputSchema,
} from "@/lib/contracts/forms";

async function logMockSubmission(
  type: string,
  id = `log_${Math.random().toString(36).slice(2, 9)}`
): Promise<void> {
  const isDev =
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test" ||
    !process.env.NODE_ENV;

  if (!isDev) {
    return;
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    formType: type,
    id,
  };

  // Log to console in development
  console.log("[FormsMock]", JSON.stringify(logEntry));

  // Write to .maestri/logs/forms-mock.jsonl only on server
  if (typeof window === "undefined") {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const filePath = path.resolve(
        process.env.FORMS_MOCK_LOG || ".maestri/logs/forms-mock.jsonl"
      );
      const logDir = path.dirname(filePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.appendFileSync(filePath, `${JSON.stringify(logEntry)}\n`, "utf-8");
    } catch (err) {
      console.error("[FormsMock] Failed writing log entry:", err);
    }
  }
}

export const ALLOWED_NEWSLETTER_LISTS = [
  "newsletter",
  "newsletter-human",
  "newsletter-pet",
] as const;
export type AllowedNewsletterList = (typeof ALLOWED_NEWSLETTER_LISTS)[number];

export class MockFormsProvider implements FormsProvider {
  async subscribe(
    list: string,
    email: string,
    consent: boolean
  ): Promise<FormSubmissionResult> {
    if (!list || typeof list !== "string" || !list.trim()) {
      throw new Error("Invalid newsletter list");
    }
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email address");
    }
    if (!consent) {
      throw new Error("Consent is required to subscribe");
    }

    const id = `sub_${Math.random().toString(36).substring(2, 9)}`;
    await logMockSubmission("subscribe", id);

    return FormSubmissionResultSchema.parse({
      success: true,
      id,
      message: "Subscribed successfully",
    });
  }

  async sendContact(payload: ContactInput): Promise<FormSubmissionResult> {
    const parsed = ContactInputSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error("Invalid contact form data");
    }
    const id = `contact_${Math.random().toString(36).substring(2, 9)}`;
    await logMockSubmission("contact", id);

    return FormSubmissionResultSchema.parse({
      success: true,
      id,
      message: "Contact message sent successfully",
    });
  }

  async sendPrivacyRequest(
    payload: PrivacyRequestInput
  ): Promise<FormSubmissionResult> {
    const parsed = PrivacyRequestInputSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error("Invalid privacy request data");
    }
    const id = `privacy_${Math.random().toString(36).substring(2, 9)}`;
    await logMockSubmission("privacy_request", id);

    return FormSubmissionResultSchema.parse({
      success: true,
      id,
      message: "Privacy request received and logged",
    });
  }

  async sendApplication(
    type: ApplicationType,
    payload: ApplicationInput
  ): Promise<FormSubmissionResult> {
    const parsed = ApplicationInputSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error("Invalid application data");
    }
    const id = `app_${type}_${Math.random().toString(36).substring(2, 9)}`;
    await logMockSubmission(`application:${type}`, id);

    return FormSubmissionResultSchema.parse({
      success: true,
      id,
      message: `Application for ${type} submitted successfully`,
    });
  }

  async trackEvent(
    name: string,
    email: string | null,
    properties?: Record<string, unknown>
  ): Promise<{ success: boolean }> {
    void name;
    void email;
    void properties;
    await logMockSubmission("track_event");
    return { success: true };
  }
}

export const mockFormsProvider = new MockFormsProvider();
