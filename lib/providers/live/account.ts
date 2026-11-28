import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  type AccountProvider,
  type Address,
  type CustomerProfile,
  CustomerProfileSchema,
  type GuestOrderLookupInput,
  type GuestOrderTracking,
  type Order,
  type OrderLine,
  type Pet,
  type PetInput,
  type PetProfileProvider,
  type ProfileInput,
  type Session,
  SessionSchema,
} from "@/lib/contracts/account";
import { NOT_IMPLEMENTED_MSG } from "./browser";

export const CUSTOMER_ACCOUNT_API_VERSION = "2026-10";
export const CUSTOMER_ACCOUNT_SCOPE = "openid email customer-account-api:full";

export const AUTH_PKCE_COOKIE_NAME = "nadeon_ca_pkce";

export const SESSION_COOKIE_NAMES = {
  accessToken: "nadeon_ca_access_token",
  refreshToken: "nadeon_ca_refresh_token",
  expiresAt: "nadeon_ca_expires_at",
  idToken: "nadeon_ca_id_token",
  customerId: "nadeon_ca_customer_id",
} as const;

const PKCE_COOKIE_MAX_AGE_SECONDS = 60 * 10;
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const ACCESS_TOKEN_EXPIRY_BUFFER_MS = 60_000;
const DISCOVERY_CACHE_TTL_MS = 60 * 60 * 1000;
const DEFAULT_RETURN_TO = "/account";

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

const PKCE_COOKIE_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: PKCE_COOKIE_MAX_AGE_SECONDS,
};

const SESSION_COOKIE_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
};

export interface CookieStoreAdapter {
  get(name: string): { value: string } | undefined;
  set?(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "lax" | "strict" | "none";
      path?: string;
      maxAge?: number;
    }
  ): void;
  delete?(name: string): void;
}

export interface LiveAccountProviderOptions {
  shopId?: string;
  clientId?: string;
  storeDomain?: string;
  fetchImpl?: typeof fetch;
  cookies?: CookieStoreAdapter;
  headersImpl?: () => Promise<Headers> | Headers;
  redirectImpl?: (url: string) => never;
}

export interface CustomerAccountConfig {
  shopId: string;
  clientId: string;
  storeDomain?: string;
}

const OidcDiscoverySchema = z.object({
  authorization_endpoint: z.string().url(),
  token_endpoint: z.string().url(),
  end_session_endpoint: z.string().url(),
  issuer: z.string().optional(),
});
type OidcDiscovery = z.infer<typeof OidcDiscoverySchema>;

const CustomerApiDiscoverySchema = z.object({
  graphql_api: z.string().url(),
});
type CustomerApiDiscovery = z.infer<typeof CustomerApiDiscoverySchema>;

const PkceStateSchema = z.object({
  state: z.string().min(1),
  nonce: z.string().min(1),
  codeVerifier: z.string().min(1),
  returnTo: z.string().min(1),
});

const TokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1).optional(),
  expires_in: z.number().positive().optional(),
  id_token: z.string().min(1).optional(),
});

interface ShopifyRawCustomer {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: {
    emailAddress?: string | null;
  } | null;
  phoneNumber?: {
    phoneNumber?: string | null;
  } | null;
  defaultAddress?: {
    id?: string | null;
  } | null;
}

const GET_CUSTOMER_PROFILE_QUERY = `
  query GetCustomerProfile {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        id
      }
    }
  }
`;

const GET_CUSTOMER_ID_QUERY = `
  query GetCustomerId {
    customer {
      id
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation CustomerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        defaultAddress {
          id
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

// Scoped by fetch implementation so production caches across requests while
// tests using distinct mock fetch functions remain isolated.
const oidcCacheByFetch = new WeakMap<
  typeof fetch,
  Map<string, CacheEntry<OidcDiscovery>>
>();
const apiCacheByFetch = new WeakMap<
  typeof fetch,
  Map<string, CacheEntry<CustomerApiDiscovery>>
>();

function getOrCreateCacheMap<T>(
  weakMap: WeakMap<typeof fetch, Map<string, CacheEntry<T>>>,
  fetchFn: typeof fetch
): Map<string, CacheEntry<T>> {
  let map = weakMap.get(fetchFn);
  if (!map) {
    map = new Map();
    weakMap.set(fetchFn, map);
  }
  return map;
}

export function getCustomerAccountConfig(
  overrides?: Pick<
    LiveAccountProviderOptions,
    "shopId" | "clientId" | "storeDomain"
  >
): CustomerAccountConfig {
  const shopId = (
    overrides?.shopId ??
    process.env.SHOPIFY_SHOP_ID ??
    ""
  ).trim();
  const clientId = (
    overrides?.clientId ??
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ??
    ""
  ).trim();
  const storeDomain = (
    overrides?.storeDomain ??
    process.env.SHOPIFY_STORE_DOMAIN ??
    ""
  ).trim();

  if (!shopId || !/^\d+$/.test(shopId) || !clientId) {
    throw new Error(
      "Shopify Customer Account configuration error: SHOPIFY_SHOP_ID (numeric) and SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID are required."
    );
  }

  return {
    shopId,
    clientId,
    storeDomain: storeDomain || undefined,
  };
}

/**
 * Accepts only same-site relative paths starting with a single slash to prevent
 * open redirects after login.
 */
export function sanitizeReturnTo(returnTo?: string | null): string {
  if (typeof returnTo !== "string") return DEFAULT_RETURN_TO;
  const trimmed = returnTo.trim();
  if (!trimmed) return DEFAULT_RETURN_TO;
  if (/[\u0000-\u001F\u007F\\]/.test(trimmed)) return DEFAULT_RETURN_TO;
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return DEFAULT_RETURN_TO;
  }

  try {
    const parsed = new URL(trimmed, "https://nadeon.invalid");
    if (parsed.origin !== "https://nadeon.invalid") {
      return DEFAULT_RETURN_TO;
    }
    if (!parsed.pathname.startsWith("/") || parsed.pathname.startsWith("//")) {
      return DEFAULT_RETURN_TO;
    }
    if (parsed.pathname.startsWith("/account/auth")) {
      return DEFAULT_RETURN_TO;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return DEFAULT_RETURN_TO;
  }
}

function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

function computeS256Challenge(verifier: string): string {
  return crypto
    .createHash("sha256")
    .update(verifier, "ascii")
    .digest("base64url");
}

function safeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Decodes the JWT payload without signature verification.
 * The id_token is obtained directly over TLS from Shopify's token_endpoint
 * during the server-to-server authorization_code exchange (OIDC Core 3.1.3.7).
 */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) {
    throw new Error("Invalid JWT format");
  }
  const json = Buffer.from(parts[1], "base64url").toString("utf8");
  const parsed: unknown = JSON.parse(json);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid JWT payload");
  }
  return parsed as Record<string, unknown>;
}

export function resolveRequestOrigin(request: NextRequest): string {
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();

  if (
    forwardedProto &&
    (forwardedProto === "https" || forwardedProto === "http") &&
    forwardedHost &&
    !/[\s/@\\]/.test(forwardedHost)
  ) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

function resolveOriginFromHeaders(headers: Headers): string {
  const forwardedProto = headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const forwardedHost = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || headers.get("host")?.split(",")[0]?.trim();

  if (host && !/[\s/@\\]/.test(host)) {
    const proto =
      forwardedProto === "http" || forwardedProto === "https"
        ? forwardedProto
        : host.startsWith("localhost") || host.startsWith("127.0.0.1")
          ? "http"
          : "https";
    return `${proto}://${host}`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    try {
      return new URL(siteUrl).origin;
    } catch {
      // fall through
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return vercelUrl.startsWith("http")
      ? new URL(vercelUrl).origin
      : `https://${vercelUrl}`;
  }

  return "https://www.nadeonlabs.com";
}

export async function discoverOidcConfig(
  shopId: string,
  fetchImpl?: typeof fetch
): Promise<OidcDiscovery> {
  const fetchFn = fetchImpl ?? globalThis.fetch;
  const cache = getOrCreateCacheMap(oidcCacheByFetch, fetchFn);
  const cached = cache.get(shopId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const discoveryUrl = `https://shopify.com/authentication/${shopId}/.well-known/openid-configuration`;
  const response = await fetchFn(discoveryUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 3600, tags: ["shopify-customer-oidc"] },
  } as RequestInit & { next?: { revalidate?: number; tags?: string[] } });

  if (!response.ok) {
    throw new Error(
      `Shopify Customer Account OIDC discovery failed (${response.status})`
    );
  }

  const parsed = OidcDiscoverySchema.parse(await response.json());
  cache.set(shopId, {
    expiresAt: Date.now() + DISCOVERY_CACHE_TTL_MS,
    value: parsed,
  });
  return parsed;
}

export async function discoverCustomerApiConfig(
  shopId: string,
  fetchImpl?: typeof fetch
): Promise<CustomerApiDiscovery> {
  const fetchFn = fetchImpl ?? globalThis.fetch;
  const cache = getOrCreateCacheMap(apiCacheByFetch, fetchFn);
  const cached = cache.get(shopId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const discoveryUrl = `https://shopify.com/${shopId}/.well-known/customer-account-api`;
  const response = await fetchFn(discoveryUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 3600, tags: ["shopify-customer-api"] },
  } as RequestInit & { next?: { revalidate?: number; tags?: string[] } });

  if (!response.ok) {
    return {
      graphql_api: `https://shopify.com/${shopId}/account/customer/api/${CUSTOMER_ACCOUNT_API_VERSION}/graphql`,
    };
  }

  const parsed = CustomerApiDiscoverySchema.parse(await response.json());
  cache.set(shopId, {
    expiresAt: Date.now() + DISCOVERY_CACHE_TTL_MS,
    value: parsed,
  });
  return parsed;
}

async function executeCustomerGraphql<T>(
  shopId: string,
  accessToken: string,
  query: string,
  variables: Record<string, unknown> = {},
  fetchImpl?: typeof fetch
): Promise<{ status: number; data: T | null }> {
  const fetchFn = fetchImpl ?? globalThis.fetch;
  const { graphql_api: endpoint } = await discoverCustomerApiConfig(
    shopId,
    fetchFn
  );

  const response = await fetchFn(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 401 || response.status === 403) {
    return { status: response.status, data: null };
  }

  if (!response.ok) {
    throw new Error(
      `Shopify Customer Account GraphQL request failed (${response.status})`
    );
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    throw new Error(
      `Shopify Customer Account GraphQL error: ${payload.errors.map((e) => e.message).join("; ")}`
    );
  }

  return { status: response.status, data: payload.data ?? null };
}

function mapShopifyCustomer(raw: ShopifyRawCustomer): CustomerProfile {
  return CustomerProfileSchema.parse({
    id: raw.id,
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    email: raw.emailAddress?.emailAddress ?? "",
    phone: raw.phoneNumber?.phoneNumber ?? undefined,
    profileType: "Both",
    defaultAddressId: raw.defaultAddress?.id ?? undefined,
  });
}

function clearPkceCookie(response: NextResponse): void {
  response.cookies.set(AUTH_PKCE_COOKIE_NAME, "", {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 0,
  });
}

function clearSessionCookiesOnResponse(response: NextResponse): void {
  for (const name of Object.values(SESSION_COOKIE_NAMES)) {
    response.cookies.set(name, "", {
      ...BASE_COOKIE_OPTIONS,
      maxAge: 0,
    });
  }
  clearPkceCookie(response);
}

function clearSessionCookiesOnStore(store: CookieStoreAdapter): void {
  for (const name of Object.values(SESSION_COOKIE_NAMES)) {
    try {
      if (typeof store.set === "function") {
        store.set(name, "", { ...BASE_COOKIE_OPTIONS, maxAge: 0 });
      } else {
        store.delete?.(name);
      }
    } catch {
      // Ignore if called in a read-only cookie context
    }
  }
}

function canModifyCookies(
  store: CookieStoreAdapter,
  currentExpiresAt?: string
): boolean {
  if (typeof store.set !== "function") return false;
  try {
    // Probe cookie writability before consuming a potentially single-use
    // refresh token. In Server Components, Next.js cookies().set() throws
    // synchronously.
    store.set(
      SESSION_COOKIE_NAMES.expiresAt,
      currentExpiresAt ?? "",
      SESSION_COOKIE_OPTIONS
    );
    return true;
  } catch {
    return false;
  }
}

function writeSessionCookiesToStore(
  store: CookieStoreAdapter,
  values: {
    accessToken: string;
    refreshToken?: string;
    expiresAt: string;
    idToken?: string;
    customerId: string;
  }
): void {
  if (typeof store.set !== "function") return;
  store.set(
    SESSION_COOKIE_NAMES.accessToken,
    values.accessToken,
    SESSION_COOKIE_OPTIONS
  );
  store.set(
    SESSION_COOKIE_NAMES.expiresAt,
    values.expiresAt,
    SESSION_COOKIE_OPTIONS
  );
  store.set(
    SESSION_COOKIE_NAMES.customerId,
    values.customerId,
    SESSION_COOKIE_OPTIONS
  );
  if (values.refreshToken) {
    store.set(
      SESSION_COOKIE_NAMES.refreshToken,
      values.refreshToken,
      SESSION_COOKIE_OPTIONS
    );
  }
  if (values.idToken) {
    store.set(
      SESSION_COOKIE_NAMES.idToken,
      values.idToken,
      SESSION_COOKIE_OPTIONS
    );
  }
}

async function resolveCookieStore(
  override?: CookieStoreAdapter
): Promise<CookieStoreAdapter> {
  if (override) return override;
  const { cookies } = await import("next/headers");
  return (await cookies()) as unknown as CookieStoreAdapter;
}

export async function handleAuthLoginRequest(
  request: NextRequest,
  options?: Pick<
    LiveAccountProviderOptions,
    "shopId" | "clientId" | "fetchImpl"
  >
): Promise<NextResponse> {
  const config = getCustomerAccountConfig(options);
  const fetchFn = options?.fetchImpl ?? globalThis.fetch;
  const returnTo = sanitizeReturnTo(
    request.nextUrl.searchParams.get("returnTo")
  );
  const origin = resolveRequestOrigin(request);
  const redirectUri = `${origin}/account/auth/callback`;

  const discovery = await discoverOidcConfig(config.shopId, fetchFn);

  const codeVerifier = generateRandomToken(32);
  const codeChallenge = computeS256Challenge(codeVerifier);
  const state = generateRandomToken(24);
  const nonce = generateRandomToken(24);

  const authorizeUrl = new URL(discovery.authorization_endpoint);
  authorizeUrl.searchParams.set("scope", CUSTOMER_ACCOUNT_SCOPE);
  authorizeUrl.searchParams.set("client_id", config.clientId);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("nonce", nonce);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set(
    AUTH_PKCE_COOKIE_NAME,
    JSON.stringify({ state, nonce, codeVerifier, returnTo }),
    PKCE_COOKIE_OPTIONS
  );
  return response;
}

export async function handleAuthCallbackRequest(
  request: NextRequest,
  options?: Pick<
    LiveAccountProviderOptions,
    "shopId" | "clientId" | "fetchImpl"
  >
): Promise<NextResponse> {
  const config = getCustomerAccountConfig(options);
  const fetchFn = options?.fetchImpl ?? globalThis.fetch;
  const origin = resolveRequestOrigin(request);

  const errorRedirect = () => {
    const res = NextResponse.redirect(`${origin}/account/auth/error`);
    clearPkceCookie(res);
    return res;
  };

  if (request.nextUrl.searchParams.has("error")) {
    return errorRedirect();
  }

  const code = request.nextUrl.searchParams.get("code")?.trim();
  const state = request.nextUrl.searchParams.get("state")?.trim();
  const rawPkce = request.cookies.get(AUTH_PKCE_COOKIE_NAME)?.value;

  if (!code || !state || !rawPkce) {
    return errorRedirect();
  }

  let pkce: z.infer<typeof PkceStateSchema>;
  try {
    pkce = PkceStateSchema.parse(JSON.parse(rawPkce));
  } catch {
    return errorRedirect();
  }

  if (!safeStringEqual(state, pkce.state)) {
    return errorRedirect();
  }

  const safeReturnTo = sanitizeReturnTo(pkce.returnTo);

  try {
    const discovery = await discoverOidcConfig(config.shopId, fetchFn);
    const redirectUri = `${origin}/account/auth/callback`;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: pkce.codeVerifier,
    });

    const tokenRes = await fetchFn(discovery.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      return errorRedirect();
    }

    const tokenParsed = TokenResponseSchema.safeParse(await tokenRes.json());
    if (!tokenParsed.success || !tokenParsed.data.id_token) {
      return errorRedirect();
    }

    const idPayload = decodeJwtPayload(tokenParsed.data.id_token);
    if (
      typeof idPayload.nonce !== "string" ||
      !safeStringEqual(idPayload.nonce, pkce.nonce)
    ) {
      return errorRedirect();
    }

    const customerResult = await executeCustomerGraphql<{
      customer?: { id?: string | null } | null;
    }>(
      config.shopId,
      tokenParsed.data.access_token,
      GET_CUSTOMER_ID_QUERY,
      {},
      fetchFn
    );

    const customerId = customerResult.data?.customer?.id;
    if (!customerId) {
      return errorRedirect();
    }

    const expiresInSeconds = tokenParsed.data.expires_in ?? 3600;
    const expiresAt = new Date(
      Date.now() + expiresInSeconds * 1000
    ).toISOString();

    const response = NextResponse.redirect(`${origin}${safeReturnTo}`);
    clearPkceCookie(response);

    response.cookies.set(
      SESSION_COOKIE_NAMES.accessToken,
      tokenParsed.data.access_token,
      SESSION_COOKIE_OPTIONS
    );
    response.cookies.set(
      SESSION_COOKIE_NAMES.expiresAt,
      expiresAt,
      SESSION_COOKIE_OPTIONS
    );
    response.cookies.set(
      SESSION_COOKIE_NAMES.idToken,
      tokenParsed.data.id_token,
      SESSION_COOKIE_OPTIONS
    );
    response.cookies.set(
      SESSION_COOKIE_NAMES.customerId,
      customerId,
      SESSION_COOKIE_OPTIONS
    );
    if (tokenParsed.data.refresh_token) {
      response.cookies.set(
        SESSION_COOKIE_NAMES.refreshToken,
        tokenParsed.data.refresh_token,
        SESSION_COOKIE_OPTIONS
      );
    }

    return response;
  } catch {
    return errorRedirect();
  }
}

export async function handleAuthLogoutRequest(
  request: NextRequest,
  options?: Pick<
    LiveAccountProviderOptions,
    "shopId" | "clientId" | "fetchImpl"
  >
): Promise<NextResponse> {
  const config = getCustomerAccountConfig(options);
  const fetchFn = options?.fetchImpl ?? globalThis.fetch;
  const origin = resolveRequestOrigin(request);
  const idToken = request.cookies.get(SESSION_COOKIE_NAMES.idToken)?.value;

  let targetUrl = `${origin}/`;
  if (idToken) {
    try {
      const discovery = await discoverOidcConfig(config.shopId, fetchFn);
      const endSession = new URL(discovery.end_session_endpoint);
      endSession.searchParams.set("id_token_hint", idToken);
      endSession.searchParams.set("post_logout_redirect_uri", origin);
      targetUrl = endSession.toString();
    } catch {
      targetUrl = `${origin}/`;
    }
  }

  const response = NextResponse.redirect(targetUrl);
  clearSessionCookiesOnResponse(response);
  return response;
}

export class LiveAccountProvider
  implements AccountProvider, PetProfileProvider
{
  constructor(private options?: LiveAccountProviderOptions) {}

  async getSession(): Promise<Session | null> {
    const config = getCustomerAccountConfig(this.options);
    const fetchFn = this.options?.fetchImpl ?? globalThis.fetch;
    const cookieStore = await resolveCookieStore(this.options?.cookies);

    const accessToken = cookieStore.get(
      SESSION_COOKIE_NAMES.accessToken
    )?.value;
    const refreshToken = cookieStore.get(
      SESSION_COOKIE_NAMES.refreshToken
    )?.value;
    const expiresAt = cookieStore.get(SESSION_COOKIE_NAMES.expiresAt)?.value;
    const existingCustomerId = cookieStore.get(
      SESSION_COOKIE_NAMES.customerId
    )?.value;

    if (!accessToken && !refreshToken) {
      return null;
    }

    const parsedExpiryMs = expiresAt ? Date.parse(expiresAt) : Number.NaN;
    const isUnexpired =
      Boolean(accessToken) &&
      Number.isFinite(parsedExpiryMs) &&
      parsedExpiryMs - ACCESS_TOKEN_EXPIRY_BUFFER_MS > Date.now();

    if (isUnexpired && accessToken && expiresAt) {
      let customerId = existingCustomerId;
      if (!customerId) {
        const res = await executeCustomerGraphql<{
          customer?: { id?: string | null } | null;
        }>(config.shopId, accessToken, GET_CUSTOMER_ID_QUERY, {}, fetchFn);
        customerId = res.data?.customer?.id ?? undefined;
        if (!customerId) {
          return null;
        }
        try {
          cookieStore.set?.(
            SESSION_COOKIE_NAMES.customerId,
            customerId,
            SESSION_COOKIE_OPTIONS
          );
        } catch {
          // Server Components cannot set cookies; return the resolved session safely.
        }
      }

      return SessionSchema.parse({
        accessToken,
        expiresAt,
        customerId,
      });
    }

    if (!refreshToken) {
      return null;
    }

    // Server Components cannot mutate cookies. Skip refreshing there so we do
    // not rotate/consume a single-use refresh token without persisting it, and
    // let the page redirect cleanly to login.
    if (!canModifyCookies(cookieStore, expiresAt)) {
      return null;
    }

    const discovery = await discoverOidcConfig(config.shopId, fetchFn);
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: config.clientId,
      refresh_token: refreshToken,
    });

    const tokenRes = await fetchFn(discovery.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      clearSessionCookiesOnStore(cookieStore);
      return null;
    }

    const tokenParsed = TokenResponseSchema.safeParse(await tokenRes.json());
    if (!tokenParsed.success) {
      clearSessionCookiesOnStore(cookieStore);
      return null;
    }

    const newAccessToken = tokenParsed.data.access_token;
    const newExpiresAt = new Date(
      Date.now() + (tokenParsed.data.expires_in ?? 3600) * 1000
    ).toISOString();

    let customerId = existingCustomerId;
    if (!customerId) {
      const res = await executeCustomerGraphql<{
        customer?: { id?: string | null } | null;
      }>(config.shopId, newAccessToken, GET_CUSTOMER_ID_QUERY, {}, fetchFn);
      customerId = res.data?.customer?.id ?? undefined;
      if (!customerId) {
        clearSessionCookiesOnStore(cookieStore);
        return null;
      }
    }

    writeSessionCookiesToStore(cookieStore, {
      accessToken: newAccessToken,
      refreshToken: tokenParsed.data.refresh_token ?? refreshToken,
      expiresAt: newExpiresAt,
      idToken: tokenParsed.data.id_token,
      customerId,
    });

    return SessionSchema.parse({
      accessToken: newAccessToken,
      expiresAt: newExpiresAt,
      customerId,
    });
  }

  async signInUrl(returnTo?: string): Promise<string> {
    const safeReturnTo = sanitizeReturnTo(returnTo);
    return `/account/auth/login?returnTo=${encodeURIComponent(safeReturnTo)}`;
  }

  async signOut(): Promise<void> {
    const config = getCustomerAccountConfig(this.options);
    const fetchFn = this.options?.fetchImpl ?? globalThis.fetch;
    const cookieStore = await resolveCookieStore(this.options?.cookies);
    const idToken = cookieStore.get(SESSION_COOKIE_NAMES.idToken)?.value;

    clearSessionCookiesOnStore(cookieStore);

    if (!idToken) {
      return;
    }

    let headerList: Headers;
    if (this.options?.headersImpl) {
      headerList = await this.options.headersImpl();
    } else {
      const { headers } = await import("next/headers");
      headerList = await headers();
    }

    const origin = resolveOriginFromHeaders(headerList);
    const discovery = await discoverOidcConfig(config.shopId, fetchFn);
    const endSession = new URL(discovery.end_session_endpoint);
    endSession.searchParams.set("id_token_hint", idToken);
    endSession.searchParams.set("post_logout_redirect_uri", origin);

    if (this.options?.redirectImpl) {
      this.options.redirectImpl(endSession.toString());
    } else {
      const { redirect } = await import("next/navigation");
      redirect(endSession.toString());
    }
  }

  async getCustomer(): Promise<CustomerProfile | null> {
    const session = await this.getSession();
    if (!session) {
      return null;
    }

    const config = getCustomerAccountConfig(this.options);
    const fetchFn = this.options?.fetchImpl ?? globalThis.fetch;

    const result = await executeCustomerGraphql<{
      customer?: ShopifyRawCustomer | null;
    }>(
      config.shopId,
      session.accessToken,
      GET_CUSTOMER_PROFILE_QUERY,
      {},
      fetchFn
    );

    const raw = result.data?.customer;
    if (!raw) {
      return null;
    }

    return mapShopifyCustomer(raw);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async getOrders(): Promise<Order[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }

  async getOrder(_id: string): Promise<Order | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }

  async lookupGuestOrder(
    _orderNumberOrInput: string | GuestOrderLookupInput,
    _email?: string
  ): Promise<GuestOrderTracking | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }

  async reorder(_orderId: string): Promise<OrderLine[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }

  async getAddresses(): Promise<Address[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  async updateProfile(input: ProfileInput): Promise<CustomerProfile> {
    const session = await this.getSession();
    if (!session) {
      throw new Error("Authentication required");
    }

    const config = getCustomerAccountConfig(this.options);
    const fetchFn = this.options?.fetchImpl ?? globalThis.fetch;

    const updateInput: { firstName?: string; lastName?: string } = {};
    if (input.firstName !== undefined) {
      updateInput.firstName = input.firstName;
    }
    if (input.lastName !== undefined) {
      updateInput.lastName = input.lastName;
    }

    if (
      updateInput.firstName === undefined &&
      updateInput.lastName === undefined
    ) {
      const existing = await this.getCustomer();
      if (!existing) {
        throw new Error("Customer profile not found");
      }
      return existing;
    }

    const result = await executeCustomerGraphql<{
      customerUpdate?: {
        customer?: ShopifyRawCustomer | null;
        userErrors?: Array<{ field?: string[] | null; message: string }>;
      } | null;
    }>(
      config.shopId,
      session.accessToken,
      CUSTOMER_UPDATE_MUTATION,
      { input: updateInput },
      fetchFn
    );

    const payload = result.data?.customerUpdate;
    if (payload?.userErrors?.length) {
      throw new Error(payload.userErrors.map((e) => e.message).join("; "));
    }

    if (!payload?.customer) {
      const refreshed = await this.getCustomer();
      if (!refreshed) {
        throw new Error("Customer profile update failed");
      }
      return refreshed;
    }

    return mapShopifyCustomer(payload.customer);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async getPets(): Promise<Pet[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }

  async savePet(_pet: PetInput): Promise<Pet> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }

  async removePet(_id: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
