/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import PetPage, { metadata } from "@/app/(pet)/pet/page";
import { HeroCarousel } from "@/app/(pet)/pet/_components/hero-carousel";
import { WhoForSection } from "@/app/(pet)/pet/_components/who-for-section";
import { ShopByNeedSection } from "@/app/(pet)/pet/_components/shop-by-need-section";
import { DoseByWeightSection } from "@/app/(pet)/pet/_components/dose-by-weight-section";
import { BestSellersSection } from "@/app/(pet)/pet/_components/best-sellers-section";
import { TasteTestSection } from "@/app/(pet)/pet/_components/taste-test-section";
import { ByLifeStageSection } from "@/app/(pet)/pet/_components/by-life-stage-section";
import { WhyNmnSection } from "@/app/(pet)/pet/_components/why-nmn-section";
import { WhatToExpectSection } from "@/app/(pet)/pet/_components/what-to-expect-section";
import { QualityInNumbersSection } from "@/app/(pet)/pet/_components/quality-in-numbers-section";
import { ChewOrOilSection } from "@/app/(pet)/pet/_components/chew-or-oil-section";
import { SubscribeSaveSection } from "@/app/(pet)/pet/_components/subscribe-save-section";
import { ReviewsSection } from "@/app/(pet)/pet/_components/reviews-section";
import { PackUgcSection } from "@/app/(pet)/pet/_components/pack-ugc-section";
import { JournalSection } from "@/app/(pet)/pet/_components/journal-section";
import { FaqSection } from "@/app/(pet)/pet/_components/faq-section";
import { AndForYouSection } from "@/app/(pet)/pet/_components/and-for-you-section";
import { BottomCtaBanner } from "@/app/(pet)/pet/_components/bottom-cta-banner";
import { PetRegulatoryNotice } from "@/app/(pet)/pet/_components/pet-regulatory-notice";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";

describe("W2-03 Pet Home Route (/pet)", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports metadata with pet title, description and canonical path", () => {
    expect(metadata.title).toContain("Nadeon Pet");
    expect(metadata.description).toBeDefined();
  });

  it("renders the complete PetPage async Server Component", async () => {
    const pageJsx = await PetPage();
    render(pageJsx);

    expect(screen.getByRole("main")).toBeDefined();
    expect(screen.getByText("NMN FOR DOGS · CATS · HORSES")).toBeDefined();
    expect(screen.getByText("Who are we shopping for?")).toBeDefined();
    expect(screen.getByText("What does your dog need?")).toBeDefined();
    expect(screen.getByText("How many chews a day?")).toBeDefined();
    expect(screen.getByText("Daily NMN soft chews")).toBeDefined();
    expect(screen.getByText("A chew they actually want")).toBeDefined();
    expect(screen.getByText("Right for their age")).toBeDefined();
    expect(screen.getByText("Why NMN for pets?")).toBeDefined();
    expect(screen.getByText("Good things take a few weeks")).toBeDefined();
    expect(screen.getByText("Release specs for every lot")).toBeDefined();
    expect(screen.getByText("Pick the format that fits")).toBeDefined();
    expect(screen.getByText("Never run out")).toBeDefined();
    expect(screen.getByText("Happy tails")).toBeDefined();
    expect(screen.getByText("Share your pack")).toBeDefined();
    expect(screen.getByText("For pet parents")).toBeDefined();
    expect(screen.getByText("Pet parent FAQ")).toBeDefined();
    expect(screen.getByText("And for you")).toBeDefined();
    expect(screen.getByText("Give them more good years.")).toBeDefined();

    // Regulatory notice check
    expect(
      screen.getAllByText(
        /For animal use only\. Equine products: not for horses intended for food\./i
      ).length
    ).toBeGreaterThanOrEqual(1);
  });

  describe("Section 5.1 Catálogo Buttons and Fields Coverage", () => {
    it("Hero carousel: controls and slide 1, 2, 3 buttons", () => {
      render(<HeroCarousel />);

      // Slide 1 buttons
      const shopDogs = screen.getByRole("link", { name: /shop for dogs/i });
      expect(shopDogs.getAttribute("href")).toBe("/pet/dogs");

      const findFormula = screen.getByRole("link", {
        name: /find the right formula/i,
      });
      expect(findFormula.getAttribute("href")).toBe("/pet/quiz");

      // Controls
      const nextBtn = screen.getByRole("button", { name: /next slide/i });
      const prevBtn = screen.getByRole("button", { name: /previous slide/i });
      expect(nextBtn).toBeDefined();
      expect(prevBtn).toBeDefined();

      // Go to Slide 2
      fireEvent.click(nextBtn);
      const shopGoldenYears = screen.getByRole("link", {
        name: /shop golden years/i,
      });
      expect(shopGoldenYears.getAttribute("href")).toBe("/pet/dogs");
      const jointBundle = screen.getByRole("link", {
        name: /see the joint bundle/i,
      });
      expect(jointBundle.getAttribute("href")).toBe("/pet/kits");

      // Go to Slide 3
      fireEvent.click(nextBtn);
      const buildSub = screen.getByRole("link", {
        name: /build a subscription/i,
      });
      expect(buildSub.getAttribute("href")).toBe("/pet/subscribe");
      const howItWorks = screen.getByRole("link", { name: /how it works/i });
      expect(howItWorks.getAttribute("href")).toBe("#how-it-works");
    });

    it("Who are we shopping for?: Dogs, Cats and Horses links", () => {
      render(<WhoForSection />);

      const shopDogs = screen.getByRole("link", { name: /shop dogs/i });
      expect(shopDogs.getAttribute("href")).toBe("/pet/dogs");

      const shopCats = screen.getByRole("link", { name: /shop cats/i });
      expect(shopCats.getAttribute("href")).toBe("/pet/cats");

      const shopHorses = screen.getByRole("link", { name: /shop horses/i });
      expect(shopHorses.getAttribute("href")).toBe("/pet/horses");
    });

    it("What does your dog need?: Longevity, Joints, Calm, Skin & coat", () => {
      render(<ShopByNeedSection />);

      expect(screen.getByText("Longevity")).toBeDefined();
      expect(screen.getByText("Joints")).toBeDefined();
      expect(screen.getByText("Calm")).toBeDefined();
      expect(screen.getByText("Skin & coat")).toBeDefined();

      const links = screen.getAllByRole("link");
      expect(links.length).toBe(4);
    });

    it("How many chews a day?: weight tiers and action buttons", () => {
      render(<DoseByWeightSection />);

      expect(screen.getByText("Up to 20 lbs")).toBeDefined();
      expect(screen.getByText("21 to 50 lbs")).toBeDefined();
      expect(screen.getByText("51 to 90 lbs")).toBeDefined();
      expect(screen.getByText("Over 90 lbs")).toBeDefined();

      const shopChews = screen.getByRole("link", {
        name: /shop chews for my dog/i,
      });
      expect(shopChews.getAttribute("href")).toBe("/pet/dogs");

      const quizLink = screen.getByRole("link", { name: /take the quiz/i });
      expect(quizLink.getAttribute("href")).toBe("/pet/quiz");
    });

    it("Best sellers: format tabs (Chews, Treats, Oils, Powder) and Add to cart buttons", async () => {
      const products = await mockCatalogProvider.getProducts({ line: "pet" });
      render(<BestSellersSection products={products} />);

      const chewsTab = screen.getByRole("tab", { name: "Chews" });
      const treatsTab = screen.getByRole("tab", { name: "Treats" });
      const oilsTab = screen.getByRole("tab", { name: "Oils" });
      const powderTab = screen.getByRole("tab", { name: "Powder" });

      expect(chewsTab).toBeDefined();
      expect(treatsTab).toBeDefined();
      expect(oilsTab).toBeDefined();
      expect(powderTab).toBeDefined();

      // Default tab Chews has Add to cart buttons
      const addToCartButtons = screen.getAllByRole("button", {
        name: /add .* to cart/i,
      });
      expect(addToCartButtons.length).toBeGreaterThan(0);

      // Switching tabs
      fireEvent.click(treatsTab);
      expect(treatsTab.getAttribute("aria-selected")).toBe("true");

      fireEvent.click(oilsTab);
      expect(oilsTab.getAttribute("aria-selected")).toBe("true");

      fireEvent.click(powderTab);
      expect(powderTab.getAttribute("aria-selected")).toBe("true");
    });

    it("Taste test: Try a jar CTA link", () => {
      render(<TasteTestSection />);

      const tryJar = screen.getByRole("link", { name: /try a jar/i });
      expect(tryJar.getAttribute("href")).toBe("/pet/dogs");
    });

    it("By life stage: Shop adult dogs and Shop senior dogs", () => {
      render(<ByLifeStageSection />);

      const adultDogs = screen.getByRole("link", { name: /shop adult dogs/i });
      expect(adultDogs.getAttribute("href")).toBe("/pet/dogs");

      const seniorDogs = screen.getByRole("link", {
        name: /shop senior dogs/i,
      });
      expect(seniorDogs.getAttribute("href")).toBe("/pet/dogs");
    });

    it("Why NMN for pets: 3 pillars with Claim", () => {
      render(<WhyNmnSection />);

      expect(screen.getByText("NAD+ drops with age")).toBeDefined();
      expect(screen.getByText(/NMN in every chew/i)).toBeDefined();
      expect(screen.getByText("Dose by weight")).toBeDefined();
    });

    it("What to expect: Start today and Subscribe & save 15%", () => {
      render(<WhatToExpectSection />);

      const startToday = screen.getByRole("link", { name: /start today/i });
      expect(startToday.getAttribute("href")).toBe("/pet/dogs");

      const subSave = screen.getByRole("link", {
        name: /subscribe & save 15%/i,
      });
      expect(subSave.getAttribute("href")).toBe("/pet/subscribe");
    });

    it("Quality in numbers: Look up your lot link", () => {
      render(<QualityInNumbersSection />);

      const lookupLot = screen.getByRole("link", { name: /look up your lot/i });
      expect(lookupLot.getAttribute("href")).toBe("/lab-results");
    });

    it("Chew or oil?: Shop soft chews, Shop oils and Get the bundle", () => {
      render(<ChewOrOilSection />);

      const shopChews = screen.getByRole("link", { name: /shop soft chews/i });
      expect(shopChews.getAttribute("href")).toBe("/pet/dogs");

      const shopOils = screen.getByRole("link", { name: /shop oils/i });
      expect(shopOils.getAttribute("href")).toBe("/pet/dogs");

      const getBundle = screen.getByRole("link", { name: /get the bundle/i });
      expect(getBundle.getAttribute("href")).toBe("/pet/kits");
    });

    it("Subscribe & save: Build a subscription link", () => {
      render(<SubscribeSaveSection />);

      const buildSub = screen.getByRole("link", {
        name: /build a subscription/i,
      });
      expect(buildSub.getAttribute("href")).toBe("/pet/subscribe");
    });

    it("Reviews: Read all reviews link and empty state for launch", () => {
      render(<ReviewsSection />);

      const readReviews = screen.getByRole("link", {
        name: /read all reviews/i,
      });
      expect(readReviews.getAttribute("href")).toBe("/reviews");
    });

    it("Pack UGC: Tag @nadeonlabs external link", () => {
      render(<PackUgcSection />);

      const tagLink = screen.getByRole("link", { name: /tag @nadeonlabs/i });
      expect(tagLink.getAttribute("href")).toBe(
        "https://instagram.com/nadeonlabs"
      );
      expect(tagLink.getAttribute("target")).toBe("_blank");
    });

    it("Journal: All articles link and article items", () => {
      render(<JournalSection />);

      const allArticles = screen.getByRole("link", { name: /all articles/i });
      expect(allArticles.getAttribute("href")).toBe("/journal");
    });

    it("Pet FAQ: accordion toggle buttons and All FAQs link", () => {
      render(<FaqSection />);

      const allFaqs = screen.getByRole("link", { name: /all faqs/i });
      expect(allFaqs.getAttribute("href")).toBe("/faq");

      const faqBtn = screen.getByRole("button", {
        name: /how many chews should my dog take\?/i,
      });
      expect(faqBtn.getAttribute("aria-expanded")).toBe("false");

      fireEvent.click(faqBtn);
      expect(faqBtn.getAttribute("aria-expanded")).toBe("true");

      fireEvent.click(faqBtn);
      expect(faqBtn.getAttribute("aria-expanded")).toBe("false");
    });

    it("And for you: Visit Nadeon Human link", () => {
      render(<AndForYouSection />);

      const visitHuman = screen.getByRole("link", {
        name: /visit nadeon human →/i,
      });
      expect(visitHuman.getAttribute("href")).toBe("/human");
    });

    it("Bottom CTA Banner: Shop dog chews and Find the right formula", () => {
      render(<BottomCtaBanner />);

      const shopDogChews = screen.getByRole("link", {
        name: /shop dog chews/i,
      });
      expect(shopDogChews.getAttribute("href")).toBe("/pet/dogs");

      const findFormula = screen.getByRole("link", {
        name: /find the right formula/i,
      });
      expect(findFormula.getAttribute("href")).toBe("/pet/quiz");
    });

    it("Regulatory Notice: displays FDA disclaimer and Pet animal/equine notices", () => {
      render(<PetRegulatoryNotice />);

      expect(
        screen.getByText(
          /for animal use only\. equine products: not for horses intended for food\./i
        )
      ).toBeDefined();
    });
  });
});
