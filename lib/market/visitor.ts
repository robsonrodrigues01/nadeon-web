import { cookies } from "next/headers";
import { MARKET_COOKIE_NAME } from "./cookies";
import { DEFAULT_MARKET, getMarket } from "./markets";
import type { Market } from "./types";

/**
 * Mercado do visitante, lido do cookie no servidor. Use só em páginas de servidor
 * e passe o mercado como prop para componentes cliente (não há MarketProvider no layout).
 */
export async function getVisitorMarket(): Promise<Market> {
  const store = await cookies();
  return getMarket(store.get(MARKET_COOKIE_NAME)?.value) ?? DEFAULT_MARKET;
}
