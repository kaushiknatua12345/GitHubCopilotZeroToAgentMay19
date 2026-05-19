# PRD: OctoCAT Supply — Amazon Counterattack

**Date**: 2026-03-10
**Status**: Draft
**Author**: ProductManager Agent
**Priority**: P0 (Existential — the business cannot transact without Feature 1)

---

## Executive Summary

OctoCAT Supply is a cat-themed supply chain management platform with 12 AI-powered smart products, a polished React storefront, and a fully functional backend API across 8 entities. Despite this, the application **cannot complete a single sale**. The "Proceed To Checkout" button in `Cart.tsx` has no `onClick` handler — it is a decorative element. Cart state lives in `useState` and evaporates on page refresh. There is no product search beyond basic substring matching, no order history, no reviews, and no wishlist.

Amazon dominates e-commerce with $6.88T in global market share backing, powered by 1-click checkout, Prime delivery, AI recommendations, and social proof via reviews. OctoCAT Supply's counterattack does not require matching Amazon feature-for-feature. It requires **completing the purchase funnel** (P0), then layering discovery, retention, and social proof features that exploit our niche advantage: cat content is internet gold.

This PRD defines 5 features across 5 epics that transform OctoCAT Supply from a broken demo into a transactional e-commerce platform capable of competing in the $12B+ pet tech vertical.

---

## Problem Statement

### The Conversion Cliff

Users browse 12 cat-tech products, add items to cart, see an order summary with subtotal/discount/shipping calculations — and then hit a wall. The "Proceed To Checkout" button in the order summary panel (`Cart.tsx`, line ~175) renders as:

```tsx
<button className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold text-lg transition-colors">
  Proceed To Checkout
</button>
```

No `onClick`. No navigation. No API call. **100% of purchase intent is destroyed.**

### Backend-Frontend Disconnect

The Express API serves full CRUD for `Order`, `OrderDetail`, `Delivery`, `OrderDetailDelivery`, `Branch`, `Headquarters`, `Supplier`, and `Product` — 8 entities with Swagger-documented endpoints registered in `index.ts`. The frontend surfaces exactly **1 entity** (Products) and a broken Cart. The `api/config.ts` file defines endpoints for all 8 entities (`orders`, `orderDetails`, `deliveries`, etc.) but none beyond `products` are consumed by any frontend component.

### Discovery Failure

Product search uses `String.prototype.includes()` — no fuzzy matching, no category filtering, no sorting. With 12 products this is tolerable; at 50+ products, users cannot find what they need.

### Zero Retention Mechanics

- No order history (users can't see what they bought)
- No reviews (no social proof to drive conversion)
- No wishlist (no reason to return)
- Cart is ephemeral (`useState` in `CartContext.tsx` — lost on refresh, lost on tab close)

### Competitive Data

| Capability | Amazon | OctoCAT Supply |
|---|---|---|
| Working checkout | Yes (1-click) | **No** |
| Search & filter | AI-powered | Substring only |
| Order history | Full tracking | **None** |
| Reviews & ratings | 300M+ reviews | **None** |
| Wishlist | Yes | **None** |
| Cart persistence | Yes (account-tied) | **No (useState)** |

---

## Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Enable transactions | Cart-to-order conversion rate | >0% (currently 0%) |
| Reduce bounce at checkout | Checkout abandonment rate | <40% |
| Improve product discovery | Search usage rate | >30% of sessions |
| Drive repeat visits | Users viewing order history | >20% of logged-in users |
| Build social proof | Products with ≥1 review | >50% of catalog |
| Increase engagement | Wishlist adoption rate | >15% of logged-in users |

---

## User Stories

### Personas

| Persona | Role | Key Need |
|---------|------|----------|
| **Whiskers** | Purchasing Manager (B2B) | Place bulk orders, track delivery status |
| **Clawdia** | Admin (`@github.com` email) | Manage catalog, view all orders |
| **Mittens** | Casual Shopper (B2C) | Browse, buy, review, save for later |

---

### Epic 1: Working Checkout Flow (P0)

> **The purchase funnel is broken at the final stage. Nothing else matters until this is fixed.**

The existing `CartContext` provides `items`, `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart`. The backend `Order` model has `orderId`, `branchId`, `orderDate`, `name`, `description`, `status` (enum: pending/processing/shipped/delivered/cancelled). The `OrderDetail` model has `orderDetailId`, `orderId`, `productId`, `quantity`, `unitPrice`, `notes`. Both have full CRUD APIs at `/api/orders` and `/api/order-details`.

#### Story 1.1: Checkout Page Navigation

**As a** shopper (Mittens/Whiskers)
**I want** the "Proceed To Checkout" button to navigate me to a checkout page
**So that** I can review my order and provide shipping details before purchasing

**Acceptance Criteria:**
- [ ] The "Proceed To Checkout" button in `Cart.tsx` has an `onClick` handler that navigates to `/checkout`
- [ ] A new route `/checkout` is registered in `App.tsx` following the existing route pattern
- [ ] The checkout page displays all cart items with quantities, unit prices, and line totals
- [ ] The checkout page shows the same subtotal/discount/shipping/grand total calculations as the cart summary
- [ ] If the cart is empty, the checkout page redirects to `/products`

**Edge Cases:**
- User navigates directly to `/checkout` with empty cart → redirect to `/products`
- User modifies cart in another tab → checkout page reflects current `CartContext` state (React context is shared)

#### Story 1.2: Shipping Information Form

**As a** shopper
**I want** to enter my name, email, and shipping address on the checkout page
**So that** the order has the required fulfillment information

**Acceptance Criteria:**
- [ ] Checkout page includes a form with fields: full name, email, address line 1, address line 2 (optional), city, state/province, postal code
- [ ] All required fields show validation errors on blur and on submit attempt
- [ ] Email field validates format (contains `@` and domain)
- [ ] Form supports dark mode via `useTheme()` hook and Tailwind `dark:` classes
- [ ] Form state is local `useState` (no persistence requirement for MVP)

**Edge Cases:**
- User is logged in → pre-fill email from auth context (currently `AuthContext` doesn't store email; see Open Questions)

#### Story 1.3: Order Submission

**As a** shopper
**I want** to submit my order and have it created via the API
**So that** my purchase is recorded in the system

**Acceptance Criteria:**
- [ ] Clicking "Place Order" sends a `POST /api/orders` request with: auto-generated `orderId` (max existing ID + 1), `branchId: 1` (default), `orderDate` (ISO string), `name` (customer name from form), `description` (summary string), `status: "pending"`
- [ ] For each cart item, a `POST /api/order-details` request is sent with: auto-generated `orderDetailId`, the new `orderId`, `productId`, `quantity`, `unitPrice` (effective price after discount), `notes: ""`
- [ ] API calls use axios and the endpoints from `api/config.ts` (`api.endpoints.orders`, `api.endpoints.orderDetails`)
- [ ] On success, `clearCart()` is called from `CartContext`
- [ ] On success, user is navigated to `/order-confirmation/:orderId`
- [ ] On API failure, an error message is displayed without clearing the cart
- [ ] The "Place Order" button shows a loading/disabled state during submission

**Edge Cases:**
- Network failure during order detail creation (partial order) → display error, do not clear cart (user can retry)
- Concurrent submission (double-click) → disable button on first click

#### Story 1.4: Order Confirmation Page

**As a** shopper
**I want** to see a confirmation page after placing my order
**So that** I know my purchase was successful and have a reference number

**Acceptance Criteria:**
- [ ] A new route `/order-confirmation/:orderId` is registered in `App.tsx`
- [ ] The page fetches the order via `GET /api/orders/:id` and its details via `GET /api/order-details` (filtered client-side by `orderId`)
- [ ] Displays: order ID, order date, status, list of items with quantities and prices, grand total
- [ ] Includes a "Continue Shopping" link to `/products`
- [ ] Supports dark mode
- [ ] If order not found (invalid ID), shows a "Order not found" message with link to `/products`

**Edge Cases:**
- User bookmarks confirmation page and returns later → page still works (data is in-memory on server, resets on restart — acceptable for demo)

#### Story 1.5: Cart Persistence (localStorage)

**As a** shopper
**I want** my cart to survive page refreshes
**So that** I don't lose my selections when I accidentally close a tab

**Acceptance Criteria:**
- [ ] `CartContext` initializes `items` from `localStorage` key `octocat-cart` if present
- [ ] Every change to `items` state is synced to `localStorage` via `useEffect`
- [ ] `clearCart()` also removes the `localStorage` entry
- [ ] Cart data is JSON-serialized as `CartItem[]`

**Edge Cases:**
- Corrupted localStorage data → catch JSON parse error, initialize with empty array, clear bad data
- Storage quota exceeded → silently fail on write (cart still works in-memory)

---

### Epic 2: Product Search & Filtering (P1)

> **With 12 products, basic search is survivable. At scale, it's a dead end.**

Currently, `Products.tsx` filters using `product.name.toLowerCase().includes(searchTerm.toLowerCase())` on name and description fields. No fuzzy matching, no category filters, no sort options.

#### Story 2.1: Fuzzy Search with Fuse.js

**As a** shopper
**I want** search to tolerate typos and partial matches
**So that** I can find products even when I don't remember the exact name

**Acceptance Criteria:**
- [ ] `fuse.js` is added as a dependency to the `frontend` workspace
- [ ] The existing `searchTerm` state and input in `Products.tsx` is preserved
- [ ] Search uses Fuse.js with keys `['name', 'description']` and a threshold of `0.4`
- [ ] Results update as the user types (debounced at 200ms)
- [ ] Empty search term shows all products (current behavior preserved)
- [ ] Fuse index is created once when `products` data loads, not on every render

**Edge Cases:**
- Search term matches zero products → show "No products found" message with a "Clear search" link
- Very short search terms (1-2 chars) → fall back to includes-based filtering to avoid noisy fuzzy results

#### Story 2.2: Category Filter Sidebar

**As a** shopper
**I want** to filter products by category
**So that** I can narrow down the catalog to what I'm looking for

**Acceptance Criteria:**
- [ ] A filter sidebar (collapsible on mobile) appears to the left of the product grid
- [ ] Categories are derived from product data — for MVP, derive from a keyword mapping (e.g., "Feeding", "Grooming", "Entertainment", "Tracking", "Accessories") since the `Product` model has no `category` field
- [ ] Each category shows a count of matching products
- [ ] Multiple categories can be selected (OR logic — show products matching any selected category)
- [ ] Category filter combines with search (AND logic — must match both)
- [ ] "Clear Filters" button resets all selections
- [ ] Filter state is stored in URL query params (e.g., `?category=feeding,grooming&q=smart`) for shareability

**Edge Cases:**
- No products match combined search + filter → show "No products found" with clear options
- Category has 0 matching products after search → still show category but grayed out with count 0

#### Story 2.3: Sort Options

**As a** shopper
**I want** to sort products by price or name
**So that** I can find the best deals or browse alphabetically

**Acceptance Criteria:**
- [ ] A sort dropdown appears above the product grid with options: "Featured" (default seed order), "Price: Low to High", "Price: High to Low", "Name: A-Z", "Name: Z-A"
- [ ] Sort applies after search and filter
- [ ] Price sort uses effective price (after discount) — calculated as `price * (1 - (discount || 0))`
- [ ] Sort state is included in URL query params (e.g., `&sort=price-asc`)

**Edge Cases:**
- Products with same effective price → maintain stable sort (preserve relative order)

---

### Epic 3: Order History & Tracking (P1)

> **The backend Order and OrderDetail APIs already exist. The frontend just ignores them.**

The API serves `GET /api/orders`, `GET /api/orders/:id`, `GET /api/order-details`. The `Order` model includes `status` with enum values: `pending`, `processing`, `shipped`, `delivered`, `cancelled`. The frontend `api/config.ts` already defines `api.endpoints.orders` and `api.endpoints.orderDetails`.

#### Story 3.1: Order History Page

**As a** logged-in shopper (Mittens/Whiskers)
**I want** to see a list of my past orders
**So that** I can track what I've purchased and check order status

**Acceptance Criteria:**
- [ ] A new route `/orders` is registered in `App.tsx`
- [ ] Navigation component includes an "Orders" link (visible only when `isLoggedIn` from `useAuth()`)
- [ ] Page fetches all orders via `GET /api/orders` using `useQuery('orders', fetchFn)` pattern
- [ ] Orders are displayed in a table/card list with: Order ID, Date, Status (with color-coded badge), Total Amount, number of items
- [ ] Each order row/card links to `/orders/:orderId` for detail view
- [ ] Orders are sorted by date descending (most recent first)
- [ ] Supports dark mode

**Edge Cases:**
- No orders exist → show "No orders yet" with link to `/products`
- User not logged in → redirect to `/login` (or show login prompt)

**Note:** Since auth is mock-only and there's no user ID on orders, MVP shows ALL orders. See Open Questions for user-scoping.

#### Story 3.2: Order Detail Page

**As a** logged-in shopper
**I want** to see the full details of a specific order
**So that** I can review exactly what I ordered and the current status

**Acceptance Criteria:**
- [ ] A new route `/orders/:orderId` is registered in `App.tsx`
- [ ] Page fetches the order via `GET /api/orders/:id` and order details via `GET /api/order-details` (filtered client-side by `orderId`)
- [ ] Displays: order ID, date, status badge, customer name, description
- [ ] Shows a line-item table with: product name (looked up from products API or stored in notes), quantity, unit price, line total
- [ ] Shows a summary section with subtotal and grand total
- [ ] Status is displayed as a visual progress indicator (e.g., stepper: Pending → Processing → Shipped → Delivered)
- [ ] "Back to Orders" link returns to `/orders`

**Edge Cases:**
- Order not found (404) → show "Order not found" message
- Order has been cancelled → show status as "Cancelled" in red, skip progress stepper

#### Story 3.3: Order Status Update (Admin)

**As an** admin (Clawdia)
**I want** to update the status of an order
**So that** customers can see their order progress

**Acceptance Criteria:**
- [ ] On the order detail page, if `isAdmin` is true (from `useAuth()`), a status dropdown appears
- [ ] Dropdown includes all valid statuses: pending, processing, shipped, delivered, cancelled
- [ ] Changing status sends `PUT /api/orders/:id` with the updated order object
- [ ] Success shows a toast/notification confirming the update
- [ ] The status badge and progress stepper update immediately

**Edge Cases:**
- Attempting to change status of a "delivered" order to "pending" → allowed (no backend validation in current API)
- API failure → show error message, revert dropdown to previous value

---

### Epic 4: Product Reviews & Ratings (P2)

> **Social proof is the #1 driver of e-commerce conversion after price. Amazon has 300M+ reviews. We have zero.**

This requires a new `Review` model and API route. The route should follow the canonical pattern established in `branch.ts`: Swagger JSDoc block → import model + seed data → `express.Router()` → standard CRUD → `resetData()` export → default export.

#### Story 4.1: Review Model & API

**As a** developer
**I want** a Review entity with full CRUD API
**So that** the frontend can create and display product reviews

**Acceptance Criteria:**
- [ ] New model file `api/src/models/review.ts` with interface: `reviewId: number`, `productId: number`, `author: string`, `rating: number` (1-5), `title: string`, `body: string`, `createdAt: string`, `helpful: number`
- [ ] Interface has JSDoc Swagger annotations matching the pattern in existing models (e.g., `product.ts`)
- [ ] New route file `api/src/routes/review.ts` following the `branch.ts` canonical pattern
- [ ] Route mounted at `/api/reviews` in `index.ts`
- [ ] Additional endpoint: `GET /api/reviews?productId=:id` — filters reviews by product ID (query param)
- [ ] Seed data includes 3-5 sample reviews across different products in `seedData.ts`
- [ ] `api/config.ts` in frontend adds `reviews: '/api/reviews'` to endpoints
- [ ] Route exports `resetData()` for test isolation
- [ ] Test file `review.test.ts` collocated with route file

**Edge Cases:**
- Rating outside 1-5 range → API should accept (no backend validation in current pattern); frontend validates
- Review for non-existent productId → API accepts (consistent with other routes)

#### Story 4.2: Star Ratings on Product Cards

**As a** shopper (Mittens)
**I want** to see average star ratings on product cards
**So that** I can quickly gauge product quality while browsing

**Acceptance Criteria:**
- [ ] Each product card in `Products.tsx` displays an average star rating (1-5, with half-star precision)
- [ ] Star count shows number of reviews (e.g., "★★★★☆ (12)")
- [ ] Reviews are fetched once via `useQuery('reviews', fetchAllReviews)` and grouped by `productId` client-side
- [ ] Products with zero reviews show "No reviews yet" in muted text
- [ ] Stars use the primary color (`#76B852`) for filled and gray for empty

**Edge Cases:**
- Product with 1 review → show exact rating, no half-star rounding needed
- API failure fetching reviews → product cards render without ratings (graceful degradation)

#### Story 4.3: Review Submission Form

**As a** logged-in shopper
**I want** to write a review for a product I've browsed
**So that** I can share my opinion and help other cat lovers

**Acceptance Criteria:**
- [ ] A "Write a Review" button appears on the product modal/detail view (visible only when `isLoggedIn`)
- [ ] Review form includes: star rating selector (1-5, clickable stars), title (text input, required), body (textarea, required), author name (pre-filled with "Anonymous" or user identifier)
- [ ] Submitting sends `POST /api/reviews` with auto-generated `reviewId`, `productId`, `author`, `rating`, `title`, `body`, `createdAt` (ISO), `helpful: 0`
- [ ] On success, the review appears immediately (invalidate `reviews` query cache via react-query)
- [ ] On failure, show error without losing form content

**Edge Cases:**
- User submits multiple reviews for the same product → allowed (no uniqueness constraint in current API pattern)
- Very long review body → no length limit for MVP

#### Story 4.4: Reviews List on Product Detail

**As a** shopper
**I want** to read all reviews for a product
**So that** I can make an informed purchase decision

**Acceptance Criteria:**
- [ ] The product modal (or a new product detail page) shows a reviews section below the product details
- [ ] Reviews are sorted by `createdAt` descending (most recent first)
- [ ] Each review shows: star rating, title (bold), author, date (formatted), body text
- [ ] A "Helpful" button increments the `helpful` count via `PUT /api/reviews/:id`
- [ ] Reviews section shows an aggregate summary: average rating, total review count, rating distribution (5-star bar chart)

**Edge Cases:**
- Product with 0 reviews → show "Be the first to review this product!" prompt
- Review body contains very long text → truncate at 300 chars with "Read more" toggle

---

### Epic 5: Wishlist / Save for Later (P2)

> **Engagement driver. Give users a reason to come back. Follow the `CartContext` pattern exactly.**

#### Story 5.1: Wishlist Context & Persistence

**As a** developer
**I want** a WishlistContext following the CartContext pattern
**So that** wishlist state is available app-wide and persisted

**Acceptance Criteria:**
- [ ] New file `frontend/src/context/WishlistContext.tsx` following the exact pattern of `CartContext.tsx`
- [ ] Interface `WishlistItem`: `productId: number`, `name: string`, `price: number`, `imgName: string`, `discount?: number`, `addedAt: string`
- [ ] Context provides: `items`, `addToWishlist(item)`, `removeFromWishlist(productId)`, `isInWishlist(productId): boolean`, `totalItems`
- [ ] State persisted to `localStorage` key `octocat-wishlist` (same pattern as Epic 1 Story 1.5)
- [ ] `WishlistProvider` wraps the app in `App.tsx` alongside existing providers

**Edge Cases:**
- Adding a product already in wishlist → no-op (deduplicate by `productId`)
- Corrupted localStorage → graceful fallback to empty array

#### Story 5.2: Heart Icon on Product Cards

**As a** shopper (Mittens)
**I want** to click a heart icon on any product card to save it to my wishlist
**So that** I can easily find products I'm interested in later

**Acceptance Criteria:**
- [ ] Each product card in `Products.tsx` shows a heart icon in the top-right corner of the image area
- [ ] Heart is outlined (empty) when not in wishlist, filled (solid) in primary color when in wishlist
- [ ] Clicking the heart toggles wishlist state (add/remove)
- [ ] Heart icon is accessible (`aria-label` describes action: "Add to wishlist" / "Remove from wishlist")
- [ ] Wishlist count appears in the navigation bar (badge, similar to cart count)

**Edge Cases:**
- User not logged in → wishlist still works (localStorage only, no account tie)
- Product removed from catalog → remains in wishlist (stale data acceptable for MVP)

#### Story 5.3: Wishlist Page

**As a** shopper
**I want** to view all my wishlisted products on a dedicated page
**So that** I can review and purchase items I saved

**Acceptance Criteria:**
- [ ] New route `/wishlist` registered in `App.tsx`
- [ ] Page displays wishlisted products in a grid matching the `Products.tsx` card layout
- [ ] Each card includes: product image, name, price (with discount), "Add to Cart" button, "Remove from Wishlist" button
- [ ] "Add to Cart" adds the product with quantity 1 and removes from wishlist
- [ ] Empty wishlist shows "Your wishlist is empty" with link to `/products`
- [ ] Supports dark mode

**Edge Cases:**
- Product price changes in API after being wishlisted → wishlist shows stored price (snapshot at time of add); acceptable for MVP

---

## Technical Considerations

### Architecture Alignment

All changes follow the existing monorepo architecture:

| Layer | Pattern | Reference |
|-------|---------|-----------|
| **API Models** | Interface in `api/src/models/` with JSDoc Swagger annotations | `product.ts`, `order.ts` |
| **API Routes** | Swagger JSDoc → import → Router → CRUD → `resetData()` → default export | `branch.ts` (canonical) |
| **API Registration** | Import in `index.ts`, mount with `app.use('/api/path', router)` | `index.ts` lines 63-70 |
| **Frontend Data Fetching** | `useQuery('key', fetchFn)` with axios + `api.baseURL` + `api.endpoints.*` | `Products.tsx` |
| **Frontend Context** | `createContext` → Provider component → `use*` hook → export | `CartContext.tsx` |
| **Frontend Routing** | `<Route path="..." element={<Component />}` in `App.tsx` | `App.tsx` lines 25-31 |
| **Styling** | Tailwind CSS with `darkMode` conditional classes, primary color `#76B852` | All components |
| **Tests** | Vitest, collocated `*.test.ts` files | `branch.test.ts`, `product.test.ts` |

### New Dependencies

| Package | Workspace | Purpose | Size |
|---------|-----------|---------|------|
| `fuse.js` | frontend | Fuzzy search (Epic 2) | ~25KB gzipped |

No other new dependencies required. All features build on existing libraries (react-query, axios, react-router-dom, Tailwind CSS).

### API Surface Changes

| Method | Endpoint | Epic | Notes |
|--------|----------|------|-------|
| `GET` | `/api/reviews` | 4 | New; supports `?productId=` query param |
| `POST` | `/api/reviews` | 4 | New |
| `GET` | `/api/reviews/:id` | 4 | New |
| `PUT` | `/api/reviews/:id` | 4 | New (for helpful count) |
| `DELETE` | `/api/reviews/:id` | 4 | New |

Existing endpoints used by new features (no changes needed):
- `POST /api/orders` — Epic 1 (checkout)
- `POST /api/order-details` — Epic 1 (checkout)
- `GET /api/orders` — Epic 3 (order history)
- `GET /api/orders/:id` — Epic 1, 3 (confirmation, detail)
- `GET /api/order-details` — Epic 1, 3 (confirmation, detail)

### New Frontend Routes

| Path | Component | Epic |
|------|-----------|------|
| `/checkout` | `Checkout.tsx` | 1 |
| `/order-confirmation/:orderId` | `OrderConfirmation.tsx` | 1 |
| `/orders` | `OrderHistory.tsx` | 3 |
| `/orders/:orderId` | `OrderDetail.tsx` | 3 |
| `/wishlist` | `Wishlist.tsx` | 5 |

### New Frontend Files

| File | Epic | Pattern Based On |
|------|------|-----------------|
| `frontend/src/components/entity/checkout/Checkout.tsx` | 1 | New (form + cart display) |
| `frontend/src/components/entity/checkout/OrderConfirmation.tsx` | 1 | New (data display) |
| `frontend/src/components/entity/order/OrderHistory.tsx` | 3 | `Products.tsx` (list page) |
| `frontend/src/components/entity/order/OrderDetail.tsx` | 3 | New (detail page) |
| `frontend/src/components/entity/product/ReviewForm.tsx` | 4 | `ProductForm.tsx` (form) |
| `frontend/src/components/entity/product/ReviewList.tsx` | 4 | New (list display) |
| `frontend/src/components/entity/wishlist/Wishlist.tsx` | 5 | `Products.tsx` (card grid) |
| `frontend/src/context/WishlistContext.tsx` | 5 | `CartContext.tsx` (exact pattern) |
| `api/src/models/review.ts` | 4 | `product.ts` (model pattern) |
| `api/src/routes/review.ts` | 4 | `branch.ts` (canonical route) |
| `api/src/routes/review.test.ts` | 4 | `branch.test.ts` (test pattern) |

### Data Model Note

The `Order` model interface has `name`, `description`, and `status` but no `totalAmount` field (despite it appearing in the Swagger schema comment). Checkout must either:
- (a) Add `totalAmount` to the `Order` interface and seed data, or
- (b) Calculate total client-side from `OrderDetail` records

Recommendation: Option (a) — add `totalAmount: number` to the `Order` interface for consistency with the Swagger doc.

---

## Dependencies & Risks

| Item | Type | Impact | Mitigation |
|------|------|--------|-----------|
| In-memory data store (no database) | Architectural Constraint | All data resets on API restart; orders, reviews, wishlist (server-side) are lost | Acceptable for demo; `localStorage` covers cart/wishlist on client side |
| Mock auth (no real user identity) | Architectural Constraint | Cannot scope orders to a specific user; order history shows ALL orders | Accept for MVP; add user ID to Order model in future iteration |
| No `totalAmount` on Order interface | Data Model Gap | Mismatch between Swagger doc and TypeScript interface | Add field to interface + seed data as part of Epic 1 |
| No `category` field on Product model | Data Model Gap | Category filtering requires keyword-based mapping rather than structured data | Use hardcoded keyword mapping for MVP; add category field later |
| No `email` stored in AuthContext | Auth Gap | Cannot pre-fill checkout email from logged-in state | Either add `email` to AuthContext state, or leave blank |
| Cart has no server-side persistence | Architectural Constraint | Cart tied to single browser; no cross-device sync | `localStorage` covers single-device persistence; acceptable for demo |
| Seed data has only 12 products | Data Limitation | Search/filter features may seem overengineered | Features are forward-looking for catalog growth |
| No input validation on API routes | Security Risk | Malformed data accepted by all POST/PUT endpoints | Out of scope for this PRD; tracked as tech debt |

---

## Out of Scope

The following are explicitly **NOT** included in this spec:

- **Payment processing** — No real payment gateway integration. Checkout creates an order record; payment is assumed complete.
- **Real authentication** — Auth remains mock-only (`@github.com` = admin). No JWT, OAuth, or session management.
- **Database persistence** — Backend continues using in-memory arrays from `seedData.ts`. No database, ORM, or migration system.
- **Email notifications** — No order confirmation emails, shipping updates, or review notifications.
- **Inventory management** — No stock level enforcement at checkout. `Product.stockLevel` exists in Swagger schema but not in the TypeScript interface.
- **Recommendation engine** — No "You might also like" or "Customers also bought" features.
- **Multi-currency / i18n** — All prices in USD, all text in English.
- **Mobile app** — Web only (responsive design via Tailwind is in scope).
- **B2B order workflow** — No approval chains, purchase orders, or multi-branch ordering.
- **API rate limiting / auth middleware** — No backend protection against abuse.
- **Performance optimization** — No lazy loading, code splitting, or image optimization beyond current state.

---

## Open Questions

- [ ] **Order-User association:** Should we add a `userId` or `email` field to the `Order` model to scope order history per user? Current mock auth doesn't persist user identity across sessions.
- [ ] **AuthContext email storage:** Should `AuthContext` store the login email so checkout can pre-fill it? Currently only stores `isLoggedIn: boolean` and `isAdmin: boolean`.
- [ ] **Product categories:** Should we add a `category: string` field to the `Product` model and seed data, or use the keyword-mapping approach for MVP?
- [ ] **Order totalAmount:** Confirm approach — add `totalAmount` to `Order` interface (aligning with Swagger), or calculate dynamically from `OrderDetail` sum?
- [ ] **Review moderation:** Should admin (Clawdia) have the ability to delete reviews? The CRUD API supports it, but should the UI expose it?
- [ ] **Coupon system:** The cart currently has a coupon code input with a fake "applied" state. Should Epic 1 make this functional or remove it? (Currently out of scope.)
- [ ] **Cart "Update Cart" button:** `Cart.tsx` has an "Update Cart" button with an empty `onClick` handler (comment: "Force re-render"). Should this be removed or given functionality?

---

## RICE Scoring

### Epic 1: Working Checkout Flow

| Factor | Score | Rationale |
|--------|-------|-----------|
| Reach | **10** | Every single user who adds items to cart (100% of purchase-intent users) |
| Impact | **3** | Massive — unlocks the ability to transact at all. Without this, the app is a catalog, not a store |
| Confidence | **95%** | Backend APIs exist, cart context exists, the gap is well-understood and purely frontend wiring |
| Effort | **2 person-weeks** | 1 new page (checkout), 1 new page (confirmation), localStorage integration, button wiring |
| **RICE Score** | **14.25** | (10 × 3 × 0.95) / 2 |

### Epic 2: Product Search & Filtering

| Factor | Score | Rationale |
|--------|-------|-----------|
| Reach | **8** | Most users browse products; search becomes critical as catalog grows |
| Impact | **2** | High — directly improves product discovery and reduces friction |
| Confidence | **85%** | Fuse.js is well-proven; category mapping requires design decisions on classification |
| Effort | **1.5 person-weeks** | Fuse.js integration, filter sidebar component, sort dropdown, URL param sync |
| **RICE Score** | **9.07** | (8 × 2 × 0.85) / 1.5 |

### Epic 3: Order History & Tracking

| Factor | Score | Rationale |
|--------|-------|-----------|
| Reach | **6** | Only logged-in users who have placed orders (depends on Epic 1 shipping first) |
| Impact | **2** | High — table-stakes for e-commerce retention; users expect to see past orders |
| Confidence | **90%** | Backend API is complete; frontend is straightforward data display |
| Effort | **1.5 person-weeks** | 2 new pages, status stepper component, admin status update |
| **RICE Score** | **7.20** | (6 × 2 × 0.90) / 1.5 |

### Epic 4: Product Reviews & Ratings

| Factor | Score | Rationale |
|--------|-------|-----------|
| Reach | **7** | All shoppers see ratings; subset write reviews |
| Impact | **2** | High — social proof is proven to increase conversion 15-30% in e-commerce |
| Confidence | **80%** | New model + route required; follows established patterns but more moving parts |
| Effort | **2.5 person-weeks** | New model, route, seed data, test file, 3 frontend components, star rating widget |
| **RICE Score** | **4.48** | (7 × 2 × 0.80) / 2.5 |

### Epic 5: Wishlist / Save for Later

| Factor | Score | Rationale |
|--------|-------|-----------|
| Reach | **5** | Logged-in users who browse but aren't ready to buy |
| Impact | **1** | Medium — engagement driver, not a conversion requirement |
| Confidence | **90%** | Direct copy of CartContext pattern; well-understood implementation |
| Effort | **1 person-week** | New context (copy pattern), heart icon, wishlist page |
| **RICE Score** | **4.50** | (5 × 1 × 0.90) / 1 |

### Priority Summary

| Rank | Epic | RICE Score | Priority |
|------|------|-----------|----------|
| 1 | Working Checkout Flow | **14.25** | P0 |
| 2 | Product Search & Filtering | **9.07** | P1 |
| 3 | Order History & Tracking | **7.20** | P1 |
| 4 | Wishlist / Save for Later | **4.50** | P2 |
| 5 | Product Reviews & Ratings | **4.48** | P2 |

**Total estimated effort: ~8.5 person-weeks**

---

*"The future is not set. There is no fate but what we code." — This spec is that future. Build it.*
