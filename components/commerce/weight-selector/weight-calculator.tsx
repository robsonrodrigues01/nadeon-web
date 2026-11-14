"use client";

import React, { useState, useId } from "react";
import type { Product } from "@/lib/contracts/catalog";
import type {
  PetSpecies,
  PetAgeGroup,
  ActivityLevel,
  WeightUnit,
  WeightBand,
} from "@/lib/dosing/types";
import {
  calculateDose,
  getSpeciesDosingTable,
  convertLbToKg,
  convertKgToLb,
  formatWeight,
  getWeightBandForWeight,
} from "@/lib/dosing";
import { WeightSelector } from "./weight-selector";

export interface WeightCalculatorProps {
  product?: Pick<
    Product,
    "slug" | "name" | "species" | "dosingByWeight"
  > | null;
  initialSpecies?: PetSpecies;
  initialWeight?: number;
  initialUnit?: WeightUnit;
  className?: string;
}

export function WeightCalculator({
  product = null,
  initialSpecies = "dog",
  initialWeight = 35,
  initialUnit = "lb",
  className = "",
}: WeightCalculatorProps) {
  const componentId = useId();

  const [species, setSpecies] = useState<PetSpecies>(initialSpecies);
  const [weight, setWeight] = useState<number>(initialWeight);
  const [unit, setUnit] = useState<WeightUnit>(initialUnit);
  const [age, setAge] = useState<PetAgeGroup>("senior");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [activeTableSpecies, setActiveTableSpecies] =
    useState<PetSpecies>("dog");

  // Determine current active weight band from weight and unit
  const activeBand = getWeightBandForWeight(weight, unit);

  // Calculate dosing result pure function
  const doseResult = calculateDose({
    species,
    weight,
    unit,
    age,
    activity,
    product,
  });

  const handleUnitToggle = (newUnit: WeightUnit) => {
    if (newUnit === unit) return;
    if (newUnit === "kg") {
      setWeight(convertLbToKg(weight, 1));
    } else {
      setWeight(convertKgToLb(weight, 1));
    }
    setUnit(newUnit);
  };

  const handleBandSelect = (band: WeightBand) => {
    // Pick middle of the band for representative weight
    let targetLbs = 35;
    if (band.id === "up-to-20") targetLbs = 15;
    else if (band.id === "21-to-50") targetLbs = 35;
    else if (band.id === "51-to-90") targetLbs = 70;
    else if (band.id === "over-90") targetLbs = 100;

    if (unit === "kg") {
      setWeight(convertLbToKg(targetLbs, 1));
    } else {
      setWeight(targetLbs);
    }
  };

  const referenceTable = getSpeciesDosingTable(activeTableSpecies);

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calculator Inputs Form */}
        <div className="lg:col-span-7 space-y-6 rounded-card border border-border bg-bg-elevated p-6 sm:p-8">
          {/* Step 1: Species */}
          <fieldset className="border-0 p-0 m-0 space-y-3">
            <legend className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-fg">
              <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-accent text-accent-fg text-xs font-bold">
                1
              </span>
              <span>Species</span>
            </legend>
            <div
              role="radiogroup"
              aria-label="Pet species selection"
              className="grid grid-cols-3 gap-3"
            >
              {(["dog", "cat", "horse"] as const).map((s) => {
                const isSelected = species === s;
                const inputId = `${componentId}-species-${s}`;
                const label = s.charAt(0).toUpperCase() + s.slice(1);

                return (
                  <label
                    key={s}
                    htmlFor={inputId}
                    className={`flex flex-col items-center justify-center rounded-card p-4 min-h-[56px] cursor-pointer border font-bold transition-all ${
                      isSelected
                        ? "bg-fg text-bg border-fg shadow-sm"
                        : "bg-bg text-fg border-border hover:border-fg/40"
                    }`}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={`${componentId}-species`}
                      value={s}
                      checked={isSelected}
                      onChange={() => setSpecies(s)}
                      className="sr-only"
                      aria-label={label}
                    />
                    <span className="text-sm uppercase tracking-wide">
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Step 2: Weight */}
          <fieldset className="border-0 p-0 m-0 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <legend className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-fg">
                <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-accent text-accent-fg text-xs font-bold">
                  2
                </span>
                <span>Weight</span>
              </legend>
              <span className="text-xs text-fg-muted font-medium">
                Use a recent weigh-in
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <label
                  htmlFor={`${componentId}-weight-input`}
                  className="sr-only"
                >
                  Pet weight in {unit}
                </label>
                <input
                  id={`${componentId}-weight-input`}
                  type="number"
                  min="1"
                  max={species === "horse" ? "2500" : "250"}
                  step="0.5"
                  value={weight}
                  onChange={(e) =>
                    setWeight(Math.max(1, parseFloat(e.target.value) || 1))
                  }
                  className="w-full rounded-card border border-border bg-bg px-4 py-3 text-lg font-bold text-fg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-fg-muted">
                  {unit}
                </span>
              </div>

              {/* Unit Toggle */}
              <div
                className="inline-flex rounded-pill bg-bg p-1 border border-border"
                role="group"
                aria-label="Weight unit switcher"
              >
                <button
                  type="button"
                  onClick={() => handleUnitToggle("lb")}
                  aria-pressed={unit === "lb"}
                  className={`rounded-pill px-3.5 py-1.5 text-xs font-bold transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    unit === "lb"
                      ? "bg-fg text-bg shadow-sm"
                      : "text-fg/70 hover:text-fg"
                  }`}
                >
                  lb
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle("kg")}
                  aria-pressed={unit === "kg"}
                  className={`rounded-pill px-3.5 py-1.5 text-xs font-bold transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    unit === "kg"
                      ? "bg-fg text-bg shadow-sm"
                      : "text-fg/70 hover:text-fg"
                  }`}
                >
                  kg
                </button>
              </div>
            </div>

            {/* Quick Weight Band Selector */}
            {species === "dog" && (
              <div className="pt-2 border-t border-border/60">
                <WeightSelector
                  selectedId={activeBand.id}
                  unit={unit}
                  onChange={handleBandSelect}
                  legend="Quick select standard weight band"
                  helperText={`${doseResult.dose} · based on current weight`}
                />
              </div>
            )}
          </fieldset>

          {/* Step 3: Age */}
          <fieldset className="border-0 p-0 m-0 space-y-3">
            <legend className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-fg">
              <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-accent text-accent-fg text-xs font-bold">
                3
              </span>
              <span>Age</span>
            </legend>
            <div
              role="radiogroup"
              aria-label="Pet life stage selection"
              className="grid grid-cols-3 gap-3"
            >
              {(["young", "adult", "senior"] as const).map((a) => {
                const isSelected = age === a;
                const inputId = `${componentId}-age-${a}`;
                const label = a.charAt(0).toUpperCase() + a.slice(1);

                return (
                  <label
                    key={a}
                    htmlFor={inputId}
                    className={`flex items-center justify-center rounded-card p-3 min-h-[48px] cursor-pointer border text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-fg text-bg border-fg shadow-sm"
                        : "bg-bg text-fg border-border hover:border-fg/40"
                    }`}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={`${componentId}-age`}
                      value={a}
                      checked={isSelected}
                      onChange={() => setAge(a)}
                      className="sr-only"
                      aria-label={label}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Step 4: Activity Level */}
          <fieldset className="border-0 p-0 m-0 space-y-3">
            <legend className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-fg">
              <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-accent text-accent-fg text-xs font-bold">
                4
              </span>
              <span>Activity level</span>
            </legend>
            <div
              role="radiogroup"
              aria-label="Pet activity level selection"
              className="grid grid-cols-3 gap-3"
            >
              {(["low", "moderate", "high"] as const).map((act) => {
                const isSelected = activity === act;
                const inputId = `${componentId}-act-${act}`;
                const label = act.charAt(0).toUpperCase() + act.slice(1);

                return (
                  <label
                    key={act}
                    htmlFor={inputId}
                    className={`flex items-center justify-center rounded-card p-3 min-h-[48px] cursor-pointer border text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-fg text-bg border-fg shadow-sm"
                        : "bg-bg text-fg border-border hover:border-fg/40"
                    }`}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={`${componentId}-activity`}
                      value={act}
                      checked={isSelected}
                      onChange={() => setActivity(act)}
                      className="sr-only"
                      aria-label={label}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Calculated Result Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-card border border-border bg-gradient-to-br from-accent/20 via-bg-elevated to-bg p-6 sm:p-8 space-y-6 shadow-card">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <span className="text-xs font-extrabold tracking-widest text-accent uppercase">
                YOUR RESULT
              </span>
              <span className="text-xs font-bold text-fg-muted uppercase">
                {species} · {age}
              </span>
            </div>

            {/* Target Pet Profile Summary */}
            <p className="text-sm font-semibold text-fg-muted">
              {species.charAt(0).toUpperCase() + species.slice(1)},{" "}
              {formatWeight(weight, unit)}, {age} life stage, {activity}{" "}
              activity
            </p>

            {/* Dose Display */}
            <div>
              <div className="text-4xl sm:text-5xl font-black text-fg tracking-tight">
                {doseResult.dose}
              </div>
              <div className="text-sm font-bold text-fg-muted mt-1 uppercase tracking-wider">
                per day · {doseResult.servingDescription}
              </div>
            </div>

            {/* Daily Schedule */}
            {doseResult.dailySchedule && (
              <div className="rounded-card bg-bg-elevated/80 border border-border p-4 space-y-2.5">
                <span className="block text-[11px] font-extrabold tracking-wider text-fg-muted uppercase">
                  Daily Schedule
                </span>
                <div className="flex items-center justify-between border-b border-border/40 pb-2 text-xs">
                  <span className="font-semibold text-fg">Morning</span>
                  <span className="font-bold text-fg">
                    {doseResult.dailySchedule.morning}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-fg">Evening</span>
                  <span className="font-bold text-fg">
                    {doseResult.dailySchedule.evening}
                  </span>
                </div>
              </div>
            )}

            {/* Starter Titration Rule */}
            <div className="text-xs text-fg-muted leading-relaxed">
              <strong>Titration:</strong> {doseResult.starterGuideline}
            </div>

            {/* Regulatory Notices */}
            <div className="border-t border-border/60 pt-4 space-y-2">
              <p className="text-xs font-bold text-accent">
                For animal use only.
              </p>
              {species === "horse" && (
                <p className="text-xs font-bold text-accent">
                  Equine products: not for horses intended for food.
                </p>
              )}
            </div>
          </div>

          {/* Vet Disclaimer Notice */}
          <div className="rounded-card border border-border bg-bg-elevated p-5 space-y-2 text-xs text-fg-muted">
            <h4 className="font-bold uppercase tracking-wider text-fg text-xs">
              Check with your vet first
            </h4>
            <p className="leading-relaxed">
              This calculator gives a general starting point based on weight,
              age and activity. It is not veterinary advice. Talk to your
              veterinarian before starting any supplement, especially if your
              pet is pregnant, nursing, on medication or has a health condition.
              Stop use and call your vet if you notice any adverse reaction.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Reference Table Section */}
      <div className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-accent uppercase">
              QUICK REFERENCE
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-fg uppercase tracking-tight mt-0.5">
              Dose by weight
            </h3>
          </div>

          {/* Species tabs for reference table */}
          <div
            role="tablist"
            aria-label="Reference table species filter"
            className="inline-flex rounded-pill bg-bg p-1 border border-border"
          >
            {(["dog", "cat", "horse"] as const).map((s) => {
              const isActive = activeTableSpecies === s;
              const label =
                s === "dog" ? "Dogs" : s === "cat" ? "Cats" : "Horses";

              return (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTableSpecies(s)}
                  className={`rounded-pill px-4 py-1.5 text-xs font-bold transition-all min-h-[38px] flex items-center justify-center ${
                    isActive
                      ? "bg-fg text-bg shadow-sm"
                      : "text-fg/70 hover:text-fg"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Semantic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-fg-muted font-bold">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Weight Band
                </th>
                <th scope="col" className="py-3 px-4">
                  Recommended Daily Dose
                </th>
                <th scope="col" className="py-3 px-4">
                  Administration Guidelines
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-fg">
              {referenceTable.map((row) => (
                <tr
                  key={row.bandLabel}
                  className="hover:bg-bg/50 transition-colors"
                >
                  <th scope="row" className="py-3.5 px-4 font-bold">
                    {row.bandLabel}
                  </th>
                  <td className="py-3.5 px-4 font-semibold text-accent">
                    {row.dose}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-fg-muted">
                    {row.notes || "Administer with food"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
