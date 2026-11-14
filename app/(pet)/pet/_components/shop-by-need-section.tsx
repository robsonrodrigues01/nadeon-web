import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ShopByNeedSection() {
  const needs = [
    {
      title: "Longevity",
      products: "More Good Years chews + oil",
      href: "/pet/dogs",
      description:
        "NAD+ replenishment for vitality, mitochondrial energy and cellular repair.",
    },
    {
      title: "Joints",
      products: "Golden Years chews + oil",
      href: "/pet/dogs",
      description:
        "Glucosamine, MSM, and NMN for easy movement, flexibility and hips.",
    },
    {
      title: "Calm",
      products: "Still Sharp chews + oil",
      href: "/pet/dogs",
      description:
        "L-theanine and chamomile for relaxed mood and quiet nights.",
    },
    {
      title: "Skin & coat",
      products: "Shine On chews + oil",
      href: "/pet/dogs",
      description:
        "Omega-rich formula supporting lustrous coat and resilient skin barriers.",
    },
  ];

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="shop-by-need-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
            SHOP BY NEED
          </span>
          <h2
            id="shop-by-need-heading"
            className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            What does your dog need?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {needs.map((need) => (
            <Link
              key={need.title}
              href={need.href}
              className="group p-6 rounded border border-border bg-bg-elevated shadow-card hover:border-accent transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-medium text-fg group-hover:text-accent transition-colors">
                  {need.title}
                </h3>
                <p className="mt-2 text-xs font-mono text-accent">
                  {need.products}
                </p>
                <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                  {need.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-medium text-fg group-hover:text-accent">
                <span>View products</span>
                <ArrowRight
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
