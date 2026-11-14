import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "link";
export type ButtonSize = "sm" | "default" | "lg";

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

export type ButtonAsLink = ButtonBaseProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonBaseProps | "href"
  > & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-gold text-accent-fg shadow-card hover:brightness-105 active:scale-[0.98] border-none",
  secondary:
    "bg-transparent border-2 border-border text-fg hover:border-accent hover:text-accent active:scale-[0.98]",
  link: "bg-transparent text-fg underline underline-offset-4 hover:text-accent hover:opacity-80 p-0 min-w-0 shadow-none border-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-xs",
  default: "min-h-11 px-6 py-2.5 text-sm",
  lg: "min-h-11 px-8 py-3.5 text-base",
};

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "default",
    isLoading = false,
    loadingText,
    icon,
    children,
    className,
    href,
    ...rest
  } = props;

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-wider text-center cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

  const resolvedClass = cn(
    baseClasses,
    variantStyles[variant],
    variant !== "link" ? sizeStyles[size] : "min-h-11 inline-flex items-center",
    className
  );

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        icon && <span aria-hidden="true">{icon}</span>
      )}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </>
  );

  if (href !== undefined) {
    const { ...anchorRest } =
      rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={resolvedClass}
        aria-busy={isLoading ? "true" : undefined}
        {...anchorRest}
      >
        {content}
      </Link>
    );
  }

  const {
    type = "button",
    disabled,
    ...buttonRest
  } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={type}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={resolvedClass}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? "true" : undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";
