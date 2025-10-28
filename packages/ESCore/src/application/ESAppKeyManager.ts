import {ComponentPublicInstance} from "@vue/runtime-core";
import {EventBus} from "@extscreen/es3-vue";
import {ESKeyEvent} from "../key";

export interface ESAppKeyManager {

  init(applicationInstance: ComponentPublicInstance): void

  onBackPressed(applicationInstance: ComponentPublicInstance): void

  onDispatchKeyEvent(applicationInstance: ComponentPublicInstance, keyEvent: ESKeyEvent): void

  onKeyDown(applicationInstance: ComponentPublicInstance, keyEvent: ESKeyEvent): void

  onKeyUp(applicationInstance: ComponentPublicInstance, keyEvent: ESKeyEvent): void
}

export function createESAppKeyManager(): ESAppKeyManager {

  const TAG = 'ESAppKeyManager'

  function init(applicationInstance: ComponentPublicInstance): void {
    EventBus.$on('hardwareBackPress', () => {
      onBackPressed(applicationInstance)
    });
    EventBus.$on('DispatchKeyEvent', (keyEvent: ESKeyEvent) => {
      //
      onDispatchKeyEvent(applicationInstance, keyEvent)
      //
      if (keyEvent && keyEvent.action === 0) {
        onKeyDown(applicationInstance, keyEvent)
      } else if (keyEvent && keyEvent.action === 1) {
        onKeyUp(applicationInstance, keyEvent)
      }
    });
  }

  function onBackPressed(applicationInstance: ComponentPublicInstance): void {
    try {
      if (_isFunction(applicationInstance['onBackPressed'])) {
        applicationInstance['onBackPressed']();
      }
    } catch (e) {
      console.log(TAG, 'onBackPressed error ', e)
    }
  }

  function onDispatchKeyEvent(applicationInstance: ComponentPublicInstance, keyEvent: ESKeyEvent): void {
    try {
      if (_isFunction(applicationInstance['onDispatchKeyEvent'])) {
        applicationInstance['onDispatchKeyEvent'](keyEvent)
      }
    } catch (e) {
      console.log(TAG, 'onDispatchKeyEvent error ', e)
    }
  }

  function onKeyDown(applicationInstance: ComponentPublicInstance, keyEvent: ESKeyEvent): void {
    try {
      if (_isFunction(applicationInstance['onKeyDown'])) {
        applicationInstance['onKeyDown'](keyEvent)
      }
    } catch (e) {
      console.log(TAG, 'onKeyDown error ', e)
    }
  }

  function onKeyUp(applicationInstance: ComponentPublicInstance, keyEvent: ESKeyEvent): void {
    try {
      if (_isFunction(applicationInstance['onKeyUp'])) {
        applicationInstance['onKeyUp'](keyEvent)
      }
    } catch (e) {
      console.log(TAG, 'onKeyUp error ', e)
    }
  }

  function _isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]';
  }

  const manager: ESAppKeyManager = {
    init,
    onBackPressed,
    onDispatchKeyEvent,
    onKeyDown,
    onKeyUp
  }
  return manager;
}
