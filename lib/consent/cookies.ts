import {
  type ConsentRecord,
  CONSENT_COOKIE_NAME,
  COUNTRY_COOKIE_NAME,
  CONSENT_VERSION,
  CONSENT_COOKIE_MAX_AGE_DAYS,
} from "./types";

/**
 * Reads a cookie value by name from a cookie string or document.cookie.
 */
export function readCookie(
  name: string,
  cookieSource?: string | null
): string | null {
  const source =
    cookieSource ?? (typeof document !== "undefined" ? document.cookie : "");

  if (!source) return null;

  const match = source.match(
    new RegExp(`(?:^|;\\s*)${encodeURIComponent(name)}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Writes a cookie to document.cookie with safe defaults.
 */
export function writeCookie(
  name: string,
  value: string,
  days: number = CONSENT_COOKIE_MAX_AGE_DAYS
): void {
  if (typeof document === "undefined") return;

  const maxAge = days * 24 * 60 * 60;
  const encodedValue = encodeURIComponent(value);
  document.cookie = `${encodeURIComponent(name)}=${encodedValue}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Parses the nadeon_consent cookie value.
 */
export function parseConsentCookie(
  rawCookie?: string | null
): ConsentRecord | null {
  if (!rawCookie) return null;

  try {
    const parsed = JSON.parse(rawCookie);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.version === "string" &&
      parsed.preferences &&
      typeof parsed.preferences === "object"
    ) {
      return {
        version: parsed.version || CONSENT_VERSION,
        timestamp: parsed.timestamp || new Date().toISOString(),
        country: typeof parsed.country === "string" ? parsed.country : "",
        explicit: Boolean(parsed.explicit),
        preferences: {
          necessary: true,
          analytics: Boolean(parsed.preferences.analytics),
          marketing: Boolean(parsed.preferences.marketing),
        },
      };
    }
  } catch {
    // Malformed JSON fallback
  }

  return null;
}

/**
 * Serializes a ConsentRecord to store in the nadeon_consent cookie.
 */
export function serializeConsentRecord(record: ConsentRecord): string {
  return JSON.stringify(record);
}

/**
 * Helper to get the market/country code from cookies.
 * Looks for nadeon_country, then country.
 */
export function getCountryFromCookies(cookieSource?: string | null): string {
  const nadeonCountry = readCookie(COUNTRY_COOKIE_NAME, cookieSource);
  if (nadeonCountry) return nadeonCountry;

  const fallbackCountry = readCookie("country", cookieSource);
  if (fallbackCountry) return fallbackCountry;

  return "";
}

/**
 * Saves consent record to the cookie and notifies external APIs.
 */
export function saveConsentRecord(record: ConsentRecord): void {
  writeCookie(
    CONSENT_COOKIE_NAME,
    serializeConsentRecord(record),
    CONSENT_COOKIE_MAX_AGE_DAYS
  );

  // Notify Shopify Customer Privacy API if loaded on page
  if (
    typeof window !== "undefined" &&
    (
      window as unknown as {
        Shopify?: {
          customerPrivacy?: {
            setTrackingConsent?: (
              consent: Record<string, boolean>,
              callback: () => void
            ) => void;
          };
        };
      }
    ).Shopify?.customerPrivacy?.setTrackingConsent
  ) {
    try {
      const sp = (
        window as unknown as {
          Shopify: {
            customerPrivacy: {
              setTrackingConsent: (
                consent: Record<string, boolean>,
                callback: () => void
              ) => void;
            };
          };
        }
      ).Shopify.customerPrivacy;

      sp.setTrackingConsent(
        {
          analytics: record.preferences.analytics,
          marketing: record.preferences.marketing,
          preferences: true,
          sale_of_data: record.preferences.marketing,
        },
        () => {}
      );
    } catch {
      // Defensive fallback
    }
  }

  // Dispatch custom event for custom listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("nadeon_consent_changed", { detail: record })
    );
  }
}
