// esLifecycle.ts
import { getCurrentInstance } from "vue";
import type { ComponentPublicInstance } from "@vue/runtime-core";
import { ESKeyEvent } from "@extscreen/es3-core";

// ================== Symbol keys ==================
const ES_CREATE = Symbol("create");
const ES_CREATED = Symbol("created");
const ES_RESTART = Symbol("restart");
const ES_START = Symbol("start");
const ES_RESUME = Symbol("resume");
const ES_PAUSE = Symbol("pause");
const ES_STOP = Symbol("stop");
const ES_DESTROY = Symbol("destroy");
const ES_NEW_INTENT = Symbol("newIntent");
const ES_SAVE_INSTANCE_STATE = Symbol("saveInstanceState");
const ES_RESTORE_INSTANCE_STATE = Symbol("restoreInstanceState");

const ES_BIND = Symbol("bind");
const ES_RECYCLE = Symbol("recycle");
const ES_ATTACHED = Symbol("attached");
const ES_DETACHED = Symbol("detached");
const ES_SLOT_EVENT = Symbol("slotEvent");

const ES_KEY_DOWN = Symbol("keyDown");
const ES_KEY_UP = Symbol("keyUp");
const ES_BACK_PRESSED = Symbol("backPressed");
const ES_DISPATCH_KEY_EVENT = Symbol("dispatchKeyEvent");

// ================== 通用注册器 ==================
function registerHook(key: symbol, hook: Function) {
  const instance = getCurrentInstance();
  if (instance && instance.proxy) {
    (instance.proxy as any).__internal__ = instance;
    (instance as any)[key] ||= [];
    (instance as any)[key].push(hook);
  }
}

// ================== 生命周期导出方法 ==================
export function onESCreate(hook: (params?: any) => void) {
  registerHook(ES_CREATE, hook);
}

export function onESCreated(hook: (success?: boolean) => void) {
  registerHook(ES_CREATED, hook);
}

export function onESRestart(hook: () => void) {
  registerHook(ES_RESTART, hook);
}

export function onESStart(hook: () => void) {
  registerHook(ES_START, hook);
}

export function onESResume(hook: () => void) {
  registerHook(ES_RESUME, hook);
}

export function onESPause(hook: () => void) {
  registerHook(ES_PAUSE, hook);
}

export function onESStop(hook: () => void) {
  registerHook(ES_STOP, hook);
}

export function onESDestroy(hook: () => void) {
  registerHook(ES_DESTROY, hook);
}

export function onESNewIntent(hook: (intent?: any) => void) {
  registerHook(ES_NEW_INTENT, hook);
}

export function onESSaveInstanceState(hook: (savedInstanceState?: any) => void) {
  registerHook(ES_SAVE_INSTANCE_STATE, hook);
}

export function onESRestoreInstanceState(hook: (savedInstanceState?: any) => void) {
  registerHook(ES_RESTORE_INSTANCE_STATE, hook);
}

// ================== 额外扩展 ==================
export function onESBind(hook: () => void) {
  registerHook(ES_BIND, hook);
}

export function onESRecycle(hook: () => void) {
  registerHook(ES_RECYCLE, hook);
}

export function onESAttached(hook: () => void) {
  registerHook(ES_ATTACHED, hook);
}

export function onESDetached(hook: () => void) {
  registerHook(ES_DETACHED, hook);
}

export function onESSlotEvent(hook: (event: any) => void) {
  registerHook(ES_SLOT_EVENT, hook);
}

//-----------------------------------------------------------------------------
export function onBackPressed(hook: () => void) {
  registerHook(ES_BACK_PRESSED, hook);
}

export function onDispatchKeyEvent(hook: (event: ESKeyEvent) => void) {
  registerHook(ES_DISPATCH_KEY_EVENT, hook);
}

export function onKeyDown(hook: (event: ESKeyEvent) => void) {
  registerHook(ES_KEY_DOWN, hook);
}

export function onKeyUp(hook: (event: ESKeyEvent) => void) {
  registerHook(ES_KEY_UP, hook);
}

// ================== 内部调用：执行指定 key 的 hooks，并收集返回值 ==================
function callHooks<T = any>(
  instance: ComponentPublicInstance,
  key: symbol,
  ...args: any[]
): Array<T | Promise<T> | undefined> {
  const internal = (instance as any).__internal__;
  const hooks: Function[] = internal?.[key] || [];
  const results: Array<T | Promise<T> | undefined> = [];
  for (const hook of hooks) {
    try {
      const res = hook(...args);
      results.push(res);
    } catch (err) {
      console.error(`[ESLifecycle error][${String(key)}]`, err);
      results.push(undefined);
    }
  }
  return results;
}

/**
 * 判断实例上是否存在指定 hook
 * @param instance 组件实例
 * @param key Symbol，用于查找 hook
 * @returns true 表示存在 hook，false 表示不存在
 */
export function hasESLifecycleHook(instance: ComponentPublicInstance, key: symbol): boolean {
  const internal = (instance as any).__internal__;
  const hooks: Function[] = internal?.[key] || [];
  return hooks.length > 0;
}

// ================== 调度器：通过 publicInstance 触发，并返回所有 hook 的返回值 ==================
export function triggerESLifecycle<T = any>(
  publicInstance: ComponentPublicInstance,
  event:
    | "create"
    | "created"
    | "restart"
    | "start"
    | "resume"
    | "pause"
    | "stop"
    | "destroy"
    | "newIntent"
    | "saveInstanceState"
    | "restoreInstanceState"
    //
    | "bind"
    | "recycle"
    | "attached"
    | "detached"
    | "slotEvent"
    //
    | "keyDown"
    | "keyUp"
    | "backPressed"
    | "dispatchKeyEvent",
  ...args: any[]
): Array<T | Promise<T> | undefined> {
  const keyMap: Record<string, symbol> = {
    create: ES_CREATE,
    created: ES_CREATED,
    restart: ES_RESTART,
    start: ES_START,
    resume: ES_RESUME,
    pause: ES_PAUSE,
    stop: ES_STOP,
    destroy: ES_DESTROY,
    newIntent: ES_NEW_INTENT,
    saveInstanceState: ES_SAVE_INSTANCE_STATE,
    restoreInstanceState: ES_RESTORE_INSTANCE_STATE,
    //
    bind: ES_BIND,
    recycle: ES_RECYCLE,
    attached: ES_ATTACHED,
    detached: ES_DETACHED,
    slotEvent: ES_SLOT_EVENT,
    //
    keyDown: ES_KEY_DOWN,
    keyUp: ES_KEY_UP,
    backPressed: ES_BACK_PRESSED,
    dispatchKeyEvent: ES_DISPATCH_KEY_EVENT,
  };
  const key = keyMap[event];
  if (key) {
    return callHooks<T>(publicInstance, key, ...args);
  } else {
    console.warn(`[ESLifecycle warn] Unknown lifecycle: ${event}`);
    return [];
  }
}

// ================== 导出所有 Symbol key ==================
export const ESLifecycleKeys = {
  ES_CREATE,
  ES_CREATED,
  ES_RESTART,
  ES_START,
  ES_RESUME,
  ES_PAUSE,
  ES_STOP,
  ES_DESTROY,
  ES_NEW_INTENT,
  ES_SAVE_INSTANCE_STATE,
  ES_RESTORE_INSTANCE_STATE,
  //
  ES_BIND,
  ES_RECYCLE,
  ES_ATTACHED,
  ES_DETACHED,
  ES_SLOT_EVENT,
  //
  ES_KEY_DOWN,
  ES_KEY_UP,
  ES_BACK_PRESSED,
  ES_DISPATCH_KEY_EVENT,
};
