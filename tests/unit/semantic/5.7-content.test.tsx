// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import AboutPage from "@/app/(shared)/about/page";
import FaqPage from "@/app/(shared)/faq/page";
import HelpPage from "@/app/(shared)/help/page";
import LabResultsPage from "@/app/(shared)/lab-results/page";
import SciencePage from "@/app/(shared)/science/page";
import ShippingReturnsPage from "@/app/(shared)/shipping-returns/page";
import HumanSubscribePage from "@/app/(human)/human/subscribe/page";
import PetSubscribePage from "@/app/(pet)/pet/subscribe/page";
import AccessibilityPage from "@/app/(shared)/legal/accessibility/page";
import NotFound from "@/app/not-found";
import { submitAccessibilityFeedback } from "@/app/(shared)/legal/accessibility/_components/actions";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { mockLabsProvider } from "@/lib/providers/mock/labs";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}));

vi.mock("@/app/(shared)/legal/accessibility/_components/actions", () => ({
  submitAccessibilityFeedback: vi.fn().mockResolvedValue({ status: "success" }),
}));

describe("5.7 Semantic Elements: Conteúdo e páginas de apoio", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("About renders the listed line links and shop actions", async () => {
    render(await AboutPage());
    expect(
      screen.getByRole("link", { name: /shop the human line/i })
    ).toBeDefined();
    expect(screen.getByRole("link", { name: /shop for pets/i })).toBeDefined();
    expect(
      screen.getByRole("link", { name: /see our lab results/i })
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: /visit nadeon human/i })
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: /visit nadeon pet/i })
    ).toBeDefined();
    expect(screen.getByRole("link", { name: /^shop human$/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /^shop pet$/i })).toBeDefined();
  });

  it("FAQ renders the search, category tabs, contact, and tracking actions", () => {
    render(<FaqPage />);
    expect(
      screen.getByRole("searchbox", { name: /search questions/i })
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Search" })).toBeDefined();
    for (const category of [
      "Products",
      "Orders & Shipping",
      "Subscriptions",
      "Pets",
      "Quality",
    ]) {
      expect(
        screen.getByRole("tab", { name: new RegExp(category, "i") })
      ).toBeDefined();
    }
    expect(
      screen.getAllByRole("link", { name: /contact us/i })[0]
    ).toBeDefined();
    expect(
      screen.getAllByRole("link", { name: /track an order/i })[0]
    ).toBeDefined();
  });

  it("Help renders labeled contact and order fields with actions", () => {
    render(<HelpPage />);
    for (const name of [
      "Name",
      "Order number (optional)",
      "Topic",
      "Message",
    ]) {
      const role = name === "Topic" ? "combobox" : "textbox";
      expect(screen.getByRole(role, { name })).toBeDefined();
    }
    expect(screen.getAllByRole("textbox", { name: "Email" })).toHaveLength(2);
    expect(
      screen.getByRole("checkbox", { name: "Send me a copy of this message" })
    ).toBeDefined();
    expect(screen.getByRole("textbox", { name: "Order number" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Track order" })).toBeDefined();
    expect(
      screen.getAllByRole("link", { name: /contact us/i })[0]
    ).toBeDefined();
    expect(
      screen.getAllByRole("link", { name: /track your order/i })[0]
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDefined();
  });

  it("Lab Results renders the disabled lot lookup, filters, and load action", async () => {
    vi.spyOn(mockLabsProvider, "listLots").mockResolvedValue([]);
    vi.spyOn(mockCatalogProvider, "getProducts");
    render(await LabResultsPage({ searchParams: Promise.resolve({}) }));
    expect(
      screen
        .getByRole("textbox", { name: "Lot number" })
        .hasAttribute("disabled")
    ).toBe(true);
    expect(
      screen
        .getByRole("button", { name: "Find my lot" })
        .hasAttribute("disabled")
    ).toBe(true);
    for (const label of ["All", "Human", "Pet"]) {
      expect(screen.getByRole("button", { name: label })).toBeDefined();
    }
    expect(
      screen
        .getByRole("button", { name: "Load more lots" })
        .hasAttribute("disabled")
    ).toBe(true);
    expect(screen.getByRole("link", { name: /how we make it/i })).toBeDefined();
    expect(
      screen.getAllByRole("link", { name: /^contact us$/i })[0]
    ).toBeDefined();
  });

  it("Science renders the listed formula, lab, ingredient, and comparison links", async () => {
    render(await SciencePage());
    for (const name of [
      "Shop NMN formulas",
      "See lab results",
      "Shop by ingredient",
      "Compare formulas",
    ]) {
      expect(
        screen.getAllByRole("link", { name: new RegExp(name, "i") })[0]
      ).toBeDefined();
    }
  });

  it("Pet and Human Subscribe pages render their primary actions", async () => {
    render(await PetSubscribePage());
    expect(
      screen.getAllByRole("link", { name: /build a subscription/i })[0]
    ).toBeDefined();
    expect(screen.getByRole("link", { name: /how it works/i })).toBeDefined();
    for (const action of [
      "Skip next",
      "Pause",
      "Change date",
      "Swap product",
      "Cancel subscription",
    ]) {
      expect(
        screen.getAllByRole("button", { name: new RegExp(action, "i") })[0]
      ).toBeDefined();
    }

    cleanup();
    render(await HumanSubscribePage());
    expect(
      screen.getAllByRole("link", { name: /build your box/i })[0]
    ).toBeDefined();
    expect(screen.getByRole("link", { name: /how it works/i })).toBeDefined();
  });

  it("Shipping & Returns renders anchors and order/subscription actions", async () => {
    render(await ShippingReturnsPage());
    for (const name of [
      "Rates and times",
      "Tracking",
      "Subscriptions",
      "Returns",
      "Damaged orders",
      "FAQ",
    ]) {
      expect(
        screen.getAllByRole("link", { name: new RegExp(`^${name}$`, "i") })[0]
      ).toBeDefined();
    }
    for (const name of [
      "Track your order",
      "Manage subscription",
      "Start a return",
      "Report a problem",
    ]) {
      expect(
        screen.getAllByRole("link", { name: new RegExp(`^${name}$`, "i") })[0]
      ).toBeDefined();
    }
  });

  it("404 renders the listed category, quiz, and help shortcuts", () => {
    render(<NotFound />);
    for (const name of [
      "Back to Pet home",
      "Shop dog chews",
      "Shop Human",
      "BioHack",
      "Science",
      "Take the quiz",
      "Help center",
    ]) {
      expect(
        screen.getAllByRole("link", { name: new RegExp(name, "i") })[0]
      ).toBeDefined();
    }
  });

  it("Accessibility statement submits the labeled feedback form and confirms success", async () => {
    render(<AccessibilityPage />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Taylor" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "taylor@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Describe the issue"), {
      target: { value: "Contrast issue on shop link." },
    });
    const form = screen
      .getByRole("button", { name: "Send feedback" })
      .closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    await waitFor(() =>
      expect(submitAccessibilityFeedback).toHaveBeenCalledOnce()
    );
    expect(
      await screen.findByRole("heading", { name: "Feedback received" })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Send another report" })
    ).toBeDefined();
  });

  it.todo(
    "Journal Human/Pet and Journal category/article pages are not implemented in this branch yet"
  );
  it.todo("Our Experts page is not implemented in this branch yet");
  it.todo(
    "Legal tabs and Do Not Sell pages are not fully implemented in this branch yet"
  );
  it.todo("Breed guide pages are not implemented in this branch yet");
  it.todo(
    "Reviews page is not implemented for launch; review submission belongs to growth wave C"
  );
  it.todo(
    "Rewards and wholesale pages are growth wave D/C and are not implemented in this branch yet"
  );
  it.todo("Where to buy page is not implemented in this branch yet");
});
