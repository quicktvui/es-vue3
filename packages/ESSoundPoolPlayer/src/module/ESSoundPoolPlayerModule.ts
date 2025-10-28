import { Native } from "@extscreen/es3-vue";
import { IESModule } from "@extscreen/es3-core";
import { ESSoundPoolUsage } from "../core/ESSoundPoolUsage";
import { ESSoundPoolContentType } from "../core/ESSoundPoolContentType";
import { ESSoundPoolStreamType } from "../core/ESSoundPoolStreamType";
import { ESPlayerRate } from "@extscreen/es3-player";

export interface ESSoundPoolPlayerModule extends IESModule {
  initSoundPool(
    usage: ESSoundPoolUsage,
    contentType: ESSoundPoolContentType,
    maxStreams: number,
    streamType: ESSoundPoolStreamType,
    enableCache: boolean,
  ): void;

  load(url: string): Promise<number>;

  unload(soundID: number): void;

  play(
    soundID: number,
    leftVolume: number,
    rightVolume: number,
    priority: number,
    loop: number,
    rate: ESPlayerRate,
  ): Promise<number>;

  pause(streamID: number): void;

  autoPause(): void;

  resume(streamID: number): void;

  autoResume(): void;

  stop(streamID: number): void;

  setVolume(streamID: number, leftVolume: number, rightVolume: number): void;

  setRate(streamID: number, rate: number): void;

  setPriority(streamID: number, priority: number): void;

  setLoop(streamID: number, loop: boolean): void;

  release(): void;
}

export function createESSoundPoolPlayerModule(): ESSoundPoolPlayerModule {
  function initSoundPool(usage, contentType, maxStreams, streamType, enableCache) {
    Native.callNative(
      "ESSoundPoolAudioPlayerModule",
      "initSoundPool",
      usage,
      contentType,
      maxStreams,
      streamType,
      enableCache,
    );
  }

  function load(url) {
    return Native.callNativeWithPromise("ESSoundPoolAudioPlayerModule", "load", url);
  }

  function unload(soundID) {
    Native.callNative("ESSoundPoolAudioPlayerModule", "unload", soundID);
  }

  function play(soundID, leftVolume, rightVolume, priority, loop, rate) {
    return Native.callNativeWithPromise(
      "ESSoundPoolAudioPlayerModule",
      "play",
      soundID,
      Number(leftVolume),
      Number(rightVolume),
      priority,
      loop,
      Number(rate),
    );
  }

  function pause(streamID) {
    Native.callNative("ESSoundPoolAudioPlayerModule", "pause", streamID);
  }

  function autoPause() {
    Native.callNative("ESSoundPoolAudioPlayerModule", "autoPause");
  }

  function resume(streamID) {
    Native.callNative("ESSoundPoolAudioPlayerModule", "resume", streamID);
  }

  function autoResume() {
    Native.callNative("ESSoundPoolAudioPlayerModule", "autoResume");
  }

  function stop(streamID) {
    Native.callNative("ESSoundPoolAudioPlayerModule", "stop", streamID);
  }

  function setVolume(streamID, leftVolume, rightVolume) {
    Native.callNative(
      "ESSoundPoolAudioPlayerModule",
      "setVolume",
      streamID,
      leftVolume,
      rightVolume,
    );
  }

  function setRate(streamID, rate) {
    Native.callNative("ESSoundPoolAudioPlayerModule", "setRate", streamID, rate);
  }

  function setPriority(streamID, priority) {
    Native.callNative("ESSoundPoolAudioPlayerModule", "setPriority", streamID, priority);
  }

  function setLoop(streamID, loop) {
    Native.callNative("ESSoundPoolAudioPlayerModule", "setLoop", streamID, loop);
  }

  function release() {
    Native.callNative("ESSoundPoolAudioPlayerModule", "release");
  }

  return {
    initSoundPool,
    load,
    unload,
    play,
    pause,
    autoPause,
    resume,
    autoResume,
    stop,
    setVolume,
    setRate,
    setPriority,
    setLoop,
    release,
  };
}
