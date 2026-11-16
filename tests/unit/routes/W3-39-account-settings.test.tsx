// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

const redirectMock = vi.hoisted(() => vi.fn());
const revalidatePathMock = vi.hoisted(() => vi.fn());
const routerRefreshMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  useRouter: () => ({
    refresh: routerRefreshMock,
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));
vi.mock("@/components/layout/header", () => ({ Header: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));
vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));

import AccountSettingsPage from "@/app/(account)/account/settings/page";
import { accountProvider, formsProvider } from "@/lib/providers";
import type { CustomerProfile } from "@/lib/contracts/account";

async function renderSettings() {
  return render(await AccountSettingsPage());
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  redirectMock.mockClear();
  revalidatePathMock.mockClear();
  routerRefreshMock.mockClear();
});

describe("W3-39 /account/settings mounted behavior", () => {
  it("submits edited profile data to the provider", async () => {
    const updatedProfile: CustomerProfile = {
      id: "customer_alex",
      firstName: "Alexandra",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 234-5678",
      profileType: "Both",
    };
    const update = vi
      .spyOn(accountProvider, "updateProfile")
      .mockResolvedValue(updatedProfile);
    await renderSettings();

    fireEvent.change(screen.getByRole("textbox", { name: "First name" }), {
      target: { value: "Alexandra" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: "Alexandra" })
      )
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/account/settings");
  });

  it("shows the saved profile and success feedback after provider success", async () => {
    vi.spyOn(accountProvider, "updateProfile").mockResolvedValue({
      id: "customer_alex",
      firstName: "Alexandra",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 234-5678",
      profileType: "Both",
    });
    await renderSettings();
    fireEvent.change(screen.getByRole("textbox", { name: "First name" }), {
      target: { value: "Alexandra" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(screen.getByText("Profile saved.", { exact: true })).toBeTruthy()
    );
    expect(
      (
        screen.getByRole("textbox", {
          name: "First name",
        }) as HTMLInputElement
      ).value
    ).toBe("Alexandra");
    expect(routerRefreshMock).toHaveBeenCalled();
  });

  it("shows a friendly profile error after provider failure", async () => {
    vi.spyOn(accountProvider, "updateProfile").mockRejectedValue(
      new Error("Profile service unavailable")
    );
    await renderSettings();
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe(
      "We couldn't save your profile. Please try again."
    );
    expect(alert.getAttribute("aria-live")).toBe("assertive");
  });

  it("confirms a deletion request, calls the provider and displays the updated state", async () => {
    const sendPrivacyRequest = vi
      .spyOn(formsProvider, "sendPrivacyRequest")
      .mockResolvedValue({ success: true, id: "privacy_123" });
    await renderSettings();

    fireEvent.click(
      screen.getByRole("button", { name: "Request account deletion" })
    );
    await screen.findByRole("alertdialog", {
      name: /confirm account deletion request/i,
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm deletion" }));

    await waitFor(() =>
      expect(sendPrivacyRequest).toHaveBeenCalledWith({
        email: "alex.morgan@example.com",
        firstName: "Alex",
        lastName: "Morgan",
        requestType: "delete",
      })
    );
    const confirmation = await screen.findByRole("status");
    expect(confirmation.textContent).toMatch(/account deletion request/i);
    expect(confirmation.textContent).toContain("privacy_123");
  });

  it("shows a friendly error if the deletion request provider fails", async () => {
    vi.spyOn(formsProvider, "sendPrivacyRequest").mockRejectedValue(
      new Error("Privacy request service unavailable")
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    await renderSettings();
    fireEvent.click(
      screen.getByRole("button", { name: "Request account deletion" })
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm deletion" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe(
      "Unable to submit request. Please try again."
    );
    expect(alert.getAttribute("aria-live")).toBe("assertive");
  });
});
