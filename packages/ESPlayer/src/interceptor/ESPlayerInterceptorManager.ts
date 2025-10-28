/**
 *
 */
import {ESIPlayerManager} from "../core/ESIPlayerManager";
import {App} from "vue";
import {playerInterceptorManagerKey} from "../injectionSymbols";
import {ESIPlayerInterceptor} from "./ESIPlayerInterceptor";
import {ESPlayerInterceptorType} from "./ESPlayerInterceptorType";

export interface ESPlayerInterceptorManager extends ESIPlayerManager {

  addInterceptor<T extends ESIPlayerInterceptor>(interceptor: T): void

  removeInterceptor<T extends ESIPlayerInterceptor>(interceptor: T): void

  getInterceptorsByType(type: ESPlayerInterceptorType): Array<ESIPlayerInterceptor> | null

  getInterceptorsById(id: string): Array<ESIPlayerInterceptor> | null

  getInterceptors(): Array<ESIPlayerInterceptor>

  clearInterceptors(): void
}

export function createESPlayerInterceptorManager(): ESPlayerInterceptorManager {

  let _interceptorList: ESIPlayerInterceptor[] = [];

  function init(...params: any[]): Promise<any> {
    return Promise.resolve();
  }

  function addInterceptor<T extends ESIPlayerInterceptor>(interceptor: T) {
    if (_interceptorList && _interceptorList.length > 0) {
      for (let i = 0; i < _interceptorList.length; i++) {
        let l = _interceptorList[i];
        if (l.id === interceptor.id) {
          return;
        }
      }
    }
    _interceptorList.push(interceptor);
  }

  function removeInterceptor<T extends ESIPlayerInterceptor>(interceptor: T) {
    if (_interceptorList && _interceptorList.length > 0) {
      let index = -1;
      for (let i = 0; i < _interceptorList.length; i++) {
        let l = _interceptorList[i];
        if (l.id === interceptor.id) {
          index = i;
        }
      }
      if (index > -1) {
        _interceptorList.splice(index, 1);
      }
    }
  }

  function getInterceptorsByType(type) {
    if (!_interceptorList || _interceptorList.length <= 0) {
      return null;
    }
    return _interceptorList.filter(i => i.type === type);
  }

  function getInterceptorsById(id) {
    if (!_interceptorList || _interceptorList.length <= 0) {
      return null;
    }
    return _interceptorList.filter(i => i.type === id);
  }

  function getInterceptors() {
    return _interceptorList;
  }

  function clearInterceptors() {
    _interceptorList = [];
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(playerInterceptorManagerKey, instance)
    },
    init,
    addInterceptor,
    removeInterceptor,
    getInterceptorsByType,
    getInterceptorsById,
    getInterceptors,
    clearInterceptors,
  }
}
