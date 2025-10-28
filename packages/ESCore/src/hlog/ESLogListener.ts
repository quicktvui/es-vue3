import {OnUploadListenerBase} from "./listener/OnUploadListenerBase";
import SetUploadListenerBase from "./listener/SetUploadListenerBase";
import {EventBus} from "@extscreen/es3-vue";
import {OnInitListenerBase} from "./listener/OnInitListenerBase";
import SetInitListenerBase from "./listener/SetInitListenerBase";
import RemoveInitListenerBase from "./listener/RemoveInitListenerBase";
import RemoveUploadListenerBase from "./listener/RemoveUploadListenerBase";
import SetOldUploadListenerBase from "./listener/SetOldUploadListenerBase";
import RemoveOldUploadListenerBase from "./listener/RemoveOldUploadListenerBase";

export enum EventName {
  EVENT_NAME_INIT = 'onInitEvent',
  EVENT_NAME_MERGE_CONFIG_START = 'onMergeConfigStart',
  EVENT_NAME_MERGE_CONFIG_FINISH = 'onMergeConfigFinish',
  EVENT_NAME_SO_LOAD_START = 'onSoLoadStart',
  EVENT_NAME_SO_LOAD_FINISH = 'onSoLoadFinish',
  EVENT_NAME_SO_LOAD_FAIL = 'onSoLoadFail',
  EVENT_NAME_INIT_COMPLETE = 'onInitComplete',
  EVENT_NAME_GET_NET_CONFIG_ERROR = 'onGetNetConfigError',
  EVENT_NAME_INIT_REPEAT = 'onInitRepeat',

  EVENT_NAME_SEND = 'onLogSendEvent',
  EVENT_NAME_OLD_SEND = 'onOldLogSendEvent',

  EVENT_NAME_DETECT_SUCCESS = 'onDetectSuccess',
  EVENT_NAME_DETECT_ERROR = 'onDetectError',

  EVENT_NAME_START = 'onSendStart',
  EVENT_NAME_CANCEL = 'onSendCancel',
  EVENT_NAME_CANCEL_SUCCESS = 'onCancelSuccess',
  EVENT_NAME_CANCEL_FAIL = 'onCancelFail',
  EVENT_NAME_COMPLETE = 'onSendComplete',
  EVENT_NAME_FAIL = 'onSendFail',

  EVENT_NAME_ITEM_START = 'onItemSendStart',
  EVENT_NAME_ITEM_PROGRESS = 'onItemProgress',
  EVENT_NAME_ITEM_SUCCESS = 'onItemSuccess',
  EVENT_NAME_ITEM_FAIL = 'onItemFail',
  EVENT_NAME_ITEM_POST_SUCCESS = 'onItemPostSuccess',
  EVENT_NAME_ITEM_POST_FAIL = 'onItemPostFail'
}

export interface ESHLogListener extends SetInitListenerBase, RemoveInitListenerBase,
  SetUploadListenerBase, RemoveUploadListenerBase, SetOldUploadListenerBase, RemoveOldUploadListenerBase {

  initListener(): void

  setOnInitListener(listener: OnInitListenerBase): void

  setOnInitListener2(listener: (data: { eventName: string, data: any }) => void): void

  setOnUploadListener(listener: OnUploadListenerBase): void

  setOnUploadListener2(listener: (data: { eventName: string, data: any }) => void): void

  setOnOldUploadListener(listener: OnUploadListenerBase): void

  setOnOldUploadListener2(listener: (data: { eventName: string, data: any }) => void): void

  removeOnInitListener(): void

  removeOnInitListener2(): void

  removeUploadListener(): void

  removeUploadListener2(): void

  removeOldUploadListener(): void

  removeOldUploadListener2(): void

  destroyListener(): void
}

export function createESLogListener(): ESHLogListener {

  let initListenerBase: OnInitListenerBase | null = null;
  let innerInitListener: ((data: { eventName: string, data: any }) => void) | null = null;
  let sendListenerBase: OnUploadListenerBase | null = null;
  let sendListener: ((data: { eventName: string, data: any }) => void) | null = null;
  let oldSendListenerBase: OnUploadListenerBase | null = null;
  let oldSendListener: ((data: { eventName: string, data: any }) => void) | null = null;

  let mergeConfigStartListener: (() => void) | null = null;
  let mergeConfigFinishListener: ((data: string) => void) | null = null;
  let getNetConfigErrorListener: ((data: { errorCode: number, errorMessage: string }) => void) | null = null;
  let soLoadStartListener: ((data: boolean) => void) | null = null;
  let soLoadFinishListener: ((data: boolean) => void) | null = null;
  let soLoadFailListener: ((data: { isDynamic: boolean, errorCode: number, errorMessage: string }) => void) | null = null;
  let initCompleteListener: (() => void) | null = null;
  let initRepeatListener: (() => void) | null = null;

  let detectSuccessListener: ((data: { needUpLoad: boolean, dates: string }) => void) | null = null;
  let detectErrorListener: ((data: { errCode: number, errMsg: string }) => void) | null = null;
  let startListener: ((data: string) => void) | null = null;
  let cancelListener: (() => void) | null = null;
  let cancelSuccessListener: (() => void) | null = null;
  let cancelErrorListener: ((data: { errCode: number, errMsg: string }) => void) | null = null;
  let completeListener: (() => void) | null = null;
  let failListener: ((data: { errCode: number, errMsg: string }) => void) | null = null;

  let itemStartListener: ((data: { index: number, path: string }) => void) | null = null;
  let itemProgressListener: ((data: { index: number, percent: number }) => void) | null = null;
  let itemSuccessListener: ((data: number) => void) | null = null;
  let itemFailListener: ((data: { index: number, errorCode: number, errorMessage: string }) => void) | null = null;
  let itemPostSuccessListener: ((data: number) => void) | null = null;
  let itemPostFailListener: ((data: number) => void) | null = null;

  let oldStartListener: ((data: string) => void) | null = null;
  let oldCancelListener: (() => void) | null = null;
  let oldCompleteListener: (() => void) | null = null;
  let oldFailListener: ((data: { errCode: number, errMsg: string }) => void) | null = null;

  let oldItemStartListener: ((data: { index: number, path: string }) => void) | null = null;
  let oldItemProgressListener: ((data: { index: number, percent: number }) => void) | null = null;
  let oldItemSuccessListener: ((data: number) => void) | null = null;
  let oldItemFailListener: ((data: { index: number, errorCode: number, errorMessage: string }) => void) | null = null;
  let oldItemPostSuccessListener: ((data: number) => void) | null = null;
  let oldItemPostFailListener: ((data: number) => void) | null = null;

  function initListener(): void {
    EventBus.$on(EventName.EVENT_NAME_INIT, onInitListener);
    EventBus.$on(EventName.EVENT_NAME_SEND, onSendListener);
    EventBus.$on(EventName.EVENT_NAME_OLD_SEND, onOldSendListener);
  }

  function onInitListener(map: { eventName: string, data: any }): void {
    if (innerInitListener != null) {
      innerInitListener(map);
    } else {
      const {eventName, data} = map;
      switch (eventName) {
        case EventName.EVENT_NAME_MERGE_CONFIG_START:
          if (mergeConfigStartListener != null)
            mergeConfigStartListener();
          else if (initListenerBase != null && initListenerBase.onMergeConfigStart != null)
            initListenerBase.onMergeConfigStart()
          break;
        case EventName.EVENT_NAME_MERGE_CONFIG_FINISH:
          if (mergeConfigFinishListener != null)
            mergeConfigFinishListener(data);
          else if (initListenerBase != null && initListenerBase.onMergeConfigFinish != null)
            initListenerBase.onMergeConfigFinish(data)
          break;
        case EventName.EVENT_NAME_GET_NET_CONFIG_ERROR:
          if (getNetConfigErrorListener != null)
            getNetConfigErrorListener(data);
          else if (initListenerBase != null && initListenerBase.onGetNetConfigError != null)
            initListenerBase.onGetNetConfigError(data)
          break;
        case EventName.EVENT_NAME_SO_LOAD_START:
          if (soLoadStartListener != null)
            soLoadStartListener(data);
          else if (initListenerBase != null && initListenerBase.onSoLoadStart != null)
            initListenerBase.onSoLoadStart(data)
          break;
        case EventName.EVENT_NAME_SO_LOAD_FINISH:
          if (soLoadFinishListener != null)
            soLoadFinishListener(data);
          else if (initListenerBase != null && initListenerBase.onSoLoadFinish != null)
            initListenerBase.onSoLoadFinish(data)
          break;
        case EventName.EVENT_NAME_SO_LOAD_FAIL:
          if (soLoadFailListener != null)
            soLoadFailListener(data);
          else if (initListenerBase != null && initListenerBase.onSoLoadFail != null)
            initListenerBase.onSoLoadFail(data)
          break;
        case EventName.EVENT_NAME_INIT_COMPLETE:
          if (initCompleteListener != null)
            initCompleteListener();
          else if (initListenerBase != null && initListenerBase.onInitComplete != null)
            initListenerBase.onInitComplete();
          break;
        case EventName.EVENT_NAME_INIT_REPEAT:
          if (initRepeatListener != null)
            initRepeatListener();
          else if (initListenerBase != null && initListenerBase.onInitRepeat != null)
            initListenerBase.onInitRepeat();
          break;
        default:
          break;
      }
    }
  }

  function onSendListener(map: { eventName: string, data: any }): void {
    if (sendListener != null) {
      sendListener(map);
    } else {
      const {eventName, data} = map;
      switch (eventName) {
        case EventName.EVENT_NAME_DETECT_SUCCESS:
          if (detectSuccessListener != null)
            detectSuccessListener(data);
          else if (sendListenerBase != null && sendListenerBase.onDetectTaskSuccessListener != null)
            sendListenerBase.onDetectTaskSuccessListener(data)
          break;
        case EventName.EVENT_NAME_DETECT_ERROR:
          if (detectErrorListener != null)
            detectErrorListener(data);
          else if (sendListenerBase != null && sendListenerBase.onDetectTaskErrorListener != null)
            sendListenerBase.onDetectTaskErrorListener(data)
          break;
        case EventName.EVENT_NAME_START:
          if (startListener != null)
            startListener(data);
          else if (sendListenerBase != null && sendListenerBase.onStartListener != null)
            sendListenerBase.onStartListener(data)
          break;
        case EventName.EVENT_NAME_CANCEL:
          if (cancelListener != null)
            cancelListener();
          else if (sendListenerBase != null && sendListenerBase.onCancelListener != null)
            sendListenerBase.onCancelListener()
          break;
        case EventName.EVENT_NAME_CANCEL_SUCCESS:
          if (cancelSuccessListener != null)
            cancelSuccessListener();
          else if (sendListenerBase != null && sendListenerBase.onCancelSuccessListener != null)
            sendListenerBase.onCancelSuccessListener()
          break;
        case EventName.EVENT_NAME_CANCEL_FAIL:
          if (cancelErrorListener != null)
            cancelErrorListener(data);
          else if (sendListenerBase != null && sendListenerBase.onCancelErrorListener != null)
            sendListenerBase.onCancelErrorListener(data)
          break;
        case EventName.EVENT_NAME_COMPLETE:
          if (completeListener != null)
            completeListener();
          else if (sendListenerBase != null && sendListenerBase.onCompleteListener != null)
            sendListenerBase.onCompleteListener();
          break;
        case EventName.EVENT_NAME_FAIL:
          if (failListener != null)
            failListener(data);
          else if (sendListenerBase != null && sendListenerBase.onFailListener != null)
            sendListenerBase.onFailListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_START:
          if (itemStartListener != null)
            itemStartListener(data);
          else if (sendListenerBase != null && sendListenerBase.onItemStartListener != null)
            sendListenerBase.onItemStartListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_PROGRESS:
          if (itemProgressListener != null)
            itemProgressListener(data);
          else if (sendListenerBase != null && sendListenerBase.onItemProgressListener != null)
            sendListenerBase.onItemProgressListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_SUCCESS:
          if (itemSuccessListener != null)
            itemSuccessListener(data);
          else if (sendListenerBase != null && sendListenerBase.onItemSuccessListener != null)
            sendListenerBase.onItemSuccessListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_FAIL:
          if (itemFailListener != null)
            itemFailListener(data);
          else if (sendListenerBase != null && sendListenerBase.onItemFailListener != null)
            sendListenerBase.onItemFailListener
          break;
        case EventName.EVENT_NAME_ITEM_POST_SUCCESS:
          if (itemPostSuccessListener != null)
            itemPostSuccessListener(data);
          else if (sendListenerBase != null && sendListenerBase.onItemPostSuccessListener != null)
            sendListenerBase.onItemPostSuccessListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_POST_FAIL:
          if (itemPostFailListener != null)
            itemPostFailListener(data);
          else if (sendListenerBase != null && sendListenerBase.onItemPostFailListener != null)
            sendListenerBase.onItemPostFailListener(data);
          break;
        default:
          break;
      }
    }
  }

  function onOldSendListener(map: { eventName: string, data: any }): void {
    if (oldSendListener != null) {
      oldSendListener(map);
    } else {
      const {eventName, data} = map;
      switch (eventName) {
        case EventName.EVENT_NAME_START:
          if (oldStartListener != null)
            oldStartListener(data);
          else if (oldSendListenerBase != null && oldSendListenerBase.onStartListener != null)
            oldSendListenerBase.onStartListener(data)
          break;
        case EventName.EVENT_NAME_CANCEL:
          if (oldCancelListener != null)
            oldCancelListener();
          else if (oldSendListenerBase != null && oldSendListenerBase.onCancelListener != null)
            oldSendListenerBase.onCancelListener()
          break;
        case EventName.EVENT_NAME_COMPLETE:
          if (oldCompleteListener != null)
            oldCompleteListener();
          else if (oldSendListenerBase != null && oldSendListenerBase.onCompleteListener != null)
            oldSendListenerBase.onCompleteListener();
          break;
        case EventName.EVENT_NAME_FAIL:
          if (oldFailListener != null)
            oldFailListener(data);
          else if (oldSendListenerBase != null && oldSendListenerBase.onFailListener != null)
            oldSendListenerBase.onFailListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_START:
          if (oldItemStartListener != null)
            oldItemStartListener(data);
          else if (oldSendListenerBase != null && oldSendListenerBase.onItemStartListener != null)
            oldSendListenerBase.onItemStartListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_PROGRESS:
          if (oldItemProgressListener != null)
            oldItemProgressListener(data);
          else if (oldSendListenerBase != null && oldSendListenerBase.onItemProgressListener != null)
            oldSendListenerBase.onItemProgressListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_SUCCESS:
          if (oldItemSuccessListener != null)
            oldItemSuccessListener(data);
          else if (oldSendListenerBase != null && oldSendListenerBase.onItemSuccessListener != null)
            oldSendListenerBase.onItemSuccessListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_FAIL:
          if (oldItemFailListener != null)
            oldItemFailListener(data);
          else if (oldSendListenerBase != null && oldSendListenerBase.onItemFailListener != null)
            oldSendListenerBase.onItemFailListener
          break;
        case EventName.EVENT_NAME_ITEM_POST_SUCCESS:
          if (oldItemPostSuccessListener != null)
            oldItemPostSuccessListener(data);
          else if (oldSendListenerBase != null && oldSendListenerBase.onItemPostSuccessListener != null)
            oldSendListenerBase.onItemPostSuccessListener(data);
          break;
        case EventName.EVENT_NAME_ITEM_POST_FAIL:
          if (oldItemPostFailListener != null)
            oldItemPostFailListener(data);
          else if (oldSendListenerBase != null && oldSendListenerBase.onItemPostFailListener != null)
            oldSendListenerBase.onItemPostFailListener(data);
          break;
        default:
          break;
      }
    }
  }

  function setOnInitListener(listener: OnInitListenerBase) {
    initListenerBase = listener;
  }

  function setOnInitListener2(listener: (data: { eventName: string, data: any }) => void): void {
    innerInitListener = listener;
  }

  function setOnUploadListener(listener: OnUploadListenerBase) {
    sendListenerBase = listener;
  }

  function setOnUploadListener2(listener: (data: { eventName: string, data: any }) => void): void {
    sendListener = listener;
  }

  function setOnOldUploadListener(listener: OnUploadListenerBase) {
    oldSendListenerBase = listener;
  }

  function setOnOldUploadListener2(listener: (data: { eventName: string, data: any }) => void): void {
    oldSendListener = listener;
  }

  // init监听

  function setOnMergeConfigStart(listener: () => void): void {
    mergeConfigStartListener = listener;
  }

  function setOnMergeConfigFinish(listener: (data: string) => void): void {
    mergeConfigFinishListener = listener;
  }

  function setOnGetNetConfigError(listener: (data: { errorCode: number, errorMessage: string }) => void): void {
    getNetConfigErrorListener = listener;
  }

  function setOnSoLoadStart(listener: (data: boolean) => void): void {
    soLoadStartListener = listener;
  }

  function setOnSoLoadFinish(listener: (data: boolean) => void): void {
    soLoadFinishListener = listener;
  }

  function setOnSoLoadFail(listener: (data: { isDynamic: boolean, errorCode: number, errorMessage: string }) => void): void {
    soLoadFailListener = listener;
  }

  function setOnInitComplete(listener: () => void): void {
    initCompleteListener = listener;
  }

  function setOnInitRepeat(listener: () => void): void {
    initRepeatListener = listener;
  }

  function removeOnInitListener(): void {
    initListenerBase = null;
  }

  function removeOnInitListener2(): void {
    innerInitListener = null;
  }

  function removeMergeConfigStart(): void {
    mergeConfigStartListener = null;
  }

  function removeMergeConfigFinish(): void {
    mergeConfigFinishListener = null;
  }

  function removeGetNetConfigError(): void {
    getNetConfigErrorListener = null;
  }

  function removeSoLoadStart(): void {
    soLoadStartListener = null;
  }

  function removeSoLoadFinish(): void {
    soLoadFinishListener = null;
  }

  function removeSoLoadFail(): void {
    soLoadFailListener = null;
  }

  function removeInitComplete(): void {
    initCompleteListener = null;
  }

  function removeInitRepeat(): void {
    initRepeatListener = null;
  }

  // upload监听
  function setOnDetectTaskSuccessListener(listener: (data: { needUpLoad: boolean, dates: string }) => void) {
    detectSuccessListener = listener;
  }

  function setOnDetectTaskErrorListener(listener: (data: { errCode: number, errMsg: string }) => void) {
    detectErrorListener = listener;
  }

  function setOnStartListener(listener: (data: string) => void) {
    startListener = listener;
  }

  function setOnCancelListener(listener: () => void) {
    cancelListener = listener;
  }

  function setOnCancelSuccessListener(listener: () => void) {
    cancelSuccessListener = listener;
  }

  function setOnCancelErrorListener(listener: (data: { errCode: number, errMsg: string }) => void) {
    cancelErrorListener = listener;
  }

  function setOnCompleteListener(listener: () => void) {
    completeListener = listener;
  }

  function setOnFailListener(listener: (data: { errCode: number, errMsg: string }) => void) {
    failListener = listener;
  }

  function setOnItemStartListener(listener: (data: { index: number, path: string }) => void) {
    itemStartListener = listener;
  }

  function setOnItemProgressListener(listener: (data: { index: number, percent: number }) => void) {
    itemProgressListener = listener;
  }

  function setOnItemSuccessListener(listener: (data: number) => void) {
    itemSuccessListener = listener;
  }

  function setOnItemFailListener(listener: (data: { index: number, errorCode: number, errorMessage: string }) => void) {
    itemFailListener = listener;
  }

  function setOnItemPostSuccessListener(listener: (data: number) => void) {
    itemPostSuccessListener = listener;
  }

  function setOnItemPostFailListener(listener: (data: number) => void) {
    itemPostFailListener = listener;
  }

  function removeUploadListener() {
    sendListenerBase = null;
  }

  function removeUploadListener2() {
    sendListener = null;
  }

  function removeDetectTaskSuccessListener() {
    detectSuccessListener = null;
  }

  function removeDetectTaskErrorListener() {
    detectErrorListener = null;
  }

  function removeStartListener() {
    startListener = null;
  }

  function removeCancelListener() {
    cancelListener = null;
  }

  function removeCancelSuccessListener() {
    cancelSuccessListener = null;
  }

  function removeCancelErrorListener() {
    cancelErrorListener = null;
  }

  function removeCompleteListener() {
    completeListener = null;
  }

  function removeFailListener() {
    failListener = null;
  }

  function removeItemStartListener() {
    itemStartListener = null;
  }

  function removeItemProgressListener() {
    itemProgressListener = null;
  }

  function removeItemSuccessListener() {
    itemSuccessListener = null;
  }

  function removeItemFailListener() {
    itemFailListener = null;
  }

  function removeItemPostSuccessListener() {
    itemPostSuccessListener = null;
  }

  function removeItemPostFailListener() {
    itemPostFailListener = null;
  }

  // old upload监听

  function setOnOldStartListener(listener: (data: string) => void) {
    oldStartListener = listener;
  }

  function setOnOldCancelListener(listener: () => void) {
    oldCancelListener = listener;
  }

  function setOnOldCompleteListener(listener: () => void) {
    oldCompleteListener = listener;
  }

  function setOnOldFailListener(listener: (data: { errCode: number, errMsg: string }) => void) {
    oldFailListener = listener;
  }

  function setOnOldItemStartListener(listener: (data: { index: number, path: string }) => void) {
    oldItemStartListener = listener;
  }

  function setOnOldItemProgressListener(listener: (data: { index: number, percent: number }) => void) {
    oldItemProgressListener = listener;
  }

  function setOnOldItemSuccessListener(listener: (data: number) => void) {
    oldItemSuccessListener = listener;
  }

  function setOnOldItemFailListener(listener: (data: { index: number, errorCode: number, errorMessage: string }) => void) {
    oldItemFailListener = listener;
  }

  function setOnOldItemPostSuccessListener(listener: (data: number) => void) {
    oldItemPostSuccessListener = listener;
  }

  function setOnOldItemPostFailListener(listener: (data: number) => void) {
    oldItemPostFailListener = listener;
  }

  function removeOldUploadListener() {
    oldSendListenerBase = null;
  }

  function removeOldUploadListener2() {
    oldSendListener = null;
  }

  function removeOldStartListener() {
    oldStartListener = null;
  }

  function removeOldCancelListener() {
    oldCancelListener = null;
  }

  function removeOldCompleteListener() {
    oldCompleteListener = null;
  }

  function removeOldFailListener() {
    oldFailListener = null;
  }

  function removeOldItemStartListener() {
    oldItemStartListener = null;
  }

  function removeOldItemProgressListener() {
    oldItemProgressListener = null;
  }

  function removeOldItemSuccessListener() {
    oldItemSuccessListener = null;
  }

  function removeOldItemFailListener() {
    oldItemFailListener = null;
  }

  function removeOldItemPostSuccessListener() {
    oldItemPostSuccessListener = null;
  }

  function removeOldItemPostFailListener() {
    oldItemPostFailListener = null;
  }

  function destroyListener() {
    EventBus.$off(EventName.EVENT_NAME_INIT, onInitListener);
    EventBus.$off(EventName.EVENT_NAME_SEND, onSendListener);
    EventBus.$off(EventName.EVENT_NAME_OLD_SEND, onOldSendListener);

    removeOnInitListener()
    removeOnInitListener2()
    removeMergeConfigFinish()
    removeMergeConfigStart()
    removeGetNetConfigError()
    removeSoLoadStart()
    removeSoLoadFinish()
    removeSoLoadFail()
    removeInitComplete()
    removeInitRepeat()

    removeUploadListener();
    removeUploadListener2();
    removeDetectTaskSuccessListener();
    removeDetectTaskErrorListener();
    removeStartListener();
    removeCancelListener();
    removeCancelSuccessListener();
    removeCancelErrorListener();
    removeCompleteListener();
    removeFailListener();
    removeItemStartListener();
    removeItemProgressListener();
    removeItemSuccessListener();
    removeItemFailListener();
    removeItemPostSuccessListener();
    removeItemPostFailListener();

    removeOldUploadListener();
    removeOldUploadListener2();
    removeOldStartListener();
    removeOldCancelListener();
    removeOldCompleteListener();
    removeOldFailListener();
    removeOldItemStartListener();
    removeOldItemProgressListener();
    removeOldItemSuccessListener();
    removeOldItemFailListener();
    removeOldItemPostSuccessListener();
    removeOldItemPostFailListener();
  }

  return {
    initListener,

    setOnUploadListener,
    setOnUploadListener2,
    setOnDetectTaskSuccessListener,
    setOnDetectTaskErrorListener,
    setOnStartListener,
    setOnCancelListener,
    setOnCancelSuccessListener,
    setOnCancelErrorListener,
    setOnCompleteListener,
    setOnFailListener,
    setOnItemStartListener,
    setOnItemProgressListener,
    setOnItemSuccessListener,
    setOnItemFailListener,
    setOnItemPostSuccessListener,
    setOnItemPostFailListener,
    removeUploadListener,
    removeUploadListener2,
    removeDetectTaskSuccessListener,
    removeDetectTaskErrorListener,
    removeStartListener,
    removeCancelListener,
    removeCancelSuccessListener,
    removeCancelErrorListener,
    removeCompleteListener,
    removeFailListener,
    removeItemStartListener,
    removeItemProgressListener,
    removeItemSuccessListener,
    removeItemFailListener,
    removeItemPostSuccessListener,
    removeItemPostFailListener,

    setOnInitListener,
    setOnInitListener2,
    setOnMergeConfigStart,
    setOnMergeConfigFinish,
    setOnGetNetConfigError,
    setOnSoLoadStart,
    setOnSoLoadFinish,
    setOnSoLoadFail,
    setOnInitComplete,
    setOnInitRepeat,
    removeOnInitListener,
    removeOnInitListener2,
    removeMergeConfigStart,
    removeMergeConfigFinish,
    removeGetNetConfigError,
    removeSoLoadStart,
    removeSoLoadFinish,
    removeSoLoadFail,
    removeInitComplete,
    removeInitRepeat,

    setOnOldUploadListener,
    setOnOldUploadListener2,
    setOnOldStartListener,
    setOnOldCancelListener,
    setOnOldCompleteListener,
    setOnOldFailListener,
    setOnOldItemStartListener,
    setOnOldItemProgressListener,
    setOnOldItemSuccessListener,
    setOnOldItemFailListener,
    setOnOldItemPostSuccessListener,
    setOnOldItemPostFailListener,
    removeOldUploadListener,
    removeOldUploadListener2,
    removeOldStartListener,
    removeOldCancelListener,
    removeOldCompleteListener,
    removeOldFailListener,
    removeOldItemStartListener,
    removeOldItemProgressListener,
    removeOldItemSuccessListener,
    removeOldItemFailListener,
    removeOldItemPostSuccessListener,
    removeOldItemPostFailListener,

    destroyListener,
  }
}
