// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import EntrancePage, { metadata } from "@/app/(shared)/page";

describe("W2-01 Route: Entrada (Entrance Page `/`)", () => {
  beforeEach(() => {
    // Clear cookies before each test
    if (typeof document !== "undefined") {
      document.cookie =
        "nadeon_theme=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "theme=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  });

  afterEach(() => {
    cleanup();
  });

  it("exports valid SEO metadata with canonical path `/`", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toMatch(/Nadeon Labs/i);
    expect(metadata.description).toBeDefined();
    expect(metadata.alternates?.canonical).toBe("https://nadeonlabs.com/");
  });

  it("renders the entrance page structure and brand header", async () => {
    const pageJsx = await EntrancePage();
    render(pageJsx);

    // Banner / Logo header
    const header = screen.getByRole("banner");
    expect(header).toBeDefined();
    const homeLink = screen.getByRole("link", {
      name: /nadeon labs homepage/i,
    });
    expect(homeLink).toBeDefined();
    expect(homeLink.getAttribute("href")).toBe("/");

    // Global FDA disclaimer footer
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeDefined();
    expect(footer.textContent).toContain(
      "*These statements have not been evaluated by the Food and Drug Administration"
    );
  });

  it("renders the Human section with heading, tag, claim, and products", async () => {
    const pageJsx = await EntrancePage();
    render(pageJsx);

    // Headings and tags
    expect(screen.getByText("FOR YOU")).toBeDefined();
    const humanHeading = screen.getByRole("heading", {
      level: 1,
      name: "Human",
    });
    expect(humanHeading).toBeDefined();

    // Benefit claim
    expect(screen.getByText(/NMN and NAD/i)).toBeDefined();

    // Human products from catalog
    expect(screen.getAllByText("BioHack").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Full Charge").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Renew").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NMN 500 mg").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NMN 4-in-1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NAD+ + Resveratrol").length).toBeGreaterThan(0);
  });

  it("renders the Pet section with heading, tag, claim, and products", async () => {
    const pageJsx = await EntrancePage();
    render(pageJsx);

    // Headings and tags
    expect(screen.getByText("FOR YOUR PACK")).toBeDefined();
    const petHeading = screen.getByRole("heading", { level: 2, name: "Pet" });
    expect(petHeading).toBeDefined();

    // Benefit claim
    expect(
      screen.getByText(
        /NMN soft chews, oils and drops for dogs, cats and horses\.\*/i
      )
    ).toBeDefined();

    // Pet products from catalog
    expect(screen.getAllByText("More Good Years").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Golden Years").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Still Sharp").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Senior · NMN 75 mg").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Joints · NMN 50 mg").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Calm · NMN 50 mg").length).toBeGreaterThan(0);
  });

  it("renders semantic navigation links for Buy Human and Buy Pet with min 44px touch targets", async () => {
    const pageJsx = await EntrancePage();
    render(pageJsx);

    // Semantic HTML navigation element <a> (Rule 5)
    const buyHumanLink = screen.getByRole("link", { name: /buy human/i });
    expect(buyHumanLink).toBeDefined();
    expect(buyHumanLink.getAttribute("href")).toBe("/human");
    expect(buyHumanLink.className).toContain("min-h-[44px]");
    expect(buyHumanLink.className).toContain("min-w-[44px]");

    const buyPetLink = screen.getByRole("link", { name: /buy pet/i });
    expect(buyPetLink).toBeDefined();
    expect(buyPetLink.getAttribute("href")).toBe("/pet");
    expect(buyPetLink.className).toContain("min-h-[44px]");
    expect(buyPetLink.className).toContain("min-w-[44px]");
  });

  it("sets line cookies when Buy Human is clicked", async () => {
    const pageJsx = await EntrancePage();
    render(pageJsx);

    const buyHumanLink = screen.getByRole("link", { name: /buy human/i });
    fireEvent(
      buyHumanLink,
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );

    expect(document.cookie).toContain("nadeon_theme=human");
    expect(document.cookie).toContain("theme=human");
  });

  it("sets line cookies when Buy Pet is clicked", async () => {
    const pageJsx = await EntrancePage();
    render(pageJsx);

    const buyPetLink = screen.getByRole("link", { name: /buy pet/i });
    fireEvent(
      buyPetLink,
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );

    expect(document.cookie).toContain("nadeon_theme=pet");
    expect(document.cookie).toContain("theme=pet");
  });

  it("includes Organization JSON-LD script for SEO", async () => {
    const pageJsx = await EntrancePage();
    const { container } = render(pageJsx);

    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).not.toBeNull();
    const json = JSON.parse(script!.textContent || "{}");
    expect(json["@type"]).toBe("Organization");
    expect(json.name).toBe("Nadeon Labs");
  });
});
