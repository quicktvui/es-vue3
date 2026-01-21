## 2024-05-23 - Custom Renderer Style Equality
**Learning:** `JSON.stringify` was used for style equality checks in the custom Vue renderer. This is order-sensitive and slow. Replacing it with a custom recursive equality check improved performance by ~2x and correctly handles reordered keys.
**Action:** Always check custom renderers for inefficient object comparison strategies, especially in hot paths like prop patching.
