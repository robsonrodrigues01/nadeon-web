import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderToString } from "react-dom/server";

const sendContact = vi.fn();

vi.mock("@/lib/providers", () => ({
  formsProvider: {
    sendContact: (...args: unknown[]) => sendContact(...args),
  },
}));

import AccessibilityPage, {
  metadata,
} from "@/app/(shared)/legal/accessibility/page";
import { submitAccessibilityFeedback } from "@/app/(shared)/legal/accessibility/_components/actions";
import { FeedbackForm } from "@/app/(shared)/legal/accessibility/_components/feedback-form";
import {
  AccessibilityHero,
  AccessibilityContent,
  ACCESSIBILITY_SECTIONS,
  LEGAL_PAGES,
} from "@/app/(shared)/legal/accessibility/_components/accessibility-content";

function formData(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

describe("W2-35: /legal/accessibility route", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    sendContact.mockReset();
    sendContact.mockResolvedValue({
      success: true,
      id: "feedback_test123",
      message: "Message sent",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("metadata", () => {
    it("exports SEO metadata with canonical path /legal/accessibility", () => {
      expect(metadata.title).toContain("Accessibility Statement");
      expect(metadata.title).toContain("Nadeon Labs");
      expect(metadata.alternates?.canonical).toBe(
        "https://nadeonlabs.com/legal/accessibility"
      );
      expect(metadata.description).toBeDefined();
    });
  });

  describe("page structure and semantics", () => {
    it("renders page with hero, breadcrumb, 7 sections, and sidebar", () => {
      const html = renderToString(<AccessibilityPage />);

      // Main semantic landmark
      expect(html).toContain('id="main-content"');

      // Heading 1
      expect(html).toContain("<h1");
      expect(html).toContain("Accessibility statement</h1>");

      // Breadcrumb navigation
      expect(html).toContain('aria-label="Breadcrumb"');
      expect(html).toContain('href="/"');
      expect(html).toContain('href="/legal/terms"');

      // Table of contents anchors
      for (const sec of ACCESSIBILITY_SECTIONS) {
        expect(html).toContain(`href="#${sec.id}"`);
        expect(html).toContain(`id="${sec.id}"`);
        expect(html).toContain(sec.title);
      }

      // Legal pages in sidebar
      for (const page of LEGAL_PAGES) {
        expect(html).toContain(page.href);
      }
      expect(html).toContain("Shipping &amp; Returns");

      // Template callout banner
      expect(html).toContain("TEMPLATE");
      expect(html).toContain(
        "All text on this page is placeholder. Final statement to be reviewed after an accessibility audit."
      );

      // Section 2 standards and POUR
      expect(html).toContain("WCAG 2.2 AA");
      expect(html).toContain("Perceivable");
      expect(html).toContain("Operable");
      expect(html).toContain("Understandable");
      expect(html).toContain("Robust");

      // Section 3 measures (6 numbered points)
      expect(html).toContain("Keyboard navigation");
      expect(html).toContain("Text alternatives");
      expect(html).toContain("Color and contrast");
      expect(html).toContain("Forms and errors");
      expect(html).toContain("Motion and media");
      expect(html).toContain("Zoom and reflow");

      // Section 4 compatibility
      expect(html).toContain("Browsers");
      expect(html).toContain("Screen readers");
      expect(html).toContain("Devices");

      // Section 5 known limitations
      expect(html).toContain("Older PDF documents");
      expect(html).toContain("Under review");

      // Section 6 contact info
      expect(html).toContain("Tell us about a barrier");
      expect(html).toContain("Send feedback");

      // Section 7 alternative formats
      expect(html).toContain("Alternative formats");
    });

    it("renders hero component with active legal navigation pill", () => {
      const html = renderToString(<AccessibilityHero />);
      expect(html).toContain('aria-current="page"');
      expect(html).toContain("Accessibility Statement");
      expect(html).toContain("Last updated: To be confirmed");
      expect(html).toContain("Last reviewed: To be confirmed");
    });
  });

  describe("Passo 8 / Placeholders compliance", () => {
    it("replaces all raw bracketed placeholders with 'To be confirmed'", () => {
      const html = renderToString(<AccessibilityContent />);

      // Must not contain raw placeholders from design
      expect(html).not.toContain("[date placeholder]");
      expect(html).not.toContain("[Role]");
      expect(html).not.toContain("[Browser]");
      expect(html).not.toContain("[Screen reader]");
      expect(html).not.toContain("[accessibility email]");
      expect(html).not.toContain("[Toll-free number]");
      expect(html).not.toContain("[hours]");
      expect(html).not.toContain("[X]");
      expect(html).not.toContain("[XX]");
      expect(html).not.toContain("[Third-party widget]");
      expect(html).not.toContain("[Known issue]");
      expect(html).not.toContain("[Partially conforms / Conforms]");

      // Must contain 'To be confirmed'
      expect(html).toContain("To be confirmed");
    });
  });

  describe("feedback form and action", () => {
    it("renders semantic form with all required and optional fields", () => {
      const html = renderToString(<FeedbackForm />);

      expect(html).toContain('name="name"');
      expect(html).toContain('name="email"');
      expect(html).toContain('name="pageOrFeature"');
      expect(html).toContain('name="description"');
      expect(html).toContain('name="preferredReply"');
      expect(html).toContain('name="assistiveTech"');
      expect(html).toContain('type="submit"');
    });

    it("rejects submission when required fields are missing", async () => {
      const result = await submitAccessibilityFeedback(
        { status: "idle" },
        formData({
          name: "",
          email: "invalid-email",
          description: "",
        })
      );

      expect(result.status).toBe("invalid");
      expect(sendContact).not.toHaveBeenCalled();
    });

    it("submits valid barrier report through formsProvider", async () => {
      const result = await submitAccessibilityFeedback(
        { status: "idle" },
        formData({
          name: "Taylor Accessibility",
          email: "taylor@example.com",
          pageOrFeature: "/human/quiz",
          description: "Focus outline not visible on quiz step 3 radio buttons",
          preferredReply: "Email",
          assistiveTech: "VoiceOver on macOS Safari",
        })
      );

      expect(result.status).toBe("success");
      expect(sendContact).toHaveBeenCalledTimes(1);
      expect(sendContact).toHaveBeenCalledWith({
        name: "Taylor Accessibility",
        email: "taylor@example.com",
        topic: "accessibility",
        message: expect.stringContaining("/human/quiz"),
      });
    });

    it("handles formsProvider failure gracefully", async () => {
      sendContact.mockResolvedValueOnce({
        success: false,
        id: "",
        message: "Service unavailable",
      });

      const result = await submitAccessibilityFeedback(
        { status: "idle" },
        formData({
          name: "Sam",
          email: "sam@example.com",
          description: "Contrast issue on footer links",
        })
      );

      expect(result.status).toBe("error");
      expect(result).toHaveProperty(
        "error",
        "Unable to submit feedback. Please try again."
      );
    });

    it("handles unexpected provider error exception", async () => {
      sendContact.mockRejectedValueOnce(new Error("Network connection lost"));

      const result = await submitAccessibilityFeedback(
        { status: "idle" },
        formData({
          name: "Sam",
          email: "sam@example.com",
          description: "Contrast issue on footer links",
        })
      );

      expect(result.status).toBe("error");
      expect(result).toHaveProperty(
        "error",
        "Unable to submit feedback. Please try again."
      );
    });
  });
});
