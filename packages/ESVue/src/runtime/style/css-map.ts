import {
  HIPPY_GLOBAL_DISPOSE_STYLE_NAME,
  HIPPY_GLOBAL_STYLE_NAME,
  HIPPY_GLOBAL_CSS_VARIABLES_NAME,
  // HIPPY_GLOBAL_PRECOMPILED_CSS_RULES_NAME,
} from "../../config";

import { SelectorsMap } from "./css-selectors-match";

import { fromAstNodes } from "./index";
import { info } from "../../util/log";
import { normalizeThemeVariables } from "@extscreen/es3-vue-style-parser";
import { extractCssVariables } from "./css-resolve-variables";

/**
 * TODO 全局样式解析入口
 */

// global css map
let globalCssMap: SelectorsMap;

let globalCssMapVersion = 0;

export function getCssMap(): SelectorsMap {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const styleCssMap = global[HIPPY_GLOBAL_STYLE_NAME];
  const cssVariablesMap = global[HIPPY_GLOBAL_CSS_VARIABLES_NAME];
  // const precompiledCssRules = global[HIPPY_GLOBAL_PRECOMPILED_CSS_RULES_NAME];

  /**
   * To support dynamic import, globalCssMap can be loaded from different js file.
   * globalCssMap should be created/appended if global[GLOBAL_STYLE_NAME] exists;
   */
  if (!globalCssMap || styleCssMap) {
    //---------------------------------------------------------------------------
    /**
     *  Here is a secret startup option: beforeStyleLoadHook.
     *  Usage for process the styles while styles loading.
     */
    const cssVariables = extractCssVariables(styleCssMap);
    const themeVariables = normalizeThemeVariables(cssVariablesMap);

    info("【CSS变量】主题变量：", cssVariablesMap, themeVariables);
    info("【CSS变量】全局提取变量：", cssVariables);
    // 合并：用户定义的变量优先
    const mergedCssVariables = {
      ...cssVariables,
      ...themeVariables,
    };
    //---------------------------------------------------------------------------
    info("【样式匹配】全局变量：", mergedCssVariables, " 原样式：", styleCssMap);
    const cssRules = fromAstNodes(styleCssMap, mergedCssVariables);
    info("【样式匹配】全局样式：", styleCssMap, " cssRules: ", cssRules);

    if (globalCssMap) {
      globalCssMap.append(cssRules);
    } else {
      globalCssMap = new SelectorsMap(cssRules);
    }
    // after the global style processing is complete, remove the value of this object
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global[HIPPY_GLOBAL_STYLE_NAME] = undefined;

    // 🔥 自动失效全局样式缓存
    invalidateGlobalCssCache();
  }

  //--------------------------------------------------------------------------
  // if there are currently expired styles, hot update style processing
  if (global[HIPPY_GLOBAL_DISPOSE_STYLE_NAME]) {
    // the new css style will be generated with hash id, so it can be removed by id
    global[HIPPY_GLOBAL_DISPOSE_STYLE_NAME].forEach((id) => {
      // remove outdated styles
      globalCssMap.delete(id);
    });

    // remove saved expired styles
    global[HIPPY_GLOBAL_DISPOSE_STYLE_NAME] = undefined;

    // 🔥 自动失效全局样式缓存
    invalidateGlobalCssCache();
  }

  return globalCssMap;
}

export function invalidateGlobalCssCache() {
  globalCssMapVersion++; // 每次热更新、动态更新时调用
}

export function getGlobalCssMapVersion() {
  return globalCssMapVersion;
}
