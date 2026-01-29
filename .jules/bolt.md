## 2024-03-24 - Avoid JSON.stringify for Style Comparison
**Learning:** `JSON.stringify` was used for deep equality checks on style objects in `packages/ESVue`. This is slow (~6.4x slower than shallow compare) and order-sensitive (false negatives for different key order).
**Action:** Use manual shallow comparison for style objects. Implement `areStylesEqual` helper.
