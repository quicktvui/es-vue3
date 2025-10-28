<template>
  <div
    class="es-video-player-root-css"
    v-show="visible"
    name="es-video-player"
    :style="{ width: playerWidth, height: playerHeight, backgroundColor: backgroundColor }"
  >
    <es-video-player-view-component
      ref="videoPlayerRef"
      name="es-video-player-component"
      v-if="playerInitialized"
      :style="{ width: playerWidth, height: playerHeight, zIndex: playerZIndex }"
      @player-volume-changed="onPlayerVolumeChanged"
      @player-left-volume-changed="onPlayerLeftVolumeChanged"
      @player-right-volume-changed="onPlayerRightVolumeChanged"
      @player-status-changed="onPlayerStatusChanged"
      @player-aspect-ratio-list-changed="onPlayerAspectRatioListChanged"
      @player-aspect-ratio-changed="onPlayerAspectRatioChanged"
      @player-error="onPlayerError"
      @player-info="onPlayerInfo"
      @player-component-info="onPlayerComponentInfo"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref, watch } from "vue";
import {
  ESIPlayer,
  ESIPlayerInterceptor,
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerAspectRatio,
  ESPlayerBufferPercentCallback,
  ESPlayerCache,
  ESPlayerCDNInfo,
  ESPlayerComponentInfo,
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
  ESPlayerMediaMeta,
  ESPlayerOptionCategory,
  ESPlayerOptionType,
  ESPlayerPlayMode,
  ESPlayerProgressCallback,
  ESPlayerRate,
  ESPlayerRender,
  ESPlayerState,
  ESPlayerStatus,
  ESPlayerTrackInfo,
  M3U8DefinitionInfo,
  useESPlayer,
  useESPlayerAspectRatioManager,
  useESPlayerDecodeManager,
  useESPlayerDefinitionManager,
  useESPlayerDisplayManager,
  useESPlayerEventManager,
  useESPlayerInterceptorManager,
  useESPlayerLog,
  useESPlayerPlayModeManager,
  useESPlayerRateManager,
  useESPlayerRenderManager,
  useESPlayerTypeManager,
  useESPlayerViewManager,
  useESPlayerVolumeManager,
} from "@extscreen/es3-player";

import {
  getDefinition,
  getDefinitionList,
  getMediaSourceByDefinition,
} from "./utils/ESVideoPlayerDefinitionUtils";

const TAG = "ESVideoPlayer";

export default defineComponent({
  name: "es-video-player",
  emits: [
    "onPlayerLazyInitSuccess",
    "onPlayerLazyInitError",
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
    "onPlayerADStart",
    "onPlayerADEnd",
    "onPlayerADSkip",
    "onPlayerADPaused",
    "onPlayerADResumed",
    "onPlayerADLoaded",
    "onPlayerAuthorized",
    "onPlayerSetRateSuccess",
    "onPlayerSetRateError",
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
    "onPlayerDefinitionListChanged",
    "onPlayerDefinitionChanged",
    "onPlayerPlayMediaSourceListModeListChanged",
    "onPlayerPlayMediaSourceListModeChanged",
    "onPlayerRenderListChanged",
    "onPlayerRenderChanged",
    "onPlayerInfo",
  ],
  props: {
    playerType: {
      type: Number,
      default: 1,
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
  type: 1,
  setup(props, context) {
    const videoPlayerRef = ref<ESIPlayer>();
    const log = useESPlayerLog();

    const player = useESPlayer();
    const playerConfiguration = player.getPlayerConfiguration();
    const decodeManager = useESPlayerDecodeManager();
    const aspectRatioManager = useESPlayerAspectRatioManager();
    const definitionManager = useESPlayerDefinitionManager();
    const playRateManager = useESPlayerRateManager();
    const renderManager = useESPlayerRenderManager();
    const volumeManager = useESPlayerVolumeManager();
    const interceptorManager = useESPlayerInterceptorManager();
    const playerEventManager = useESPlayerEventManager();
    const playerViewManager = useESPlayerViewManager();
    const playModeManager = useESPlayerPlayModeManager();
    const displayManager = useESPlayerDisplayManager();
    const playerTypeManager = useESPlayerTypeManager();

    //
    const playerInitialized = ref(false);
    let playerLazyInitializedTimer;

    const visible = ref<boolean>(true);

    let isStopped: boolean = false;
    let isEnabled: boolean = true;

    let isPaused: boolean = false;

    //
    let playerState: ESPlayerState;

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
    let decodeList: ESPlayerDecode[] = [
      ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE,
      ESPlayerDecode.ES_PLAYER_DECODE_SOFTWARE,
    ];
    let decode: ESPlayerDecode;
    //
    let playRateList: ESPlayerRate[] = [
      ESPlayerRate.ES_PLAYER_RATE_0_5,
      ESPlayerRate.ES_PLAYER_RATE_0_7_5,
      ESPlayerRate.ES_PLAYER_RATE_1,
      ESPlayerRate.ES_PLAYER_RATE_1_2,
      ESPlayerRate.ES_PLAYER_RATE_1_2_5,
      ESPlayerRate.ES_PLAYER_RATE_1_5,
      ESPlayerRate.ES_PLAYER_RATE_1_7_5,
      ESPlayerRate.ES_PLAYER_RATE_2,
      ESPlayerRate.ES_PLAYER_RATE_2_5,
    ];
    let playRate: ESPlayerRate;
    //
    let aspectRatioList: ESPlayerAspectRatio[] = [];
    let aspectRatio: ESPlayerAspectRatio;
    //
    let definitionList: ESPlayerDefinition[] = [];
    let definition: ESPlayerDefinition;
    //
    let playMode: ESPlayerPlayMode;
    let playModeList: ESPlayerPlayMode[] = [
      ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE,
      ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER,
      ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE,
      ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT,
      ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP,
    ];
    //
    let render: ESPlayerRender;
    let renderList: ESPlayerRender[] = [
      ESPlayerRender.ES_PLAYER_RENDER_NONE,
      ESPlayerRender.ES_PLAYER_RENDER_SURFACE_VIEW,
      ESPlayerRender.ES_PLAYER_RENDER_TEXTURE_VIEW,
    ];

    //
    let progressCallback: ESPlayerProgressCallback;
    let durationCallback: ESPlayerDurationCallback;
    let bufferPercentCallback: ESPlayerBufferPercentCallback;

    let isRelease: boolean = false;

    watch(
      () => [videoPlayerRef.value] as const,
      ([instance], [oldInstance]) => {
        if (instance) {
          initializePlayerLazySuccess();
        }
      },
      { flush: "post" },
    );

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
      return videoPlayerRef.value;
    }

    //entry
    function initialize(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "--------initializePlayer------>>>>>");
      }
      //1.
      initializeLazyPlayer();
    }

    //----------------------------init Lazy Player---------------------------------
    function initializeLazyPlayer(): void {
      clearPlayerLazyDetectTimer();
      if (videoPlayerRef.value) {
        playerInitialized.value = true;
        initializePlayerLazySuccess();
        return;
      }
      let start = new Date().getTime();
      playerInitialized.value = true;
      playerLazyInitializedTimer = setInterval(() => {
        if (!videoPlayerRef.value) {
          let end = new Date().getTime();
          if (end - start > 10000) {
            initializePlayerLazyError();
          }
        }
      }, 100);
    }

    function initializePlayerLazySuccess(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----initializePlayerLazySuccess----->>>");
      }

      clearPlayerLazyDetectTimer();

      if (isRelease) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----initializePlayerLazySuccess--播放器已经销毁--->>>");
        }
        release();
        return;
      }

      context.emit("onPlayerLazyInitSuccess", getType());
      //2.
      initializePlayerComponent();
    }

    function initializePlayerLazyError(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----initializePlayerLazyError----->>>");
      }
      clearPlayerLazyDetectTimer();
      context.emit("onPlayerLazyInitError", getType());

      let error = {
        errorCode: -1,
        errorMessage: "player lazy init error...",
      };
      onPlayerMediaSourceListError(error);
    }

    function clearPlayerLazyDetectTimer(): void {
      if (playerLazyInitializedTimer) {
        clearInterval(playerLazyInitializedTimer);
        playerLazyInitializedTimer = null;
      }
    }

    function isInitialized(): boolean {
      return videoPlayerRef.value != undefined;
    }

    function unInitialize(): void {
      playerInitialized.value = false;
    }

    //-------------------------初始化组件------------------------------------
    function initializePlayerComponent(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----initializePlayerComponent----->>>");
      }
      getComponentInfo();
    }

    function getComponentInfo(): void {
      getPlayer()?.getComponentInfo();
    }

    function initComponent(...params: Array<any>): void {
      getPlayer()?.initComponent();
    }

    //-------------------------最后输入------------------------------------
    function onPlayerInitializeSuccess(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----onPlayerInitializeSuccess----->>>");
      }

      if (isRelease) {
        release();
        return;
      }

      //setPlayer
      playerEventManager.setPlayer(getPlayer()!);
      playerViewManager.setPlayer(getPlayer()!);

      context.emit("onPlayerInitialized", getType());

      //
      playerEventManager.onPlayerInitialized(getType());
      playerViewManager.onPlayerInitialized(getType());

      getPlayer()?.setProgressCallback(onPlayerProgressChanged);
      getPlayer()?.setDurationCallback(onPlayerDurationChanged);
      getPlayer()?.setBufferPercentCallback(onPlayerBufferPercentChanged);
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
      // onPlayerNoMediaSourceCanPlay(true)
    }

    function onPlayerNoMediaSourceCanPlay(next: boolean) {
      context.emit("onPlayerNoMediaSourceCanPlay", next);
      playerEventManager.onPlayerNoMediaSourceCanPlay(next);
      playerViewManager.onPlayerNoMediaSourceCanPlay(next);
      //
      reset();
    }

    //------------------------------------------------------------
    function playMediaSourceList(list: ESMediaSourceList): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceList----->>>", list);
      }
      setStopped(false);
      //
      reset();
      //
      mediaSourceList = list;
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
      if (mediaSourceList.list.length <= 0) {
        onPlayerMediaSourceListError({
          errorCode: -1,
          errorMessage: "播放地址为空",
        });
        return;
      }
      //
      context.emit("onPlayerPlayMediaSourceList", mediaSourceList);
      playerEventManager.onPlayerPlayMediaSourceList(mediaSourceList);
      playerViewManager.onPlayerPlayMediaSourceList(mediaSourceList);

      //play mode
      playMode = playModeManager.getPlayMode();
      onPlayerPlayMediaSourceListModeListChanged(playModeList);
      onPlayerPlayMediaSourceListModeChanged(playMode);

      //definition
      let definitionList = getDefinitionList(mediaSourceList.list);
      onPlayerDefinitionListChanged(definitionList);

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
        log.d(TAG, "-----playMediaSourceByDefinition---START-->>>");
      }
      let currentDefinition = definitionManager.getDefinition();
      let index = 0;
      try {
        index = getMediaSourceByDefinition(currentDefinition, list);
        if (index <= -1) {
          index = 0;
        }
      } catch (e) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "playMediaSourceByDefinition error :", e);
        }
      }
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(
          TAG,
          "-----playMediaSourceByDefinition---END-->>>",
          "definition:" + currentDefinition + "index:" + index,
        );
      }
      playMediaSourceByIndex(index);
    }

    function playMediaSourceByIndex(index: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceByIndex----->>>", index);
      }
      if (mediaSourceList.list == undefined || mediaSourceList.list.length <= 0) {
        onPlayerError({
          errorCode: -1,
          errorMessage: "MediaSourceList is null...",
        });
        return;
      }

      if (index < 0 || index > mediaSourceList.list.length) {
        index = 0;
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.w(TAG, `Invalid play index: ${index}, defaulting to index 0.`);
        }
      }
      mediaSourceIndex = index;
      mediaSource = mediaSourceList.list[index];
      playMediaSource(mediaSource);
    }

    function playMediaSourceById(id: string): void {
      if (mediaSourceList && mediaSourceList.list && mediaSourceList.list.length > 0) {
        let index = mediaSourceList.list.findIndex((element) => element.id == id);
        if (index >= 0) {
          playMediaSourceByIndex(index);
        }
      }
    }

    function playMediaSource(mediaSource: ESMediaSource): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSource----->>>", mediaSource);
      }

      setStopped(false);

      context.emit("onPlayerPlayMediaSource", mediaSource);
      playerEventManager.onPlayerPlayMediaSource(mediaSource);
      playerViewManager.onPlayerPlayMediaSource(mediaSource);

      //definition
      let d = getDefinition(mediaSource);
      definition = d;
      definitionManager.setDefinition(definition);
      onPlayerDefinitionChanged(definition);

      //rate
      onPlayerPlayRateListChanged(playRateList);
      playRate = playRateManager.getPlayRate();
      onPlayerPlayRateChanged(playRate);

      //render
      onPlayerRenderListChanged(renderList);
      render = renderManager.getRender();
      onPlayerRenderChanged(render);

      //decode
      onPlayerDecodeListChanged(decodeList);
      decode = decodeManager.getDecode();
      onPlayerDecodeChanged(decode);

      //aspect
      aspectRatio = aspectRatioManager.getAspectRatio();

      //
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

            _preparePlayMediaSource(mediaSource);
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
        _preparePlayMediaSource(mediaSource);
      }
    }

    function _preparePlayMediaSource(mediaSource: ESMediaSource) {
      play(mediaSource);
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
        log.d(
          TAG,
          "-----------play-----PARAMS------>>>",
          "mediaSource:" + mediaSource,
          "aspectRatio:" + aspectRatioManager.getAspectRatio(),
          "leftVolume:" + volumeManager.getLeftVolume(),
          "rightVolume:" + volumeManager.getRightVolume(),
          "render:" + renderManager.getRender(),
          "playerType:" + playerTypeManager.getPlayerType(),
          "playMediaSourceAuto:" + props.playMediaSourceAuto,
          "isStopped:" + isStopped,
          "isEnabled:" + isEnabled,
        );
      }

      //
      setSize(props.playerWidth, props.playerHeight);
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(
          TAG,
          "-----------play-----setSize------>>>",
          "playerWidth:" + props.playerWidth,
          "playerHeight:" + props.playerHeight,
        );
      }
      //

      try {
        if (
          decodeManager.getDecode() == ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE &&
          mediaSource.metadata &&
          mediaSource.metadata.coverToConcat
        ) {
          mediaSource.metadata.coverToConcat = false;
        }
      } catch (e) {}

      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "###################### PLAY START #################################");
      }
      getPlayer()?.play(
        mediaSource.uri,
        aspectRatioManager.getAspectRatio(),
        volumeManager.getLeftVolume(),
        volumeManager.getRightVolume(),
        player.getPlayerConfiguration().options,
        playerTypeManager.getPlayerType(),
        true,
        mediaSource.looping ? mediaSource.looping : false,
        renderManager.getRender(),
        mediaSource.metadata,
      );
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "###################### PLAY END #################################");
      }
      //start
      if (!isStopped && isEnabled && !isPaused) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------play-----自动播放------>>>", mediaSource);
        }
        start();
      } else {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------play-----不自动播放------>>>", mediaSource);
        }
      }
    }

    function playNextMediaSource(error: boolean = false): void {
      //
      reset();
      //
      //once
      if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE) {
        stop();
        setStopped(false);

        if (error) {
          //播放出错，播放下一个视频
          if (mediaSourceList.list && mediaSourceIndex + 1 < mediaSourceList.list.length) {
            playMediaSourceByIndex(mediaSourceIndex + 1);
          }
          //没有视频可播
          else {
            onPlayerNoMediaSourceCanPlay(true);
          }
        }
        //正常播放
        else {
          onPlayerNoMediaSourceCanPlay(true);
        }
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
        if (error) {
          //播放出错，播放下一个视频
          if (mediaSourceList.list && mediaSourceIndex + 1 < mediaSourceList.list.length) {
            playMediaSourceByIndex(mediaSourceIndex + 1);
          }
          //没有视频可播
          else {
            onPlayerNoMediaSourceCanPlay(true);
          }
        }
        //正常播放
        else {
          playMediaSourceByIndex(mediaSourceIndex);
        }
      }
    }

    function playPreviousMediaSource(): void {
      //
      reset();
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
    function start(): void {
      let startPosition = mediaSourceList.position;
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(
          TAG,
          "--------start------>>>startPosition:",
          startPosition,
          "currentPosition:" + currentPosition,
        );
      }
      setPaused(false);

      if (currentPosition != null && currentPosition > 0) {
        const position = Number(currentPosition);
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-------start-----currentPosition---->>>position:", position);
        }
        getPlayer()?.start(position);
      } else if (startPosition && startPosition.support) {
        const position = Number(startPosition.position);
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----start----startPosition.position----->>>position:", position);
        }
        getPlayer()?.start(Number(startPosition.position));
      } else {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "----start------0------->>>position:0");
        }
        getPlayer()?.start(0);
      }
    }

    function pause(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------pause------------->>>");
      }
      setPaused(true);
      getPlayer()?.pause();
      onPlayerPaused();
    }

    function resume(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------resume------------->>>");
      }
      playMediaSourceByIndex(mediaSourceIndex);
    }

    function stop(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------stop------------->>>", getPlayer());
      }
      setPaused(false);
      setStopped(true);
      getPlayer()?.stop();
      onPlayerStopped();
    }

    function release(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------release------------->>>");
      }
      isRelease = true;
      setPaused(false);
      getPlayer()?.release();
    }

    function reset(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------reset------------->>>");
      }
      currentPosition = 0;
      duration = 0;
    }

    function control(options: ESPlayerControlOptions): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------control------------->>>", options);
      }
    }

    function seekTo(progress: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------seekTo------------->>>" + progress);
      }
      currentPosition = progress;
      getPlayer()?.seekTo(progress);
    }

    function setPaused(paused: boolean): void {
      isPaused = paused;
    }

    function setStopped(stopped: boolean): void {
      isStopped = stopped;
    }

    function setEnabled(enabled: boolean): void {
      isEnabled = enabled;
    }

    function setSize(width: number, height: number): void {
      getPlayer()?.setSize(displayManager.getSize(width), displayManager.getSize(height));
      invalidate();
    }

    function setPlayerDimension(
      defaultWidth: number,
      defaultHeight: number,
      fullPlayerWidth: number,
      fullPlayerHeight: number,
      fullScreen: boolean,
      quickUpdate: boolean,
    ): void {
      getPlayer()?.setPlayerDimension(
        displayManager.getSize(defaultWidth),
        displayManager.getSize(defaultHeight),
        displayManager.getSize(fullPlayerWidth),
        displayManager.getSize(fullPlayerHeight),
        fullScreen,
        quickUpdate,
      );
    }

    function invalidate(): void {
      getPlayer()?.invalidate();
    }

    //----------------------------播放状态回调--------------------------------

    const setProgressCallback = (callback: ESPlayerProgressCallback): void => {
      progressCallback = callback;
    };

    const setDurationCallback = (callback: ESPlayerDurationCallback): void => {
      durationCallback = callback;
    };

    const setBufferPercentCallback = (callback: ESPlayerBufferPercentCallback): void => {
      bufferPercentCallback = callback;
    };

    function getPlayerState(): ESPlayerState {
      return playerState;
    }

    function onPlayerError(error: ESPlayerError): void {
      context.emit("onPlayerError", error);
      playerEventManager.onPlayerError(error);
      playerViewManager.onPlayerError(error);
      setStopped(true);
      playNextMediaSource(true);
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

      //1.play rate
      if (playRate) {
        getPlayer()?.setPlayRate(playRate);
      }

      //2.aspectRatio
      getPlayer()?.setAspectRatio(aspectRatio);

      //3.volume
      let leftVolume = volumeManager.getLeftVolume();
      let rightVolume = volumeManager.getRightVolume();
      setLeftVolume(leftVolume);
      setRightVolume(rightVolume);
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
      reset();
      context.emit("onPlayerCompleted");
      playerEventManager.onPlayerCompleted();
      playerViewManager.onPlayerCompleted();
      setStopped(true);
      playNextMediaSource(false);
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

    function onPlayerADStart(): void {
      context.emit("onPlayerADStart");
    }

    function onPlayerADEnd(): void {
      context.emit("onPlayerADEnd");
    }

    function onPlayerADSkip(): void {
      context.emit("onPlayerADSkip");
    }

    function onPlayerADPaused(): void {
      context.emit("onPlayerADPaused");
    }

    function onPlayerADResumed(): void {
      context.emit("onPlayerADResumed");
    }

    function onPlayerADLoaded(): void {
      context.emit("onPlayerADLoaded");
    }

    function onPlayerAuthorized(): void {
      context.emit("onPlayerAuthorized");
    }

    function onPlayerSetRateSuccess(): void {
      context.emit("onPlayerSetRateSuccess");
    }

    function onPlayerSetRateError(): void {
      context.emit("onPlayerSetRateError");
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
          //由于android事件传递比较慢,导致vue上业务逻辑bug,所以把此事件移动到pause()方法中
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
          //由于android事件传递比较慢,导致vue上业务逻辑bug,所以把此事件移动到pause()方法中
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
        case ESPlayerState.ES_PLAYER_STATE_AD_START: {
          onPlayerADStart();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_AD_END: {
          onPlayerADEnd();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_AD_SKIP: {
          onPlayerADSkip();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_AD_PAUSED: {
          onPlayerADPaused();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_AD_RESUMED: {
          onPlayerADResumed();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_AD_LOADED: {
          onPlayerADLoaded();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_AUTHORIZED: {
          onPlayerAuthorized();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_SET_PLAY_RATE_SUCCESS: {
          onPlayerSetRateSuccess();
          break;
        }
        case ESPlayerState.ES_PLAYER_STATE_SET_PLAY_RATE_ERROR: {
          onPlayerSetRateError();
          break;
        }
      }
    }

    function getDuration(): void {
      if (!isStopped && isEnabled) {
        getPlayer()?.getDuration();
      }
    }

    function getCurrentPosition(): void {
      if (!isStopped && isEnabled) {
        getPlayer()?.getCurrentPosition();
      }
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

    function onPlayerBufferPercentChanged(percent: number): void {
      playerEventManager.onPlayerBufferPercentChanged(percent);
      playerViewManager.onPlayerBufferPercentChanged(percent);
      if (bufferPercentCallback) {
        bufferPercentCallback(percent);
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
      onPlayerVolumeChanged(volumeManager.getLeftVolume(), volumeManager.getRightVolume());
    }

    function getLeftVolume(): void {
      getPlayer()?.getLeftVolume();
    }

    function getRightVolume(): void {
      getPlayer()?.getRightVolume();
    }

    function setLeftVolume(leftVolume): void {
      getPlayer()?.setLeftVolume(leftVolume);
      volumeManager.setLeftVolume(leftVolume);
    }

    function setRightVolume(rightVolume): void {
      getPlayer()?.setRightVolume(rightVolume);
      volumeManager.setRightVolume(rightVolume);
    }

    //--------------------------------------------------------
    function setDecode(decode: ESPlayerDecode): void {
      decodeManager.setDecode(decode);
      onPlayerDecodeChanged(decode);
    }

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
    function setPlayRate(playRate: ESPlayerRate): void {
      playRateManager.setPlayRate(playRate);
      getPlayer()?.setPlayRate(playRate);
      //
      onPlayerPlayRateChanged(playRate);
    }

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
    function setAspectRatio(aspectRatio: ESPlayerAspectRatio): void {
      aspectRatioManager.setAspectRatio(aspectRatio);
      getPlayer()?.setAspectRatio(aspectRatio);
    }

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

    //------------------------------缓存----------------------------------------

    function setCache(cacheInfo: ESPlayerCache): void {
      getPlayer()?.setCache(cacheInfo);
    }

    //------------------------------轨道相关----------------------------------------
    function getTrackInfo(sysType: number = 1): Promise<Array<ESPlayerTrackInfo>> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve([]);
      } else return player.getTrackInfo(sysType);
    }

    function getSelectTrack(trackType: number): Promise<number> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(-1);
      } else return player.getSelectTrack(trackType);
    }

    function selectTrack(index: number): void {
      getPlayer()?.selectTrack(index);
    }

    function deselectTrack(index: number): void {
      getPlayer()?.deselectTrack(index);
    }

    //------------------------------获取视频信息----------------------------------------
    function getTcpSpeed(): Promise<string> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve("0");
      } else return player.getTcpSpeed();
    }

    function getBitRate(): Promise<string> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve("0");
      } else return player.getBitRate();
    }

    function getTcpSpeed2(): Promise<string> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve("0");
      } else return player.getTcpSpeed2();
    }

    function getBitRate2(): Promise<string> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve("0");
      } else return player.getBitRate2();
    }

    function getMediaMeta(): Promise<ESPlayerMediaMeta | null> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(null);
      } else return player.getMediaMeta();
    }

    function getCdnInfo(): Promise<ESPlayerCDNInfo | null> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(null);
      } else return player.getCdnInfo();
    }

    function getVideoDecoder(): Promise<string> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve("");
      } else return player.getVideoDecoder();
    }

    function getDropFrameRate(): Promise<string> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve("0");
      } else return player.getDropFrameRate();
    }
    function getVideoDecodeFramesPerSecond(): Promise<string> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve("0");
      } else return player.getVideoDecodeFramesPerSecond();
    }
    function getVideoOutputFramesPerSecond(): Promise<string> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve("0");
      } else return player.getVideoOutputFramesPerSecond();
    }
    function getAudioCachedDuration(): Promise<number> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(0);
      } else return player.getAudioCachedDuration();
    }
    function getVideoCachedDuration(): Promise<number> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(0);
      } else return player.getVideoCachedDuration();
    }

    function getAudioCachedBytes(): Promise<number> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(0);
      } else return player.getAudioCachedBytes();
    }
    function getVideoCachedBytes(): Promise<number> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(0);
      } else return player.getVideoCachedBytes();
    }
    function getVideoCachedPackets(): Promise<number> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(0);
      } else return player.getVideoCachedPackets();
    }
    function getAudioCachedPackets(): Promise<number> {
      let player = getPlayer();
      if (player == undefined) {
        return Promise.resolve(0);
      } else return player.getAudioCachedPackets();
    }

    //------------------------------自适应码率----------------------------------------
    function setM3U8DefaultDefinition(id: number): void {
      let options = playerConfiguration.options;
      if (!options) {
        options = [];
      }

      options.push({
        type: ESPlayerOptionType.ES_PLAYER_OPTION_TYPE_INT,
        category: ESPlayerOptionCategory.ES_PLAYER_OPTION_CATEGORY_PLAYER,
        name: "hls-wanted-definition",
        value: id,
      });

      playerConfiguration.options = options;
    }

    function getM3U8DefinitionInfo(): Promise<Array<M3U8DefinitionInfo>> {
      let player = getPlayer();

      if (player == undefined) {
        return Promise.resolve([]);
      } else return player.getM3U8DefinitionInfo();
    }

    function setM3U8Definition(id: number): void {
      getPlayer()?.setM3U8Definition(id);
    }

    //------------------------------清晰度----------------------------------------
    function setDefinition(definition: ESPlayerDefinition): void {
      let index = getMediaSourceByDefinition(definition, mediaSourceList.list);
      if (index > -1) {
        playMediaSourceByIndex(index);
      }
    }

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

    //----------------------------渲染模式----------------------------------------
    function setRender(value: ESPlayerRender): void {
      render = value;
      renderManager.setRender(value);
      onPlayerRenderChanged(value);
    }

    function onPlayerRenderListChanged(renderList: Array<ESPlayerRender>): void {
      context.emit("onPlayerRenderListChanged", renderList);
      playerViewManager.onPlayerRenderListChanged(renderList);
      playerEventManager.onPlayerRenderListChanged(renderList);
    }

    function onPlayerRenderChanged(render: ESPlayerRender): void {
      context.emit("onPlayerRenderChanged", render);
      playerViewManager.onPlayerRenderChanged(render);
      playerEventManager.onPlayerRenderChanged(render);
    }

    //----------------------------------------------------------------------
    function onPlayerInfo(info: ESPlayerInfo): void {
      context.emit("onPlayerInfo", info);
      playerEventManager.onPlayerInfo(info);
      playerViewManager.onPlayerInfo(info);
    }

    function onPlayerComponentInfo(info: ESPlayerComponentInfo): void {
      if (info && info.isSupportDynamicallyLoadedSo) {
        initComponent();
      } else {
        onPlayerInitializeSuccess();
      }
    }

    return {
      videoPlayerRef,
      playerInitialized,
      visible,
      getPlayer,
      //
      getComponentInfo,
      initComponent,
      getId,
      getType,
      setVisible,
      initialize,
      unInitialize,
      isInitialized,
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
      stop,
      resume,
      reset,
      release,
      seekTo,
      control,
      getPlayerState,
      //
      getDuration,
      getCurrentPosition,
      //
      setSize,
      setPlayerDimension,
      //
      setDefinition,
      setCache,
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
      setDecode,
      getPlayerDecode,
      getPlayerDecodeList,
      //
      setRender,
      onPlayerRenderListChanged,
      onPlayerRenderChanged,
      //
      setPlayMode,
      //
      setVolume,
      getVolume,
      getLeftVolume,
      setLeftVolume,
      getRightVolume,
      setRightVolume,
      //
      setStopped,
      setEnabled,
      setProgressCallback,
      setDurationCallback,
      setBufferPercentCallback,
      //
      invalidate,
      //
      onPlayerError,
      onPlayerStatusChanged,
      onPlayerDurationChanged,
      onPlayerProgressChanged,
      onPlayerBufferPercentChanged,
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
      onPlayerComponentInfo,
      //
      getM3U8DefinitionInfo,
      setM3U8Definition,
      setM3U8DefaultDefinition,
      //
      getTrackInfo,
      getSelectTrack,
      selectTrack,
      deselectTrack,
      //
      getTcpSpeed,
      getBitRate,
      getTcpSpeed2,
      getBitRate2,
      getMediaMeta,
      getCdnInfo,
      getVideoDecoder,
      getDropFrameRate,
      getVideoDecodeFramesPerSecond,
      getVideoOutputFramesPerSecond,
      getAudioCachedDuration,
      getVideoCachedDuration,
      getVideoCachedBytes,
      getVideoCachedPackets,
      getAudioCachedBytes,
      getAudioCachedPackets,
    };
  },
});
</script>

<style scoped>
.es-video-player-root-css {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
