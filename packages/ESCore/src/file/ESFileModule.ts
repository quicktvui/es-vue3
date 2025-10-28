import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";

export interface ESFileModule extends IESModule {

  newFile(pathname: string): Promise<number>

  newESFile(pathname: string): Promise<number>

  getName(fileId: number): Promise<string>

  getParent(fileId: number): Promise<string>

  getPath(fileId: number): Promise<string>

  isAbsolute(fileId: number): Promise<boolean>

  getAbsolutePath(fileId: number): Promise<string>

  getCanonicalPath(fileId: number): Promise<string>

  canRead(fileId: number): Promise<boolean>

  canWrite(fileId: number): Promise<boolean>

  exists(fileId: number): Promise<boolean>

  isDirectory(fileId: number): Promise<boolean>

  isFile(fileId: number): Promise<boolean>

  isHidden(fileId: number): Promise<boolean>

  lastModified(fileId: number): Promise<number>

  length(fileId: number): Promise<number>

  createNewFile(fileId: number): Promise<boolean>

  deleteOnExit(fileId: number): Promise<boolean>

  list(fileId: number): Promise<Array<string>>

  mkdir(fileId: number): Promise<boolean>

  mkdirs(fileId: number): Promise<boolean>

  setLastModified(fileId: number, time: number): Promise<boolean>

  getTotalSpace(fileId: number): Promise<number>

  getFreeSpace(fileId: number): Promise<number>

  getUsableSpace(fileId: number): Promise<number>

  deleteFile(fileId: number): Promise<boolean>

  setReadOnly(fileId: number): Promise<boolean>

  setWritableOwnerOnly(fileId: number, writable: boolean, ownerOnly: boolean): Promise<boolean>

  setWritable(fileId: number, writable: boolean): Promise<boolean>

  setReadableOwnerOnly(fileId: number, readable: boolean, ownerOnly: boolean): Promise<boolean>

  setReadable(fileId: number, readable: boolean): Promise<boolean>

  setExecutableOwnerOnly(fileId: number, executable: boolean, ownerOnly: boolean): Promise<boolean>

  setExecutable(fileId: number, executable: boolean): Promise<boolean>

  canExecute(fileId: number): Promise<boolean>

  renameTo(fileId: number, renameFileId: number): Promise<boolean>

  close(fileId: number): Promise<boolean>
}


export function createESFileModule(): ESFileModule {

  function newFile(pathname) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'newFile', {pathname: pathname}
    );
  }

  function newESFile(pathname) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'newESFile', {pathname: pathname}
    );
  }

  function getName(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'getName', {id: fileId}
    );
  }

  function getParent(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'getParent', {id: fileId}
    );
  }

  function getPath(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'getPath', {id: fileId}
    );
  }

  function isAbsolute(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'isAbsolute', {id: fileId}
    );
  }

  function getAbsolutePath(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'getAbsolutePath', {id: fileId}
    );
  }

  function getCanonicalPath(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'getCanonicalPath', {id: fileId}
    );
  }

  function canRead(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'canRead', {id: fileId}
    );
  }

  function canWrite(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'canWrite', {id: fileId}
    );
  }

  function exists(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'exists', {id: fileId}
    );
  }

  function isDirectory(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'isDirectory', {id: fileId}
    );
  }

  function isFile(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'isFile', {id: fileId}
    );
  }

  function isHidden(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'isHidden', {id: fileId}
    );
  }

  function lastModified(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'lastModified', {id: fileId}
    );
  }

  function length(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'length', {id: fileId}
    );
  }

  function createNewFile(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'createNewFile', {id: fileId}
    );
  }

  function deleteOnExit(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'deleteOnExit', {id: fileId}
    );
  }

  function list(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'list', {id: fileId}
    );
  }

  function mkdir(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'mkdir', {id: fileId}
    );
  }

  function mkdirs(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'mkdirs', {id: fileId}
    );
  }

  function setLastModified(fileId, time) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'setLastModified', {id: fileId, time: time}
    );
  }

  function getTotalSpace(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'getTotalSpace', {id: fileId}
    );
  }

  function getFreeSpace(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'getFreeSpace', {id: fileId}
    );
  }

  function getUsableSpace(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'getUsableSpace', {id: fileId}
    );
  }

  function deleteFile(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'delete', {id: fileId}
    );
  }

  function setReadOnly(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'setReadOnly', {id: fileId}
    );
  }

  function setWritableOwnerOnly(fileId, writable, ownerOnly) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'setReadOnly', {
        id: fileId,
        writable: writable,
        ownerOnly: ownerOnly,
      }
    );
  }

  function setWritable(fileId, writable) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'setWritable', {
        id: fileId,
        writable: writable,
      }
    );
  }

  function setReadableOwnerOnly(fileId, readable, ownerOnly) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'setReadableOwnerOnly', {
        id: fileId,
        readable: readable,
        ownerOnly: ownerOnly,
      }
    );
  }


  function setReadable(fileId, readable) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'setReadable', {
        id: fileId,
        readable: readable,
      }
    );
  }

  function setExecutableOwnerOnly(fileId, executable, ownerOnly) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'setExecutableOwnerOnly', {
        id: fileId,
        executable: executable,
        ownerOnly: ownerOnly,
      }
    );
  }

  function setExecutable(fileId, executable) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'setExecutable', {
        id: fileId,
        executable: executable
      }
    );
  }

  function canExecute(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'canExecute', {id: fileId}
    );
  }

  function renameTo(fileId, renameFileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'canExecute', {id: fileId, renameFileId: renameFileId}
    );
  }

  function close(fileId) {
    return Native.callNativeWithPromise('AndroidFileModule',
      'close', {id: fileId}
    );
  }

  return {
    newFile,
    newESFile,
    getName,
    getParent,
    getPath,
    isAbsolute,
    getAbsolutePath,
    getCanonicalPath,
    canRead,
    canWrite,
    exists,
    isDirectory,
    isFile,
    isHidden,
    lastModified,
    length,
    createNewFile,
    deleteOnExit,
    list,
    mkdir,
    mkdirs,
    setLastModified,
    getTotalSpace,
    getFreeSpace,
    getUsableSpace,
    deleteFile,
    setReadOnly,
    setWritableOwnerOnly,
    setWritable,
    setReadableOwnerOnly,
    setReadable,
    setExecutableOwnerOnly,
    setExecutable,
    canExecute,
    renameTo,
    close,
  }
}

