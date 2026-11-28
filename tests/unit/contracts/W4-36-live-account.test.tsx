/** @vitest-environment jsdom */
import crypto from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { render, screen, cleanup } from "@testing-library/react";

import oidcDiscoveryFixture from "../../fixtures/shopify/customer-oidc-discovery.json";
import apiDiscoveryFixture from "../../fixtures/shopify/customer-api-discovery.json";
import tokenFixture from "../../fixtures/shopify/customer-token.json";
import profileFixture from "../../fixtures/shopify/customer-profile.json";
import profileMinimalFixture from "../../fixtures/shopify/customer-profile-minimal.json";
import updateFixture from "../../fixtures/shopify/customer-update.json";
import updateErrorFixture from "../../fixtures/shopify/customer-update-error.json";

import { CustomerProfileSchema, SessionSchema } from "@/lib/contracts/account";
import {
  AUTH_PKCE_COOKIE_NAME,
  LiveAccountProvider,
  SESSION_COOKIE_NAMES,
  type CookieStoreAdapter,
} from "@/lib/providers/live/account";
import { GET as loginGet } from "@/app/(account)/account/auth/login/route";
import { GET as callbackGet } from "@/app/(account)/account/auth/callback/route";
import { GET as logoutGet } from "@/app/(account)/account/auth/logout/route";
import AccountAuthErrorPage from "@/app/(account)/account/auth/error/page";

vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));
vi.mock("@/components/layout/header", () => ({ Header: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));

const TEST_SHOP_ID = "999999999";
const TEST_CLIENT_ID = "TEST-client-id-pkce-public";
const TEST_ORIGIN = "https://www.nadeonlabs.com";

function buildJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.TEST_sig`;
}

function createMemoryCookies(
  initial: Record<string, string> = {},
  options: { readOnly?: boolean } = {}
): CookieStoreAdapter & { store: Map<string, string> } {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    store,
    get(name: string) {
      const value = store.get(name);
      return value !== undefined ? { value } : undefined;
    },
    set(name: string, value: string, cookieOpts?: { maxAge?: number }) {
      if (options.readOnly) {
        throw new Error(
          "Cookies can only be modified in a Server Action or Route Handler."
        );
      }
      if (cookieOpts?.maxAge === 0) {
        store.delete(name);
      } else {
        store.set(name, value);
      }
    },
    delete(name: string) {
      if (options.readOnly) {
        throw new Error(
          "Cookies can only be modified in a Server Action or Route Handler."
        );
      }
      store.delete(name);
    },
  };
}

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as Response;
}

describe("W4-36 LiveAccountProvider & Customer Account OAuth PKCE", () => {
  beforeEach(() => {
    vi.stubEnv("SHOPIFY_SHOP_ID", TEST_SHOP_ID);
    vi.stubEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID", TEST_CLIENT_ID);
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "TEST-store.myshopify.com");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("signInUrl open-redirect protection", () => {
    it("defaults to /account when returnTo is omitted", async () => {
      const provider = new LiveAccountProvider();
      expect(await provider.signInUrl()).toBe(
        "/account/auth/login?returnTo=%2Faccount"
      );
    });

    it("preserves safe relative same-site paths with query/hash", async () => {
      const provider = new LiveAccountProvider();
      expect(await provider.signInUrl("/account/orders?filter=open#top")).toBe(
        "/account/auth/login?returnTo=%2Faccount%2Forders%3Ffilter%3Dopen%23top"
      );
    });

    it.each([
      "https://evil.example/phish",
      "http://evil.example/account",
      "//evil.example/account",
      "/\\evil.example/account",
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "account/orders",
      "/account\r\nSet-Cookie: a=b",
    ])(
      "rejects unsafe returnTo (%s) and falls back to /account",
      async (bad) => {
        const provider = new LiveAccountProvider();
        expect(await provider.signInUrl(bad)).toBe(
          "/account/auth/login?returnTo=%2Faccount"
        );
      }
    );
  });

  describe("configuration errors", () => {
    it("throws clear configuration error when SHOPIFY_SHOP_ID or client ID is missing", async () => {
      vi.stubEnv("SHOPIFY_SHOP_ID", "");
      vi.stubEnv("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID", "");

      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies(),
      });

      await expect(provider.getSession()).rejects.toThrow(
        /Shopify Customer Account configuration error/i
      );

      await expect(
        loginGet(new NextRequest(`${TEST_ORIGIN}/account/auth/login`))
      ).rejects.toThrow(/Shopify Customer Account configuration error/i);
    });

    it("throws clear configuration error when SHOPIFY_SHOP_ID is not numeric", async () => {
      vi.stubEnv("SHOPIFY_SHOP_ID", "not-a-numeric-id");

      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies(),
      });

      await expect(provider.getSession()).rejects.toThrow(
        /Shopify Customer Account configuration error/i
      );
    });
  });

  describe("GET /account/auth/login", () => {
    it("discovers OIDC config, caches discovery, builds PKCE S256 authorize URL, and sets httpOnly PKCE cookie", async () => {
      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        if (
          String(url) ===
          `https://shopify.com/authentication/${TEST_SHOP_ID}/.well-known/openid-configuration`
        ) {
          return jsonResponse(oidcDiscoveryFixture);
        }
        return jsonResponse({ error: "unexpected" }, 404);
      });
      vi.stubGlobal("fetch", fetchMock);

      const req = new NextRequest(
        `${TEST_ORIGIN}/account/auth/login?returnTo=%2Faccount%2Fsettings`
      );
      const res = await loginGet(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBeTruthy();

      const authUrl = new URL(location!);
      expect(authUrl.origin + authUrl.pathname).toBe(
        oidcDiscoveryFixture.authorization_endpoint
      );
      expect(authUrl.searchParams.get("scope")).toBe(
        "openid email customer-account-api:full"
      );
      expect(authUrl.searchParams.get("client_id")).toBe(TEST_CLIENT_ID);
      expect(authUrl.searchParams.get("response_type")).toBe("code");
      expect(authUrl.searchParams.get("redirect_uri")).toBe(
        `${TEST_ORIGIN}/account/auth/callback`
      );
      expect(authUrl.searchParams.get("code_challenge_method")).toBe("S256");

      const pkceCookie = res.cookies.get(AUTH_PKCE_COOKIE_NAME);
      expect(pkceCookie).toBeDefined();
      expect(pkceCookie?.httpOnly).toBe(true);
      expect(pkceCookie?.secure).toBe(true);
      expect(pkceCookie?.sameSite).toBe("lax");
      expect(pkceCookie?.path).toBe("/");
      expect(pkceCookie?.maxAge).toBeGreaterThan(0);
      expect(pkceCookie?.maxAge).toBeLessThanOrEqual(900);

      const pkcePayload = JSON.parse(pkceCookie!.value) as {
        state: string;
        nonce: string;
        codeVerifier: string;
        returnTo: string;
      };
      expect(pkcePayload.returnTo).toBe("/account/settings");
      expect(authUrl.searchParams.get("state")).toBe(pkcePayload.state);
      expect(authUrl.searchParams.get("nonce")).toBe(pkcePayload.nonce);

      const expectedChallenge = crypto
        .createHash("sha256")
        .update(pkcePayload.codeVerifier, "ascii")
        .digest("base64url");
      expect(authUrl.searchParams.get("code_challenge")).toBe(
        expectedChallenge
      );

      // Second call with the same fetch implementation uses cached OIDC discovery
      await loginGet(new NextRequest(`${TEST_ORIGIN}/account/auth/login`));
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /account/auth/callback", () => {
    it("rejects mismatched state, clears PKCE cookie, and redirects to /account/auth/error without calling token endpoint", async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      const pkceCookieVal = encodeURIComponent(
        JSON.stringify({
          state: "expected-state",
          nonce: "expected-nonce",
          codeVerifier: "verifier-1234567890",
          returnTo: "/account",
        })
      );
      const req = new NextRequest(
        `${TEST_ORIGIN}/account/auth/callback?code=auth-code-123&state=wrong-state`,
        {
          headers: {
            cookie: `${AUTH_PKCE_COOKIE_NAME}=${pkceCookieVal}`,
          },
        }
      );

      const res = await callbackGet(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe(
        `${TEST_ORIGIN}/account/auth/error`
      );
      expect(fetchMock).not.toHaveBeenCalled();
      expect(res.cookies.get(AUTH_PKCE_COOKIE_NAME)?.maxAge).toBe(0);
    });

    it("redirects to /account/auth/error without leaking details when provider returns error query param", async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      const req = new NextRequest(
        `${TEST_ORIGIN}/account/auth/callback?error=access_denied&error_description=sensitive_secret`
      );
      const res = await callbackGet(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe(
        `${TEST_ORIGIN}/account/auth/error`
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects id_token nonce mismatch and does not set session cookies", async () => {
      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        const u = String(url);
        if (u.endsWith("/.well-known/openid-configuration")) {
          return jsonResponse(oidcDiscoveryFixture);
        }
        if (u === oidcDiscoveryFixture.token_endpoint) {
          return jsonResponse({
            ...tokenFixture,
            id_token: buildJwt({
              sub: "gid://shopify/Customer/999000111",
              nonce: "WRONG-nonce",
            }),
          });
        }
        return jsonResponse({}, 404);
      });
      vi.stubGlobal("fetch", fetchMock);

      const pkceCookieVal = encodeURIComponent(
        JSON.stringify({
          state: "valid-state",
          nonce: "expected-nonce",
          codeVerifier: "verifier-1234567890",
          returnTo: "/account/orders",
        })
      );
      const req = new NextRequest(
        `${TEST_ORIGIN}/account/auth/callback?code=auth-code-123&state=valid-state`,
        {
          headers: {
            cookie: `${AUTH_PKCE_COOKIE_NAME}=${pkceCookieVal}`,
          },
        }
      );

      const res = await callbackGet(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe(
        `${TEST_ORIGIN}/account/auth/error`
      );
      expect(res.cookies.get(SESSION_COOKIE_NAMES.accessToken)).toBeUndefined();
      expect(res.cookies.get(AUTH_PKCE_COOKIE_NAME)?.maxAge).toBe(0);
    });

    it("exchanges code with PKCE verifier (no secret), validates nonce, stores httpOnly session cookies, clears PKCE cookie, and redirects to returnTo", async () => {
      let capturedTokenBody = "";
      let capturedGraphqlAuth = "";

      const fetchMock = vi.fn(
        async (url: string | URL | Request, init?: RequestInit) => {
          const u = String(url);
          if (u.endsWith("/.well-known/openid-configuration")) {
            return jsonResponse(oidcDiscoveryFixture);
          }
          if (u === oidcDiscoveryFixture.token_endpoint) {
            capturedTokenBody = String(init?.body ?? "");
            return jsonResponse({
              ...tokenFixture,
              id_token: buildJwt({
                sub: "999000111",
                nonce: "expected-nonce",
                email: "test.alex.morgan@example.com",
              }),
            });
          }
          if (u.endsWith("/.well-known/customer-account-api")) {
            return jsonResponse(apiDiscoveryFixture);
          }
          if (u === apiDiscoveryFixture.graphql_api) {
            const headers = init?.headers as Record<string, string>;
            capturedGraphqlAuth = headers?.Authorization ?? "";
            return jsonResponse(profileFixture);
          }
          return jsonResponse({}, 404);
        }
      );
      vi.stubGlobal("fetch", fetchMock);

      const pkceCookieVal = encodeURIComponent(
        JSON.stringify({
          state: "valid-state",
          nonce: "expected-nonce",
          codeVerifier: "verifier-secret-pkce-abc",
          returnTo: "/account/orders",
        })
      );
      const req = new NextRequest(
        `${TEST_ORIGIN}/account/auth/callback?code=auth-code-xyz&state=valid-state`,
        {
          headers: {
            cookie: `${AUTH_PKCE_COOKIE_NAME}=${pkceCookieVal}`,
          },
        }
      );

      const res = await callbackGet(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe(`${TEST_ORIGIN}/account/orders`);

      const tokenParams = new URLSearchParams(capturedTokenBody);
      expect(tokenParams.get("grant_type")).toBe("authorization_code");
      expect(tokenParams.get("client_id")).toBe(TEST_CLIENT_ID);
      expect(tokenParams.get("code")).toBe("auth-code-xyz");
      expect(tokenParams.get("code_verifier")).toBe("verifier-secret-pkce-abc");
      expect(tokenParams.get("redirect_uri")).toBe(
        `${TEST_ORIGIN}/account/auth/callback`
      );
      expect(tokenParams.get("client_secret")).toBeNull();

      expect(capturedGraphqlAuth).toBe(tokenFixture.access_token);

      const accessCookie = res.cookies.get(SESSION_COOKIE_NAMES.accessToken);
      const refreshCookie = res.cookies.get(SESSION_COOKIE_NAMES.refreshToken);
      const idTokenCookie = res.cookies.get(SESSION_COOKIE_NAMES.idToken);
      const customerIdCookie = res.cookies.get(SESSION_COOKIE_NAMES.customerId);
      const expiresAtCookie = res.cookies.get(SESSION_COOKIE_NAMES.expiresAt);

      for (const cookie of [
        accessCookie,
        refreshCookie,
        idTokenCookie,
        customerIdCookie,
        expiresAtCookie,
      ]) {
        expect(cookie).toBeDefined();
        expect(cookie?.httpOnly).toBe(true);
        expect(cookie?.secure).toBe(true);
        expect(cookie?.sameSite).toBe("lax");
        expect(cookie?.path).toBe("/");
      }

      expect(accessCookie?.value).toBe(tokenFixture.access_token);
      expect(refreshCookie?.value).toBe(tokenFixture.refresh_token);
      expect(customerIdCookie?.value).toBe("gid://shopify/Customer/999000111");
      expect(res.cookies.get(AUTH_PKCE_COOKIE_NAME)?.maxAge).toBe(0);
    });
  });

  describe("getSession", () => {
    it("returns null when session cookies are missing", async () => {
      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies(),
      });
      expect(await provider.getSession()).toBeNull();
    });

    it("returns valid SessionSchema object when cookies are valid and unexpired", async () => {
      const future = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies({
          [SESSION_COOKIE_NAMES.accessToken]: tokenFixture.access_token,
          [SESSION_COOKIE_NAMES.expiresAt]: future,
          [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
        }),
      });

      const session = await provider.getSession();
      expect(session).toEqual({
        accessToken: tokenFixture.access_token,
        expiresAt: future,
        customerId: "gid://shopify/Customer/999000111",
      });
      expect(() => SessionSchema.parse(session)).not.toThrow();
    });

    it("refreshes expired access token via grant_type=refresh_token when cookies are writable (Server Action / Route Handler)", async () => {
      const expired = new Date(Date.now() - 60_000).toISOString();
      const cookies = createMemoryCookies({
        [SESSION_COOKIE_NAMES.accessToken]: "shcat_TEST_expired",
        [SESSION_COOKIE_NAMES.refreshToken]: tokenFixture.refresh_token,
        [SESSION_COOKIE_NAMES.expiresAt]: expired,
        [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
      });

      let refreshBody = "";
      const fetchMock = vi.fn(
        async (url: string | URL | Request, init?: RequestInit) => {
          const u = String(url);
          if (u.endsWith("/.well-known/openid-configuration")) {
            return jsonResponse(oidcDiscoveryFixture);
          }
          if (u === oidcDiscoveryFixture.token_endpoint) {
            refreshBody = String(init?.body ?? "");
            return jsonResponse({
              access_token: "shcat_TEST_refreshed_002",
              refresh_token: "shcrt_TEST_refreshed_002",
              expires_in: 3600,
              id_token: buildJwt({
                sub: "999000111",
                nonce: "refreshed",
              }),
            });
          }
          return jsonResponse({}, 404);
        }
      );

      const provider = new LiveAccountProvider({
        cookies,
        fetchImpl: fetchMock,
      });

      const session = await provider.getSession();
      expect(session?.accessToken).toBe("shcat_TEST_refreshed_002");
      expect(session?.customerId).toBe("gid://shopify/Customer/999000111");

      const params = new URLSearchParams(refreshBody);
      expect(params.get("grant_type")).toBe("refresh_token");
      expect(params.get("client_id")).toBe(TEST_CLIENT_ID);
      expect(params.get("refresh_token")).toBe(tokenFixture.refresh_token);

      expect(cookies.store.get(SESSION_COOKIE_NAMES.accessToken)).toBe(
        "shcat_TEST_refreshed_002"
      );
      expect(cookies.store.get(SESSION_COOKIE_NAMES.refreshToken)).toBe(
        "shcrt_TEST_refreshed_002"
      );
    });

    it("clears cookies and returns null when refresh token fails", async () => {
      const expired = new Date(Date.now() - 60_000).toISOString();
      const cookies = createMemoryCookies({
        [SESSION_COOKIE_NAMES.accessToken]: "shcat_TEST_expired",
        [SESSION_COOKIE_NAMES.refreshToken]: "shcrt_TEST_revoked",
        [SESSION_COOKIE_NAMES.expiresAt]: expired,
        [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
      });

      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        if (String(url).endsWith("/.well-known/openid-configuration")) {
          return jsonResponse(oidcDiscoveryFixture);
        }
        return jsonResponse({ error: "invalid_grant" }, 400);
      });

      const provider = new LiveAccountProvider({
        cookies,
        fetchImpl: fetchMock,
      });

      expect(await provider.getSession()).toBeNull();
      expect(cookies.store.has(SESSION_COOKIE_NAMES.accessToken)).toBe(false);
      expect(cookies.store.has(SESSION_COOKIE_NAMES.refreshToken)).toBe(false);
    });

    it("handles read-only Server Component cookies safely by returning null without calling refresh endpoint", async () => {
      const expired = new Date(Date.now() - 60_000).toISOString();
      const cookies = createMemoryCookies(
        {
          [SESSION_COOKIE_NAMES.accessToken]: "shcat_TEST_expired",
          [SESSION_COOKIE_NAMES.refreshToken]: tokenFixture.refresh_token,
          [SESSION_COOKIE_NAMES.expiresAt]: expired,
          [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
        },
        { readOnly: true }
      );
      const fetchMock = vi.fn();

      const provider = new LiveAccountProvider({
        cookies,
        fetchImpl: fetchMock,
      });

      expect(await provider.getSession()).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("getCustomer and updateProfile", () => {
    it("queries Customer Account GraphQL with Authorization: <token> (no Bearer) and maps CustomerProfileSchema", async () => {
      const future = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      let capturedAuth = "";
      const fetchMock = vi.fn(
        async (url: string | URL | Request, init?: RequestInit) => {
          const u = String(url);
          if (u.endsWith("/.well-known/customer-account-api")) {
            return jsonResponse(apiDiscoveryFixture);
          }
          if (u === apiDiscoveryFixture.graphql_api) {
            const headers = init?.headers as Record<string, string>;
            capturedAuth = headers?.Authorization ?? "";
            return jsonResponse(profileFixture);
          }
          return jsonResponse({}, 404);
        }
      );

      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies({
          [SESSION_COOKIE_NAMES.accessToken]: tokenFixture.access_token,
          [SESSION_COOKIE_NAMES.expiresAt]: future,
          [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
        }),
        fetchImpl: fetchMock,
      });

      const profile = await provider.getCustomer();
      expect(capturedAuth).toBe(tokenFixture.access_token);
      expect(capturedAuth.startsWith("Bearer ")).toBe(false);

      expect(profile).toEqual({
        id: "gid://shopify/Customer/999000111",
        firstName: "TEST Alex",
        lastName: "TEST Morgan",
        email: "test.alex.morgan@example.com",
        phone: "+15550109999",
        profileType: "Both",
        defaultAddressId: "gid://shopify/CustomerAddress/888000222",
      });
      expect(() => CustomerProfileSchema.parse(profile)).not.toThrow();
    });

    it("maps null firstName/lastName/phone/defaultAddress to sensible empty defaults", async () => {
      const future = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        const u = String(url);
        if (u.endsWith("/.well-known/customer-account-api")) {
          return jsonResponse(apiDiscoveryFixture);
        }
        if (u === apiDiscoveryFixture.graphql_api) {
          return jsonResponse(profileMinimalFixture);
        }
        return jsonResponse({}, 404);
      });

      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies({
          [SESSION_COOKIE_NAMES.accessToken]: tokenFixture.access_token,
          [SESSION_COOKIE_NAMES.expiresAt]: future,
          [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000222",
        }),
        fetchImpl: fetchMock,
      });

      const profile = await provider.getCustomer();
      expect(profile).toEqual({
        id: "gid://shopify/Customer/999000222",
        firstName: "",
        lastName: "",
        email: "test.minimal@example.com",
        profileType: "Both",
      });
      expect(() => CustomerProfileSchema.parse(profile)).not.toThrow();
    });

    it("throws on GraphQL/HTTP 5xx errors instead of falling back to mock", async () => {
      const future = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        if (String(url).endsWith("/.well-known/customer-account-api")) {
          return jsonResponse(apiDiscoveryFixture);
        }
        return jsonResponse({ error: "server_error" }, 502);
      });

      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies({
          [SESSION_COOKIE_NAMES.accessToken]: tokenFixture.access_token,
          [SESSION_COOKIE_NAMES.expiresAt]: future,
          [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
        }),
        fetchImpl: fetchMock,
      });

      await expect(provider.getCustomer()).rejects.toThrow(/502/);
    });

    it("updates firstName and lastName via customerUpdate mutation", async () => {
      const future = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      let sentVariables: Record<string, unknown> | undefined;
      const fetchMock = vi.fn(
        async (url: string | URL | Request, init?: RequestInit) => {
          const u = String(url);
          if (u.endsWith("/.well-known/customer-account-api")) {
            return jsonResponse(apiDiscoveryFixture);
          }
          if (u === apiDiscoveryFixture.graphql_api) {
            const parsed = JSON.parse(String(init?.body ?? "{}"));
            sentVariables = parsed.variables;
            return jsonResponse(updateFixture);
          }
          return jsonResponse({}, 404);
        }
      );

      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies({
          [SESSION_COOKIE_NAMES.accessToken]: tokenFixture.access_token,
          [SESSION_COOKIE_NAMES.expiresAt]: future,
          [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
        }),
        fetchImpl: fetchMock,
      });

      const updated = await provider.updateProfile({
        firstName: "TEST Jordan",
        lastName: "TEST Taylor",
      });

      expect(sentVariables).toEqual({
        input: {
          firstName: "TEST Jordan",
          lastName: "TEST Taylor",
        },
      });
      expect(updated.firstName).toBe("TEST Jordan");
      expect(updated.lastName).toBe("TEST Taylor");
    });

    it("throws when customerUpdate returns userErrors", async () => {
      const future = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        if (String(url).endsWith("/.well-known/customer-account-api")) {
          return jsonResponse(apiDiscoveryFixture);
        }
        return jsonResponse(updateErrorFixture);
      });

      const provider = new LiveAccountProvider({
        cookies: createMemoryCookies({
          [SESSION_COOKIE_NAMES.accessToken]: tokenFixture.access_token,
          [SESSION_COOKIE_NAMES.expiresAt]: future,
          [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
        }),
        fetchImpl: fetchMock,
      });

      await expect(
        provider.updateProfile({ firstName: "Bad" })
      ).rejects.toThrow(/First name is invalid/);
    });
  });

  describe("signOut and GET /account/auth/logout", () => {
    it("GET /account/auth/logout clears session cookies and redirects to end_session_endpoint with id_token_hint and post_logout_redirect_uri", async () => {
      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        if (String(url).endsWith("/.well-known/openid-configuration")) {
          return jsonResponse(oidcDiscoveryFixture);
        }
        return jsonResponse({}, 404);
      });
      vi.stubGlobal("fetch", fetchMock);

      const req = new NextRequest(`${TEST_ORIGIN}/account/auth/logout`, {
        headers: {
          cookie: [
            `${SESSION_COOKIE_NAMES.accessToken}=shcat_TEST_1`,
            `${SESSION_COOKIE_NAMES.refreshToken}=shcrt_TEST_1`,
            `${SESSION_COOKIE_NAMES.expiresAt}=2026-12-01T00:00:00.000Z`,
            `${SESSION_COOKIE_NAMES.idToken}=id_token_TEST_hint`,
            `${SESSION_COOKIE_NAMES.customerId}=gid://shopify/Customer/999000111`,
          ].join("; "),
        },
      });

      const res = await logoutGet(req);
      expect(res.status).toBe(307);

      const location = new URL(res.headers.get("location")!);
      expect(location.origin + location.pathname).toBe(
        oidcDiscoveryFixture.end_session_endpoint
      );
      expect(location.searchParams.get("id_token_hint")).toBe(
        "id_token_TEST_hint"
      );
      expect(location.searchParams.get("post_logout_redirect_uri")).toBe(
        TEST_ORIGIN
      );

      for (const name of Object.values(SESSION_COOKIE_NAMES)) {
        expect(res.cookies.get(name)?.maxAge).toBe(0);
      }
    });

    it("LiveAccountProvider.signOut clears cookies and redirects to end_session_endpoint", async () => {
      const cookies = createMemoryCookies({
        [SESSION_COOKIE_NAMES.accessToken]: "shcat_TEST_1",
        [SESSION_COOKIE_NAMES.refreshToken]: "shcrt_TEST_1",
        [SESSION_COOKIE_NAMES.expiresAt]: "2026-12-01T00:00:00.000Z",
        [SESSION_COOKIE_NAMES.idToken]: "id_token_TEST_hint",
        [SESSION_COOKIE_NAMES.customerId]: "gid://shopify/Customer/999000111",
      });

      const fetchMock = vi.fn(async (url: string | URL | Request) => {
        if (String(url).endsWith("/.well-known/openid-configuration")) {
          return jsonResponse(oidcDiscoveryFixture);
        }
        return jsonResponse({}, 404);
      });

      const redirectImpl = vi.fn((url: string): never => {
        throw new Error(`NEXT_REDIRECT:${url}`);
      });

      const provider = new LiveAccountProvider({
        cookies,
        fetchImpl: fetchMock,
        redirectImpl,
        headersImpl: async () =>
          new Headers({
            "x-forwarded-proto": "https",
            "x-forwarded-host": "www.nadeonlabs.com",
          }),
      });

      await expect(provider.signOut()).rejects.toThrow("NEXT_REDIRECT:");

      for (const name of Object.values(SESSION_COOKIE_NAMES)) {
        expect(cookies.store.has(name)).toBe(false);
      }

      const redirected = new URL(redirectImpl.mock.calls[0][0]);
      expect(redirected.origin + redirected.pathname).toBe(
        oidcDiscoveryFixture.end_session_endpoint
      );
      expect(redirected.searchParams.get("id_token_hint")).toBe(
        "id_token_TEST_hint"
      );
      expect(redirected.searchParams.get("post_logout_redirect_uri")).toBe(
        TEST_ORIGIN
      );
    });
  });

  describe("auth error page and unimplemented stubs", () => {
    it("renders friendly error page without token or error detail leaks", () => {
      render(<AccountAuthErrorPage />);
      expect(
        screen.getByRole("heading", { level: 1, name: /couldn't sign you in/i })
      ).toBeTruthy();
      const tryAgain = screen.getByRole("link", { name: /try again/i });
      expect(tryAgain.getAttribute("href")).toBe("/account");
    });

    it("keeps W4-37..W4-39 methods throwing not implemented", async () => {
      const provider = new LiveAccountProvider();
      await expect(provider.getOrders()).rejects.toThrow(
        "not implemented: onda 4"
      );
      await expect(provider.getOrder("1")).rejects.toThrow(
        "not implemented: onda 4"
      );
      await expect(provider.lookupGuestOrder("1", "a@b.com")).rejects.toThrow(
        "not implemented: onda 4"
      );
      await expect(provider.reorder("1")).rejects.toThrow(
        "not implemented: onda 4"
      );
      await expect(provider.getAddresses()).rejects.toThrow(
        "not implemented: onda 4"
      );
      await expect(provider.getPets()).rejects.toThrow(
        "not implemented: onda 4"
      );
      await expect(
        provider.savePet({ name: "Cooper", species: "dog", breed: "Lab" })
      ).rejects.toThrow("not implemented: onda 4");
      await expect(provider.removePet("1")).rejects.toThrow(
        "not implemented: onda 4"
      );
    });
  });
});
