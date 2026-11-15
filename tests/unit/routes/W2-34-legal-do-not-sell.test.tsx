import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderToString } from "react-dom/server";

const sendPrivacyRequest = vi.fn();

vi.mock("@/lib/providers", () => ({
  formsProvider: {
    sendPrivacyRequest: (...args: unknown[]) => sendPrivacyRequest(...args),
  },
}));

import DoNotSellPage, { metadata } from "@/app/(shared)/legal/do-not-sell/page";
import { submitPrivacyRequest } from "@/app/(shared)/legal/do-not-sell/_components/actions";
import { PrivacyRequestForm } from "@/app/(shared)/legal/do-not-sell/_components/privacy-form";
import {
  DoNotSellHero,
  DoNotSellSidebar,
  LEGAL_PAGES,
} from "@/app/(shared)/legal/do-not-sell/_components/do-not-sell-content";

function formData(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

describe("W2-34: /legal/do-not-sell route", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    sendPrivacyRequest.mockReset();
    sendPrivacyRequest.mockResolvedValue({
      success: true,
      id: "prv_test123",
      message: "Request received",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("metadata", () => {
    it("exports SEO metadata with canonical path /legal/do-not-sell", () => {
      expect(metadata.title).toContain(
        "Do Not Sell or Share My Personal Information"
      );
      expect(metadata.alternates?.canonical).toBe(
        "https://nadeonlabs.com/legal/do-not-sell"
      );
    });
  });

  describe("page structure and semantics", () => {
    it("renders page with hero, breadcrumb, form, and sidebar", () => {
      const html = renderToString(<DoNotSellPage />);

      // Main container
      expect(html).toContain('id="main-content"');

      // H1 heading
      expect(html).toContain("Your privacy choices");

      // Breadcrumbs
      expect(html).toContain('aria-label="Breadcrumb"');
      expect(html).toContain('href="/"');
      expect(html).toContain('href="/legal/terms"');

      // Form heading
      expect(html).toContain("Privacy request form");
      expect(html).toContain("Submit a request");

      // Form sections
      expect(html).toContain("1. What would you like to do?");
      expect(html).toContain("2. Where do you live?");
      expect(html).toContain("3. About you");

      // Radio options
      expect(html).toContain("Do not sell or share my personal information");
      expect(html).toContain("Access my personal information");
      expect(html).toContain("Delete my personal information");
      expect(html).toContain("Correct my personal information");

      // Form fields
      expect(html).toContain('name="firstName"');
      expect(html).toContain('name="lastName"');
      expect(html).toContain('name="email"');
      expect(html).toContain('name="phone"');
      expect(html).toContain('name="state"');
      expect(html).toContain('name="requestorType"');
      expect(html).toContain('name="confirmAccuracy"');

      // Verification text
      expect(html).toContain("How we verify you.");

      // Submit button
      expect(html).toContain("Submit request");
    });

    it("renders standalone privacy form with default selected option", () => {
      const html = renderToString(<PrivacyRequestForm />);
      expect(html).toContain("Privacy request form");
      expect(html).toContain("Submit a request");
      expect(html).toContain("Do not sell or share my personal information");
    });

    it("renders legal navigation pills with current page marked", () => {
      const html = renderToString(<DoNotSellHero />);

      expect(html).toContain('aria-label="Legal pages navigation"');
      expect(html).toContain('aria-current="page"');
      expect(html).toContain("Do Not Sell or Share My Personal Information");
      expect(html).toContain('href="/legal/terms"');
      expect(html).toContain('href="/legal/privacy"');
      expect(html).toContain('href="/legal/accessibility"');
      expect(html).toContain('href="/shipping-returns"');

      expect(LEGAL_PAGES.find((p) => p.current)?.href).toBe(
        "/legal/do-not-sell"
      );
    });

    it("renders sidebar guidance cards with GPC, other methods and timeline", () => {
      const html = renderToString(<DoNotSellSidebar />);

      // Global Privacy Control Card
      expect(html).toContain("Global Privacy Control");
      expect(html).toContain("We honor GPC signals (To be confirmed)");
      expect(html).toContain(
        "treat it as a request to opt out of sale and sharing for that browser (To be confirmed)"
      );

      // Other ways to submit Card
      expect(html).toContain("Other ways to submit");
      expect(html).toContain("Email");
      expect(html).toContain("Call");
      expect(html).toContain("Mail");

      // What happens next Card
      expect(html).toContain("What happens next");
      expect(html).toContain('href="/legal/privacy"');
      expect(html).toContain("Read our Privacy Policy →");
    });

    it("adheres to Rule 8 replacing board placeholders with 'To be confirmed'", () => {
      const html = renderToString(<DoNotSellPage />);

      // Hero date
      expect(html).toContain("Last updated: To be confirmed");

      // Sidebar and form timelines
      expect(html).toContain(
        "We confirm receipt within To be confirmed business days."
      );
      expect(html).toContain(
        "We complete your request within To be confirmed days."
      );
      expect(html).toContain(
        "We respond within To be confirmed days as required by law."
      );

      // GPC and verification
      expect(html).toContain("GPC detected in this browser (To be confirmed)");
      expect(html).toContain(
        "submit this form while signed in To be confirmed."
      );
      expect(html).toContain(
        "ask for To be confirmed details that match our records"
      );
      expect(html).toContain("verify your request To be confirmed.");

      // Does not render forbidden raw placeholders
      expect(html).not.toMatch(/\[date placeholder\]/i);
      expect(html).not.toMatch(/\[privacy email\]/i);
      expect(html).not.toMatch(/\[toll-free number\]/i);
      expect(html).not.toMatch(/\[postal address\]/i);
    });

    it("renders confirmation state (State B) stating only request received without claiming opt-out on file or email sent", () => {
      const html = renderToString(
        <PrivacyRequestForm
          initialFormState={{
            status: "success",
            id: "prv_ref_987",
            email: "user@example.com",
            requestType: "do_not_sell",
          }}
        />
      );

      expect(html).toContain('data-testid="privacy-confirmation"');
      expect(html).toContain("Request received");
      expect(html).toContain("Thanks. Your request has been received.");
      expect(html).toContain("Reference");
      expect(html).toContain("prv_ref_987");

      // Does not allege opt-out applied or confirmation email sent
      expect(html).not.toContain("is now on file");
      expect(html).not.toContain("We sent a confirmation to");
    });
  });

  describe("Server Action: submitPrivacyRequest", () => {
    it("validates and submits opt-out request using do_not_sell contract", async () => {
      const data = formData({
        email: "alex@example.com",
        firstName: "Alex",
        lastName: "Smith",
        requestType: "do_not_sell",
        state: "CA",
        phone: "555-0100",
        requestorType: "consumer",
        confirmAccuracy: "on",
      });

      const res = await submitPrivacyRequest({ status: "idle" }, data);

      expect(res.status).toBe("success");
      if (res.status === "success") {
        expect(res.id).toBe("prv_test123");
        expect(res.email).toBe("alex@example.com");
        expect(res.requestType).toBe("do_not_sell");
      }

      expect(sendPrivacyRequest).toHaveBeenCalledTimes(1);
      expect(sendPrivacyRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "alex@example.com",
          firstName: "Alex",
          lastName: "Smith",
          requestType: "do_not_sell",
          details: "State: CA | Phone: 555-0100 | Requestor: consumer",
        })
      );
    });

    it("validates and submits access request using access contract type", async () => {
      const data = formData({
        email: "jordan@example.com",
        firstName: "Jordan",
        lastName: "Lee",
        requestType: "access",
        state: "NY",
        requestorType: "consumer",
        confirmAccuracy: "on",
      });

      const res = await submitPrivacyRequest({ status: "idle" }, data);

      expect(res.status).toBe("success");
      if (res.status === "success") {
        expect(res.requestType).toBe("access");
      }

      expect(sendPrivacyRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "jordan@example.com",
          requestType: "access",
        })
      );
    });

    it("validates and submits delete request using delete contract type", async () => {
      const data = formData({
        email: "taylor@example.com",
        firstName: "Taylor",
        lastName: "Swift",
        requestType: "delete",
        state: "TX",
        requestorType: "agent",
        confirmAccuracy: "on",
      });

      const res = await submitPrivacyRequest({ status: "idle" }, data);

      expect(res.status).toBe("success");
      if (res.status === "success") {
        expect(res.requestType).toBe("delete");
      }

      expect(sendPrivacyRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "taylor@example.com",
          requestType: "delete",
          details: "State: TX | Requestor: agent",
        })
      );
    });

    it("validates and submits correct request with correction details", async () => {
      const data = formData({
        email: "casey@example.com",
        firstName: "Casey",
        lastName: "Brown",
        requestType: "correct",
        state: "NJ",
        correctionDetails: "Update billing address",
        confirmAccuracy: "on",
      });

      const res = await submitPrivacyRequest({ status: "idle" }, data);

      expect(res.status).toBe("success");
      expect(sendPrivacyRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "casey@example.com",
          details: "State: NJ | Correction: Update billing address",
        })
      );
    });

    it("rejects submission if accuracy confirmation checkbox is not checked", async () => {
      const data = formData({
        email: "alex@example.com",
        firstName: "Alex",
        lastName: "Smith",
        requestType: "do_not_sell",
      });

      const res = await submitPrivacyRequest({ status: "idle" }, data);
      expect(res.status).toBe("invalid");
      expect(sendPrivacyRequest).not.toHaveBeenCalled();
    });

    it("rejects submission if required email or name is missing", async () => {
      const data = formData({
        email: "",
        firstName: "Alex",
        lastName: "",
        requestType: "do_not_sell",
        confirmAccuracy: "on",
      });

      const res = await submitPrivacyRequest({ status: "idle" }, data);
      expect(res.status).toBe("invalid");
      expect(sendPrivacyRequest).not.toHaveBeenCalled();
    });

    it("handles contract error response gracefully", async () => {
      sendPrivacyRequest.mockResolvedValueOnce({
        success: false,
        id: "",
        message: "Failed to log privacy request",
      });

      const data = formData({
        email: "alex@example.com",
        firstName: "Alex",
        lastName: "Smith",
        requestType: "do_not_sell",
        confirmAccuracy: "on",
      });

      const res = await submitPrivacyRequest({ status: "idle" }, data);
      expect(res.status).toBe("error");
      if (res.status === "error") {
        expect(res.error).toBe("Failed to log privacy request");
      }
    });

    it("handles unexpected provider exceptions gracefully", async () => {
      sendPrivacyRequest.mockRejectedValueOnce(new Error("Network timeout"));

      const data = formData({
        email: "alex@example.com",
        firstName: "Alex",
        lastName: "Smith",
        requestType: "do_not_sell",
        confirmAccuracy: "on",
      });

      const res = await submitPrivacyRequest({ status: "idle" }, data);
      expect(res.status).toBe("error");
      if (res.status === "error") {
        expect(res.error).toBe("Network timeout");
      }
    });
  });
});
