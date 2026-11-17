import { afterEach, describe, expect, it, vi } from "vitest";
import { LiveMailyteProvider } from "@/lib/providers/live";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("W5-10 Mailyte contact status", () => {
  it("updates unsubscribe status without adding consent metadata", async () => {
    vi.stubEnv("MAILYTE_API_KEY", "TEST-key");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await new LiveMailyteProvider().updateContactStatus({
      email: "owner@example.test",
      status: "unsubscribed",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://app.mailyte.com/api/v1/contacts",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          email: "owner@example.test",
          status: "unsubscribed",
        }),
      })
    );
  });

  it("records explicit consent when resubscribing and never echoes PII in errors", async () => {
    vi.stubEnv("MAILYTE_API_KEY", "TEST-key");
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new Error("owner@example.test failed"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new LiveMailyteProvider().updateContactStatus({
        email: "owner@example.test",
        status: "subscribed",
        consentedAt: "2026-11-17T12:00:00.000Z",
        consentSource: "account email preferences: resubscribe",
      })
    ).rejects.toThrow("Unable to update email consent status.");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://app.mailyte.com/api/v1/contacts",
      expect.objectContaining({
        body: JSON.stringify({
          email: "owner@example.test",
          status: "subscribed",
          consented_at: "2026-11-17T12:00:00.000Z",
          consent_source: "account email preferences: resubscribe",
        }),
      })
    );
  });

  it("does not call the API without an API key", async () => {
    vi.stubEnv("MAILYTE_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new LiveMailyteProvider().updateContactStatus({
        email: "owner@example.test",
        status: "unsubscribed",
      })
    ).rejects.toThrow("MAILYTE_API_KEY is required for the live provider");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
