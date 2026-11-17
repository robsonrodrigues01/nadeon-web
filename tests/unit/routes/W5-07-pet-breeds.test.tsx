// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import BreedIndexPage, { generateMetadata } from "@/app/(pet)/pet/breeds/page";
import { BreedBrowser } from "@/app/(pet)/pet/breeds/_components/breed-browser";
import type { BreedGuide, BreedIndex } from "@/lib/contracts/content";

const mockBreedIndex: BreedIndex = {
  title: "Care guides by breed",
  description: "To be confirmed",
  sizes: ["All sizes", "Small", "Medium", "Large", "Giant"],
  species: ["Dogs", "Cats"],
  sizeKey: "To be confirmed",
};

const mockBreedGuides: BreedGuide[] = [
  {
    slug: "labrador-retriever",
    title: "Labrador Retriever",
    description: "To be confirmed",
    readingMinutes: 9,
    facts: {
      size: "Large",
      weightRange: "To be confirmed",
      lifeExpectancy: "To be confirmed",
      energyLevel: "To be confirmed",
      group: "To be confirmed",
      coat: "To be confirmed",
    },
    sections: [
      {
        title: "About the breed",
        body: "To be confirmed",
      },
    ],
    reviewer: "To be confirmed",
  },
  {
    slug: "french-bulldog",
    title: "French Bulldog",
    description: "To be confirmed",
    readingMinutes: 7,
    facts: {
      size: "Small",
      weightRange: "To be confirmed",
      lifeExpectancy: "To be confirmed",
      energyLevel: "To be confirmed",
      group: "To be confirmed",
      coat: "To be confirmed",
    },
    sections: [
      {
        title: "About the breed",
        body: "To be confirmed",
      },
    ],
    reviewer: "To be confirmed",
  },
];

describe("W5-07 /pet/breeds Route & Semantic Controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("exports valid metadata for /pet/breeds", async () => {
    const meta = await generateMetadata();
    expect(JSON.stringify(meta.title)).toMatch(/care guides by breed|breed/i);
  });

  it("renders page with semantic hero, breadcrumbs, search, and sections", async () => {
    const page = await BreedIndexPage();
    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: /care guides by breed/i })
    ).toBeDefined();

    // Breadcrumbs
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeDefined();
    expect(nav.textContent).toContain("Pet");
    expect(nav.textContent).toContain("Breed guides");

    // Section 5 controls: Search
    expect(screen.getByRole("search")).toBeDefined();
    expect(screen.getByLabelText(/search your breed/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /^search$/i })).toBeDefined();

    // Size filters
    expect(screen.getByRole("button", { name: /all sizes/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /small/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /medium/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /large/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /giant/i })).toBeDefined();

    // Dogs / Cats filter
    expect(screen.getByRole("button", { name: /dogs/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /cats/i })).toBeDefined();

    // Breed card
    expect(screen.getByText("Labrador Retriever")).toBeDefined();

    // Quiz link must only link to existing routes (NOT /pet/breeds/[raca])
    const guideLinks = screen.getAllByRole("link", {
      name: /take.*quiz|pet quiz/i,
    });
    expect(guideLinks.length).toBeGreaterThan(0);
    for (const link of guideLinks) {
      const href = link.getAttribute("href");
      expect(href).not.toMatch(/\/pet\/breeds\/[a-z0-9-]+$/i);
    }

    // Load more breeds
    expect(
      screen.getByRole("button", { name: /load more breeds/i })
    ).toBeDefined();

    // Don't see your breed section
    expect(screen.getByText("Don't see your breed?")).toBeDefined();
    expect(screen.getByRole("link", { name: /take the quiz/i })).toBeDefined();
    expect(
      screen.getByRole("button", { name: /request a breed/i })
    ).toBeDefined();
  });

  it("filters breeds reactively by search query", async () => {
    render(
      <BreedBrowser
        initialBreeds={mockBreedGuides}
        breedIndex={mockBreedIndex}
      />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Labrador Retriever" })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: "French Bulldog" })
    ).toBeDefined();

    const searchInput = screen.getByLabelText(/search your breed/i);
    fireEvent.change(searchInput, { target: { value: "french" } });

    expect(
      screen.queryByRole("heading", { level: 2, name: "Labrador Retriever" })
    ).toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "French Bulldog" })
    ).toBeDefined();
  });

  it("filters breeds by size selection (Small, Medium, Large, Giant)", async () => {
    render(
      <BreedBrowser
        initialBreeds={mockBreedGuides}
        breedIndex={mockBreedIndex}
      />
    );

    const smallBtn = screen.getByRole("button", { name: /small/i });
    fireEvent.click(smallBtn);
    expect(smallBtn.getAttribute("aria-pressed")).toBe("true");

    expect(
      screen.queryByRole("heading", { level: 2, name: "Labrador Retriever" })
    ).toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "French Bulldog" })
    ).toBeDefined();
  });

  it("filters breeds by A-Z letter index", async () => {
    render(
      <BreedBrowser
        initialBreeds={mockBreedGuides}
        breedIndex={mockBreedIndex}
      />
    );

    const letterFBtn = screen.getByRole("button", { name: /^F$/i });
    fireEvent.click(letterFBtn);

    expect(
      screen.queryByRole("heading", { level: 2, name: "Labrador Retriever" })
    ).toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "French Bulldog" })
    ).toBeDefined();

    const letterLBtn = screen.getByRole("button", { name: /^L$/i });
    fireEvent.click(letterLBtn);

    expect(
      screen.getByRole("heading", { level: 2, name: "Labrador Retriever" })
    ).toBeDefined();
    expect(
      screen.queryByRole("heading", { level: 2, name: "French Bulldog" })
    ).toBeNull();
  });

  it("allows requesting a breed with interactive feedback", async () => {
    render(
      <BreedBrowser
        initialBreeds={mockBreedGuides}
        breedIndex={mockBreedIndex}
      />
    );

    const requestBtn = screen.getByRole("button", { name: /request a breed/i });
    fireEvent.click(requestBtn);

    expect(screen.getByText(/request a breed: to be confirmed/i)).toBeDefined();

    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/request a breed: to be confirmed/i)).toBeNull();
  });

  it("filters species strictly by contract species field, not by breed name", async () => {
    const trickyBreeds: BreedGuide[] = [
      {
        slug: "catahoula-leopard-dog",
        title: "Catahoula Leopard Dog",
        species: "Dogs",
        description: "To be confirmed",
        readingMinutes: 6,
        facts: {
          size: "Large",
          weightRange: "To be confirmed",
          lifeExpectancy: "To be confirmed",
          energyLevel: "To be confirmed",
          group: "To be confirmed",
          coat: "To be confirmed",
        },
        sections: [{ title: "About the breed", body: "To be confirmed" }],
        reviewer: "To be confirmed",
      },
      {
        slug: "maine-coon",
        title: "Maine Coon",
        species: "Cats",
        description: "To be confirmed",
        readingMinutes: 5,
        facts: {
          size: "Large",
          weightRange: "To be confirmed",
          lifeExpectancy: "To be confirmed",
          energyLevel: "To be confirmed",
          group: "To be confirmed",
          coat: "To be confirmed",
        },
        sections: [{ title: "About the breed", body: "To be confirmed" }],
        reviewer: "To be confirmed",
      },
    ];

    render(
      <BreedBrowser initialBreeds={trickyBreeds} breedIndex={mockBreedIndex} />
    );

    const dogsBtn = screen.getByRole("button", { name: /^dogs$/i });
    const catsBtn = screen.getByRole("button", { name: /^cats$/i });

    expect(dogsBtn.getAttribute("aria-pressed")).toBe("true");

    // Under Dogs: Catahoula Leopard Dog MUST be visible, Maine Coon MUST NOT
    expect(
      screen.getByRole("heading", { level: 2, name: "Catahoula Leopard Dog" })
    ).toBeDefined();
    expect(
      screen.queryByRole("heading", { level: 2, name: "Maine Coon" })
    ).toBeNull();

    // Under Cats: Maine Coon MUST be visible, Catahoula Leopard Dog MUST NOT
    fireEvent.click(catsBtn);
    expect(
      screen.queryByRole("heading", { level: 2, name: "Catahoula Leopard Dog" })
    ).toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Maine Coon" })
    ).toBeDefined();
  });

  it("ensures card link label and destination match (shows quiz label, not misleading breed guide)", async () => {
    render(
      <BreedBrowser
        initialBreeds={mockBreedGuides}
        breedIndex={mockBreedIndex}
      />
    );

    const quizLinks = screen.getAllByRole("link", {
      name: /take.*quiz|pet quiz/i,
    });
    expect(quizLinks.length).toBeGreaterThan(0);
    for (const link of quizLinks) {
      expect(link.getAttribute("href")).toBe("/pet/quiz");
      expect(link.textContent).toMatch(/quiz/i);
    }
  });

  it("ensures A-Z letter buttons meet minimum 44x44px accessible target size", async () => {
    render(
      <BreedBrowser
        initialBreeds={mockBreedGuides}
        breedIndex={mockBreedIndex}
      />
    );

    const letterBtn = screen.getByRole("button", { name: /^A$/i });
    expect(letterBtn.className).toMatch(/min-w-11/);
    expect(letterBtn.className).toMatch(/min-h-11/);
  });

  it("does not render unconfirmed dosage or vet claims in page copy", async () => {
    const page = await BreedIndexPage();
    render(page);

    const pageText = document.body.textContent || "";
    expect(pageText).not.toMatch(/dose by weight/i);
    expect(pageText).not.toMatch(/reviewed by a vet/i);
    expect(pageText).not.toMatch(/veterinary-reviewed/i);
  });

  it("shows empty state and allows clearing all filters when no breeds match", async () => {
    render(
      <BreedBrowser
        initialBreeds={mockBreedGuides}
        breedIndex={mockBreedIndex}
      />
    );

    const searchInput = screen.getByLabelText(/search your breed/i);
    fireEvent.change(searchInput, { target: { value: "nonexistentbreedxyz" } });

    expect(screen.getByText("No breeds found")).toBeDefined();

    const clearBtn = screen.getByRole("button", { name: /clear filters/i });
    fireEvent.click(clearBtn);

    expect(
      screen.getByRole("heading", { level: 2, name: "Labrador Retriever" })
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: "French Bulldog" })
    ).toBeDefined();
  });
});
