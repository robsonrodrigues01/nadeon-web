"use client";

import React from "react";
import { type ConsentCategory } from "./types";
import { useConsent } from "./consent-context";

export interface ConsentGateProps {
  category?: ConsentCategory;
  /**
   * Alias for category to support Portuguese naming from project plan
   */
  categoria?: ConsentCategory;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders child components or scripts only if the user has
 * granted consent for the specified category.
 */
export function ConsentGate({
  category,
  categoria,
  children,
  fallback = null,
}: ConsentGateProps) {
  const { hasConsent } = useConsent();

  const targetCategory = category ?? categoria ?? "necessary";
  const permitted = hasConsent(targetCategory);

  if (!permitted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
