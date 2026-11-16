import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { mockAccountProvider } from "@/lib/providers/mock/account";
import { mockSubscriptionProvider } from "@/lib/providers/mock/subscription";
import { mockReviewsProvider } from "@/lib/providers/mock/reviews";

describe("W3-68 Image Assets and Mock Catalog Validation", () => {
  const publicDir = path.resolve(process.cwd(), "public");

  it("confirms that every product image in the mock catalog exists in public/", async () => {
    const products = await mockCatalogProvider.getProducts();
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      expect(
        product.images.length,
        `Product ${product.slug} has no images`
      ).toBeGreaterThan(0);

      for (const img of product.images) {
        expect(img.startsWith("/"), `Image ${img} should start with /`).toBe(
          true
        );
        expect(
          img,
          `Image ${img} must not point to obsolete /images/ path`
        ).not.toContain("/images/");

        const absolutePath = path.join(publicDir, img.replace(/^\//, ""));
        expect(
          fs.existsSync(absolutePath),
          `Product image ${img} for ${product.slug} must exist in public/`
        ).toBe(true);
      }
    }
  });

  it("confirms that every kit image in the mock catalog exists in public/", async () => {
    const kits = await mockCatalogProvider.getKits();
    expect(kits.length).toBeGreaterThan(0);

    for (const kit of kits) {
      expect(
        kit.images.length,
        `Kit ${kit.slug} has no images`
      ).toBeGreaterThan(0);

      for (const img of kit.images) {
        expect(img.startsWith("/"), `Image ${img} should start with /`).toBe(
          true
        );
        expect(
          img,
          `Image ${img} must not point to obsolete /images/ path`
        ).not.toContain("/images/");

        const absolutePath = path.join(publicDir, img.replace(/^\//, ""));
        expect(
          fs.existsSync(absolutePath),
          `Kit image ${img} for ${kit.slug} must exist in public/`
        ).toBe(true);
      }
    }

    for (const slug of ["the-duo", "pet-vitality-duo"]) {
      const kit = await mockCatalogProvider.getKit(slug);
      expect(kit).not.toBeNull();
      for (const img of kit!.images) {
        const absolutePath = path.join(publicDir, img.replace(/^\//, ""));
        expect(
          fs.existsSync(absolutePath),
          `Kit image ${img} for ${slug} must exist in public/`
        ).toBe(true);
      }
    }
  });

  it("confirms that mock account orders and pets point to existing public assets", async () => {
    const orders = await mockAccountProvider.getOrders();
    for (const order of orders) {
      for (const item of order.items) {
        if (item.image) {
          const absolutePath = path.join(
            publicDir,
            item.image.replace(/^\//, "")
          );
          expect(
            fs.existsSync(absolutePath),
            `Order item image ${item.image} must exist in public/`
          ).toBe(true);
        }
      }
    }

    const pets = await mockAccountProvider.getPets();
    for (const pet of pets) {
      if (pet.photoUrl) {
        const absolutePath = path.join(
          publicDir,
          pet.photoUrl.replace(/^\//, "")
        );
        expect(
          fs.existsSync(absolutePath),
          `Pet photo ${pet.photoUrl} must exist in public/`
        ).toBe(true);
      }
    }
  });

  it("confirms that mock subscriptions point to existing public assets", async () => {
    const subscriptions = await mockSubscriptionProvider.list();
    for (const sub of subscriptions) {
      for (const line of sub.lines) {
        if (line.image) {
          const absolutePath = path.join(
            publicDir,
            line.image.replace(/^\//, "")
          );
          expect(
            fs.existsSync(absolutePath),
            `Subscription line image ${line.image} must exist in public/`
          ).toBe(true);
        }
      }
    }
  });

  it("confirms that mock reviews point to existing public assets", async () => {
    const { reviews } = await mockReviewsProvider.list({
      includeDevSamples: true,
    });
    for (const rev of reviews) {
      for (const img of rev.images) {
        const absolutePath = path.join(publicDir, img.replace(/^\//, ""));
        expect(
          fs.existsSync(absolutePath),
          `Review image ${img} must exist in public/`
        ).toBe(true);
      }
    }
  });
});
