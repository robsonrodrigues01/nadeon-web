import type { Money, Product, DosingRange } from "@/lib/contracts/catalog";
import type { Pet } from "@/lib/contracts/account";
import type { ActivityLevel, PetSpecies } from "@/lib/dosing/types";
import quiz from "@/data/quiz.json";

export interface PetView {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  ageYears?: number;
  weightLbs?: number;
  activityLevel: ActivityLevel;
  concerns: string[];
  birthDate?: string;
  photoUrl?: string;
  photoSrc?: string;
}

export interface ProductView {
  slug: string;
  name: string;
  format: string;
  species: PetSpecies;
  benefit?: string;
  variantId: string;
  price: Money;
  dosingByWeight: DosingRange[];
}

// Rótulos de "foco de saúde" vêm das perguntas de preocupação do quiz pet.
export function petConcernOptions(): string[] {
  const labels = new Set<string>();
  const quizzes = (quiz as { quizzes: Record<string, unknown> }).quizzes;
  for (const species of ["dog", "cat", "horse"]) {
    const questions =
      (
        quizzes[species] as {
          questions?: { id: string; options: { label: string }[] }[];
        }
      )?.questions ?? [];
    for (const question of questions) {
      if (question.id !== "concern") continue;
      for (const option of question.options) labels.add(option.label);
    }
  }
  return [...labels];
}

const BIRTH_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

// Idade em anos inteiros quando a data tem ano. "--MM-DD" não informa idade.
export function ageInYears(
  birthDate: string | undefined,
  now: Date
): number | undefined {
  const match = birthDate?.match(BIRTH_DATE);
  if (!match) return undefined;
  const born = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
  if (Number.isNaN(born.getTime()) || born > now) return undefined;
  let years = now.getUTCFullYear() - born.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < born.getUTCMonth() ||
    (now.getUTCMonth() === born.getUTCMonth() &&
      now.getUTCDate() < born.getUTCDate());
  if (beforeBirthday) years -= 1;
  return years;
}

export function toPetView(
  pet: Pet,
  now: Date,
  photoExists: (src: string) => boolean = (src) => Boolean(src)
): PetView {
  const photoSrc =
    pet.photoUrl && photoExists(pet.photoUrl) ? pet.photoUrl : undefined;
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    ageYears: ageInYears(pet.birthDate, now),
    weightLbs: pet.weightLbs,
    activityLevel: pet.activityLevel ?? "moderate",
    concerns: pet.concerns,
    birthDate: BIRTH_DATE.test(pet.birthDate ?? "") ? pet.birthDate : undefined,
    photoUrl: pet.photoUrl,
    photoSrc,
  };
}

// Um produto pet entra na seção só com a variante inicial e preço do catálogo.
export function toProductView(product: Product): ProductView | null {
  const variant = product.variants[0];
  if (!variant || product.species === null) return null;
  return {
    slug: product.slug,
    name: product.name,
    format: product.format,
    species: product.species,
    benefit: product.benefits[0],
    variantId: variant.id,
    price: variant.price,
    dosingByWeight: product.dosingByWeight,
  };
}

// Focos já salvos entram nas opções, para o formulário não apagar nenhum ao editar.
export function concernChoices(
  options: string[],
  pets: { concerns: string[] }[]
): string[] {
  return [...new Set([...options, ...pets.flatMap((pet) => pet.concerns)])];
}
