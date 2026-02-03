## 2024-05-22 - [Style Comparison Bottleneck]
**Learning:** `JSON.stringify` was used for equality checks in the style patching hot path (`isStyleExisted`). This is extremely inefficient (O(n) serialization) compared to a recursive structural equality check.
**Action:** Use a custom `areStylesEqual` function for style objects. Avoid `JSON.stringify` in hot paths, especially for objects that may contain nested structures like `transform` arrays.
