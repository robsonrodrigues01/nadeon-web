"use client";

import React, { useState, useTransition } from "react";
import type {
  QuizDefinition,
  QuizAnswers,
  QuizRecommendationResult,
} from "@/lib/quiz";
import { getQuiz, evaluateQuizRecommendation } from "@/lib/quiz";
import type { Product, Kit } from "@/lib/contracts/catalog";
import { QuizStart } from "./quiz-start";
import { QuizQuestionComponent } from "./quiz-question";
import { QuizAnalyzing } from "./quiz-analyzing";
import { QuizResultHuman } from "./quiz-result-human";
import { QuizResultPet } from "./quiz-result-pet";

export type QuizScreen = "start" | "question" | "analyzing" | "result";

export interface QuizWizardProps {
  initialQuiz: QuizDefinition;
  productsMap?: Record<string, Product>;
  kitsMap?: Record<string, Kit>;
  locale?: string;
  defaultScreen?: QuizScreen;
  initialAnswers?: QuizAnswers;
  onExit?: () => void;
  className?: string;
}

export function QuizWizard({
  initialQuiz,
  productsMap = {},
  kitsMap = {},
  locale = "en-US",
  defaultScreen = "start",
  initialAnswers = {},
  onExit,
  className = "",
}: QuizWizardProps) {
  const [activeQuiz, setActiveQuiz] = useState<QuizDefinition>(initialQuiz);
  const [screen, setScreen] = useState<QuizScreen>(defaultScreen);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [recommendation, setRecommendation] =
    useState<QuizRecommendationResult | null>(null);
  const [, startTransition] = useTransition();

  const handleStart = (chosenQuizId?: string) => {
    if (chosenQuizId && chosenQuizId !== activeQuiz.id) {
      const found = getQuiz(chosenQuizId);
      if (found) {
        setActiveQuiz(found);
      }
    }
    setQuestionIndex(0);
    setScreen("question");
  };

  const handleAnswer = (key: string, value: string | number | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = async () => {
    if (questionIndex < activeQuiz.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all questions -> Go to analyzing screen
      setScreen("analyzing");
      // Evaluate recommendations in background
      startTransition(async () => {
        const result = await evaluateQuizRecommendation(activeQuiz, answers);
        setRecommendation(result);
      });
    }
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
    } else {
      setScreen("start");
    }
  };

  const handleAnalyzingComplete = async () => {
    if (!recommendation) {
      const result = await evaluateQuizRecommendation(activeQuiz, answers);
      setRecommendation(result);
    }
    setScreen("result");
  };

  const handleRetake = () => {
    setAnswers({});
    setQuestionIndex(0);
    setRecommendation(null);
    setScreen("start");
  };

  const handleEditAnswers = () => {
    setQuestionIndex(0);
    setScreen("question");
  };

  return (
    <div className={`w-full ${className}`} data-testid="quiz-wizard">
      {screen === "start" && (
        <QuizStart quiz={activeQuiz} onStart={handleStart} />
      )}

      {screen === "question" && (
        <QuizQuestionComponent
          quiz={activeQuiz}
          questionIndex={questionIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onBack={handleBack}
          onExit={onExit || (() => setScreen("start"))}
        />
      )}

      {screen === "analyzing" && (
        <QuizAnalyzing
          quiz={activeQuiz}
          answers={answers}
          onComplete={handleAnalyzingComplete}
        />
      )}

      {screen === "result" &&
        recommendation &&
        (activeQuiz.line === "human" ? (
          <QuizResultHuman
            quiz={activeQuiz}
            answers={answers}
            recommendation={recommendation}
            productsMap={productsMap}
            kitsMap={kitsMap}
            onRetake={handleRetake}
            onEditAnswers={handleEditAnswers}
            locale={locale}
          />
        ) : (
          <QuizResultPet
            quiz={activeQuiz}
            answers={answers}
            recommendation={recommendation}
            productsMap={productsMap}
            kitsMap={kitsMap}
            onRetake={handleRetake}
            onEditAnswers={handleEditAnswers}
            locale={locale}
          />
        ))}
    </div>
  );
}
