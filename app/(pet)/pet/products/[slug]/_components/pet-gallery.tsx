"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/contracts/catalog";

export interface PetGalleryProps {
  product: Product;
  className?: string;
}

interface GalleryItem {
  id: string;
  label: string;
  badge?: string;
  imageSrc?: string;
  description: string;
}

export function PetGallery({ product, className = "" }: PetGalleryProps) {
  // Badge from the species only: age ranges are not in the catalog contract
  const audienceBadge = product.species
    ? `FOR ${product.species.toUpperCase()}S`
    : "";

  // No hardcoded image: a product without images shows the placeholder, never another product's photo
  const fallbackImage = product.images[0];

  const galleryItems: GalleryItem[] = [
    {
      id: "jar",
      label: "Jar",
      description: `${product.name} jar front view`,
      imageSrc: fallbackImage,
    },
    {
      id: "format",
      label: "The chew",
      description: `${product.name} texture and format`,
    },
    {
      id: "label",
      label: "Label",
      description: `${product.name} full product label and directions`,
      imageSrc: product.images[1],
    },
    {
      id: "dose",
      label: "Dose by weight",
      description: "Dosing recommendations by pet weight band",
    },
    {
      id: "supplement-facts",
      label: "Supplement facts",
      description: "Full guaranteed analysis and active ingredient breakdown",
    },
    {
      id: "pet-photo",
      label: "Dog photo",
      description: "Happy healthy companion in daily routine",
    },
    {
      id: "lab-report",
      label: "Lab report",
      description: "First lots publishing soon",
    },
    {
      id: "video",
      label: "▶ Video",
      description: "Behind the science and routine video overview",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = galleryItems[activeIndex] || galleryItems[0];

  return (
    <section
      aria-label="Product media gallery"
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* Main Image Viewport */}
      <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] rounded-card overflow-hidden bg-gradient-to-br from-accent/15 via-bg-elevated to-accent/25 border border-border flex items-center justify-center p-6 sm:p-10 select-none shadow-card">
        {/* Subtle decorative paw watermark */}
        <div
          aria-hidden="true"
          className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-fg"
        >
          <svg
            viewBox="0 0 100 100"
            width="280"
            height="280"
            fill="currentColor"
            className="block"
          >
            <ellipse
              cx="22"
              cy="42"
              rx="9"
              ry="12"
              transform="rotate(-25 22 42)"
            />
            <ellipse
              cx="39"
              cy="24"
              rx="9.5"
              ry="13"
              transform="rotate(-8 39 24)"
            />
            <ellipse
              cx="61"
              cy="24"
              rx="9.5"
              ry="13"
              transform="rotate(8 61 24)"
            />
            <ellipse
              cx="78"
              cy="42"
              rx="9"
              ry="12"
              transform="rotate(25 78 42)"
            />
            <path d="M50 48 C 38 48 28 60 24 70 C 20 80 26 90 36 89 C 42 88 46 85 50 85 C 54 85 58 88 64 89 C 74 90 80 80 76 70 C 72 60 62 48 50 48 Z" />
          </svg>
        </div>

        {/* Top-left Audience Badge */}
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center rounded-pill bg-fg text-bg px-3.5 py-1 text-xs font-bold tracking-wider uppercase shadow-xs">
            {audienceBadge}
          </span>
        </div>

        {/* Bottom-right Slide Counter */}
        <div className="absolute right-4 bottom-4 z-10">
          <span className="inline-flex items-center rounded-pill bg-fg/80 text-bg backdrop-blur-xs px-3 py-1 text-xs font-bold">
            {activeIndex + 1} / {galleryItems.length}
          </span>
        </div>

        {/* Active Item Visual Container */}
        <div className="relative flex flex-col items-center justify-center max-w-full max-h-full">
          {activeItem.imageSrc ? (
            <Image
              src={activeItem.imageSrc}
              alt={`${product.name} - ${activeItem.label}`}
              width={340}
              height={340}
              sizes="(min-width: 640px) 340px, 300px"
              className="max-h-[300px] sm:max-h-[400px] w-auto object-contain drop-shadow-xl transition-all duration-200"
              loading={activeIndex === 0 ? "eager" : "lazy"}
            />
          ) : (
            <div className="flex flex-col items-center text-center p-6 rounded-field bg-bg/90 border border-border/80 shadow-sm max-w-xs sm:max-w-sm">
              <span className="text-xs font-extrabold uppercase tracking-wider text-accent mb-1">
                {product.name}
              </span>
              <h3 className="text-lg font-extrabold text-fg mb-2">
                {activeItem.label}
              </h3>
              <p className="text-xs text-fg-muted">{activeItem.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails Navigation Row */}
      <div
        role="region"
        aria-label="Gallery thumbnails"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        {galleryItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-pressed={isActive}
              aria-label={`View ${item.label}`}
              className={`min-h-11 px-3.5 py-2 rounded-field text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? "bg-fg text-bg border-fg shadow-sm"
                  : "bg-bg-elevated text-fg/80 border-border hover:border-fg/40 hover:text-fg"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
