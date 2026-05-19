# PRD: Product Search & Filtering

**Date**: March 10, 2026
**Status**: Draft
**Author**: ProductManager Agent
**Priority**: P1

---

## Executive Summary

OctoCAT Supply's product catalog currently offers only a basic text search that performs exact substring matching on product name and description. As the catalog grows beyond the current 12 items, users need richer discovery tools — fuzzy search that tolerates typos, category-based browsing, price range filtering, and sort controls. This feature replaces the existing search input with a full-featured search and filtering experience, making it faster for buyers to find the right cat-tech products and increasing engagement with the catalog.

## Problem Statement

The current Products page (`frontend/src/components/entity/product/Products.tsx`) uses a simple `String.includes()` filter on `name` and `description`. This approach has several shortcomings:

1. **No typo tolerance** — Searching "smart feder" returns zero results for "SmartFeeder One."
2. **No category browsing** — Users browsing for "all tracking products" must scroll through the entire grid. The `Product` model has no `category` field.
3. **No price filtering** — Products range from $49.99 (SnackVault Puzzle Dispenser) to $199.99 (AutoClean Litter Dome), but there is no way to narrow by budget.
4. **No sorting** — Products render in seed-data insertion order with no user control.
5. **No filter state visibility** — Users have no way to see what filters are active or clear them.

These gaps degrade the browsing experience for any catalog larger than a handful of items and do not reflect real-world e-commerce expectations.

## Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Improve product discoverability | % of searches returning ≥1 result (fuzzy) | ≥ 95% of non-empty queries |
| Enable category browsing | Users can filter by any of the defined categories | 6 categories available at launch |
| Support price-aware shopping | Users can filter by min/max price | Full $0–$250 range supported |
| Give users sort control | Sort options available and functional | 5 sort modes (see below) |
| Maintain clean UX | Active filters visible with clear/reset controls | Active filter bar always visible when filters applied |
| No performance regression | Product page load time | ≤ 500ms first render on localhost |

---

## User Stories

### Epic 1: Enhanced Fuzzy Search

#### Story 1.1: Fuzzy Search on Products
**As a** catalog browser
**I want** the search box to handle typos and partial matches
**So that** I can find products even when I don't know the exact name

**Acceptance Criteria:**
- [ ] Searching "smart feder" returns "SmartFeeder One" as the top result
- [ ] Searching "litter" returns "AutoClean Litter Dome"
- [ ] Search matches against both `name` and `description` fields
- [ ] Results are ranked by relevance score (best match first)
- [ ] Empty search term shows all products (no filter applied)
- [ ] Search is debounced (≥ 200ms) to avoid excessive re-renders
- [ ] Search input retains the existing search icon and styling from the current implementation

**Edge Cases:**
- Single-character queries return no fuzzy results (minimum 2 characters for fuzzy matching; 1-char falls back to exact `includes()`)
- Special characters in the search term do not cause errors
- Search term with only whitespace is treated as empty

---

### Epic 2: Category Filtering

#### Story 2.1: Add Category Field to Product Model
**As a** developer
**I want** a `category` field on the Product model
**So that** products can be categorized for filtering

**Acceptance Criteria:**
- [ ] `Product` interface in `api/src/models/product.ts` includes a required `category` field of type `string`
- [ ] Swagger JSDoc annotation for the `Product` schema includes the new `category` property
- [ ] All 12 seed products in `api/src/seedData.ts` have a `category` value assigned
- [ ] Frontend `Product` interface in `Products.tsx` includes the `category` field
- [ ] Existing API tests in `api/src/routes/product.test.ts` continue to pass
- [ ] `GET /api/products` response includes the `category` field

**Seed Data Category Assignments:**

| productId | Product Name | Category |
|-----------|-------------|----------|
| 1 | SmartFeeder One | Feeders & Hydration |
| 2 | AutoClean Litter Dome | Hygiene & Grooming |
| 3 | CatFlix Entertainment Portal | Toys & Entertainment |
| 4 | PawTrack Smart Collar | Tracking & Monitoring |
| 5 | SleepNest ThermoPod | Furniture & Comfort |
| 6 | ClawMate Auto Groomer | Hygiene & Grooming |
| 7 | Smart Fountain Flow+ | Feeders & Hydration |
| 8 | ScratchPad Pro | Furniture & Comfort |
| 9 | ChirpCam Window Mount | Tracking & Monitoring |
| 10 | SnackVault Puzzle Dispenser | Toys & Entertainment |
| 11 | DoorDash Pet Portal | Smart Home |
| 12 | ZoomieTracker AI Mat | Tracking & Monitoring |

#### Story 2.2: Category Filter UI
**As a** catalog browser
**I want** to filter products by category using clickable chips
**So that** I can quickly narrow down to the type of product I need

**Acceptance Criteria:**
- [ ] Category filter chips are displayed above the product grid, below the search bar
- [ ] Chips show all categories derived from the loaded product data (not hardcoded)
- [ ] Clicking a chip toggles it as active (highlighted with primary color `#76B852`)
- [ ] Multiple categories can be selected simultaneously (OR logic — show products in any selected category)
- [ ] Selecting no chips shows all products (no category filter applied)
- [ ] Chips support dark mode via Tailwind `dark:` classes and `useTheme()` hook
- [ ] Each chip displays the count of matching products (e.g., "Tracking & Monitoring (3)")

**Edge Cases:**
- If all products are filtered out by other filters (price, search), category counts reflect the combined filter state
- Categories with zero products after other filters are still shown but visually dimmed

---

### Epic 3: Sort Controls

#### Story 3.1: Sort Dropdown
**As a** catalog browser
**I want** to sort products by price or name
**So that** I can browse in my preferred order

**Acceptance Criteria:**
- [ ] A sort dropdown is displayed in the filter toolbar area (near search bar)
- [ ] Sort options include:
  - Price: Low to High
  - Price: High to Low
  - Name: A–Z
  - Name: Z–A
  - Default (seed data order)
- [ ] Sorting applies to the already-filtered result set (search + category + price filters applied first)
- [ ] Default sort is "Default" (insertion order) on page load
- [ ] Sorting is performed client-side on the filtered product array
- [ ] Price sorting uses the effective price (i.e., `price * (1 - discount)` when a discount exists)
- [ ] Dropdown supports dark mode styling

**Edge Cases:**
- Products with identical prices maintain stable relative order
- Products with identical names maintain stable relative order

---

### Epic 4: Price Range Filter

#### Story 4.1: Price Range Inputs
**As a** budget-conscious shopper
**I want** to set a minimum and maximum price to filter products
**So that** I only see products within my budget

**Acceptance Criteria:**
- [ ] Two number inputs (Min Price, Max Price) are displayed in the filter toolbar
- [ ] Inputs default to empty (no price filter applied)
- [ ] Entering a min price filters out products with effective price below the min
- [ ] Entering a max price filters out products with effective price above the max
- [ ] Effective price accounts for discounts: `price * (1 - (discount ?? 0))`
- [ ] Inputs accept only non-negative numbers
- [ ] If min > max, display a subtle validation message and apply no price filter
- [ ] Price filter combines with search, category, and sort (all filters are composable)
- [ ] Inputs support dark mode styling

**Edge Cases:**
- Setting min = max shows only products at that exact effective price
- Setting only min (no max) filters from min to infinity
- Setting only max (no min) filters from 0 to max
- Non-numeric input is prevented or ignored

---

### Epic 5: Active Filters Display

#### Story 5.1: Active Filter Bar
**As a** catalog browser
**I want** to see all my active filters and clear them individually or all at once
**So that** I can quickly adjust my search without resetting everything

**Acceptance Criteria:**
- [ ] An "Active Filters" bar appears below the filter controls when any filter is active
- [ ] Each active filter is displayed as a removable tag/chip showing:
  - Search term: `Search: "smart feder"` with × button
  - Each selected category: `Category: Tracking & Monitoring` with × button
  - Price range: `Price: $50 – $150` with × button
  - Sort: `Sort: Price Low to High` with × button (only if not default)
- [ ] Clicking × on a filter tag removes only that filter
- [ ] A "Clear All" button appears when 2+ filters are active
- [ ] Clicking "Clear All" resets all filters to their defaults (empty search, no categories, no price range, default sort)
- [ ] The bar is hidden when no filters are active
- [ ] Supports dark mode styling

**Edge Cases:**
- Clearing the last active filter hides the Active Filters bar
- Clearing a category filter updates category chip states above

---

## Technical Considerations

### Data Model Changes

**File:** `api/src/models/product.ts`

Add `category` to the `Product` interface and Swagger schema:

```typescript
export interface Product {
    productId: number;
    supplierId: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    unit: string;
    imgName: string;
    discount?: number;
    category: string;  // NEW
}
```

The Swagger JSDoc block in the same file must add:
```yaml
category:
  type: string
  description: Product category for filtering (e.g., "Feeders & Hydration")
```

`category` is a required field (not optional) — every product must belong to a category.

### API Changes

| Method | Endpoint | Change | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Response shape | Each product now includes `category` field |
| POST | `/api/products` | Request body | Must include `category` |
| PUT | `/api/products/:id` | Request body | Must include `category` |

No new endpoints are needed. The `GET /api/products` route in `api/src/routes/product.ts` already returns the full product array; adding `category` to the model and seed data is sufficient.

Optional future enhancement: add query parameter support (`GET /api/products?category=Toys+%26+Entertainment`) for server-side filtering. **Not in scope for this PRD** — all filtering is client-side.

### Seed Data Changes

**File:** `api/src/seedData.ts`

Add `category` to each of the 12 product entries. See the category assignment table in Story 2.1.

### Frontend Changes

**New dependency:** `fuse.js` (fuzzy search library, ~5KB gzipped, no sub-dependencies)

Install: `npm install fuse.js --workspace=frontend`

**Files to modify:**

| File | Change |
|------|--------|
| `frontend/src/components/entity/product/Products.tsx` | Replace `String.includes()` filter with Fuse.js; add filter state management; render filter toolbar, category chips, sort dropdown, price inputs, active filters bar |

**Recommended component extraction** (optional, for readability):

| New Component | Purpose |
|---------------|---------|
| `frontend/src/components/entity/product/ProductFilters.tsx` | Filter toolbar: search input, category chips, sort dropdown, price range inputs |
| `frontend/src/components/entity/product/ActiveFilters.tsx` | Active filter tags with clear/clear-all |

These components would live alongside the existing `Products.tsx` and `ProductForm.tsx` in the `product/` directory per project conventions.

### Filter Pipeline (Client-Side)

All filtering and sorting happens in the browser. The pipeline:

```
products (from useQuery)
  → fuzzy search (Fuse.js on name + description)
  → category filter (OR across selected categories)
  → price range filter (min/max on effective price)
  → sort (by selected sort option)
  → render grid
```

### Fuse.js Configuration

```typescript
const fuse = new Fuse(products, {
  keys: ['name', 'description'],
  threshold: 0.4,        // 0 = exact match, 1 = match anything
  includeScore: true,
  minMatchCharLength: 2,
});
```

When `searchTerm` length ≥ 2, use `fuse.search(searchTerm)`. When `searchTerm` length < 2 and > 0, fall back to case-insensitive `includes()` on name + description (current behavior). When empty, skip search filtering entirely.

### State Management

All filter state lives in `Products.tsx` via `useState`:

```typescript
const [searchTerm, setSearchTerm] = useState('');           // existing
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
const [sortOption, setSortOption] = useState<SortOption>('default');
const [minPrice, setMinPrice] = useState<number | ''>('');
const [maxPrice, setMaxPrice] = useState<number | ''>('');
```

No global state (Context) or URL params needed for V1. Filter state resets on page navigation — acceptable for a demo app.

### Dark Mode

All new UI elements must use the `darkMode` boolean from `useTheme()` and apply Tailwind `dark:` variant classes, consistent with the existing pattern in `Products.tsx`:
- Light: `bg-white text-gray-800 border-gray-300`
- Dark: `bg-gray-800 text-light border-gray-700`
- Active/selected: `bg-primary text-white` (primary = `#76B852`)

### Testing Strategy

| Test Type | Scope | Details |
|-----------|-------|--------|
| API unit tests | `api/src/routes/product.test.ts` | Verify `GET /api/products` returns `category` field; verify `POST /api/products` accepts `category` |
| Frontend unit tests | New test file for filter logic | Test fuzzy search integration, category filtering, price range filtering, sort logic as pure functions |
| Manual testing | Products page | Verify all filter combinations, dark mode, responsive layout, edge cases |

---

## Dependencies & Risks

| Item | Type | Impact | Mitigation |
|------|------|--------|------------|
| Fuse.js library | Dependency | New frontend dependency (~5KB gzipped) | Well-maintained, widely used (40K+ GitHub stars), no transitive deps |
| Product model change | Breaking change | All existing product creation (AdminProducts, tests) must include `category` | Update all references in a single PR; `category` is required so compiler catches misses |
| AdminProducts form | Impact | `frontend/src/components/admin/AdminProducts.tsx` must add a `category` field to the product creation/edit form | Include in implementation scope |
| Seed data change | Impact | All 12 products need valid categories | Assign categories in this PRD; implementation is a data-only change |
| Client-side performance | Risk | Fuzzy search on large catalogs could be slow | Acceptable for demo app with 12–100 products; Fuse.js is efficient for this range |
| No URL-based filter state | Risk | Users can't share filtered views or use back button to restore filters | Acceptable for V1/demo; can add URL params in a future iteration |

---

## Out of Scope

The following are explicitly **not** included in this feature:

- **Server-side search or filtering** — All filtering is client-side. No API query parameter support.
- **Saved searches or filter presets** — No persistence of filter state.
- **URL-encoded filter state** — Filters do not sync to URL query params.
- **Full-text search index** — No Elasticsearch, Algolia, or similar infrastructure.
- **Faceted search with dynamic counts** — Category counts are computed client-side from the fetched product array, not from a search engine.
- **Product tags** (multi-value) — We're adding a single `category` string, not a tags array.
- **Filter animations / transitions** — Functional UI only; no animated filter panel transitions.
- **Mobile-specific filter drawer** — Responsive layout via Tailwind grid, but no dedicated mobile filter sheet/modal.

---

## Open Questions

- [ ] **Category taxonomy** — Are the proposed 6 categories (Feeders & Hydration, Toys & Entertainment, Tracking & Monitoring, Hygiene & Grooming, Furniture & Comfort, Smart Home) the right groupings? Should "Smart Home" be merged into another category given it has only 1 product?
- [ ] **Discount-aware pricing in filters** — Should the price range filter use the effective (discounted) price or the original price? This PRD assumes effective price, but stakeholders may prefer original price.
- [ ] **Search result highlighting** — Should matched text be highlighted in the product card (e.g., bold the matched substring)? Currently out of scope but could be added.
- [ ] **AdminProducts category field** — Should the admin form use a free-text input or a dropdown for category? A dropdown prevents typos but limits extensibility.
- [ ] **Sort persistence** — Should the selected sort option persist across page navigations (e.g., via localStorage)? Currently resets on navigation.

---

## RICE Score

| Factor | Score | Rationale |
|--------|-------|-----------|
| Reach | 9 | Every user who visits the Products page is affected. Search and filtering are fundamental catalog interactions. |
| Impact | 2 (High) | Significantly improves product discoverability and browsing experience. Moves the demo from toy-level to realistic e-commerce UX. |
| Confidence | 90% | All patterns exist in the codebase already (client-side filtering, useQuery, Tailwind styling). Fuse.js is a proven library. Low technical unknowns. |
| Effort | 2 person-weeks | Model change + seed data (~0.5d), Fuse.js integration (~1d), category chips (~1d), sort dropdown (~0.5d), price range (~1d), active filters bar (~1d), dark mode + polish (~1d), testing (~1d), admin form update (~0.5d) |
| **RICE Score** | **9.0** | (9 × 2 × 0.9) / 2 × 0.5 = **8.1** — adjusted from parent PRD context score of 9.07 based on detailed effort estimate |

> **Note:** The parent PRD scored this feature at 9.07. The slight adjustment reflects the refined 2-person-week effort estimate which includes admin form updates and comprehensive testing.

---

## Appendix: Current Product Price Distribution

For reference when implementing the price range filter:

| Product | Original Price | Discount | Effective Price |
|---------|---------------|----------|-----------------|
| SnackVault Puzzle Dispenser | $49.99 | 25% | $37.49 |
| ScratchPad Pro | $59.99 | — | $59.99 |
| Smart Fountain Flow+ | $69.99 | 25% | $52.49 |
| PawTrack Smart Collar | $79.99 | — | $79.99 |
| ZoomieTracker AI Mat | $79.99 | — | $79.99 |
| CatFlix Entertainment Portal | $89.99 | — | $89.99 |
| ChirpCam Window Mount | $99.99 | — | $99.99 |
| ClawMate Auto Groomer | $119.99 | — | $119.99 |
| SmartFeeder One | $129.99 | 25% | $97.49 |
| SleepNest ThermoPod | $149.99 | — | $149.99 |
| DoorDash Pet Portal | $159.99 | — | $159.99 |
| AutoClean Litter Dome | $199.99 | 25% | $149.99 |

**Effective price range:** $37.49 – $159.99
