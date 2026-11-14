"use client";

import React from "react";
import type { QuizDefinition } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle, ShieldCheck } from "lucide-react";

export interface QuizStartProps {
  quiz: QuizDefinition;
  availablePetQuizzes?: QuizDefinition[];
  onStart: (quizId?: string) => void;
  className?: string;
}

export function QuizStart({ quiz, onStart, className = "" }: QuizStartProps) {
  const isHuman = quiz.line === "human";
  const questionCount = quiz.questions.length;
  const minutes = Math.max(1, quiz.estimatedMinutes);

  return (
    <div
      className={`rounded-card border border-border bg-bg-elevated p-6 sm:p-10 text-fg shadow-card ${className}`}
      data-testid="quiz-start"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {isHuman ? "Free Routine Quiz" : "Free Pet Quiz"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border px-3 py-1 text-xs font-medium text-fg-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Takes about {minutes} {minutes === 1 ? "minute" : "minutes"} ·{" "}
            {questionCount} questions
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border px-3 py-1 text-xs font-medium text-accent">
            10% off at the end
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="title text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-fg">
            {quiz.promiseHeadline}
          </h1>
          <p className="text-base sm:text-lg text-fg-muted leading-relaxed">
            {quiz.supportingText}
          </p>
        </div>

        {/* Action Area */}
        {isHuman ? (
          <div className="space-y-4 pt-2">
            <div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => onStart(quiz.id)}
                className="w-full sm:w-auto min-h-11 px-8 py-3.5 text-base font-bold shadow-card cursor-pointer"
                aria-label="Start the quiz"
              >
                <span>Start the quiz →</span>
              </Button>
            </div>
            <p className="text-xs text-fg-muted flex items-center gap-1.5">
              <ShieldCheck
                className="h-4 w-4 text-accent shrink-0"
                aria-hidden="true"
              />
              <span>
                Your answers stay private. We only use them to suggest a
                routine.
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-fg-muted mb-3">
                Who is this quiz for? Pick one to start
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Dog Option */}
                <div className="flex flex-col justify-between rounded-card border border-border bg-bg p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-fg">Dog</h3>
                    <p className="text-xs text-fg-muted mt-1">
                      Puppy to senior, every size
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="default"
                    onClick={() => onStart("dog")}
                    className="w-full min-h-11 cursor-pointer"
                    aria-label="Start dog quiz"
                  >
                    <span>Start dog quiz →</span>
                  </Button>
                </div>

                {/* Cat Option */}
                <div className="flex flex-col justify-between rounded-card border border-border bg-bg p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-fg">Cat</h3>
                    <p className="text-xs text-fg-muted mt-1">
                      Kitten to senior drops
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="default"
                    onClick={() => onStart("cat")}
                    className="w-full min-h-11 cursor-pointer"
                    aria-label="Start cat quiz"
                  >
                    <span>Start cat quiz →</span>
                  </Button>
                </div>

                {/* Horse Option */}
                <div className="flex flex-col justify-between rounded-card border border-border bg-bg p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-fg">Horse</h3>
                    <p className="text-xs text-fg-muted mt-1">
                      Pleasure, sport and senior
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="default"
                    onClick={() => onStart("horse")}
                    className="w-full min-h-11 cursor-pointer"
                    aria-label="Start horse quiz"
                  >
                    <span>Start horse quiz →</span>
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-xs text-fg-muted flex items-center gap-1.5">
              <ShieldCheck
                className="h-4 w-4 text-accent shrink-0"
                aria-hidden="true"
              />
              <span>
                Your answers stay private. We only use them to suggest a plan
                for your pet.
              </span>
            </p>
          </div>
        )}

        {/* What you'll get preview */}
        <div className="border-t border-border/60 pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-fg-muted mb-4">
            What you will get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-fg-muted">
            <div className="rounded-card border border-border/40 p-3 bg-bg/50">
              <p className="font-bold text-fg mb-1">
                {isHuman ? "Personalized Routine" : "Custom Pet Plan"}
              </p>
              <p>Formulas matched specifically to age and primary goals.</p>
            </div>
            <div className="rounded-card border border-border/40 p-3 bg-bg/50">
              <p className="font-bold text-fg mb-1">
                {isHuman ? "When to Take It" : "Dosed by Weight"}
              </p>
              <p>
                {isHuman
                  ? "Simple morning and lunch schedule for peak energy."
                  : "Precise daily doses and morning/dinner routine."}
              </p>
            </div>
            <div className="rounded-card border border-border/40 p-3 bg-bg/50">
              <p className="font-bold text-fg mb-1">Exclusive 10% Off</p>
              <p>Quiz results code saved to your email for your first order.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
