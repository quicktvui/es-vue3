/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2022 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Render in Native, include create, update and delete native node operations
 */
import { nextTick } from "@vue/runtime-core";
import { isTraceEnabled, trace } from "../../util";
import { getHippyCachedInstance } from "../../util/instance";
import { Native } from "../native";
import type { NativeNode } from "../../types";
import { IS_HIPPY_3, IS_PROD } from "../../config";
import {
  EventHandlerType,
  isNativeGesture,
  NativeEventMap,
  translateToNativeEventName,
} from "../../util/event";

// operation type of native node
enum NodeOperateType {
  CREATE,
  UPDATE,
  DELETE,
  MOVE,
  UPDATE_EVENT,
}

// batch operation of native node
interface BatchNativeNode {
  // operation type
  type: NodeOperateType;
  // node list
  nodes: NativeNode[];
  eventNodes: HippyTypes.EventNode[];
  printedNodes: HippyTypes.PrintedNode[];
}

// is operating node
let isHandling = false;

// list of nodes waiting to be batched operated
let batchNativeNodes: BatchNativeNode[] = [];

const LOG_TYPE = ["%c[native]%c", "color: red", "color: auto"];

/**
 * Rearrange and combine the nodes in batchNodes, and put adjacent nodes of the same type together
 *
 * @param batchNodes - list of nodes waiting to be batched operated
 */
function chunkNodes(batchNodes: BatchNativeNode[]): BatchNativeNode[] {
  // original node list：
  // [ { type: 1, nodes: [1] }, { type: 1, nodes: [2] }, { type: 2, nodes: [3] }, { type: 1, nodes: [4] },  ]
  // after rearranging the combination：
  // [ { type: 1, nodes: [1, 2] }, { type: 2, nodes: [3] }, { type: 1, nodes: [4] },  ]
  const result: BatchNativeNode[] = [];

  for (const batchNode of batchNodes) {
    const { type, nodes, eventNodes, printedNodes } = batchNode;
    const chunk = result[result.length - 1];

    if (!chunk || chunk.type !== type) {
      result.push({
        type,
        nodes,
        eventNodes,
        printedNodes,
      });
    } else {
      chunk.nodes = chunk.nodes.concat(nodes);
      chunk.eventNodes = chunk.eventNodes.concat(eventNodes);
      chunk.printedNodes = chunk.printedNodes.concat(printedNodes);
    }
  }

  return result;
}

function handleEventListeners(eventNodes: HippyTypes.EventNode[] = [], sceneBuilder) {
  eventNodes.forEach((eventNode) => {
    if (eventNode) {
      const { id, eventList } = eventNode;
      eventList.forEach((eventAttribute) => {
        const { name, type, listener } = eventAttribute;
        let nativeEventName;
        if (isNativeGesture(name)) {
          nativeEventName = NativeEventMap[name];
        } else {
          nativeEventName = translateToNativeEventName(name);
        }
        if (type === EventHandlerType.REMOVE) {
          sceneBuilder.removeEventListener(id, nativeEventName, listener);
        }
        if (type === EventHandlerType.ADD) {
          sceneBuilder.removeEventListener(id, nativeEventName, listener);
          sceneBuilder.addEventListener(id, nativeEventName, listener);
        }
      });
    }
  });
}

/**
 * print nodes operation log
 * @param {HippyTypes.PrintedNode[]} printedNodes
 * @param {string} nodeType
 */
function printNodeOperation(printedNodes, nodeType) {
  if (isTraceEnabled()) {
    trace(...LOG_TYPE, nodeType, printedNodes);
  }
}

/**
 * Call the Native interface to render the Native Node to the terminal interface
 */
function endBatch() {
  // Then judge whether it is currently being processed, and if it is still processing, return first
  if (isHandling) {
    return;
  }
  isHandling = true;

  // If the node has been processed, open the lock and process it directly next time
  if (batchNativeNodes.length === 0) {
    isHandling = false;
    return;
  }
  if (!IS_HIPPY_3) {
    // start to batch
    Native.hippyNativeDocument.startBatch();
  }
  // invoke native action after nextTick
  nextTick().then(() => {
    // put adjacent nodes of the same type together to the number of operations
    const chunks = chunkNodes(batchNativeNodes);

    // get native root view id
    const { rootViewId } = getHippyCachedInstance();

    //---------------------------V3------------------------------------
    let sceneBuilder;
    // nodes need sort by index
    const needSortByIndex = true;

    if (IS_HIPPY_3) {
      // create Scene Builder with rootView id
      sceneBuilder = new global.Hippy.SceneBuilder(rootViewId);
    }
    //---------------------------------------------------------------
    // batch operations on nodes based on operation type
    chunks.forEach((chunk) => {
      //预处理
      preprocessNode(chunk);
      //sync
      switch (chunk.type) {
        case NodeOperateType.CREATE:
          if (IS_HIPPY_3) {
            printNodeOperation(chunk.printedNodes, "createNode");
            sceneBuilder.create(chunk.nodes, needSortByIndex);
            handleEventListeners(chunk.eventNodes, sceneBuilder);
          } else {
            trace(...LOG_TYPE, "createNode", chunk.nodes);
            Native.hippyNativeDocument.createNode(rootViewId, chunk.nodes);
          }

          break;
        case NodeOperateType.UPDATE:
          if (IS_HIPPY_3) {
            printNodeOperation(chunk.printedNodes, "updateNode");
            sceneBuilder.update(chunk.nodes);
            handleEventListeners(chunk.eventNodes, sceneBuilder);
          } else {
            trace(...LOG_TYPE, "updateNode", chunk.nodes);
            Native.hippyNativeDocument.updateNode(rootViewId, chunk.nodes);
          }
          break;
        case NodeOperateType.DELETE:
          if (IS_HIPPY_3) {
            printNodeOperation(chunk.printedNodes, "deleteNode");
            sceneBuilder.delete(chunk.nodes);
          } else {
            trace(...LOG_TYPE, "deleteNode", chunk.nodes);
            Native.hippyNativeDocument.deleteNode(rootViewId, chunk.nodes);
          }
          break;
        case NodeOperateType.MOVE:
          if (IS_HIPPY_3) {
            printNodeOperation(chunk.printedNodes, "moveNode");
            sceneBuilder.move(chunk.nodes);
          } else {
            trace(...LOG_TYPE, "moveNode not support!", chunk.nodes);
          }
          break;
        case NodeOperateType.UPDATE_EVENT:
          if (IS_HIPPY_3) {
            handleEventListeners(chunk.eventNodes, sceneBuilder);
          } else {
            trace(...LOG_TYPE, "UPDATE_EVENT not support!", chunk.nodes);
          }
          break;
        default:
          break;
      }
    });

    if (IS_HIPPY_3) {
      sceneBuilder.build();
    } else {
      // after the node operation is processed, call native to turn off the batch processing switch
      Native.hippyNativeDocument.endBatch();
    }
    // reset flag
    isHandling = false;
    // clear list
    batchNativeNodes = [];
  });
}

//-----------------------------------------------------------------------------------------

/**
 * insert native nodes
 *
 * @param nativeNodes - nodes list
 */
export function renderInsertChildNativeNode([
  nativeLanguages,
  eventLanguages,
  printedLanguages,
]): void {
  // First insert the node into the pending list
  batchNativeNodes.push({
    type: NodeOperateType.CREATE,
    nodes: nativeLanguages,
    eventNodes: eventLanguages,
    printedNodes: printedLanguages,
  });
  endBatch();
}

/**
 * move native nodes
 *
 * @param  moveNodes - move nodes list
 */
export function renderMoveChildNativeNode([nativeLanguages, , printedLanguages]): void {
  if (nativeLanguages) {
    batchNativeNodes.push({
      type: NodeOperateType.MOVE,
      nodes: nativeLanguages,
      eventNodes: [],
      printedNodes: printedLanguages,
    });
    endBatch();
  }
}

/**
 * delete native nodes
 *
 * @param deleteNodes - nodes list
 */
export function renderRemoveChildNativeNode([nativeLanguages, , printedLanguages]): void {
  if (nativeLanguages) {
    batchNativeNodes.push({
      type: NodeOperateType.DELETE,
      nodes: nativeLanguages,
      eventNodes: [],
      printedNodes: printedLanguages,
    });
    endBatch();
  }
}

/**
 * update native nodes
 *
 * @param updateNodes - nodes list
 */
export function renderUpdateChildNativeNode([
  nativeLanguages,
  eventLanguages,
  printedLanguages,
]): void {
  if (nativeLanguages) {
    batchNativeNodes.push({
      type: NodeOperateType.UPDATE,
      nodes: nativeLanguages,
      eventNodes: eventLanguages,
      printedNodes: printedLanguages,
    });
    endBatch();
  }
}

/**
 * update native event
 *
 * @param eventNode
 */
export function renderUpdateChildNativeEvent(eventNode): void {
  batchNativeNodes.push({
    type: NodeOperateType.UPDATE_EVENT,
    nodes: [],
    eventNodes: [eventNode],
    printedNodes: [],
  });
  endBatch();
}

//-----------------------------------------------------------------------------------------

function preprocessNode(batchNode: BatchNativeNode) {
  switch (batchNode.type) {
    case NodeOperateType.CREATE: {
      batchNode.nodes.forEach((node) => {
        //1.background-color
        preprocessNodeBackgroundColor(node);
        //2.width & height
        preprocessNodeSize(node);
      });
      break;
    }

    case NodeOperateType.UPDATE: {
      break;
    }

    case NodeOperateType.DELETE: {
      break;
    }

    default: {
      break;
    }
  }
}

function preprocessNodeBackgroundColor(node: NativeNode) {
  if (node.tagName == "div" || node.tagName == "span" || node.tagName == "p") {
    return;
  }
  try {
    const style = node?.props?.style ?? {};
    const backgroundColor = style.backgroundColor;
    if (backgroundColor === undefined || backgroundColor === null || backgroundColor === "") {
      if (node?.props && node?.props.style) {
        node!.props!.style.backgroundColor = 0x00000000;
      }
    }
  } catch (e) {}
}

function preprocessNodeSize(node: NativeNode) {
  try {
    const style = node?.props?.style ?? {};
    const width = style.width;
    const height = style.height;

    // 如果宽高都未设置
    if (width === undefined && height === undefined) {
      //所有的组件都警告
      //添加默认宽高
      if (node.tagName == "textview") {
        if (!IS_PROD) {
          console.warn(
            "⚠️ [QuickTV Warning] Component is missing both width and height:",
            node,
            "\n     Default width and height (100px) have been automatically applied by the framework.",
            "\n     Please set width and height explicitly based on your layout requirements.",
          );
        }
        if (node?.props && node?.props.style) {
          node!.props!.style.width = 100;
          node!.props!.style.height = 100;
        }
      } else {
        if (!IS_PROD) {
          console.warn(
            "⚠️ [QuickTV Warning] Component is missing both width and height:",
            node,
            "\n     Please set width and height explicitly based on your layout requirements.",
          );
        }
      }
    }
    // 如果宽高都为 0，进行警告
    else if ((width === 0 || width === "0px") && (height === 0 || height === "0px")) {
      if (!IS_PROD) {
        console.warn(
          "⚠️ [QuickTV Warning ] component has both width and height set to 0:",
          node,
          "\n     Please set width and height explicitly based on your layout requirements.",
        );
      }
    }
  } catch (e) {}
}
