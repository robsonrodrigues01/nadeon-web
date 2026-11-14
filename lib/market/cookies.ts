export const MARKET_COOKIE_NAME = "nadeon_market";

/**
 * Reads the market identifier stored in document.cookie or an explicit cookie string.
 */
export function getMarketCookie(cookieHeader?: string): string | null {
  const source =
    cookieHeader !== undefined
      ? cookieHeader
      : typeof document !== "undefined"
        ? document.cookie
        : "";

  if (!source) return null;

  const prefix = `${MARKET_COOKIE_NAME}=`;
  const cookies = source.split(";");

  for (const rawCookie of cookies) {
    const trimmed = rawCookie.trim();
    if (trimmed.startsWith(prefix)) {
      const value = trimmed.substring(prefix.length);
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }

  return null;
}

/**
 * Sets the market cookie on document.cookie with a 365-day lifespan.
 */
export function setMarketCookie(marketId: string, days = 365): void {
  if (typeof document === "undefined") return;

  const maxAge = days * 24 * 60 * 60;
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";

  document.cookie = `${MARKET_COOKIE_NAME}=${encodeURIComponent(
    marketId
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;
}
