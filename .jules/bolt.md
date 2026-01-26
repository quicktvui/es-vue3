## 2025-02-12 - [Expensive JSON.stringify in Hot Path]
**Learning:** The renderer was using `JSON.stringify` to compare style objects in `packages/ESVue/src/modules/style.ts`. This is highly inefficient (O(n) string allocation) for a hot path like style patching, especially as style objects grow.
**Action:** Replace `JSON.stringify` equality checks with structural equality functions (`areStylesEqual`) that iterate keys and compare values directly, avoiding serialization overhead. Benchmarks showed ~6.5x speedup.
