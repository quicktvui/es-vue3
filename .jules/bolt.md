## 2026-01-19 - JSON.stringify in Hot Path
**Learning:** Found `JSON.stringify` used for structural equality check in `isStyleExisted` (renderer loop). This is O(N) string allocation and order-sensitive, causing unnecessary updates and CPU churn.
**Action:** Always prefer recursive shallow/deep compare functions over `JSON.stringify` for object equality in hot paths.
