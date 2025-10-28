<template>
  <div
    class="es-ad-player-root-css"
    v-show="visible"
    :style="{ width: playerWidth, height: playerHeight, backgroundColor: backgroundColor }"
  >
    <es-ad-player-view-component
      ref="player"
      v-if="playerInitialized"
      :style="{ width: playerWidth, height: playerHeight, zIndex: playerZIndex }"
      @player-status-changed="onPlayerStatusChanged"
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
  ESPlayerCache,
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
  ESPlayerPlayMode,
  ESPlayerProgressCallback,
  ESPlayerRate,
  ESPlayerRender,
  ESPlayerState,
  ESPlayerStatus,
  ESPlayerVolume,
  useESPlayerInterceptorManager,
  useESPlayerLog,
  useESPlayerPlayModeManager,
} from "@extscreen/es3-player";

const TAG = "ESADPlayer";

export default defineComponent({
  name: "es-ad-player",
  emits: [
    "onPlayerLazyInitSuccess",
    "onPlayerLazyInitError",
    "onPlayerInitialized",
    "onPlayerPlayMediaSource",
    "onPlayerInterceptSuccess",
    "onPlayerInterceptError",
    "onPlayerNoMediaSourceCanPlay",
    "onPlayerPlayMediaSourceListModeListChanged",
    "onPlayerPlayMediaSourceListModeChanged",
    "onPlayerError",
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
    "onPlayerInfo",
  ],
  props: {
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
    channel: {
      type: String,
      default: "",
    },
    debug: {
      type: Boolean,
      default: false,
    },
    test: {
      type: Boolean,
      default: false,
    },
  },
  type: 2,
  setup(props, context) {
    const player = ref<ESIPlayer>();
    const log = useESPlayerLog();
    const interceptorManager = useESPlayerInterceptorManager();
    const playModeManager = useESPlayerPlayModeManager();

    //
    const playerInitialized = ref(false);
    let playerLazyInitializedTimer;

    let visible = ref<boolean>(true);

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

    //
    let progressCallback: ESPlayerProgressCallback;
    let durationCallback: ESPlayerDurationCallback;

    watch(
      () => [player.value] as const,
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
      return 2;
    }

    function getPlayer(): ESIPlayer | undefined {
      return player.value;
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
      if (player.value) {
        initializePlayerLazySuccess();
        return;
      }

      let start = new Date().getTime();
      playerInitialized.value = true;
      playerLazyInitializedTimer = setInterval(() => {
        if (!player.value) {
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
      onPlayerError(error);
    }

    function clearPlayerLazyDetectTimer(): void {
      if (playerLazyInitializedTimer) {
        clearInterval(playerLazyInitializedTimer);
        playerLazyInitializedTimer = null;
      }
    }

    function isInitialized(): boolean {
      return playerInitialized.value;
    }

    function unInitialize(): void {
      playerInitialized.value = false;
    }

    //-------------------------初始化组件------------------------------------
    function getComponentInfo(): void {
      getPlayer()?.getComponentInfo();
    }

    function initComponent(...params: Array<any>): void {
      getPlayer()?.initComponent(props.channel, props.test, props.debug);
    }

    function initializePlayerComponent(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----initializePlayerComponent----->>>");
      }
      initComponent();
    }

    //-------------------------最后输入------------------------------------
    function onPlayerInitializeSuccess(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----onPlayerInitializeSuccess----->>>");
      }
      context.emit("onPlayerInitialized", getType());

      getPlayer()?.setProgressCallback(onProgressChanged);
      getPlayer()?.setDurationCallback(onDurationChanged);
    }

    function onPlayerInitializeError(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----onPlayerInitializeError----->>>");
      }
      let error = {
        errorCode: -1,
        errorMessage: "player init error...",
      };
      onPlayerError(error);
    }

    //------------------------------------------------------------
    function playMediaSourceList(list: ESMediaSourceList): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceList----->>>", list);
      }
      mediaSourceList = list;

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

      if (list.list && list.list.length > 0) {
        playMediaSourceByIndex(mediaSourceIndex);
      } else {
        onPlayerError({
          errorCode: -1,
          errorMessage: "播放地址为空",
        });
      }
    }

    function playMediaSourceByIndex(index: number): void {
      if (mediaSourceList.list.length <= 0) {
        return;
      }
      if (index < 0 || index > mediaSourceList.list.length) {
        return;
      }
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceByIndex----->>>", index);
      }

      mediaSourceIndex = index;
      mediaSource = mediaSourceList.list[index];
      playMediaSource(mediaSource);
    }

    function playMediaSourceById(id: string): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceById----->>>", id);
      }
      if (mediaSourceList && mediaSourceList.list && mediaSourceList.list.length > 0) {
        let index = mediaSourceList.list.findIndex((element) => element.id == id);
        if (index > 0) {
          playMediaSourceByIndex(index);
        }
      }
    }

    function playMediaSource(mediaSource: ESMediaSource): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "---------playMediaSource------->>>", mediaSource);
      }
      context.emit("onPlayerPlayMediaSource", mediaSource);
      interceptMediaSource(mediaSource);
    }

    function interceptMediaSource(mediaSource: ESMediaSource): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "---------interceptMediaSource------->>>", mediaSource);
      }
      let result: ESPlayerInterceptResult = {
        result: null,
      };
      let promise: Promise<ESPlayerInterceptResult> | null = null;

      const globalInterceptorList = interceptorManager.getInterceptorsByType(
        ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_AD_MEDIA_SOURCE,
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

            play(mediaSource);
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
    }

    function onPlayerInterceptError(interceptError: ESPlayerInterceptError): void {
      context.emit("onPlayerInterceptError", interceptError);
    }

    function play(...params: Array<any>): void {
      let mediaSource: ESMediaSource = params[0];
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "---------play------->>>", mediaSource);
      }
      //
      setSize(props.playerWidth, props.playerHeight);
      //
      getPlayer()?.play(
        mediaSource.uri.id,
        mediaSource.uri.type,
        mediaSource.uri.mediaId,
        mediaSource.uri.count,
        ESPlayerVolume.ES_PLAYER_MAX_VOLUME,
        ESPlayerVolume.ES_PLAYER_MAX_VOLUME,
        1,
        true,
        null,
        false,
        true,
      );
    }

    function playNextMediaSource(): void {
      //once
      if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE) {
        stop();
        setStopped(false);
        context.emit("onPlayerNoMediaSourceCanPlay", true);
      }
      //order
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER) {
        stop();
        setStopped(false);
        if (mediaSourceIndex + 1 < mediaSourceList.list.length) {
          playMediaSourceByIndex(mediaSourceIndex + 1);
        } else {
          context.emit("onPlayerNoMediaSourceCanPlay", true);
        }
      }
      //order loop
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP) {
        stop();
        setStopped(false);
        if (mediaSourceIndex + 1 < mediaSourceList.list.length) {
          playMediaSourceByIndex(mediaSourceIndex + 1);
        } else {
          playMediaSourceByIndex(0);
        }
      }
      //shuffle
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE) {
        let randomIndex = Math.floor(Math.random() * mediaSourceList.list.length);
        stop();
        setStopped(false);
        playMediaSourceByIndex(randomIndex);
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
        context.emit("onPlayerNoMediaSourceCanPlay", false);
      }
      //order
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER) {
        stop();
        setStopped(false);
        if (mediaSourceIndex - 1 >= 0) {
          playMediaSourceByIndex(mediaSourceIndex - 1);
        } else {
          context.emit("onPlayerNoMediaSourceCanPlay", false);
        }
      }
      //order loop
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP) {
        stop();
        setStopped(false);
        if (mediaSourceIndex - 1 >= 0) {
          playMediaSourceByIndex(mediaSourceIndex - 1);
        } else {
          playMediaSourceByIndex(mediaSourceList.list.length - 1);
        }
      }
      //shuffle
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE) {
        let randomIndex = Math.floor(Math.random() * mediaSourceList.list.length);
        stop();
        setStopped(false);
        playMediaSourceByIndex(randomIndex);
      }
      //repeat
      else if (playMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT) {
        stop();
        setStopped(false);
        playMediaSourceByIndex(mediaSourceIndex);
      }
    }

    //------------------------------------------------------------
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

    //------------------------------------------------------------
    function start(): void {
      getPlayer()?.start(0);
    }

    function pause(): void {
      getPlayer()?.pause();
    }

    function resume(): void {
      playMediaSource(mediaSource);
      start();
    }

    function stop(): void {
      getPlayer()?.stop();
    }

    function release(): void {
      getPlayer()?.release();
    }

    function reset(): void {
      currentPosition = 0;
      duration = 0;
    }

    function control(options: ESPlayerControlOptions): void {}

    function seekTo(progress: number): void {
      currentPosition = progress;
      getPlayer()?.seekTo(progress);
    }

    function setStopped(stopped: boolean): void {
      isStopped = stopped;
    }

    function setEnabled(enabled: boolean): void {
      isEnabled = enabled;
    }

    function setSize(width: number, height: number): void {
      getPlayer()?.setSize(width, height);
      invalidate();
    }

    function setPlayRate(playRate: ESPlayerRate): void {}

    function setDefinition(definition: ESPlayerDefinition): void {}

    function setDecode(decode: ESPlayerDecode): void {}

    function setRender(render: ESPlayerRender): void {}

    function setAspectRatio(aspectRatio: ESPlayerAspectRatio): void {}

    function setVolume(volume: number): void {}

    function getVolume(): void {}

    function getLeftVolume(): void {}

    function getRightVolume(): void {}

    function setLeftVolume(leftVolume: number): void {}

    function setRightVolume(rightVolume: number): void {}

    function setCache(cache: ESPlayerCache): void {}

    function invalidate(): void {
      getPlayer()?.invalidate();
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
    }

    function onPlayerPlayMediaSourceListModeChanged(playMode: ESPlayerPlayMode): void {
      context.emit("onPlayerPlayMediaSourceListModeChanged", playMode);
    }

    //----------------------------播放状态回调--------------------------------

    const setProgressCallback = (callback: ESPlayerProgressCallback): void => {
      progressCallback = callback;
    };

    const setDurationCallback = (callback: ESPlayerDurationCallback): void => {
      durationCallback = callback;
    };

    function onPlayerError(error: ESPlayerError): void {
      context.emit("onPlayerError", error);
      playNextMediaSource();
    }

    function onRealPlayerInitialized(): void {
      context.emit("onRealPlayerInitialized");
    }

    function onPlayerSizeChanged(playerWidth: number, playerHeight: number): void {
      context.emit("onPlayerSizeChanged", playerWidth, playerHeight);
    }

    function onPlayerClickable(playerClickable: boolean): void {
      context.emit("onPlayerClickable", playerClickable);
    }

    function onPlayerViewChanged(): void {
      context.emit("onPlayerViewChanged");
    }

    function onPlayerPreparing(): void {
      context.emit("onPlayerPreparing");
    }

    function onPlayerPrepared(): void {
      context.emit("onPlayerPrepared");
    }

    function onPlayerPlaying(): void {
      context.emit("onPlayerPlaying");
    }

    function onPlayerBeforeStopped(): void {
      context.emit("onPlayerBeforeStopped");
    }

    function onPlayerPaused(): void {
      context.emit("onPlayerPaused");
    }

    function onPlayerResumed(): void {
      context.emit("onPlayerResumed");
    }

    function onPlayerStopped(): void {
      context.emit("onPlayerStopped");
    }

    function onPlayerCompleted(): void {
      context.emit("onPlayerCompleted");
      playNextMediaSource();
    }

    function onPlayerBufferStart(): void {
      context.emit("onPlayerBufferStart");
    }

    function onPlayerBufferEnd(): void {
      context.emit("onPlayerBufferEnd");
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
      }
    }

    function getDuration(): void {
      getPlayer()?.getDuration();
    }

    function getCurrentPosition(): void {
      getPlayer()?.getCurrentPosition();
    }

    function onProgressChanged(progress: number): void {
      currentPosition = progress;
      if (progressCallback) {
        progressCallback(progress);
      }
    }

    function onDurationChanged(d: number): void {
      duration = d;
      if (durationCallback) {
        durationCallback(d);
      }
    }

    //----------------------------------------------------------------------
    function onPlayerInfo(info: ESPlayerInfo): void {
      context.emit("onPlayerInfo", info);
    }

    function onPlayerComponentInfo(info: ESPlayerComponentInfo): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----onPlayerComponentInfo----->>>", info);
      }
      if (info && info.isSupportDynamicallyLoadedSo) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----onPlayerComponentInfo---isSupportDynamicallyLoadedSo-->>>", info);
        }
        initComponent();
      } else {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----onPlayerComponentInfo--success--->>>", info);
        }
        onPlayerInitializeSuccess();
      }
    }

    return {
      player,
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
      getDuration,
      getCurrentPosition,
      setSize,
      setPlayRate,
      setPlayMode,
      setDefinition,
      setDecode,
      setRender,
      setAspectRatio,
      //
      getLeftVolume,
      getRightVolume,
      setLeftVolume,
      setRightVolume,
      setVolume,
      getVolume,
      //
      invalidate,
      //
      onPlayerPlayMediaSourceListModeListChanged,
      onPlayerPlayMediaSourceListModeChanged,
      onPlayerError,
      onPlayerStatusChanged,
      onPlayerInfo,
      onPlayerComponentInfo,
      onDurationChanged,
      onProgressChanged,
      setStopped,
      setEnabled,
      setProgressCallback,
      setDurationCallback,
      //
      setCache,
    };
  },
});
</script>

<style scoped>
.es-ad-player-root-css {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
