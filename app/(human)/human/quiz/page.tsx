import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { getQuiz } from "@/lib/quiz";
import { catalogProvider } from "@/lib/providers";
import type { Product, Kit } from "@/lib/contracts/catalog";
import { HumanQuizClient } from "./_components/human-quiz-client";

export const metadata: Metadata = buildMetadata({
  title: "Human NAD+ Routine Quiz | Nadeon Labs",
  description:
    "Take our 60-second quiz to find your personalized cellular longevity and NAD+ routine.",
  pathname: "/human/quiz",
});

export default async function HumanQuizPage() {
  const quiz = getQuiz("human");
  if (!quiz) {
    notFound();
  }

  const [products, kits] = await Promise.all([
    catalogProvider.getProducts({ line: "human" }),
    catalogProvider.getKits("human"),
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
    { name: "Human", url: "/human" },
    { name: "Quiz", url: "/human/quiz" },
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbsJsonLd as unknown as Record<string, unknown>}
        id="human-quiz-breadcrumbs"
      />
      <HumanQuizClient
        quiz={quiz}
        productsMap={productsMap}
        kitsMap={kitsMap}
      />
    </>
  );
}
