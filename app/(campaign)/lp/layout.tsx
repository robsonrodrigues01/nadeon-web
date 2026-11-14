import type React from "react";
import { cookies } from "next/headers";

export default async function CampaignLpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let theme: "human" | "pet" = "human";
  try {
    const cookieStore = await cookies();
    const themeCookie =
      cookieStore.get("nadeon_theme")?.value ?? cookieStore.get("theme")?.value;
    if (themeCookie === "pet") {
      theme = "pet";
    }
  } catch {
    // Fallback to human theme when cookies context is not available
  }

  return (
    <div
      data-theme={theme}
      className="min-h-full flex-1 flex flex-col bg-bg text-fg"
    >
      {children}
    </div>
  );
}
