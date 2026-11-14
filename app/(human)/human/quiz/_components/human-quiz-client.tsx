"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { QuizDefinition } from "@/lib/quiz";
import type { Product, Kit } from "@/lib/contracts/catalog";
import { QuizWizard } from "@/components/commerce/quiz";
import { QuizHeader } from "./quiz-header";
import { QuizFooter } from "./quiz-footer";

export interface HumanQuizClientProps {
  quiz: QuizDefinition;
  productsMap?: Record<string, Product>;
  kitsMap?: Record<string, Kit>;
  locale?: string;
}

export function HumanQuizClient({
  quiz,
  productsMap = {},
  kitsMap = {},
  locale = "en-US",
}: HumanQuizClientProps) {
  const router = useRouter();

  const handleExit = () => {
    router.push("/human");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <QuizHeader exitHref="/human" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <QuizWizard
          initialQuiz={quiz}
          productsMap={productsMap}
          kitsMap={kitsMap}
          locale={locale}
          onExit={handleExit}
        />
      </main>

      <QuizFooter />
    </div>
  );
}
