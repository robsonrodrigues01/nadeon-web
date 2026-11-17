// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import ProfessionalsPage from "@/app/(shared)/professionals/page";
import { submitProfessionalApplication } from "@/app/(shared)/professionals/actions";
import { contentProvider, formsProvider } from "@/lib/providers";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function validProfessionalForm() {
  const form = new FormData();
  form.set("fullName", "TEST Professional");
  form.set("profession", "Veterinarian (DVM)");
  form.set("licenseOrCredential", "TEST-CREDENTIAL");
  form.set("practice", "TEST Practice");
  form.set("state", "TEST");
  form.set("email", "professional@example.test");
  form.set("phone", "TEST-000-0000");
  form.set("audience", "pet");
  form.set("recommendationModel", "referral");
  form.set("audienceProfile", "TEST audience profile");
  form.set("licenseConfirmation", "on");
  form.set("termsAccepted", "on");
  return form;
}

describe("W5-18 /professionals", () => {
  it("renders the professional program page and semantic application controls", async () => {
    vi.spyOn(contentProvider, "getExpertsPage");
    vi.spyOn(contentProvider, "listExperts").mockResolvedValue([]);
    render(await ProfessionalsPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Partner with Nadeon.",
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Apply now" }).getAttribute("href")
    ).toBe("#application");
    expect(
      screen.getByRole("link", { name: "How it works" }).getAttribute("href")
    ).toBe("#how-it-works");
    expect(screen.getByRole("radio", { name: "Human health" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Pet health" })).toBeTruthy();
    for (const label of [
      "Full name",
      "Profession",
      "License or credential number",
      "Practice or clinic",
      "State",
      "Email",
      "Phone",
      "How would you recommend Nadeon?",
      "Anything else we should know? (optional)",
    ]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
    expect(
      screen.getByRole("checkbox", { name: /active license/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("checkbox", { name: /program terms/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Submit application" })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Email the team" }).getAttribute("href")
    ).toBe("/help#contact");
    expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
    expect(screen.queryByText(/YOURNAME25|25%|10% commission/i)).toBeNull();
    expect(
      screen.queryByText(/physicians, scientists and veterinarians/i)
    ).toBeNull();
    expect(screen.queryByRole("link", { name: /pro portal/i })).toBeNull();
    expect(contentProvider.getExpertsPage).toHaveBeenCalledOnce();
    expect(contentProvider.listExperts).toHaveBeenCalledWith("human");
    expect(contentProvider.listExperts).toHaveBeenCalledWith("pet");
  });

  it.each([
    ["invalid email", (form: FormData) => form.set("email", "not-an-email")],
    [
      "unsupported profession",
      (form: FormData) => form.set("profession", "unknown"),
    ],
    ["missing terms consent", (form: FormData) => form.delete("termsAccepted")],
  ])("rejects %s before calling the registry", async (_label, mutate) => {
    const submit = vi.spyOn(formsProvider, "sendApplication");
    const form = validProfessionalForm();
    mutate(form);

    await expect(
      submitProfessionalApplication({ status: "idle" }, form)
    ).resolves.toEqual({ status: "invalid" });
    expect(submit).not.toHaveBeenCalled();
  });

  it("submits valid applications without logging or returning personal data", async () => {
    const submit = vi
      .spyOn(formsProvider, "sendApplication")
      .mockResolvedValue({ success: true, id: "app_professionals_TEST_01" });
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const form = validProfessionalForm();

    const result = await submitProfessionalApplication(
      { status: "idle" },
      form
    );

    expect(submit).toHaveBeenCalledWith(
      "professionals",
      expect.objectContaining({
        name: "TEST Professional",
        email: "professional@example.test",
        organization: "TEST Practice",
        details: expect.objectContaining({
          profession: "Veterinarian (DVM)",
          licenseOrCredential: "TEST-CREDENTIAL",
          audience: "pet",
          recommendationModel: "referral",
        }),
      })
    );
    expect(result).toEqual({ status: "submitted" });
    expect(JSON.stringify(result)).not.toContain("professional@example.test");
    expect(JSON.stringify(result)).not.toContain("TEST-CREDENTIAL");
    expect(log.mock.calls.flat().join(" ")).not.toContain(
      "professional@example.test"
    );
    expect(log.mock.calls.flat().join(" ")).not.toContain("TEST-CREDENTIAL");
  });
});
