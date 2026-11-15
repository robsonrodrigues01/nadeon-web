// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import TrackOrderPage, { generateMetadata } from "@/app/(shared)/track/page";
import { TrackOrderSchema } from "@/app/(shared)/track/_components/schema";
import { lookupOrder } from "@/app/(shared)/track/_components/actions";

describe("W2-18: /track route", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe("metadata", () => {
    it("builds metadata with noindex for the lookup page", async () => {
      const metadata = await generateMetadata();
      expect(metadata.title).toContain("Nadeon Labs");
      expect(metadata.robots).toMatchObject({ index: false });
    });
  });

  describe("order number and email validation", () => {
    it("accepts NL- followed by six digits, in any letter case", () => {
      expect(
        TrackOrderSchema.safeParse({
          orderNumber: "NL-100234",
          email: "guest@example.com",
        }).success
      ).toBe(true);
      expect(
        TrackOrderSchema.safeParse({
          orderNumber: " nl-100234 ",
          email: "guest@example.com",
        }).success
      ).toBe(true);
    });

    it("rejects order numbers without the NL- prefix or with other digit counts", () => {
      for (const orderNumber of [
        "100234",
        "NL-1002",
        "NL-1002345",
        "AB-100234",
      ]) {
        expect(
          TrackOrderSchema.safeParse({ orderNumber, email: "a@b.co" }).success
        ).toBe(false);
      }
    });

    it("rejects an invalid email", () => {
      expect(
        TrackOrderSchema.safeParse({
          orderNumber: "NL-100234",
          email: "not-an-email",
        }).success
      ).toBe(false);
    });

    it("server action accepts form data without throwing", async () => {
      const data = new FormData();
      data.set("orderNumber", "NL-100234");
      data.set("email", "guest@example.com");
      await expect(lookupOrder(data)).resolves.toBeNull();
    });
  });

  describe("rendered page (state A, lookup form)", () => {
    async function renderPage() {
      const jsx = await TrackOrderPage();
      return render(jsx);
    }

    it("renders the main landmark and the page heading", async () => {
      const { container } = await renderPage();
      expect(container.querySelector("main#main-content")).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 1, name: "Track your order" })
      ).toBeTruthy();
    });

    it("renders the breadcrumb with the current page marked", async () => {
      await renderPage();
      const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
      expect(nav).toBeTruthy();
      expect(
        screen.getByRole("link", { name: "Help" }).getAttribute("href")
      ).toBe("/help");
      expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe(
        "Track your order"
      );
    });

    it("renders the order number field with a label and required validation", async () => {
      await renderPage();
      const field = screen.getByLabelText("Order number");
      expect(field.tagName).toBe("INPUT");
      expect(field.getAttribute("name")).toBe("orderNumber");
      expect(field.hasAttribute("required")).toBe(true);
      expect(field.getAttribute("aria-describedby")).toBe("order-number-hint");
      expect(
        screen.getByText("Starts with NL, found in your confirmation email.")
      ).toBeTruthy();
    });

    it("renders the email field as an email input with a label", async () => {
      await renderPage();
      const field = screen.getByLabelText("Email");
      expect(field.tagName).toBe("INPUT");
      expect(field.getAttribute("type")).toBe("email");
      expect(field.getAttribute("name")).toBe("email");
      expect(field.hasAttribute("required")).toBe(true);
    });

    it("renders the Track order submit button", async () => {
      await renderPage();
      const button = screen.getByRole("button", { name: "Track order" });
      expect(button.tagName).toBe("BUTTON");
      expect(button.getAttribute("type")).toBe("submit");
    });

    it("renders the sign-in link as a navigation link", async () => {
      await renderPage();
      const link = screen.getByRole("link", {
        name: "Sign in to see all orders →",
      });
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBeTruthy();
    });

    it("renders the four help links from the design", async () => {
      await renderPage();
      expect(
        screen.getByRole("heading", { level: 2, name: "Popular help links" })
      ).toBeTruthy();
      expect(
        screen
          .getByRole("link", { name: /Shipping & returns/ })
          .getAttribute("href")
      ).toBe("/shipping-returns");
      expect(
        screen.getByRole("link", { name: /Lab results/ }).getAttribute("href")
      ).toBe("/lab-results");
      expect(
        within(document.querySelector("main") as HTMLElement)
          .getByRole("link", { name: /FAQ/ })
          .getAttribute("href")
      ).toBe("/faq");
    });

    it("renders no design placeholders in the text", async () => {
      const { container } = await renderPage();
      expect(container.textContent).not.toMatch(/\[X\]|\$XX|\(example\)/);
    });
  });
});
