import React from "react";
import { Newsletter } from "@/components/brand/newsletter";

export default function W106Section() {
  return (
    <section aria-labelledby="section-w1-06" className="mb-16">
      <div className="mb-8 pb-4 border-b border-border">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          W1-06 · Global Components
        </span>
        <h2
          id="section-w1-06"
          className="title text-2xl font-black uppercase text-fg"
        >
          Newsletter Subscription
        </h2>
        <p className="lead text-fg-muted text-sm mt-1 max-w-2xl">
          Newsletter subscription module with Human (&quot;Join the Nadeon
          list&quot;) and Pet (&quot;Join the pack&quot;) variants, Zod
          validation, accessible semantic HTML, and FormsProvider integration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Human Variant Showcase */}
        <div
          data-theme="human"
          className="bg-bg text-fg p-8 rounded-card border border-border space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="label text-xs uppercase font-bold tracking-wider text-accent">
              Human Variant
            </span>
            <span className="text-xs text-fg-muted font-mono">
              list: newsletter-human
            </span>
          </div>

          <Newsletter variant="human" />
        </div>

        {/* Pet Variant Showcase */}
        <div
          data-theme="pet"
          className="bg-bg text-fg p-8 rounded-card border border-border space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="label text-xs uppercase font-bold tracking-wider text-accent">
              Pet Variant
            </span>
            <span className="text-xs text-fg-muted font-mono">
              list: newsletter-pet
            </span>
          </div>

          <Newsletter variant="pet" />
        </div>
      </div>
    </section>
  );
}
