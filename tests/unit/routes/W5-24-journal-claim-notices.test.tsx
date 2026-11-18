// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import contentData from "@/data/content.json";
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
  it("shows the FDA disclaimer exactly once near the title for the real Pet article in data/content.json without markers", async () => {
    const realPetArticle = contentData.journalArticles.find(
      (article) => article.audience === "pet"
    );
    expect(realPetArticle).toBeDefined();
    // Confirms the real published title and headings have no "*" marker
    expect(realPetArticle!.title.includes("*")).toBe(false);
    expect(
      realPetArticle!.sections.every((section) => !section.title.includes("*"))
    ).toBe(true);

    contentProviderMock.getJournalArticle.mockResolvedValueOnce(realPetArticle);

    render(
      await JournalArticlePage({
        params: Promise.resolve({ slug: realPetArticle!.slug }),
      })
    );

    const articleTitle = screen.getByRole("heading", {
      level: 1,
      name: realPetArticle!.title,
    });
    expect(articleTitle).toBeDefined();

    // The FDA disclaimer is displayed once near the title (in the header)
    const header = articleTitle.closest("header");
    expect(header).toBeDefined();
    const fdaNoticeInHeader = header?.querySelector('[role="note"]');
    expect(fdaNoticeInHeader?.textContent).toMatch(
      /not been evaluated by the Food and Drug Administration/i
    );

    // The FDA disclaimer appears exactly once on the entire page
    const allNotes = screen.getAllByRole("note");
    const fdaNotes = allNotes.filter((note) =>
      /not been evaluated by the Food and Drug Administration/i.test(
        note.textContent ?? ""
      )
    );
    expect(fdaNotes).toHaveLength(1);

    // Table of contents and section headings do not duplicate the FDA disclaimer
    const firstSection = realPetArticle!.sections[0];
    const contentsLink = screen.getByRole("link", {
      name: (name) => name.includes(firstSection.title),
    });
    expect(contentsLink.querySelector('[role="note"]')).toBeNull();

    const sectionHeading = screen.getByRole("heading", {
      name: (name) => name.includes(firstSection.title),
    });
    expect(sectionHeading.querySelector('[role="note"]')).toBeNull();

    // Required animal regulatory notice is also present
    const animalNotice = allNotes.find((note) =>
      /For animal use only/i.test(note.textContent ?? "")
    );
    expect(animalNotice).toBeDefined();
  });

  it("does not show the FDA disclaimer or animal notice for the real Human article in data/content.json", async () => {
    const realHumanArticle = contentData.journalArticles.find(
      (article) => article.audience === "human"
    );
    expect(realHumanArticle).toBeDefined();

    contentProviderMock.getJournalArticle.mockResolvedValueOnce(
      realHumanArticle
    );

    render(
      await JournalArticlePage({
        params: Promise.resolve({ slug: realHumanArticle!.slug }),
      })
    );

    expect(screen.queryByRole("note")).toBeNull();
  });
});
