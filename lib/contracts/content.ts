import { z } from "zod";

const PendingTextSchema = z.string().min(1);

export const JournalAudienceSchema = z.enum(["human", "pet"]);
export type JournalAudience = z.infer<typeof JournalAudienceSchema>;

export const JournalArticleSummarySchema = z.object({
  slug: z.string().min(1),
  audience: JournalAudienceSchema,
  title: z.string().min(1),
  category: z.string().min(1),
  categorySlug: z.string().min(1).optional(),
  excerpt: PendingTextSchema,
  readingMinutes: z.number().int().positive().optional(),
  species: z.array(z.enum(["dog", "cat", "horse"])),
});
export type JournalArticleSummary = z.infer<typeof JournalArticleSummarySchema>;

export const JournalArticleSchema = JournalArticleSummarySchema.extend({
  reviewer: PendingTextSchema,
  publishedAt: PendingTextSchema,
  updatedAt: PendingTextSchema,
  sections: z.array(
    z.object({ title: z.string().min(1), body: PendingTextSchema })
  ),
});
export type JournalArticle = z.infer<typeof JournalArticleSchema>;

export const JournalCategorySchema = z.object({
  slug: z.string().min(1),
  audience: JournalAudienceSchema,
  title: z.string().min(1),
  description: PendingTextSchema,
  reviewer: PendingTextSchema,
  subcategories: z.array(z.string().min(1)),
});
export type JournalCategory = z.infer<typeof JournalCategorySchema>;

export const JournalPageSchema = z.object({
  audience: JournalAudienceSchema,
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: PendingTextSchema,
  categories: z.array(z.string().min(1)),
  species: z.array(z.string().min(1)),
});
export type JournalPage = z.infer<typeof JournalPageSchema>;

export const BreedIndexSchema = z.object({
  title: z.string().min(1),
  description: PendingTextSchema,
  sizes: z.array(z.string().min(1)),
  species: z.array(z.string().min(1)),
  sizeKey: PendingTextSchema,
});
export type BreedIndex = z.infer<typeof BreedIndexSchema>;

export const IngredientGlossarySchema = z.object({
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  description: PendingTextSchema,
  searchLabel: z.string().min(1),
  categories: z.array(z.string().min(1)),
});
export type IngredientGlossary = z.infer<typeof IngredientGlossarySchema>;

export const ExpertsPageSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: PendingTextSchema,
  humanSection: z.string().min(1),
  humanDescription: PendingTextSchema,
  petSection: z.string().min(1),
  petDescription: PendingTextSchema,
  clinicSection: z.string().min(1),
  clinicDescription: PendingTextSchema,
});
export type ExpertsPage = z.infer<typeof ExpertsPageSchema>;

export const BreedGuideSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  species: z.string().min(1).optional(),
  description: PendingTextSchema,
  readingMinutes: z.number().int().positive().optional(),
  facts: z.object({
    size: PendingTextSchema,
    weightRange: PendingTextSchema,
    lifeExpectancy: PendingTextSchema,
    energyLevel: PendingTextSchema,
    group: PendingTextSchema,
    coat: PendingTextSchema,
  }),
  sections: z.array(
    z.object({ title: z.string().min(1), body: PendingTextSchema })
  ),
  reviewer: PendingTextSchema,
});
export type BreedGuide = z.infer<typeof BreedGuideSchema>;

export const IngredientSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: PendingTextSchema,
  description: PendingTextSchema,
  dose: PendingTextSchema,
  form: PendingTextSchema,
});
export type Ingredient = z.infer<typeof IngredientSchema>;

export const ExpertProcessStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: PendingTextSchema,
});
export type ExpertProcessStep = z.infer<typeof ExpertProcessStepSchema>;

export const ExpertSchema = z.object({
  name: PendingTextSchema,
  audience: JournalAudienceSchema,
  specialty: PendingTextSchema,
  credential: PendingTextSchema,
  bio: PendingTextSchema,
});
export type Expert = z.infer<typeof ExpertSchema>;

export const CourseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  audience: JournalAudienceSchema,
  description: PendingTextSchema,
  cadenceDays: z.number().int().positive(),
  instructor: z.object({ name: PendingTextSchema, bio: PendingTextSchema }),
  lessons: z.array(
    z.object({
      day: z.number().int().positive(),
      title: z.string().min(1),
      summary: PendingTextSchema,
      body: PendingTextSchema,
    })
  ),
});
export type Course = z.infer<typeof CourseSchema>;

export const ContentDataSchema = z.object({
  journalPages: z.array(JournalPageSchema),
  journalArticles: z.array(JournalArticleSchema),
  journalCategories: z.array(JournalCategorySchema),
  breedIndex: BreedIndexSchema,
  breedGuides: z.array(BreedGuideSchema),
  ingredientGlossary: IngredientGlossarySchema,
  ingredients: z.array(IngredientSchema),
  expertsPage: ExpertsPageSchema,
  experts: z.array(ExpertSchema),
  expertReviewProcess: z.array(ExpertProcessStepSchema),
  courses: z.array(CourseSchema),
});
export type ContentData = z.infer<typeof ContentDataSchema>;

export interface ContentProvider {
  getAll(): Promise<ContentData>;
  getJournalPage(audience: JournalAudience): Promise<JournalPage | null>;
  listJournalArticles(
    audience: JournalAudience
  ): Promise<JournalArticleSummary[]>;
  listArticlesByCategory(
    categorySlug: string
  ): Promise<JournalArticleSummary[]>;
  listJournalCategories(audience: JournalAudience): Promise<JournalCategory[]>;
  getJournalCategory(slug: string): Promise<JournalCategory | null>;
  getJournalArticle(slug: string): Promise<JournalArticle | null>;
  listBreedGuides(): Promise<BreedGuide[]>;
  getBreedIndex(): Promise<BreedIndex>;
  getBreedGuide(slug: string): Promise<BreedGuide | null>;
  listIngredients(): Promise<Ingredient[]>;
  getIngredientGlossary(): Promise<IngredientGlossary>;
  getExpertsPage(): Promise<ExpertsPage>;
  listExperts(audience?: JournalAudience): Promise<Expert[]>;
  getExpertReviewProcess(): Promise<ExpertProcessStep[]>;
  listCourses(): Promise<Course[]>;
  getCourse(slug: string): Promise<Course | null>;
}
