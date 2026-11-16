import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { mockFormsProvider } from "@/lib/providers/mock/forms";
import { FormSubmissionResultSchema } from "@/lib/contracts/forms";

describe("FormsProvider Contract", () => {
  it("subscribe validates and logs metadata without customer details", async () => {
    const logPath = path.resolve(
      process.cwd(),
      ".maestri/logs/forms-mock.jsonl"
    );
    const initialLogSize = fs.existsSync(logPath)
      ? fs.statSync(logPath).size
      : 0;
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

    const res = await mockFormsProvider.subscribe(
      "newsletter-human",
      "test.user@example.com",
      true
    );

    expect(() => FormSubmissionResultSchema.parse(res)).not.toThrow();
    expect(res.success).toBe(true);
    expect(res.id).toMatch(/^sub_/);

    // The server log contains metadata only; user input remains out of logs.
    expect(fs.existsSync(logPath)).toBe(true);
    const content = fs.readFileSync(logPath, "utf-8").slice(initialLogSize);
    expect(content).toContain('"formType":"subscribe"');
    expect(content).toContain(res.id);
    expect(content).not.toContain("newsletter-human");
    expect(content).not.toContain("test.user@example.com");

    const consoleEntry = consoleLog.mock.calls.find(
      ([label]) => label === "[FormsMock]"
    )?.[1];
    expect(consoleEntry).toContain(res.id);
    expect(consoleEntry).not.toContain("newsletter-human");
    expect(consoleEntry).not.toContain("test.user@example.com");
    consoleLog.mockRestore();
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
