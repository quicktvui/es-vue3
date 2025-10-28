import { IESManager } from "../core";
import { App } from "vue";
import { ESThemeKey } from "../useApi";
import { ESThemeListener } from "./ESThemeListener";
import { ESNetworkListener } from "../network";

export type ThemeVariables = Record<string, string>;

export interface ESTheme extends IESManager {
  registerTheme(name: string, variables: ThemeVariables): void;

  setTheme(name: string): void;

  getCurrentTheme(): ThemeVariables | null;

  getCurrentThemeName(): string | null;

  getTheme(name: string): ThemeVariables | undefined;

  addListener(listener: ESThemeListener): void;

  removeListener(listener: ESThemeListener): void;
}

export function createESTheme(): ESTheme {
  const themeRegistry: Record<string, ThemeVariables> = {};
  let currentTheme: string | null = null;
  const listenerList: Array<ESNetworkListener> = [];

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function registerTheme(name: string, variables: ThemeVariables) {
    themeRegistry[name] = variables;
  }

  function setTheme(name: string) {
    if (!themeRegistry[name]) {
      throw new Error(`Theme "${name}" is not registered.`);
    }
    currentTheme = name;
    global.__HIPPY_CSS_VARIABLES__ = themeRegistry[name];
    localStorage.setItem("theme", name);
  }

  function getCurrentTheme(): ThemeVariables | null {
    return currentTheme ? themeRegistry[currentTheme] : null;
  }

  function getCurrentThemeName(): string | null {
    return currentTheme;
  }

  function getTheme(name: string): ThemeVariables | undefined {
    return themeRegistry[name];
  }

  function addListener(listener) {
    const index = listenerList.findIndex((l) => l === listener);
    if (index > -1) {
      return;
    }
    listenerList.push(listener);
  }

  function removeListener(listener) {
    const index = listenerList.findIndex((l) => l === listener);
    if (index > -1) {
      listenerList.splice(index, 1);
    }
  }

  return {
    install: function (app: App) {
      const instance = this;
      app.provide(ESThemeKey, instance);
    },
    init,
    registerTheme,
    setTheme,
    getCurrentTheme,
    getCurrentThemeName,
    getTheme,
    addListener,
    removeListener,
  };
}
