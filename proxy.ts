import { NextResponse, type NextRequest } from "next/server";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import { getMarketForCountry } from "@/lib/market/markets";

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

/** Sets the visitor market once, from the country Vercel detects, so non-US buyers see the international notices. */
export function proxy(request: NextRequest) {
  if (request.cookies.has(MARKET_COOKIE_NAME)) return NextResponse.next();

  const market = getMarketForCountry(
    request.headers.get("x-vercel-ip-country")
  );
  if (!market) return NextResponse.next();

  request.cookies.set(MARKET_COOKIE_NAME, market.id);
  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.cookies.set(MARKET_COOKIE_NAME, market.id, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
    secure: true,
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|renders|favicon.ico).*)"],
};
