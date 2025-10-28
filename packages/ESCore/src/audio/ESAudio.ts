import {IESManager} from "../core";
import {App} from "vue";
import {ESAudioKey} from "../useApi";
import {createESAudioModule, ESAudioModule} from "./ESAudioModule";
import {ESAudioStreamType} from "./ESAudioStreamType";
import {ESAudioDurationHint} from "./ESAudioDurationHint";
import {ESAudioDirection} from "./ESAudioDirection";
import {ESAudioManagerFlag} from "./ESAudioManagerFlag";

export interface ESAudio extends IESManager {

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

export function createESAudio(): ESAudio {

  const audioModule: ESAudioModule = createESAudioModule()

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function requestAudioFocus(streamType, durationHint,) {
    return audioModule.requestAudioFocus(streamType, durationHint);
  }

  function abandonAudioFocus() {
    return audioModule.abandonAudioFocus();
  }

//------------------------通话音量------------------------
  function getStreamVoiceCallMaxVolume() {
    return audioModule.getStreamVoiceCallMaxVolume();
  }

  function getStreamVoiceCallVolume() {
    return audioModule.getStreamVoiceCallVolume();
  }

  //------------------------系统音量------------------------
  function getStreamSystemMaxVolume() {
    return audioModule.getStreamSystemMaxVolume();
  }

  function getStreamSystemVolume() {
    return audioModule.getStreamSystemVolume();
  }

  //------------------------铃声音量------------------------
  function getStreamRingMaxVolume() {
    return audioModule.getStreamRingMaxVolume();
  }

  function getStreamRingVolume() {
    return audioModule.getStreamRingVolume();
  }

  //------------------------音乐音量------------------------
  function getStreamMusicMaxVolume() {
    return audioModule.getStreamMusicMaxVolume();
  }

  function getStreamMusicVolume() {
    return audioModule.getStreamMusicVolume();
  }

  //------------------------提示音音量------------------------
  function getStreamAlarmMaxVolume() {
    return audioModule.getStreamAlarmMaxVolume();
  }

  function getStreamAlarmVolume() {
    return audioModule.getStreamAlarmVolume();
  }

  //------------------------音量------------------------
  function getStreamMaxVolume(streamType) {
    return audioModule.getStreamMaxVolume(streamType);
  }

  function getStreamVolume(streamType) {
    return audioModule.getStreamVolume(streamType);
  }

  //------------------------调整音量------------------------
  function adjustStreamVolume(streamType, adjust, flags) {
    audioModule.adjustStreamVolume(streamType, adjust, flags);
  }

  function setStreamVolume(streamType, index, flags) {
    audioModule.setStreamVolume(streamType, index, flags);
  }

  function setStreamMute(streamType, state) {
    audioModule.setStreamMute(streamType, state);
  }

  return {
    install: function (app: App) {
      const instance = this
      app.provide(ESAudioKey, instance)
    },
    init,
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
