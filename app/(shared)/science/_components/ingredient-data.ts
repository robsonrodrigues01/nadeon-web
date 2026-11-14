import type { Product } from "@/lib/contracts/catalog";

export interface IngredientCard {
  id: string;
  title: string;
  subtitle: string;
  featured: { name: string; technicalName: string } | null;
  whatItIs: string;
  whyWeUse: string;
  findIn: string[];
}

interface IngredientDef {
  id: string;
  title: string;
  subtitle: string;
  // Produto que aparece como destaque do cartão (slug do catálogo).
  featuredSlug: string;
  // Casa o nome do ativo no catálogo, para listar "Find it in" sem texto fixo.
  match: RegExp;
  whatItIs: string;
  whyWeUse: string;
}

const INGREDIENTS: IngredientDef[] = [
  {
    id: "nmn",
    title: "NMN",
    subtitle: "Nicotinamide mononucleotide",
    featuredSlug: "biohack",
    match: /nicotinamide mononucleotide|\bNMN\b/i,
    whatItIs: "The direct building block of NAD+, one enzyme step away.",
    whyWeUse: "Supports healthy NAD+ levels and cellular energy.*",
  },
  {
    id: "nad",
    title: "NAD+",
    subtitle: "Nicotinamide adenine dinucleotide",
    featuredSlug: "renew",
    match: /NAD\+|nicotinamide adenine dinucleotide/i,
    whatItIs: "The coenzyme itself, in capsule or powder form.",
    whyWeUse: "A direct way to add NAD+ to your routine.*",
  },
  {
    id: "resveratrol",
    title: "Resveratrol",
    subtitle: "Trans-resveratrol",
    featuredSlug: "full-charge",
    match: /resveratrol/i,
    whatItIs: "A plant polyphenol, found in grape skins and Japanese knotweed.",
    whyWeUse: "Often paired with NMN and NAD+ in healthy aging routines.*",
  },
  {
    id: "tmg",
    title: "TMG",
    subtitle: "Trimethylglycine (betaine)",
    featuredSlug: "full-charge",
    match: /\bTMG\b|trimethylglycine/i,
    whatItIs: "A methyl donor first found in sugar beets.",
    whyWeUse: "Supports normal methylation, which NMN metabolism relies on.*",
  },
];

// Monta os cartões a partir do catálogo: nada de preço ou nome de produto fixo.
export function buildIngredientCards(products: Product[]): IngredientCard[] {
  return INGREDIENTS.map((def) => {
    const featured = products.find((p) => p.slug === def.featuredSlug);
    const findIn = products.flatMap((p) =>
      p.actives
        .filter((a) => def.match.test(a.name))
        .map((a) => `${p.name} ${a.amount}`)
    );
    return {
      id: def.id,
      title: def.title,
      subtitle: def.subtitle,
      featured: featured
        ? { name: featured.name, technicalName: featured.technicalName }
        : null,
      whatItIs: def.whatItIs,
      whyWeUse: def.whyWeUse,
      findIn,
    };
  });
}
