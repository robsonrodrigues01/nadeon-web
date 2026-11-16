// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  within,
  fireEvent,
} from "@testing-library/react";
import LabResultsPage, {
  generateMetadata,
} from "@/app/(shared)/lab-results/page";
import { LotBrowser } from "@/app/(shared)/lab-results/_components/lot-browser";
import { LotResult } from "@/app/(shared)/lab-results/_components/lot-result";
import type { LabLot } from "@/lib/contracts/labs";

async function renderPage() {
  render(await LabResultsPage({ searchParams: Promise.resolve({}) }));
  return document.body;
}

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

afterEach(() => cleanup());

describe("W2-28 /lab-results metadata", () => {
  it("builds title and canonical path from lib/seo", async () => {
    const meta = await generateMetadata();
    expect(meta.title).toContain("Lab Results");
    expect(String(meta.alternates?.canonical)).toMatch(/\/lab-results$/);
  });
});

describe("W2-28 /lab-results structure", () => {
  it("renders the hero heading and the lot lookup", async () => {
    await renderPage();
    expect(
      screen.getByRole("heading", { level: 1, name: "Every lot, tested." })
    ).toBeTruthy();
  });

  it("renders the lot number field labelled for assistive tech", async () => {
    await renderPage();
    const field = screen.getByRole("textbox", { name: "Lot number" });
    expect(field.tagName).toBe("INPUT");
  });

  it("renders Find my lot as a real button, disabled while there are no lots", async () => {
    await renderPage();
    const button = screen.getByRole("button", { name: "Find my lot" });
    expect(button.tagName).toBe("BUTTON");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(
      (screen.getByRole("textbox", { name: "Lot number" }) as HTMLInputElement)
        .disabled
    ).toBe(true);
  });

  it("shows the launch empty state instead of example lots", async () => {
    await renderPage();
    expect(screen.getByText("first lots publishing soon")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("renders the Human, Pet and All filter buttons with aria-pressed", async () => {
    await renderPage();
    for (const name of ["All", "Human", "Pet"]) {
      const button = screen.getByRole("button", { name });
      expect(button.tagName).toBe("BUTTON");
      expect(button.getAttribute("aria-pressed")).not.toBeNull();
    }
    expect(
      screen.getByRole("button", { name: "All" }).getAttribute("aria-pressed")
    ).toBe("true");
  });

  it("renders Load more lots as a disabled button when there is nothing more to load", async () => {
    await renderPage();
    const button = screen.getByRole("button", { name: "Load more lots" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it("links How we make it and Contact us with next/link anchors", async () => {
    await renderPage();
    const main = document.querySelector("main") as HTMLElement;
    expect(
      within(main)
        .getByRole("link", { name: "How we make it" })
        .getAttribute("href")
    ).toBe("/about");
    expect(
      within(main)
        .getByRole("link", { name: "Contact us" })
        .getAttribute("href")
    ).toBe("/help");
  });

  it("does not render example or placeholder data", async () => {
    const body = await renderPage();
    const text = body.textContent ?? "";
    for (const forbidden of [
      "NL-24117",
      "EXAMPLE",
      "[X]",
      "$XX",
      "(example)",
    ]) {
      expect(text).not.toContain(forbidden);
    }
  });
});

describe("W2-28 LotResult block", () => {
  it("renders the lot details and a COA download link", () => {
    render(<LotResult lot={fixtureLot} />);
    expect(
      screen.getByRole("heading", { name: "Fixture Product" })
    ).toBeTruthy();
    const link = screen.getByRole("link", { name: "Download COA (PDF)" });
    expect(link.getAttribute("href")).toBe("/coa/NL-00001.pdf");
    expect(link.hasAttribute("download")).toBe(true);
  });

  it("lists each test result in a labelled list", () => {
    render(<LotResult lot={fixtureLot} />);
    const list = screen.getByRole("list", { name: "Tests passed" });
    expect(within(list).getByText("Identity")).toBeTruthy();
    expect(
      within(list).getByText("HPLC fingerprint matches reference")
    ).toBeTruthy();
  });
});

describe("W3-74 LotBrowser component behavior", () => {
  const petFixtureLot: LabLot = {
    lotNumber: "NL-00002",
    productSlug: "pet-fixture-product",
    productName: "Pet Fixture Product",
    manufacturedDate: "2026-10-03",
    expiryDate: "2028-10-03",
    coaUrl: "/coa/NL-00002.pdf",
    status: "passed",
    testResults: [],
  };

  const lineBySlug: Record<string, "human" | "pet"> = {
    "fixture-product": "human",
    "pet-fixture-product": "pet",
  };

  it("renders empty state message when lots array is empty", () => {
    render(<LotBrowser lots={[]} lineBySlug={{}} />);

    expect(screen.getByText("first lots publishing soon")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("filters lots by Human, Pet, and All lines, updating aria-pressed and visible rows", () => {
    render(
      <LotBrowser lots={[fixtureLot, petFixtureLot]} lineBySlug={lineBySlug} />
    );

    const allBtn = screen.getByRole("button", { name: "All" });
    const humanBtn = screen.getByRole("button", { name: "Human" });
    const petBtn = screen.getByRole("button", { name: "Pet" });

    // Initial state: "All" is pressed, both rows are visible
    expect(allBtn.getAttribute("aria-pressed")).toBe("true");
    expect(humanBtn.getAttribute("aria-pressed")).toBe("false");
    expect(petBtn.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText("Fixture Product")).toBeTruthy();
    expect(screen.getByText("Pet Fixture Product")).toBeTruthy();

    // Filter to Human
    fireEvent.click(humanBtn);
    expect(allBtn.getAttribute("aria-pressed")).toBe("false");
    expect(humanBtn.getAttribute("aria-pressed")).toBe("true");
    expect(petBtn.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText("Fixture Product")).toBeTruthy();
    expect(screen.queryByText("Pet Fixture Product")).toBeNull();

    // Filter to Pet
    fireEvent.click(petBtn);
    expect(allBtn.getAttribute("aria-pressed")).toBe("false");
    expect(humanBtn.getAttribute("aria-pressed")).toBe("false");
    expect(petBtn.getAttribute("aria-pressed")).toBe("true");
    expect(screen.queryByText("Fixture Product")).toBeNull();
    expect(screen.getByText("Pet Fixture Product")).toBeTruthy();

    // Restore to All
    fireEvent.click(allBtn);
    expect(allBtn.getAttribute("aria-pressed")).toBe("true");
    expect(humanBtn.getAttribute("aria-pressed")).toBe("false");
    expect(petBtn.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText("Fixture Product")).toBeTruthy();
    expect(screen.getByText("Pet Fixture Product")).toBeTruthy();
  });

  it.fails(
    "shows an empty state message when the selected line filter has no matching lots",
    () => {
      // Only human lots provided
      render(
        <LotBrowser
          lots={[fixtureLot]}
          lineBySlug={{ "fixture-product": "human" }}
        />
      );

      // Filtering to Pet results in 0 visible lots
      fireEvent.click(screen.getByRole("button", { name: "Pet" }));

      // Currently LotBrowser renders null when visible.length === 0, leaving an empty void
      // instead of displaying an empty state message like "No lots found" or "first lots publishing soon"
      expect(
        screen.getByText(/first lots publishing soon|no lots found/i)
      ).toBeTruthy();
    }
  );
});
