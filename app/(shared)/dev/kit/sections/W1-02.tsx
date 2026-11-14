import React from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { campaignConfig } from "@/lib/providers";

const SHOWCASE_COUNTDOWN_TARGET = "2026-11-30T23:59:59-05:00";

export default async function W1_02_Section() {
  const campaign = await campaignConfig.getActiveCampaign();

  return (
    <section
      id="section-w1-02"
      aria-labelledby="heading-w1-02"
      className="mb-16 space-y-10"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="label rounded bg-accent/20 text-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
            W1-02 Component Vitrine
          </span>
          <span className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
            Global Layout
          </span>
        </div>
        <h2
          id="heading-w1-02"
          className="title text-3xl font-extrabold uppercase tracking-tight text-fg"
        >
          Announcement Bar
        </h2>
        <p className="body text-fg-muted mt-1 max-w-3xl">
          Global announcement bar for Human and Pet lines with responsive mobile
          adaptations and automated Black Friday mode with live countdown timer
          integrated with CampaignConfig.
        </p>
      </div>

      {/* Human Standard Variant */}
      <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-fg">Human Line · Default</h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Dark elevated background with gold typography. Free shipping over
              $75, subscription incentive, and quiz link.
            </p>
          </div>
          <span className="label text-[11px] font-bold text-fg-muted uppercase tracking-wider">
            /human
          </span>
        </div>

        <div
          data-theme="human"
          className="rounded-lg border border-border overflow-hidden bg-bg"
        >
          <AnnouncementBar line="human" campaign={campaign} />
        </div>
      </div>

      {/* Pet Standard Variant */}
      <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-fg">Pet Line · Default</h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Friendly amber background with espresso text. Free shipping over
              $49, subscription incentive, and pet formula quiz link.
            </p>
          </div>
          <span className="label text-[11px] font-bold text-fg-muted uppercase tracking-wider">
            /pet
          </span>
        </div>

        <div
          data-theme="pet"
          className="rounded-lg border border-border overflow-hidden bg-bg"
        >
          <AnnouncementBar line="pet" campaign={campaign} />
        </div>
      </div>

      {/* Black Friday Campaign Mode: Human & Pet */}
      <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-accent text-accent-fg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
              Campaign Mode
            </span>
            <h3 className="text-lg font-bold text-fg">
              Black Friday Mode · CampaignConfig
            </h3>
          </div>
          <p className="text-xs text-fg-muted">
            Replaces the default announcement bar whenever an active campaign is
            detected. Features days, hours, minutes, and seconds countdown
            chips.
          </p>
        </div>

        {/* Human Black Friday */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-fg-muted">
            <span>Human Black Friday (/human)</span>
            <span>Gold gradient countdown chips</span>
          </div>
          <div
            data-theme="human"
            className="rounded-lg border border-border overflow-hidden bg-bg"
          >
            <AnnouncementBar
              line="human"
              forceBlackFriday={true}
              countdownEnd={SHOWCASE_COUNTDOWN_TARGET}
            />
          </div>
        </div>

        {/* Pet Black Friday */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-fg-muted">
            <span>Pet Black Friday (/pet)</span>
            <span>Butter-yellow countdown chips over espresso</span>
          </div>
          <div
            data-theme="pet"
            className="rounded-lg border border-border overflow-hidden bg-bg"
          >
            <AnnouncementBar
              line="pet"
              forceBlackFriday={true}
              countdownEnd={SHOWCASE_COUNTDOWN_TARGET}
            />
          </div>
        </div>
      </div>

      {/* Mobile 390px Viewport Preview */}
      <div className="rounded-card border border-border bg-bg-elevated p-6 shadow-card space-y-6">
        <div>
          <h3 className="text-lg font-bold text-fg">
            Mobile Viewport Simulation (390 px)
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Verified behavior under narrow 390 px width. Copy adapts cleanly to
            prevent wrapping or overflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mobile Standard Preview */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-fg-muted">
              Standard Mode (390 px)
            </div>
            <div className="max-w-[390px] border border-border/80 rounded-lg overflow-hidden shadow-sm space-y-1 p-2 bg-bg">
              <div className="text-[10px] text-fg-muted font-mono px-1">
                Human Mobile
              </div>
              <AnnouncementBar line="human" campaign={campaign} />
              <div className="text-[10px] text-fg-muted font-mono px-1 pt-2">
                Pet Mobile
              </div>
              <AnnouncementBar line="pet" campaign={campaign} />
            </div>
          </div>

          {/* Mobile Black Friday Preview */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-fg-muted">
              Black Friday Mode (390 px)
            </div>
            <div className="max-w-[390px] border border-border/80 rounded-lg overflow-hidden shadow-sm space-y-1 p-2 bg-bg">
              <div className="text-[10px] text-fg-muted font-mono px-1">
                Human Black Friday
              </div>
              <AnnouncementBar
                line="human"
                forceBlackFriday={true}
                countdownEnd={SHOWCASE_COUNTDOWN_TARGET}
              />
              <div className="text-[10px] text-fg-muted font-mono px-1 pt-2">
                Pet Black Friday
              </div>
              <AnnouncementBar
                line="pet"
                forceBlackFriday={true}
                countdownEnd={SHOWCASE_COUNTDOWN_TARGET}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
