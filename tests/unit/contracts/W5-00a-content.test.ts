import { describe, expect, it } from "vitest";
import { mockContentProvider } from "@/lib/providers/mock/content";
import {
  ContentDataSchema,
  JournalArticleSchema,
  JournalArticleSummarySchema,
} from "@/lib/contracts/content";

describe("W5-00a content contracts and mock", () => {
  it("provides Human and Pet journal pages, categories, and article details", async () => {
    const [
      humanPage,
      petPage,
      human,
      pet,
      categories,
      categoryArticles,
      humanArticle,
      petArticle,
    ] = await Promise.all([
      mockContentProvider.getJournalPage("human"),
      mockContentProvider.getJournalPage("pet"),
      mockContentProvider.listJournalArticles("human"),
      mockContentProvider.listJournalArticles("pet"),
      mockContentProvider.listJournalCategories("pet"),
      mockContentProvider.listArticlesByCategory("dog-health"),
      mockContentProvider.getJournalArticle(
        "nmn-vs-nad-what-is-the-difference"
      ),
      mockContentProvider.getJournalArticle(
        "why-nad-declines-in-senior-dogs-and-what-you-can-do"
      ),
    ]);

    expect(humanPage?.categories).toContain("Science");
    expect(petPage?.species).toEqual(["All pets", "Dogs", "Cats", "Horses"]);
    expect(human[0].title).toBe("NMN vs NAD+: what is the difference?");
    expect(pet[0].title).toBe(
      "Why NAD+ declines in senior dogs, and what you can do"
    );
    expect(categories[0].title).toBe("Dog health");
    expect(categoryArticles.map((article) => article.slug)).toContain(
      "why-nad-declines-in-senior-dogs-and-what-you-can-do"
    );
    expect(humanArticle?.sections[0].title).toBe("What NMN is");
    expect(humanArticle?.sections[0].body).toBe("To be confirmed");
    expect(petArticle?.reviewer).toBe("To be confirmed");
    expect(
      human.every(
        (article) => JournalArticleSummarySchema.safeParse(article).success
      )
    ).toBe(true);
    expect(() => JournalArticleSchema.parse(humanArticle)).not.toThrow();
  });

  it("provides the Labrador guide without presenting example facts as verified", async () => {
    const [index, breeds, labrador] = await Promise.all([
      mockContentProvider.getBreedIndex(),
      mockContentProvider.listBreedGuides(),
      mockContentProvider.getBreedGuide("labrador-retriever"),
    ]);

    expect(index.sizes).toEqual([
      "All sizes",
      "Small",
      "Medium",
      "Large",
      "Giant",
    ]);
    expect(breeds.map((breed) => breed.title)).toContain("Labrador Retriever");
    expect(labrador?.description).toBe("To be confirmed");
    expect(labrador?.description).not.toMatch(/\b\d+\s*to\s*\d+\s*lb\b/i);
    expect(labrador?.facts.size).toBe("To be confirmed");
    expect(labrador?.sections[0].title).toBe("About the breed");
    expect(labrador?.sections[0].body).toBe("To be confirmed");
  });

  it("keeps unapproved ingredient and expert records empty", async () => {
    const [glossary, expertsPage, ingredients, experts, process] =
      await Promise.all([
        mockContentProvider.getIngredientGlossary(),
        mockContentProvider.getExpertsPage(),
        mockContentProvider.listIngredients(),
        mockContentProvider.listExperts(),
        mockContentProvider.getExpertReviewProcess(),
      ]);

    expect(ingredients).toEqual([]);
    expect(experts).toEqual([]);
    expect(glossary.description).toBe("To be confirmed");
    expect(expertsPage.title).toBe("The people behind the formulas");
    expect(process).toHaveLength(4);
    expect(
      process.every((step) => step.description !== "To be confirmed")
    ).toBe(true);
  });

  it("provides both course outlines with instructor details to be confirmed", async () => {
    const courses = await mockContentProvider.listCourses();
    const seniorCare = await mockContentProvider.getCourse("senior-dog-care");

    expect(courses).toHaveLength(2);
    expect(
      courses.find((course) => course.slug === "30-day-longevity")?.lessons
    ).toHaveLength(7);
    expect(seniorCare?.lessons[0]).toMatchObject({
      day: 1,
      title: "Mobility",
      summary: "Ramps, rugs and gentle stretches at home.",
    });
    expect(seniorCare?.instructor.name).toBe("To be confirmed");
  });

  it("validates the complete content mock against its contract", async () => {
    const content = await mockContentProvider.getAll();
    expect(() => ContentDataSchema.parse(content)).not.toThrow();
  });
});
