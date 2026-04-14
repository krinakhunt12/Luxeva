# Proposed New Ecommerce Features

This document outlines recommended features (inspired by Amazon/Flipkart) for the Luxeva codebase, prioritization, brief implementation notes, and acceptance criteria.

---

## 1. Personalized Recommendations (High priority)
- Description: Add "You may also like" / "Customers also bought" recommendations on product pages and home page using simple heuristics (category-based, also-bought via order history) with an option to extend to collaborative filtering later.
- Backend: `backend/features/products/productController.js` add `/recommendations` endpoint that returns related products by category, tag, and simple co-purchase aggregation.
- Frontend: `Frontend/src/pages/ProductDetail.tsx` add `Related products` section and call new API.
- Tasks:
  - Add `POST /api/products/:id/recommendations` or `GET /api/products/:id/recommendations`.
  - Implement category + tag + co-purchase fallback algorithm.
  - Add UI component `RelatedProducts` and reuse `ProductCard`.
- Acceptance:
  - Product page shows up to 8 recommendations relevant to the current product.
  - No significant delay in page load (use client-side fetch and skeleton while loading).

---

## 2. Improved Cart Abandonment Recovery (Medium priority)
- Description: Extend existing abandoned cart worker to support multiple recovery channels and an admin UI to view queued messages, retry sends and preview templates.
- Backend: `backend/jobs/abandonedCartWorker.js`, add endpoints under `backend/features/abandoned` (e.g., `/api/abandoned/list`, `/api/abandoned/send/:id`, `/api/abandoned/template`).
- Frontend: Admin UI panel to view abandoned carts, send test email, and view status.
- Tasks:
  - Add API for listing abandoned carts and forcing sends.
  - Add admin page (`Admin -> Abandoned Carts`) to view and resend.
  - Support email template variables and preview.
- Acceptance:
  - Admin can view pending abandoned carts and manually trigger send.
  - Worker continues to run hourly and updates `notifiedAt` and `recovered` flags.

---

## 3. Offers / Coupons: Admin + Checkout (Medium priority)
- Description: Admin can create offers/coupons; checkout applies best available coupon.
- Backend: `backend/features/offers` already exists — add coupon validation endpoint and improve offer-application logic in `productController` and orders flow.
- Frontend: Admin offers UI exists; add coupon entry on `Checkout` and apply logic in `Frontend/src/features/orders/hooks/useOrders.ts`.
- Tasks:
  - Add `POST /api/offers/validate` to validate coupon codes against cart payload.
  - Update frontend checkout to call `validate` and show discount preview.
- Acceptance:
  - Coupons validate correctly (expiration, product applicability) and discount applied to order total.

---

## 4. Gift-card Purchase Flow (Medium priority)
- Description: Allow customers to buy and redeem gift cards.
- Backend: `backend/features/giftcards` exists; add endpoints to create, redeem, and check balance.
- Frontend: Add gift card purchase UI and redemption input in checkout.
- Tasks:
  - Implement `POST /api/giftcards/purchase`, `POST /api/giftcards/redeem`.
  - Frontend UI for purchasing (generate code) and applying gift card on checkout.
- Acceptance:
  - Users can purchase a gift card and redeem it at checkout reducing order total.

---

## 5. Inventory Low-stock Alerts & Admin View (Medium priority)
- Description: API to list low-stock items and admin dashboard view with quick restock action.
- Backend: `backend/features/admin/inventoryController.js` already has `lowStock` and `report` — expose these and add an endpoint to mark restocked.
- Frontend: Admin view to list low-stock products and trigger restock action.
- Tasks:
  - Ensure `GET /api/admin/inventory/low-stock` is available.
  - Add Admin UI panel to view and export low-stock items.
- Acceptance:
  - Admin sees low-stock items filtered by threshold and can mark items as restocked.

---

## 6. Wishlist Public Share (Completed)
- Description: Public, read-only wishlist view by token.
- Status: `Frontend/src/pages/WishlistShare.tsx` and `backend/features/wishlists` already provide this.
- Acceptance: Public link shows product cards and continues shopping CTA.

---

## 7. Product Visual & Semantic Search (Medium priority)
- Description: Improve search with smarter suggestions and visual search placeholder.
- Backend: `productController` already has `suggest` and `visualSearch` stubs — add a semantic suggestion layer and optional integration to vector search.
- Frontend: Enhance search bar with typeahead and fuzzy matching.
- Tasks:
  - Hook an external vector search or a fuzzy matcher for better suggestions.
  - Add typeahead UI with keyboard support.
- Acceptance:
  - Suggestions show useful matches for partial/typo queries.

---

## 8. One-Click / Express Checkout (Hard)
- Description: Allow returning customers to place an order with one click using saved address/payment methods.
- Backend: orders + payments storage and tokenized payment integration.
- Frontend: Add "Buy Now" button saving default address/payment and skipping multi-step checkout.
- Acceptance:
  - Returning user can complete a purchase with a single button click (subject to payment provider constraints).

---

## 9. Loyalty & Rewards Program (Medium)
- Description: Points earned per purchase, redeemable for discounts.
- Tasks:
  - Add `points` to user model, APIs to earn and redeem, frontend account UI to display balance.
- Acceptance:
  - Points reflect transactions and can apply as partial payment.

---

## Quick Implementation Plan (first 2 sprints)
- Sprint 1 (2 weeks):
  - Implement Product Recommendations endpoint + ProductDetail UI.
  - Improve Abandoned Cart worker endpoints and basic Admin UI for manual sends.
- Sprint 2 (2 weeks):
  - Coupon validation API + Checkout UI integration.
  - Gift card purchase/redeem endpoints + basic frontend flow.

---

## Implementation Notes / Conventions
- Keep API routes under `/api` and follow existing controllers structure.
- Reuse existing models (Product, Offer, GiftCard, AbandonedCart) and add minimal schema changes only when necessary.
- Use `react-query` hooks for frontend data fetching to match existing patterns.
- Prefer server-side operations (coupon validation, recommendations aggregation) to keep frontend lightweight.

---

## Next steps
- Choose top 2 features to start (recommended: Personalized Recommendations + Abandoned Cart improvements).
- I can generate PRs with the backend + frontend changes for the selected features.


