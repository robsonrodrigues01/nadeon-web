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

  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
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
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    const preferences = parsed.preferences;
    const hasTimestamp = Object.prototype.hasOwnProperty.call(
      parsed,
      "timestamp"
    );
    const hasCountry = Object.prototype.hasOwnProperty.call(parsed, "country");
    if (
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.explicit !== "boolean" ||
      (hasTimestamp &&
        (typeof parsed.timestamp !== "string" ||
          !Number.isFinite(Date.parse(parsed.timestamp)))) ||
      (hasCountry && typeof parsed.country !== "string") ||
      !preferences ||
      typeof preferences !== "object" ||
      Array.isArray(preferences) ||
      preferences.necessary !== true ||
      typeof preferences.analytics !== "boolean" ||
      typeof preferences.marketing !== "boolean" ||
      (parsed.explicit === false &&
        (preferences.analytics || preferences.marketing))
    ) {
      return null;
    }

    return {
      version: CONSENT_VERSION,
      timestamp: hasTimestamp ? parsed.timestamp : new Date().toISOString(),
      country: typeof parsed.country === "string" ? parsed.country : "",
      explicit: parsed.explicit,
      preferences: {
        necessary: true,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
      },
    };
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

  // Dispatch custom event for custom listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("nadeon_consent_changed", { detail: record })
    );
  }
}
