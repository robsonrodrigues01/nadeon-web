import type {
  QuizQuestion,
  QuizAlternativeRecommendation,
} from "@/data/quiz.schema";
import type { DoseResult } from "@/lib/dosing";

export type QuizAnswers = Record<string, string | number | boolean | undefined>;

export interface QuizProgress {
  currentStep: number;
  totalSteps: number;
  progressPercent: number;
  currentQuestion: QuizQuestion | null;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface QuizRecommendationResult {
  recommendedKitSlug?: string;
  recommendedProductSlug?: string;
  secondaryProductSlug?: string;
  headline: string;
  reasons: string[];
  alternatives?: QuizAlternativeRecommendation[];
  dosing?: DoseResult;
  equineNotice?: boolean;
  petWarning?: boolean;
}

export type {
  QuizDefinition,
  QuizQuestion,
  QuizQuestionOption,
  QuizAlternativeRecommendation,
  QuizRecommendationRule,
  QuizDatabase,
} from "@/data/quiz.schema";
