// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import EntrancePage from "@/app/(shared)/page";
import HumanPage from "@/app/(human)/human/page";
import PetPage from "@/app/(pet)/pet/page";
import { useCartStore } from "@/lib/providers/client";

describe("5.1 Semantic Elements: Entrada e Homes", () => {
  beforeEach(() => {
    useCartStore.getState().resetCart();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Entrada `/`", () => {
    it("renders semantic navigation buttons/links for Buy Human and Buy Pet", async () => {
      const page = await EntrancePage();
      render(page);

      const buyHuman = screen.getByRole("link", { name: /buy human/i });
      expect(buyHuman).toBeDefined();
      expect(buyHuman.getAttribute("href")).toBe("/human");

      const buyPet = screen.getByRole("link", { name: /buy pet/i });
      expect(buyPet).toBeDefined();
      expect(buyPet.getAttribute("href")).toBe("/pet");
    });
  });

  describe("Home Human `/human`", () => {
    it("renders hero carousel controls and action links across slides", async () => {
      const page = await HumanPage();
      render(page);

      const prevBtn = screen.getByRole("button", { name: /previous slide/i });
      const nextBtn = screen.getByRole("button", { name: /next slide/i });
      expect(prevBtn).toBeDefined();
      expect(nextBtn).toBeDefined();

      const shopBestSellers = screen.getByRole("link", {
        name: /shop best sellers/i,
      });
      expect(shopBestSellers.getAttribute("href")).toBe("#daily-routine");

      const takeQuiz = screen.getAllByRole("link", {
        name: /take the quiz/i,
      })[0];
      expect(takeQuiz.getAttribute("href")).toBe("/human/quiz");

      // Slide 2
      fireEvent.click(nextBtn);
      const addEnergyDuo = screen.getByRole("button", {
        name: /add the energy duo/i,
      });
      expect(addEnergyDuo).toBeDefined();

      const compareFormulas = screen.getByRole("link", {
        name: /compare formulas/i,
      });
      expect(compareFormulas.getAttribute("href")).toBe("#daily-routine");

      // Slide 3
      fireEvent.click(nextBtn);
      const take60SecQuiz = screen.getAllByRole("link", {
        name: /take the 60-second quiz/i,
      })[0];
      expect(take60SecQuiz).toBeDefined();

      const shopAll = screen.getAllByRole("link", {
        name: /shop all formulas/i,
      })[0];
      expect(shopAll).toBeDefined();

      // Slide 4: Black Friday
      fireEvent.click(nextBtn);
      const shopSale = screen.getByRole("link", { name: /shop the sale/i });
      expect(shopSale.getAttribute("href")).toBe("/human/shop");

      const seeKits = screen.getByRole("link", { name: /see the kits/i });
      expect(seeKits.getAttribute("href")).toBe("#bundles");
    });

    it("renders daily routine format tabs and Add to cart buttons", async () => {
      const page = await HumanPage();
      render(page);

      const tabAll = screen.getByRole("tab", { name: /^all$/i });
      const tabCapsules = screen.getByRole("tab", { name: /^capsules$/i });
      const tabPowders = screen.getByRole("tab", { name: /^powders$/i });
      const tabTinctures = screen.getByRole("tab", { name: /^tinctures$/i });

      expect(tabAll).toBeDefined();
      expect(tabCapsules).toBeDefined();
      expect(tabPowders).toBeDefined();
      expect(tabTinctures).toBeDefined();

      const addToCartButtons = screen.getAllByRole("button", {
        name: /add .* to cart/i,
      });
      expect(addToCartButtons.length).toBeGreaterThan(0);
    });

    it("renders discovery, comparison, age bands, and routine links/buttons", async () => {
      const page = await HumanPage();
      render(page);

      const findMyFormula = screen.getByRole("link", {
        name: /find my formula/i,
      });
      expect(findMyFormula.getAttribute("href")).toBe("/human/quiz");

      const compareAll = screen.getByRole("link", {
        name: /compare all formulas/i,
      });
      expect(compareAll.getAttribute("href")).toBe("/human/shop");

      const readScience = screen.getAllByRole("link", {
        name: /read the science/i,
      })[0];
      expect(readScience.getAttribute("href")).toBe("/science");

      const shopByIngredient = screen.getByRole("link", {
        name: /shop by ingredient/i,
      });
      expect(shopByIngredient.getAttribute("href")).toBe("/human/shop");

      const shopBioHack = screen.getByRole("link", { name: /shop biohack/i });
      expect(shopBioHack.getAttribute("href")).toBe("/human/products/biohack");

      const startRoutine = screen.getByRole("link", {
        name: /start your routine/i,
      });
      expect(startRoutine.getAttribute("href")).toBe("#daily-routine");

      const addDuo = screen.getByRole("button", { name: /add the duo/i });
      expect(addDuo).toBeDefined();

      const startSub = screen.getByRole("link", {
        name: /start a subscription/i,
      });
      expect(startSub.getAttribute("href")).toBe("/human/subscribe");
    });

    it("renders COA lot lookup search field, search button, and lab results link", async () => {
      const page = await HumanPage();
      render(page);

      const lotInput = screen.getByRole("textbox", {
        name: /enter lot number/i,
      });
      expect(lotInput).toBeDefined();

      const searchBtn = screen.getByRole("button", { name: /search/i });
      expect(searchBtn).toBeDefined();

      const seeLabResults = screen.getAllByRole("link", {
        name: /see our lab results/i,
      })[0];
      expect(seeLabResults.getAttribute("href")).toBe("/lab-results");
    });

    it("renders footer/social/support links and FAQ accordions", async () => {
      const page = await HumanPage();
      render(page);

      const aboutUs = screen.getByRole("link", { name: /about us/i });
      expect(aboutUs.getAttribute("href")).toBe("/about");

      const readReviews = screen.getByRole("link", {
        name: /read all reviews/i,
      });
      expect(readReviews.getAttribute("href")).toBe("/reviews");

      const allArticles = screen.getByRole("link", { name: /all articles/i });
      expect(allArticles.getAttribute("href")).toBe("/journal");

      const allFaqs = screen.getByRole("link", { name: /all faqs/i });
      expect(allFaqs.getAttribute("href")).toBe("/faq");

      const faqBtn = screen.getByRole("button", {
        name: /what is nmn and how is it different from nad\+?/i,
      });
      expect(faqBtn).toBeDefined();

      const visitPet = screen.getByRole("link", {
        name: /visit nadeon pet →/i,
      });
      expect(visitPet.getAttribute("href")).toBe("/pet");
    });
  });

  describe("Home Pet `/pet`", () => {
    it("renders hero carousel controls and slide links", async () => {
      const page = await PetPage();
      render(page);

      const prevBtn = screen.getByRole("button", { name: /previous slide/i });
      const nextBtn = screen.getByRole("button", { name: /next slide/i });
      expect(prevBtn).toBeDefined();
      expect(nextBtn).toBeDefined();

      const shopDogs = screen.getByRole("link", { name: /shop for dogs/i });
      expect(shopDogs.getAttribute("href")).toBe("/pet/dogs");

      const findFormula = screen.getAllByRole("link", {
        name: /find the right formula/i,
      })[0];
      expect(findFormula.getAttribute("href")).toBe("/pet/quiz");

      // Slide 2
      fireEvent.click(nextBtn);
      const shopGoldenYears = screen.getByRole("link", {
        name: /shop golden years/i,
      });
      expect(shopGoldenYears.getAttribute("href")).toBe("/pet/dogs");

      const seeJointBundle = screen.getByRole("link", {
        name: /see the joint bundle/i,
      });
      expect(seeJointBundle.getAttribute("href")).toBe("/pet/kits");

      // Slide 3
      fireEvent.click(nextBtn);
      const buildSub = screen.getAllByRole("link", {
        name: /build a subscription/i,
      })[0];
      expect(buildSub.getAttribute("href")).toBe("/pet/subscribe");

      const howItWorks = screen.getByRole("link", { name: /how it works/i });
      expect(howItWorks.getAttribute("href")).toBe("#how-it-works");
    });

    it("renders 'Who are we shopping for?' links for dogs, cats, and horses", async () => {
      const page = await PetPage();
      render(page);

      const shopDogs = screen.getByRole("link", { name: /shop dogs/i });
      expect(shopDogs.getAttribute("href")).toBe("/pet/dogs");

      const shopCats = screen.getByRole("link", { name: /shop cats/i });
      expect(shopCats.getAttribute("href")).toBe("/pet/cats");

      const shopHorses = screen.getByRole("link", { name: /shop horses/i });
      expect(shopHorses.getAttribute("href")).toBe("/pet/horses");
    });

    it("renders 'How many chews a day?' and weight dosing CTAs", async () => {
      const page = await PetPage();
      render(page);

      const shopChews = screen.getByRole("link", {
        name: /shop chews for my dog/i,
      });
      expect(shopChews.getAttribute("href")).toBe("/pet/dogs");
    });

    it("renders format tabs (Chews, Treats, Oils, Powder) and product Add to cart", async () => {
      const page = await PetPage();
      render(page);

      const chewsTab = screen.getByRole("tab", { name: "Chews" });
      const treatsTab = screen.getByRole("tab", { name: "Treats" });
      const oilsTab = screen.getByRole("tab", { name: "Oils" });
      const powderTab = screen.getByRole("tab", { name: "Powder" });

      expect(chewsTab).toBeDefined();
      expect(treatsTab).toBeDefined();
      expect(oilsTab).toBeDefined();
      expect(powderTab).toBeDefined();

      const addToCartButtons = screen.getAllByRole("button", {
        name: /add .* to cart/i,
      });
      expect(addToCartButtons.length).toBeGreaterThan(0);
    });

    it("renders Try a jar, life stage, expectation, and bundle links", async () => {
      const page = await PetPage();
      render(page);

      const tryJar = screen.getByRole("link", { name: /try a jar/i });
      expect(tryJar.getAttribute("href")).toBe("/pet/dogs");

      const adultDogs = screen.getByRole("link", { name: /shop adult dogs/i });
      expect(adultDogs.getAttribute("href")).toBe("/pet/dogs");

      const seniorDogs = screen.getByRole("link", {
        name: /shop senior dogs/i,
      });
      expect(seniorDogs.getAttribute("href")).toBe("/pet/dogs");

      const startToday = screen.getByRole("link", { name: /start today/i });
      expect(startToday.getAttribute("href")).toBe("/pet/dogs");

      const lookupLot = screen.getByRole("link", { name: /look up your lot/i });
      expect(lookupLot.getAttribute("href")).toBe("/lab-results");

      const getBundle = screen.getByRole("link", { name: /get the bundle/i });
      expect(getBundle.getAttribute("href")).toBe("/pet/kits");
    });

    it("renders UGC, reviews, journal, FAQ accordions, and Visit Human link", async () => {
      const page = await PetPage();
      render(page);

      const tagLink = screen.getByRole("link", { name: /tag @nadeonlabs/i });
      expect(tagLink.getAttribute("href")).toBe(
        "https://instagram.com/nadeonlabs"
      );

      const readReviews = screen.getByRole("link", {
        name: /read all reviews/i,
      });
      expect(readReviews.getAttribute("href")).toBe("/reviews");

      const allArticles = screen.getByRole("link", { name: /all articles/i });
      expect(allArticles.getAttribute("href")).toBe("/journal");

      const allFaqs = screen.getByRole("link", { name: /all faqs/i });
      expect(allFaqs.getAttribute("href")).toBe("/faq");

      const faqBtn = screen.getByRole("button", {
        name: /how many chews should my dog take\?/i,
      });
      expect(faqBtn).toBeDefined();

      const visitHuman = screen.getByRole("link", {
        name: /visit nadeon human →/i,
      });
      expect(visitHuman.getAttribute("href")).toBe("/human");
    });
  });
});
