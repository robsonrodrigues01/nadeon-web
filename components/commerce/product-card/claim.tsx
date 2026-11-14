import React from "react";

export interface ClaimProps {
  children: React.ReactNode;
  className?: string;
  showDisclaimer?: boolean;
}

export const FDA_DISCLAIMER =
  "*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.";

export function Claim({
  children,
  className = "",
  showDisclaimer = false,
}: ClaimProps) {
  return (
    <span className={`inline ${className}`}>
      <span>{children}</span>
      {showDisclaimer && (
        <span
          className="block text-[11px] text-fg-muted mt-1 leading-normal italic"
          role="note"
        >
          {FDA_DISCLAIMER}
        </span>
      )}
    </span>
  );
}
