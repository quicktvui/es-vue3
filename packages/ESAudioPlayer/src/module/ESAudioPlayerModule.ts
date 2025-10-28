import {Native} from "@extscreen/es3-vue";
import {IESModule} from "@extscreen/es3-core";
import {ESPlayerLogLevel, ESPlayerRate} from "@extscreen/es3-player";

export interface ESAudioPlayerModule extends IESModule {

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

export function createESAudioPlayerModule(): ESAudioPlayerModule {
  function init() {
    Native.callNative('ESIJKAudioPlayerModule', 'initMediaPlayer');
  }

  function play(url) {
    Native.callNative('ESIJKAudioPlayerModule', 'play', url);
  }

  function start() {
    Native.callNative('ESIJKAudioPlayerModule', 'start');
  }

  function pause() {
    Native.callNative('ESIJKAudioPlayerModule', 'pause');
  }

  function resume() {
    Native.callNative('ESIJKAudioPlayerModule', 'resume');
  }

  function seekTo(progress) {
    Native.callNative('ESIJKAudioPlayerModule', 'seekTo', progress);
  }

  function stop() {
    Native.callNative('ESIJKAudioPlayerModule', 'stop');
  }

  function setPlayRate(speed) {
    console.log('----ESAudioPlayerModule-----setPlayRate--------->>>>' + speed)
    Native.callNative('ESIJKAudioPlayerModule', 'setPlayRate', Number(speed));
  }

  function setLeftRightVolume(leftVolume, rightVolume) {
    Native.callNative('ESIJKAudioPlayerModule', 'setVolume', leftVolume, rightVolume);
  }

  function reset() {
    Native.callNative('ESIJKAudioPlayerModule', 'reset');
  }

  function release() {
    Native.callNative('ESIJKAudioPlayerModule', 'release');
  }

  function isPlaying() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule', 'isPlaying');
  }

  function isPaused() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule', 'isPaused');
  }

  function getDuration() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule', 'getDuration');
  }

  function getCurrentPosition() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule', 'getCurrentPosition');
  }

  function getBufferPercentage() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule', 'getBufferPercentage');
  }

  function getCurrentPlayRate() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule', 'getCurrentPlayRate');
  }

  function setVolume(volume) {
    Native.callNative('ESIJKAudioPlayerModule', 'setVolume', volume);
  }

  function getLeftVolume() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule', 'getLeftVolume');
  }

  function getRightVolume() {
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule', 'getRightVolume');
  }

  return {
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
