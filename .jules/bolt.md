## 2025-10-26 - [Avoid JSON.stringify in Hot Paths]
**Learning:** `JSON.stringify` was used for object equality checks in `isStyleExisted` (style patching). This is a massive bottleneck (O(n) serialization) and fails on key order differences.
**Action:** Use a custom shallow/deep comparison function tailored to the data structure. `areStylesEqual` provided ~6x speedup for identical objects and correctly handles key reordering, avoiding unnecessary updates.
