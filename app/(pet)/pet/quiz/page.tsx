import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { getQuiz } from "@/lib/quiz";
import { catalogProvider } from "@/lib/providers";
import type { Product, Kit } from "@/lib/contracts/catalog";
import { PetQuizClient } from "./_components/pet-quiz-client";

// Textos do quiz vêm de data/quiz.json (proposta, aguardando aprovação do Robson).
const petQuiz = getQuiz("dog");

export const metadata: Metadata = petQuiz
  ? buildMetadata({
      title: petQuiz.title,
      description: petQuiz.supportingText,
      pathname: "/pet/quiz",
    })
  : buildMetadata({ title: "Quiz", pathname: "/pet/quiz" });

export default async function PetQuizPage() {
  if (!petQuiz) {
    notFound();
  }

  const [products, kits] = await Promise.all([
    catalogProvider.getProducts({ line: "pet" }),
    catalogProvider.getKits("pet"),
  ]);

  const productsMap: Record<string, Product> = {};
  for (const product of products) {
    productsMap[product.slug] = product;
  }

  const kitsMap: Record<string, Kit> = {};
  for (const kit of kits) {
    kitsMap[kit.slug] = kit;
  }

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Pet", url: "/pet" },
    { name: "Quiz", url: "/pet/quiz" },
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbsJsonLd as unknown as Record<string, unknown>}
        id="pet-quiz-breadcrumbs"
      />
      <PetQuizClient
        quiz={petQuiz}
        productsMap={productsMap}
        kitsMap={kitsMap}
      />
    </>
  );
}
