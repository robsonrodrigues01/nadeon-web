import { z } from "zod";

export const QuizQuestionOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  badge: z.string().optional(),
});
export type QuizQuestionOption = z.infer<typeof QuizQuestionOptionSchema>;

export const QuizQuestionSchema = z.object({
  id: z.string(),
  stepNumber: z.number(),
  stepTitle: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  type: z.enum(["single-choice", "pet-profile"]).default("single-choice"),
  options: z.array(QuizQuestionOptionSchema).default([]),
  helpText: z.string().optional(),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const QuizAlternativeRecommendationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["product", "kit"]),
  slug: z.string(),
});
export type QuizAlternativeRecommendation = z.infer<
  typeof QuizAlternativeRecommendationSchema
>;

export const QuizRecommendationRuleSchema = z.object({
  id: z.string(),
  match: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  recommendedKitSlug: z.string().optional(),
  recommendedProductSlug: z.string().optional(),
  secondaryProductSlug: z.string().optional(),
  headline: z.string(),
  reasons: z.array(z.string()),
  alternatives: z.array(QuizAlternativeRecommendationSchema).optional(),
});
export type QuizRecommendationRule = z.infer<
  typeof QuizRecommendationRuleSchema
>;

export const QuizDefinitionSchema = z.object({
  id: z.string(),
  line: z.enum(["human", "pet"]),
  species: z.enum(["dog", "cat", "horse"]).nullable().optional(),
  title: z.string(),
  promiseHeadline: z.string(),
  supportingText: z.string(),
  estimatedMinutes: z.number(),
  questions: z.array(QuizQuestionSchema),
  recommendationRules: z.array(QuizRecommendationRuleSchema),
  defaultRecommendation: QuizRecommendationRuleSchema,
});
export type QuizDefinition = z.infer<typeof QuizDefinitionSchema>;

export const QuizDatabaseSchema = z.object({
  status: z.literal("proposta"),
  quizzes: z.record(z.string(), QuizDefinitionSchema),
});
export type QuizDatabase = z.infer<typeof QuizDatabaseSchema>;
