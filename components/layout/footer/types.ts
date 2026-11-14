export type FooterLine = "human" | "pet";

export interface FooterNavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterNavColumn {
  title: string;
  links: FooterNavLink[];
}

export interface CrossLineCardData {
  targetLine: FooterLine;
  href: string;
  title: string;
  description: string;
  ariaLabel: string;
}

export interface SocialLink {
  key: string;
  label: string;
  name: string;
  href: string;
}

export interface LegalLink {
  label: string;
  href: string;
}

export interface FooterProps {
  /**
   * Product line variant: 'human' (default) or 'pet'
   */
  line?: FooterLine;
  /**
   * Optional additional CSS classes
   */
  className?: string;
}
