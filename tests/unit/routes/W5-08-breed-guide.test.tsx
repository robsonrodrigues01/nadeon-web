// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import BreedGuidePage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(pet)/pet/breeds/[raca]/page";
import { cartProvider } from "@/lib/providers/client";

// Mock notFound
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

describe("W5-08 /pet/breeds/[raca] Route & Semantic Controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("exports valid metadata and static params for breed guide", async () => {
    const params = Promise.resolve({ raca: "labrador-retriever" });
    const meta = await generateMetadata({ params });
    expect(JSON.stringify(meta.title)).toMatch(/labrador retriever/i);

    const staticParams = await generateStaticParams();
    expect(staticParams).toEqual(
      expect.arrayContaining([{ raca: "labrador-retriever" }])
    );
  });

  it("triggers notFound for unknown breed slug", async () => {
    const params = Promise.resolve({ raca: "non-existent-breed" });
    await expect(BreedGuidePage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders page with semantic hero, breadcrumbs, facts, and TOC", async () => {
    const params = Promise.resolve({ raca: "labrador-retriever" });
    const page = await BreedGuidePage({ params });
    render(page);

    // H1 Heading
    expect(
      screen.getByRole("heading", { level: 1, name: /labrador retriever/i })
    ).toBeDefined();

    // Breadcrumbs
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeDefined();
    expect(nav.textContent).toContain("Pet");
    expect(nav.textContent).toContain("Breed guides");
    expect(nav.textContent).toContain("Labrador Retriever");

    // Breed facts heading & items
    expect(
      screen.getByRole("heading", { level: 2, name: /breed facts/i })
    ).toBeDefined();
    expect(screen.getByText(/^size$/i)).toBeDefined();
    expect(screen.getByText(/^weight range$/i)).toBeDefined();

    // Facts are unconfirmed in provider and MUST show 'To be confirmed'
    const unconfirmedElements = screen.getAllByText(/to be confirmed/i);
    expect(unconfirmedElements.length).toBeGreaterThan(0);

    // Table of contents navigation
    expect(
      screen.getByRole("navigation", { name: /in this guide/i })
    ).toBeDefined();
  });

  it("renders Section 5 required buttons: Take the quiz, All breed guides, Shop all for dogs, Add kit to cart", async () => {
    const params = Promise.resolve({ raca: "labrador-retriever" });
    const page = await BreedGuidePage({ params });
    render(page);

    // Take the quiz (links to /pet/quiz)
    const quizLinks = screen.getAllByRole("link", {
      name: /take the (60-second )?quiz/i,
    });
    expect(quizLinks.length).toBeGreaterThan(0);
    expect(quizLinks[0].getAttribute("href")).toBe("/pet/quiz");

    // All breed guides (links to /pet/dogs)
    const allBreedsLink = screen.getByRole("link", {
      name: /all breed guides/i,
    });
    expect(allBreedsLink.getAttribute("href")).toBe("/pet/dogs");

    // Shop all for dogs (links to /pet/dogs)
    const shopDogsLink = screen.getByRole("link", {
      name: /shop all for dogs/i,
    });
    expect(shopDogsLink.getAttribute("href")).toBe("/pet/dogs");

    // Add kit to cart
    const addKitBtn = screen.getByRole("button", { name: /add kit to cart/i });
    expect(addKitBtn).toBeDefined();
  });

  it("adds kit to cart when clicking 'Add kit to cart'", async () => {
    const addKitSpy = vi
      .spyOn(cartProvider, "addKit")
      .mockResolvedValue({} as never);
    const params = Promise.resolve({ raca: "labrador-retriever" });
    const page = await BreedGuidePage({ params });
    render(page);

    const addKitBtn = screen.getByRole("button", { name: /add kit to cart/i });
    fireEvent.click(addKitBtn);

    expect(addKitSpy).toHaveBeenCalledTimes(1);
  });

  it("ensures related breed links point only to existing routes and not unbuilt breed guides", async () => {
    const params = Promise.resolve({ raca: "labrador-retriever" });
    const page = await BreedGuidePage({ params });
    render(page);

    const relatedLinks = screen.getAllByRole("link", { name: /breed guide/i });
    for (const link of relatedLinks) {
      const href = link.getAttribute("href");
      // Must not link to unbuilt routes like /pet/breeds/golden-retriever or french-bulldog
      if (href?.startsWith("/pet/breeds/")) {
        expect(href).toBe("/pet/breeds/labrador-retriever");
      }
    }
  });

  it("renders all 6 guide sections and FAQ questions", async () => {
    const params = Promise.resolve({ raca: "labrador-retriever" });
    const page = await BreedGuidePage({ params });
    render(page);

    expect(
      screen.getByRole("heading", { level: 2, name: /about the breed/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /health topics by life stage/i,
      })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: /weight & exercise/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: /nutrition notes/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: /supplement guide/i })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: /when to see your vet/i })
    ).toBeDefined();

    expect(screen.getByText(/labrador questions/i)).toBeDefined();
  });
});
