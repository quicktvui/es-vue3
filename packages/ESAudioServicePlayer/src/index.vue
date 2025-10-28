<template>
  <div
    class="es-audio-service-player-root-css"
    ref="playerRef"
    v-show="visible"
    :style="{ width: playerWidth, height: playerHeight, backgroundColor: backgroundColor }"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { onMounted, onUnmounted, ref } from "vue";
import {
  ESIPlayer,
  ESIPlayerInterceptor,
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerAspectRatio,
  ESPlayerCache,
  ESPlayerControlOptions,
  ESPlayerDecode,
  ESPlayerDefinition,
  ESPlayerDurationCallback,
  ESPlayerError,
  ESPlayerInfo,
  ESPlayerInterceptError,
  ESPlayerInterceptorType,
  ESPlayerInterceptResult,
  ESPlayerLogLevel,
  ESPlayerPlayMode,
  ESPlayerProgressCallback,
  ESPlayerRate,
  ESPlayerRender,
  ESPlayerState,
  ESPlayerStatus,
  useESPlayerDefinitionManager,
  useESPlayerEventManager,
  useESPlayerInterceptorManager,
  useESPlayerLog,
  useESPlayerPlayModeManager,
  useESPlayerRateManager,
  useESPlayerViewManager,
  useESPlayerVolumeManager,
} from "@extscreen/es3-player";

import {
  getDefinitionList,
  getMediaSourceByDefinition,
} from "./utils/ESAudioServicePlayerDefinitionUtils";
import { createESAudioServicePlayerModule } from "./module/ESAudioServicePlayerModule";
import { EventBus } from "@extscreen/es3-vue";

const TAG = "ESAudioPlayer";

export default defineComponent({
  name: "es-audio-service-player",
  emits: [
    "onPlayerInitialized",
    "onPlayerError",
    "onPlayerNoMediaSourceCanPlay",
    "onPlayerPlayMediaSourceList",
    "onPlayerPlayMediaSource",
    "onPlayerInterceptSuccess",
    "onPlayerInterceptError",
    "onRealPlayerInitialized",
    "onPlayerSizeChanged",
    "onPlayerClickable",
    "onPlayerViewChanged",
    "onPlayerPreparing",
    "onPlayerPrepared",
    "onPlayerPlaying",
    "onPlayerBeforeStopped",
    "onPlayerPaused",
    "onPlayerResumed",
    "onPlayerStopped",
    "onPlayerCompleted",
    "onPlayerBufferStart",
    "onPlayerBufferEnd",
    "onPlayerSeekStart",
    "onPlayerSeekCompleted",
    "onPlayerLeftVolumeChanged",
    "onPlayerRightVolumeChanged",
    "onPlayerVolumeChanged",
    "onPlayerDecodeListChanged",
    "onPlayerDecodeChanged",
    "onPlayerPlayRateListChanged",
    "onPlayerPlayRateChanged",
    "onPlayerAspectRatioListChanged",
    "onPlayerAspectRatioChanged",
    "onPlayerPlayMediaSourceListModeListChanged",
    "onPlayerPlayMediaSourceListModeChanged",
    "onPlayerDefinitionListChanged",
    "onPlayerDefinitionChanged",
    "onPlayerInfo",
  ],
  props: {
    playerType: {
      type: Number,
      default: 5,
    },
    playMediaSourceAuto: {
      type: Boolean,
      default: true,
    },
    playerWidth: {
      type: Number,
      default: 1920,
    },
    playerHeight: {
      type: Number,
      default: 1080,
    },
    playerZIndex: {
      type: Number,
      default: 1,
    },
    backgroundColor: {
      type: String,
      default: "transparent",
    },
  },
  type: 5,
  setup(props, context) {
    const playerRef = ref<ESIPlayer>();
    const log = useESPlayerLog();
    const audioPlayer = createESAudioServicePlayerModule();
    const playerRateManager = useESPlayerRateManager();
    const definitionManager = useESPlayerDefinitionManager();
    const interceptorManager = useESPlayerInterceptorManager();
    const playerEventManager = useESPlayerEventManager();
    const playerViewManager = useESPlayerViewManager();
    const volumeManager = useESPlayerVolumeManager();
    const playModeManager = useESPlayerPlayModeManager();
    //
    const playerInitialized = ref(false);

    const visible = ref<boolean>(true);

    let isStopped: boolean = false;
    let isEnabled: boolean = true;

    //
    let playerState: ESPlayerState;
    //
    let playMode: ESPlayerPlayMode;
    //
    let mediaSourceList: ESMediaSourceList;
    let mediaSourceIndex: number = 0;
    let mediaSource: ESMediaSource;

    //
    let currentPosition: number = 0;
    let duration: number = 0;

    let leftVolume: number = 0;
    let rightVolume: number = 0;
    //
    let decodeList: ESPlayerDecode[] = [];
    let decode: ESPlayerDecode;
    //
    let aspectRatioList: ESPlayerAspectRatio[] = [];
    let aspectRatio: ESPlayerAspectRatio;
    //
    let playRateList: ESPlayerRate[] = [];
    let playRate: ESPlayerRate;
    //
    let definitionList: ESPlayerDefinition[] = [];
    let definition: ESPlayerDefinition;

    //
    let progressCallback: ESPlayerProgressCallback;
    let durationCallback: ESPlayerDurationCallback;

    onMounted(() => {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "--------onMounted------>>>>>");
      }
      EventBus.$on("onESAudioPlayerError", onPlayerError);
      EventBus.$on("onESAudioPlayerInfo", onPlayerInfo);
      EventBus.$on("onESAudioPlayRateChanged", onPlayerPlayRateChanged);
      EventBus.$on("onESAudioPlayerStatusChanged", onESAudioPlayerStatusChanged);
      EventBus.$on("onESAudioPlayerInit", onPlayerInitializeSuccess);
      EventBus.$on("onESAudioPlayerServiceBind", onESAudioPlayerServiceBind);
    });

    onUnmounted(() => {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "--------onUnmounted------>>>>>");
      }
      EventBus.$off("onESAudioPlayerError", onPlayerError);
      EventBus.$off("onESAudioPlayerInfo", onPlayerInfo);
      EventBus.$off("onESAudioPlayRateChanged", onPlayerPlayRateChanged);
      EventBus.$off("onESAudioPlayerStatusChanged", onESAudioPlayerStatusChanged);
      EventBus.$off("onESAudioPlayerInit", onPlayerInitializeSuccess);
      EventBus.$off("onESAudioPlayerServiceBind", onESAudioPlayerServiceBind);
    });

    function setVisible(value: boolean): void {
      visible.value = value;
    }

    function getId(): string {
      return "";
    }

    function getType(): number {
      return props.playerType;
    }

    function getPlayer(): ESIPlayer | undefined {
      return playerRef.value;
    }

    //
    function initialize(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "--------initializePlayer------>>>>>");
      }
      initComponent();
    }

    function isInitialized(): boolean {
      return playerRef.value != undefined;
    }

    function unInitialize(): void {
      playerInitialized.value = false;
    }

    function getComponentInfo(): void {}

    function initComponent(...params: Array<any>): void {
      audioPlayer.bindService();
    }

    //-------------------------最后输入------------------------------------
    function onESAudioPlayerServiceBind(event) {
      if (event.value) {
        audioPlayer.init();
      } else {
        onPlayerInitializeError();
      }
    }

    //-------------------------最后输入------------------------------------
    function onPlayerInitializeSuccess(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----onPlayerInitializeSuccess----->>>");
      }
      //setPlayer
      playerEventManager.setPlayer(getPlayer()!);
      playerViewManager.setPlayer(getPlayer()!);

      context.emit("onPlayerInitialized", getType());

      //
      playerEventManager.onPlayerInitialized(getType());
      playerViewManager.onPlayerInitialized(getType());
    }

    function onPlayerInitializeError(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----onPlayerInitializeError----->>>");
      }
      let error = {
        errorCode: -1,
        errorMessage: "player init error...",
      };
      onPlayerMediaSourceListError(error);
    }

    function onPlayerMediaSourceListError(error: ESPlayerError): void {
      context.emit("onPlayerError", error);
      onPlayerNoMediaSourceCanPlay(true);
    }

    function onPlayerNoMediaSourceCanPlay(next: boolean) {
      context.emit("onPlayerNoMediaSourceCanPlay", next);
      playerEventManager.onPlayerNoMediaSourceCanPlay(next);
      playerViewManager.onPlayerNoMediaSourceCanPlay(next);
    }

    //------------------------------------------------------------
    function playMediaSourceList(list: ESMediaSourceList): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceList----->>>", list);
      }
      mediaSourceList = list;
      mediaSourceIndex = list.index;
      //
      interceptMediaSourceList(mediaSourceList);
    }

    function interceptMediaSourceList(mediaSourceList: ESMediaSourceList): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----interceptMediaSourceList----->>>", mediaSourceList);
      }
      let result: ESPlayerInterceptResult = {
        result: null,
      };
      let promise: Promise<ESPlayerInterceptResult> | null = null;

      const globalInterceptorList = interceptorManager.getInterceptorsByType(
        ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_SOURCE_LIST,
      );
      const interceptorList = mediaSourceList.interceptors;

      let list: ESIPlayerInterceptor[] = [];
      if (globalInterceptorList && globalInterceptorList.length > 0) {
        list.push(...globalInterceptorList);
      }
      if (interceptorList && interceptorList.length > 0) {
        list.push(...interceptorList);
      }

      if (list && list.length > 0) {
        promise = Promise.resolve(result);
      }

      list.map((interceptor) => {
        if (promise != null) {
          promise = promise.then((result: ESPlayerInterceptResult) => {
            try {
              if (result.result) {
                Object.assign(mediaSourceList, result.result);
              }
            } catch (e) {}
            return interceptor.intercept(mediaSourceList);
          });
        }
      });
      if (promise != null) {
        promise.then(
          (result) => {
            try {
              if (result.result) {
                Object.assign(mediaSourceList, result.result);
              }
            } catch (e) {}

            onPlayerInterceptSuccess(result);
            _preparePlayMediaSourceList(mediaSourceList);
          },
          (error) => {
            let playerError: ESPlayerError = {
              errorCode: error?.errorCode ?? -1,
              errorMessage: error?.errorMessage ?? "",
            };
            let interceptError: ESPlayerInterceptError = {
              error: playerError,
            };

            onPlayerInterceptError(interceptError);
            onPlayerMediaSourceListError(playerError);
          },
        );
      } else {
        _preparePlayMediaSourceList(mediaSourceList);
      }
    }

    function _preparePlayMediaSourceList(mediaSourceList: ESMediaSourceList) {
      if (mediaSourceList.list == undefined || mediaSourceList.list.length <= 0) {
        onPlayerMediaSourceListError({
          errorCode: -1,
          errorMessage: "播放地址为空",
        });
        return;
      }

      context.emit("onPlayerPlayMediaSourceList", mediaSourceList);
      playerEventManager.onPlayerPlayMediaSourceList(mediaSourceList);
      playerViewManager.onPlayerPlayMediaSourceList(mediaSourceList);

      //play mode
      playMode = playModeManager.getPlayMode();
      onPlayerPlayMediaSourceListModeListChanged([
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE,
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER,
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE,
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT,
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP,
      ]);
      onPlayerPlayMediaSourceListModeChanged(playMode);

      if (props.playMediaSourceAuto) {
        if (mediaSourceList.index >= 0) {
          playMediaSourceByIndex(mediaSourceList.index);
        } else {
          playMediaSourceByDefinition(mediaSourceList.list);
        }
      }
    }

    function playMediaSourceByDefinition(list: Array<ESMediaSource>): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceByDefinition----->>>", list);
      }
      let definitionList = getDefinitionList(list);
      if (definitionList.length > 0) {
        onPlayerDefinitionListChanged(definitionList);
        let currentDefinition = definitionManager.getDefinition();
        let index = getMediaSourceByDefinition(currentDefinition, list);
        if (index > -1) {
          onPlayerDefinitionChanged(currentDefinition);
          mediaSourceIndex = index;
        }
      }
      playMediaSourceByIndex(mediaSourceIndex);
    }

    function playMediaSourceByIndex(index: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceByIndex----->>>", index);
      }
      if (mediaSourceList.list == undefined || mediaSourceList.list.length <= 0) {
        return;
      }
      if (index < 0 || index > mediaSourceList.list.length) {
        return;
      }

      mediaSourceIndex = index;
      mediaSource = mediaSourceList.list[index];
      playMediaSource(mediaSource);
    }

    function playMediaSourceById(id: string): void {
      if (mediaSourceList && mediaSourceList.list && mediaSourceList.list.length > 0) {
        let index = mediaSourceList.list.findIndex((element) => element.id == id);
        if (index > 0) {
          playMediaSourceByIndex(index);
        }
      }
    }

    function playMediaSource(mediaSource: ESMediaSource): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSource----->>>", mediaSource);
      }
      context.emit("onPlayerPlayMediaSource", mediaSource);
      playerEventManager.onPlayerPlayMediaSource(mediaSource);
      playerViewManager.onPlayerPlayMediaSource(mediaSource);

      interceptMediaSource(mediaSource);
    }

    function interceptMediaSource(mediaSource: ESMediaSource): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----interceptMediaSource----->>>", mediaSource);
      }
      let result: ESPlayerInterceptResult = {
        result: null,
      };
      let promise: Promise<ESPlayerInterceptResult> | null = null;

      const globalInterceptorList = interceptorManager.getInterceptorsByType(
        ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_SOURCE,
      );
      const interceptorList = mediaSource.interceptors;

      let list: ESIPlayerInterceptor[] = [];
      if (globalInterceptorList && globalInterceptorList.length > 0) {
        list.push(...globalInterceptorList);
      }
      if (interceptorList && interceptorList.length > 0) {
        list.push(...interceptorList);
      }

      if (list && list.length > 0) {
        promise = Promise.resolve(result);
      }

      list.map((interceptor) => {
        if (promise != null) {
          promise = promise.then((result: ESPlayerInterceptResult) => {
            try {
              if (result.result) {
                Object.assign(mediaSource, result.result);
              }
            } catch (e) {}
            return interceptor.intercept(mediaSource);
          });
        }
      });
      if (promise != null) {
        promise.then(
          (result) => {
            try {
              if (result.result) {
                Object.assign(mediaSource, result.result);
              }
            } catch (e) {}
            onPlayerInterceptSuccess(result);

            play(mediaSource);
          },
          (error) => {
            let interceptError: ESPlayerInterceptError = {
              error: {
                errorCode: error?.errorCode ?? -1,
                errorMessage: error?.errorMessage ?? "",
              },
            };
            onPlayerInterceptError(interceptError);
          },
        );
      } else {
        play(mediaSource);
      }
    }

    function onPlayerInterceptSuccess(result: ESPlayerInterceptResult): void {
      context.emit("onPlayerInterceptSuccess", result);
      playerEventManager.onPlayerInterceptSuccess(result);
      playerViewManager.onPlayerInterceptSuccess(result);
    }

    function onPlayerInterceptError(interceptError: ESPlayerInterceptError): void {
      context.emit("onPlayerInterceptError", interceptError);
      playerEventManager.onPlayerInterceptError(interceptError);
      playerViewManager.onPlayerInterceptError(interceptError);
    }

    function play(...params: Array<any>): void {
      let mediaSource: ESMediaSource = params[0];
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------play-----PARAMS------>>>", "mediaSource:" + mediaSource);
      }
      //
      onPlayerPlayRateListChanged([
        ESPlayerRate.ES_PLAYER_RATE_0_5,
        ESPlayerRate.ES_PLAYER_RATE_0_7_5,
        ESPlayerRate.ES_PLAYER_RATE_1,
        ESPlayerRate.ES_PLAYER_RATE_1_2,
        ESPlayerRate.ES_PLAYER_RATE_1_2_5,
        ESPlayerRate.ES_PLAYER_RATE_1_5,
        ESPlayerRate.ES_PLAYER_RATE_1_7_5,
        ESPlayerRate.ES_PLAYER_RATE_2,
        ESPlayerRate.ES_PLAYER_RATE_2_5,
      ]);
      //
      let rate = playerRateManager.getPlayRate();
      onPlayerPlayRateChanged(rate);
      //
      audioPlayer.play(mediaSource.uri);
    }

    function playNextMediaSource(): void {
      //once
      if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE) {
        stop();
        setStopped(false);
        onPlayerNoMediaSourceCanPlay(true);
      }
      //order
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER) {
        stop();
        setStopped(false);
        if (mediaSourceList.list && mediaSourceIndex + 1 < mediaSourceList.list.length) {
          playMediaSourceByIndex(mediaSourceIndex + 1);
        } else {
          onPlayerNoMediaSourceCanPlay(true);
        }
      }
      //order loop
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP) {
        stop();
        setStopped(false);
        if (mediaSourceList.list && mediaSourceIndex + 1 < mediaSourceList.list.length) {
          playMediaSourceByIndex(mediaSourceIndex + 1);
        } else {
          playMediaSourceByIndex(0);
        }
      }
      //shuffle
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE) {
        if (mediaSourceList.list) {
          let randomIndex = Math.floor(Math.random() * mediaSourceList.list.length);
          stop();
          setStopped(false);
          playMediaSourceByIndex(randomIndex);
        }
      }
      //repeat
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT) {
        stop();
        setStopped(false);
        playMediaSourceByIndex(mediaSourceIndex);
      }
    }

    function playPreviousMediaSource(): void {
      //once
      if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE) {
        stop();
        setStopped(false);
        onPlayerNoMediaSourceCanPlay(false);
      }
      //order
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER) {
        stop();
        setStopped(false);
        if (mediaSourceIndex - 1 >= 0) {
          playMediaSourceByIndex(mediaSourceIndex - 1);
        } else {
          onPlayerNoMediaSourceCanPlay(false);
        }
      }
      //order loop
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP) {
        stop();
        setStopped(false);
        if (mediaSourceIndex - 1 >= 0) {
          playMediaSourceByIndex(mediaSourceIndex - 1);
        } else if (mediaSourceList.list) {
          playMediaSourceByIndex(mediaSourceList.list.length - 1);
        }
      }
      //shuffle
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE) {
        if (mediaSourceList.list) {
          let randomIndex = Math.floor(Math.random() * mediaSourceList.list.length);
          stop();
          setStopped(false);
          playMediaSourceByIndex(randomIndex);
        }
      }
      //repeat
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT) {
        stop();
        setStopped(false);
        playMediaSourceByIndex(mediaSourceIndex);
      }
    }

    //-----------------------------------------------------------------------
    function getMediaSourceList(): Array<ESMediaSource> | null {
      if (mediaSourceList) {
        return mediaSourceList.list;
      }
      return null;
    }

    function getMediaSource(index: number): ESMediaSource | null {
      if (
        mediaSourceList &&
        mediaSourceList.list &&
        index >= 0 &&
        index < mediaSourceList.list.length
      ) {
        return mediaSourceList.list[index];
      }
      return null;
    }

    function getPlayingMediaSourceIndex(): number {
      return mediaSourceIndex;
    }

    function getPlayingMediaSourceList(): ESMediaSourceList | null {
      return mediaSourceList;
    }

    function getPlayingMediaSource(): ESMediaSource | null {
      return mediaSource;
    }

    //----------------------------------------------------------
    function start(progress: number): void {
      if (progress > 0) {
        seekTo(progress);
      }
      audioPlayer.start();
    }

    function pause(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------pause------------->>>");
      }
      audioPlayer.pause();
    }

    function resume(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------resume------------->>>");
      }
      playMediaSourceByIndex(mediaSourceIndex);
    }

    function stop(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------stop------------->>>");
      }
      audioPlayer.stop();
    }

    function release(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------release------------->>>");
      }
      audioPlayer.release();
      audioPlayer.unbindService();
    }

    function reset(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------reset------------->>>");
      }
      currentPosition = 0;
      duration = 0;
    }

    function control(options: ESPlayerControlOptions): void {}

    function seekTo(progress: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------seekTo------------->>>" + progress);
      }
      currentPosition = progress;
      audioPlayer.seekTo(progress);
    }

    function setStopped(stopped: boolean): void {
      isStopped = stopped;
    }

    function setEnabled(enabled: boolean): void {
      isEnabled = enabled;
    }

    function setSize(width: number, height: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------setSize------------->>>" + "width:" + width + "height:" + height);
      }
    }

    function invalidate(): void {}

    //----------------------------播放状态回调--------------------------------

    const setProgressCallback = (callback: ESPlayerProgressCallback): void => {
      progressCallback = callback;
    };

    const setDurationCallback = (callback: ESPlayerDurationCallback): void => {
      durationCallback = callback;
    };

    function getPlayerState(): ESPlayerState {
      return playerState;
    }

    function onPlayerError(error: ESPlayerError): void {
      context.emit("onPlayerError", error);
      playerEventManager.onPlayerError(error);
      playerViewManager.onPlayerError(error);
      playNextMediaSource();
    }

    function onRealPlayerInitialized(): void {
      context.emit("onRealPlayerInitialized");
    }

    function onPlayerSizeChanged(playerWidth: number, playerHeight: number): void {
      context.emit("onPlayerSizeChanged", playerWidth, playerHeight);
      playerEventManager.onPlayerSizeChanged(playerWidth, playerHeight);
      playerViewManager.onPlayerSizeChanged(playerWidth, playerHeight);
    }

    function onPlayerClickable(playerClickable: boolean): void {
      context.emit("onPlayerClickable", playerClickable);
      playerEventManager.onPlayerClickable(playerClickable);
      playerViewManager.onPlayerClickable(playerClickable);
    }

    function onPlayerViewChanged(): void {
      context.emit("onPlayerViewChanged");
      playerEventManager.onPlayerViewChanged();
      playerViewManager.onPlayerViewChanged();
    }

    function onPlayerPreparing(): void {
      context.emit("onPlayerPreparing");
      playerEventManager.onPlayerPreparing();
      playerViewManager.onPlayerPreparing();
    }

    function onPlayerPrepared(): void {
      context.emit("onPlayerPrepared");
      playerEventManager.onPlayerPrepared();
      playerViewManager.onPlayerPrepared();

      //start
      if (!isStopped && isEnabled) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------play-----自动播放------>>>", mediaSource);
        }
        if (
          mediaSourceList &&
          mediaSourceList.position &&
          mediaSourceList.position.support &&
          mediaSourceList.position.position > 0
        ) {
          start(mediaSourceList.position.position);
        } else {
          start(0);
        }
        //1.
        let rate = playerRateManager.getPlayRate();
        setPlayRate(rate);
        //2.
        let leftVolume = volumeManager.getLeftVolume();
        let rightVolume = volumeManager.getRightVolume();
        setLeftVolume(leftVolume);
        setRightVolume(rightVolume);
      } else {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------play-----不自动播放------>>>", mediaSource);
        }
      }
    }

    function onPlayerPlaying(): void {
      context.emit("onPlayerPlaying");
      playerEventManager.onPlayerPlaying();
      playerViewManager.onPlayerPlaying();
    }

    function onPlayerBeforeStopped(): void {
      context.emit("onPlayerBeforeStopped");
    }

    function onPlayerPaused(): void {
      context.emit("onPlayerPaused");
      playerEventManager.onPlayerPaused();
      playerViewManager.onPlayerPaused();
    }

    function onPlayerResumed(): void {
      context.emit("onPlayerResumed");
      playerEventManager.onPlayerResumed();
      playerViewManager.onPlayerResumed();
    }

    function onPlayerStopped(): void {
      context.emit("onPlayerStopped");
      playerEventManager.onPlayerStopped();
      playerViewManager.onPlayerStopped();
    }

    function onPlayerCompleted(): void {
      context.emit("onPlayerCompleted");
      playerEventManager.onPlayerCompleted();
      playerViewManager.onPlayerCompleted();
      playNextMediaSource();
    }

    function onPlayerBufferStart(): void {
      context.emit("onPlayerBufferStart");
      playerEventManager.onPlayerBufferStart();
      playerViewManager.onPlayerBufferStart();
    }

    function onPlayerBufferEnd(): void {
      context.emit("onPlayerBufferEnd");
      playerEventManager.onPlayerBufferEnd();
      playerViewManager.onPlayerBufferEnd();
    }

    function onPlayerSeekStart(): void {
      context.emit("onPlayerSeekStart");
      playerEventManager.onPlayerSeekStart();
      playerViewManager.onPlayerSeekStart();
    }

    function onPlayerSeekCompleted(): void {
      context.emit("onPlayerSeekCompleted");
      playerEventManager.onPlayerSeekCompleted();
      playerViewManager.onPlayerSeekCompleted();
    }

    function onESAudioPlayerStatusChanged(status: ESPlayerStatus) {
      onPlayerStatusChanged({
        playerState: status.playerStatus,
      });
    }

    function onPlayerStatusChanged(status: ESPlayerStatus): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----onPlayerStatusChanged----->>>", status);
      }
      playerState = status.playerState;
      switch (playerState) {
        case ESPlayerState.ES_PLAYER_STATE_PLAYER_INITIALIZED: {
          onRealPlayerInitialized();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_INITIALIZE_SUCCESS: {
          onPlayerInitializeSuccess();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_INITIALIZE_ERROR: {
          onPlayerInitializeError();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_VIDEO_SIZE_CHANGED: {
          let playerWidth = status.playerWidth;
          let playerHeight = status.playerHeight;
          onPlayerSizeChanged(playerWidth ?? 1920, playerHeight ?? 1080);
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_PLAYER_CLICKABLE: {
          let playerClickable = status.playerClickable;
          onPlayerClickable(playerClickable ?? false);
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_PLAYER_VIEW_CHANGED: {
          onPlayerViewChanged();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_PREPARING: {
          onPlayerPreparing();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_PREPARED: {
          onPlayerPrepared();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_PLAYING: {
          onPlayerPlaying();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_PAUSED: {
          onPlayerPaused();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_RESUMED: {
          onPlayerResumed();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_BEFORE_STOP: {
          onPlayerBeforeStopped();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_STOP: {
          onPlayerStopped();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_PLAYBACK_COMPLETED: {
          onPlayerCompleted();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_BUFFER_START: {
          onPlayerBufferStart();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_BUFFER_END: {
          onPlayerBufferEnd();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_SEEK_START: {
          onPlayerSeekStart();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_SEEK_COMPLETED: {
          onPlayerSeekCompleted();
          break;
        }
      }
    }

    function getDuration(): void {
      audioPlayer.getDuration().then(
        (value) => {
          onPlayerProgressChanged(value);
        },
        (error) => {},
      );
    }

    function getCurrentPosition(): void {
      audioPlayer.getCurrentPosition().then(
        (value) => {
          onPlayerDurationChanged(value);
        },
        (error) => {},
      );
    }

    function onPlayerProgressChanged(progress: number): void {
      currentPosition = progress;
      playerEventManager.onPlayerProgressChanged(progress);
      playerViewManager.onPlayerProgressChanged(progress);
      if (progressCallback) {
        progressCallback(progress);
      }
    }

    function onPlayerDurationChanged(d: number): void {
      duration = d;
      playerEventManager.onPlayerDurationChanged(d);
      playerViewManager.onPlayerDurationChanged(d);
      if (durationCallback) {
        durationCallback(d);
      }
    }

    //-----------------------音量相关------------------------------
    function onPlayerLeftVolumeChanged(volume: number): void {
      leftVolume = volume;
      context.emit("onPlayerLeftVolumeChanged", leftVolume);
      playerEventManager.onPlayerLeftVolumeChanged(volume);
      playerViewManager.onPlayerLeftVolumeChanged(volume);
    }

    function onPlayerRightVolumeChanged(volume: number): void {
      rightVolume = volume;
      context.emit("onPlayerRightVolumeChanged", rightVolume);
      playerEventManager.onPlayerRightVolumeChanged(volume);
      playerViewManager.onPlayerRightVolumeChanged(volume);
    }

    function onPlayerVolumeChanged(lv: number, rv: number): void {
      leftVolume = lv;
      rightVolume = rv;
      context.emit("onPlayerVolumeChanged", leftVolume, rightVolume);
      playerEventManager.onPlayerVolumeChanged(leftVolume, rightVolume);
      playerViewManager.onPlayerVolumeChanged(leftVolume, rightVolume);
    }

    //--------------------------------------------------------------------
    function setVolume(volume: number): void {
      setLeftVolume(volume);
      setRightVolume(volume);
    }

    function getVolume(): void {
      audioPlayer
        .getLeftVolume()
        .then((leftVolume) => {
          volumeManager.setLeftVolume(leftVolume);
        })
        .then(() => audioPlayer.getRightVolume())
        .then(
          (rightVolume) => {
            volumeManager.setRightVolume(rightVolume);
            onPlayerVolumeChanged(volumeManager.getLeftVolume(), volumeManager.getRightVolume());
          },
          (error) => {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "-----getVolume----->>>", error);
            }
          },
        );
    }

    function getLeftVolume(): void {
      audioPlayer.getLeftVolume().then(
        (value) => {
          volumeManager.setLeftVolume(value);
          onPlayerLeftVolumeChanged(value);
        },
        (error) => {},
      );
    }

    function getRightVolume(): void {
      audioPlayer.getRightVolume().then(
        (value) => {
          volumeManager.setRightVolume(value);
          onPlayerRightVolumeChanged(value);
        },
        (error) => {},
      );
    }

    function setLeftVolume(leftVolume): void {
      volumeManager.setLeftVolume(leftVolume);
      audioPlayer.setLeftRightVolume(leftVolume, volumeManager.getRightVolume());
    }

    function setRightVolume(rightVolume): void {
      volumeManager.setRightVolume(leftVolume);
      audioPlayer.setLeftRightVolume(volumeManager.getLeftVolume(), rightVolume);
    }

    //--------------------------------------------------------
    function setRender(render: ESPlayerRender): void {}

    //--------------------------------------------------------
    function setDecode(decode: ESPlayerDecode): void {}

    function getPlayerDecodeList(): Array<ESPlayerDecode> {
      return decodeList;
    }

    function onPlayerDecodeListChanged(list: Array<ESPlayerDecode>): void {
      decodeList = list;
      context.emit("onPlayerDecodeListChanged", list);
      playerEventManager.onPlayerDecodeListChanged(list);
      playerViewManager.onPlayerDecodeListChanged(list);
    }

    function getPlayerDecode(): ESPlayerDecode {
      return decode;
    }

    function onPlayerDecodeChanged(dc: ESPlayerDecode): void {
      decode = dc;
      context.emit("onPlayerDecodeChanged", dc);
      playerEventManager.onPlayerDecodeChanged(dc);
      playerViewManager.onPlayerDecodeChanged(dc);
    }

    //----------------------------------------------------------------------
    function setPlayRate(playRate: ESPlayerRate): void {}

    function getPlayerPlayRateList(): Array<ESPlayerRate> {
      return playRateList;
    }

    function getPlayerPlayRate(): ESPlayerRate {
      return playRate;
    }

    function onPlayerPlayRateListChanged(list: Array<ESPlayerRate>): void {
      playRateList = list;
      context.emit("onPlayerPlayRateListChanged", list);
      playerEventManager.onPlayerPlayRateListChanged(list);
      playerViewManager.onPlayerPlayRateListChanged(list);
    }

    function onPlayerPlayRateChanged(r: ESPlayerRate): void {
      playRate = r;
      context.emit("onPlayerPlayRateChanged", playRate);
      playerEventManager.onPlayerPlayRateChanged(r);
      playerViewManager.onPlayerPlayRateChanged(r);
    }

    //----------------------------------------------------------------------
    function setAspectRatio(aspectRatio: ESPlayerAspectRatio): void {}

    function getPlayerAspectRatioList(): Array<ESPlayerAspectRatio> {
      return aspectRatioList;
    }

    function onPlayerAspectRatioListChanged(list: Array<ESPlayerAspectRatio>): void {
      aspectRatioList = list;
      context.emit("onPlayerAspectRatioListChanged", list);
      playerEventManager.onPlayerAspectRatioListChanged(list);
      playerViewManager.onPlayerAspectRatioListChanged(list);
    }

    function getPlayerAspectRatio(): ESPlayerAspectRatio {
      return aspectRatio;
    }

    function onPlayerAspectRatioChanged(ar: ESPlayerAspectRatio): void {
      aspectRatio = ar;
      context.emit("onPlayerAspectRatioChanged", aspectRatio);
      playerEventManager.onPlayerAspectRatioChanged(ar);
      playerViewManager.onPlayerAspectRatioChanged(ar);
    }

    //----------------------------播放模式----------------------------------------
    function setPlayMode(value: ESPlayerPlayMode): void {
      playMode = value;
      playModeManager.setPlayMode(playMode);
      onPlayerPlayMediaSourceListModeChanged(playMode);
    }

    function onPlayerPlayMediaSourceListModeListChanged(
      playModeList: Array<ESPlayerPlayMode>,
    ): void {
      context.emit("onPlayerPlayMediaSourceListModeListChanged", playModeList);
      playerViewManager.onPlayerPlayMediaSourceListModeListChanged(playModeList);
      playerEventManager.onPlayerPlayMediaSourceListModeListChanged(playModeList);
    }

    function onPlayerPlayMediaSourceListModeChanged(playMode: ESPlayerPlayMode): void {
      context.emit("onPlayerPlayMediaSourceListModeChanged", playMode);
      playerViewManager.onPlayerPlayMediaSourceListModeChanged(playMode);
      playerEventManager.onPlayerPlayMediaSourceListModeChanged(playMode);
    }

    //----------------------------------------------------------------------
    function setDefinition(definition: ESPlayerDefinition): void {}

    function getPlayerDefinitionList(): Array<ESPlayerDefinition> {
      return definitionList;
    }

    function onPlayerDefinitionListChanged(list: Array<ESPlayerDefinition>): void {
      definitionList = list;
      context.emit("onPlayerDefinitionListChanged", list);
      playerEventManager.onPlayerDefinitionListChanged(list);
      playerViewManager.onPlayerDefinitionListChanged(list);
    }

    function getPlayerDefinition(): ESPlayerDefinition {
      return definition;
    }

    function onPlayerDefinitionChanged(d: ESPlayerDefinition): void {
      definition = d;
      context.emit("onPlayerDefinitionChanged", definition);
      playerEventManager.onPlayerDefinitionChanged(d);
      playerViewManager.onPlayerDefinitionChanged(d);
    }

    //----------------------------------------------------------------------
    function setCache(cache: ESPlayerCache): void {}

    //----------------------------------------------------------------------
    function onPlayerInfo(info: ESPlayerInfo): void {
      context.emit("onPlayerInfo", info);
      playerEventManager.onPlayerInfo(info);
      playerViewManager.onPlayerInfo(info);
    }

    return {
      playerInitialized,
      visible,
      getPlayer,
      getPlayerState,
      //
      getComponentInfo,
      initComponent,
      getId,
      getType,
      setVisible,

      initialize,
      unInitialize,
      isInitialized,
      //
      playMediaSourceList,
      playMediaSourceByIndex,
      playMediaSourceById,
      playMediaSource,
      playNextMediaSource,
      playPreviousMediaSource,
      //
      getMediaSourceList,
      getMediaSource,
      getPlayingMediaSourceIndex,
      getPlayingMediaSourceList,
      getPlayingMediaSource,
      //
      play,
      start,
      pause,
      resume,
      stop,
      reset,
      release,
      seekTo,
      control,
      //
      getDuration,
      getCurrentPosition,
      //
      setDefinition,
      getPlayerDefinition,
      getPlayerDefinitionList,
      //
      setAspectRatio,
      getPlayerAspectRatio,
      getPlayerAspectRatioList,
      //
      setPlayRate,
      getPlayerPlayRate,
      getPlayerPlayRateList,
      //
      setRender,
      //
      setDecode,
      getPlayerDecode,
      getPlayerDecodeList,
      //
      setCache,
      //
      getLeftVolume,
      getRightVolume,
      setLeftVolume,
      setRightVolume,
      setVolume,
      getVolume,
      //
      setPlayMode,
      //
      setStopped,
      setEnabled,
      setProgressCallback,
      setDurationCallback,
      setSize,
      invalidate,
      //
      onPlayerError,
      onPlayerStatusChanged,
      onPlayerDurationChanged,
      onPlayerProgressChanged,
      onPlayerVolumeChanged,
      onPlayerLeftVolumeChanged,
      onPlayerRightVolumeChanged,
      onPlayerAspectRatioListChanged,
      onPlayerAspectRatioChanged,
      onPlayerPlayRateListChanged,
      onPlayerPlayRateChanged,
      onPlayerDecodeListChanged,
      onPlayerDecodeChanged,
      onPlayerPlayMediaSourceListModeListChanged,
      onPlayerPlayMediaSourceListModeChanged,
      onPlayerInfo,
    };
  },
});
</script>

<style scoped>
.es-audio-service-player-root-css {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
