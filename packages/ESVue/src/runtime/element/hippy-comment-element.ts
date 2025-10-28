import { HippyElement } from "./hippy-element";

/**
 * Hippy comment element
 *
 * @public
 */
class HippyCommentElement extends HippyElement {
  public text: string;

  constructor(text: string) {
    super(text);

    this.text = text;

    // comment nodes do not need to be inserted into Native
    this.isNeedInsertToNative = false;
  }
}

export { HippyCommentElement };
