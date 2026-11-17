// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EmailPreferencesPage from "@/app/(account)/account/email-preferences/page";
import { emailPreferencesAction } from "@/app/(account)/account/email-preferences/_components/actions";
import {
  accountProvider,
  emailPreferencesProvider,
  mailyteProvider,
} from "@/lib/providers";
import type { EmailPreferences } from "@/lib/contracts/email-preferences";

const { redirectMock, revalidatePathMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
  revalidatePathMock: vi.fn(),
}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

const customer = {
  id: "cust_TEST_owner",
  firstName: "TEST",
  lastName: "Owner",
  email: "owner@example.test",
};
const preferences: EmailPreferences = {
  ordersAndShipping: true,
  topics: {
    subscriptionReminders: true,
    humanNews: false,
    petNews: true,
    journal: false,
    offers: true,
  },
  frequency: "weekly_digest",
  unsubscribedAll: false,
};

function form(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  redirectMock.mockClear();
  revalidatePathMock.mockClear();
});

beforeEach(() => {
  vi.spyOn(accountProvider, "getSession").mockResolvedValue({
    accessToken: "TEST-token",
    expiresAt: "2099-01-01T00:00:00.000Z",
    customerId: customer.id,
  });
  vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(customer as never);
  vi.spyOn(accountProvider, "signInUrl").mockResolvedValue("/account/login");
  vi.spyOn(emailPreferencesProvider, "getPreferences").mockResolvedValue(
    preferences
  );
  vi.spyOn(emailPreferencesProvider, "savePreferences").mockResolvedValue(
    preferences
  );
  vi.spyOn(emailPreferencesProvider, "unsubscribe").mockResolvedValue({
    ...preferences,
    unsubscribedAll: true,
  });
  vi.spyOn(emailPreferencesProvider, "resubscribe").mockResolvedValue(
    preferences
  );
  vi.spyOn(mailyteProvider, "updateContactStatus").mockResolvedValue();
});

describe("W5-10 /account/email-preferences", () => {
  it("requires a signed-in owner before loading preferences", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue(null);

    await expect(EmailPreferencesPage()).rejects.toThrow(
      "REDIRECT:/account/login"
    );
    expect(emailPreferencesProvider.getPreferences).not.toHaveBeenCalled();
  });

  it("renders provider preferences, required transactional mail, and consent actions", async () => {
    render(await EmailPreferencesPage());

    expect(
      screen.getByRole("heading", { name: "Email preferences" })
    ).toBeTruthy();
    expect(
      screen.getByText("Choose what we send and how often. Update anytime.")
    ).toBeTruthy();
    expect(screen.getByText("Managing emails for")).toBeTruthy();
    expect(screen.getByText("o••••@example.test")).toBeTruthy();
    expect(
      (
        screen.getByRole("checkbox", {
          name: /Orders and shipping/,
        }) as HTMLInputElement
      ).checked
    ).toBe(true);
    expect(
      (screen.getByRole("checkbox", { name: /Pet news/ }) as HTMLInputElement)
        .checked
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "Unsubscribe from all" })
    ).toBeTruthy();
    expect(emailPreferencesProvider.getPreferences).toHaveBeenCalledOnce();
  });

  it("validates preferences and rejects missing or foreign account ownership before mutations", async () => {
    const saveSpy = vi.spyOn(emailPreferencesProvider, "savePreferences");
    const invalid = await emailPreferencesAction(
      { status: "idle" },
      form({ intent: "save", frequency: "daily" })
    );
    expect(invalid.status).toBe("invalid");
    expect(saveSpy).not.toHaveBeenCalled();
    const invalidReason = await emailPreferencesAction(
      { status: "idle" },
      form({ intent: "unsubscribe", confirm: "yes", reason: "unknown_reason" })
    );
    expect(invalidReason.status).toBe("invalid");
    expect(emailPreferencesProvider.unsubscribe).not.toHaveBeenCalled();

    const saved = await emailPreferencesAction(
      { status: "idle" },
      form({
        intent: "save",
        frequency: "monthly_digest",
        humanNews: "on",
        journal: "on",
      })
    );
    expect(saved.status).toBe("success");
    expect(saveSpy).toHaveBeenCalledWith({
      topics: {
        subscriptionReminders: false,
        humanNews: true,
        petNews: false,
        journal: true,
        offers: false,
      },
      frequency: "monthly_digest",
    });

    vi.spyOn(accountProvider, "getSession").mockResolvedValue(null);
    const unauthorized = await emailPreferencesAction(
      { status: "idle" },
      form({ intent: "unsubscribe", confirm: "yes", reason: "other" })
    );
    expect(unauthorized.status).toBe("error");
    expect(emailPreferencesProvider.unsubscribe).not.toHaveBeenCalled();

    vi.spyOn(accountProvider, "getSession").mockResolvedValue({
      accessToken: "TEST-token",
      expiresAt: "2099-01-01T00:00:00.000Z",
      customerId: "cust_TEST_other",
    });
    const foreign = await emailPreferencesAction(
      { status: "idle" },
      form({ intent: "resubscribe", confirm: "yes" })
    );
    expect(foreign.status).toBe("error");
    expect(emailPreferencesProvider.resubscribe).not.toHaveBeenCalled();
  });

  it("returns a generic failure and writes no personal data to logs when Mailyte fails", async () => {
    vi.spyOn(mailyteProvider, "updateContactStatus").mockRejectedValue(
      new Error(`failed for ${customer.email}`)
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const result = await emailPreferencesAction(
      { status: "idle" },
      form({ intent: "unsubscribe", confirm: "yes" })
    );

    expect(result).toEqual({
      status: "error",
      intent: "unsubscribe",
      message: "To be confirmed",
    });
    expect(emailPreferencesProvider.unsubscribe).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain(customer.email);
  });

  it("confirms unsubscribe as Mailyte contact status and resubscribes with explicit consent", async () => {
    const updateStatus = vi.spyOn(mailyteProvider, "updateContactStatus");
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(await EmailPreferencesPage());
    fireEvent.click(
      screen.getByRole("button", { name: "Unsubscribe from all" })
    );
    expect(
      screen.getByRole("heading", { name: "Unsubscribe from all emails?" })
    ).toBeTruthy();
    const unsubscribed = await emailPreferencesAction(
      { status: "idle" },
      form({ intent: "unsubscribe", confirm: "yes", reason: "too_many_emails" })
    );
    expect(unsubscribed).toMatchObject({
      status: "success",
      preferences: { unsubscribedAll: true },
    });
    expect(emailPreferencesProvider.unsubscribe).toHaveBeenCalledWith(
      "too_many_emails"
    );
    expect(updateStatus).toHaveBeenCalledWith({
      email: customer.email,
      status: "unsubscribed",
    });
    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining(customer.email)
    );

    const resubscribed = await emailPreferencesAction(
      { status: "idle" },
      form({ intent: "resubscribe", confirm: "yes" })
    );
    expect(resubscribed).toMatchObject({
      status: "success",
      preferences: { unsubscribedAll: false },
    });
    expect(updateStatus).toHaveBeenLastCalledWith(
      expect.objectContaining({
        email: customer.email,
        status: "subscribed",
        consentSource: "account email preferences: resubscribe",
      })
    );
  });
});
