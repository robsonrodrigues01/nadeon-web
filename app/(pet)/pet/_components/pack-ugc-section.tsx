import React from "react";
import Link from "next/link";
import { Camera } from "lucide-react";

export function PackUgcSection() {
  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="pack-ugc-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
              THE NADEON PACK
            </span>
            <h2
              id="pack-ugc-heading"
              className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
            >
              Share your pack
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              Real customer photos will fill this grid after launch.
            </p>
          </div>
          <div>
            <Link
              href="https://instagram.com/nadeonlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 px-6 py-2.5 inline-flex items-center gap-2 justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
            >
              <Camera className="w-4 h-4" aria-hidden="true" />
              <span>Tag @nadeonlabs</span>
            </Link>
          </div>
        </div>

        {/* Placeholder grid for UGC */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="aspect-square rounded border border-border bg-bg-elevated flex flex-col items-center justify-center p-4 text-center"
            >
              <Camera
                className="w-6 h-6 text-fg-muted mb-2"
                aria-hidden="true"
              />
              <span className="text-xs text-fg-muted font-mono">
                @nadeonlabs
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
