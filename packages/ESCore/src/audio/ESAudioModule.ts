import {IESModule} from "../core";
import {Native} from "@extscreen/es3-vue";
import {ESAudioStreamType} from "./ESAudioStreamType";
import {ESAudioDurationHint} from "./ESAudioDurationHint";
import {ESAudioDirection} from "./ESAudioDirection";
import {ESAudioManagerFlag} from "./ESAudioManagerFlag";

export interface ESAudioModule extends IESModule {

  requestAudioFocus(streamType: ESAudioStreamType,
                    durationHint: ESAudioDurationHint): Promise<number>

  abandonAudioFocus(): Promise<number>

  //------------------------通话音量------------------------
  getStreamVoiceCallMaxVolume(): Promise<number>

  getStreamVoiceCallVolume(): Promise<number>

//------------------------系统音量------------------------
  getStreamSystemMaxVolume(): Promise<number>

  getStreamSystemVolume(): Promise<number>

//------------------------铃声音量------------------------
  getStreamRingMaxVolume(): Promise<number>

  getStreamRingVolume(): Promise<number>

//------------------------音乐音量------------------------
  getStreamMusicMaxVolume(): Promise<number>

  getStreamMusicVolume(): Promise<number>

//------------------------提示音音量------------------------
  getStreamAlarmMaxVolume(): Promise<number>

  getStreamAlarmVolume(): Promise<number>

//------------------------音量------------------------
  getStreamMaxVolume(streamType: ESAudioStreamType): Promise<number>

  getStreamVolume(streamType: ESAudioStreamType): Promise<number>

//------------------------调整音量------------------------
  adjustStreamVolume(streamType: ESAudioStreamType, direction: ESAudioDirection, flags: ESAudioManagerFlag): void

  setStreamVolume(streamType: ESAudioStreamType, volume: number, flags: ESAudioManagerFlag): void

  setStreamMute(streamType: ESAudioStreamType, state: boolean): void
}

export function createESAudioModule(): ESAudioModule {

  function requestAudioFocus(streamType, durationHint,) {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'requestAudioFocus', [streamType, durationHint]);
  }

  function abandonAudioFocus() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'abandonAudioFocus');
  }

//------------------------通话音量------------------------
  function getStreamVoiceCallMaxVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamVoiceCallMaxVolume');
  }

  function getStreamVoiceCallVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamVoiceCallVolume');
  }

  //------------------------系统音量------------------------
  function getStreamSystemMaxVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamSystemMaxVolume');
  }

  function getStreamSystemVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamSystemVolume');
  }

  //------------------------铃声音量------------------------
  function getStreamRingMaxVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamRingMaxVolume');
  }

  function getStreamRingVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamRingVolume');
  }

  //------------------------音乐音量------------------------
  function getStreamMusicMaxVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamMusicMaxVolume');
  }

  function getStreamMusicVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamMusicVolume');
  }

  //------------------------提示音音量------------------------
  function getStreamAlarmMaxVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamAlarmMaxVolume');
  }

  function getStreamAlarmVolume() {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamAlarmVolume');
  }

  //------------------------音量------------------------
  function getStreamMaxVolume(streamType) {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamMaxVolume', streamType);
  }

  function getStreamVolume(streamType) {
    return Native.callNativeWithPromise('AndroidAudioModule',
      'getStreamVolume', streamType);
  }

  //------------------------调整音量------------------------
  function adjustStreamVolume(streamType, adjust, flags) {
    Native.callNative('AndroidAudioModule',
      'adjustStreamVolume', [streamType, adjust, flags]);
  }

  function setStreamVolume(streamType, index, flags) {
    Native.callNative('AndroidAudioModule',
      'setStreamVolume', [streamType, index, flags]);
  }

  function setStreamMute(streamType, state) {
    Native.callNative('AndroidAudioModule',
      'setStreamMute', [streamType, state]);
  }

  return {
    requestAudioFocus,
    abandonAudioFocus,
    getStreamVoiceCallMaxVolume,
    getStreamVoiceCallVolume,
    getStreamSystemMaxVolume,
    getStreamSystemVolume,
    getStreamRingMaxVolume,
    getStreamRingVolume,
    getStreamMusicMaxVolume,
    getStreamMusicVolume,
    getStreamAlarmMaxVolume,
    getStreamAlarmVolume,
    getStreamMaxVolume,
    getStreamVolume,
    adjustStreamVolume,
    setStreamVolume,
    setStreamMute
  }
}
