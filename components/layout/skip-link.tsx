"use client";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      onClick={() => {
        const target = document.getElementById("main-content");
        if (target) {
          target.focus();
        }
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-card focus:bg-bg-elevated focus:px-4 focus:py-3 focus:font-bold focus:text-fg focus:ring-2 focus:ring-accent"
    >
      Skip to main content
    </a>
  );
}
