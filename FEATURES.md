# Lume Fashion — Proposed Feature List

This document lists prioritized feature ideas, short descriptions, impact/effort estimates, and quick acceptance criteria to help pick and implement the next improvements.

## How to use
- Pick a feature below to scope and implement.
- I can draft a detailed spec, create tasks/branches, and implement code once you choose.

---

## 1. Offers Admin UI
- Impact: High • Effort: Medium
- Description: Admin-facing CRUD UI for offers, product multi-select, banner image upload, schedule (starts/ends), status (draft/active/archived).
- Backend: Uses existing `/api/offers` endpoints; support `productIds`, `bannerImage`, `status`.
- Acceptance criteria: Admin can create/edit/delete offers, select products, upload banner, and offers appear correctly on product listings and cart.

## 2. Priority & Stacking Rules
- Impact: High • Effort: Medium
- Description: Define whether offers stack or exclude each other; allow priority levels and rules (first-match, best, combine percentages/fixed).
- Acceptance criteria: Backend enforces stacking rules and UI shows applied discounts consistently.

## 3. Personalized Discounts (Segmented Offers)
- Impact: High • Effort: Large
- Description: Target offers to user segments (new customers, VIPs, based on purchase history) or single-user promo codes.
- Acceptance criteria: Admin can target segments; eligible users see discounts; analytics show uplift.

## 4. Abandoned Cart Recovery
- Impact: High (conversion) • Effort: Medium
- Description: Background job to detect abandoned carts and send templated recovery emails with offer codes.
- Acceptance criteria: System schedules jobs, sends emails, and tracks conversions.

## 5. Recommendations Engine
- Impact: High • Effort: Medium
- Description: Show "Similar items" and "Frequently bought together" using simple heuristics (category, tags, co-purchase) or lightweight collaborative filtering.
- Acceptance criteria: Recommendations appear on product pages and increase average cart size in A/B tests.

## 6. Bulk Product Import / Export
- Impact: Medium • Effort: Medium
- Description: Admin CSV/XLSX import/export with image URL mapping and product-field validation.
- Acceptance criteria: Admin uploads a CSV mapping columns; products are created/updated; errors are reported.

## 7. Wishlist Sharing & Social
- Impact: Medium • Effort: Small
- Description: Generate public shareable wishlist links; add simple social sharing buttons.
- Acceptance criteria: User can share a wishlist URL; recipients can view items.

## 8. Gift Cards / Store Credit
- Impact: Medium • Effort: Medium
- Description: Sell and redeem gift card codes, track balance, apply as payment method in checkout.
- Acceptance criteria: Purchase flow, redemption, and balance checks work end-to-end.

## 9. Reviews & Ratings (with Moderation)
- Impact: Medium • Effort: Small
- Description: Allow users to submit reviews, images, and star ratings; admin moderation and display aggregates.
- Acceptance criteria: Reviews show on product pages; moderation tools for admins.

## 10. Visual Search / Image Similarity
- Impact: High (differentiator) • Effort: Large
- Description: Allow users to upload an image to find visually similar products using embeddings or third-party API.
- Acceptance criteria: Upload → search returns good matches within acceptable latency.

## 11. Low-Stock Alerts & Admin Dashboard
- Impact: Small • Effort: Small
- Description: Notify admins for low inventory and show a simple dashboard of KPIs (low stock, top sellers, active offers).
- Acceptance criteria: Alerts are sent and dashboard renders basic metrics.

## 12. Advanced Search & Facets
- Impact: High UX • Effort: Medium
- Description: Add autosuggest, synonyms, and faceted filtering (size, color, price) for collections.
- Acceptance criteria: Search responds quickly and facets filter results correctly.

---

## Implementation notes
- Recommended first pick: **Offers Admin UI** — aligns with backend changes already made and unlocks merchant control.
- Quick-win features: `Wishlist Sharing`, `Reviews & Ratings`, `Low-Stock Alerts`.
- For large efforts (Visual Search, Personalized Discounts), consider prototypes or using SaaS providers for faster delivery.

## Next steps
- Choose one feature to spec in detail.
- I can scaffold the admin UI, APIs, tests, and a branch for the work.

---

_File created by the dev assistant — ask me to draft the detailed spec or start implementation for any item._
