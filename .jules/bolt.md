## 2024-05-22 - JSON.stringify in Hot Paths
**Learning:** Found `JSON.stringify` being used for object equality checks in `packages/ESVue/src/modules/style.ts` inside `isStyleExisted`. This is called on every style patch. `JSON.stringify` is slow and order-sensitive, leading to both performance overhead and potential unnecessary updates (correctness/efficiency issue).
**Action:** Replace `JSON.stringify` with a custom shallow/deep comparison function for style objects. Avoid serialization for equality checks in hot paths.
