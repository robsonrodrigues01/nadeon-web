import type { CatalogSort } from "@/lib/contracts/catalog";

// Monta a URL da listagem preservando ordenação e objetivo. Sem dependências
// de dados, para poder ser importado também pelo componente cliente.
export function goalHref(
  basePath: string,
  goal: string | null,
  sort: CatalogSort
): string {
  const params = new URLSearchParams();
  if (sort !== "featured") params.set("sort", sort);
  if (goal) params.set("goal", goal);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
