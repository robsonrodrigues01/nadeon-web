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
      const maestriDir = path.resolve(process.cwd(), ".maestri");
      const logDir = path.join(maestriDir, "logs");
      const configuredPath = process.env.FORMS_MOCK_LOG;
      const filePath = configuredPath
        ? path.resolve(
            path.isAbsolute(configuredPath)
              ? configuredPath
              : path.join(logDir, configuredPath)
          )
        : path.join(logDir, "forms-mock.jsonl");

      if (path.dirname(filePath) !== logDir) {
        throw new Error("Configured log path is outside the allowed directory");
      }

      for (const directory of [maestriDir, logDir]) {
        if (fs.existsSync(directory)) {
          const stats = fs.lstatSync(directory);
          if (stats.isSymbolicLink() || !stats.isDirectory()) {
            throw new Error("Configured log directory is not a safe directory");
          }
        } else {
          fs.mkdirSync(directory);
        }
      }

      const fileDescriptor = fs.openSync(
        filePath,
        fs.constants.O_WRONLY |
          fs.constants.O_APPEND |
          fs.constants.O_CREAT |
          (fs.constants.O_NOFOLLOW ?? 0),
        0o600
      );
      try {
        fs.writeFileSync(
          fileDescriptor,
          `${JSON.stringify(logEntry)}\n`,
          "utf-8"
        );
      } finally {
        fs.closeSync(fileDescriptor);
      }
    } catch {
      console.error("[FormsMock] Failed writing log entry", {
        code: "log_write_failed",
      });
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
  private lastContactSubmission?: ContactInput;

  getLastContactSubmission(): ContactInput | undefined {
    return this.lastContactSubmission
      ? { ...this.lastContactSubmission }
      : undefined;
  }

  clearLastContactSubmission(): void {
    this.lastContactSubmission = undefined;
  }

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
    this.lastContactSubmission = parsed.data;
    const id = `contact_${Math.random().toString(36).substring(2, 9)}`;
    await logMockSubmission("contact", id);

    return FormSubmissionResultSchema.parse({
      success: true,
      id,
      message: parsed.data.copy
        ? "Contact message sent successfully (copy requested)"
        : "Contact message sent successfully",
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
