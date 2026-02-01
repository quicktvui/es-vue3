## 2024-05-22 - [Style Equality Optimization]
**Learning:** `JSON.stringify` used for style equality checks was a bottleneck (~4x slower) and order-sensitive (false negatives).
**Action:** Use structural equality checks for hot paths in renderers, ensuring proper handling of Arrays vs Objects and key order independence.
