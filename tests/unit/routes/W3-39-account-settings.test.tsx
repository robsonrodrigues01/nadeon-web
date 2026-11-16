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

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  useRouter: () => ({
    refresh: vi.fn(),
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
import { accountProvider } from "@/lib/providers";
import type { CustomerProfile } from "@/lib/contracts/account";

async function renderSettings() {
  return render(await AccountSettingsPage());
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  redirectMock.mockClear();
  revalidatePathMock.mockClear();
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

  it.fails(
    "shows the saved profile and success feedback after provider success",
    async () => {
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
        expect(screen.getByText("Profile saved", { exact: true })).toBeTruthy()
      );
      expect(
        (
          screen.getByRole("textbox", {
            name: "First name",
          }) as HTMLInputElement
        ).value
      ).toBe("Alexandra");
    }
  );

  it.todo(
    "shows a recoverable profile error after provider failure; the server action currently has no error state"
  );

  it.fails("confirms deletion and calls the account provider", async () => {
    await renderSettings();

    const button = screen.getByRole("button", {
      name: "Request account deletion",
    });
    expect((button as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(button);
    expect(
      screen.getByRole("dialog", { name: /delete account/i })
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm deletion" }));
    await waitFor(() =>
      expect(accountProvider).toHaveProperty("deleteAccount")
    );
  });

  it.todo(
    "calls the deletion provider after confirmation and shows success; deletion provider/API and UI are absent"
  );
  it.todo(
    "shows a recoverable error if account deletion fails; deletion provider/API and UI are absent"
  );
});
