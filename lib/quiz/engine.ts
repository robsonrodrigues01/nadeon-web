import rawQuizData from "@/data/quiz.json";
import { QuizDatabaseSchema } from "@/data/quiz.schema";
import type {
  QuizDefinition,
  QuizAnswers,
  QuizProgress,
  QuizRecommendationResult,
  QuizRecommendationRule,
} from "./types";
import { calculateDose, type PetSpecies, type PetAgeGroup } from "@/lib/dosing";
import { catalogProvider } from "@/lib/providers";

// Parse and freeze database
const parsedDb = QuizDatabaseSchema.parse(rawQuizData);
const quizzesMap: Record<string, QuizDefinition> = parsedDb.quizzes;

/**
 * Retrieves a quiz definition by ID (e.g. "human", "dog", "cat", "horse").
 */
export function getQuiz(id: string): QuizDefinition | undefined {
  return quizzesMap[id];
}

/**
 * Returns all available quizzes in a stable list.
 */
export function listQuizzes(): QuizDefinition[] {
  return Object.values(quizzesMap);
}

/**
 * Calculates current progress given the active question index (0-based).
 */
export function calculateQuizProgress(
  quiz: QuizDefinition,
  questionIndex: number
): QuizProgress {
  const totalSteps = quiz.questions.length;
  const safeIndex = Math.max(0, Math.min(questionIndex, totalSteps - 1));
  const currentStep = safeIndex + 1;
  const progressPercent =
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return {
    currentStep,
    totalSteps,
    progressPercent,
    currentQuestion: quiz.questions[safeIndex] || null,
    isFirstStep: safeIndex === 0,
    isLastStep: safeIndex === totalSteps - 1,
  };
}

/**
 * Checks whether an answer set satisfies a rule match criteria.
 */
function matchesRule(
  match: QuizRecommendationRule["match"],
  answers: QuizAnswers
): boolean {
  const keys = Object.keys(match);
  if (keys.length === 0) return false;

  for (const key of keys) {
    const expected = match[key];
    const actual = answers[key];
    if (actual === undefined || actual !== expected) {
      return false;
    }
  }
  return true;
}

/**
 * Pure recommendation engine: matches answers against quiz rules and computes dosing when relevant.
 */
export async function evaluateQuizRecommendation(
  quiz: QuizDefinition,
  answers: QuizAnswers
): Promise<QuizRecommendationResult> {
  // Find first rule that matches all specified conditions
  const matchedRule =
    quiz.recommendationRules.find((rule) => matchesRule(rule.match, answers)) ||
    quiz.defaultRecommendation;

  const result: QuizRecommendationResult = {
    recommendedKitSlug: matchedRule.recommendedKitSlug,
    recommendedProductSlug: matchedRule.recommendedProductSlug,
    secondaryProductSlug: matchedRule.secondaryProductSlug,
    headline: matchedRule.headline,
    reasons: [...matchedRule.reasons],
    alternatives: matchedRule.alternatives
      ? [...matchedRule.alternatives]
      : undefined,
  };

  // Pet-specific enhancements
  if (quiz.line === "pet") {
    result.petWarning = true;
    const species = (quiz.species || "dog") as PetSpecies;

    if (species === "horse") {
      result.equineNotice = true;
    }

    const rawWeight = Number(answers.weightLbs);
    const fallbackWeight =
      species === "horse" ? 1000 : species === "cat" ? 9 : 35;
    const effectiveWeight =
      !isNaN(rawWeight) && rawWeight > 0 ? rawWeight : fallbackWeight;

    const rawAge = answers.ageGroup as string | undefined;
    const effectiveAge: PetAgeGroup | undefined =
      rawAge === "puppy" || rawAge === "kitten"
        ? "young"
        : rawAge === "senior"
          ? "senior"
          : "adult";

    // Attempt to enrich with catalog product dosingByWeight if available
    let productDetails = null;
    if (matchedRule.recommendedProductSlug) {
      productDetails = await catalogProvider.getProduct(
        matchedRule.recommendedProductSlug
      );
    }

    const calculatedDosing = calculateDose({
      species,
      weight: effectiveWeight,
      unit: "lb",
      age: effectiveAge,
      product: productDetails,
    });

    result.dosing = calculatedDosing;
  }

  return result;
}
