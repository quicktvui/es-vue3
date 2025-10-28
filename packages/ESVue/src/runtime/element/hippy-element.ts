import {
  parseBackgroundImage,
  parseTransform,
  parseBorder,
  parseFocusBorder,
  parseBackground,
  PROPERTIES_MAP,
  PropertiesMapType,
  convertToAndroidHexColor,
  parseBorderRadius,
} from "@extscreen/es3-vue-style-parser";
import { toRaw } from "@vue/runtime-core";
import { isFunction, isString } from "@vue/shared";

import type { CallbackType, NativeNode, NativeNodeProps, NeedToTyped } from "../../types";
import { IS_PROD, NATIVE_COMPONENT_MAP } from "../../config";
import {
  capitalizeFirstLetter,
  convertImageLocalPath,
  deepCopy,
  getBeforeRenderToNative,
  getBeforeLoadStyle,
  getStyleClassList,
  isStyleMatched,
  setsAreEqual,
  tryConvertNumber,
  unicodeToChar,
  warn,
  whitespaceFilter,
} from "../../util";
import { isRTL } from "../../util/i18n";
import { EventHandlerType, EventMethod } from "../../util/event";
import { getHippyCachedInstance } from "../../util/instance";
import { getTagComponent, TagComponent } from "../component";
import {
  eventIsKeyboardEvent,
  FocusEvent,
  HippyEvent,
  HippyLoadResourceEvent,
} from "../event/hippy-event";
import type { EventListenerOptions } from "../event/hippy-event-target";
import { Native } from "../native";
import { convertToNativeNodesReturnedVal, HippyNode, NodeType } from "../node/hippy-node";
import { getCssMap, getGlobalCssMapVersion } from "../style/css-map";
import { HippyText } from "../text/hippy-text";
import { info } from "../style/log";
import { resolveStyle } from "../style/css-resolve-style";
import { percentProps } from "../style/css-resolve-percent-style";
import { remProps } from "../style/css-resolve-rem-style";
import { HippyEventDispatcher } from "../event/hippy-event-dispatcher";

interface OffsetMapType {
  textShadowOffsetX: string;
  textShadowOffsetY: string;
}

/**
 * parse text shadow offset
 *
 * @param property - property name
 * @param value - property value
 * @param rawStyle - original style
 *
 */
function parseTextShadowOffset(
  property: keyof OffsetMapType,
  value = 0,
  rawStyle: NativeNodeProps,
): (string | { [key: string]: number })[] {
  const style = rawStyle;
  const offsetMap: OffsetMapType = {
    textShadowOffsetX: "width",
    textShadowOffsetY: "height",
  };

  style.textShadowOffset = style.textShadowOffset ?? {};

  Object.assign(style.textShadowOffset, {
    [offsetMap[property]]: value,
  });

  return ["textShadowOffset", style.textShadowOffset];
}

/**
 * Handle special cases of text input component
 *
 * @param node - text input element
 * @param rawStyle - original style
 */
function parseTextInputComponent(node: HippyElement, rawStyle: NativeNodeProps) {
  const style = rawStyle;

  // text input components need to support right-to-left text writing
  if (node.component.name === NATIVE_COMPONENT_MAP.TextInput) {
    if (isRTL()) {
      if (!style.textAlign) {
        style.textAlign = "right";
      }
    }
  }
}

/**
 * Handle special cases of view component
 *
 * @param node - hippy element
 * @param rawNativeNode - native node
 * @param rawStyle - original style
 */
// eslint-disable-next-line complexity
function parseViewComponent(
  node: HippyElement,
  rawNativeNode: Partial<NativeNode>,
  rawStyle: NativeNodeProps,
) {
  const nativeNode = rawNativeNode;
  const style = rawStyle;

  if (node.component.name === NATIVE_COMPONENT_MAP.View) {
    // If the scroll property is included in the style of the view component,
    // convert it to ScrollView at this time. View does not support scrolling.
    if (style.overflowX === "scroll" && style.overflowY === "scroll") {
      warn("overflow-x and overflow-y for View can not work together");
    }
    if (style.overflowY === "scroll") {
      nativeNode.name = "ScrollView";
    } else if (style.overflowX === "scroll") {
      nativeNode.name = "ScrollView";
      // Necessary for horizontal scrolling
      if (nativeNode.props) {
        nativeNode.props.horizontal = true;
      }
      // Change flexDirection to row-reverse if display direction is right to left.
      style.flexDirection = isRTL() ? "row-reverse" : "row";
    }
    // Change the ScrollView child collapsable attribute
    if (nativeNode.name === "ScrollView") {
      if (node.childNodes.length !== 1) {
        warn("Only one child node is acceptable for View with overflow");
      }
      if (node.childNodes.length && node.nodeType === NodeType.ElementNode) {
        (node.childNodes[0] as HippyElement).setStyle("collapsable", false);
      }
    }
    // TODO backgroundImage would use local path if webpack file-loader active, which needs native support
    if (style.backgroundImage) {
      style.backgroundImage = convertImageLocalPath(style.backgroundImage as string);
    }
  }
}

function transverseEventNames(eventNames, callback) {
  if (typeof eventNames !== "string") return;
  const events = eventNames.split(",");
  for (let i = 0, l = events.length; i < l; i += 1) {
    const eventName = events[i].trim();
    callback(eventName);
  }
}

function createEventListener(nativeName, originalName) {
  return (event) => {
    const { id, currentId, params, eventPhase } = event;
    const dispatcherEvent = {
      id,
      nativeName,
      originalName,
      currentId,
      params,
      eventPhase,
    };
    HippyEventDispatcher.receiveComponentEvent(dispatcherEvent, event);
  };
}

/**
 * HippyElement
 *
 * @public
 */
export class HippyElement extends HippyNode {
  // element tag name, such as div, ul, hi-swiper, etc.
  public tagName: string;

  // id
  public id = "";

  // style list, such as class="wrapper red" => ['wrapper', 'red']
  public classList: Set<string>;

  // attributes
  public attributes: NativeNodeProps;

  // style
  public style: NativeNodeProps;
  //--------------------------静态CSS缓存--------------------------------------------
  // style cache
  private __cssMatchedStyleCache?: {
    normal: NativeNodeProps;
    important: NativeNodeProps;
    __pseudo__: Record<string, NativeNodeProps>;
  } | null = null;
  private __cssMatchedStyleVersion?: number; // 缓存版本控制

  // 手动清除缓存的方法（当 className / inlineStyle 改变时应调用）
  public invalidateStyleCache() {
    this.__cssMatchedStyleCache = null;
    this.__cssMatchedStyleVersion = -1;
  }

  //---------------------------动态百分、Rem等解析后的样式缓存-------------------------------------------
  private __inlineStyleDirty = false;

  public isInlineStyleDirty(): boolean {
    return this.__inlineStyleDirty;
  }

  public markInlineStyleClean(): void {
    this.__inlineStyleDirty = false;
  }

  public markInlineStyleDirty(): void {
    this.__inlineStyleDirty = true;
  }

  private __resolvedStyleCache: NativeNodeProps | null = null;
  private __resolvedStyleVersion?: number; // 缓存版本控制

  // 手动清除缓存的方法（当 设计到宽高比属性改变时应调用）
  public invalidateResolvedStyleCache() {
    this.__resolvedStyleCache = null;
    this.__resolvedStyleVersion = -1;
  }

  public getResolvedStyle() {
    return this.__resolvedStyleCache;
  }

  //----------------------------------------------------------------------
  // events map
  public events: NativeNodeProps;

  // element content for text element
  public value?: string;

  // additional processing of properties
  public filterAttribute?: CallbackType;

  // polyFill of native event
  protected polyfillNativeEvents?: (
    method: string,
    eventNames: string,
    callback: CallbackType,
    options?: EventListenerOptions,
  ) => {
    eventNames: string;
    callback: CallbackType;
    options?: EventListenerOptions;
  };

  //-----------------------------------------------
  //伪类的状态
  __pseudoActive__: Record<string, boolean> = {
    "first-child": true,
    empty: true,
    "last-child": true,
    "only-child": true,
    "nth-child": true,
  };
  //支持的伪类
  _pseudoClassDependencies?: Set<string> = new Set<string>(); // 比如: Set('focus', 'hover')
  setPseudoState(pseudo: string, value: boolean) {
    if (this._pseudoClassDependencies) {
      const hasDirect = this._pseudoClassDependencies.has(pseudo);
      const hasIndirectNot = Array.from(this._pseudoClassDependencies).some((dep) => {
        return dep.startsWith("not(") && dep.includes(`:${pseudo}`);
      });
      if (!hasDirect && !hasIndirectNot) {
        info("setPseudoState _pseudoClassDependencies has no pseudo or indirect not:", pseudo);
        return;
      }
    }
    if (!this.__pseudoActive__) {
      this.__pseudoActive__ = {};
    }
    const prev = this.__pseudoActive__[pseudo];
    info("setPseudoState pseudo:", pseudo, "prev:", prev, "value:", value);
    if (prev === value) {
      return; // 值未变，不需要更新
    }
    this.__pseudoActive__[pseudo] = value;
    //
    this.markInlineStyleDirty();
    //清除当前节点
    this.invalidateResolvedStyleCache();
    //清除孩子节点
    this.invalidateChildrenResolvedStyleCache();
    //更新节点
    this.updateNativeNode();
  }

  //-----------------------------------------------
  // style scoped id for element
  private scopedIdList: NeedToTyped[] = [];

  constructor(tagName: string) {
    super(NodeType.ElementNode);

    // tag name should be lowercase
    this.tagName = tagName.toLowerCase();
    this.style = {};
    this.events = {};
    this.beforeLoadStyle = getBeforeLoadStyle();

    this.classList = new Set();
    this.attributes = {};

    // hack special problems
    this.hackSpecialIssue();
  }

  // style preprocessor
  public beforeLoadStyle: CallbackType;

  /**
   * get component info
   */
  public get component(): TagComponent {
    // If the value has been taken, return directly
    if (this.tagComponent) {
      return this.tagComponent;
    }

    // Otherwise, go to fetch and save
    this.tagComponent = getTagComponent(this.tagName);
    if (!this.tagComponent) {
      throw new Error(
        `组件 "${this.tagName}" 未注册或 Native 端未实现该组件。\n` +
          `👉 请检查：\n` +
          `1. 是否在 Vue 中通过 registerElement 注册了该组件；\n` +
          `2. 是否在原生 Native 端正确实现并导出 "${this.tagName}" 所需组件。`,
      );
    }
    return this.tagComponent;
  }

  public isRootNode(): boolean {
    const { rootContainer } = getHippyCachedInstance();
    return super.isRootNode() || this.id === rootContainer;
  }

  /**
   * append child node
   *
   * @param child - child node
   * @param isHydrate - is hydrate or not
   */
  public appendChild(child: HippyNode, isHydrate = false): void {
    // If the node type is text node, call setText method to set the text property
    if (child instanceof HippyText) {
      this.setText(child.text, { notToNative: true });
    }
    super.appendChild(child, isHydrate);
  }

  /**
   * Insert the node before the specified node
   *
   * @param child - node to be added
   * @param referenceNode - reference node
   */
  public insertBefore(child: HippyNode, referenceNode: HippyNode | null): void {
    // If the node type is text node, call setText method to set the text property
    if (child instanceof HippyText) {
      this.setText(child.text, { notToNative: true });
    }
    super.insertBefore(child, referenceNode);
  }

  /**
   * move child node before specified node
   *
   * @param child - child node that needs to be moved
   * @param referenceNode - reference node
   */
  public moveChild(child: HippyNode, referenceNode: HippyNode): void {
    // If the node type is text node, call setText method to set the text property
    if (child instanceof HippyText) {
      this.setText(child.text, { notToNative: true });
    }
    super.moveChild(child, referenceNode);
  }

  /**
   * remove child node
   *
   * @param child - node to be removed
   */
  public removeChild(child: HippyNode): void {
    // If the node type is text node, call setText method to set the text property
    if (child instanceof HippyText) {
      this.setText("", { notToNative: true });
    }
    super.removeChild(child);
  }

  /**
   * Check if an attribute is included
   *
   * @param key - attribute name
   */
  public hasAttribute(key: string): boolean {
    return !!this.attributes[key];
  }

  /**
   * get value of attribute
   *
   * @param key - attribute name
   */
  public getAttribute(key: string): NeedToTyped {
    return this.attributes[key];
  }

  /**
   * remove specified attribute
   *
   * @param key - attribute name
   */
  public removeAttribute(key: string): void {
    delete this.attributes[key];
  }

  /**
   * set attribute
   *
   * @param rawKey - attribute name
   * @param rawValue - attribute value
   * @param options - options
   */
  // eslint-disable-next-line complexity
  public setAttribute(rawKey: string, rawValue: NeedToTyped, options: NeedToTyped = {}): void {
    let value = rawValue;
    let key = rawKey;

    try {
      // detect expandable attrs for boolean values
      if (typeof this.attributes[key] === "boolean" && value === "") {
        value = true;
      }
      if (key === undefined) {
        !options.notToNative && this.updateNativeNode();
        return;
      }

      //liulipeng 清除样式缓存
      if (key == "class" || key == "id") {
        //
        this.markInlineStyleDirty();
        //清除当前节点
        this.invalidateResolvedStyleCache();
        //清除孩子节点
        this.invalidateChildrenResolvedStyleCache();
        //---------------------------------------------
        this.invalidateStyleCache();
      }

      switch (key) {
        case "class": {
          const newClassList = new Set(getStyleClassList(value));
          // If classList is not change, return directly
          if (setsAreEqual(this.classList, newClassList)) {
            return;
          }
          this.classList = newClassList;
          // update current node and child nodes
          !options.notToNative && this.updateNativeNode(true);
          return;
        }
        case "id":
          if (value === this.id) {
            return;
          }
          this.id = value;
          // update current node and child nodes
          !options.notToNative && this.updateNativeNode(true);
          return;
        // Convert text related to character for interface.
        case "text":
        case "value":
        case "defaultValue":
        case "placeholder": {
          if (typeof value !== "string") {
            try {
              value = value.toString();
            } catch (error) {
              warn(`Property ${key} must be string：${(error as Error).message}`);
            }
          }
          if (!options || !options.textUpdate) {
            // Only when non-text nodes are automatically updated,
            value = whitespaceFilter(value);
          }
          value = unicodeToChar(value);
          break;
        }
        case "numberOfRows":
          if (!Native.isIOS()) {
            return;
          }
          break;
        case "caretColor":
        case "caret-color":
          key = "caret-color";
          value = Native.parseColor(value);
          break;
        case "break-strategy":
          key = "breakStrategy";
          break;
        case "placeholderTextColor":
        case "placeholder-text-color":
          key = "placeholderTextColor";
          value = Native.parseColor(value);
          break;
        case "underlineColorAndroid":
        case "underline-color-android":
          key = "underlineColorAndroid";
          value = Native.parseColor(value);
          break;
        case "nativeBackgroundAndroid": {
          const nativeBackgroundAndroid = value;
          if (typeof nativeBackgroundAndroid.color !== "undefined") {
            nativeBackgroundAndroid.color = Native.parseColor(nativeBackgroundAndroid.color);
          }
          key = "nativeBackgroundAndroid";
          value = nativeBackgroundAndroid;
          break;
        }
        case "gradientBackground": {
          if (value.colors && value.colors.length > 0) {
            const values = value.colors.map(convertToAndroidHexColor);
            value.colors = values;
          }
          break;
        }
        default:
          break;
      }
      //
      if (this.attributes[key] === value) return;
      this.attributes[key] = value;
      //
      if (typeof this.filterAttribute === "function") {
        this.filterAttribute(this.attributes);
      }
      !options.notToNative && this.updateNativeNode();
    } catch (err) {
      // Throw error in development mode
      if (!IS_PROD) {
        throw err;
      }
    }
  }

  /**
   * set text
   *
   * @param text - text content
   * @param options - options
   */
  public setText(text: string, options: NeedToTyped = {}): void {
    return this.setAttribute("text", text, {
      notToNative: !!options.notToNative,
    });
  }

  /**
   * remove style attr
   */
  public removeInlineStyle(notToNative = false): void {
    // remove all style
    this.style = {};
    if (!notToNative) {
      this.updateNativeNode();
    }
  }

  /**
   * set styles batch
   *
   * @param batchStyles - batched style to set
   */
  public setInlineStyle(batchStyles) {
    if (!batchStyles || typeof batchStyles !== "object") {
      return;
    }
    let hasSensitive = false;
    let hasSensitiveValueChanged = false;

    const keys = Object.keys(batchStyles);

    for (const key of keys) {
      const newVal = batchStyles[key];
      const oldVal = this.style[key];
      // 判断是否是敏感样式
      const isSensitive = percentProps.includes(key) || remProps.includes(key);
      if (isSensitive) {
        hasSensitive = true;
        // 判断值是否真正发生变化（比如从 '50%' -> '50%' 就不算变）
        if (newVal !== oldVal) {
          hasSensitiveValueChanged = true;
        }
      }
    }
    // 决定是否失效缓存
    if (hasSensitiveValueChanged) {
      this.markInlineStyleDirty();
      //清除当前节点
      this.invalidateResolvedStyleCache();
      //清除孩子节点
      this.invalidateChildrenResolvedStyleCache();
    } else {
      // 非敏感变动或敏感但值未变，只需合并样式，不刷新解析缓存
      this.markInlineStyleDirty();
    }

    // 应用新样式
    Object.keys(batchStyles).forEach((styleKey) => {
      const styleValue = batchStyles[styleKey];
      this.setStyle(styleKey, styleValue, true);
    });
    // 注意：是否需要触发 updateNativeNode
    // 只有真正发生敏感变动才需要触发递归 update，否则仅当前节点更新即可
    this.updateNativeNode(hasSensitiveValueChanged);
  }

  /**
   * 清空所有孩子节点解析完毕的样式
   */
  private invalidateChildrenResolvedStyleCache(): void {
    this.eachNode((child) => {
      if (child instanceof HippyElement) {
        child.invalidateResolvedStyleCache();
      }
    });
  }

  /**
   * 在 HTML/CSS 或类 DOM 系统中，inline style 指的是直接写在组件/节点上的样式
   * get the inline style
   */
  getInlineStyle(): NativeNodeProps {
    const nodeStyle: NativeNodeProps = {};

    Object.keys(this.style).forEach((key) => {
      const styleValue = toRaw(this.style[key]);
      if (styleValue !== undefined) {
        nodeStyle[key] = styleValue;
      }
    });

    return nodeStyle;
  }

  updateInlineStyle(batchStyles): void {
    Object.keys(batchStyles).forEach((styleKey) => {
      if (this.style) {
        const styleValue = batchStyles[styleKey];
        this.style[styleKey] = styleValue;
      }
    });
  }

  /**
   * set style
   *
   * @param property - property name
   * @param value - property value
   * @param notToNative - not pass to native
   */
  // eslint-disable-next-line complexity
  public setStyle(property: string, value: NeedToTyped, notToNative = false): void {
    if (value === undefined) {
      delete this.style[property];
      if (!notToNative) {
        this.updateNativeNode();
      }
      return;
    }

    // 检测 value 是否含有 !important
    let important = false;
    try {
      if (typeof value === "string" && value.includes("!important")) {
        important = true;
        value = value.replace(/\s*!important\s*$/, "").trim();
        // ✅ 提示开发者无需使用 !important
        console.warn(
          `[setStyle] "${property}: ${value} !important" 中的 "!important" 会被忽略，` +
            `因为 Inline Style 本身就具有最高优先级，无需显式使用 !important。`,
        );
      }
    } catch (e) {}

    // Preprocess the style
    let { property: styleProperty, value: styleValue } = this.beforeLoadStyle({
      property,
      value,
    });
    // Process the specific style value
    switch (styleProperty) {
      case "fontWeight":
        if (typeof styleValue !== "string") {
          styleValue = styleValue.toString();
        }
        break;
      case "backgroundImage": {
        [styleProperty, styleValue] = parseBackgroundImage(styleProperty, styleValue);
        break;
      }
      case "background": {
        [styleProperty, styleValue] = parseBackground(styleProperty, styleValue);
        break;
      }
      case "border": {
        const parsed = parseBorder(styleProperty, styleValue);
        if (parsed && typeof parsed === "object") {
          for (const [subProp, subVal] of Object.entries(parsed)) {
            this.setStyle(subProp, subVal, true);
          }
          return;
        }
        break;
      }
      case "borderRadius": {
        const parsed = parseBorderRadius(styleProperty, styleValue);
        if (parsed && typeof parsed === "object") {
          for (const [subProp, subVal] of Object.entries(parsed)) {
            this.setStyle(subProp, subVal, true);
          }
          return;
        }
        break;
      }
      case "focusBorder": {
        const parsed = parseFocusBorder(styleProperty, styleValue);
        if (parsed && typeof parsed === "object") {
          for (const [subProp, subVal] of Object.entries(parsed)) {
            this.setStyle(subProp, subVal, true);
          }
          return;
        }
        break;
      }
      case "textShadowOffsetX":
      case "textShadowOffsetY": {
        [styleProperty, styleValue] = parseTextShadowOffset(styleProperty, styleValue, this.style);
        break;
      }
      case "textShadowOffset": {
        const { x = 0, width = 0, y = 0, height = 0 } = styleValue ?? {};
        styleValue = { width: x || width, height: y || height };
        break;
      }
      case "transform": {
        [styleProperty, styleValue] = parseTransform(styleProperty, styleValue);
        break;
      }
      default: {
        // Convert the property to W3C standard.
        if (Object.prototype.hasOwnProperty.call(PROPERTIES_MAP, styleProperty)) {
          styleProperty = PROPERTIES_MAP[styleProperty as keyof PropertiesMapType];
        }
        // Convert the value
        if (typeof styleValue === "string") {
          styleValue = styleValue.trim();
          // Convert inline color style to int
          if (styleProperty.toLowerCase().indexOf("color") >= 0) {
            styleValue = Native.parseColor(styleValue);
            // Convert inline length style, drop the px unit
          } else if (styleValue.endsWith("px")) {
            styleValue = parseFloat(styleValue.slice(0, styleValue.length - 2));
          } else {
            styleValue = tryConvertNumber(styleValue);
          }
        }
      }
    }

    // If the style value does not exist or is equal to the original value, return directly
    if (
      styleValue === undefined ||
      styleValue === null ||
      this.style[styleProperty] === styleValue
    ) {
      return;
    }

    this.style[styleProperty] = styleValue;

    // directly update the native node
    if (!notToNative) {
      this.updateNativeNode();
    }
  }

  /**
   * Scroll children to specific position.
   */
  public scrollToPosition(
    x: number | undefined = 0,
    y: number | undefined = 0,
    rawDuration: number | boolean = 1000,
  ): void {
    if (typeof x !== "number" || typeof y !== "number") {
      return;
    }
    let duration = rawDuration;

    if (duration === false) {
      duration = 0;
    }

    Native.callUIFunction(this, "scrollToWithOptions", [{ x, y, duration }]);
  }

  /**
   * Native implementation for the Chrome/Firefox Element.scrollTop method
   */
  public scrollTo(
    x:
      | number
      | {
          left: number;
          top: number;
          behavior: string;
          duration: number | boolean;
        },
    y?: number,
    duration?: number | boolean,
  ): void {
    if (typeof x === "object" && x) {
      const { left, top, behavior = "auto", duration: animationDuration } = x;
      this.scrollToPosition(left, top, behavior === "none" ? 0 : animationDuration);
    } else {
      this.scrollToPosition(x, y, duration);
    }
  }

  setListenerHandledType(key: string, type) {
    if (this.events[key]) {
      this.events[key].handledType = type;
    }
  }

  isListenerHandled(key: string, type) {
    if (this.events[key] && type !== this.events[key].handledType) {
      // if handledType not equals to type params, this event needs updated
      // if handledType equals to undefined, this event needs created
      return false;
    }
    // if event not existed, marked it has been handled
    return true;
  }

  /**
   * parse vue event name to native event name and return
   *
   * @param eventName - vue event name
   */
  getNativeEventName(eventName: string) {
    let nativeEventName = `on${capitalizeFirstLetter(eventName)}`;
    if (this.component) {
      const { eventNamesMap } = this.component;
      if (eventNamesMap?.get(eventName)) {
        nativeEventName = eventNamesMap.get(eventName) as string;
      }
    }
    return nativeEventName;
  }

  /**
   * add element event listener
   *
   * @param rawEventNames - event names
   * @param rawCallback - callback
   * @param rawOptions - options
   */
  public addEventListener(
    rawEventNames: string,
    rawCallback: CallbackType,
    rawOptions?: EventListenerOptions,
  ): void {
    let eventNames = rawEventNames;
    let callback = rawCallback;
    let options = rawOptions;
    let isNeedUpdate = true;
    // Added default scrollEventThrottle when scroll event is added.
    if (eventNames === "scroll" && !(this.getAttribute("scrollEventThrottle") > 0)) {
      this.attributes.scrollEventThrottle = 200;
    }

    // get the native event name
    const ssrEventName = this.getNativeEventName(eventNames);
    if (this.attributes[ssrEventName]) {
      // ssrEventName attribute exist means this is ssrNode, the native event props has been
      // set before, unnecessary to update
      isNeedUpdate = false;
    }

    // If there is an event polyfill, override the event names, callback and options
    if (typeof this.polyfillNativeEvents === "function") {
      ({ eventNames, callback, options } = this.polyfillNativeEvents(
        EventMethod.ADD,
        eventNames,
        callback,
        options,
      ));
    }
    super.addEventListener(eventNames, callback, options);
    transverseEventNames(eventNames, (eventName) => {
      const nativeEventName = this.getNativeEventName(eventName);
      if (!this.events[nativeEventName]) {
        this.events[nativeEventName] = {
          name: nativeEventName,
          type: EventHandlerType.ADD,
          listener: createEventListener(nativeEventName, eventName),
          isCapture: false,
        };
      } else if (
        this.events[nativeEventName] &&
        this.events[nativeEventName].type !== EventHandlerType.ADD
      ) {
        this.events[nativeEventName].type = EventHandlerType.ADD;
      }
    });
    // update native node
    if (isNeedUpdate) {
      this.updateNativeEvent();
    }
  }

  /**
   * remove event listener
   *
   * @param rawEventNames - event type
   * @param rawCallback - callback
   * @param rawOptions - options
   */
  public removeEventListener(
    rawEventNames: string,
    rawCallback: CallbackType,
    rawOptions?: EventListenerOptions,
  ): void {
    let eventNames = rawEventNames;
    let callback = rawCallback;
    let options = rawOptions;
    // If there is an event polyfill, override the event names, callback and options
    if (typeof this.polyfillNativeEvents === "function") {
      ({ eventNames, callback, options } = this.polyfillNativeEvents(
        EventMethod.REMOVE,
        eventNames,
        callback,
        options,
      ));
    }
    super.removeEventListener(eventNames, callback, options);
    transverseEventNames(eventNames, (eventName) => {
      const nativeEventName = this.getNativeEventName(eventName);
      if (this.events[nativeEventName]) {
        this.events[nativeEventName].type = EventHandlerType.REMOVE;
      }
    });
    // get the native event insert before
    const ssrEventName = this.getNativeEventName(eventNames);
    if (this.attributes[ssrEventName]) {
      // remove exist ssr native event attr
      delete this.attributes[ssrEventName];
    }
    // update native node
    this.updateNativeEvent();
  }

  /**
   * dispatch event
   *
   * @param rawEvent - event object
   */
  public dispatchEvent(
    rawEvent: HippyEvent,
    targetNode: HippyElement,
    domEvent?: HippyTypes.DOMEvent,
  ): void {
    const event = rawEvent;

    event.currentTarget = this;

    if (!event.target) {
      event.target = this;

      // TODO: Does not cover all terminal events, so instanceof cannot be used here, simply bypass it first
      if (eventIsKeyboardEvent(event)) {
        (event.target as HippyElement).value = event.value;
      }
    }

    //---------------------伪类处理焦点事件---------------------------
    //focus
    if (event.type === "focus") {
      const focusEvent = event as FocusEvent;
      const isFocused = focusEvent.isFocused ?? false;

      this.setPseudoState("focus", isFocused);
    }
    //loadEnd 图片处理自动宽高
    else if (event.type === "loadEnd" && this.tagName == "img") {
      //stop bubbles
      event.bubbles = false;
      const evt = event as HippyLoadResourceEvent;

      const inlineStyle = this.getInlineStyle();
      const cssStyle = this.__cssMatchedStyleCache?.normal ?? {};

      //
      const width = inlineStyle.width ?? cssStyle.width ?? this.style.width;
      const height = inlineStyle.height ?? cssStyle.height ?? this.style.height;

      const hasWidth = width !== undefined;
      const hasHeight = height !== undefined;

      // 仅当没有宽高时设置
      const image = evt.image;
      // image 宽高必须合法
      const imageWidth = typeof image?.width === "number" ? image.width : null;
      const imageHeight = typeof image?.height === "number" ? image.height : null;
      const aspectRatio = imageWidth && imageHeight ? imageWidth / imageHeight : null;

      let didChange = false;

      //
      let displayWidth = width;
      let displayHeight = height;

      try {
        if (!hasWidth && !hasHeight && imageWidth && imageHeight) {
          // 宽高都没有 → 使用 image 的尺寸
          displayWidth = imageWidth;
          displayHeight = imageHeight;
          didChange = true;
        } else if (!hasWidth && hasHeight && imageWidth && imageHeight && aspectRatio) {
          // 仅缺宽度 → 用高度推宽度
          displayWidth = height * aspectRatio;
          displayHeight = height;
          didChange = true;
        } else if (hasWidth && !hasHeight && imageWidth && imageHeight && aspectRatio) {
          // 仅缺高度 → 用宽度推高度
          displayWidth = width;
          displayHeight = width / aspectRatio;
          didChange = true;
        }

        // 只有宽高有更新时才触发更新
        if (didChange && image) {
          this.setInlineStyle({
            width: displayWidth,
            height: displayHeight,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    //--------------------------------------------------------------------------------------------
    this.emitEvent(event);

    // event bubbling
    if (!event.bubbles && domEvent) {
      domEvent.stopPropagation();
    }
  }

  /**
   * convert hippy vue node to Native Node
   *
   * @param isIncludeChild - should or no convert child node recursive
   */
  public convertToNativeNodes(
    isIncludeChild: boolean,
    refInfo: HippyTypes.ReferenceInfo = {},
  ): convertToNativeNodesReturnedVal {
    // If the node does not need to be inserted into native, return directly
    if (!this.isNeedInsertToNative) {
      return [[], [], []];
    }

    if (isIncludeChild) {
      return super.convertToNativeNodes(true, refInfo);
    }

    // get styles
    let style: NativeNodeProps = this.getNativeStyles();

    if (this.parentNode && this.parentNode instanceof HippyElement) {
      // Implement attribute inheritance logic
      // Only inherit color and font properties
      const parentNodeStyle = this.parentNode.getResolvedStyle;
      const styleAttributes = [
        "color",
        "fontSize",
        "fontWeight",
        "fontFamily",
        "fontStyle",
        "textAlign",
        "lineHeight",
      ];

      if (parentNodeStyle) {
        styleAttributes.forEach((attribute) => {
          if (!style[attribute] && parentNodeStyle[attribute]) {
            style[attribute] = parentNodeStyle[attribute];
          }
        });
      }
    }

    getBeforeRenderToNative()(this, style);

    /*
     * append defaultNativeStyle later to avoid incorrect compute style from
     * inherit node in beforeRenderToNative hook
     */
    if (this.component.defaultNativeStyle) {
      const { defaultNativeStyle } = this.component;
      const updateStyle: NativeNodeProps = {};
      Object.keys(defaultNativeStyle).forEach((key) => {
        if (!this.getAttribute(key)) {
          // save no default value style
          updateStyle[key] = defaultNativeStyle[key];
        }
      });
      style = { ...updateStyle, ...style };
    }

    const elementExtraAttributes: Partial<NativeNode> = {
      name: this.component.name,
      props: {
        // node props
        ...this.getNativeProps(),
        // node events
        ...this.getNativeEvents(),
        // node style
        style,
      },
      tagName: this.tagName,
    };

    // hack in dev environment, added properties for chrome inspector debugging
    if (!IS_PROD) {
      if (elementExtraAttributes.props) {
        elementExtraAttributes.props.attributes = this.getNodeAttributes();
      }
    }

    // handle special cases of text input components
    parseTextInputComponent(this, style);

    // handle special cases of view component
    parseViewComponent(this, elementExtraAttributes, style);

    return super.convertToNativeNodes(false, refInfo, elementExtraAttributes);
  }

  /**
   * When loaded via HMR or dynamically, redraw the element with the latest style map
   */
  public repaintWithChildren(): void {
    this.updateNativeNode(true);
  }

  /**
   * set native style props
   */
  public setNativeProps(nativeProps: NeedToTyped): void {
    if (nativeProps) {
      const { style } = nativeProps;
      this.setInlineStyle(style);
    }
  }

  /**
   * Set pressed state
   *
   * @param pressed - whether to press
   */
  public setPressed(pressed: boolean): void {
    Native.callUIFunction(this, "setPressed", [pressed]);
  }

  /**
   * Set hot zone
   *
   * @param x - x coordinate
   * @param y - y coordinate
   */
  public setHotspot(x: number, y: number): void {
    Native.callUIFunction(this, "setHotspot", [x, y]);
  }

  /**
   * save scoped id for element
   *
   * @param scopeStyleId - scoped style id
   */
  public setStyleScope(scopeStyleId: NeedToTyped): void {
    const scopedId = typeof scopeStyleId !== "string" ? scopeStyleId.toString() : scopeStyleId;
    if (scopedId && !this.scopedIdList.includes(scopedId)) {
      this.scopedIdList.push(scopedId);
    }
  }

  /**
   * get style scoped id
   */
  public get styleScopeId() {
    return this.scopedIdList;
  }

  /**
   * TODO LIULIPENG 样式解析入口
   * get the style attribute of the node according to the global style sheet
   */
  private getNativeStyles(): NativeNodeProps {
    const version = getGlobalCssMapVersion();

    // ✅ 样式未变，inlineStyle 有变化，需要合并
    if (
      this.__resolvedStyleVersion === version &&
      this.__resolvedStyleCache &&
      this.isInlineStyleDirty()
    ) {
      const merged = { ...this.__resolvedStyleCache, ...this.getInlineStyle() };
      this.markInlineStyleClean();
      return merged;
    }

    // ✅ 样式未变，无变动
    if (this.__resolvedStyleVersion === version && this.__resolvedStyleCache) {
      return this.__resolvedStyleCache;
    }

    // 🚨 缓存失效，需要走解析
    const cssStyle = this.getMatchedCssStyleWithCache(); // 缓存部分
    const inlineStyle = this.getInlineStyle(); // 动态部分

    const finalCss: NativeNodeProps = { ...cssStyle.normal };

    // 合并当前伪类状态下样式
    if (this.__pseudoActive__) {
      for (const pseudo in cssStyle.__pseudo__) {
        try {
          // 处理标准伪类（如 :focus）
          // 提取标准伪类的基础类型（如 nth-child(2) → nth-child）
          const base = pseudo.includes("(") ? pseudo.slice(0, pseudo.indexOf("(")) : pseudo;
          if (this.__pseudoActive__[base]) {
            Object.assign(finalCss, cssStyle.__pseudo__[pseudo]);
          }
          // 处理 :not(:xxx) 伪类
          if (pseudo.startsWith("not(") && pseudo.endsWith(")")) {
            const inner = pseudo.slice(4, -1).replace(/^:/, ""); // 提取 "focus"
            if (!this.__pseudoActive__[inner]) {
              Object.assign(finalCss, cssStyle.__pseudo__[pseudo]);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 最后合并 inline style（优先级最高）
    const merged = { ...finalCss, ...cssStyle.important, ...inlineStyle };
    const resolved = resolveStyle(this, merged);
    this.__resolvedStyleCache = resolved;
    this.__resolvedStyleVersion = version;
    this.__inlineStyleDirty = false;
    return resolved;
  }

  getMatchedCssStyleWithCache(): {
    normal: NativeNodeProps;
    important: NativeNodeProps;
    __pseudo__: Record<string, NativeNodeProps>;
  } {
    const version = getGlobalCssMapVersion();

    if (this.__cssMatchedStyleCache && this.__cssMatchedStyleVersion === version) {
      info("【样式匹配】：使用缓存样式", this.__cssMatchedStyleCache);
      return this.__cssMatchedStyleCache;
    }

    const normal: NativeNodeProps = {};
    const important: NativeNodeProps = {};
    const pseudoMap: Record<string, NativeNodeProps> = {};

    const matchedSelectors = getCssMap().query(this);

    for (const matchedSelector of matchedSelectors.selectors) {
      if (!isStyleMatched(matchedSelector, this)) {
        continue;
      }

      const ruleSet = matchedSelector.ruleSet;
      if (!ruleSet?.declarations?.length) continue;

      // 判断是否包含伪类（注意：这需要你确保 matchedSelector.pseudoClass 是在构造时挂上的）
      const pseudos = matchedSelector.pseudoClass;
      if (Array.isArray(pseudos) && pseudos.length > 0) {
        // 伪类样式分发到每个伪类的样式对象里
        for (const pseudoName of pseudos) {
          const targetStyle = (pseudoMap[pseudoName] ??= {});
          for (const decl of ruleSet.declarations) {
            targetStyle[decl.property] = decl.value;
            //
            if (decl.important) {
              important[decl.property] = decl.value;
            }
          }
        }
      } else {
        // 普通样式
        for (const decl of ruleSet.declarations) {
          normal[decl.property] = decl.value;
          if (decl.important) {
            important[decl.property] = decl.value;
          }
        }
      }
    }

    // 缓存所有状态样式，包括 normal 和伪类样式
    const styleResult = {
      normal,
      important,
      __pseudo__: pseudoMap,
    };
    this.__cssMatchedStyleCache = styleResult;
    this.__cssMatchedStyleVersion = version;
    return styleResult;
  }

  /**
   * When generating props for Native Node, some additional logic needs to be hacked
   *
   * @param rawProps - original props
   */
  private hackNativeProps(rawProps: NativeNodeProps) {
    const props = rawProps;

    // solve the problem of src props of iOS image, which should be repaired by native
    if (this.tagName === "img") {
      if (!props.onLoadEnd) {
        props.onLoadEnd = true;
      }
    }
  }

  /**
   * get the props of the Native node, the properties include the properties of the node and
   * the default properties of the component to which the node belongs
   */
  private getNativeProps(): NativeNodeProps {
    const props: NativeNodeProps = {};
    const { defaultNativeProps } = this.component;

    // first add default props
    if (defaultNativeProps) {
      Object.keys(defaultNativeProps).forEach((key) => {
        // the property has not been set, use the default property to set
        if (this.getAttribute(key) === undefined) {
          const prop = defaultNativeProps[key];

          // if the default property is a function, execute, otherwise assign directly
          props[key] = isFunction(prop) ? prop(this) : toRaw(prop);
        }
      });
    }

    // then convert the attributes of the node itself
    Object.keys(this.attributes).forEach((key) => {
      let value = toRaw(this.getAttribute(key));

      // if the key does not exist in the map, assign it directly
      if (!this.component.attributeMaps || !this.component.attributeMaps[key]) {
        props[key] = toRaw(value);
        return;
      }

      // If there is an attribute in the attribute map, and the map value is a string, use the map as the key
      const map = this.component.attributeMaps[key];
      if (isString(map)) {
        props[map] = toRaw(value);
        return;
      }

      // If it is a method, use the value after the method is executed as the attribute value
      if (isFunction(map)) {
        props[key] = toRaw(map(value));
        return;
      }

      const { name: propsKey, propsValue, jointKey } = map;
      if (isFunction(propsValue)) {
        value = propsValue(value);
      }
      // If jointKey is set, multiple properties will be written to the same jointKey object
      if (jointKey) {
        props[jointKey] = props[jointKey] ?? {};

        Object.assign(props[jointKey], {
          [propsKey]: toRaw(value),
        });
      } else {
        props[propsKey] = toRaw(value);
      }
    });

    const { nativeProps } = this.component;
    if (nativeProps) {
      // Then process the configured nativeProps,
      // the priority here is the highest, and if there are settings, it will override others
      Object.keys(nativeProps).forEach((key) => {
        props[key] = toRaw(nativeProps[key]);
      });
    }

    // Finally handle the hack logic
    this.hackNativeProps(props);

    return props;
  }

  /**
   * Get the attributes of the target node for chrome inspector
   */
  private getNodeAttributes() {
    try {
      const nodeAttributes = deepCopy(this.attributes);
      const classInfo = Array.from(this.classList ?? []).join(" ");
      const attributes = {
        id: this.id,
        nodeId: `${this.nodeId}`,
        hippyNodeId: `${this.nodeId}`,
        class: classInfo,
        ...nodeAttributes,
      };

      // remove unwanted properties
      delete attributes.text;
      delete attributes.value;

      Object.keys(attributes).forEach((key) => {
        if (key !== "id" && key !== "hippyNodeId" && key !== "class") {
          // value may big int that iOS do not support, should delete
          delete attributes[key];
        }
      });

      return attributes;
    } catch (error) {
      return {};
    }
  }

  /**
   * Get the list of events bound to the node and convert it to the list required by the native node event properties
   */
  private getNativeEvents(): NativeNodeProps {
    const events: NativeNodeProps = {};
    const eventList = this.getEventListenerList();
    // The event keys taken out here are all events
    // registered by vue, which are the event names with the on prefix removed.
    const eventKeys = Object.keys(eventList);

    if (eventKeys.length) {
      const { eventNamesMap } = this.component;

      // If the node belongs to a custom component and has a custom event map, use the custom event map
      // For example, the node registers the event "appear", but the event name in Native is called onWidgetShow
      eventKeys.forEach((eventKey) => {
        const nativeEventName = eventNamesMap?.get(eventKey);
        if (nativeEventName) {
          // there is a native mapping name, just use the native event name directly
          events[nativeEventName] = !!eventList[eventKey];
        } else {
          // otherwise, like other vue events, capitalize the first letter and prefix it with on
          const name = `on${capitalizeFirstLetter(eventKey)}`;
          events[name] = !!eventList[eventKey];
        }
      });
    }

    return events;
  }

  /**
   * Unified invocation of logic that requires special handling
   */
  private hackSpecialIssue() {
    // special handling of node attributes
    this.fixVShowDirectiveIssue();
  }

  /**
   * Fix the problem that the v-show does not take effect
   *
   */
  private fixVShowDirectiveIssue(): void {
    // use current value if exists
    let display = this.style.display ?? undefined;
    // watch the modification of this.style.display and update it with the modified value
    // fixme If the user here actively sets the display by means of setStyle,
    // the updateNode may be triggered one more time, here's how to deal with it
    Object.defineProperty(this.style, "display", {
      enumerable: true,
      configurable: true,
      get() {
        return display;
      },
      set: (newValue: string) => {
        // the display property in hippy defaults to flex
        display = newValue === undefined ? "flex" : newValue;
        // update native node
        this.updateNativeNode();
      },
    });
  }
}
