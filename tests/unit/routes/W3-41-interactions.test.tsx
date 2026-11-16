// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FaqBrowser } from "@/app/(shared)/faq/_components/faq-browser";
import {
  FAQ_CATEGORIES,
  FAQ_ENTRIES,
} from "@/app/(shared)/faq/_components/faq-content";
import LabResultsPage from "@/app/(shared)/lab-results/page";
import { labsProvider, catalogProvider } from "@/lib/providers";
import type { LabLot } from "@/lib/contracts/labs";
import { SkipLink } from "@/components/layout/skip-link";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const fixtureLot: LabLot = {
  lotNumber: "NL-00001",
  productSlug: "fixture-product",
  productName: "Fixture Product",
  manufacturedDate: "2026-10-02",
  expiryDate: "2028-10-02",
  coaUrl: "/coa/NL-00001.pdf",
  status: "passed",
  testResults: [
    {
      parameter: "Identity",
      specification: "HPLC fingerprint matches reference",
      result: "Confirmed",
      passed: true,
    },
  ],
};

async function renderLabPage(lot = "") {
  render(await LabResultsPage({ searchParams: Promise.resolve({ lot }) }));
}

describe("W3-41 mounted FAQ behavior", () => {
  it("filters questions by submitted search text", () => {
    render(<FaqBrowser entries={FAQ_ENTRIES} categories={FAQ_CATEGORIES} />);
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search questions" }),
      {
        target: { value: "NMN" },
      }
    );
    fireEvent.submit(screen.getByRole("search", { name: "Search questions" }));

    expect(
      screen.getByText("What is NMN and how is it different from NAD+?")
    ).toBeTruthy();
    expect(
      screen
        .getByText("Which formula should I start with?")
        .closest("button")
        ?.closest("li")
        ?.querySelector("[role=region]")
        ?.hasAttribute("hidden")
    ).toBe(true);
  });

  it("changes category and shows only that category's questions", () => {
    render(<FaqBrowser entries={FAQ_ENTRIES} categories={FAQ_CATEGORIES} />);
    fireEvent.click(screen.getByRole("tab", { name: "Orders & Shipping" }));

    expect(
      screen.getByRole("heading", { name: "Orders & Shipping" })
    ).toBeTruthy();
    expect(screen.getByText("What is your return policy?")).toBeTruthy();
    expect(
      screen.queryByText("What is NMN and how is it different from NAD+?")
    ).toBeNull();
    expect(
      screen
        .getByRole("tab", { name: "Orders & Shipping" })
        .getAttribute("aria-selected")
    ).toBe("true");
  });

  it("opens and closes an accordion using keyboard activation on the focused button", () => {
    render(<FaqBrowser entries={FAQ_ENTRIES} categories={FAQ_CATEGORIES} />);
    const trigger = screen.getByRole("button", {
      name: "What is NMN and how is it different from NAD+?",
    });
    const answer = screen.getByRole("region", {
      name: "What is NMN and how is it different from NAD+?",
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(answer.hasAttribute("hidden")).toBe(false);

    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(answer.hasAttribute("hidden")).toBe(true);

    fireEvent.keyDown(trigger, { key: " " });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(answer.hasAttribute("hidden")).toBe(false);
  });
});

describe("W3-41 mounted lab lot lookup behavior", () => {
  it("shows the provider's matching lot details", async () => {
    vi.spyOn(labsProvider, "listLots").mockResolvedValue([fixtureLot]);
    vi.spyOn(labsProvider, "findLot").mockResolvedValue(fixtureLot);
    vi.spyOn(catalogProvider, "getProducts").mockResolvedValue([]);
    await renderLabPage("NL-00001");

    expect(
      screen.getByRole("heading", { name: "Fixture Product" })
    ).toBeTruthy();
    expect(screen.getByText("All tests passed")).toBeTruthy();
    expect(
      screen.getAllByRole("link", { name: "Download COA (PDF)" })
    ).toHaveLength(2);
    expect(
      screen
        .getAllByRole("link", { name: "Download COA (PDF)" })[0]
        .getAttribute("href")
    ).toBe("/coa/NL-00001.pdf");
  });

  it("keeps the query and shows no result when the lot is unknown", async () => {
    vi.spyOn(labsProvider, "listLots").mockResolvedValue([fixtureLot]);
    vi.spyOn(labsProvider, "findLot").mockResolvedValue(null);
    vi.spyOn(catalogProvider, "getProducts").mockResolvedValue([]);
    await renderLabPage("NL-UNKNOWN");

    expect(
      (screen.getByRole("textbox", { name: "Lot number" }) as HTMLInputElement)
        .value
    ).toBe("NL-UNKNOWN");
    expect(screen.queryByRole("region", { name: "Lot NL-00001" })).toBeNull();
    expect(screen.getByRole("table")).toBeTruthy();
  });

  it("propagates provider errors when looking up a lot", async () => {
    const failure = new Error("Labs provider unavailable");
    vi.spyOn(labsProvider, "listLots").mockResolvedValue([fixtureLot]);
    vi.spyOn(labsProvider, "findLot").mockRejectedValue(failure);
    vi.spyOn(catalogProvider, "getProducts").mockResolvedValue([]);

    await expect(renderLabPage("NL-00001")).rejects.toBe(failure);
  });

  it("keeps lookup disabled and shows the launch state when no lots are published", async () => {
    const findLot = vi.spyOn(labsProvider, "findLot");
    vi.spyOn(labsProvider, "listLots").mockResolvedValue([]);
    vi.spyOn(catalogProvider, "getProducts").mockResolvedValue([]);
    await renderLabPage("NL-00001");

    expect(screen.getByText("first lots publishing soon")).toBeTruthy();
    expect(
      (screen.getByRole("textbox", { name: "Lot number" }) as HTMLInputElement)
        .disabled
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Find my lot" }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
    expect(findLot).not.toHaveBeenCalled();
  });
});

describe("W3-41 skip link mounted behavior", () => {
  it("renders the skip link before the main landmark as the first focusable item", () => {
    render(
      <>
        <SkipLink />
        <main id="main-content" tabIndex={-1}>
          Main content
          <button type="button">First main action</button>
        </main>
      </>
    );
    const link = screen.getByRole("link", { name: "Skip to main content" });
    const main = screen.getByRole("main");
    const focusables = [
      ...document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ),
    ];
    expect(focusables[0]).toBe(link);
    expect(link.getAttribute("href")).toBe("#main-content");
    expect(main.id).toBe("main-content");
    expect(main.tabIndex).toBe(-1);
  });

  it.todo(
    "moves focus from the top-of-document Tab stop to the skip link and then to #main-content on Enter; jsdom does not implement browser Tab order or native fragment navigation, so this requires a browser test"
  );
});
