## 2025-02-18 - JSON.stringify for Style Diffing
**Learning:** The `ESVue` renderer used `JSON.stringify` to check if styles changed. This is expensive (serialization) and order-sensitive (false positives for re-renders).
**Action:** Replaced with a custom `areStylesEqual` shallow comparison function that handles `string | string[]` values and ignores key order. Future optimizations should look for similar lazy serialization patterns in `patch-prop`.
