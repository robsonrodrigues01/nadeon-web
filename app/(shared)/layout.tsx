import type React from "react";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { MeasurementScripts } from "@/components/layout/measurement-scripts";
import { ConsentProvider } from "@/lib/consent";

export default function SharedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ConsentProvider>
      <MeasurementScripts />
      {children}
      <CookieBanner />
    </ConsentProvider>
  );
}
