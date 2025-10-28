import { createESFileModule, ESFileModule } from "./ESFileModule";

export default class ESFile {
  constructor() {}
  __fileId = -1;
  __fileModule: ESFileModule = createESFileModule();

  newFile(pathname: string): Promise<number> {
    return this.__fileModule.newFile(pathname).then((fileId) => {
      this.__fileId = fileId;
      return Promise.resolve(fileId);
    });
  }

  newAbsolutePathFile(pathname: string): Promise<number> {
    return this.__fileModule.newESFile(pathname).then((fileId) => {
      this.__fileId = fileId;
      return Promise.resolve(fileId);
    });
  }

  getFileId(): number {
    return this.__fileId;
  }

  getName(): Promise<string> {
    return this.__fileModule.getName(this.getFileId());
  }

  getParent(): Promise<string> {
    return this.__fileModule.getParent(this.getFileId());
  }

  getPath(): Promise<string> {
    return this.__fileModule.getPath(this.getFileId());
  }

  isAbsolute(): Promise<boolean> {
    return this.__fileModule.isAbsolute(this.getFileId());
  }

  getAbsolutePath(): Promise<string> {
    return this.__fileModule.getAbsolutePath(this.getFileId());
  }

  getCanonicalPath(): Promise<string> {
    return this.__fileModule.getCanonicalPath(this.getFileId());
  }

  canRead(): Promise<boolean> {
    return this.__fileModule.canRead(this.getFileId());
  }

  canWrite(): Promise<boolean> {
    return this.__fileModule.canWrite(this.getFileId());
  }

  exists(): Promise<boolean> {
    return this.__fileModule.exists(this.getFileId());
  }

  isDirectory(): Promise<boolean> {
    return this.__fileModule.isDirectory(this.getFileId());
  }

  isFile(): Promise<boolean> {
    return this.__fileModule.isFile(this.getFileId());
  }

  isHidden(): Promise<boolean> {
    return this.__fileModule.isHidden(this.getFileId());
  }

  lastModified(): Promise<number> {
    return this.__fileModule.lastModified(this.getFileId());
  }

  length(): Promise<number> {
    return this.__fileModule.length(this.getFileId());
  }

  createNewFile(): Promise<boolean> {
    return this.__fileModule.createNewFile(this.getFileId());
  }

  deleteOnExit(): Promise<boolean> {
    return this.__fileModule.deleteOnExit(this.getFileId());
  }

  list(): Promise<Array<string>> {
    return this.__fileModule.list(this.getFileId());
  }

  mkdir(): Promise<boolean> {
    return this.__fileModule.mkdir(this.getFileId());
  }

  mkdirs(): Promise<boolean> {
    return this.__fileModule.mkdirs(this.getFileId());
  }

  setLastModified(time: number): Promise<boolean> {
    return this.__fileModule.setLastModified(this.getFileId(), time);
  }

  getTotalSpace(): Promise<number> {
    return this.__fileModule.getTotalSpace(this.getFileId());
  }

  getFreeSpace(): Promise<number> {
    return this.__fileModule.getFreeSpace(this.getFileId());
  }

  getUsableSpace(): Promise<number> {
    return this.__fileModule.getUsableSpace(this.getFileId());
  }

  delete(): Promise<boolean> {
    return this.__fileModule.deleteFile(this.getFileId());
  }

  setReadOnly(): Promise<boolean> {
    return this.__fileModule.setReadOnly(this.getFileId());
  }

  setWritableOwnerOnly(writable: boolean, ownerOnly: boolean): Promise<boolean> {
    return this.__fileModule.setWritableOwnerOnly(this.getFileId(), writable, ownerOnly);
  }

  setWritable(writable: boolean): Promise<boolean> {
    return this.__fileModule.setWritable(this.getFileId(), writable);
  }

  setReadableOwnerOnly(readable: boolean, ownerOnly: boolean): Promise<boolean> {
    return this.__fileModule.setReadableOwnerOnly(this.getFileId(), readable, ownerOnly);
  }

  setReadable(readable: boolean): Promise<boolean> {
    return this.__fileModule.setReadable(this.getFileId(), readable);
  }

  setExecutableOwnerOnly(executable: boolean, ownerOnly: boolean): Promise<boolean> {
    return this.__fileModule.setExecutableOwnerOnly(this.getFileId(), executable, ownerOnly);
  }

  setExecutable(executable: boolean): Promise<boolean> {
    return this.__fileModule.setExecutable(this.getFileId(), executable);
  }

  canExecute(): Promise<boolean> {
    return this.__fileModule.canExecute(this.getFileId());
  }

  renameTo(renameFileId: number): Promise<boolean> {
    return this.__fileModule.renameTo(this.getFileId(), renameFileId);
  }

  close(): Promise<boolean> {
    return this.__fileModule.close(this.getFileId());
  }
}
