import { cookies } from "next/headers";
import { getMarket, DEFAULT_MARKET } from "@/lib/market/markets";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import type { Market } from "@/lib/market/types";

/** Market chosen by the visitor (nadeon_market cookie), falling back to the default market. */
export async function getRequestMarket(): Promise<Market> {
  try {
    const store = await cookies();
    return getMarket(store.get(MARKET_COOKIE_NAME)?.value) ?? DEFAULT_MARKET;
  } catch {
    // cookies() is unavailable outside a request (e.g. static analysis)
    return DEFAULT_MARKET;
  }
}
