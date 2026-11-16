"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { NewsletterProps } from "./newsletter";

const LazyNewsletter = dynamic(
  () => import("./newsletter").then((module) => module.Newsletter),
  {
    ssr: false,
    loading: () => (
      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-label="Newsletter form loading"
      >
        Loading newsletter form
      </span>
    ),
  }
);

export function DeferredNewsletter(props: NewsletterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof IntersectionObserver === "undefined") {
      const timeoutId = window.setTimeout(() => setNearViewport(true), 0);
      return () => window.clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[220px] sm:min-h-[200px] max-w-xl"
      aria-busy={!nearViewport ? "true" : undefined}
    >
      {nearViewport ? (
        <LazyNewsletter {...props} />
      ) : (
        <span
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-label="Newsletter form loading"
        >
          Newsletter form loading
        </span>
      )}
    </div>
  );
}
