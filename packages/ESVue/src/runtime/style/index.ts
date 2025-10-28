import type { NeedToTyped } from "../../types";
import { IS_PROD } from "../../config";
import { getBeforeLoadStyle } from "../../util";

import {
  AttributeSelector,
  ClassSelector,
  IdSelector,
  InvalidSelector,
  PseudoClassSelector,
  RuleSet,
  Selector,
  SimpleSelectorSequence,
  TypeSelector,
  UniversalSelector,
} from "./css-selectors";
import type { CssAttribute } from "./css-selectors-match";
import { parseSelector } from "./parser";
import { info, warn } from "../../util/log";

import { resolveVariables } from "./css-resolve-variables";

function isDeclaration(node) {
  return node.type === "declaration";
}

function createDeclaration(beforeLoadStyle: any, cssVariables: Record<string, string>) {
  return function (decl) {
    let { property, value } = decl;

    //解析css变量
    value = resolveVariables(value, cssVariables);

    decl.property = property;
    decl.value = value;

    const newDecl = beforeLoadStyle(decl);
    if (!IS_PROD && !newDecl) {
      throw new Error("beforeLoadStyle hook must returns the processed style object");
    }
    return decl;
  };
}

function createSimpleSelectorFromAst(ast) {
  switch (ast.type) {
    case "*":
      return new UniversalSelector();
    case "#":
      return new IdSelector(ast.identifier);
    case "":
      return new TypeSelector(ast.identifier.replace(/-/, "").toLowerCase());
    case ".":
      return new ClassSelector(ast.identifier);
    case ":":
      const selector = ast.selector ? createSimpleSelectorFromAst(ast.selector) : null;
      return new PseudoClassSelector(ast.identifier, selector);
    case "[]":
      return ast.test
        ? new AttributeSelector(ast.property, ast.test, ast.value)
        : new AttributeSelector(ast.property);
    default:
      return null;
  }
}

function createSimpleSelectorSequenceFromAst(ast) {
  if (ast.length === 0) {
    return new InvalidSelector(new Error("Empty simple selector sequence."));
  }
  if (ast.length === 1) {
    return createSimpleSelectorFromAst(ast[0]);
  }

  return new SimpleSelectorSequence(ast.map(createSimpleSelectorFromAst));
}

//
function createSelectorFromAst(ast) {
  if (ast.length === 0) {
    const selector = new InvalidSelector(new Error("Empty selector."));
    info("createSelectorFromAst ast: ", ast, "selector: ", selector);
    return selector;
  }
  if (ast.length === 1) {
    const selector = createSimpleSelectorSequenceFromAst(ast[0][0]);
    info("createSelectorFromAst ast: ", ast, "selector: ", selector);
    return selector;
  }
  const simpleSelectorSequences: NeedToTyped[] = [];

  for (const currentAst of ast) {
    const simpleSelectorSequence = createSimpleSelectorSequenceFromAst(currentAst[0]);
    const combinator = currentAst[1];
    if (combinator && simpleSelectorSequence) {
      simpleSelectorSequence.combinator = combinator;
    }
    simpleSelectorSequences.push(simpleSelectorSequence);
  }
  const selector = new Selector(simpleSelectorSequences);
  info(
    "createSelectorFromAst ast: ",
    ast,
    "simpleSelectorSequences: ",
    simpleSelectorSequences,
    "selector: ",
    selector,
  );
  return selector;
}

function createSelector(sel) {
  try {
    const parsedSelector = parseSelector(sel, 0);
    if (!parsedSelector) {
      return new InvalidSelector(new Error("Empty selector"));
    }
    // parsedSelector.value is ast, like:
    // [[[{type: '#', identifier: 'root'}, {type: '[]', property: 'data-v-5ef48958'}], undefined]]
    return createSelectorFromAst(parsedSelector.value);
  } catch (e) {
    return new InvalidSelector(e as Error);
  }
}

export function fromAstNodes(
  astRules: CssAttribute[] = [],
  cssVariables: Record<string, string> = {},
): RuleSet[] {
  const beforeLoadStyle = getBeforeLoadStyle();

  return astRules.map((rule) => {
    const declarations = rule.declarations
      .filter(isDeclaration)
      .map(createDeclaration(beforeLoadStyle, cssVariables));
    //
    const selectors = rule.selectors.map(createSelector);

    return new RuleSet(selectors, declarations, rule.hash);
  });
}

export { SelectorsMap } from "./css-selectors-match";
