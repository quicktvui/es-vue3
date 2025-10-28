import {Native} from "@extscreen/es3-vue";
import {IESModule} from "@extscreen/es3-core";
import {ESPlayerRate} from "@extscreen/es3-player";

export interface ESAudioServicePlayerModule extends IESModule {

  bindService(): void

  unbindService(): void

  stopService(): void

  init(): void

  play(url: string): void

  start(): void

  pause(): void

  resume(): void

  seekTo(progress: number): void

  stop(): void

  setPlayRate(speed: ESPlayerRate): void

  setVolume(volume: number): void

  setLeftRightVolume(leftVolume: number, rightVolume: number): void

  reset(): void

  release(): void

  isPlaying(): Promise<boolean>

  isPaused(): Promise<boolean>

  getDuration(): Promise<number>

  getCurrentPosition(): Promise<number>

  getBufferPercentage(): Promise<number>

  getCurrentPlayRate(): Promise<ESPlayerRate>

  getLeftVolume(): Promise<number>

  getRightVolume(): Promise<number>
}

export function createESAudioServicePlayerModule(): ESAudioServicePlayerModule {

  function bindService() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'bindService');
  }

  function unbindService() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'unbindService');
  }

  function stopService() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'stopService');
  }

  function init() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'initAudioPlayer');
  }

  function play(url) {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'play', url);
  }

  function start() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'start');
  }

  function pause() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'pause');
  }

  function resume() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'resume');
  }

  function seekTo(progress) {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'seekTo', progress);
  }

  function stop() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'stop');
  }

  function setPlayRate(speed) {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'setPlayRate', speed);
  }

  function setVolume(volume) {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'setVolume', volume);
  }

  function setLeftRightVolume(leftVolume, rightVolume) {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'setVolume', leftVolume, rightVolume);
  }

  function reset() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'reset');
  }

  function release() {
    Native.callNative('ESIJKAudioPlayerServiceModule', 'release');
  }

  function isPlaying() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerServiceModule', 'isPlaying');
  }

  function isPaused() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerServiceModule', 'isPaused');
  }

  function getDuration() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerServiceModule', 'getDuration');
  }

  function getCurrentPosition() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerServiceModule', 'getCurrentPosition');
  }

  function getBufferPercentage() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerServiceModule', 'getBufferPercentage');
  }

  function getCurrentPlayRate() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerServiceModule', 'getCurrentPlayRate');
  }

  function getLeftVolume() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerServiceModule', 'getLeftVolume');
  }

  function getRightVolume() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerServiceModule', 'getRightVolume');
  }

  return {
    bindService,
    unbindService,
    stopService,
    init,
    play,
    start,
    pause,
    resume,
    seekTo,
    stop,
    setPlayRate,
    setVolume,
    setLeftRightVolume,
    reset,
    release,
    isPlaying,
    isPaused,
    getDuration,
    getCurrentPosition,
    getBufferPercentage,
    getCurrentPlayRate,
    getLeftVolume,
    getRightVolume
  }
}
