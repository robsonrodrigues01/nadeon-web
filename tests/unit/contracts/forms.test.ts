import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { mockFormsProvider } from "@/lib/providers/mock/forms";
import { FormSubmissionResultSchema } from "@/lib/contracts/forms";

describe("FormsProvider Contract", () => {
  it("subscribe validates email and consent and appends its redacted entry", async () => {
    const logDir = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), "forms-mock-"))
    );
    const logPath = path.join(logDir, ".maestri", "logs", "forms-mock.jsonl");
    const previousLogPath = process.env.FORMS_MOCK_LOG;
    const previousCwd = process.cwd();

    try {
      process.chdir(logDir);
      process.env.FORMS_MOCK_LOG = logPath;
      const res = await mockFormsProvider.subscribe(
        "newsletter-human",
        "test.user@example.com",
        true
      );

      expect(() => FormSubmissionResultSchema.parse(res)).not.toThrow();
      expect(res.success).toBe(true);
      expect(res.id).toMatch(/^sub_/);

      const [line] = fs.readFileSync(logPath, "utf-8").trim().split("\n");
      const entry = JSON.parse(line);
      expect(entry).toMatchObject({ formType: "subscribe", id: res.id });
      expect(entry).not.toHaveProperty("email");
      expect(entry).not.toHaveProperty("name");
      expect(entry).not.toHaveProperty("message");
      expect(line).not.toContain("test.user@example.com");
    } finally {
      if (previousLogPath === undefined) {
        delete process.env.FORMS_MOCK_LOG;
      } else {
        process.env.FORMS_MOCK_LOG = previousLogPath;
      }
      process.chdir(previousCwd);
      fs.rmSync(logDir, { recursive: true, force: true });
    }
  });

  it("subscribe throws if consent is false or email invalid", async () => {
    await expect(
      mockFormsProvider.subscribe("newsletter", "user@example.com", false)
    ).rejects.toThrow(/Consent is required/);

    await expect(
      mockFormsProvider.subscribe("newsletter", "invalid-email", true)
    ).rejects.toThrow(/Invalid email/);
  });

  it("sendContact validates payload and submits successfully", async () => {
    const res = await mockFormsProvider.sendContact({
      name: "Morgan Stark",
      email: "morgan@example.com",
      topic: "product_inquiry",
      message: "Can I combine BioHack with Powerhouse?",
      orderNumber: "NL-100234",
    });

    expect(() => FormSubmissionResultSchema.parse(res)).not.toThrow();
    expect(res.success).toBe(true);
    expect(res.id).toMatch(/^contact_/);
  });

  it("sendPrivacyRequest logs opt-out or data deletion requests", async () => {
    const res = await mockFormsProvider.sendPrivacyRequest({
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      state: "CA",
      requestType: "do_not_sell",
      details: "Please opt my email out from cross-context sharing.",
    });

    expect(() => FormSubmissionResultSchema.parse(res)).not.toThrow();
    expect(res.success).toBe(true);
  });

  it("sendApplication accepts wholesale and affiliate applications", async () => {
    const res = await mockFormsProvider.sendApplication("wholesale", {
      name: "Dr. Evans",
      email: "evans@vetclinic.com",
      organization: "Austin Holistic Vet Clinic",
      website: "https://austinvet.example.com",
      phone: "+1 (555) 444-3322",
      details: {
        estimatedVolumePerMonth: 50,
        clinicType: "integrative",
      },
    });

    expect(() => FormSubmissionResultSchema.parse(res)).not.toThrow();
    expect(res.success).toBe(true);
    expect(res.id).toMatch(/^app_wholesale_/);
  });

  it("trackEvent records behavioral event without throwing", async () => {
    const res = await mockFormsProvider.trackEvent(
      "quiz_completed",
      "alex.morgan@example.com",
      {
        line: "pet",
        species: "dog",
        recommendedSlug: "more-good-years",
      }
    );
    expect(res.success).toBe(true);
  });
});
