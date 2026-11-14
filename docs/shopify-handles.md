# Shopify Handles & Product Catalog Setup Guide

> **Status:** Reference table for manual product and bundle entry into Shopify.
> **Provisional Pricing Notice:** All product and kit prices are provisional as designed in the initial product catalog (see `catalogo-telas-nadeon.md`, section 3) and remain subject to final verification before launch.
> **Renders & Label Textures:** Product label images located in `public/renders/<handle>.<ext>`. Products without existing 3D renders/label textures in the design are marked as **Pendente** (pending).

## Catalog Summary

| Category                  | Total Count | Renders Available | Pending Renders |
| :------------------------ | :---------- | :---------------- | :-------------- |
| **Human Products (SKUs)** | 7           | 5                 | 2               |
| **Pet Products (SKUs)**   | 14          | 4                 | 10              |
| **Total Products (SKUs)** | **21**      | **9**             | **12**          |
| **Human Kits & Bundles**  | 4           | 0                 | 4               |
| **Pet Kits & Bundles**    | 4           | 0                 | 4               |
| **Total Kits & Bundles**  | **8**       | **0**             | **8**           |

## 1. Master Handles Table (21 Products & 8 Kits)

| Item                                            | Type            | Handle                | Format / Species  | Provisional Price (1 Jar / Base) | Variants (1/2/3 Jars)                                                                        | Selling Plans                      | Tags                                                                             | Render Status         |
| :---------------------------------------------- | :-------------- | :-------------------- | :---------------- | :------------------------------- | :------------------------------------------------------------------------------------------- | :--------------------------------- | :------------------------------------------------------------------------------- | :-------------------- |
| **BioHack**<br/>_NMN 500 mg_                    | Product (human) | `biohack`             | Capsules          | $59.00                           | 1J: $59.00 (NAD-HUM-BIO-1)<br/>2J: $106.00 (NAD-HUM-BIO-2)<br/>3J: $150.00 (NAD-HUM-BIO-3)   | 30d (-15%), 60d (-15%), 90d (-15%) | `line:human, format:capsules, brand:nadeon, subscription:eligible`               | `biohack.png`         |
| **Full Charge**<br/>_NMN 4-in-1_                | Product (human) | `full-charge`         | Capsules          | $69.00                           | 1J: $69.00 (NAD-HUM-FC-1)<br/>2J: $124.00 (NAD-HUM-FC-2)<br/>3J: $175.00 (NAD-HUM-FC-3)      | 30d (-15%), 60d (-15%), 90d (-15%) | `line:human, format:capsules, brand:nadeon, subscription:eligible`               | `full-charge.png`     |
| **Renew**<br/>_NAD+ + Resveratrol_              | Product (human) | `renew`               | Capsules          | $65.00                           | 1J: $65.00 (NAD-HUM-REN-1)<br/>2J: $117.00 (NAD-HUM-REN-2)<br/>3J: $165.00 (NAD-HUM-REN-3)   | 30d (-15%), 60d (-15%), 90d (-15%) | `line:human, format:capsules, brand:nadeon, subscription:eligible`               | `renew.png`           |
| **Glow**<br/>_Collagen + NMN_                   | Product (human) | `glow`                | Powders           | $59.00                           | 1J: $59.00 (NAD-HUM-GLO-1)<br/>2J: $106.00 (NAD-HUM-GLO-2)<br/>3J: $150.00 (NAD-HUM-GLO-3)   | 30d (-15%), 60d (-15%), 90d (-15%) | `line:human, format:powders, brand:nadeon, subscription:eligible`                | **Pendente**          |
| **Prime**<br/>_Pure NAD+ powder_                | Product (human) | `prime`               | Powders           | $49.00                           | 1J: $49.00 (NAD-HUM-PRI-1)<br/>2J: $88.00 (NAD-HUM-PRI-2)<br/>3J: $125.00 (NAD-HUM-PRI-3)    | 30d (-15%), 60d (-15%), 90d (-15%) | `line:human, format:powders, brand:nadeon, subscription:eligible`                | **Pendente**          |
| **Powerhouse**<br/>_Mito Oil_                   | Product (human) | `powerhouse`          | Tinctures         | $45.00                           | 1J: $45.00 (NAD-HUM-POW-1)<br/>2J: $81.00 (NAD-HUM-POW-2)<br/>3J: $115.00 (NAD-HUM-POW-3)    | 30d (-15%), 60d (-15%), 90d (-15%) | `line:human, format:tinctures, brand:nadeon, subscription:eligible`              | `powerhouse.png`      |
| **Daylight**<br/>_D3 + K2_                      | Product (human) | `daylight`            | Tinctures         | $29.00                           | 1J: $29.00 (NAD-HUM-DAY-1)<br/>2J: $52.00 (NAD-HUM-DAY-2)<br/>3J: $74.00 (NAD-HUM-DAY-3)     | 30d (-15%), 60d (-15%), 90d (-15%) | `line:human, format:tinctures, brand:nadeon, subscription:eligible`              | `daylight.png`        |
| **More Good Years**<br/>_Senior · NMN 75 mg_    | Product (pet)   | `more-good-years`     | Soft chews (dog)  | $44.00                           | 1J: $44.00 (NAD-PET-MGY-1)<br/>2J: $80.00 (NAD-PET-MGY-2)<br/>3J: $108.00 (NAD-PET-MGY-3)    | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:soft-chews, brand:nadeon, subscription:eligible`  | `more-good-years.png` |
| **Golden Years**<br/>_Joints · NMN 50 mg_       | Product (pet)   | `golden-years`        | Soft chews (dog)  | $44.00                           | 1J: $44.00 (NAD-PET-GYR-1)<br/>2J: $80.00 (NAD-PET-GYR-2)<br/>3J: $108.00 (NAD-PET-GYR-3)    | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:soft-chews, brand:nadeon, subscription:eligible`  | `golden-years.png`    |
| **Still Sharp**<br/>_Calm · NMN 50 mg_          | Product (pet)   | `still-sharp`         | Soft chews (dog)  | $44.00                           | 1J: $44.00 (NAD-PET-STP-1)<br/>2J: $80.00 (NAD-PET-STP-2)<br/>3J: $108.00 (NAD-PET-STP-3)    | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:soft-chews, brand:nadeon, subscription:eligible`  | `still-sharp.png`     |
| **Shine On**<br/>_Skin & coat · NMN 50 mg_      | Product (pet)   | `shine-on`            | Soft chews (dog)  | $44.00                           | 1J: $44.00 (NAD-PET-SHN-1)<br/>2J: $80.00 (NAD-PET-SHN-2)<br/>3J: $108.00 (NAD-PET-SHN-3)    | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:soft-chews, brand:nadeon, subscription:eligible`  | `shine-on.png`        |
| **Good Days**<br/>_Treats · NMN 30 mg_          | Product (pet)   | `good-days`           | Treats (dog)      | $29.00                           | 1J: $29.00 (NAD-PET-GDY-1)<br/>2J: $52.00 (NAD-PET-GDY-2)<br/>3J: $72.00 (NAD-PET-GDY-3)     | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:treats, brand:nadeon, subscription:eligible`      | **Pendente**          |
| **Second Wind**<br/>_Powder · NMN 75 mg_        | Product (pet)   | `second-wind`         | Powder (dog)      | $39.00                           | 1J: $39.00 (NAD-PET-SWD-1)<br/>2J: $70.00 (NAD-PET-SWD-2)<br/>3J: $96.00 (NAD-PET-SWD-3)     | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:powder, brand:nadeon, subscription:eligible`      | **Pendente**          |
| **More Good Years Oil**<br/>_Longevity · drops_ | Product (pet)   | `more-good-years-oil` | Oils (dog)        | $44.00                           | 1J: $44.00 (NAD-PET-MGYO-1)<br/>2J: $80.00 (NAD-PET-MGYO-2)<br/>3J: $108.00 (NAD-PET-MGYO-3) | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:oils, brand:nadeon, subscription:eligible`        | **Pendente**          |
| **Golden Years Oil**<br/>_Joints · drops_       | Product (pet)   | `golden-years-oil`    | Oils (dog)        | $44.00                           | 1J: $44.00 (NAD-PET-GYRO-1)<br/>2J: $80.00 (NAD-PET-GYRO-2)<br/>3J: $108.00 (NAD-PET-GYRO-3) | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:oils, brand:nadeon, subscription:eligible`        | **Pendente**          |
| **Still Sharp Oil**<br/>_Calm · drops_          | Product (pet)   | `still-sharp-oil`     | Oils (dog)        | $44.00                           | 1J: $44.00 (NAD-PET-STPO-1)<br/>2J: $80.00 (NAD-PET-STPO-2)<br/>3J: $108.00 (NAD-PET-STPO-3) | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:oils, brand:nadeon, subscription:eligible`        | **Pendente**          |
| **Shine On Oil**<br/>_Skin & coat · drops_      | Product (pet)   | `shine-on-oil`        | Oils (dog)        | $44.00                           | 1J: $44.00 (NAD-PET-SHNO-1)<br/>2J: $80.00 (NAD-PET-SHNO-2)<br/>3J: $108.00 (NAD-PET-SHNO-3) | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:dog, format:oils, brand:nadeon, subscription:eligible`        | **Pendente**          |
| **High Jump**<br/>_Joints · drops_              | Product (pet)   | `high-jump`           | Drops (cat)       | $32.00                           | 1J: $32.00 (NAD-PET-HJP-1)<br/>2J: $58.00 (NAD-PET-HJP-2)<br/>3J: $78.00 (NAD-PET-HJP-3)     | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:cat, format:drops, brand:nadeon, subscription:eligible`       | **Pendente**          |
| **Purr Mode**<br/>_Calm · drops_                | Product (pet)   | `purr-mode`           | Drops (cat)       | $32.00                           | 1J: $32.00 (NAD-PET-PUR-1)<br/>2J: $58.00 (NAD-PET-PUR-2)<br/>3J: $78.00 (NAD-PET-PUR-3)     | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:cat, format:drops, brand:nadeon, subscription:eligible`       | **Pendente**          |
| **Long Stride**<br/>_Joints · top-dress_        | Product (pet)   | `long-stride`         | Top-dress (horse) | $59.00                           | 1J: $59.00 (NAD-PET-LSD-1)<br/>2J: $106.00 (NAD-PET-LSD-2)<br/>3J: $150.00 (NAD-PET-LSD-3)   | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:horse, format:top-dress, brand:nadeon, subscription:eligible` | **Pendente**          |
| **Solid Ground**<br/>_Hooves · top-dress_       | Product (pet)   | `solid-ground`        | Top-dress (horse) | $59.00                           | 1J: $59.00 (NAD-PET-SGD-1)<br/>2J: $106.00 (NAD-PET-SGD-2)<br/>3J: $150.00 (NAD-PET-SGD-3)   | 30d (-15%), 60d (-15%), 90d (-15%) | `line:pet, species:horse, format:top-dress, brand:nadeon, subscription:eligible` | **Pendente**          |
| **Energy Duo**                                  | Kit (human)     | `energy-duo`          | Kit / Bundle      | $105.00                          | Included items:<br/>1x `biohack`<br/>1x `renew`                                              | One-time purchase                  | `line:human, type:kit, bundle, brand:nadeon, subscription:ineligible`            | **Pendente**          |
| **Beauty Duo**                                  | Kit (human)     | `beauty-duo`          | Kit / Bundle      | $92.00                           | Included items:<br/>1x `glow`<br/>1x `prime`                                                 | One-time purchase                  | `line:human, type:kit, bundle, brand:nadeon, subscription:ineligible`            | **Pendente**          |
| **Morning Stack**                               | Kit (human)     | `morning-stack`       | Kit / Bundle      | $75.00                           | Included items:<br/>1x `biohack`<br/>1x `daylight`                                           | One-time purchase                  | `line:human, type:kit, bundle, brand:nadeon, subscription:ineligible`            | **Pendente**          |
| **Full Routine**                                | Kit (human)     | `full-routine`        | Kit / Bundle      | $144.00                          | Included items:<br/>1x `biohack`<br/>1x `renew`<br/>1x `powerhouse`                          | One-time purchase                  | `line:human, type:kit, bundle, brand:nadeon, subscription:ineligible`            | **Pendente**          |
| **Chew + Oil**                                  | Kit (pet)       | `chew-oil`            | Kit / Bundle      | $75.00                           | Included items:<br/>1x `more-good-years`<br/>1x `more-good-years-oil`                        | One-time purchase                  | `line:pet, type:kit, bundle, brand:nadeon, subscription:ineligible`              | **Pendente**          |
| **Chew + Good Days**                            | Kit (pet)       | `chew-good-days`      | Kit / Bundle      | $62.00                           | Included items:<br/>1x `more-good-years`<br/>1x `good-days`                                  | One-time purchase                  | `line:pet, type:kit, bundle, brand:nadeon, subscription:ineligible`              | **Pendente**          |
| **Senior Starter**                              | Kit (pet)       | `senior-starter`      | Kit / Bundle      | $99.00                           | Included items:<br/>1x `more-good-years`<br/>1x `golden-years-oil`<br/>1x `good-days`        | One-time purchase                  | `line:pet, type:kit, bundle, brand:nadeon, subscription:ineligible`              | **Pendente**          |
| **Cat Care**                                    | Kit (pet)       | `cat-care`            | Kit / Bundle      | $54.00                           | Included items:<br/>1x `high-jump`<br/>1x `purr-mode`                                        | One-time purchase                  | `line:pet, type:kit, bundle, brand:nadeon, subscription:ineligible`              | **Pendente**          |

## 2. Human Line Products (7 SKUs)

### BioHack (`biohack`)

- **Technical Name:** NMN 500 mg
- **Line:** human
- **Format:** Capsules
- **Net Weight / Serving:** 60 capsules (2 capsules daily with water, in the morning)
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $59.00
- **Tags:** `line:human, format:capsules, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/biohack.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 jar** (1 jar): SKU `NAD-HUM-BIO-1` · Price: $59.00 (Compare at: $59.00)
  - **2 jars** (2 jars): SKU `NAD-HUM-BIO-2` · Price: $106.00 (Compare at: $118.00)
  - **3 jars** (3 jars): SKU `NAD-HUM-BIO-3` · Price: $150.00 (Compare at: $177.00)
- **Subscription Selling Plans:**
  - **1 jar every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **2 jars every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **3 jars every 90 days (15% off)**: Interval 90 days · Discount 15%

### Full Charge (`full-charge`)

- **Technical Name:** NMN 4-in-1
- **Line:** human
- **Format:** Capsules
- **Net Weight / Serving:** 60 capsules (2 capsules daily with water, in the morning)
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $69.00
- **Tags:** `line:human, format:capsules, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/full-charge.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 jar** (1 jar): SKU `NAD-HUM-FC-1` · Price: $69.00 (Compare at: $69.00)
  - **2 jars** (2 jars): SKU `NAD-HUM-FC-2` · Price: $124.00 (Compare at: $138.00)
  - **3 jars** (3 jars): SKU `NAD-HUM-FC-3` · Price: $175.00 (Compare at: $207.00)
- **Subscription Selling Plans:**
  - **1 jar every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **2 jars every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **3 jars every 90 days (15% off)**: Interval 90 days · Discount 15%

### Renew (`renew`)

- **Technical Name:** NAD+ + Resveratrol
- **Line:** human
- **Format:** Capsules
- **Net Weight / Serving:** 60 capsules (2 capsules daily with water, with lunch)
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $65.00
- **Tags:** `line:human, format:capsules, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/renew.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 jar** (1 jar): SKU `NAD-HUM-REN-1` · Price: $65.00 (Compare at: $65.00)
  - **2 jars** (2 jars): SKU `NAD-HUM-REN-2` · Price: $117.00 (Compare at: $130.00)
  - **3 jars** (3 jars): SKU `NAD-HUM-REN-3` · Price: $165.00 (Compare at: $195.00)
- **Subscription Selling Plans:**
  - **1 jar every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **2 jars every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **3 jars every 90 days (15% off)**: Interval 90 days · Discount 15%

### Glow (`glow`)

- **Technical Name:** Collagen + NMN
- **Line:** human
- **Format:** Powders
- **Net Weight / Serving:** 300 g (1 scoop (10 g) daily stirred into water or smoothie)
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $59.00
- **Tags:** `line:human, format:powders, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 jar** (1 jar): SKU `NAD-HUM-GLO-1` · Price: $59.00 (Compare at: $59.00)
  - **2 jars** (2 jars): SKU `NAD-HUM-GLO-2` · Price: $106.00 (Compare at: $118.00)
  - **3 jars** (3 jars): SKU `NAD-HUM-GLO-3` · Price: $150.00 (Compare at: $177.00)
- **Subscription Selling Plans:**
  - **1 jar every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **2 jars every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **3 jars every 90 days (15% off)**: Interval 90 days · Discount 15%

### Prime (`prime`)

- **Technical Name:** Pure NAD+ powder
- **Line:** human
- **Format:** Powders
- **Net Weight / Serving:** 7.5 g (1 scoop (250 mg) daily dissolved in water or beverage)
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $49.00
- **Tags:** `line:human, format:powders, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 jar** (1 jar): SKU `NAD-HUM-PRI-1` · Price: $49.00 (Compare at: $49.00)
  - **2 jars** (2 jars): SKU `NAD-HUM-PRI-2` · Price: $88.00 (Compare at: $98.00)
  - **3 jars** (3 jars): SKU `NAD-HUM-PRI-3` · Price: $125.00 (Compare at: $147.00)
- **Subscription Selling Plans:**
  - **1 jar every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **2 jars every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **3 jars every 90 days (15% off)**: Interval 90 days · Discount 15%

### Powerhouse (`powerhouse`)

- **Technical Name:** Mito Oil
- **Line:** human
- **Format:** Tinctures
- **Net Weight / Serving:** 30 ml (1 fl oz) (1 ml daily (one full dropper))
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $45.00
- **Tags:** `line:human, format:tinctures, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/powerhouse.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Bottle (30 days)** (1 jar): SKU `NAD-HUM-POW-1` · Price: $45.00 (Compare at: $45.00)
  - **2 Bottles (60 days)** (2 jars): SKU `NAD-HUM-POW-2` · Price: $81.00 (Compare at: $90.00)
  - **3 Bottles (90 days)** (3 jars): SKU `NAD-HUM-POW-3` · Price: $115.00 (Compare at: $135.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Daylight (`daylight`)

- **Technical Name:** D3 + K2
- **Line:** human
- **Format:** Tinctures
- **Net Weight / Serving:** 30 ml (1 fl oz) (1 ml daily (one full dropper))
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $29.00
- **Tags:** `line:human, format:tinctures, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/daylight.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Bottle (30 days)** (1 jar): SKU `NAD-HUM-DAY-1` · Price: $29.00 (Compare at: $29.00)
  - **2 Bottles (60 days)** (2 jars): SKU `NAD-HUM-DAY-2` · Price: $52.00 (Compare at: $58.00)
  - **3 Bottles (90 days)** (3 jars): SKU `NAD-HUM-DAY-3` · Price: $74.00 (Compare at: $87.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

## 3. Pet Line Products (14 SKUs)

> **Regulatory Notice:** All Pet line products must include _'For animal use only'_. Equine formulas must display _'Not for horses intended for food'_.

### More Good Years (`more-good-years`)

- **Technical Name:** Senior · NMN 75 mg
- **Line:** pet
- **Species:** dog
- **Format:** Soft chews
- **Net Weight / Serving:** 60 soft chews (1 to 4 soft chews depending on canine weight)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $44.00
- **Tags:** `line:pet, species:dog, format:soft-chews, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/more-good-years.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-MGY-1` · Price: $44.00 (Compare at: $44.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-MGY-2` · Price: $80.00 (Compare at: $88.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-MGY-3` · Price: $108.00 (Compare at: $132.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Golden Years (`golden-years`)

- **Technical Name:** Joints · NMN 50 mg
- **Line:** pet
- **Species:** dog
- **Format:** Soft chews
- **Net Weight / Serving:** 60 soft chews (1 to 4 soft chews depending on canine weight)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $44.00
- **Tags:** `line:pet, species:dog, format:soft-chews, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/golden-years.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-GYR-1` · Price: $44.00 (Compare at: $44.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-GYR-2` · Price: $80.00 (Compare at: $88.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-GYR-3` · Price: $108.00 (Compare at: $132.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Still Sharp (`still-sharp`)

- **Technical Name:** Calm · NMN 50 mg
- **Line:** pet
- **Species:** dog
- **Format:** Soft chews
- **Net Weight / Serving:** 60 soft chews (1 to 4 soft chews depending on canine weight)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $44.00
- **Tags:** `line:pet, species:dog, format:soft-chews, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/still-sharp.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-STP-1` · Price: $44.00 (Compare at: $44.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-STP-2` · Price: $80.00 (Compare at: $88.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-STP-3` · Price: $108.00 (Compare at: $132.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Shine On (`shine-on`)

- **Technical Name:** Skin & coat · NMN 50 mg
- **Line:** pet
- **Species:** dog
- **Format:** Soft chews
- **Net Weight / Serving:** 60 soft chews (1 to 4 soft chews depending on canine weight)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $44.00
- **Tags:** `line:pet, species:dog, format:soft-chews, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** `public/renders/shine-on.png` (Present)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-SHN-1` · Price: $44.00 (Compare at: $44.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-SHN-2` · Price: $80.00 (Compare at: $88.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-SHN-3` · Price: $108.00 (Compare at: $132.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Good Days (`good-days`)

- **Technical Name:** Treats · NMN 30 mg
- **Line:** pet
- **Species:** dog
- **Format:** Treats
- **Net Weight / Serving:** 60 treats (1 to 4 treats depending on canine weight)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $29.00
- **Tags:** `line:pet, species:dog, format:treats, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-GDY-1` · Price: $29.00 (Compare at: $29.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-GDY-2` · Price: $52.00 (Compare at: $58.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-GDY-3` · Price: $72.00 (Compare at: $87.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Second Wind (`second-wind`)

- **Technical Name:** Powder · NMN 75 mg
- **Line:** pet
- **Species:** dog
- **Format:** Powder
- **Net Weight / Serving:** 240 g powder (1 to 4 scoops depending on canine weight)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $39.00
- **Tags:** `line:pet, species:dog, format:powder, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-SWD-1` · Price: $39.00 (Compare at: $39.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-SWD-2` · Price: $70.00 (Compare at: $78.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-SWD-3` · Price: $96.00 (Compare at: $117.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### More Good Years Oil (`more-good-years-oil`)

- **Technical Name:** Longevity · drops
- **Line:** pet
- **Species:** dog
- **Format:** Oils
- **Net Weight / Serving:** 60 mL (2 fl oz) (0.5 mL per 20 lbs body weight daily)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $44.00
- **Tags:** `line:pet, species:dog, format:oils, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-MGYO-1` · Price: $44.00 (Compare at: $44.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-MGYO-2` · Price: $80.00 (Compare at: $88.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-MGYO-3` · Price: $108.00 (Compare at: $132.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Golden Years Oil (`golden-years-oil`)

- **Technical Name:** Joints · drops
- **Line:** pet
- **Species:** dog
- **Format:** Oils
- **Net Weight / Serving:** 60 mL (2 fl oz) (0.5 mL per 20 lbs body weight daily)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $44.00
- **Tags:** `line:pet, species:dog, format:oils, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-GYRO-1` · Price: $44.00 (Compare at: $44.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-GYRO-2` · Price: $80.00 (Compare at: $88.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-GYRO-3` · Price: $108.00 (Compare at: $132.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Still Sharp Oil (`still-sharp-oil`)

- **Technical Name:** Calm · drops
- **Line:** pet
- **Species:** dog
- **Format:** Oils
- **Net Weight / Serving:** 60 mL (2 fl oz) (0.5 mL per 20 lbs body weight daily)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $44.00
- **Tags:** `line:pet, species:dog, format:oils, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-STPO-1` · Price: $44.00 (Compare at: $44.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-STPO-2` · Price: $80.00 (Compare at: $88.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-STPO-3` · Price: $108.00 (Compare at: $132.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Shine On Oil (`shine-on-oil`)

- **Technical Name:** Skin & coat · drops
- **Line:** pet
- **Species:** dog
- **Format:** Oils
- **Net Weight / Serving:** 60 mL (2 fl oz) (0.5 mL per 20 lbs body weight daily)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $44.00
- **Tags:** `line:pet, species:dog, format:oils, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Jar** (1 jar): SKU `NAD-PET-SHNO-1` · Price: $44.00 (Compare at: $44.00)
  - **2 Jars** (2 jars): SKU `NAD-PET-SHNO-2` · Price: $80.00 (Compare at: $88.00)
  - **3 Jars** (3 jars): SKU `NAD-PET-SHNO-3` · Price: $108.00 (Compare at: $132.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### High Jump (`high-jump`)

- **Technical Name:** Joints · drops
- **Line:** pet
- **Species:** cat
- **Format:** Drops
- **Net Weight / Serving:** 30 mL (1 fl oz) (5 drops in food daily)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $32.00
- **Tags:** `line:pet, species:cat, format:drops, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Bottle (60 days)** (1 jar): SKU `NAD-PET-HJP-1` · Price: $32.00 (Compare at: $32.00)
  - **2 Bottles (120 days)** (2 jars): SKU `NAD-PET-HJP-2` · Price: $58.00 (Compare at: $64.00)
  - **3 Bottles (180 days)** (3 jars): SKU `NAD-PET-HJP-3` · Price: $78.00 (Compare at: $96.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Purr Mode (`purr-mode`)

- **Technical Name:** Calm · drops
- **Line:** pet
- **Species:** cat
- **Format:** Drops
- **Net Weight / Serving:** 30 mL (1 fl oz) (5 drops in food daily)
- **Servings Per Jar:** 60
- **Provisional Price (1 Jar):** $32.00
- **Tags:** `line:pet, species:cat, format:drops, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Bottle (60 days)** (1 jar): SKU `NAD-PET-PUR-1` · Price: $32.00 (Compare at: $32.00)
  - **2 Bottles (120 days)** (2 jars): SKU `NAD-PET-PUR-2` · Price: $58.00 (Compare at: $64.00)
  - **3 Bottles (180 days)** (3 jars): SKU `NAD-PET-PUR-3` · Price: $78.00 (Compare at: $96.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Long Stride (`long-stride`)

- **Technical Name:** Joints · top-dress
- **Line:** pet
- **Species:** horse
- **Format:** Top-dress
- **Net Weight / Serving:** 900 g (2 lb) (1 scoop daily with grain)
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $59.00
- **Tags:** `line:pet, species:horse, format:top-dress, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Bucket (30 days)** (1 jar): SKU `NAD-PET-LSD-1` · Price: $59.00 (Compare at: $59.00)
  - **2 Buckets (60 days)** (2 jars): SKU `NAD-PET-LSD-2` · Price: $106.00 (Compare at: $118.00)
  - **3 Buckets (90 days)** (3 jars): SKU `NAD-PET-LSD-3` · Price: $150.00 (Compare at: $177.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

### Solid Ground (`solid-ground`)

- **Technical Name:** Hooves · top-dress
- **Line:** pet
- **Species:** horse
- **Format:** Top-dress
- **Net Weight / Serving:** 900 g (2 lb) (1 scoop daily with grain)
- **Servings Per Jar:** 30
- **Provisional Price (1 Jar):** $59.00
- **Tags:** `line:pet, species:horse, format:top-dress, brand:nadeon, subscription:eligible`
- **Render / Label Artwork:** **Pendente** (Pending label texture / 3D render)
- **Variants (1 / 2 / 3 Jars):**
  - **1 Bucket (30 days)** (1 jar): SKU `NAD-PET-SGD-1` · Price: $59.00 (Compare at: $59.00)
  - **2 Buckets (60 days)** (2 jars): SKU `NAD-PET-SGD-2` · Price: $106.00 (Compare at: $118.00)
  - **3 Buckets (90 days)** (3 jars): SKU `NAD-PET-SGD-3` · Price: $150.00 (Compare at: $177.00)
- **Subscription Selling Plans:**
  - **Delivery every 30 days (15% off)**: Interval 30 days · Discount 15%
  - **Delivery every 60 days (15% off)**: Interval 60 days · Discount 15%
  - **Delivery every 90 days (15% off)**: Interval 90 days · Discount 15%

## 4. Kits & Bundles (8 Kits)

### Human Kits

#### Energy Duo (`energy-duo`)

- **Description:** BioHack for daily NMN plus Renew for direct NAD+.*
- **Provisional Price:** $105.00 (Compare at: $124.00)
- **Tags:** `line:human, type:kit, bundle, brand:nadeon, subscription:ineligible`
- **Render Artwork:** **Pendente** (Pending kit box render)
- **Included Products:**
  - `biohack`: 1 unit(s)
  - `renew`: 1 unit(s)

#### Beauty Duo (`beauty-duo`)

- **Description:** Glow collagen with NMN plus Prime pure NAD+ powder.*
- **Provisional Price:** $92.00 (Compare at: $108.00)
- **Tags:** `line:human, type:kit, bundle, brand:nadeon, subscription:ineligible`
- **Render Artwork:** **Pendente** (Pending kit box render)
- **Included Products:**
  - `glow`: 1 unit(s)
  - `prime`: 1 unit(s)

#### Morning Stack (`morning-stack`)

- **Description:** Your morning NMN plus vitamin D3 and K2 drops.*
- **Provisional Price:** $75.00 (Compare at: $88.00)
- **Tags:** `line:human, type:kit, bundle, brand:nadeon, subscription:ineligible`
- **Render Artwork:** **Pendente** (Pending kit box render)
- **Included Products:**
  - `biohack`: 1 unit(s)
  - `daylight`: 1 unit(s)

#### Full Routine (`full-routine`)

- **Description:** NMN, NAD+ and Mito Oil: the complete daily stack.*
- **Provisional Price:** $144.00 (Compare at: $169.00)
- **Tags:** `line:human, type:kit, bundle, brand:nadeon, subscription:ineligible`
- **Render Artwork:** **Pendente** (Pending kit box render)
- **Included Products:**
  - `biohack`: 1 unit(s)
  - `renew`: 1 unit(s)
  - `powerhouse`: 1 unit(s)

### Pet Kits

#### Chew + Oil (`chew-oil`)

- **Description:** More Good Years + More Good Years Oil. The daily chew plus drops for picky days. Oil: 0.5 mL per 20 lbs.*
- **Provisional Price:** $75.00 (Compare at: $88.00)
- **Tags:** `line:pet, type:kit, bundle, brand:nadeon, subscription:ineligible`
- **Render Artwork:** **Pendente** (Pending kit box render)
- **Included Products:**
  - `more-good-years`: 1 unit(s)
  - `more-good-years-oil`: 1 unit(s)

#### Chew + Good Days (`chew-good-days`)

- **Description:** More Good Years + Good Days. The daily chew plus a longevity treat for training and rewards.*
- **Provisional Price:** $62.00 (Compare at: $73.00)
- **Tags:** `line:pet, type:kit, bundle, brand:nadeon, subscription:ineligible`
- **Render Artwork:** **Pendente** (Pending kit box render)
- **Included Products:**
  - `more-good-years`: 1 unit(s)
  - `good-days`: 1 unit(s)

#### Senior Starter (`senior-starter`)

- **Description:** More Good Years + Golden Years Oil + Good Days. Everything for a senior dog: NAD+ chew, joint drops and daily treats.*
- **Provisional Price:** $99.00 (Compare at: $117.00)
- **Tags:** `line:pet, type:kit, bundle, brand:nadeon, subscription:ineligible`
- **Render Artwork:** **Pendente** (Pending kit box render)
- **Included Products:**
  - `more-good-years`: 1 unit(s)
  - `golden-years-oil`: 1 unit(s)
  - `good-days`: 1 unit(s)

#### Cat Care (`cat-care`)

- **Description:** High Jump + Purr Mode. High Jump joint drops and Purr Mode calm drops, made for cats.*
- **Provisional Price:** $54.00 (Compare at: $64.00)
- **Tags:** `line:pet, type:kit, bundle, brand:nadeon, subscription:ineligible`
- **Render Artwork:** **Pendente** (Pending kit box render)
- **Included Products:**
  - `high-jump`: 1 unit(s)
  - `purr-mode`: 1 unit(s)

## 5. Instructions for Manual Shopify Entry

1. **Title & Technical Name:** Use the exact product name as the main Shopify Title, and technical name in subtitle or metafield `custom.technical_name`.
2. **Handle / URL Slug:** Paste the exact handle specified in this table (e.g., `biohack`, `more-good-years`).
3. **Variants:** Create 3 variants (Option Name: `Quantity` or `Size`): `1 jar`, `2 jars`, and `3 jars`. Configure the corresponding SKU and provisional price.
4. **Selling Plans:** Set up Shopify Subscriptions App selling plans: 30 days (1 jar), 60 days (2 jars), 90 days (3 jars) with 15% discount.
5. **Product Tags:** Add all tags listed in the product section to ensure automatic collection matching.
6. **Images / Media:** Upload the corresponding render from `public/renders/<handle>.png`. If marked **Pendente**, leave placeholder until the official 3D render is produced.
