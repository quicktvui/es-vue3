import { Native } from "../native";

import { HippyElement } from "./hippy-element";

interface QTListViewItemFunctionParams {
  itemPosition: number;
  targetName: string;
  functionTargetName: string;
  data: Array<any>;
}

type QTDirections = "up" | "down" | "right" | "left";

/**
 * Hippy list element, such as ul
 *
 * @public
 */
export class HippyListElement extends HippyElement {
  /**
   * scroll to specified index
   */
  public scrollToIndex(indexLeft = 0, indexTop = 0, needAnimation = true): void {
    Native.callUIFunction(this, "scrollToIndex", [indexLeft, indexTop, needAnimation]);
  }

  /**
   * scroll to specified offset
   */
  public scrollToPosition(
    posX: number | undefined = 0,
    posY: number | undefined = 0,
    needAnimation = true,
  ): void {
    if (typeof posX !== "number" || typeof posY !== "number") {
      return;
    }
    Native.callUIFunction(this, "scrollToContentOffset", [posX, posY, needAnimation]);
  }

  /**
   * setInitPosition
   */
  public setInitPosition({ focusPosition, scrollToPosition, scrollOffset, force }): void {
    Native.callUIFunction(this, "setInitPosition", [
      {
        focusPosition,
        scrollToPosition,
        scrollOffset,
        force,
      },
    ]);
  }

  /**
   * scroll to position And focus
   */
  public scrollToFocused(focusPosition = 0): void {
    if (typeof focusPosition !== "number") {
      return;
    }
    const toFocus = {
      focusPosition, //请求焦点的position
      scrollToPosition: focusPosition, //滚动的目标position
      scrollOffset: 0, //滚动的偏移量
      force: true, //强制刷新列表
    };
    Native.callUIFunction(this, "setInitPosition", [toFocus]);
  }

  /**
   * scrollToTop
   */
  public scrollToTop(): void {
    Native.callUIFunction(this, "scrollToTop", []);
  }

  /**
   * 设置子节点获取焦点-必须是在可视区域内的子节点
   */
  public requestChildFocus(pos = 0): void {
    if (typeof pos !== "number") {
      return;
    }
    Native.callUIFunction(this, "requestChildFocus", [pos]);
  }

  /**
   * 检测当前区域是否有焦点状态
   */
  public async hasFocus(callback?): Promise<boolean> {
    return new Promise((resolve) => {
      Native.callUIFunction(this, "hasFocus", (res) => {
        if (callback) {
          callback(res);
        }
        resolve(res);
      });
    });
  }

  /**
   *
   */
  public dispatchItemFunction(
    position: number,
    name: string,
    funcName: string,
    params: QTListViewItemFunctionParams,
  ): void {
    Native.callUIFunction(this, "dispatchItemFunction", [position, name, funcName, params]);
  }

  /**
   * 锁定某一个方向的焦点，使焦点无法往该方向移动
   */
  public setBlockFocusDirectionsOnFail(data: Array<QTDirections>): void {
    Native.callUIFunction(this, "setBlockFocusDirectionsOnFail", [data]);
  }

  /**
   * @deprecated 不再维护
   */
  public prepareForRecycle(): void {
    Native.callUIFunction(this, "prepareForRecycle", []);
  }

  /**
   * @deprecated 不再维护
   */
  public setDisplay(value: Boolean): void {
    Native.callUIFunction(this, "setDisplay", [value]);
  }

  /**
   * @deprecated 不再维护
   */
  public changeDisplayState(display: string, autoDataState: any): void {
    Native.callUIFunction(this, "changeDisplayState", [display, autoDataState]);
  }

  /**
   * @deprecated 不再维护
   */
  public notifySaveInstance(): void {
    Native.callUIFunction(this, "notifySaveInstance", []);
  }

  /**
   * @deprecated 不再维护
   */
  public notifyRestoreInstance(): void {
    Native.callUIFunction(this, "notifyRestoreInstance", []);
  }

  /**
   * @deprecated 不再维护
   */
  public pausePostTask(): void {
    Native.callUIFunction(this, "pausePostTask", []);
  }

  /**
   * @deprecated 不再维护
   */
  public resumePostTask(): void {
    Native.callUIFunction(this, "resumePostTask", []);
  }

  /**
   * 获取当前滚动距离
   */
  public async getScrollOffset(callback?): Promise<{ x: number; y: number }> {
    return new Promise((resolve) => {
      Native.callUIFunction(this, "getScrollOffset", [], (res) => {
        if (callback) {
          callback(res);
        }
        resolve(res);
      });
    });
  }

  /**
   *
   */
  public scrollToSelected(pos: number, b: boolean): void {
    // this.scrollToPosition(pos)
    Native.callUIFunction(this, "scrollToPosition", [pos]);
    this.setItemSelected(pos, b);
  }

  /**
   * @deprecated 不再维护
   */
  public scrollToPositionOffset(x: number, y: number, anim: Boolean, offset: number): void {
    Native.callUIFunction(this, "scrollToPositionWithOffset", [y, offset, anim]);
  }

  /**
   * @deprecated 不再维护
   */
  public destroy(): void {
    Native.callUIFunction(this, "destroy", []);
  }

  /**
   * @deprecated 不再维护
   */
  public startScroll(
    focusPosition?: number,
    scrollToPosition?: number,
    scrollOffset?: number,
  ): void {
    Native.callUIFunction(this, "startScroll", [
      {
        focusPosition: focusPosition,
        scrollToPosition: scrollToPosition,
        scrollOffset: scrollOffset,
      },
    ]);
  }

  /**
   * 设置[指定子节点索引]获取焦点-必须是在可视区域内的子节点
   */
  public setItemFocused(position: number): void {
    Native.callUIFunction(this, "requestChildFocus", [position]);
  }

  /**
   * @deprecated 不再维护
   */
  public clearPostTask(): void {
    Native.callUIFunction(this, "clearAllPostTask", []);
  }

  /**
   * ?
   */
  public setItemSelected(position: number, requestFocus: Boolean): void {
    Native.callUIFunction(this, "setSelectChildPosition", [position, requestFocus]);
  }

  /**
   * 锁住当前区域焦点
   */
  public blockRootFocus(): void {
    Native.callUIFunction(this, "blockRootFocus", []);
  }

  /**
   * 放开当前区域焦点
   */
  public unBlockRootFocus(): void {
    Native.callUIFunction(this, "unBlockRootFocus", []);
  }

  /**
   * @deprecated 不再维护
   */
  public setBackgroundColor(color: string): void {
    Native.callUIFunction(this, "setBackgroundColor", [color]);
  }

  /**
   * @deprecated 不再维护
   */
  public setAutoFocus(tag: string, delay: number): void {
    Native.callUIFunction(this, "setAutoFocus", [tag, delay]);
  }
}
