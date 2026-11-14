import { describe, it, expect } from "vitest";
import { QuizDatabaseSchema } from "@/data/quiz.schema";
import rawQuizData from "@/data/quiz.json";
import {
  getQuiz,
  listQuizzes,
  calculateQuizProgress,
  evaluateQuizRecommendation,
} from "@/lib/quiz";
import { catalogProvider } from "@/lib/providers";

describe("Quiz Schema & Data Validation", () => {
  it("strictly validates data/quiz.json according to QuizDatabaseSchema", () => {
    const parseResult = QuizDatabaseSchema.safeParse(rawQuizData);
    expect(parseResult.success).toBe(true);
    if (!parseResult.success) {
      console.error(parseResult.error.format());
    }
  });

  it("marks status as 'proposta'", () => {
    expect(rawQuizData.status).toBe("proposta");
  });

  it("contains Human and all 3 Pet quizzes: dog, cat, horse", () => {
    const quizzes = listQuizzes();
    const ids = quizzes.map((q) => q.id);
    expect(ids).toContain("human");
    expect(ids).toContain("dog");
    expect(ids).toContain("cat");
    expect(ids).toContain("horse");
  });

  it("ensures all recommended product slugs exist in the catalog", async () => {
    const quizzes = listQuizzes();
    for (const quiz of quizzes) {
      for (const rule of quiz.recommendationRules) {
        if (rule.recommendedProductSlug) {
          const product = await catalogProvider.getProduct(
            rule.recommendedProductSlug
          );
          expect(
            product,
            `Product slug "${rule.recommendedProductSlug}" in quiz "${quiz.id}" must exist in catalog`
          ).not.toBeNull();
        }
        if (rule.secondaryProductSlug) {
          const product = await catalogProvider.getProduct(
            rule.secondaryProductSlug
          );
          expect(
            product,
            `Secondary product slug "${rule.secondaryProductSlug}" in quiz "${quiz.id}" must exist in catalog`
          ).not.toBeNull();
        }
        if (rule.alternatives) {
          for (const alt of rule.alternatives) {
            if (alt.type === "product") {
              const product = await catalogProvider.getProduct(alt.slug);
              expect(
                product,
                `Alternative product slug "${alt.slug}" in quiz "${quiz.id}" must exist`
              ).not.toBeNull();
            }
          }
        }
      }
    }
  });

  it("ensures all recommended kit slugs exist in the catalog", async () => {
    const quizzes = listQuizzes();
    for (const quiz of quizzes) {
      for (const rule of quiz.recommendationRules) {
        if (rule.recommendedKitSlug) {
          const kit = await catalogProvider.getKit(rule.recommendedKitSlug);
          expect(
            kit,
            `Kit slug "${rule.recommendedKitSlug}" in quiz "${quiz.id}" must exist in catalog`
          ).not.toBeNull();
        }
        if (rule.alternatives) {
          for (const alt of rule.alternatives) {
            if (alt.type === "kit") {
              const kit = await catalogProvider.getKit(alt.slug);
              expect(
                kit,
                `Alternative kit slug "${alt.slug}" in quiz "${quiz.id}" must exist`
              ).not.toBeNull();
            }
          }
        }
      }
    }
  });
});

describe("Quiz Progress & Engine", () => {
  it("calculates progress percentage and step info accurately", () => {
    const humanQuiz = getQuiz("human");
    expect(humanQuiz).toBeDefined();

    const progress0 = calculateQuizProgress(humanQuiz!, 0);
    expect(progress0.currentStep).toBe(1);
    expect(progress0.totalSteps).toBe(humanQuiz!.questions.length);
    expect(progress0.progressPercent).toBe(20);

    const progressEnd = calculateQuizProgress(
      humanQuiz!,
      humanQuiz!.questions.length - 1
    );
    expect(progressEnd.currentStep).toBe(humanQuiz!.questions.length);
    expect(progressEnd.progressPercent).toBe(100);
  });

  it("evaluates Human recommendations based on user answers", async () => {
    const humanQuiz = getQuiz("human");
    expect(humanQuiz).toBeDefined();

    const recommendation = await evaluateQuizRecommendation(humanQuiz!, {
      goal: "daily-energy",
      ageRange: "45-to-54",
      afternoonSlump: "most-days",
      format: "capsules",
      takesNmn: "no",
    });

    expect(recommendation.recommendedKitSlug).toBe("energy-duo");
    expect(recommendation.recommendedProductSlug).toBe("biohack");
    expect(recommendation.secondaryProductSlug).toBe("renew");
    expect(recommendation.reasons.length).toBeGreaterThan(0);
    expect(recommendation.alternatives?.length).toBeGreaterThan(0);
  });

  it("evaluates Dog recommendations with accurate pet dosing", async () => {
    const dogQuiz = getQuiz("dog");
    expect(dogQuiz).toBeDefined();

    const recommendation = await evaluateQuizRecommendation(dogQuiz!, {
      petName: "Max",
      weightLbs: 35,
      ageGroup: "senior",
      concern: "joints-mobility",
      pickyEater: "no",
    });

    expect(recommendation.recommendedKitSlug).toBe("chew-oil");
    expect(recommendation.recommendedProductSlug).toBe("more-good-years");
    expect(recommendation.dosing).toBeDefined();
    expect(recommendation.dosing?.dose).toContain("chew");
    expect(recommendation.dosing?.dailySchedule).toBeDefined();
  });

  it("evaluates Cat recommendations with cat-specific drops and dosing", async () => {
    const catQuiz = getQuiz("cat");
    expect(catQuiz).toBeDefined();

    const recommendation = await evaluateQuizRecommendation(catQuiz!, {
      petName: "Luna",
      weightLbs: 9,
      ageGroup: "adult",
      concern: "calm-stress",
    });

    expect(recommendation.recommendedKitSlug).toBe("cat-care");
    expect(recommendation.recommendedProductSlug).toBe("purr-mode");
    expect(recommendation.dosing).toBeDefined();
  });

  it("evaluates Horse recommendations with powder dosage and equine notices", async () => {
    const horseQuiz = getQuiz("horse");
    expect(horseQuiz).toBeDefined();

    const recommendation = await evaluateQuizRecommendation(horseQuiz!, {
      petName: "Thunder",
      weightLbs: 1100,
      lifeStage: "sport",
      concern: "joint-stride",
    });

    expect(recommendation.recommendedProductSlug).toBe("long-stride");
    expect(recommendation.equineNotice).toBe(true);
    expect(recommendation.dosing).toBeDefined();
  });
});
