## 2026-02-06 - JSON.stringify Performance Bottleneck
**Learning:** `JSON.stringify` used for style equality checks in `ESVue` renderer was 7-8x slower than a custom structural equality function.
**Action:** Replace `JSON.stringify` with `areStylesEqual` or similar structural comparison helpers in hot paths (rendering/patching loops).
