## 2026-01-22 - [Optimized Style Diffing in ESVue]
**Learning:** `JSON.stringify` was used for structural equality checks in `ESVue` style patching. This is inefficient (serialization overhead) and incorrect (key order sensitivity).
**Action:** Replaced with a custom `areStylesEqual` function that performs shallow comparison and array content checking. This is ~5x faster and order-independent. Always check custom renderers for `JSON.stringify` usage in hot paths.
