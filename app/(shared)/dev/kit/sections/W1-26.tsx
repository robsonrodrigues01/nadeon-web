import React from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { TrustStrip } from "@/components/brand/trust-strip";
import { SUPPORTED_MARKETS, formatFreeShippingLabel } from "@/lib/market";

export default function FreeShippingSection() {
  return (
    <section aria-labelledby="w1-26-title" className="mb-16">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider">
            Task W1-26
          </span>
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            Market Config
          </span>
        </div>
        <h2
          id="w1-26-title"
          className="title text-3xl font-black uppercase text-fg tracking-tight"
        >
          Free Shipping Threshold
        </h2>
        <p className="mt-2 text-fg-muted max-w-3xl text-sm leading-relaxed">
          Single source for the free shipping threshold. The announcement bar
          and the trust strip read it from the market config, per line. Markets
          that advertise no free shipping show no shipping copy.
        </p>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-fg-muted">
            Human storefront variant
          </h3>
          <AnnouncementBar line="human" />
          <TrustStrip line="human" />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-fg-muted">
            Pet storefront variant
          </h3>
          <AnnouncementBar line="pet" />
          <TrustStrip line="pet" />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-fg-muted">
            Threshold by market
          </h3>
          <ul className="space-y-2 text-sm text-fg">
            {SUPPORTED_MARKETS.map((market) => (
              <li key={market.id}>
                <span className="font-bold">{market.name}:</span>{" "}
                {formatFreeShippingLabel(market, "human") ??
                  "No free shipping (Human)"}
                {" · "}
                {formatFreeShippingLabel(market, "pet") ??
                  "No free shipping (Pet)"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
