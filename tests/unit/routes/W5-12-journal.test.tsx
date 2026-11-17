// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import contentData from "@/data/content.json";
import HumanJournalPage from "@/app/(shared)/journal/page";
import PetJournalPage from "@/app/(pet)/pet/journal/page";

const { contentProviderMock } = vi.hoisted(() => ({
  contentProviderMock: {
    getJournalPage: vi.fn(),
    listJournalArticles: vi.fn(),
  },
}));

vi.mock("@/lib/providers", () => ({ contentProvider: contentProviderMock }));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  contentProviderMock.getJournalPage.mockImplementation(async (audience) => ({
    audience,
    eyebrow: audience === "pet" ? "THE PET JOURNAL" : "THE NADEON JOURNAL",
    title: audience === "pet" ? "For pet parents" : "Read before you buy",
    description: "Approved board description.",
    categories:
      audience === "pet"
        ? ["All", "Health", "Nutrition"]
        : ["All", "Science", "Routines"],
    species: audience === "pet" ? ["All pets", "Dogs", "Cats"] : [],
  }));
  contentProviderMock.listJournalArticles.mockImplementation(async (audience) =>
    Array.from({ length: audience === "pet" ? 7 : 2 }, (_, index) => ({
      slug: `approved-${audience}-${index + 1}`,
      audience,
      title: `Provider article ${index + 1}`,
      category: index === 0 ? "Science" : "Routines",
      excerpt: `Provider excerpt ${index + 1}`,
      readingMinutes: 5,
      species: index === 0 ? ["dog"] : [],
    }))
  );
});

describe("W5-12 journal routes", () => {
  it("renders the Human featured excerpt exactly as approved on the board", async () => {
    const featuredArticle = contentData.journalArticles.find(
      (article) => article.audience === "human"
    );
    if (!featuredArticle) throw new Error("Missing Human journal fixture");
    contentProviderMock.listJournalArticles.mockResolvedValue([
      featuredArticle,
    ]);

    render(await HumanJournalPage());

    expect(
      screen.getByText(
        "One is the building block, the other is the molecule your cells use. Here is how they connect, and how to pick a formula."
      )
    ).toBeTruthy();
  });

  it("loads Human articles from the registry and filters search and categories without broken links", async () => {
    render(await HumanJournalPage());

    expect(
      screen.getByRole("heading", { name: "Read before you buy" })
    ).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.queryByRole("link", { name: "Read the article" })).toBeNull();
    expect(
      screen
        .getAllByRole("button", { name: "Read the article" })
        .every((button) => (button as HTMLButtonElement).disabled)
    ).toBe(true);
    expect(screen.queryByRole("link", { name: "Science" })).toBeNull();
    expect(document.querySelectorAll('a[href^="/journal/"]')).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Routines" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Provider article 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "All" }));

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search the journal" }),
      {
        target: { value: "Provider article 2" },
      }
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Provider article 2")).toBeTruthy();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search the journal" }),
      {
        target: { value: "missing" },
      }
    );
    expect(screen.getByText("To be confirmed")).toBeTruthy();
    expect(contentProviderMock.getJournalPage).toHaveBeenCalledWith("human");
    expect(contentProviderMock.listJournalArticles).toHaveBeenCalledWith(
      "human"
    );
  });

  it("filters Pet articles by species and loads more provider results", async () => {
    render(await PetJournalPage());

    expect(
      screen.getByRole("heading", { name: "For pet parents" })
    ).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(document.querySelectorAll('a[href^="/journal/"]')).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: "Load more articles" })
    ).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Species"), {
      target: { value: "dog" },
    });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Provider article 1")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Species"), {
      target: { value: "all" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Load more articles" }));
    expect(screen.getAllByRole("article")).toHaveLength(7);
    expect(
      screen.getByRole("form", { name: "One good read a week" })
    ).toBeTruthy();
    expect(
      within(
        screen.getByRole("form", { name: "One good read a week" })
      ).getByRole("button", { name: "Subscribe" })
    ).toBeTruthy();
    expect(contentProviderMock.getJournalPage).toHaveBeenCalledWith("pet");
    expect(contentProviderMock.listJournalArticles).toHaveBeenCalledWith("pet");
  });
});
