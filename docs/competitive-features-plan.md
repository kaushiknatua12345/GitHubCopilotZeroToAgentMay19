# OctoCAT Supply - Competitive Features Plan

## Executive Summary

Based on competitive analysis against Amazon and Flipkart, OctoCAT Supply is missing key **trust signals** and **product discovery** features that drive conversions. Below are 5 high-impact, low-effort features to close the gap.

---

## The 5 Priority Features

### 1. ⭐ Star Ratings on Product Cards
**Priority:** Critical | **Effort:** Simple | **Impact:** +12-25% conversion

**What:** Display average star rating and review count on every product card.

**Why:** Reviews API exists but isn't surfaced in the UI. Both Amazon and Flipkart prominently display ratings—customers expect this.

**Implementation:**
- Add `avgRating` and `reviewCount` to product data
- Create `StarRating` component with filled/empty stars
- Display on product cards and product detail modal

---

### 2. 🔽 Product Sorting Dropdown
**Priority:** Critical | **Effort:** Simple | **Impact:** Reduced bounce rate

**What:** Allow sorting products by price (low/high), name, and rating.

**Why:** Essential for product discovery as catalog grows. Pure frontend change—no API needed.

**Implementation:**
- Add sort dropdown to Products page header
- Sort options: Price Low→High, Price High→Low, Name A-Z, Top Rated
- Client-side array sorting

---

### 3. 💚 Discount Percentage Badge
**Priority:** High | **Effort:** Simple | **Impact:** Better value perception

**What:** Show "X% OFF" badge on discounted products with strikethrough original price.

**Why:** Product model already has `discount` field. Makes deals immediately visible like competitors.

**Implementation:**
- Calculate discount percentage from product data
- Green badge overlay on product card image
- Show original price with strikethrough next to sale price

---

### 4. 👁️ Recently Viewed Products
**Priority:** Medium | **Effort:** Simple | **Impact:** Session continuity

**What:** Track and display last 10 viewed products in a horizontal carousel.

**Why:** Helps users resume shopping sessions. Uses localStorage like existing Wishlist feature.

**Implementation:**
- Create `RecentlyViewedContext` (similar to WishlistContext)
- Track views when product modal opens
- Display carousel section on Products page

---

### 5. 🔥 Stock Level Urgency Indicator
**Priority:** Medium | **Effort:** Simple | **Impact:** +10-15% conversion

**What:** Show "Only X left in stock!" warning when inventory is low.

**Why:** Creates purchase urgency. Industry standard on Amazon/Flipkart.

**Implementation:**
- Add `stockLevel` to product seed data
- Display orange warning when stock ≤ 5
- Show on both product cards and detail modal

---

## Implementation Timeline

| Week | Feature | Owner | Status |
|------|---------|-------|--------|
| 1 | Star Ratings Display | - | Not Started |
| 1 | Product Sorting | - | Not Started |
| 2 | Discount Badges | - | Not Started |
| 2 | Recently Viewed | - | Not Started |
| 2 | Stock Indicators | - | Not Started |

---

## Competitive Gap Summary

| Feature | Amazon | Flipkart | OctoCAT (Current) | OctoCAT (Planned) |
|---------|--------|----------|-------------------|-------------------|
| Star Ratings | ✅ | ✅ | ❌ | ✅ |
| Product Sorting | ✅ | ✅ | ❌ | ✅ |
| Discount Badges | ✅ | ✅ | ❌ | ✅ |
| Recently Viewed | ✅ | ✅ | ❌ | ✅ |
| Stock Urgency | ✅ | ✅ | ❌ | ✅ |

---

## Success Metrics

- **Conversion Rate:** Target +15% improvement
- **Bounce Rate:** Target -10% reduction
- **Time on Site:** Target +20% increase
- **Cart Abandonment:** Target -12% reduction

---

## Next Steps

1. Review and approve this feature plan
2. Assign developers to each feature
3. Implement features in priority order
4. A/B test each feature rollout
5. Measure impact against success metrics
