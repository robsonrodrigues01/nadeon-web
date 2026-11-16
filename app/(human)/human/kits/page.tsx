import { getVisitorMarket } from "@/lib/market/visitor";
import { MarketProvider } from "@/lib/market/context";
import Link from "next/link";
import { catalogProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { averageSavingsPercent, buildKitViews } from "./_components/kit-view";
import { KitsBrowser } from "./_components/kits-browser";

export const metadata = buildMetadata({
  title: "Kits & bundles",
  description:
    "Formulas that work well together, priced below buying them one by one. Made and tested in our Clifton, NJ lab.",
  pathname: "/human/kits",
});

export default async function HumanKitsPage() {
  const market = await getVisitorMarket();
  const [kits, products] = await Promise.all([
    catalogProvider.getKits("human"),
    catalogProvider.getProducts({ line: "human" }),
  ]);
  const views = buildKitViews(kits, products);
  const averageSavings = averageSavingsPercent(views);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Human", url: "/human" },
    { name: "Kits & bundles", url: "/human/kits" },
  ]);

  return (
    <MarketProvider initialMarket={market}>
      <main
        className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 px-4 py-8 md:px-8 md:py-12 lg:px-12"
        id="main-content"
        tabIndex={-1}
      >
        <JsonLd data={breadcrumbJsonLd as unknown as Record<string, unknown>} />

        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
            <li>
              <Link href="/" className="underline underline-offset-4">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/human" className="underline underline-offset-4">
                Human
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              Kits &amp; bundles
            </li>
          </ol>
        </nav>

        <header className="flex max-w-2xl flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            BUNDLE &amp; SAVE
          </p>
          <h1 className="text-4xl font-bold text-fg md:text-5xl">
            Kits &amp; bundles
          </h1>
          <p className="text-base text-fg-muted">
            Formulas that work well together,{" "}
            {averageSavings !== null
              ? `priced about ${averageSavings}% below`
              : "priced below"}{" "}
            buying them one by one. Made and tested in our Clifton, NJ lab.
          </p>
        </header>

        <KitsBrowser kits={views} market={market} />

        <section
          aria-labelledby="build-own-kit"
          className="flex flex-col gap-4 rounded-card border border-border bg-bg-elevated p-6 md:p-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            Your stack, your way
          </p>
          <h2 id="build-own-kit" className="text-3xl font-bold text-fg">
            Build your own kit
          </h2>
          <p className="max-w-2xl text-base text-fg-muted">
            {averageSavings !== null
              ? `Pick any formulas, set how often they arrive and save ${averageSavings}% on every box, with free shipping every time.`
              : "Pick any formulas, set how often they arrive and save on every box, with free shipping every time."}
          </p>
          <div>
            <Button variant="primary" href="/human/build-your-box">
              Build your box
            </Button>
          </div>
        </section>

        <section
          aria-labelledby="how-kits-work"
          className="flex flex-col gap-6"
        >
          <h2 id="how-kits-work" className="text-3xl font-bold text-fg">
            How kits work
          </h2>
          <dl className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {averageSavings !== null && (
              <div className="rounded-card border border-border p-6">
                <dt className="text-3xl font-bold text-accent">
                  {averageSavings}%
                </dt>
                <dd className="mt-1 font-semibold text-fg">Kit savings</dd>
                <dd className="mt-2 text-sm text-fg-muted">
                  Kits cost about {averageSavings}% less than buying each
                  formula on its own.
                </dd>
              </div>
            )}
            <div className="rounded-card border border-border p-6">
              <dt className="text-3xl font-bold text-accent">Free shipping</dt>
              <dd className="mt-2 text-sm text-fg-muted">
                On one-time orders.
              </dd>
            </div>
            <div className="rounded-card border border-border p-6">
              <dt className="text-3xl font-bold text-accent">
                60 Day guarantee
              </dt>
              <dd className="mt-2 text-sm text-fg-muted">
                Not the right fit? Get your money back within 60 days.
              </dd>
            </div>
          </dl>
          <p className="text-sm text-fg-muted">
            Kit prices already include the savings. The quiz code works on
            single formulas bought one-time, and only one code applies per
            order.
          </p>
        </section>
      </main>
    </MarketProvider>
  );
}
