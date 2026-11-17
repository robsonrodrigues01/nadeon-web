import {
  ContentDataSchema,
  type ContentProvider,
  type JournalAudience,
} from "@/lib/contracts/content";

async function loadContent() {
  const { default: content } = await import("@/data/content.json");
  return ContentDataSchema.parse(content);
}

function toArticleSummary({
  slug,
  audience,
  title,
  category,
  categorySlug,
  excerpt,
  readingMinutes,
  species,
}: Awaited<ReturnType<typeof loadContent>>["journalArticles"][number]) {
  return {
    slug,
    audience,
    title,
    category,
    categorySlug,
    excerpt,
    readingMinutes,
    species,
  };
}

export class MockContentProvider implements ContentProvider {
  async getAll() {
    return loadContent();
  }

  async getJournalPage(audience: JournalAudience) {
    return (
      (await loadContent()).journalPages.find(
        (page) => page.audience === audience
      ) ?? null
    );
  }

  async listJournalArticles(audience: JournalAudience) {
    return (await loadContent()).journalArticles
      .filter((article) => article.audience === audience)
      .map(toArticleSummary);
  }

  async listArticlesByCategory(categorySlug: string) {
    return (await loadContent()).journalArticles
      .filter((article) => article.categorySlug === categorySlug)
      .map(toArticleSummary);
  }

  async listJournalCategories(audience: JournalAudience) {
    return (await loadContent()).journalCategories.filter(
      (category) => category.audience === audience
    );
  }

  async getJournalCategory(slug: string) {
    return (
      (await loadContent()).journalCategories.find(
        (category) => category.slug === slug
      ) ?? null
    );
  }

  async getJournalArticle(slug: string) {
    return (
      (await loadContent()).journalArticles.find(
        (article) => article.slug === slug
      ) ?? null
    );
  }

  async listBreedGuides() {
    return (await loadContent()).breedGuides;
  }

  async getBreedIndex() {
    return (await loadContent()).breedIndex;
  }

  async getBreedGuide(slug: string) {
    return (
      (await loadContent()).breedGuides.find((guide) => guide.slug === slug) ??
      null
    );
  }

  async listIngredients() {
    return (await loadContent()).ingredients;
  }

  async getIngredientGlossary() {
    return (await loadContent()).ingredientGlossary;
  }

  async getExpertsPage() {
    return (await loadContent()).expertsPage;
  }

  async listExperts(audience?: JournalAudience) {
    const experts = (await loadContent()).experts;
    return audience
      ? experts.filter((expert) => expert.audience === audience)
      : experts;
  }

  async getExpertReviewProcess() {
    return (await loadContent()).expertReviewProcess;
  }

  async listCourses() {
    return (await loadContent()).courses;
  }

  async getCourse(slug: string) {
    return (
      (await loadContent()).courses.find((course) => course.slug === slug) ??
      null
    );
  }
}

export const mockContentProvider = new MockContentProvider();
