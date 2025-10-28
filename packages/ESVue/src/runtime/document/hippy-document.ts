import { HippyCommentElement } from "../element/hippy-comment-element";
import { HippyElement } from "../element/hippy-element";
import { HippyInputElement } from "../element/hippy-input-element";
import { HippyListElement } from "../element/hippy-list-element";
import { HippyNode, NodeType } from "../node/hippy-node";
import { HippyText } from "../text/hippy-text";
import { info } from "../../util/log";

/**
 * Hippy document, provide methods for creating different type element node
 */
export class HippyDocument extends HippyNode {
  /**
   * create comment node with text content
   *
   * @param text - text content
   */
  static createComment(text: string): HippyCommentElement {
    return new HippyCommentElement(text);
  }

  /**
   * create different type elements by tag name
   *
   * @param tagName - tag name
   */
  static createElement(tagName: string): HippyElement | HippyInputElement | HippyListElement {
    info("[hippy document] createElement:" + tagName);

    switch (tagName) {
      case "input":
      case "textarea":
        return new HippyInputElement(tagName);
      case "ul":
        return new HippyListElement(tagName);
      // use tagName to create element
      default:
        return new HippyElement(tagName);
    }
  }

  /**
   * create text node
   *
   * @param text - text content
   */
  static createTextNode(text: string): HippyText {
    return new HippyText(text);
  }

  constructor() {
    super(NodeType.DocumentNode);
  }
}
