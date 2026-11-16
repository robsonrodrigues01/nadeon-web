"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Kit } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { Claim } from "@/components/commerce/product-card/claim";
import { useMarket } from "@/lib/market";
import type { KitCartLine } from "./kit-lines";

export interface HeroProps {
  energyDuoKit?: Kit | null;
  kitLines?: KitCartLine[];
}

export function Hero({ energyDuoKit, kitLines = [] }: HeroProps) {
  const { formatMoney } = useMarket();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalSlides = 4;

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const formattedKitPrice = energyDuoKit
    ? formatMoney(energyDuoKit.price)
    : null;

  const handleAddEnergyDuo = async () => {
    setIsAdding(true);
    setFeedback(null);
    try {
      await cartProvider.addLines(kitLines);
      setFeedback("Added Energy Duo to cart");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("Could not add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section
      aria-label="Hero showcase"
      className="relative w-full overflow-hidden border-b border-border bg-bg text-fg py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Carousel controls */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-elevated text-fg transition-colors hover:bg-border focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-elevated text-fg transition-colors hover:bg-border focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Next slide</span>
          </button>
        </div>

        {/* Slide 1: Best Sellers (Default) */}
        {currentSlide === 0 && (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
                NMN · NAD⁺ · MADE IN USA
              </span>
              <h1 className="mt-6 font-archivo text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg leading-none">
                Cellular energy, every single day.*
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-fg-muted font-normal leading-relaxed">
                Clean NMN and NAD⁺ formulas, tested lot by lot in our Clifton,
                New Jersey lab.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="#daily-routine"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Shop best sellers
                </Link>
                <Link
                  href="/human/quiz"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-6 py-3 text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Take the quiz
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs sm:text-sm font-bold uppercase tracking-wide text-fg-muted">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Third-party tested
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  60-day guarantee
                </span>
              </div>
            </div>

            <div className="relative grid min-w-0 grid-cols-2 items-center justify-center gap-3 sm:flex sm:gap-6">
              <div className="flex min-w-0 flex-col items-center rounded-card border border-border bg-bg-elevated p-3 shadow-card sm:p-6">
                <div className="relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32">
                  <Image
                    src="/renders/biohack.png"
                    alt="BioHack NMN 500 mg"
                    width={128}
                    height={128}
                    className="object-contain"
                    loading="eager"
                  />
                </div>
                <span className="mt-3 font-archivo text-lg font-bold text-fg">
                  BioHack
                </span>
                <span className="text-xs uppercase font-medium text-fg-muted">
                  NMN 500 mg
                </span>
              </div>
              <div className="flex min-w-0 flex-col items-center rounded-card border border-border bg-bg-elevated p-3 shadow-card sm:p-6">
                <div className="relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32">
                  <Image
                    src="/renders/full-charge.png"
                    alt="Full Charge NMN 4-in-1"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
                <span className="mt-3 font-archivo text-lg font-bold text-fg">
                  Full Charge
                </span>
                <span className="text-xs uppercase font-medium text-fg-muted">
                  NMN 4-in-1
                </span>
              </div>
              <div className="hidden sm:flex flex-col items-center rounded-card border border-border bg-bg-elevated p-6 shadow-card">
                <div className="h-32 w-32 relative flex items-center justify-center">
                  <Image
                    src="/renders/renew.png"
                    alt="Renew NAD+ and Resveratrol"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
                <span className="mt-3 font-archivo text-lg font-bold text-fg">
                  Renew
                </span>
                <span className="text-xs uppercase font-medium text-fg-muted">
                  NAD+ + Resveratrol
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2: Bundle & Save (Energy Duo) */}
        {currentSlide === 1 && (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-fg">
                BUNDLE &amp; SAVE 15%
              </span>
              <h2 className="mt-6 font-archivo text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg leading-none">
                Two paths to NAD⁺.
              </h2>
              <div className="mt-5 text-lg sm:text-xl text-fg-muted font-normal leading-relaxed">
                <Claim>
                  BioHack for daily NMN plus Renew for direct NAD⁺. One routine,
                  one price.*
                </Claim>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleAddEnergyDuo}
                  disabled={isAdding || kitLines.length === 0}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
                >
                  {isAdding
                    ? "Adding..."
                    : `Add the Energy Duo${formattedKitPrice ? ` · ${formattedKitPrice}` : ""}`}
                </button>
                <Link
                  href="#daily-routine"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-6 py-3 text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Compare formulas
                </Link>
              </div>
              {feedback && (
                <p
                  className="mt-3 text-xs font-medium text-accent"
                  role="status"
                >
                  {feedback}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center rounded-card border border-border bg-bg-elevated p-6 shadow-card">
                <div className="h-36 w-36 relative flex items-center justify-center">
                  <Image
                    src="/renders/biohack.png"
                    alt="BioHack NMN 500 mg"
                    width={144}
                    height={144}
                    className="object-contain"
                  />
                </div>
                <span className="mt-3 font-archivo text-lg font-bold text-fg">
                  BioHack
                </span>
                <span className="text-xs uppercase font-medium text-fg-muted">
                  NMN 500 mg
                </span>
              </div>
              <span className="text-2xl font-black text-accent">+</span>
              <div className="flex flex-col items-center rounded-card border border-border bg-bg-elevated p-6 shadow-card">
                <div className="h-36 w-36 relative flex items-center justify-center">
                  <Image
                    src="/renders/renew.png"
                    alt="Renew NAD+ and Resveratrol"
                    width={144}
                    height={144}
                    className="object-contain"
                  />
                </div>
                <span className="mt-3 font-archivo text-lg font-bold text-fg">
                  Renew
                </span>
                <span className="text-xs uppercase font-medium text-fg-muted">
                  NAD+ + Resveratrol
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3: Quiz Preview */}
        {currentSlide === 2 && (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
                NEW HERE?
              </span>
              <h2 className="mt-6 font-archivo text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg leading-none">
                10% off your first order.
              </h2>
              <p className="mt-5 text-lg sm:text-xl text-fg-muted font-normal leading-relaxed">
                Answer 5 quick questions. Get the routine that fits your age and
                goals, plus 10% off.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/human/quiz"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Take the 60-second quiz
                </Link>
                <Link
                  href="/human/shop"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-6 py-3 text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Shop all formulas
                </Link>
              </div>
            </div>

            <div className="rounded-card border border-border bg-bg-elevated p-8 shadow-card max-w-md w-full">
              <ol className="space-y-4">
                <li className="flex items-center gap-4 border-b border-border pb-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg font-black text-sm">
                    1
                  </span>
                  <span className="font-semibold text-fg text-sm sm:text-base">
                    How old are you?
                  </span>
                </li>
                <li className="flex items-center gap-4 border-b border-border pb-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg font-black text-sm">
                    2
                  </span>
                  <span className="font-semibold text-fg text-sm sm:text-base">
                    What is your main goal?
                  </span>
                </li>
                <li className="flex items-center gap-4 border-b border-border pb-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg font-black text-sm">
                    3
                  </span>
                  <span className="font-semibold text-fg text-sm sm:text-base">
                    Capsules, powder or drops?
                  </span>
                </li>
              </ol>
              <div className="mt-6 text-center">
                <span className="font-archivo text-xs uppercase font-bold tracking-wider text-accent">
                  → Your routine + 10% off
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Slide 4: Black Friday Campaign Template */}
        {currentSlide === 3 && (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-fg">
                BLACK FRIDAY · UP TO 25% OFF
              </span>
              <h2 className="mt-6 font-archivo text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg leading-none">
                Black Friday
              </h2>
              <p className="mt-5 text-lg sm:text-xl text-fg-muted font-normal leading-relaxed">
                Up to 25% off every NMN and NAD⁺ formula. Buy more, save more.
                No code needed.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/human/shop"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Shop the sale
                </Link>
                <Link
                  href="#bundles"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-6 py-3 text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
                >
                  See the kits
                </Link>
              </div>
            </div>

            <div className="rounded-card border border-border bg-bg-elevated p-8 shadow-card max-w-md w-full text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-fg-muted">
                Ends November 30
              </span>
              <div className="mt-6 flex justify-center gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <span className="font-archivo text-3xl sm:text-4xl font-black text-fg">
                    03
                  </span>
                  <span className="text-xs uppercase text-fg-muted">Days</span>
                </div>
                <span className="font-archivo text-2xl font-black text-accent">
                  :
                </span>
                <div className="flex flex-col">
                  <span className="font-archivo text-3xl sm:text-4xl font-black text-fg">
                    14
                  </span>
                  <span className="text-xs uppercase text-fg-muted">Hours</span>
                </div>
                <span className="font-archivo text-2xl font-black text-accent">
                  :
                </span>
                <div className="flex flex-col">
                  <span className="font-archivo text-3xl sm:text-4xl font-black text-fg">
                    22
                  </span>
                  <span className="text-xs uppercase text-fg-muted">Min</span>
                </div>
                <span className="font-archivo text-2xl font-black text-accent">
                  :
                </span>
                <div className="flex flex-col">
                  <span className="font-archivo text-3xl sm:text-4xl font-black text-fg">
                    05
                  </span>
                  <span className="text-xs uppercase text-fg-muted">Sec</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
