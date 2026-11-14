export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface ConsentPreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentRecord {
  version: string;
  timestamp: string;
  country: string;
  preferences: ConsentPreferences;
  explicit: boolean;
}

export const CONSENT_COOKIE_NAME = "nadeon_consent";
export const COUNTRY_COOKIE_NAME = "nadeon_country";
export const CONSENT_VERSION = "1.0";
export const CONSENT_COOKIE_MAX_AGE_DAYS = 365;

/**
 * Returns true if the country string indicates the United States.
 * Defaults to false if absent or empty (opt-in outside the US).
 */
export function isUsCountry(countryCode?: string | null): boolean {
  if (!countryCode) return false;
  const normalized = countryCode.trim().toUpperCase();
  return normalized === "US" || normalized === "USA";
}

/**
 * Checks whether Global Privacy Control (GPC) is asserted by the user's browser.
 */
export function isGpcEnabled(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  // GPC can be on navigator or window
  return (
    (navigator as unknown as { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true ||
    (window as unknown as { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}

/**
 * Returns the default consent preferences based on jurisdiction.
 * - US: Opt-out (analytics and marketing enabled by default; GPC disables marketing)
 * - Outside US / Absent: Opt-in (strictly necessary only until consent is granted)
 */
export function getDefaultConsent(
  countryCode?: string | null,
  gpc: boolean = false
): ConsentPreferences {
  const isUs = isUsCountry(countryCode);

  if (isUs) {
    return {
      necessary: true,
      analytics: true,
      marketing: !gpc,
    };
  }

  return {
    necessary: true,
    analytics: false,
    marketing: false,
  };
}
