// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import JournalArticlePage from "@/app/(shared)/journal/[slug]/page";

const { contentProviderMock, notFoundMock } = vi.hoisted(() => ({
  contentProviderMock: { getJournalArticle: vi.fn() },
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/providers", () => ({ contentProvider: contentProviderMock }));
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));

afterEach(cleanup);

describe("W5-24 journal claim notices", () => {
  it("shows the FDA disclaimer for marked Pet titles and section headings", async () => {
    const article = {
      slug: "TEST-pet-article",
      audience: "pet",
      title: "TEST Pet article title*",
      category: "TEST category",
      excerpt: "To be confirmed",
      readingMinutes: 4,
      species: ["dog"],
      reviewer: "To be confirmed",
      publishedAt: "To be confirmed",
      updatedAt: "To be confirmed",
      sections: [
        {
          title: "TEST Pet section heading*",
          body: "To be confirmed",
        },
      ],
    };
    contentProviderMock.getJournalArticle.mockResolvedValueOnce(article);

    render(
      await JournalArticlePage({
        params: Promise.resolve({ slug: article.slug }),
      })
    );

    const disclaimer = (element: Element | null | undefined) =>
      element?.querySelector('[role="note"]')?.textContent;
    const articleTitle = screen.getByRole("heading", { level: 1 });
    const contentsLink = screen.getByRole("link", {
      name: /TEST Pet section heading/,
    });
    const sectionTitle = screen
      .getAllByRole("heading", { level: 2 })
      .find((heading) =>
        heading.textContent?.includes(article.sections[0].title)
      );

    expect(articleTitle.textContent).toContain(article.title);
    expect(disclaimer(articleTitle)).toMatch(
      /not been evaluated by the Food and Drug Administration/i
    );
    expect(disclaimer(contentsLink)).toMatch(
      /not been evaluated by the Food and Drug Administration/i
    );
    expect(disclaimer(sectionTitle)).toMatch(
      /not been evaluated by the Food and Drug Administration/i
    );
    expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
  });
});
