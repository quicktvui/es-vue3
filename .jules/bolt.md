# Bolt's Journal

## 2024-05-23 - Avoid JSON.stringify in Hot Paths
**Learning:** `JSON.stringify` was being used to compare style objects in `packages/ESVue/src/modules/style.ts`. This is inefficient because it requires serializing the entire object to a string and is order-dependent (though style keys are generally unordered).
**Action:** Replaced `JSON.stringify` with a custom structural equality function `areStylesEqual` that performs a shallow check (and deep check for array values) to improve performance and correctness (ignoring key order).
