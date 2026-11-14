"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useCartStore } from "@/lib/providers/mock/cart";

export interface HeaderProps {
  variant?: "human" | "pet";
  initialCartCount?: number;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
}

const HUMAN_NAV_ITEMS: NavItem[] = [
  { label: "Shop", href: "/human/shop" },
  { label: "Science", href: "/science" },
  { label: "Quiz", href: "/human/quiz" },
  { label: "Subscribe", href: "/human/subscribe" },
  { label: "About", href: "/about" },
];

const PET_NAV_ITEMS: NavItem[] = [
  { label: "Dogs", href: "/pet/dogs" },
  { label: "Cats", href: "/pet/cats" },
  { label: "Horses", href: "/pet/horses" },
  { label: "Quiz", href: "/pet/quiz" },
  { label: "Subscribe", href: "/pet/subscribe" },
  { label: "About", href: "/about" },
];

export function Header({
  variant = "human",
  initialCartCount,
  className,
}: HeaderProps) {
  const isPet = variant === "pet";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cart count synchronized via useSyncExternalStore (SSR-safe, React 19 compliant)
  const cartCount = useSyncExternalStore(
    useCartStore.subscribe,
    () => initialCartCount ?? useCartStore.getState().cart?.totalQuantity ?? 0,
    () => initialCartCount ?? 0
  );

  const navItems = isPet ? PET_NAV_ITEMS : HUMAN_NAV_ITEMS;
  const switchTarget = isPet
    ? { label: "Shop Human →", href: "/human" }
    : { label: "Shop Pet →", href: "/pet" };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Keyboard accessibility: close menu on Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  return (
    <header
      role="banner"
      data-theme={variant}
      className={cn(
        "sticky top-0 z-40 w-full transition-colors border-b border-border",
        isPet ? "bg-bg text-fg" : "bg-bg-elevated text-fg",
        className
      )}
    >
      <div className="mx-auto flex h-18 sm:h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <div className="flex items-center">
          <Logo variant={variant} />
        </div>

        {/* Desktop Primary Navigation */}
        <nav
          aria-label={isPet ? "Pet Navigation" : "Human Navigation"}
          className="hidden md:flex items-center gap-7 lg:gap-9"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link
            href={switchTarget.href}
            className="text-xs sm:text-sm font-bold text-fg/70 transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-2"
          >
            {switchTarget.label}
          </Link>

          <Link
            href="/account"
            className="text-xs sm:text-sm font-bold text-fg transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-2 min-h-11 min-w-11 inline-flex items-center justify-center"
          >
            Account
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart (${cartCount})`}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-11",
              isPet
                ? "bg-fg text-bg hover:opacity-90"
                : "bg-gradient-gold text-accent-fg hover:opacity-95 shadow-sm"
            )}
          >
            Cart ({cartCount})
          </Link>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/search"
            aria-label="Search products"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-fg hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart (${cartCount})`}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-11",
              isPet ? "bg-fg text-bg" : "bg-gradient-gold text-accent-fg"
            )}
          >
            Cart ({cartCount})
          </Link>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={toggleMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-fg hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Panel */}
      {isMenuOpen && (
        <div
          id="mobile-navigation-menu"
          role="region"
          aria-label="Mobile Navigation Menu"
          className={cn(
            "md:hidden w-full border-t border-border px-6 py-6 transition-all animate-in fade-in slide-in-from-top-2",
            isPet ? "bg-bg text-fg" : "bg-bg-elevated text-fg"
          )}
        >
          <nav
            aria-label="Mobile Primary Navigation"
            className="flex flex-col gap-1"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center min-h-11 px-3 rounded-lg text-base font-bold uppercase tracking-wider text-fg hover:bg-border/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-3 border-t border-border/40" />

            {/* Line switch action */}
            <Link
              href={switchTarget.href}
              onClick={closeMenu}
              className="flex items-center min-h-11 px-3 rounded-lg text-sm font-bold text-fg/80 hover:text-fg hover:bg-border/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {switchTarget.label}
            </Link>

            {/* Account action */}
            <Link
              href="/account"
              onClick={closeMenu}
              className="flex items-center min-h-11 px-3 rounded-lg text-sm font-bold text-fg hover:bg-border/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Account
            </Link>

            {/* Search action */}
            <Link
              href="/search"
              onClick={closeMenu}
              className="flex items-center gap-2 min-h-11 px-3 rounded-lg text-sm font-bold text-fg hover:bg-border/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Search</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
