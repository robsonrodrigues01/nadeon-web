import React from "react";
import process from "node:process";
import { notFound } from "next/navigation";
import { sections } from "./sections";

export const dynamic = "force-dynamic";

export default async function DevKitPage() {
  const isDev = process.env.NODE_ENV === "development";
  const isPreview = process.env.VERCEL_ENV === "preview";
  const isExplicit = process.env.DEV_KIT === "1";
  const isVercelProd = process.env.VERCEL_ENV === "production";

  // Restricted to development and preview environments; returns 404 in production
  if (
    isVercelProd ||
    (!isDev &&
      !isPreview &&
      !isExplicit &&
      process.env.NODE_ENV === "production")
  ) {
    notFound();
  }

  // Render each section as an element so React owns the call: client sections
  // ("use client") cannot be invoked as functions from the server.
  const renderedSections = sections.map((section) => {
    const Component = section.Component;
    return <Component key={section.id} />;
  });

  return (
    <main
      className="min-h-screen bg-bg text-fg px-4 py-10 sm:px-8 max-w-7xl mx-auto"
      id="main-content"
      tabIndex={-1}
    >
      <header className="mb-10 pb-6 border-b border-border">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Design System &amp; Brand Kit
        </span>
        <h1 className="hero text-4xl sm:text-6xl font-black uppercase tracking-tight text-fg">
          Nadeon Dev Kit
        </h1>
        <p className="lead text-fg-muted mt-2 max-w-2xl">
          Visual verification workbench for tokens, typographic scale, component
          states, and multi-market catalog rendering.
        </p>
      </header>

      {renderedSections}
    </main>
  );
}
