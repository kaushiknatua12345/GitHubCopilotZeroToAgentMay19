# OctoCAT Supply — Product Decision Log

## March 10, 2026 — Amazon Counterattack: 5 Feature Sprint

**Decision**: Ship 5 features to close the competitive gap with Amazon and unblock revenue

**Features Approved** (RICE-ranked):

| Rank | Feature | RICE Score | Effort |
|------|---------|------------|--------|
| 1 | Working Checkout Flow | 14.25 | 2 weeks |
| 2 | Product Search & Filtering | 9.07 | 1.5 weeks |
| 3 | Order History & Tracking | 7.20 | 1.5 weeks |
| 4 | Wishlist / Save for Later | 4.50 | 1 week |
| 5 | Product Reviews & Ratings | 4.48 | 2.5 weeks |

**Rationale**: 
- The checkout button literally does nothing — zero revenue is possible without this fix
- Amazon dominates on convenience (search, 1-click buy, reviews, tracking) — we must achieve table-stakes parity
- All 3 user personas (buyer, admin, casual shopper) are blocked at checkout
- Backend APIs already exist for Orders — frontend just needs to connect to them
- Mid-tier niche brands are growing faster than the overall market — cat-themed differentiation is viable

**Data Points**:
- Global e-commerce at $6.88T (2026); cat supplies are a recurring, growing vertical
- 86% of consumers want AI to assist with product research
- Cart-to-checkout is the #1 conversion killer — our cart literally dead-ends
- Mid-tier retailers (rank 101–2000) growing at 7.5%+ YoY vs. overall market

**Status**: Approved

**Specs**:
- PRD: [amazon-counterattack-prd.md](amazon-counterattack-prd.md)
- GTM: [gtm-amazon-counterattack.md](gtm-amazon-counterattack.md)

**Also Noted (Critical — Fix Immediately)**:
- Command injection vulnerability in Delivery route (`exec()` with user input)
- XSS vulnerability in Login component (`dangerouslySetInnerHTML` with URL params)
- OrderDetailDelivery route uses wrong ID field for lookups
