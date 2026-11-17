"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { BreedGuide, BreedIndex } from "@/lib/contracts/content";

interface BreedBrowserProps {
  initialBreeds: BreedGuide[];
  breedIndex: BreedIndex;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function BreedBrowser({ initialBreeds, breedIndex }: BreedBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("All sizes");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("Dogs");
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [showRequestNotice, setShowRequestNotice] = useState<boolean>(false);

  // Filtered breeds calculation
  const filteredBreeds = useMemo(() => {
    return initialBreeds.filter((breed) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = breed.title.toLowerCase().includes(q);
        const matchesFacts =
          breed.facts.group.toLowerCase().includes(q) ||
          breed.facts.size.toLowerCase().includes(q);
        if (!matchesTitle && !matchesFacts) return false;
      }

      // Letter filter
      if (selectedLetter) {
        if (!breed.title.toUpperCase().startsWith(selectedLetter)) {
          return false;
        }
      }

      // Size filter
      if (selectedSize !== "All sizes") {
        if (breed.facts.size.toLowerCase() !== selectedSize.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [initialBreeds, searchQuery, selectedLetter, selectedSize]);

  const displayedBreeds = filteredBreeds.slice(0, visibleCount);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedLetter(null);
    setSelectedSize("All sizes");
    setVisibleCount(12);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Search Bar & Popular Shortcuts */}
      <div className="flex flex-col gap-4">
        <form
          role="search"
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 bg-bg-elevated/70 border border-border/80 rounded-full p-2 pl-5 max-w-2xl shadow-sm focus-within:border-accent"
        >
          <span aria-hidden="true" className="text-fg-muted text-lg pl-1">
            ⌕
          </span>
          <label htmlFor="breed-search-input" className="sr-only">
            Search your breed
          </label>
          <input
            id="breed-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(12);
            }}
            placeholder="Search your breed, e.g. [Breed]"
            className="flex-1 bg-transparent text-fg text-base focus:outline-none placeholder:text-fg-muted/60 w-full"
          />
          <button
            type="submit"
            className="min-h-11 px-6 py-2.5 rounded-full bg-fg text-bg font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto"
          >
            Search
          </button>
        </form>

        {/* Popular Breeds */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-bold tracking-wider text-fg-muted uppercase">
            POPULAR:
          </span>
          <span className="py-1.5 px-3 rounded-full bg-bg-elevated border border-border/70 text-fg-muted font-medium">
            To be confirmed
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-6 p-5 sm:p-7 rounded-2xl bg-bg-elevated/40 border border-border/60">
        {/* A-Z Letter Index */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold tracking-widest uppercase text-fg-muted">
              JUMP TO LETTER
            </span>
            {selectedLetter && (
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="text-xs font-semibold text-accent hover:underline cursor-pointer"
              >
                Clear letter filter
              </button>
            )}
          </div>
          <div
            role="group"
            aria-label="Jump to letter"
            className="flex flex-wrap gap-1.5 sm:gap-2"
          >
            {ALPHABET.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => {
                    setSelectedLetter(isSelected ? null : letter);
                    setVisibleCount(12);
                  }}
                  aria-pressed={isSelected}
                  className={`min-w-8 h-8 sm:min-w-9 sm:h-9 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-fg text-bg border-fg"
                      : "border-border/70 text-fg hover:border-fg bg-bg-elevated"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Filters & Species Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-border/40">
          {/* Size Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-fg-muted">
              SIZE:
            </span>
            <div
              role="group"
              aria-label="Filter by size"
              className="flex flex-wrap gap-2"
            >
              {breedIndex.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setVisibleCount(12);
                    }}
                    aria-pressed={isSelected}
                    className={`min-h-9 py-1.5 px-3.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-fg text-bg border-fg"
                        : "border-border/70 text-fg hover:border-fg bg-bg-elevated"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Species Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-fg-muted sr-only">
              Species:
            </span>
            <div
              role="group"
              aria-label="Filter by species"
              className="inline-flex rounded-full border border-border/80 bg-bg-elevated p-1"
            >
              {breedIndex.species.map((sp) => {
                const isSelected = selectedSpecies === sp;
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSelectedSpecies(sp)}
                    aria-pressed={isSelected}
                    className={`min-h-8 py-1 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-accent text-accent-fg font-extrabold shadow-xs"
                        : "text-fg hover:text-accent"
                    }`}
                  >
                    {sp}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header and Size Key */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-fg-muted border-b border-border/40 pb-3">
        <span className="font-extrabold uppercase tracking-wider text-fg text-sm">
          {filteredBreeds.length} breed guides
        </span>
        <span className="italic">
          Size key: Small up to To be confirmed lb · Medium To be confirmed to
          To be confirmed lb · Large To be confirmed to To be confirmed lb ·
          Giant over To be confirmed lb
        </span>
      </div>

      {/* Breeds Grid */}
      {displayedBreeds.length > 0 ? (
        <div
          role="region"
          aria-label="Breed guides list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {displayedBreeds.map((breed) => (
            <article
              key={breed.slug}
              className="flex flex-col rounded-2xl border border-border/80 bg-bg-elevated/40 overflow-hidden hover:border-fg/40 transition-all group shadow-xs"
            >
              {/* Photo Area */}
              <div className="aspect-[4/3] bg-bg-elevated flex items-center justify-center border-b border-border/60 relative overflow-hidden">
                <span className="text-xs font-bold tracking-wider text-fg-muted/60 uppercase">
                  Photo
                </span>
                <span className="absolute top-3 right-3 text-[11px] font-bold py-1 px-2.5 rounded-full bg-bg/80 text-fg border border-border/60">
                  {breed.facts.size}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h2 className="font-archivo font-extrabold text-lg sm:text-xl text-fg leading-tight group-hover:text-accent transition-colors">
                    {breed.title}
                  </h2>
                  <p className="text-xs text-fg-muted mt-1 font-medium">
                    {breed.facts.group !== "To be confirmed"
                      ? breed.facts.group
                      : "Care guide & health topics"}
                  </p>
                </div>

                {/* Breed guide link pointing to existing route */}
                <div className="pt-2 border-t border-border/40">
                  <Link
                    href="/pet/quiz"
                    aria-label={`Breed guide for ${breed.title} (Take quiz while guide publishes)`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline group-hover:gap-2 transition-all"
                  >
                    Breed guide <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-bg-elevated/20 flex flex-col items-center gap-3">
          <p className="font-bold text-fg text-base">No breeds found</p>
          <p className="text-sm text-fg-muted max-w-md">
            We couldn&apos;t find any breeds matching your current filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-2 min-h-10 px-5 py-2 rounded-full bg-fg text-bg font-bold text-xs hover:opacity-90 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Load More Breeds */}
      <div className="flex flex-col items-center gap-3 py-6">
        <button
          type="button"
          onClick={() => setVisibleCount((c) => c + 12)}
          disabled={visibleCount >= filteredBreeds.length}
          className="min-h-12 py-3 px-8 rounded-full border border-border/80 text-fg font-extrabold text-sm sm:text-base hover:border-fg bg-bg-elevated/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          Load more breeds
        </button>
        <span className="text-xs font-medium text-fg-muted">
          Showing {Math.min(visibleCount, filteredBreeds.length)} of{" "}
          {filteredBreeds.length}
        </span>
      </div>

      {/* Don't see your breed? Section */}
      <section
        aria-label="Missing breed support"
        className="rounded-3xl border border-border/80 bg-gradient-to-r from-bg-elevated/80 via-bg-elevated/50 to-bg-elevated/80 p-8 sm:p-12 mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
      >
        <div className="max-w-xl">
          <h2 className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg">
            Don&apos;t see your breed?
          </h2>
          <p className="text-sm sm:text-base text-fg-muted mt-2.5 leading-relaxed">
            Mixed breed or a breed we have not covered yet? Take the quiz for a
            routine and dose by your dog&apos;s size and age.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href="/pet/quiz"
            className="min-h-12 py-3 px-6 rounded-full bg-accent text-accent-fg font-extrabold text-sm hover:opacity-95 transition-all text-center flex-1 sm:flex-initial shadow-sm"
          >
            Take the quiz
          </Link>
          <button
            type="button"
            onClick={() => setShowRequestNotice(true)}
            className="min-h-12 py-3 px-6 rounded-full border border-border/80 text-fg font-extrabold text-sm hover:border-fg bg-bg-elevated/60 transition-all cursor-pointer flex-1 sm:flex-initial"
          >
            Request a breed
          </button>
        </div>
      </section>

      {/* Request Notice Modal/Alert */}
      {showRequestNotice && (
        <div
          role="status"
          className="p-4 rounded-2xl border border-accent/40 bg-accent/10 flex justify-between items-center text-sm font-bold text-fg"
        >
          <span>
            Request a breed: To be confirmed. We are prioritizing our next batch
            of veterinary-reviewed breed guides.
          </span>
          <button
            type="button"
            onClick={() => setShowRequestNotice(false)}
            aria-label="Close notice"
            className="ml-4 text-xs underline cursor-pointer text-fg-muted hover:text-fg"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
