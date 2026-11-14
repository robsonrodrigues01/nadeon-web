import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { catalogProvider, subscriptionProvider } from "@/lib/providers";
import {
  buildMetadata,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  JsonLd,
} from "@/lib/seo";
import { BoxBuilder } from "./_components/box-builder";
import { frequencyOptions } from "./_components/box-math";
import type { BoxFaq, BoxProduct } from "./_components/types";
import { getDefaultMarket } from "@/lib/market/markets";

const BOX_FAQS: BoxFaq[] = [
  {
    question: "Can I change my formulas later?",
    answer:
      "Yes. Add, remove or swap formulas from your account before your next box ships.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Build your box | Nadeon Labs",
    description:
      "Pick your formulas, set your delivery rhythm and save on every box. Free shipping on every box.",
    pathname: "/human/build-your-box",
  });
}

export default async function BuildYourBoxPage() {
  const market = getDefaultMarket();
  const [products, capabilities] = await Promise.all([
    catalogProvider.getProducts({ line: "human" }),
    subscriptionProvider.capabilities(),
  ]);

  const boxProducts: BoxProduct[] = products
    .map((product) => {
      const single = product.variants.find((v) => v.jars === 1);
      if (!single) return null;
      return {
        slug: product.slug,
        name: product.name,
        technicalName: product.technicalName,
        format: product.format,
        color: product.color,
        listPrice: single.price.amount,
        plans: product.sellingPlans.map((plan) => ({
          intervalDays: plan.intervalDays,
          discountPercentage: plan.discountPercentage,
        })),
      };
    })
    .filter((p): p is BoxProduct => p !== null);

  const frequencies = frequencyOptions(
    boxProducts,
    capabilities.allowedIntervalDays
  );

  // Save rate shown in the hero: the smallest discount offered across frequencies.
  const discounts = boxProducts.flatMap((p) =>
    p.plans
      .filter((plan) => frequencies.includes(plan.intervalDays))
      .map((plan) => plan.discountPercentage)
  );
  const savePercent = discounts.length > 0 ? Math.min(...discounts) : null;

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Human", url: "/human" },
    { name: "Build your box", url: "/human/build-your-box" },
  ]);
  const faqSchema = buildFaqJsonLd(BOX_FAQS);

  return (
    <>
      <JsonLd
        id="build-your-box-structured-data"
        data={[
          breadcrumbsSchema as unknown as Record<string, unknown>,
          faqSchema as unknown as Record<string, unknown>,
        ]}
      />

      <main id="main-content" className="flex-1">
        <section className="bg-bg-elevated px-4 pt-8 pb-10 lg:px-18 lg:pt-15 lg:pb-14">
          <nav aria-label="Breadcrumb" className="text-xs opacity-60">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/">Home</Link>
                <span aria-hidden="true"> / </span>
              </li>
              <li>
                <Link href="/human">Human</Link>
                <span aria-hidden="true"> / </span>
              </li>
              <li aria-current="page">Build your box</li>
            </ol>
          </nav>

          {savePercent !== null && (
            <p className="mt-4 inline-block rounded-pill bg-gradient-gold px-3.5 py-1.5 text-xs font-bold tracking-widest text-accent-fg uppercase">
              Subscribe &amp; save {savePercent}%
            </p>
          )}

          <h1 className="mt-4 font-archivo text-4xl leading-none font-extrabold tracking-tight uppercase lg:mt-6 lg:text-7xl">
            Build your box
          </h1>
          <p className="mt-4 max-w-160 text-base leading-normal opacity-85 lg:mt-5 lg:text-xl">
            {savePercent !== null
              ? `Pick your formulas, set your rhythm and save ${savePercent}% on every delivery. Free shipping on every box.`
              : "Pick your formulas, set your rhythm and save on every delivery. Free shipping on every box."}
          </p>
        </section>

        <BoxBuilder
          products={boxProducts}
          frequencies={frequencies}
          market={market}
        />

        <section
          aria-labelledby="box-faq-title"
          className="flex flex-col gap-6 bg-bg px-4 py-12 lg:flex-row lg:gap-20 lg:px-18 lg:py-22"
        >
          <div className="lg:w-95 lg:shrink-0">
            <p className="text-xs font-bold tracking-widest text-accent">FAQ</p>
            <h2
              id="box-faq-title"
              className="mt-2 font-archivo text-3xl leading-none font-extrabold uppercase lg:text-5xl"
            >
              Subscription questions
            </h2>
          </div>
          <div className="flex-1">
            {BOX_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-current/15 py-4"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-bold lg:text-lg">
                  {faq.question}
                  <span aria-hidden="true" className="group-open:hidden">
                    +
                  </span>
                  <span aria-hidden="true" className="hidden group-open:inline">
                    −
                  </span>
                </summary>
                <p className="pt-2 pb-2 text-base leading-normal opacity-85">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
