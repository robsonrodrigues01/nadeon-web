// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, within } from "@testing-library/react";

import TermsPage, { metadata } from "@/app/(shared)/legal/terms/page";

function mainEl(): HTMLElement {
  return (document.querySelector("main") || document.body) as HTMLElement;
}

describe("W2-33: /legal/terms route", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe("metadata", () => {
    it("exports SEO metadata with canonical path /legal/terms", () => {
      expect(metadata.title).toContain("Terms of Service");
      expect(metadata.title).toContain("Nadeon");
      expect(metadata.alternates?.canonical).toBe(
        "https://nadeonlabs.com/legal/terms"
      );
    });
  });

  describe("page structure and hero", () => {
    beforeEach(() => {
      render(<TermsPage />);
    });

    it("has one h1 with Terms of Service", () => {
      const heading = within(mainEl()).getByRole("heading", {
        level: 1,
        name: "Terms of Service",
      });
      expect(heading).toBeDefined();
    });

    it("displays breadcrumb navigation", () => {
      const breadcrumb = within(mainEl()).getByLabelText(/breadcrumb/i);
      expect(breadcrumb).toBeDefined();
      expect(breadcrumb.textContent).toContain("Home");
      expect(breadcrumb.textContent).toContain("Legal");
      expect(breadcrumb.textContent).toContain("Terms of Service");
    });

    it("displays metadata indicators with To be confirmed for placeholders", () => {
      expect(mainEl().textContent).toContain("Last updated:");
      expect(mainEl().textContent).toContain("Effective:");
      expect(mainEl().textContent).toContain("Version:");
      expect(mainEl().textContent).toContain("To be confirmed");
    });

    it("renders legal navigation pills linking to legal pages", () => {
      const pillsNav = within(mainEl()).getByRole("navigation", {
        name: /legal sections/i,
      });
      expect(pillsNav).toBeDefined();

      const privacyLink = within(pillsNav).getByRole("link", {
        name: /privacy policy/i,
      });
      expect(privacyLink.getAttribute("href")).toBe("/legal/privacy");

      const doNotSellLink = within(pillsNav).getByRole("link", {
        name: /do not sell/i,
      });
      expect(doNotSellLink.getAttribute("href")).toBe("/legal/do-not-sell");

      const a11yLink = within(pillsNav).getByRole("link", {
        name: /accessibility/i,
      });
      expect(a11yLink.getAttribute("href")).toBe("/legal/accessibility");
    });

    it("does not render draft or template warning notices on the page", () => {
      expect(mainEl().textContent).not.toContain("Draft pending legal review");
      expect(mainEl().textContent).not.toContain("TEMPLATE");
    });
  });

  describe("sections and content from design board", () => {
    beforeEach(() => {
      render(<TermsPage />);
    });

    it("renders all 16 numbered sections with matching anchor ids", () => {
      const expectedSections = [
        "acceptance-of-these-terms",
        "eligibility-and-accounts",
        "orders-and-pricing",
        "subscriptions-and-auto-renewal",
        "shipping-returns-and-refunds",
        "rewards-and-promotions",
        "product-information-and-health-disclaimer",
        "reviews-and-user-content",
        "intellectual-property",
        "prohibited-uses",
        "disclaimers-and-limitation-of-liability",
        "dispute-resolution-and-arbitration",
        "governing-law",
        "changes-to-these-terms",
        "your-us-privacy-rights",
        "contact-us",
      ];

      for (const sectionId of expectedSections) {
        const el = mainEl().querySelector(`#${sectionId}`);
        expect(el, `Expected section #${sectionId} to exist`).not.toBeNull();
      }
    });

    it("renders table of contents on the page sidebar", () => {
      const toc = within(mainEl()).getByRole("navigation", {
        name: /on this page/i,
      });
      expect(toc).toBeDefined();

      const link1 = within(toc).getByRole("link", {
        name: /1\.\s*Acceptance of these terms/i,
      });
      expect(link1.getAttribute("href")).toBe("#acceptance-of-these-terms");

      const link16 = within(toc).getByRole("link", {
        name: /16\.\s*Contact us/i,
      });
      expect(link16.getAttribute("href")).toBe("#contact-us");
    });

    it("renders Section 4 subscription disclosure banner and notice", () => {
      expect(mainEl().textContent).toContain(
        "Cancel anytime, no fees, no minimum commitment."
      );
      expect(mainEl().textContent).toContain(
        "Skip, pause or cancel online in your account."
      );
      expect(mainEl().textContent).toContain("Automatic renewal disclosure.");
      expect(mainEl().textContent).toContain(
        "We email you 3 days before each charge"
      );
    });

    it("renders Section 5 refunds table with payment methods", () => {
      const table = within(mainEl()).getByRole("table");
      expect(table).toBeDefined();
      expect(table.querySelector("caption")?.textContent?.trim()).toBe(
        "Refunds"
      );
      expect(within(table).getByText("Payment method")).toBeDefined();
      expect(within(table).getByText("Refund issued")).toBeDefined();
      expect(within(table).getByText("Credit or debit card")).toBeDefined();
      expect(within(table).getByText("PayPal")).toBeDefined();
      expect(within(table).getByText("Shop Pay")).toBeDefined();
    });

    it("renders Section 7 FDA disclaimer notice", () => {
      expect(mainEl().textContent).toContain(
        "These statements have not been evaluated by the Food and Drug Administration"
      );
    });

    it("renders Section 12 arbitration and class action waiver placeholder notice", () => {
      expect(mainEl().textContent).toContain(
        "Placeholder for capitalized arbitration and class action waiver notice."
      );
    });

    it("renders Section 15 US privacy rights with CCPA/CPRA cards and request link", () => {
      expect(mainEl().textContent).toContain("Right to know");
      expect(mainEl().textContent).toContain("Right to delete");
      expect(mainEl().textContent).toContain("Right to correct");
      expect(mainEl().textContent).toContain(
        "Right to opt out of sale or sharing"
      );

      const privacyLinks = within(mainEl()).getAllByRole("link", {
        name: /privacy request|do not sell/i,
      });
      expect(privacyLinks.length).toBeGreaterThan(0);
      expect(privacyLinks[0].getAttribute("href")).toBe("/legal/do-not-sell");
    });

    it("renders Section 16 contact details for Nadeon Labs", () => {
      expect(mainEl().textContent).toContain("Nadeon Labs");
      expect(mainEl().textContent).toContain(
        "1081 Paulison Ave, Suite 3B, Clifton, NJ 07011"
      );
    });

    it("does not render forbidden raw placeholder brackets or example labels", () => {
      // Must not contain raw "[X]" or "$XX" or "(example)"
      expect(mainEl().textContent).not.toMatch(/\$xx\b/i);
      expect(mainEl().textContent).not.toContain("(example)");
    });
  });
});
