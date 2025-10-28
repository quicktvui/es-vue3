import {Native} from "@extscreen/es3-vue";
import {IESModule} from "@extscreen/es3-core";
import {ESPlayerLog, ESPlayerLogLevel, ESPlayerRate} from "@extscreen/es3-player";
import {ESAudioExtraData} from "../core/ESAudioExtraData";

export interface ESAudioPlayerModule extends IESModule {

  init(): Promise<string | null>

  isSelf(id: string): boolean

  getId(): string | null

  play(url: string, extraData: ESAudioExtraData): void

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

export function createESAudioPlayerModule(log: ESPlayerLog): ESAudioPlayerModule {

  let audioPlayerId: string | null = null;

  const TAG = "ESAudioPlayerModule"

  function init(): Promise<string | null> {
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "-----音频--Vue模块--init----START-->>>>>");
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'initMediaPlayer')
      .then((id: string) => {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.e(TAG, "-----音频--Vue模块--init---END--->>>>>AudioPlayerId:" + id);
        }
        audioPlayerId = id
        return Promise.resolve(id)
      });
  }

  function isSelf(id: string): boolean {
    return audioPlayerId == id;
  }

  function getId(): string | null {
    return audioPlayerId;
  }

  function play(url: string, extraData: ESAudioExtraData) {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "-----音频-Vue模块--play------>>>>>AudioPlayerId is null");
      }
      return;
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "---音频---Vue模块--play------>>>>>+ AudioPlayerId：" + audioPlayerId + "url:" + url);
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'play2', audioPlayerId, url, extraData);
  }

  function start() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--start------>>>>>AudioPlayerId is null");
      }
      return;
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "------音频--Vue模块--start-------->>>>>" + audioPlayerId);
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'start', audioPlayerId);
  }

  function pause() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "-----音频--Vue模块-pause------>>>>>AudioPlayerId is null");
      }
      return;
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "------音频--Vue模块--pause-------->>>>>" + audioPlayerId);
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'pause', audioPlayerId);
  }

  function resume() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--resume------>>>>>AudioPlayerId is null");
      }
      return;
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "-----音频--Vue模块---resume-------->>>>>" + audioPlayerId);
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'resume', audioPlayerId);
  }

  function seekTo(progress) {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "-----音频--Vue模块-seekTo------>>>>>AudioPlayerId is null");
      }
      return;
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "-----音频---Vue模块--seekTo-------->>>>>" + audioPlayerId);
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'seekTo', audioPlayerId, progress);
  }

  function stop() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频---Vue模块-stop------>>>>>AudioPlayerId is null");
      }
      return;
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "-----音频---Vue模块--stop-------->>>>>" + audioPlayerId);
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'stop', audioPlayerId);
  }

  function setPlayRate(speed) {
    if (audioPlayerId == null) {
      return;
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'setPlayRate', audioPlayerId, Number(speed));
  }

  function setLeftRightVolume(leftVolume, rightVolume) {
    if (audioPlayerId == null) {
      return;
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'setVolume', audioPlayerId, leftVolume, rightVolume);
  }

  function reset() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--reset------>>>>>AudioPlayerId is null");
      }
      return;
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "-----音频---Vue模块--reset-------->>>>>" + audioPlayerId);
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'reset', audioPlayerId);
  }

  function release() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--release------>>>>>AudioPlayerId is null");
      }
      return;
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "-----音频---Vue模块--release-------->>>>>" + audioPlayerId);
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'release', audioPlayerId);
  }

  function isPlaying() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频---Vue模块-isPlaying------>>>>>AudioPlayerId is null");
      }
      return Promise.resolve(false);
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "------音频--Vue模块--isPlaying-------->>>>>" + audioPlayerId);
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'isPlaying', audioPlayerId)
  }

  function isPaused() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--isPaused------>>>>>AudioPlayerId is null");
      }
      return Promise.resolve(false);
    }
    if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
      log.e(TAG, "------音频--Vue模块--isPaused-------->>>>>" + audioPlayerId);
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'isPaused', audioPlayerId);
  }

  function getDuration() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--getDuration------>>>>>AudioPlayerId is null");
      }
      return Promise.resolve(-1);
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'getDuration', audioPlayerId);
  }

  function getCurrentPosition() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "-----音频--Vue模块-getCurrentPosition------>>>>>AudioPlayerId is null");
      }
      return Promise.resolve(-1);
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'getCurrentPosition', audioPlayerId);
  }

  function getBufferPercentage() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "-----音频-Vue模块--getBufferPercentage------>>>>>AudioPlayerId is null");
      }
      return Promise.resolve(-1);
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'getBufferPercentage', audioPlayerId);
  }

  function getCurrentPlayRate() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--getCurrentPlayRate------>>>>>AudioPlayerId is null");
      }
      return Promise.resolve(-1);
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'getCurrentPlayRate', audioPlayerId);
  }

  function setVolume(volume) {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "-----音频-Vue模块--setVolume------>>>>>AudioPlayerId is null");
      }
      return;
    }
    Native.callNative('ESIJKAudioPlayerModule2', 'setVolume', audioPlayerId, volume);
  }

  function getLeftVolume() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--getLeftVolume------>>>>>AudioPlayerId is null");
      }
      return Promise.resolve(-1);
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'getLeftVolume', audioPlayerId);
  }

  function getRightVolume() {
    if (audioPlayerId == null) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.e(TAG, "----音频--Vue模块--getRightVolume------>>>>>AudioPlayerId is null");
      }
      return Promise.resolve(-1);
    }
    return Native.callNativeWithPromise('ESIJKAudioPlayerModule2', 'getRightVolume', audioPlayerId);
  }

  return {
    init,
    isSelf,
    getId,
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
