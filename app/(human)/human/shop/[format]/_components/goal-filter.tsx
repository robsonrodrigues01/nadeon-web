import Link from "next/link";
import type { CatalogSort } from "@/lib/contracts/catalog";
import { goalHref } from "./shop-url";

export interface GoalFilterItem {
  id: string;
  label: string;
}

export interface GoalFilterProps {
  basePath: string;
  goals: GoalFilterItem[];
  active: string | null;
  sort: CatalogSort;
}

export function GoalFilter({ basePath, goals, active, sort }: GoalFilterProps) {
  const chip = (isActive: boolean) =>
    `inline-flex min-h-11 items-center rounded-pill border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
      isActive
        ? "border-accent bg-accent text-accent-fg"
        : "border-border text-fg hover:border-accent"
    }`;

  return (
    <nav aria-label="Filter by goal">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={goalHref(basePath, null, sort)}
            aria-current={active === null ? "true" : undefined}
            className={chip(active === null)}
          >
            All
          </Link>
        </li>
        {goals.map((goal) => (
          <li key={goal.id}>
            <Link
              href={goalHref(basePath, goal.id, sort)}
              aria-current={active === goal.id ? "true" : undefined}
              className={chip(active === goal.id)}
            >
              {goal.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
