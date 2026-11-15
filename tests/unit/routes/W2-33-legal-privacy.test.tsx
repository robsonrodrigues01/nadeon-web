// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, within } from "@testing-library/react";

import PrivacyPage, { metadata } from "@/app/(shared)/legal/privacy/page";

function mainEl(): HTMLElement {
  return (document.querySelector("main") || document.body) as HTMLElement;
}

describe("W2-33: /legal/privacy route", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe("metadata", () => {
    it("exports SEO metadata with canonical path /legal/privacy", () => {
      expect(metadata.title).toContain("Privacy Policy");
      expect(metadata.title).toContain("Nadeon");
      expect(metadata.alternates?.canonical).toBe(
        "https://nadeonlabs.com/legal/privacy"
      );
    });
  });

  describe("page structure and hero", () => {
    beforeEach(() => {
      render(<PrivacyPage />);
    });

    it("has one h1 with Privacy Policy", () => {
      const heading = within(mainEl()).getByRole("heading", {
        level: 1,
        name: "Privacy Policy",
      });
      expect(heading).toBeDefined();
    });

    it("displays breadcrumb navigation", () => {
      const breadcrumb = within(mainEl()).getByLabelText(/breadcrumb/i);
      expect(breadcrumb).toBeDefined();
      expect(breadcrumb.textContent).toContain("Home");
      expect(breadcrumb.textContent).toContain("Legal");
      expect(breadcrumb.textContent).toContain("Privacy Policy");
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

      const termsLink = within(pillsNav).getByRole("link", {
        name: /terms of service/i,
      });
      expect(termsLink.getAttribute("href")).toBe("/legal/terms");

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
      render(<PrivacyPage />);
    });

    it("renders table of contents with anchor links", () => {
      const toc = within(mainEl()).getByRole("navigation", {
        name: /on this page/i,
      });
      expect(toc).toBeDefined();

      const links = within(toc).getAllByRole("link");
      expect(links.length).toBeGreaterThan(5);
    });

    it("renders US privacy rights section with CCPA/CPRA cards", () => {
      expect(mainEl().textContent).toContain("Right to know");
      expect(mainEl().textContent).toContain("Right to delete");
      expect(mainEl().textContent).toContain("Right to correct");
      expect(mainEl().textContent).toContain(
        "Right to opt out of sale or sharing"
      );
    });

    it("renders privacy request actions linking to /legal/do-not-sell", () => {
      const requestLinks = within(mainEl()).getAllByRole("link", {
        name: /privacy request|do not sell/i,
      });
      expect(requestLinks.length).toBeGreaterThan(0);
      expect(requestLinks[0].getAttribute("href")).toBe("/legal/do-not-sell");
    });

    it("renders cookies section mentioning essential and analytics cookies", () => {
      expect(mainEl().textContent).toContain("Cookies");
      expect(mainEl().textContent).toContain("Global Privacy Control");
    });

    it("renders contact details for Nadeon Labs", () => {
      expect(mainEl().textContent).toContain("Nadeon Labs");
      expect(mainEl().textContent).toContain(
        "1081 Paulison Ave, Suite 3B, Clifton, NJ 07011"
      );
    });

    it("does not render forbidden raw placeholder brackets or example labels", () => {
      expect(mainEl().textContent).not.toMatch(/\$xx\b/i);
      expect(mainEl().textContent).not.toContain("(example)");
    });
  });
});
