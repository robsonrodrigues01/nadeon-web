// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import WholesalePage from "@/app/(shared)/wholesale/page";
import { submitWholesaleApplication } from "@/app/(shared)/wholesale/actions";
import { DEFAULT_MARKET } from "@/lib/market";
import * as visitorMarket from "@/lib/market/visitor";
import { wholesaleProvider } from "@/lib/providers";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function validApplicationForm() {
  const form = new FormData();
  form.set("businessName", "TEST Business");
  form.set("contactName", "TEST Contact");
  form.set("email", "buyer@example.com");
  form.set("phone", "TEST-000-0000");
  form.set("website", "https://example.test");
  form.set("businessType", "Pet stores & groomers");
  form.set("state", "TEST");
  form.set("locationCount", "2");
  form.set("resellerPermitOrEin", "TEST-ID");
  form.set("estimatedMonthlyOrder", "TEST estimate");
  form.append("productLines", "human");
  form.append("productLines", "pet");
  form.set("description", "TEST business details");
  form.set("termsAccepted", "on");
  return form;
}

describe("W5-15 /wholesale", () => {
  it("renders the public wholesale page and semantic application fields without portal pricing", async () => {
    vi.spyOn(visitorMarket, "getVisitorMarket").mockResolvedValue(
      DEFAULT_MARKET
    );
    render(await WholesalePage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Carry Nadeon in your store",
      })
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Apply now" })).toHaveProperty(
      "href",
      expect.stringContaining("#application")
    );
    expect(
      screen.getByRole("button", { name: "Download line sheet" })
    ).toHaveProperty("disabled", true);
    for (const label of [
      "Business name",
      "Contact name",
      "Email",
      "Phone",
      "Website or social (optional)",
      "Business type",
      "State",
      "Number of locations",
      "Reseller permit or EIN",
      "Estimated monthly order",
      "Nadeon Human",
      "Nadeon Pet",
      "Tell us about your business (optional)",
    ]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
    expect(
      screen.getByRole("checkbox", {
        name: /agree to be contacted about wholesale/i,
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Submit application" })
    ).toBeTruthy();
    expect(screen.getByText("Response time: To be confirmed.")).toBeTruthy();
    expect(screen.getByText("Line sheet: To be confirmed.")).toBeTruthy();
    expect(screen.queryByText(/wholesale@nadeonlabs\.com/i)).toBeNull();
    expect(screen.queryByText(/\$X\.XX|Tier 1|Tier 2|Tier 3/)).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Retailer sign in" })
    ).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Your trade dashboard" })
    ).toBeNull();
  });

  it("rejects invalid Zod input without submitting it to the registry", async () => {
    const submit = vi.spyOn(wholesaleProvider, "submit");

    await expect(
      submitWholesaleApplication({ status: "idle" }, new FormData())
    ).resolves.toEqual({ status: "invalid" });
    expect(submit).not.toHaveBeenCalled();
  });

  it.each([
    ["website", "not-a-url", "Pet stores & groomers"],
    ["website", "javascript:alert(1)", "Pet stores & groomers"],
    ["businessType", "unknown", "unknown"],
  ])(
    "rejects invalid %s values before calling the provider",
    async (field, value, businessType) => {
      const submit = vi.spyOn(wholesaleProvider, "submit");
      const form = validApplicationForm();
      form.set(field, value);
      if (field === "website") form.set("businessType", businessType);

      await expect(
        submitWholesaleApplication({ status: "idle" }, form)
      ).resolves.toEqual({ status: "invalid" });
      expect(submit).not.toHaveBeenCalled();
    }
  );

  it("submits valid application through the registry without logging or returning PII", async () => {
    const submit = vi
      .spyOn(wholesaleProvider, "submit")
      .mockResolvedValue({ id: "wholesale_TEST_01" });
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const form = validApplicationForm();

    const result = await submitWholesaleApplication({ status: "idle" }, form);

    expect(submit).toHaveBeenCalledWith({
      businessName: "TEST Business",
      contactName: "TEST Contact",
      email: "buyer@example.com",
      phone: "TEST-000-0000",
      website: "https://example.test",
      businessType: "Pet stores & groomers",
      state: "TEST",
      locationCount: "2",
      resellerPermitOrEin: "TEST-ID",
      estimatedMonthlyOrder: "TEST estimate",
      productLines: ["human", "pet"],
      description: "TEST business details",
      termsAccepted: true,
    });
    expect(result).toEqual({ status: "submitted" });
    expect(JSON.stringify(result)).not.toContain("buyer@example.com");
    expect(log).not.toHaveBeenCalled();
  });

  it("submits the mounted application form and shows a generic success state", async () => {
    vi.spyOn(visitorMarket, "getVisitorMarket").mockResolvedValue(
      DEFAULT_MARKET
    );
    const submit = vi
      .spyOn(wholesaleProvider, "submit")
      .mockResolvedValue({ id: "wholesale_TEST_02" });
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    render(await WholesalePage());

    for (const [label, value] of [
      ["Business name", "TEST Business"],
      ["Contact name", "TEST Contact"],
      ["Email", "buyer@example.com"],
      ["Phone", "TEST-000-0000"],
      ["State", "TEST"],
      ["Number of locations", "2"],
      ["Reseller permit or EIN", "TEST-ID"],
      ["Estimated monthly order", "TEST estimate"],
    ]) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    fireEvent.change(screen.getByLabelText("Business type"), {
      target: { value: "Pet stores & groomers" },
    });
    fireEvent.click(screen.getByLabelText("Nadeon Human"));
    fireEvent.click(screen.getByLabelText("Nadeon Pet"));
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /agree to be contacted about wholesale/i,
      })
    );
    fireEvent.click(screen.getByRole("button", { name: "Submit application" }));

    expect(
      await screen.findByText(
        "Application received. A partner manager will reach out with pricing and next steps."
      )
    ).toBeTruthy();
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        businessName: "TEST Business",
        email: "buyer@example.com",
        productLines: ["human", "pet"],
      })
    );
    expect(log).not.toHaveBeenCalled();
  });
});
