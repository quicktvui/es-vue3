/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
/* eslint-disable key-spacing */
/* eslint-disable no-cond-assign */
/* eslint-disable arrow-body-style */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line max-classes-per-file
import type { CssDeclarationType } from "@extscreen/es3-vue-style-parser";

import type { HippyElement } from "../element/hippy-element";
import type { HippyNode } from "../node/hippy-node";

import { isNullOrUndefined } from "../../util";
import type { SelectorsMap, SelectorsMatch } from "./css-selectors-match";
import { info } from "./log";

//------------------------------------------------------------------------
/**
 * wrap string text
 *
 * @param text - string
 */
function wrap(text: string | undefined): string {
  return text ? ` ${text}` : "";
}

/**
 * Base classes
 */
class SelectorCore {
  public __name?: string;

  // is it a dynamic style
  public dynamic?: boolean;

  // style weight
  public specificity = 0;

  // rule set
  public ruleSet?: RuleSet;

  /**
   * Sort and store style rules according to categories,
   * such as id selectors are grouped into one category, class names are grouped into one category, etc.
   *
   * @param sorter - sort rules
   * @param base - base
   */
  lookupSort(sorter: SelectorsMap, base?: SelectorCore): void {
    sorter.sortAsUniversal(base ?? this);
  }

  /**
   * remove sort
   *
   * @param sorter - sort rules
   * @param base - base
   */
  removeSort(sorter: SelectorsMap, base?: SelectorCore): void {
    sorter.removeAsUniversal(base ?? this);
  }
}

//------------------------------------------------------------------------

/**
 * Simple selector type
 * provides the method for judging whether a node matches and the method for tracking node attributes
 */
class SimpleSelector extends SelectorCore {
  // rarity of style
  public rarity = 0;

  public combinator?: string;

  public accumulateChanges(node: HippyElement, match: SelectorsMatch) {
    if (!this.dynamic) {
      const ret = this.match(node);
      info("SimpleSelector !dynamic match result: ", ret);
      return ret;
    }
    if (this.mayMatch(node)) {
      this.trackChanges(node, match);
      info("SimpleSelector mayMatch result: ", true);
      return true;
    }
    info("SimpleSelector default result: ", false);
    return false;
  }

  /**
   * determine if the node matches
   *
   * @param node - target node
   */
  public match(node: HippyElement): boolean {
    info("SimpleSelector match result: ", !!node);
    return !!node;
  }

  /**
   * prejudgment
   *
   * @param node - target node
   */
  public mayMatch(node: HippyElement) {
    const ret = this.match(node);
    info("SimpleSelector mayMatch result: ", ret, "node: ", node);
    return ret;
  }

  /**
   * track changes of node
   *
   * @param node - target node
   * @param match - SelectorsMatch
   */
  public trackChanges(node?: HippyElement, match?: SelectorsMatch): void {
    if (node && match) {
      /**
       * fixme This should be defined as an abstract method, but because some selectors do not need this method,
       * it is not sure which methods do not need it, so leave it blank first
       */
    }
  }
}

class SimpleSelectorSequence extends SimpleSelector {
  public head: SimpleSelector | null | boolean;

  // list of selector
  public selectors: SimpleSelector[];

  constructor(selectors: SimpleSelector[]) {
    super();
    this.__name = "SimpleSelectorSequence";
    this.specificity = selectors.reduce((sum, sel) => sel.specificity + sum, 0);
    this.head = selectors.reduce((prev: null | boolean | SimpleSelector, curr: SimpleSelector) => {
      return !prev || (prev instanceof SimpleSelector && curr.rarity > prev.rarity) ? curr : prev;
    }, null);
    this.dynamic = selectors.some((sel) => sel.dynamic);
    this.selectors = selectors;
  }

  toString(): string {
    return `${this.selectors.join("")}${wrap(this.combinator)}`;
  }

  match(node?: HippyElement): boolean {
    if (!node) {
      return false;
    }
    return this.selectors.every((sel) => sel.match(node));
  }

  mayMatch(node?: HippyElement): boolean {
    if (!node) {
      return false;
    }
    const ret = this.selectors.every((sel) => {
      return sel.mayMatch(node);
    });
    info("SimpleSelectorSequence mayMatch result: ", ret, this.selectors);
    return ret;
  }

  trackChanges(node: HippyElement, match: SelectorsMatch): void {
    this.selectors.forEach((sel) => sel.trackChanges(node, match));
  }

  lookupSort(sorter: SelectorsMap, base: SelectorCore): void {
    if (this.head && this.head instanceof SimpleSelector) {
      this.head.lookupSort(sorter, base ?? this);
    }
  }

  removeSort(sorter: SelectorsMap, base?: SelectorCore): void {
    if (this.head && this.head instanceof SimpleSelector) {
      this.head.removeSort(sorter, base ?? this);
    }
  }
}

/**
 * Generic selector type, eg. *
 */
class UniversalSelector extends SimpleSelector {
  constructor() {
    super();
    this.__name = "UniversalSelector";
    this.specificity = 0x00000000;
    this.rarity = 0;
    this.dynamic = false;
  }

  toString(): string {
    return `*${wrap(this.combinator)}`;
  }

  match(): boolean {
    info("UniversalSelector match result: ", true);
    // universal selectors can all match
    return true;
  }
}

/**
 * ID selector, eg. #root
 */
class IdSelector extends SimpleSelector {
  public id: string;

  constructor(id: string) {
    super();
    this.__name = "IdSelector";
    this.specificity = 0x00010000;
    this.rarity = 3;
    this.dynamic = false;
    this.id = id;
  }

  toString(): string {
    return `#${this.id}${wrap(this.combinator)}`;
  }

  match(node?: HippyElement): boolean {
    if (!node) {
      return false;
    }
    const ret = node.id === this.id;
    info("IdSelector match result: ", ret);
    return ret;
  }

  lookupSort(sorter: SelectorsMap, base: SelectorCore): void {
    sorter.sortById(this.id, base ?? this);
  }

  removeSort(sorter: SelectorsMap, base?: SelectorCore): void {
    sorter.removeById(this.id, base ?? this);
  }
}

/**
 * tag selector, eg. div, ul
 */
class TypeSelector extends SimpleSelector {
  public cssType: string;

  constructor(cssType: string) {
    super();
    this.__name = "TypeSelector";
    this.specificity = 0x00000001;
    this.rarity = 1;
    this.dynamic = false;
    this.cssType = cssType;
  }

  toString(): string {
    return `${this.cssType}${wrap(this.combinator)}`;
  }

  match(node?: HippyElement): boolean {
    if (!node) {
      return false;
    }
    const ret = node.tagName === this.cssType;
    info("TypeSelector match result: ", ret, "node: ", node, "cssType: ", this.cssType);
    return ret;
  }

  mayMatch(node: HippyElement) {
    const ret = this.match(node);
    info("TypeSelector mayMatch result: ", ret, "node: ", node);
    return ret;
  }

  lookupSort(sorter: SelectorsMap, base: SelectorCore): void {
    sorter.sortByType(this.cssType, base ?? this);
  }

  removeSort(sorter: SelectorsMap, base?: SelectorCore): void {
    sorter.removeByType(this.cssType, base ?? this);
  }
}

/**
 * class selector
 */
class ClassSelector extends SimpleSelector {
  public className: string;

  constructor(className: string) {
    super();
    this.__name = "ClassSelector";
    this.specificity = 0x00000100;
    this.rarity = 2;
    this.dynamic = false;
    this.className = className;
  }

  toString(): string {
    return `.${this.className}${wrap(this.combinator)}`;
  }

  match(node?: HippyElement): boolean {
    if (!node) {
      return false;
    }
    const ret = !!(node.classList.size && node.classList.has(this.className));
    info("ClassSelector match result: ", ret);
    return ret;
  }

  lookupSort(sorter: SelectorsMap, base: SelectorCore): void {
    sorter.sortByClass(this.className, base ?? this);
  }

  removeSort(sorter: SelectorsMap, base?: SelectorCore): void {
    sorter.removeByClass(this.className, base ?? this);
  }
}

/**
 * pseudo class selector, not currently supported
 */
class PseudoClassSelector extends SimpleSelector {
  public cssPseudoClass: string;
  // 你需要加上：
  public pseudoClass?: string;

  private selector?: SimpleSelector | null;

  constructor(cssPseudoClass: string, selector?: SimpleSelector | null) {
    super();
    this.__name = "PseudoClassSelector";
    this.specificity = 0x00000100;
    this.rarity = 0;
    this.dynamic = true;
    this.cssPseudoClass = cssPseudoClass;
    this.selector = selector;
  }

  toString(): string {
    return `:${this.cssPseudoClass}${wrap(this.combinator)}`;
  }
  /**
   * 核心：当前伪类是否在该节点上匹配
   */
  match(node: HippyElement): boolean {
    const parent = node.parentNode;
    if (!parent) return false;

    switch (this.cssPseudoClass) {
      case "empty":
        const hasRenderableChildren = node.childNodes.some(
          (n) => (n.nodeType === 1 || n.nodeType === 3) && n.isNeedInsertToNative,
        );
        return !hasRenderableChildren;

      case "first-child": {
        const children = parent.childNodes;
        for (const child of children) {
          if (child.nodeType === 1 /* ELEMENT_NODE */ && child.isNeedInsertToNative) {
            return child === node; // 是第一个元素子节点
          }
        }
        return false;
      }

      case "last-child": {
        const children = parent.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
          const child = children[i];
          if (child.nodeType === 1 /* ELEMENT_NODE */ && child.isNeedInsertToNative) {
            return child === node;
          }
        }
        return false;
      }

      case "only-child": {
        const children = parent.childNodes.filter(
          (n) => n.nodeType === 1 && n.isNeedInsertToNative,
        );
        return children.length === 1 && children[0] === node;
      }
      default:
        // 简单支持 nth-child(n)
        if (this.cssPseudoClass.trim().startsWith("nth-child(")) {
          if (!parent || !parent.childNodes) return false;
          try {
            // "nth-child(1)": // 可选: 特化处理
            // "nth-child(2)": // 可选: 可以扩展成通用解析器
            const elementChildren = parent.childNodes.filter(
              (n) => n.nodeType === 1 && n.isNeedInsertToNative,
            ); // 只保留元素节点
            const index = elementChildren.indexOf(node);
            if (index === -1) return false;
            const inner = this.cssPseudoClass.slice(10, -1).trim(); // 提取括号内的内容
            const nth = parseInt(inner, 10);
            if (!isNaN(nth)) {
              return index === nth - 1; // nth-child 是从 1 开始的，index 是从 0 开始
            }
          } catch (e) {}
          return false; // 暂不支持奇偶等复杂表达式
        }

        // 默认对动态伪类如 :focus 等保留原逻辑
        // if (this.cssPseudoClass === "focus") {
        //   return !!node.pseudoActive?.focus;
        // }
        return true;
    }
  }

  /**
   * 如果节点可能在未来匹配该伪类，则返回 true（如 hover、focus）
   */
  mayMatch(): boolean {
    return true; // 因为是伪类，默认都可能变成 true
  }

  /**
   * 注册伪类依赖（用于动态跟踪）
   */
  trackChanges(node: HippyElement, match: SelectorsMatch): void {
    if (!node._pseudoClassDependencies) {
      node._pseudoClassDependencies = new Set();
    }
    node._pseudoClassDependencies.add(this.cssPseudoClass);
    //
    match.addPseudoClass(node, this.cssPseudoClass);
  }
}

/**
 * get node attribute or styleScopeId value
 * @param node
 * @param attribute
 * @returns {*}
 */
const getNodeAttrVal = (node, attribute) => {
  const attr = node.attributes[attribute];
  if (typeof attr !== "undefined") {
    return attr;
  }
  if (Array.isArray(node.styleScopeId) && node.styleScopeId.includes(attribute)) {
    return attribute;
  }
};

/**
 * Attribute Selector
 */
class AttributeSelector extends SimpleSelector {
  // attribute of node
  public attribute = "";

  // property Test Conditions
  public test = "";

  // value of node
  public value = "";

  // eslint-disable-next-line complexity
  constructor(attribute: string, test = "", value = "") {
    super();

    this.__name = "AttributeSelector";

    this.specificity = 0x00000100;
    this.rarity = 0;
    this.dynamic = true;
    this.attribute = attribute;
    this.test = test;
    this.value = value;

    if (!test) {
      // HasAttribute
      this.match = (node?: HippyElement) => {
        if (!node || !node.attributes) {
          return false;
        }
        const ret = !isNullOrUndefined(getNodeAttrVal(node, attribute));
        info("AttributeSelector !test match result: ", ret);
        return ret;
      };
      return;
    }

    if (!value) {
      info("AttributeSelector !value match result: ", false);
      this.match = () => false;
      return;
    }

    this.match = (node?: HippyElement) => {
      if (!node || !node.attributes) {
        info("AttributeSelector match result: ", false);
        return false;
      }
      const attr = `${getNodeAttrVal(node, attribute)}`;
      if (test === "=") {
        // Equal
        return attr === value;
      }

      if (test === "^=") {
        // PrefixMatch
        return attr.startsWith(value);
      }

      if (test === "$=") {
        // SuffixMatch
        return attr.endsWith(value);
      }

      if (test === "*=") {
        // SubstringMatch
        return attr.indexOf(value) !== -1;
      }

      if (test === "~=") {
        // Includes
        const words = attr.split(" ");
        return words?.indexOf(value) !== -1;
      }

      if (test === "|=") {
        // DashMatch
        return attr === value || attr.startsWith(`${value}-`);
      }

      return false;
    };
  }

  toString(): string {
    return `[${this.attribute}${wrap(this.test)}${(this.test && this.value) || ""}]${wrap(
      this.combinator,
    )}`;
  }

  /**
   * return false
   *
   * @param node - target node
   */
  match(node?: HippyElement): boolean {
    const ret = node ? !node : false;
    info("AttributeSelector match result: ", ret);
    return ret;
  }

  mayMatch(): boolean {
    return true;
  }

  trackChanges(node: HippyElement, match: SelectorsMatch): void {
    match.addAttribute(node, this.attribute);
  }
}

/**
 * Invalid Selector
 */
class InvalidSelector extends SimpleSelector {
  public error: Error;

  constructor(error: Error) {
    super();
    this.__name = "InvalidSelector";
    this.specificity = 0x00000000;
    this.rarity = 4;
    this.dynamic = false;
    this.combinator = undefined;
    this.error = error;
  }

  toString(): string {
    return `<error: ${this.error}>`;
  }

  match(): boolean {
    return false;
  }

  lookupSort(): null {
    return null;
  }

  removeSort(): null {
    return null;
  }
}

/**
 * child node group
 */
class ChildGroup {
  // list of selector
  public selectors: SelectorCore[];

  // is dynamic
  public dynamic: boolean;

  public __name: string;

  constructor(selectors) {
    this.__name = "ChildGroup";
    this.selectors = selectors;
    this.dynamic = selectors.some((sel) => sel.dynamic);
  }

  match(node) {
    //原版本
    // if (!node) {
    //   return false;
    // }
    // const pass = this.selectors.every((sel, i) => {
    //   if (i !== 0) {
    //     node = node.parentNode;
    //   }
    //   return !!node && (sel as SimpleSelector).match(node);
    // });
    // return pass ? node : null;

    //版本一
    if (!node) {
      return false;
    }

    let current = node;
    for (let i = 0; i < this.selectors.length; i++) {
      const sel = this.selectors[i];
      if (!current || !(sel as SimpleSelector).match(current)) {
        info("ChildGroup match result: ", false, sel, current);
        return null;
      }
      if (i < this.selectors.length - 1) {
        current = current.parentNode;
      }
    }

    info("ChildGroup match result: ", true, current);

    return current;
  }

  mayMatch(node) {
    //原版本
    // if (!node) {
    //   return false;
    // }
    // const pass = this.selectors.every((sel, i) => {
    //   if (i !== 0) {
    //     node = node.parentNode;
    //   }
    //   return !!node && (sel as SimpleSelector).mayMatch(node);
    // });
    // return pass ? node : null;

    //版本一
    if (!node) {
      return null;
    }

    let current = node;
    for (let i = 0; i < this.selectors.length; i++) {
      const sel = this.selectors[i];
      if (!current || !(sel as SimpleSelector).mayMatch(current)) {
        info("ChildGroup mayMatch result: ", false, current, sel);
        return null;
      }
      if (i < this.selectors.length - 1) {
        current = current.parentNode;
      }
    }
    info("ChildGroup mayMatch result: ", true, current, current);
    return current;
  }

  trackChanges(node, map) {
    this.selectors.forEach((sel, i) => {
      if (i !== 0) {
        node = node.parentNode;
      }
      if (!node) {
        return;
      }
      (sel as SimpleSelector).trackChanges(node, map);
    });
  }
}

/**
 * Sibling node group
 */
class SiblingGroup {
  // list of selector
  public selectors: { sel: SelectorCore; combinator?: string }[];

  // is dynamic selector
  public dynamic: boolean;
  public __name: string;

  constructor(selectors) {
    this.__name = "SiblingGroup";
    // this.selectors = selectors;

    // 我们将原始 selector list 转换为 { sel, combinator } 对象列表
    this.selectors = selectors.map((sel) => ({
      sel,
      combinator: (sel as any).combinator, // 注意：需要确保 sel 中有 combinator 字段
    }));

    this.dynamic = selectors.some((sel) => sel.dynamic);
  }

  match(node) {
    //原版本
    // if (!node) {
    //   return false;
    // }
    // const pass = this.selectors.every((sel, i) => {
    //   if (i !== 0) {
    //     node = node.nextSibling;
    //   }
    //   return !!node && (sel as SimpleSelector).match(node);
    // });
    // return pass ? node : null;

    // 版本一
    // if (!node) {
    //   info('SiblingGroup match result: ', false)
    //   return false;
    // }
    // for (let i = 0; i < this.selectors.length; i++) {
    //   const sel = this.selectors[i] as SimpleSelector;
    //   if (!sel.match(node)) {
    //     info('SiblingGroup match result: ', false, node, sel)
    //     return null;
    //   }
    //
    //   if (i < this.selectors.length - 1) {
    //     node = node.prevSibling; // ✅ 从目标节点开始往前找兄弟
    //     if (!node) {
    //       info('SiblingGroup match result: ', false)
    //       return null;
    //     }
    //   }
    // }
    // info('SiblingGroup match result: ', node)
    // return node

    //版本二
    if (!node) return null;

    let current = node;

    for (let i = 0; i < this.selectors.length; i++) {
      const { sel, combinator } = this.selectors[i];

      if (!current || !(sel as SimpleSelector).match(current)) {
        info("SiblingGroup match failed at:", sel, current);
        return null;
      }

      // 处理 combinator 找到下一个要匹配的兄弟节点
      if (i < this.selectors.length - 1) {
        const { sel: nextSel, combinator: nextCombinator } = this.selectors[i + 1];
        if (nextCombinator === "+") {
          current = current.prevSibling;
        } else if (nextCombinator === "~") {
          let found = false;
          let prev = current.prevSibling;
          while (prev) {
            if ((nextSel as SimpleSelector).match(prev)) {
              current = prev;
              found = true;
              break;
            }
            prev = prev.prevSibling;
          }
          if (!found) {
            return null;
          }
          i++; // 手动跳过已处理的 selector
        } else {
          // undefined, 默认为紧邻兄弟
          current = current.prevSibling;
        }
      }
    }

    return current;
  }

  mayMatch(node) {
    //原版本
    // if (!node) {
    //   return false;
    // }
    // const pass = this.selectors.every((sel, i) => {
    //   if (i !== 0) {
    //     node = node.nextSibling;
    //   }
    //   return !!node && (sel as SimpleSelector).mayMatch(node);
    // });
    // return pass ? node : null;

    // 版本一
    // if (!node) return false;
    // info('SiblingGroup mayMatch start...')
    // for (let i = 0; i < this.selectors.length; i++) {
    //   const sel = this.selectors[i] as SimpleSelector;
    //
    //   info('SiblingGroup selector mayMatch start: ', sel, node)
    //
    //   if (!sel.mayMatch(node)) {
    //     info('SiblingGroup mayMatch result: ', false, node, sel)
    //     return null;
    //   }
    //
    //   if (i < this.selectors.length - 1) {
    //     node = node.prevSibling;//prevSibling
    //     info('SiblingGroup (prevSibling) node: ', node)
    //     if (!node) {
    //       info('SiblingGroup (prevSibling) mayMatch result: ', false, node)
    //       return null;
    //     }
    //   }
    // }
    // info('SiblingGroup mayMatch result: ', true, node)
    // return node;

    //版本二
    if (!node) return null;

    let current = node;

    for (let i = 0; i < this.selectors.length; i++) {
      const { sel, combinator } = this.selectors[i];

      if (!current || !(sel as SimpleSelector).mayMatch(current)) {
        info("SiblingGroup mayMatch failed at:", sel, current);
        return null;
      }

      if (i < this.selectors.length - 1) {
        const { sel: nextSel, combinator: nextCombinator } = this.selectors[i + 1];
        if (nextCombinator === "+") {
          current = current.prevSibling;
        } else if (nextCombinator === "~") {
          let found = false;
          let prev = current.prevSibling;
          while (prev) {
            if ((nextSel as SimpleSelector).mayMatch(prev)) {
              current = prev;
              found = true;
              break;
            }
            prev = prev.prevSibling;
          }
          if (!found) {
            return null;
          }
          i++;
        } else {
          current = current.prevSibling;
        }
      }
    }

    return current;
  }

  trackChanges(node, map) {
    //原版本
    // this.selectors.forEach((sel, i) => {
    //   if (i !== 0) {
    //     node = node.nextSibling;
    //   }
    //   if (!node) {
    //     return;
    //   }
    //   (sel as SimpleSelector).trackChanges(node, map);
    // });

    //版本一
    let current = node;

    for (let i = 0; i < this.selectors.length; i++) {
      const { sel, combinator } = this.selectors[i];
      (sel as SimpleSelector).trackChanges(current, map);

      if (i < this.selectors.length - 1) {
        const { sel: nextSel, combinator: nextCombinator } = this.selectors[i + 1];
        if (nextCombinator === "+") {
          current = current.prevSibling;
        } else if (nextCombinator === "~") {
          let prev = current.prevSibling;
          while (prev) {
            if ((nextSel as SimpleSelector).mayMatch(prev)) {
              current = prev;
              break;
            }
            prev = prev.prevSibling;
          }
          i++;
        } else {
          current = current.prevSibling;
        }

        if (!current) return;
      }
    }
  }
}

/**
 * selector class
 */
class Selector extends SelectorCore {
  public groups;

  public selectors;

  public last: SelectorCore;

  constructor(selectors: SimpleSelector[]) {
    super();
    this.__name = "Selector";

    const supportedCombinator = [undefined, " ", ">", "+", "~"];
    let siblingGroup: SimpleSelector[] = [];
    let lastGroup: SimpleSelector[][] = [];
    const groups: SimpleSelector[][][] = [];
    const selectorList = [...selectors];
    const length = selectorList.length - 1;
    this.specificity = 0;
    this.dynamic = false;

    for (let i = length; i >= 0; i--) {
      const sel = selectorList[i];

      if (supportedCombinator.indexOf(sel.combinator) === -1) {
        console.error(`Unsupported combinator "${sel.combinator}".`);
        throw new Error(`Unsupported combinator "${sel.combinator}".`);
      }

      if (sel.combinator === undefined || sel.combinator === " ") {
        groups.push((lastGroup = [(siblingGroup = [])]));
      }
      if (sel.combinator === ">") {
        lastGroup.push((siblingGroup = []));
      }

      this.specificity += sel.specificity;

      if (sel.dynamic) {
        this.dynamic = true;
      }

      siblingGroup.push(sel);
    }

    this.groups = groups.map((g) => {
      return new ChildGroup(
        g.map((sg) => {
          return new SiblingGroup(sg);
        }),
      );
    });
    this.last = selectorList[length];
  }

  toString(): string {
    return this.selectors.join("");
  }

  match(node?: HippyElement): boolean {
    if (!node) {
      return false;
    }
    return this.groups.every((group, i) => {
      if (i === 0) {
        node = group.match(node);
        return !!node;
      }
      if (node?.parentNode) {
        let ancestor: HippyNode | null = node.parentNode;
        while (ancestor) {
          if ((node = group.match(ancestor))) {
            return true;
          }
          ancestor = ancestor.parentNode;
        }
      }
      return false;
    });
  }

  lookupSort(sorter: SelectorsMap): void {
    this.last.lookupSort(sorter, this);
  }

  removeSort(sorter: SelectorsMap): void {
    this.last.removeSort(sorter, this);
  }

  accumulateChanges(node: HippyElement, map: SelectorsMap): boolean {
    if (!this.dynamic) {
      const ret = this.match(node);
      info("Selector !dynamic match result: ", ret);
      return ret;
    }

    const bounds: {
      left: HippyElement;
      right: HippyElement | null;
    }[] = [];
    const mayMatch = this.groups.every((group, i) => {
      if (i === 0) {
        const nextNode = group.mayMatch(node);
        bounds.push({ left: node, right: node });
        node = nextNode;
        info("Selector accumulateChanges (i === 0) match result: ", group, nextNode);
        return !!node;
      }
      let ancestor = node;
      while ((ancestor = ancestor.parentNode as HippyElement)) {
        const nextNode = group.mayMatch(ancestor);
        if (nextNode) {
          bounds.push({ left: ancestor, right: null });
          info("Selector accumulateChanges (while) match result: ", group, nextNode);
          node = nextNode;
          return true;
        }
      }
      info("Selector accumulateChanges last result: ", false);
      return false;
    });

    // Calculating the right bounds for each selector won't save much
    if (!mayMatch) {
      info("Selector mayMatch result: ", mayMatch);
      return false;
    }

    if (!map) {
      info("Selector !map result: ", mayMatch);
      return mayMatch;
    }

    for (let i = 0; i < this.groups.length; i += 1) {
      const group = this.groups[i];
      if (!group.dynamic) {
        continue;
      }
      const bound = bounds[i];
      let node = bound.left;
      do {
        if (group.mayMatch(node)) {
          group.trackChanges(node, map);
        }
      } while (node !== bound.right && (node = node.parentNode as HippyElement));
    }

    info("Selector default result: ", mayMatch);
    return mayMatch;
  }
}

// rule set selector type
type RuleSetSelector = SelectorCore & { ruleSet: RuleSet };

/**
 * Rule Set
 */
class RuleSet {
  public selectors: SelectorCore[];

  public declarations: CssDeclarationType[];

  public hash: string;

  constructor(selectors: RuleSetSelector[], declarations: CssDeclarationType[], hash: string) {
    selectors.forEach((sel) => {
      sel.ruleSet = this; // FIXME: It makes circular dependency
      return null;
    });
    this.selectors = selectors;
    this.declarations = declarations;
    this.hash = hash;
  }

  toString(): string {
    return `${this.selectors.join(", ")} {${this.declarations
      .map((d, i) => `${i === 0 ? " " : ""}${d.property}: ${d.value}`)
      .join("; ")}}`;
  }

  lookupSort(sorter: SelectorsMap): void {
    this.selectors.forEach((sel) => sel.lookupSort(sorter));
  }

  removeSort(sorter: SelectorsMap): void {
    this.selectors.forEach((sel) => sel.removeSort(sorter));
  }
}

export {
  InvalidSelector,
  UniversalSelector,
  IdSelector,
  TypeSelector,
  ClassSelector,
  PseudoClassSelector,
  AttributeSelector,
  SimpleSelectorSequence,
  Selector,
  RuleSet,
  SelectorCore,
  ChildGroup,
  SiblingGroup,
};
