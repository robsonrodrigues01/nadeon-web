"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { QuizDefinition } from "@/lib/quiz";
import type { Product, Kit } from "@/lib/contracts/catalog";
import { QuizWizard } from "@/components/commerce/quiz";

export interface PetQuizClientProps {
  quiz: QuizDefinition;
  productsMap?: Record<string, Product>;
  kitsMap?: Record<string, Kit>;
}

export function PetQuizClient({
  quiz,
  productsMap = {},
  kitsMap = {},
}: PetQuizClientProps) {
  const router = useRouter();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8 sm:py-12">
      <QuizWizard
        initialQuiz={quiz}
        productsMap={productsMap}
        kitsMap={kitsMap}
        onExit={() => router.push("/pet")}
      />
    </main>
  );
}
