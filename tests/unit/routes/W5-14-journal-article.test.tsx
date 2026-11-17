// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ArticlePage from "@/app/(shared)/journal/[slug]/page";

const { contentProviderMock, notFoundMock } = vi.hoisted(() => ({
  contentProviderMock: { getJournalArticle: vi.fn() },
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/providers", () => ({ contentProvider: contentProviderMock }));
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));

afterEach(cleanup);

const articles = [
  {
    slug: "nmn-vs-nad-what-is-the-difference",
    audience: "human",
    title: "NMN vs NAD+: what is the difference?",
    category: "Science",
    excerpt: "To be confirmed",
    readingMinutes: 6,
    species: [],
    reviewer: "To be confirmed",
    publishedAt: "To be confirmed",
    updatedAt: "To be confirmed",
    sections: [
      { title: "What NMN is", body: "To be confirmed" },
      { title: "What NAD+ is", body: "To be confirmed" },
    ],
  },
  {
    slug: "why-nad-declines-in-senior-dogs-and-what-you-can-do",
    audience: "pet",
    title: "Why NAD+ declines in senior dogs, and what you can do",
    category: "Health",
    excerpt: "To be confirmed",
    readingMinutes: 7,
    species: ["dog"],
    reviewer: "To be confirmed",
    publishedAt: "To be confirmed",
    updatedAt: "To be confirmed",
    sections: [
      { title: "What NAD+ does in a dog's body", body: "To be confirmed" },
      { title: "Why levels drop with age", body: "To be confirmed" },
    ],
  },
];

describe("W5-14 journal article route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contentProviderMock.getJournalArticle.mockImplementation(
      async (slug) => articles.find((article) => article.slug === slug) ?? null
    );
  });

  it.each(articles)(
    "renders the provider's $audience article without draft claims",
    async (article) => {
      render(
        await ArticlePage({ params: Promise.resolve({ slug: article.slug }) })
      );

      expect(
        screen.getByRole("heading", { level: 1, name: article.title })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", {
          name: `01 ${article.sections[0].title}`,
        })
      ).toBeTruthy();
      expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
      expect(
        screen.queryByText(/Sample copy|placeholder|NAD\+ support/i)
      ).toBeNull();
      expect(
        screen.getAllByRole("link").every((link) => {
          const href = link.getAttribute("href") ?? "";
          return (
            href.startsWith("#") ||
            href === "/journal" ||
            href === "/pet/journal"
          );
        })
      ).toBe(true);
      if (article.audience === "pet") {
        expect(screen.getByRole("note").textContent).toContain(
          "For animal use only"
        );
      } else {
        expect(screen.queryByRole("note")).toBeNull();
      }
    }
  );

  it("renders unknown slugs as not found", async () => {
    await expect(
      ArticlePage({ params: Promise.resolve({ slug: "unknown" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledOnce();
  });
});
