"use client";

import React, { useEffect, useState } from "react";
import type { QuizDefinition, QuizAnswers } from "@/lib/quiz";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Claim } from "@/components/commerce/product-card/claim";

export interface QuizAnalyzingProps {
  quiz: QuizDefinition;
  answers: QuizAnswers;
  onComplete: () => void;
  autoTransitionMs?: number;
  className?: string;
}

export function QuizAnalyzing({
  quiz,
  answers,
  onComplete,
  autoTransitionMs = 1800,
  className = "",
}: QuizAnalyzingProps) {
  const isHuman = quiz.line === "human";
  const petName = (answers.petName as string) || "your pet";

  // Simulate progress step states
  const [stepState, setStepState] = useState<number>(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStepState(2), autoTransitionMs * 0.4);
    const timer2 = setTimeout(() => {
      setStepState(3);
      onComplete();
    }, autoTransitionMs);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [autoTransitionMs, onComplete]);

  return (
    <div
      className={`rounded-card border border-border bg-bg-elevated p-6 sm:p-10 text-fg shadow-card ${className}`}
      data-testid="quiz-analyzing"
      role="status"
      aria-live="polite"
    >
      <div className="max-w-xl mx-auto space-y-8 text-center sm:text-left">
        {/* Top Tag */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Analyzing
          </span>
          <span className="text-xs text-fg-muted font-medium uppercase tracking-wider">
            Almost there
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="title text-2xl sm:text-3xl font-extrabold text-fg">
            {isHuman
              ? "Analyzing your answers"
              : `Analyzing answers for ${petName}`}
          </h2>
          <p className="text-sm sm:text-base text-fg-muted">
            {isHuman
              ? "Hang tight, this takes a few seconds. We are building your routine."
              : `Hang tight, this takes a few seconds. We are building a plan for ${petName}.`}
          </p>
        </div>

        {/* Step Progress List */}
        <div className="rounded-card border border-border bg-bg p-5 sm:p-6 space-y-4 text-left">
          {/* Step 1 */}
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-fg">
                {isHuman
                  ? "Reading your goal and age"
                  : `Reading age and weight for ${petName}`}
              </p>
              <p className="text-xs text-fg-muted">
                {isHuman
                  ? "Calibrating cellular NAD+ baseline"
                  : `${petName}, ${answers.weightLbs || 35} lbs`}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-pill bg-accent/20 px-2.5 py-1 text-xs font-bold text-accent">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Done
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-fg">Matching formulas</p>
              <p className="text-xs text-fg-muted">
                Comparing primary focus with our clinical options
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-bold ${
                stepState >= 2
                  ? "bg-accent/20 text-accent"
                  : "bg-border text-fg-muted"
              }`}
            >
              {stepState >= 2 ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Done
                </>
              ) : (
                <>
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  In progress
                </>
              )}
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-fg">
                {isHuman
                  ? "Building your daily routine"
                  : "Calculating dose by weight"}
              </p>
              <p className="text-xs text-fg-muted">
                Schedule morning and evening timing
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-bold ${
                stepState >= 3
                  ? "bg-accent/20 text-accent"
                  : "bg-border text-fg-muted"
              }`}
            >
              {stepState >= 3 ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Done
                </>
              ) : (
                "Next"
              )}
            </span>
          </div>
        </div>

        {/* Educational Did You Know Box */}
        <div className="rounded-card border border-accent/30 bg-accent/5 p-4 sm:p-5 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Did you know?</span>
          </div>
          <p className="text-xs sm:text-sm text-fg leading-relaxed">
            <Claim>
              {isHuman
                ? "Cellular NAD+ levels decline up to 50% between youth and middle age. Daily replenishment supports mitochondrial energy production and DNA repair."
                : `Like humans, pets experience age-related NAD+ decline. Weight-calibrated supplementation helps maintain cellular energy and active mobility for ${petName}.`}
            </Claim>
          </p>
        </div>

        {/* Footer info & manual advance button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fg-muted">
          <span>
            Please keep this page open. Your results will appear automatically.
          </span>
          <button
            type="button"
            onClick={onComplete}
            className="text-accent underline underline-offset-4 hover:opacity-80 min-h-11 px-2 inline-flex items-center cursor-pointer"
          >
            View results now →
          </button>
        </div>
      </div>
    </div>
  );
}
