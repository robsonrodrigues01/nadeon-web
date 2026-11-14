import type { Campaign, CampaignConfig } from "@/lib/contracts/campaign";

export type AnnouncementBarLine = "human" | "pet";

export interface AnnouncementBarProps {
  /**
   * Product line variant: human (dark/gold) or pet (amber/espresso)
   */
  line?: AnnouncementBarLine;

  /**
   * Explicit campaign object. If not provided, will attempt to fetch via campaignConfig.
   */
  campaign?: Campaign | null;

  /**
   * CampaignConfig contract to resolve active campaign. Defaults to provider campaignConfig.
   */
  campaignConfig?: CampaignConfig;

  /**
   * Force Black Friday campaign mode for development or showcase
   */
  forceBlackFriday?: boolean;

  /**
   * Custom link for free shipping notice
   */
  shippingHref?: string;

  /**
   * Custom link for subscription discount
   */
  subscribeHref?: string;

  /**
   * Custom link for quiz / formula recommendation
   */
  quizHref?: string;

  /**
   * Custom link for Black Friday sale landing page
   */
  saleHref?: string;

  /**
   * Override countdown target date (ISO string or Date)
   */
  countdownEnd?: string | Date;

  /**
   * Deterministic current time for testing or SSR
   */
  now?: number | Date;

  /**
   * Additional custom classes
   */
  className?: string;
}

export interface CountdownTimerProps {
  countdownEnd: string | Date;
  line?: AnnouncementBarLine;
  now?: number | Date;
  className?: string;
}
