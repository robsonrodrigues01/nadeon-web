// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import AffiliatesPage from "@/app/(shared)/affiliates/page";
import { submitAffiliateApplication } from "@/app/(shared)/affiliates/actions";
import { formsProvider } from "@/lib/providers";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function validAffiliateForm() {
  const form = new FormData();
  form.set("fullName", "TEST Creator");
  form.set("email", "creator@example.test");
  form.set("socialHandles", "TEST social handle");
  form.set(
    "contentLinks",
    "https://example.test/post-1\nhttps://example.test/post-2"
  );
  form.set("audienceSize", "5K to 25K");
  form.set("niche", "both");
  form.set("guidelinesAccepted", "on");
  form.set("disclosureAccepted", "on");
  return form;
}

describe("W5-19 /affiliates", () => {
  it("renders the creator program and semantic application controls", async () => {
    render(await AffiliatesPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Share what you take." })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Apply to join" }).getAttribute("href")
    ).toBe("#application");
    expect(
      screen
        .getByRole("link", { name: "See the guidelines" })
        .getAttribute("href")
    ).toBe("#guidelines");
    for (const label of [
      "Full name",
      "Email",
      "Social handles",
      "Content links",
      "Audience size range",
      "Niche",
    ]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
    for (const label of [
      "I acknowledge the content guidelines are To be confirmed.",
      "I will disclose the partnership in every post.",
    ]) {
      expect(screen.getByRole("checkbox", { name: label })).toBeTruthy();
    }
    expect(
      screen.getByRole("button", { name: "Submit application" })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Email the team" }).getAttribute("href")
    ).toBe("/help#contact");
    expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
    expect(
      screen.queryByText(
        /\d+% commission|paid once a month|own creator dashboard/i
      )
    ).toBeNull();
    expect(screen.queryByText(/Example of a good caption/i)).toBeNull();
    expect(screen.queryByText(/creators@nadeonlabs\.com/i)).toBeNull();
    expect(screen.queryByRole("link", { name: /pro portal/i })).toBeNull();
  });

  it.each([
    ["invalid email", (form: FormData) => form.set("email", "not-an-email")],
    [
      "unsupported audience size",
      (form: FormData) => form.set("audienceSize", "unknown"),
    ],
    [
      "only one content link",
      (form: FormData) => form.set("contentLinks", "https://example.test/post"),
    ],
    [
      "missing guideline consent",
      (form: FormData) => form.delete("guidelinesAccepted"),
    ],
  ])("rejects %s before calling the provider", async (_label, mutate) => {
    const submit = vi.spyOn(formsProvider, "sendApplication");
    const form = validAffiliateForm();
    mutate(form);

    await expect(
      submitAffiliateApplication({ status: "idle" }, form)
    ).resolves.toEqual({ status: "invalid" });
    expect(submit).not.toHaveBeenCalled();
  });

  it("submits valid applications without logging or returning personal data", async () => {
    const submit = vi
      .spyOn(formsProvider, "sendApplication")
      .mockResolvedValue({ success: true, id: "app_affiliates_TEST_01" });
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const form = validAffiliateForm();

    const result = await submitAffiliateApplication({ status: "idle" }, form);

    expect(submit).toHaveBeenCalledWith(
      "affiliates",
      expect.objectContaining({
        name: "TEST Creator",
        email: "creator@example.test",
        details: expect.objectContaining({
          socialHandles: "TEST social handle",
          contentLinks: [
            "https://example.test/post-1",
            "https://example.test/post-2",
          ],
          audienceSize: "5K to 25K",
          niche: "both",
        }),
      })
    );
    expect(result).toEqual({ status: "submitted" });
    expect(JSON.stringify(result)).not.toContain("creator@example.test");
    expect(JSON.stringify(result)).not.toContain("TEST social handle");
    expect(log.mock.calls.flat().join(" ")).not.toContain(
      "creator@example.test"
    );
    expect(log.mock.calls.flat().join(" ")).not.toContain("TEST social handle");
  });
});
