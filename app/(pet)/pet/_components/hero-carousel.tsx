"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { Claim } from "@/components/commerce/product-card/claim";

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  const totalSlides = 3;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-bg text-fg border-b border-border py-12 md:py-20 lg:py-24"
      aria-roledescription="carousel"
      aria-label="Hero Carousel"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Slide 1 */}
        {activeSlide === 0 && (
          <div
            role="group"
            aria-roledescription="slide"
            aria-label="1 of 3: More good years together"
            className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16"
          >
            <div className="flex-1 max-w-2xl text-left">
              <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
                NMN FOR DOGS · CATS · HORSES
              </span>
              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-normal font-sans tracking-tight text-fg">
                More good years together.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-fg-muted leading-relaxed">
                <Claim>
                  Tasty soft chews, treats, oils and drops with NMN, made in
                  small numbered lots in Clifton, New Jersey.*
                </Claim>
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/pet/dogs"
                  className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
                >
                  Shop for dogs
                </Link>
                <Link
                  href="/pet/quiz"
                  className="min-h-11 px-6 py-3 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
                >
                  Find the right formula
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-fg-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className="w-4 h-4 text-accent"
                    aria-hidden="true"
                  />
                  <span>Third-party tested</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Vet-reviewed formulas</span>
                </div>
              </div>
            </div>

            {/* Showcase items */}
            <div className="flex-1 w-full max-w-lg grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <div className="p-4 rounded border border-border bg-bg-elevated shadow-card">
                <span className="text-xs font-mono text-accent uppercase">
                  Senior · NMN 75 mg
                </span>
                <p className="text-base font-medium text-fg">More Good Years</p>
              </div>
              <div className="p-4 rounded border border-border bg-bg-elevated shadow-card">
                <span className="text-xs font-mono text-accent uppercase">
                  Joints · NMN 50 mg
                </span>
                <p className="text-base font-medium text-fg">Golden Years</p>
              </div>
              <div className="p-4 rounded border border-border bg-bg-elevated shadow-card">
                <span className="text-xs font-mono text-accent uppercase">
                  Calm · NMN 50 mg
                </span>
                <p className="text-base font-medium text-fg">Still Sharp</p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2 */}
        {activeSlide === 1 && (
          <div
            role="group"
            aria-roledescription="slide"
            aria-label="2 of 3: Easier walks, every day"
            className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16"
          >
            <div className="flex-1 max-w-2xl text-left">
              <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
                GOLDEN YEARS · JOINTS
              </span>
              <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-normal font-sans tracking-tight text-fg">
                Easier walks, every day.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-fg-muted leading-relaxed">
                <Claim>
                  Glucosamine, MSM and NMN in a soft chew dogs ask for. Pair it
                  with the oil for extra support.*
                </Claim>
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/pet/dogs"
                  className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
                >
                  Shop Golden Years
                </Link>
                <Link
                  href="/pet/kits"
                  className="min-h-11 px-6 py-3 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
                >
                  See the joint bundle
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg flex flex-col gap-3">
              <div className="p-4 rounded border border-border bg-bg-elevated shadow-card">
                <span className="text-xs font-mono text-accent uppercase">
                  Joints · NMN 50 mg
                </span>
                <p className="text-base font-medium text-fg">Golden Years</p>
              </div>
              <div className="p-4 rounded border border-border bg-bg-elevated shadow-card">
                <span className="text-xs font-mono text-accent uppercase">
                  Oils · Drops on food
                </span>
                <p className="text-base font-medium text-fg">
                  Golden Years Oil
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3 */}
        {activeSlide === 2 && (
          <div
            role="group"
            aria-roledescription="slide"
            aria-label="3 of 3: Never run out of good days"
            className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16"
          >
            <div className="flex-1 max-w-2xl text-left">
              <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
                SUBSCRIBE & SAVE 15%
              </span>
              <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-normal font-sans tracking-tight text-fg">
                Never run out of good days.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-fg-muted leading-relaxed">
                Chews, treats or oils delivered every 30, 60 or 90 days. Skip,
                pause or cancel anytime.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/pet/subscribe"
                  className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
                >
                  Build a subscription
                </Link>
                <Link
                  href="#how-it-works"
                  className="min-h-11 px-6 py-3 inline-flex items-center justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
                >
                  How it works
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg flex flex-col gap-3">
              <div className="p-4 rounded border border-border bg-bg-elevated shadow-card flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-accent">Day 1</span>
                  <p className="text-sm font-medium text-fg">More Good Years</p>
                </div>
                <span className="text-xs text-fg-muted">Delivered</span>
              </div>
              <div className="p-4 rounded border border-border bg-bg-elevated shadow-card flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-accent">Day 30</span>
                  <p className="text-sm font-medium text-fg">More Good Years</p>
                </div>
                <span className="text-xs text-fg-muted">Delivered</span>
              </div>
              <div className="p-4 rounded border border-border bg-bg-elevated shadow-card flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-accent">Day 60</span>
                  <p className="text-sm font-medium text-fg">More Good Years</p>
                </div>
                <span className="text-xs text-fg-muted">Delivered</span>
              </div>
            </div>
          </div>
        )}

        {/* Carousel controls */}
        <div className="mt-10 flex items-center justify-between pt-6 border-t border-border/50">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={activeSlide === idx ? "true" : undefined}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeSlide === idx
                    ? "bg-accent"
                    : "bg-border hover:bg-fg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="min-w-11 min-h-11 inline-flex items-center justify-center rounded border border-border hover:border-accent text-fg hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="min-w-11 min-h-11 inline-flex items-center justify-center rounded border border-border hover:border-accent text-fg hover:text-accent transition-colors"
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
