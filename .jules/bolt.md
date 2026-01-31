## 2026-01-31 - JSON.stringify Performance Bottleneck
**Learning:** Using `JSON.stringify` for deep equality checks in hot paths (like style diffing in a custom renderer) is significantly slower (~5.6x) than a custom shallow equality check and fails to handle key order independence correctly.
**Action:** Always prefer custom equality functions for known object shapes in performance-critical loops. Ensure they handle edge cases like `null`, `undefined`, and arrays correctly.
