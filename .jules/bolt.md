# Bolt's Journal

## 2024-05-22 - [Optimizing Style Patching]
**Learning:** `JSON.stringify` is used for style comparison in `packages/ESVue/src/modules/style.ts`. This is a significant performance bottleneck in hot paths because of serialization costs and key-order sensitivity.
**Action:** Replace `JSON.stringify` with a structural equality check (`areStylesEqual`). This should improve performance and correctness (ignoring key order).
