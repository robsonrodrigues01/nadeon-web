import { describe, expect, it, vi } from "vitest";
import { MockFormsProvider } from "@/lib/providers/mock/forms";
import { subscribeNewsletter } from "@/components/brand/newsletter/actions";
import { formsProvider } from "@/lib/providers";

describe("W3-64 mock provider error and data leakage prevention", () => {
  it("does not leak email or personal data in MockFormsProvider error exceptions", async () => {
    const provider = new MockFormsProvider();
    const sensitiveEmail = "sensitive.user@example.com";

    // 1. Invalid email
    try {
      await provider.subscribe("newsletter", "bad-format", true);
      expect.unreachable("should have thrown");
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(Error);
      const message = (err as Error).message;
      expect(message).toBe("Invalid email address");
      expect(message).not.toContain("bad-format");
    }

    // 2. Consent missing
    try {
      await provider.subscribe("newsletter", sensitiveEmail, false);
      expect.unreachable("should have thrown");
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(Error);
      const message = (err as Error).message;
      expect(message).toBe("Consent is required to subscribe");
      expect(message).not.toContain(sensitiveEmail);
    }
  });

  it("does not include personal data in MockFormsProvider success message", async () => {
    const provider = new MockFormsProvider();
    const sensitiveEmail = "sensitive.user@example.com";

    const result = await provider.subscribe(
      "newsletter-human",
      sensitiveEmail,
      true
    );
    expect(result.success).toBe(true);
    expect(result.message).toBe("Subscribed to newsletter-human successfully");
    expect(result.message).not.toContain(sensitiveEmail);
  });

  it("does not contain personal data in error messages for invalid contact/privacy/application payloads", async () => {
    const provider = new MockFormsProvider();

    // Invalid contact
    await expect(
      provider.sendContact({
        name: "Private Name",
        email: "not-an-email",
        topic: "help",
        message: "Secret feedback",
      })
    ).rejects.toThrow("Invalid contact form data");

    // Invalid privacy request
    await expect(
      provider.sendPrivacyRequest({
        email: "invalid-email",
        firstName: "Secret",
        lastName: "User",
        state: "CA",
        requestType: "do_not_sell",
      })
    ).rejects.toThrow("Invalid privacy request data");

    // Invalid application
    await expect(
      provider.sendApplication("wholesale", {
        name: "Secret Applicant",
        email: "invalid-email",
        details: {},
      })
    ).rejects.toThrow("Invalid application data");
  });

  it("ensures subscribeNewsletter action intercepts provider exceptions and never leaks them to the client", async () => {
    const sensitiveErrorMessage =
      "internal-db-failure-containing-user-pii: secret@test.com";
    vi.spyOn(formsProvider, "subscribe").mockRejectedValueOnce(
      new Error(sensitiveErrorMessage)
    );

    const result = await subscribeNewsletter(
      "newsletter-human",
      "user@test.com",
      true
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Unable to complete subscription. Please try again."
    );
    expect(result.message).not.toContain(sensitiveErrorMessage);
    expect(result.message).not.toContain("secret@test.com");
  });

  it("ensures subscribeNewsletter action returns safe error message when provider returns success: false", async () => {
    vi.spyOn(formsProvider, "subscribe").mockResolvedValueOnce({
      success: false,
      id: "sub_err_1",
      message: "Internal diagnostic with user@test.com and address info",
    });

    const result = await subscribeNewsletter(
      "newsletter-human",
      "user@test.com",
      true
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Unable to complete subscription. Please try again."
    );
    expect(result.message).not.toContain("Internal diagnostic");
    expect(result.message).not.toContain("user@test.com");
  });
});
