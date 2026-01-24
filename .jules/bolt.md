## 2024-05-24 - Efficient Style Comparison
**Learning:** `JSON.stringify` used for deep equality checks in hot paths (like style patching) is a significant bottleneck and is order-sensitive, causing false negatives (unnecessary updates).
**Action:** Replace `JSON.stringify` with a custom structural equality function (`areStylesEqual`) which is ~5x faster and handles key reordering correctly.

## 2024-05-24 - Package Manager Consistency
**Learning:** The repository uses `yarn.lock` but `pnpm` is present. Running `pnpm install` generates a massive `pnpm-lock.yaml` which pollutes the codebase.
**Action:** Stick to `yarn` or avoid committing `pnpm-lock.yaml` if `pnpm` is used for local scripts.
