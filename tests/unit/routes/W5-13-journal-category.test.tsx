// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { contentProviderMock, notFoundMock } = vi.hoisted(() => ({
  contentProviderMock: {
    getJournalCategory: vi.fn(),
    getJournalPage: vi.fn(),
    listArticlesByCategory: vi.fn(),
  },
  notFoundMock: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("@/lib/providers", () => ({ contentProvider: contentProviderMock }));
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));
vi.mock("@/components/brand/trust-strip", () => ({ TrustStrip: () => null }));
vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));
vi.mock("@/components/layout/header", () => ({ Header: () => null }));

import JournalCategoryPage from "@/app/(shared)/journal/[categoria]/page";
import type {
  JournalArticleSummary,
  JournalCategory,
} from "@/lib/contracts/content";

const category: JournalCategory = {
  slug: "dog-health",
  audience: "pet",
  title: "Dog health",
  description: "Everyday guides from the provider.",
  reviewer: "To be confirmed",
  subcategories: ["Joints", "Senior care"],
};
const article: JournalArticleSummary = {
  slug: "provider-article",
  audience: "pet",
  title: "Provider article title",
  category: "Health",
  categorySlug: "dog-health",
  excerpt: "Provider article excerpt.",
  readingMinutes: 5,
  species: ["dog"],
};
const journalPage = {
  audience: "pet" as const,
  eyebrow: "THE PET JOURNAL",
  title: "For pet parents",
  description: "Journal intro.",
  categories: ["All", "Health"],
  species: ["All pets", "Dogs", "Cats", "Horses"],
};

afterEach(() => cleanup());

beforeEach(() => {
  vi.clearAllMocks();
  contentProviderMock.getJournalCategory.mockResolvedValue(category);
  contentProviderMock.getJournalPage.mockResolvedValue(journalPage);
  contentProviderMock.listArticlesByCategory.mockResolvedValue([article]);
});

describe("W5-13 /journal/[categoria]", () => {
  it("renders provider category and articles without links to the future article route", async () => {
    render(
      await JournalCategoryPage({
        params: Promise.resolve({ categoria: "dog-health" }),
      })
    );

    expect(screen.getByRole("heading", { name: "Dog health" })).toBeTruthy();
    expect(screen.getByText("Everyday guides from the provider.")).toBeTruthy();
    expect(screen.getByText("Provider article title")).toBeTruthy();
    expect(screen.getByText("Provider article excerpt.")).toBeTruthy();
    expect(
      (
        screen.getByRole("button", {
          name: "Read the article",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    expect(
      document.querySelector('a[href="/journal/provider-article"]')
    ).toBeNull();
    expect(contentProviderMock.getJournalCategory).toHaveBeenCalledWith(
      "dog-health"
    );
    expect(contentProviderMock.listArticlesByCategory).toHaveBeenCalledWith(
      "dog-health"
    );
  });

  it("uses category subcategories and leaves missing tagged content unfilled", async () => {
    render(
      await JournalCategoryPage({
        params: Promise.resolve({ categoria: "dog-health" }),
      })
    );

    expect(
      screen.getByRole("group", { name: "Every article in this category" })
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Joints" }));
    expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
  });

  it("shows the existing Pet quiz and not-found for unknown provider categories", async () => {
    render(
      await JournalCategoryPage({
        params: Promise.resolve({ categoria: "dog-health" }),
      })
    );
    expect(
      screen
        .getByRole("link", { name: "Take the 60-second quiz" })
        .getAttribute("href")
    ).toBe("/pet/quiz");

    contentProviderMock.getJournalCategory.mockResolvedValue(null);
    await expect(
      JournalCategoryPage({ params: Promise.resolve({ categoria: "unknown" }) })
    ).rejects.toThrow("NOT_FOUND");
    expect(contentProviderMock.listArticlesByCategory).toHaveBeenCalledTimes(1);
  });
});
