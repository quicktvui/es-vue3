
// Type compatible with Style in style.ts
type StyleValue = string | string[] | undefined | null;
type Style = string | Record<string, StyleValue> | null | undefined;

/**
 * Checks if two style objects are structurally equal.
 * Optimized replacement for JSON.stringify(prev) === JSON.stringify(next).
 *
 * @param prev - Previous style
 * @param next - Next style
 */
export function areStylesEqual(prev: any, next: any): boolean {
  // Reference equality check
  if (prev === next) {
    return true;
  }

  // Handle null/undefined cases
  // If both are null/undefined, they are equal (covered by prev === next if strictly same,
  // but here we also want null == undefined to be true? JSON.stringify(undefined) is undefined.
  // JSON.stringify(null) is 'null'. undefined !== 'null'.
  // However `isStyleExisted` had: `const isPrevAndNextNull = !prev && !next;` checks logic separately.
  // But let's support general equality here.
  if (!prev && !next) {
      return true;
  }
  if (!prev || !next) {
      return false;
  }

  if (typeof prev !== typeof next) {
      return false;
  }

  if (typeof prev === 'string') {
      return prev === next;
  }

  if (typeof prev !== 'object') {
      return prev === next;
  }

  // Arrays are objects too, but Style usually isn't an array itself at top level based on type definition,
  // but let's be safe.
  const isPrevArray = Array.isArray(prev);
  const isNextArray = Array.isArray(next);

  if (isPrevArray !== isNextArray) return false;

  if (isPrevArray) {
      if (prev.length !== next.length) return false;
      for (let i = 0; i < prev.length; i++) {
          if (prev[i] !== next[i]) return false;
      }
      return true;
  }

  // Object comparison
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) return false;

  // We iterate prevKeys. Since lengths are equal, if all keys in prev exist in next and values match, we are good.
  // But strictly we should check if key exists in next.
  // However, for styles, usually keys are same.
  // If next misses a key that prev has, accessing next[key] gives undefined.
  // If prev[key] is not undefined, they differ.
  // If prev[key] is undefined, and next doesn't have key, it matches.
  // But `Object.keys` returned keys, so prev[key] is likely valid value.

  for (const key of prevKeys) {
    // Check if key exists in next is implicit if we assume objects only contain keys returned by Object.keys
    if (!Object.prototype.hasOwnProperty.call(next, key)) return false;

    const prevVal = prev[key];
    const nextVal = next[key];

    if (prevVal === nextVal) continue;

    if (Array.isArray(prevVal) && Array.isArray(nextVal)) {
        if (prevVal.length !== nextVal.length) return false;
        for (let i = 0; i < prevVal.length; i++) {
            if (prevVal[i] !== nextVal[i]) return false;
        }
        continue;
    }

    return false;
  }

  return true;
}
