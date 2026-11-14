import React from "react";
import Link from "next/link";

export function QuizFooter() {
  return (
    <footer
      className="bg-bg-elevated border-t border-border/30 px-5 sm:px-16 py-8 text-xs text-fg-muted space-y-3"
      role="contentinfo"
    >
      <div className="max-w-4xl mx-auto space-y-3">
        <p className="leading-relaxed opacity-75">
          *These statements have not been evaluated by the Food and Drug
          Administration. These products are not intended to diagnose, treat,
          cure or prevent any disease.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/20 text-[11px] opacity-60">
          <span>&copy; Nadeon Labs</span>
          <span aria-hidden="true">&middot;</span>
          <Link
            href="/legal/privacy"
            className="hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
          >
            Privacy
          </Link>
          <span aria-hidden="true">&middot;</span>
          <Link
            href="/legal/terms"
            className="hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
          >
            Terms
          </Link>
          <span aria-hidden="true">&middot;</span>
          <span>Quiz suggestions are general and are not medical advice.</span>
        </div>
      </div>
    </footer>
  );
}
