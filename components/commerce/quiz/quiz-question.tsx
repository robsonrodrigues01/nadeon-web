"use client";

import React, { useId } from "react";
import type { QuizDefinition, QuizAnswers } from "@/lib/quiz";
import { calculateQuizProgress } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";

export interface QuizQuestionComponentProps {
  quiz: QuizDefinition;
  questionIndex: number;
  answers: QuizAnswers;
  onAnswer: (key: string, value: string | number | boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onExit?: () => void;
  className?: string;
}

export function QuizQuestionComponent({
  quiz,
  questionIndex,
  answers,
  onAnswer,
  onNext,
  onBack,
  onExit,
  className = "",
}: QuizQuestionComponentProps) {
  const componentId = useId();
  const progress = calculateQuizProgress(quiz, questionIndex);
  const currentQuestion = progress.currentQuestion;

  if (!currentQuestion) {
    return null;
  }

  const isPetProfile = currentQuestion.type === "pet-profile";
  const petName = (answers.petName as string) || "";
  const weightLbs = (answers.weightLbs as number) || 35;
  const ageGroup = (answers.ageGroup as string) || "senior";
  const species = quiz.species || "dog";
  const petLabel =
    species === "dog" ? "dog" : species === "cat" ? "cat" : "horse";

  // Derive weight band text
  let weightBandLabel = "";
  if (species === "dog") {
    if (weightLbs <= 20) weightBandLabel = "Small · Up to 20 lbs";
    else if (weightLbs <= 50) weightBandLabel = "Medium · 21 to 50 lbs";
    else if (weightLbs <= 90) weightBandLabel = "Large · 51 to 90 lbs";
    else weightBandLabel = "Extra Large · 91+ lbs";
  } else if (species === "cat") {
    weightBandLabel = "Standard Feline · 5 to 20 lbs";
  } else {
    weightBandLabel = "Standard Equine · 800 to 1,400 lbs";
  }

  const selectedAnswer = answers[currentQuestion.id];
  const canContinue = isPetProfile
    ? petName.trim().length > 0 && Number(weightLbs) > 0
    : selectedAnswer !== undefined;

  return (
    <div
      className={`rounded-card border border-border bg-bg-elevated p-6 sm:p-10 text-fg shadow-card ${className}`}
      data-testid="quiz-question"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Top Header: Step & Exit */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Step {progress.currentStep} of {progress.totalSteps}
            </span>
            <span className="text-xs text-border" aria-hidden="true">
              ·
            </span>
            <span className="text-xs font-medium text-fg-muted">
              {currentQuestion.stepTitle}
            </span>
          </div>

          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="text-xs font-medium text-fg-muted hover:text-fg min-h-11 px-3 inline-flex items-center cursor-pointer transition-colors"
              aria-label="Exit quiz"
            >
              Exit quiz ✕
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div
            role="progressbar"
            aria-valuenow={progress.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Quiz progress: ${progress.progressPercent}%`}
            className="h-2 w-full rounded-full bg-border overflow-hidden"
          >
            <div
              className="h-full bg-gradient-gold transition-all duration-300 ease-out"
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Titles */}
        <div className="space-y-2">
          <span className="label text-xs font-bold uppercase tracking-wider text-fg-muted">
            Question {progress.currentStep}
          </span>
          <h2 className="title text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
            {currentQuestion.title}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-sm sm:text-base text-fg-muted leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          )}
        </div>

        {/* Options / Inputs */}
        {isPetProfile ? (
          <div className="space-y-6 pt-2">
            {/* Pet Name Field */}
            <div className="space-y-2">
              <label
                htmlFor={`${componentId}-pet-name`}
                className="block text-sm font-bold uppercase tracking-wider text-fg"
              >
                What is your {petLabel}&apos;s name?
              </label>
              <input
                id={`${componentId}-pet-name`}
                type="text"
                placeholder={
                  species === "dog"
                    ? "Max"
                    : species === "cat"
                      ? "Luna"
                      : "Thunder"
                }
                value={petName}
                onChange={(e) => onAnswer("petName", e.target.value)}
                className="w-full rounded-field border border-border bg-bg px-4 py-3 text-fg placeholder:text-fg-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-11 text-base font-medium"
              />
            </div>

            {/* Pet Weight Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`${componentId}-pet-weight`}
                  className="block text-sm font-bold uppercase tracking-wider text-fg"
                >
                  How much does {petName || `your ${petLabel}`} weigh?
                </label>
                <span className="text-xs font-medium text-accent">
                  {weightBandLabel}
                </span>
              </div>
              <div className="relative">
                <input
                  id={`${componentId}-pet-weight`}
                  type="number"
                  min={1}
                  max={2500}
                  value={weightLbs}
                  onChange={(e) =>
                    onAnswer("weightLbs", Number(e.target.value))
                  }
                  className="w-full rounded-field border border-border bg-bg px-4 py-3 pr-14 text-fg placeholder:text-fg-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-11 text-base font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-fg-muted pointer-events-none">
                  lbs
                </span>
              </div>
              {currentQuestion.helpText && (
                <p className="text-xs text-fg-muted flex items-start gap-1.5 mt-1.5">
                  <HelpCircle
                    className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{currentQuestion.helpText}</span>
                </p>
              )}
            </div>

            {/* Pet Age Field */}
            <fieldset className="space-y-2.5">
              <legend className="text-sm font-bold uppercase tracking-wider text-fg mb-2">
                How old is {petName || `your ${petLabel}`}?
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = ageGroup === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onAnswer("ageGroup", opt.id)}
                      className={`flex flex-col text-left rounded-card border p-4 transition-all min-h-11 cursor-pointer ${
                        isSelected
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border bg-bg hover:border-fg-muted/40"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-fg">{opt.label}</span>
                        {isSelected && (
                          <Check
                            className="h-4 w-4 text-accent"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      {opt.description && (
                        <span className="text-xs text-fg-muted mt-1">
                          {opt.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        ) : (
          <fieldset className="space-y-3 pt-2">
            <legend className="sr-only">{currentQuestion.title}</legend>
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onAnswer(currentQuestion.id, opt.id)}
                    className={`flex items-start justify-between w-full rounded-card border p-4 text-left transition-all min-h-11 cursor-pointer ${
                      isSelected
                        ? "border-accent bg-accent/10 ring-1 ring-accent"
                        : "border-border bg-bg hover:border-fg-muted/40"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="space-y-1 pr-4">
                      <div className="text-base font-bold text-fg">
                        {opt.label}
                      </div>
                      {opt.description && (
                        <div className="text-xs sm:text-sm text-fg-muted">
                          {opt.description}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-accent bg-accent text-accent-fg"
                            : "border-border bg-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-t border-border/60 pt-6">
          <Button
            type="button"
            variant="secondary"
            size="default"
            onClick={onBack}
            disabled={progress.isFirstStep}
            className="min-h-11 px-5 cursor-pointer"
            aria-label="Previous question"
          >
            <span>← Back</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="default"
            onClick={onNext}
            disabled={!canContinue}
            className="min-h-11 px-6 font-bold cursor-pointer"
            aria-label="Continue to next step"
          >
            <span>Continue →</span>
          </Button>
        </div>

        {/* Small privacy / disclaimer footer */}
        <p className="text-[11px] text-fg-muted text-center pt-2">
          Your answers stay private. We only use them to suggest a personalized
          routine.
        </p>
      </div>
    </div>
  );
}
