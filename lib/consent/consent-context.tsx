"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  type ConsentCategory,
  type ConsentPreferences,
  type ConsentRecord,
  CONSENT_VERSION,
  isUsCountry,
  isGpcEnabled,
  getDefaultConsent,
} from "./types";
import {
  readCookie,
  parseConsentCookie,
  getCountryFromCookies,
  saveConsentRecord,
} from "./cookies";

export interface ConsentContextValue {
  consent: ConsentPreferences;
  preferences: ConsentPreferences;
  record: ConsentRecord | null;
  country: string;
  isUs: boolean;
  isBannerOpen: boolean;
  isBannerVisible: boolean;
  isSettingsOpen: boolean;
  hasConsent: (category: ConsentCategory) => boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: { analytics: boolean; marketing: boolean }) => void;
  updateConsent: (prefs: { analytics?: boolean; marketing?: boolean }) => void;
  openSettings: () => void;
  closeSettings: () => void;
  dismissBanner: () => void;
  resetConsent: () => void;
}

const defaultContextValue: ConsentContextValue = {
  consent: { necessary: true, analytics: false, marketing: false },
  preferences: { necessary: true, analytics: false, marketing: false },
  record: null,
  country: "",
  isUs: false,
  isBannerOpen: false,
  isBannerVisible: false,
  isSettingsOpen: false,
  hasConsent: (cat) => cat === "necessary",
  acceptAll: () => {},
  rejectNonEssential: () => {},
  savePreferences: () => {},
  updateConsent: () => {},
  openSettings: () => {},
  closeSettings: () => {},
  dismissBanner: () => {},
  resetConsent: () => {},
};

export const ConsentContext =
  createContext<ConsentContextValue>(defaultContextValue);

export interface ConsentProviderProps {
  children: React.ReactNode;
  initialRecord?: ConsentRecord | null;
  initialCountry?: string | null;
  forceBannerOpen?: boolean;
}

export function ConsentProvider({
  children,
  initialRecord,
  initialCountry,
  forceBannerOpen,
}: ConsentProviderProps) {
  // Direct user-driven overrides
  const [userRecord, setUserRecord] = useState<ConsentRecord | null>(null);
  const [userBannerOpen, setUserBannerOpen] = useState<boolean | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Derive country: prop > cookie > empty (treated as outside US)
  const country = useMemo(() => {
    if (initialCountry !== undefined && initialCountry !== null) {
      return initialCountry;
    }
    return getCountryFromCookies();
  }, [initialCountry]);

  const isUs = useMemo(() => isUsCountry(country), [country]);

  // Derive record: user override > prop > cookie
  const record = useMemo(() => {
    if (userRecord) return userRecord;
    if (initialRecord !== undefined && initialRecord !== null) {
      return initialRecord;
    }
    return parseConsentCookie(readCookie("nadeon_consent"));
  }, [userRecord, initialRecord]);

  // Derive banner open state
  const isBannerOpen = useMemo(() => {
    if (forceBannerOpen !== undefined) return forceBannerOpen;
    if (userBannerOpen !== null) return userBannerOpen;
    return record === null || !record.explicit;
  }, [forceBannerOpen, userBannerOpen, record]);

  // Listen for external open settings trigger (e.g. footer link)
  useEffect(() => {
    const handleOpen = () => {
      setIsSettingsOpen(true);
    };

    window.addEventListener("nadeon_open_consent_settings", handleOpen);
    return () => {
      window.removeEventListener("nadeon_open_consent_settings", handleOpen);
    };
  }, []);

  // Compute active preferences: saved record > default by jurisdiction
  const activePreferences: ConsentPreferences = useMemo(() => {
    if (record?.preferences) {
      return record.preferences;
    }
    const gpc = isGpcEnabled();
    return getDefaultConsent(country, gpc);
  }, [record, country]);

  const hasConsent = useCallback(
    (category: ConsentCategory): boolean => {
      if (category === "necessary") return true;
      return Boolean(activePreferences[category]);
    },
    [activePreferences]
  );

  const applyConsent = useCallback(
    (prefs: { analytics: boolean; marketing: boolean }) => {
      const newRecord: ConsentRecord = {
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        country,
        explicit: true,
        preferences: {
          necessary: true,
          analytics: prefs.analytics,
          marketing: prefs.marketing,
        },
      };

      setUserRecord(newRecord);
      setUserBannerOpen(false);
      setIsSettingsOpen(false);
      saveConsentRecord(newRecord);
    },
    [country]
  );

  const acceptAll = useCallback(() => {
    applyConsent({
      analytics: true,
      marketing: true,
    });
  }, [applyConsent]);

  const rejectNonEssential = useCallback(() => {
    applyConsent({
      analytics: false,
      marketing: false,
    });
  }, [applyConsent]);

  const savePreferences = useCallback(
    (prefs: { analytics: boolean; marketing: boolean }) => {
      applyConsent(prefs);
    },
    [applyConsent]
  );

  const updateConsent = useCallback(
    (prefs: { analytics?: boolean; marketing?: boolean }) => {
      applyConsent({
        analytics:
          prefs.analytics !== undefined
            ? prefs.analytics
            : activePreferences.analytics,
        marketing:
          prefs.marketing !== undefined
            ? prefs.marketing
            : activePreferences.marketing,
      });
    },
    [applyConsent, activePreferences]
  );

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const dismissBanner = useCallback(() => {
    setUserBannerOpen(false);
  }, []);

  const resetConsent = useCallback(() => {
    setUserRecord(null);
    setUserBannerOpen(true);
    setIsSettingsOpen(false);
    if (typeof document !== "undefined") {
      document.cookie =
        "nadeon_consent=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, []);

  const contextValue: ConsentContextValue = useMemo(
    () => ({
      consent: activePreferences,
      preferences: activePreferences,
      record,
      country,
      isUs,
      isBannerOpen,
      isBannerVisible: isBannerOpen,
      isSettingsOpen,
      hasConsent,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      updateConsent,
      openSettings,
      closeSettings,
      dismissBanner,
      resetConsent,
    }),
    [
      activePreferences,
      record,
      country,
      isUs,
      isBannerOpen,
      isSettingsOpen,
      hasConsent,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      updateConsent,
      openSettings,
      closeSettings,
      dismissBanner,
      resetConsent,
    ]
  );

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  return context;
}

/**
 * Triggers the consent settings panel to open from any component.
 */
export function openConsentSettings(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("nadeon_open_consent_settings"));
  }
}
