// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, within } from "@testing-library/react";

const sendContact = vi.fn();

vi.mock("@/lib/providers", () => ({
  formsProvider: { sendContact: (...args: unknown[]) => sendContact(...args) },
}));

import HelpPage, { metadata } from "@/app/(shared)/help/page";
import {
  lookupOrder,
  sendContactMessage,
} from "@/app/(shared)/help/_components/actions";

function mainEl(): HTMLElement {
  return document.querySelector("main") as HTMLElement;
}

function formData(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

describe("W2-27: /help route", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    sendContact.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe("metadata", () => {
    it("exports SEO metadata with canonical path /help", () => {
      expect(metadata.title).toContain("Nadeon Labs");
      expect(metadata.alternates?.canonical).toBe(
        "https://nadeonlabs.com/help"
      );
    });
  });

  describe("page structure", () => {
    beforeEach(() => {
      render(<HelpPage />);
    });

    it("has one h1 with the design heading", () => {
      expect(
        within(mainEl()).getByRole("heading", {
          level: 1,
          name: "How can we help?",
        })
      ).toBeDefined();
    });

    it("exposes the two anchor links as navigation links", () => {
      const contact = within(mainEl()).getByRole("link", {
        name: "Contact us",
      });
      const track = within(mainEl()).getByRole("link", {
        name: "Track your order",
      });
      expect(contact.getAttribute("href")).toBe("#contact");
      expect(track.getAttribute("href")).toBe("#track");
    });

    it("links the anchors to real sections", () => {
      expect(mainEl().querySelector("#contact")).not.toBeNull();
      expect(mainEl().querySelector("#track")).not.toBeNull();
    });

    it("renders popular help links as anchors", () => {
      expect(
        within(mainEl())
          .getByRole("link", { name: /Shipping & returns/ })
          .getAttribute("href")
      ).toBe("/shipping-returns");
      expect(
        within(mainEl()).getByRole("link", { name: /Manage subscription/ })
      ).toBeDefined();
      expect(
        within(mainEl()).getByRole("link", { name: /Lab results/ })
      ).toBeDefined();
      expect(
        within(mainEl())
          .getByRole("link", { name: /^FAQ.*Quick answers/ })
          .getAttribute("href")
      ).toBe("/faq");
    });

    it("renders Report a problem as a link, not a button", () => {
      expect(
        within(mainEl())
          .getByRole("link", { name: "Report a problem" })
          .getAttribute("href")
      ).toBe("#contact");
    });

    it("keeps placeholder markers out of the visible text", () => {
      const text = mainEl().textContent ?? "";
      expect(text).not.toMatch(/\(example\)/i);
      expect(text).not.toMatch(/\[X\]|\$XX/);
    });

    it("has no price or currency text", () => {
      expect(mainEl().textContent ?? "").not.toMatch(/\$\d/);
    });
  });

  describe("contact form fields", () => {
    beforeEach(() => {
      render(<HelpPage />);
    });

    it("labels the name, email, order and message inputs", () => {
      expect(within(mainEl()).getByLabelText("Name").tagName).toBe("INPUT");
      expect(
        within(mainEl()).getByLabelText("Email", { selector: "#contact-email" })
      ).toBeDefined();
      expect(
        within(mainEl()).getByLabelText("Order number (optional)").tagName
      ).toBe("INPUT");
      expect(within(mainEl()).getByLabelText("Message").tagName).toBe(
        "TEXTAREA"
      );
    });

    it("uses a select labelled Topic with the catalog topics", () => {
      const topic = within(mainEl()).getByLabelText("Topic");
      expect(topic.tagName).toBe("SELECT");
      const options = within(topic)
        .getAllByRole("option")
        .map((o) => o.textContent);
      expect(options).toEqual([
        "Choose a topic",
        "Products",
        "Orders & Shipping",
        "Subscriptions",
        "Pets",
        "Quality",
      ]);
    });

    it("renders the Send me a copy checkbox", () => {
      const copy = within(mainEl()).getByRole("checkbox", {
        name: "Send me a copy of this message",
      });
      expect(copy.tagName).toBe("INPUT");
    });

    it("renders Send message as a submit button", () => {
      const button = within(mainEl()).getByRole("button", {
        name: "Send message",
      });
      expect(button.tagName).toBe("BUTTON");
      expect(button.getAttribute("type")).toBe("submit");
    });
  });

  describe("track form fields", () => {
    beforeEach(() => {
      render(<HelpPage />);
    });

    it("labels the order number and email inputs in the track section", () => {
      const track = document.getElementById("track") as HTMLElement;
      expect(within(track).getByLabelText("Order number").tagName).toBe(
        "INPUT"
      );
      expect(within(track).getByLabelText("Email").tagName).toBe("INPUT");
    });

    it("renders Track order as a submit button", () => {
      const button = within(mainEl()).getByRole("button", {
        name: "Track order",
      });
      expect(button.tagName).toBe("BUTTON");
      expect(button.getAttribute("type")).toBe("submit");
    });
  });

  describe("contact action", () => {
    const valid = {
      name: "Ana",
      email: "ana@example.com",
      topic: "Products",
      message: "Hello",
    };

    it("returns invalid without calling the provider when fields are missing", async () => {
      const result = await sendContactMessage(
        { status: "idle" },
        formData({ name: "", email: "bad", topic: "", message: "" })
      );
      expect(result).toEqual({ status: "invalid" });
      expect(sendContact).not.toHaveBeenCalled();
    });

    it("sends valid input through formsProvider and reports sent", async () => {
      sendContact.mockResolvedValue({ success: true, id: "c1" });
      const result = await sendContactMessage(
        { status: "idle" },
        formData({ ...valid, orderNumber: "" })
      );
      expect(result).toEqual({ status: "sent" });
      expect(sendContact).toHaveBeenCalledWith({
        ...valid,
        orderNumber: undefined,
      });
    });

    it("reports error when the provider throws", async () => {
      sendContact.mockRejectedValue(new Error("down"));
      const result = await sendContactMessage(
        { status: "idle" },
        formData(valid)
      );
      expect(result).toEqual({ status: "error" });
    });
  });

  describe("track action", () => {
    it("rejects an order number outside NL-000000", async () => {
      const result = await lookupOrder(
        { status: "idle" },
        formData({ orderNumber: "XX-1", email: "ana@example.com" })
      );
      expect(result).toEqual({ status: "invalid" });
    });

    it("accepts a valid order number and email, reporting pending", async () => {
      const result = await lookupOrder(
        { status: "idle" },
        formData({ orderNumber: "nl-100234", email: "ana@example.com" })
      );
      expect(result).toEqual({ status: "pending" });
    });
  });
});
