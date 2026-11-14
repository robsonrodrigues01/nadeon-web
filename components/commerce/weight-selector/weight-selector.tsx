"use client";

import React, { useId, useState } from "react";
import type { WeightBand, WeightUnit } from "@/lib/dosing/types";
import { STANDARD_WEIGHT_BANDS, formatBandLabel } from "@/lib/dosing/bands";

export interface WeightSelectorProps {
  /**
   * Array of weight bands to display. Defaults to STANDARD_WEIGHT_BANDS (4 pet bands).
   */
  bands?: readonly WeightBand[] | WeightBand[];
  /**
   * Currently selected band ID (controlled mode).
   */
  selectedId?: string;
  /**
   * Initial selected band ID (uncontrolled mode). Defaults to "21-to-50".
   */
  defaultSelectedId?: string;
  /**
   * Weight display unit ("lb" | "kg"). Defaults to "lb".
   */
  unit?: WeightUnit;
  /**
   * If true, shows the lb / kg unit toggle buttons.
   */
  showUnitToggle?: boolean;
  /**
   * Callback fired when unit changes.
   */
  onUnitChange?: (unit: WeightUnit) => void;
  /**
   * Callback fired when a weight band is selected.
   */
  onChange?: (band: WeightBand, index: number) => void;
  /**
   * Accessible legend text for the fieldset. Defaults to "Your dog weighs".
   */
  legend?: string;
  /**
   * Optional helper or subtitle text.
   */
  helperText?: string;
  /**
   * Form field name for the radio inputs.
   */
  name?: string;
  /**
   * Disabled state for all options.
   */
  disabled?: boolean;
  /**
   * Additional root container CSS classes.
   */
  className?: string;
}

export function WeightSelector({
  bands = STANDARD_WEIGHT_BANDS,
  selectedId: controlledSelectedId,
  defaultSelectedId = "21-to-50",
  unit = "lb",
  showUnitToggle = false,
  onUnitChange,
  onChange,
  legend = "Your dog weighs",
  helperText,
  name: explicitName,
  disabled = false,
  className = "",
}: WeightSelectorProps) {
  const generatedId = useId();
  const groupName = explicitName || `weight-selector-${generatedId}`;
  const legendId = `${groupName}-legend`;

  // Internal state for uncontrolled mode
  const [internalSelectedId, setInternalSelectedId] =
    useState<string>(defaultSelectedId);

  const activeSelectedId =
    controlledSelectedId !== undefined
      ? controlledSelectedId
      : internalSelectedId;

  const handleSelect = (band: WeightBand, index: number) => {
    if (disabled) return;
    if (controlledSelectedId === undefined) {
      setInternalSelectedId(band.id);
    }
    onChange?.(band, index);
  };

  return (
    <fieldset
      className={`border-0 p-0 m-0 space-y-2.5 ${className}`}
      disabled={disabled}
      aria-disabled={disabled}
      aria-labelledby={legendId}
    >
      {/* Legend & Unit Switcher Header */}
      <div className="flex items-center justify-between gap-3">
        <legend
          id={legendId}
          className="block text-xs font-bold text-fg/80 uppercase tracking-wide m-0 p-0"
        >
          {legend}
        </legend>

        {showUnitToggle && (
          <div
            className="inline-flex items-center rounded-pill bg-bg-elevated/70 p-0.5 border border-border"
            role="group"
            aria-label="Weight unit toggle"
          >
            <button
              type="button"
              onClick={() => onUnitChange?.("lb")}
              aria-pressed={unit === "lb"}
              className={`rounded-pill px-3 py-1 text-xs font-bold transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                unit === "lb"
                  ? "bg-fg text-bg shadow-sm"
                  : "text-fg/70 hover:text-fg"
              }`}
            >
              lb
            </button>
            <button
              type="button"
              onClick={() => onUnitChange?.("kg")}
              aria-pressed={unit === "kg"}
              className={`rounded-pill px-3 py-1 text-xs font-bold transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                unit === "kg"
                  ? "bg-fg text-bg shadow-sm"
                  : "text-fg/70 hover:text-fg"
              }`}
            >
              kg
            </button>
          </div>
        )}
      </div>

      {/* Weight options radio group */}
      <div
        role="radiogroup"
        aria-labelledby={legendId}
        className="flex flex-wrap items-center gap-2"
      >
        {bands.map((band, index) => {
          const isSelected = activeSelectedId === band.id;
          const inputId = `${groupName}-band-${band.id}`;
          const displayLabel = formatBandLabel(band, unit);

          return (
            <label
              key={band.id}
              htmlFor={inputId}
              data-weight-band={band.id}
              className={`relative inline-flex items-center justify-center rounded-pill px-4 py-2 text-xs sm:text-sm font-bold min-h-[44px] min-w-[44px] cursor-pointer transition-all border select-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg ${
                isSelected
                  ? "bg-fg text-bg border-fg shadow-sm"
                  : "bg-bg-elevated text-fg border-border hover:border-fg/40 hover:bg-bg-elevated/90"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                id={inputId}
                type="radio"
                name={groupName}
                value={band.id}
                checked={isSelected}
                onChange={() => handleSelect(band, index)}
                disabled={disabled}
                className="sr-only"
                aria-label={displayLabel}
              />
              <span className="whitespace-nowrap">{displayLabel}</span>
            </label>
          );
        })}
      </div>

      {/* Helper Context Text */}
      {helperText && (
        <p className="text-xs text-fg-muted/90 pt-0.5 leading-relaxed">
          {helperText}
        </p>
      )}
    </fieldset>
  );
}
