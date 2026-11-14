// Preço sempre pela moeda do mercado, via Intl (AGENTS.md regra 7).
export function formatPrice(
  amount: number,
  currencyCode: string,
  locale = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}
