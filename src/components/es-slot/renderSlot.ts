import { PatchFlags, SlotFlags } from "@vue/shared";
import {
  cloneVNode,
  createBlock,
  Fragment,
  isVNode,
  openBlock,
  Slots,
  VNodeArrayChildren,
  renderSlot as originalRenderSlot, // Vue 内置的
} from "@vue/runtime-core";
import { VNode } from "vue";

/* ---------- 缓存结构 ---------- */
type SlotCacheEntry = {
  template: VNodeArrayChildren;
};

const slotTemplateCache = new Map<string, SlotCacheEntry>();
const MAX_CACHE_ENTRIES = 200;

/* ---------- 工具函数 ---------- */
function deepCloneVNodes(vnodes: VNodeArrayChildren | null): VNodeArrayChildren | null {
  if (!vnodes) return null;
  return vnodes.map((v) => deepCloneVNode(v));
}

function deepCloneVNode(v: VNode): VNode {
  const c = cloneVNode(v);
  const ch = (v as any).children;
  if (Array.isArray(ch)) {
    (c as any).children = ch.map((child) =>
      isVNode(child) ? deepCloneVNode(child as VNode) : child,
    );
  } else {
    (c as any).children = ch;
  }
  return c;
}

/* ---------- 工具函数：浅拷贝 ---------- */
function shallowCloneVNodes(vnodes: VNodeArrayChildren | null): VNodeArrayChildren | null {
  if (!vnodes) return null;
  return vnodes.map((v) => shallowCloneVNode(v));
}

function shallowCloneVNode(v: VNode): VNode {
  // 基于 Vue 内置 cloneVNode，但不递归 children
  const cloned = cloneVNode(v);

  // 直接复用原 children 引用（避免深拷贝性能开销）
  (cloned as any).children = (v as any).children;

  return cloned;
}

/* ---------- 覆盖版 renderSlot ---------- */
export function renderSlots(
  slots: Slots,
  name: string,
  props: Record<string, any> = {},
  fallback?: () => VNodeArrayChildren,
  noSlotted?: boolean,
): VNode {
  const cacheKey = name;

  // 查缓存
  const cache = slotTemplateCache.get(cacheKey);
  if (cache) {
    // 命中缓存 → 克隆 vnode
    const cloned = shallowCloneVNodes(cache.template) as VNodeArrayChildren;

    console.log("=====命中缓存 → 克隆 vnode=======>>>>>", cloned);

    return createBlock(Fragment, { key: `cached_${name}` }, cloned, 0);
  }

  // 没有缓存 → 调用 Vue 原始 renderSlot
  const rendered = originalRenderSlot(slots, name, props, fallback, noSlotted);

  // 缓存 vnode（注意：要克隆一份，不要直接存引用）
  const vnodesToCache = Array.isArray((rendered as any).children)
    ? ((rendered as any).children as VNodeArrayChildren)
    : [rendered as VNode];

  if (slotTemplateCache.size > MAX_CACHE_ENTRIES) {
    const firstKey = slotTemplateCache.keys().next().value;
    if (firstKey) slotTemplateCache.delete(firstKey);
  }
  slotTemplateCache.set(cacheKey, { template: shallowCloneVNodes(vnodesToCache)! });

  return rendered;
}
