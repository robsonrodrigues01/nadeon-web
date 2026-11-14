import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { Claim } from "@/components/commerce/product-card/claim";
import { KitAddToCart } from "../_components/kit-add-to-cart";
import { KitPrice } from "../_components/kit-price";
import { buildKitViews } from "../_components/kit-view";
import { listProductRenders } from "../_components/kit-renders";

type KitPageProps = {
  params: Promise<{ slug: string }>;
};

async function loadHumanKit(slug: string) {
  const kit = await catalogProvider.getKit(slug);
  return kit && kit.line === "human" ? kit : null;
}

export async function generateMetadata({ params }: KitPageProps) {
  const { slug } = await params;
  const kit = await loadHumanKit(slug);
  if (!kit) notFound();
  return buildMetadata({
    title: kit.name,
    description: kit.description,
    pathname: `/human/kits/${kit.slug}`,
  });
}

// Detail page has no design board yet (catalog 5.2 notes it as not drawn);
// it renders only catalog data and the components already used on the list.
export default async function HumanKitPage({ params }: KitPageProps) {
  const { slug } = await params;
  const kit = await loadHumanKit(slug);
  if (!kit) notFound();

  const products = await catalogProvider.getProducts({ line: "human" });
  const [view] = buildKitViews([kit], products, listProductRenders());
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Human", url: "/human" },
    { name: "Kits & bundles", url: "/human/kits" },
    { name: kit.name, url: `/human/kits/${kit.slug}` },
  ]);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-8 md:px-8 md:py-12 lg:px-12">
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
          <li>
            <Link href="/human/kits" className="underline underline-offset-4">
              Kits &amp; bundles
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            {kit.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-fg md:text-5xl">{kit.name}</h1>
          <p className="text-base text-fg">
            <Claim>{kit.description}</Claim>
          </p>
          <KitPrice
            price={view.price}
            compareAtPrice={view.compareAtPrice}
            savings={view.savings}
          />
          <div className="max-w-sm">
            <KitAddToCart
              kitName={kit.name}
              cartLines={view.cartLines}
              disabled={!view.canAddToCart}
            />
          </div>
        </div>

        <section
          aria-labelledby="kit-included"
          className="flex flex-col gap-4 rounded-card border border-border bg-bg-elevated p-6"
        >
          <h2 id="kit-included" className="text-xl font-bold text-fg">
            Included formulas
          </h2>
          <ul aria-labelledby="kit-included" className="flex flex-col gap-3">
            {kit.products.map((ref) => {
              const product = bySlug.get(ref.productSlug);
              if (!product) return null;
              return (
                <li key={ref.productSlug} className="flex flex-col gap-1">
                  <Link
                    href={`/human/products/${product.slug}`}
                    className="min-h-11 font-semibold text-fg underline underline-offset-4"
                  >
                    {product.name}
                  </Link>
                  <span className="text-sm text-fg-muted">
                    {product.technicalName}
                    {ref.quantity > 1 && ` × ${ref.quantity}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
