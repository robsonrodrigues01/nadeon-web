import { getQuiz } from "@/lib/quiz";

// Objetivos do filtro vêm da pergunta "goal" do quiz Human. Um produto
// pertence a um objetivo quando alguma regra de recomendação desse objetivo
// o cita (principal, secundário ou alternativa). Sem dado de objetivo no
// contrato de produto, esta é a única fonte de dados disponível.
export interface ShopGoal {
  id: string;
  label: string;
  productSlugs: ReadonlySet<string>;
}

export function getHumanShopGoals(): ShopGoal[] {
  const quiz = getQuiz("human");
  const question = quiz?.questions.find((q) => q.id === "goal");
  if (!quiz || !question) return [];

  return question.options.map((option) => {
    const productSlugs = new Set<string>();
    for (const rule of quiz.recommendationRules) {
      if (rule.match.goal !== option.id) continue;
      const slugs = [
        rule.recommendedProductSlug,
        rule.secondaryProductSlug,
        ...(rule.alternatives ?? []).map((a) => a.slug),
      ];
      for (const slug of slugs) {
        if (slug) productSlugs.add(slug);
      }
    }
    return { id: option.id, label: option.label, productSlugs };
  });
}
