## 2025-02-18 - JSON.stringify in Style Patching
**Learning:** The codebase used `JSON.stringify` in `packages/ESVue/src/modules/style.ts` to check for style equality. This is highly inefficient (O(N)) and causes performance issues on hot paths like style updates. Replacing it with a shallow comparison + array content check reduced comparison time by ~6.7x in benchmarks.
**Action:** Avoid `JSON.stringify` for object comparison in render/patch loops. Use shallow comparison or specific equality checks.
