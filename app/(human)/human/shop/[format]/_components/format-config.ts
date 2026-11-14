// Formatos da página Shop by format (catálogo 5.2). O valor de `catalogFormat`
// é o mesmo campo `format` dos produtos no CatalogProvider.
export interface ShopFormat {
  slug: string;
  label: string;
  catalogFormat: string;
  faqTitle: string;
}

export const SHOP_FORMATS: readonly ShopFormat[] = [
  {
    slug: "capsules",
    label: "Capsules",
    catalogFormat: "Capsules",
    faqTitle: "Capsule questions",
  },
  {
    slug: "powders",
    label: "Powders",
    catalogFormat: "Powders",
    faqTitle: "Powder questions",
  },
  {
    slug: "tinctures",
    label: "Tinctures",
    catalogFormat: "Tinctures",
    faqTitle: "Tincture questions",
  },
];

const BY_SLUG = new Map(SHOP_FORMATS.map((f) => [f.slug, f]));

export function getShopFormat(slug: string): ShopFormat | null {
  return BY_SLUG.get(slug) ?? null;
}
