<template>
  <div
    class="player-manager-root-css"
    :clipChildren="false"
    :visible="visible"
    name="es-player-manager"
    :style="{ width: playerWidth, height: playerHeight, backgroundColor: playerBackgroundColor }"
  >
    <!-- 播放器层 -->
    <component
      v-for="(item, index) in playerList"
      :is="item"
      :key="item.name"
      class="player-manager-player-css"
      :ref="(el) => initPlayerComponentRef(el, item)"
      :playerWidth="playerWidth"
      :playerHeight="playerHeight"
      :style="{ position: 'absolute' }"
      :playMediaSourceAuto="playMediaSourceAuto"
      :playMediaSourceListMode="playMediaSourceListMode"
      @onPlayerInitialized="onPlayerInitialized"
      @onPlayerPlayMediaSourceList="onPlayerPlayMediaSourceList"
      @onPlayerPlayMediaSource="onPlayerPlayMediaSource"
      @onPlayerInterceptSuccess="onPlayerInterceptSuccess"
      @onPlayerInterceptError="onPlayerInterceptError"
      @onPlayerNoMediaSourceCanPlay="onPlayerNoMediaSourceCanPlay"
      @onPlayerViewChanged="onPlayerViewChanged"
      @onPlayerSizeChanged="onPlayerViewSizeChanged"
      @onPlayerViewClickable="onPlayerViewClickable"
      @onPlayerError="onPlayerError"
      @onPlayerInfo="onPlayerInfo"
      @onPlayerPreparing="onPlayerPreparing"
      @onPlayerPrepared="onPlayerPrepared"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerPaused="onPlayerPaused"
      @onPlayerResumed="onPlayerResumed"
      @onPlayerStopped="onPlayerStopped"
      @onPlayerCompleted="onPlayerCompleted"
      @onPlayerControlled="onPlayerControlled"
      @onPlayerBufferStart="onPlayerBufferStart"
      @onPlayerBufferEnd="onPlayerBufferEnd"
      @onPlayerSeekStart="onPlayerSeekStart"
      @onPlayerSeekCompleted="onPlayerSeekCompleted"
      @onPlayerLeftVolumeChanged="onPlayerLeftVolumeChanged"
      @onPlayerRightVolumeChanged="onPlayerRightVolumeChanged"
      @onPlayerVolumeChanged="onPlayerVolumeChanged"
      @onPlayerDefinitionListChanged="onPlayerDefinitionListChanged"
      @onPlayerDefinitionChanged="onPlayerDefinitionChanged"
      @onPlayerDecodeListChanged="onPlayerDecodeListChanged"
      @onPlayerDecodeChanged="onPlayerDecodeChanged"
      @onPlayerPlayRateListChanged="onPlayerPlayRateListChanged"
      @onPlayerPlayRateChanged="onPlayerPlayRateChanged"
      @onPlayerAspectRatioListChanged="onPlayerAspectRatioListChanged"
      @onPlayerAspectRatioChanged="onPlayerAspectRatioChanged"
      @onPlayerRenderListChanged="onPlayerRenderListChanged"
      @onPlayerRenderChanged="onPlayerRenderChanged"
      @onPlayerPlayMediaSourceListModeListChanged="onPlayerPlayMediaSourceListModeListChanged"
      @onPlayerPlayMediaSourceListModeChanged="onPlayerPlayMediaSourceListModeChanged"
    />

    <!-- 播放器view层 -->
    <component
      v-for="(item, index) in playerViewList"
      :is="item"
      :key="index"
      :ref="(el) => initPlayerViewComponentRef(el, item)"
      :playerWidth="playerWidth"
      :playerHeight="playerHeight"
      :initPlayerWindowType="initPlayerWindowType"
      class="player-manager-player-view-css"
    />

    <!-- 广告 -->
    <component
      v-for="(item, index) in adPlayerList"
      :is="item"
      :key="item.name"
      class="player-manager-player-css"
      :style="{ position: 'absolute' }"
      :ref="(el) => initADPlayerComponentRef(el, item)"
      :test="adTest"
      :channel="adChannel"
      :debug="adDebug"
      :playerWidth="playerWidth"
      :playerHeight="playerHeight"
      :playMediaSourceAuto="playMediaSourceAuto"
      :playMediaSourceListMode="playMediaSourceListMode"
      @onPlayerInitialized="onADPlayerInitialized"
      @onPlayerPlayMediaSource="onADPlayerPlayMediaSource"
      @onPlayerInterceptSuccess="onADPlayerInterceptSuccess"
      @onPlayerInterceptError="onADPlayerInterceptError"
      @onPlayerNoMediaSourceCanPlay="onADPlayerNoMediaSourceCanPlay"
      @onPlayerViewChanged="onADPlayerViewChanged"
      @onPlayerSizeChanged="onADPlayerSizeChanged"
      @onPlayerClickable="onADPlayerClickable"
      @onPlayerInfo="onADPlayerInfo"
      @onPlayerError="onADPlayerError"
      @onPlayerPreparing="onADPlayerPreparing"
      @onPlayerPrepared="onADPlayerPrepared"
      @onPlayerPlaying="onADPlayerPlaying"
      @onPlayerPaused="onADPlayerPaused"
      @onPlayerResumed="onADPlayerResumed"
      @onPlayerStopped="onADPlayerStopped"
      @onPlayerCompleted="onADPlayerCompleted"
      @onPlayerBufferStart="onADPlayerBufferStart"
      @onPlayerBufferEnd="onADPlayerBufferEnd"
    />

    <!-- 广告view层 -->
    <component
      v-for="(item, index) in adPlayerViewList"
      :is="item"
      :key="index"
      :ref="(el) => initADPlayerViewComponentRef(el, item)"
      :playerWidth="playerWidth"
      :playerHeight="playerHeight"
      :initPlayerWindowType="initPlayerWindowType"
      class="player-manager-player-view-css"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getCurrentInstance, onMounted, ref } from "vue";
import {
  ESIPlayer,
  ESIPlayerInterceptor,
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerAspectRatio,
  ESPlayerBufferPercentCallback,
  ESPlayerCache,
  ESPlayerCDNInfo,
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
  ESPlayerPlayMode,
  ESPlayerProgressCallback,
  ESPlayerRate,
  ESPlayerRender,
  ESPlayerTrackInfo,
  ESPlayerWindowType,
  M3U8DefinitionInfo,
  useESPlayerAspectRatioManager,
  useESPlayerCacheManager,
  useESPlayerDecodeManager,
  useESPlayerDefinitionManager,
  useESPlayerInterceptorManager,
  useESPlayerLog,
  useESPlayerRateManager,
  useESPlayerRenderManager,
  useESPlayerVolumeManager,
} from "@extscreen/es3-player";
import { ESMediaItemList } from "./core/ESMediaItemList";
import { ESMediaItem } from "./core/ESMediaItem";
import { ESKeyEvent } from "@extscreen/es3-core";
import { ESBuiltinPlayerType } from "./core/ESBuiltinPlayerType";
import {
  useESPlayerManagerEventManager,
  useESPlayerManagerPlayModeManager,
  useESPlayerManagerViewManager,
} from "./useApi";
import { ESIPlayerManagerView } from "./view/ESIPlayerManagerView";
import { ESBuiltinADPlayerType } from "./core/ESBuiltinADPlayerType";
import { ESIPlayerManager } from "./core/ESIPlayerManager";
import SparseArray from "./utils/SparseArray";
import { ESPlayerManagerErrors } from "./core/ESPlayerManagerErrors";

const TAG = "ESPlayerManager";

export default defineComponent({
  name: "es-player-manager",
  emits: [
    "onPlayerPlayMediaList",
    "onPlayerMediaListInitialized",
    "onPlayerPlayMedia",
    "onPlayerError",
    "onPlayerInterceptSuccess",
    "onPlayerInterceptError",
    "onPlayerNoMediaCanPlay",
    "onADPlayerInitialized",
    "onADPlayerPlayMediaSource",
    "onADPlayerInterceptSuccess",
    "onADPlayerInterceptError",
    "onADPlayerNoMediaSourceCanPlay",
    "onADPlayerViewChanged",
    "onADPlayerSizeChanged",
    "onADPlayerClickable",
    "onADPlayerInfo",
    "onADPlayerError",
    "onADPlayerPreparing",
    "onADPlayerPrepared",
    "onADPlayerPlaying",
    "onADPlayerPaused",
    "onADPlayerResumed",
    "onADPlayerStopped",
    "onADPlayerCompleted",
    "onADPlayerBufferStart",
    "onADPlayerBufferEnd",
    "onPlayerProgressChanged",
    "onPlayerDurationChanged",
    "onPlayerBufferPercentChanged",
    "onPlayerInitialized",
    "onPlayerPlayMediaSource",
    "onPlayerPlayMediaSourceList",
    "onPlayerNoMediaSourceCanPlay",
    "onPlayerViewChanged",
    "onPlayerViewSizeChanged",
    "onPlayerViewClickable",
    "onPlayerInfo",
    "onPlayerPreparing",
    "onPlayerPrepared",
    "onPlayerPlaying",
    "onPlayerPaused",
    "onPlayerResumed",
    "onPlayerStopped",
    "onPlayerCompleted",
    "onPlayerControlled",
    "onPlayerBufferStart",
    "onPlayerBufferEnd",
    "onPlayerSeekStart",
    "onPlayerSeekCompleted",
    "onPlayerLeftVolumeChanged",
    "onPlayerRightVolumeChanged",
    "onPlayerVolumeChanged",
    "onPlayerDefinitionListChanged",
    "onPlayerDefinitionChanged",
    "onPlayerDecodeListChanged",
    "onPlayerDecodeChanged",
    "onPlayerPlayRateListChanged",
    "onPlayerPlayRateChanged",
    "onPlayerRenderListChanged",
    "onPlayerRenderChanged",
    "onPlayerAspectRatioListChanged",
    "onPlayerAspectRatioChanged",
    "onPlayerPlayMediaListModeListChanged",
    "onPlayerPlayMediaListModeChanged",
    "onPlayerPlayMediaSourceListModeListChanged",
    "onPlayerPlayMediaSourceListModeChanged",
    "onPlayerRelease",
    "onPlayerReset",
    "onPlayerWindowTypeChanged",
    "onPlayerWindowSizeChanged",
  ],
  props: {
    //---------------------------------------
    playerList: {
      type: Array,
      default: () => [],
    },
    playerViewList: {
      type: Array,
      default: () => [],
    },
    //---------------------------------------
    adPlayerList: {
      type: Array,
      default: () => [],
    },
    adPlayerViewList: {
      type: Array,
      default: () => [],
    },
    adChannel: {
      type: String,
      default: "",
    },
    adDebug: {
      type: Boolean,
      default: false,
    },
    adTest: {
      type: Boolean,
      default: false,
    },
    //---------------------------------------
    playMediaAuto: {
      type: Boolean,
      default: true,
    },
    playMediaSourceAuto: {
      type: Boolean,
      default: true,
    },
    playMediaSourceListMode: {
      type: Number,
      default: 0,
    },
    playerBackgroundColor: {
      type: String,
      default: "transparent",
    },
    smallWindowWidth: {
      type: Number,
      default: 976,
    },
    smallWindowHeight: {
      type: Number,
      default: 557,
    },
    fullWindowWidth: {
      type: Number,
      default: 1920,
    },
    fullWindowHeight: {
      type: Number,
      default: 1080,
    },
    floatWindowWidth: {
      type: Number,
      default: 400,
    },
    floatWindowHeight: {
      type: Number,
      default: 230,
    },
    initPlayerWindowType: {
      type: Number,
      default: 1,
    },
    isStopped: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    //----------------------------
  },
  setup(props, context) {
    console.log("----------ESPlayerManager-----setup-------->>>>>");
    const instance = getCurrentInstance();

    let visible = ref<boolean>(true);

    const log = useESPlayerLog();
    const interceptorManager = useESPlayerInterceptorManager();

    const playerManagerViewManager = useESPlayerManagerViewManager();
    const playerManagerEventManager = useESPlayerManagerEventManager();

    //
    const decodeManager = useESPlayerDecodeManager();
    const aspectRatioManager = useESPlayerAspectRatioManager();
    const definitionManager = useESPlayerDefinitionManager();
    const playRateManager = useESPlayerRateManager();
    const renderManager = useESPlayerRenderManager();
    const volumeManager = useESPlayerVolumeManager();
    const playModeManager = useESPlayerManagerPlayModeManager();
    const playerCacheManager = useESPlayerCacheManager();

    let isStopState = false;
    let isEnableState = true;

    //
    let playerType = ESBuiltinPlayerType.ES_BUILTIN_PLAYER_TYPE_UNKNOWN;
    //AD Type
    let adPlayerType = ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_UNKNOWN;

    let player: ESIPlayer | null = null;
    let adPlayer: ESIPlayer | null = null;

    //
    let playerWindowType: ESPlayerWindowType;
    let playerWidth = ref(1920);
    let playerHeight = ref(1080);

    //
    const mediaItemList = new SparseArray<ESMediaItem>();
    let mediaItemIndex: number = 0;
    let mediaItem: ESMediaItem | null;

    let playMediaListMode: ESPlayerPlayMode;

    //
    let currentPosition = 0;
    let duration = 0;

    let progressCallback: ESPlayerProgressCallback;
    let durationCallback: ESPlayerDurationCallback;
    let bufferPercentCallback: ESPlayerBufferPercentCallback;
    //---------------------------------ESIPlayerManager-----------------------------------
    //
    //
    //---------------------------------ESIPlayer-----------------------------------
    const componentRefs: Record<string, ESIPlayer> = {};

    function initPlayerComponentRef(el: ESIPlayer, item: { name: string; type: number }) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------initPlayerComponentRef-------------->>>>");
      }
      if (el) {
        componentRefs[`${item.type}`] = el;
      }
    }

    //------------------------------ESPlayerManagerView--------------------------------------
    const playerViewComponentRefs: Record<string, ESIPlayerManagerView> = {};

    function initPlayerViewComponentRef(
      el: ESIPlayerManagerView,
      item: { name: string; __name: string },
    ) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------initPlayerViewComponentRef-------------->>>>", item);
      }
      if (el && (item.name || item.__name)) {
        if (item.name) {
          playerViewComponentRefs[`${item.name}`] = el;
        } else {
          playerViewComponentRefs[`${item.__name}`] = el;
        }
      } else {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.e(TAG, "init player view error:", item.name, el);
        }
      }
    }

    function getPlayerView(name: string): ESIPlayerManagerView {
      return playerViewComponentRefs[name];
    }

    function callPlayerViewMethod(method: string, ...args) {
      for (let playerViewKey in playerViewComponentRefs) {
        const playerView: ESIPlayerManagerView = playerViewComponentRefs[playerViewKey];
        try {
          if (playerView) {
            playerView[method](...args);
          }
        } catch (e) {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            try {
              const playerViewName = playerView.getId() ?? "unknown view";
              log.d(
                TAG,
                "function callPlayerViewMethod: The method " +
                  method +
                  " does not exist in " +
                  playerViewName,
              );
            } catch (e) {}
          }
        }
      }
    }

    function callPlayerViewReturnMethod(method: string, ...args): boolean {
      for (let playerViewKey in playerViewComponentRefs) {
        const playerView = playerViewComponentRefs[playerViewKey];
        try {
          if (playerView && playerView[method](...args)) {
            return true;
          }
        } catch (e) {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            try {
              const playerViewName = playerView.getId() ?? "unknown view";
              log.d(
                TAG,
                "function callPlayerViewReturnMethod: The method " +
                  method +
                  " does not exist in " +
                  playerViewName,
              );
            } catch (e) {}
          }
        }
      }
      return false;
    }

    //------------------------------ESPlayerManagerView--------------------------------------
    const componentADRefs: Record<string, ESIPlayer> = {};

    function initADPlayerComponentRef(el: ESIPlayer, item: { name: string; type: number }) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------initADPlayerComponentRef-------------->>>>");
      }
      if (el) {
        componentADRefs[`${item.type}`] = el;
      }
    }

    const playerADViewComponentRefs: Record<string, ESIPlayerManagerView> = {};

    function initADPlayerViewComponentRef(el: ESIPlayerManagerView, item: { name: string }) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------initADPlayerViewComponentRef-------------->>>>");
      }
      if (el) {
        playerADViewComponentRefs[`${item.name}`] = el;
      }
    }

    function callADPlayerViewMethod(method: string, ...args) {
      for (let playerViewKey in playerADViewComponentRefs) {
        const playerView = playerADViewComponentRefs[playerViewKey];
        if (playerView) {
          try {
            playerView[method](...args);
          } catch (e) {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              try {
                const playerViewName = playerView.getId() ?? "unknown view";
                log.d(
                  TAG,
                  "function callADPlayerViewMethod: The method " +
                    method +
                    " does not exist in " +
                    playerViewName,
                );
              } catch (e) {}
            }
          }
        }
      }
    }

    //--------------------------------------------------------------------
    onMounted(() => {
      initPlayerView(props.initPlayerWindowType);
    });

    function setVisible(value: boolean): void {
      visible.value = value;
    }

    function initialize(): void {
      initPlayerConfiguration();
      initPlayerView(props.initPlayerWindowType);

      //
      try {
        if (instance && instance.proxy) {
          const playerManager = instance.proxy as unknown as ESIPlayerManager;
          playerManagerViewManager.setPlayerManager(playerManager);
          playerManagerEventManager.setPlayerManager(playerManager);
          callADPlayerViewMethod("setPlayerManager", playerManager);
          callPlayerViewMethod("setPlayerManager", playerManager);
        }
      } catch (e) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------initialize------error-------->>>>", e);
        }
      }
    }

    function isInitialized(): boolean {
      return true;
    }

    function initPlayerConfiguration(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------initPlayerConfiguration-------------->>>>");
      }
      //play mode
      playMediaListMode = playModeManager.getPlayMode();
    }

    //-----------------------------入口-----------------------------------
    function playMediaList(playListBean: ESMediaItemList): void {
      //
      initialize();

      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------play---------START----->>>>", playListBean);
      }

      mediaItemIndex = playListBean.index;

      setStopped(false);
      //
      playerManagerViewManager.onPlayerPlayMediaList(playListBean);
      playerManagerEventManager.onPlayerPlayMediaList(playListBean);
      callADPlayerViewMethod("onPlayerPlayMediaList", playListBean);
      callPlayerViewMethod("onPlayerPlayMediaList", playListBean);
      context.emit("onPlayerPlayMediaList", playListBean);

      //---------------------------播放模式-------------------------------------
      //play mode
      onPlayerPlayMediaListModeListChanged([
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE,
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER,
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE,
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT,
        ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP,
      ]);
      onPlayerPlayMediaListModeChanged(playMediaListMode);
      //----------------------------------------------------------------

      //
      interceptMediaList(playListBean);
    }

    function interceptMediaList(playList: ESMediaItemList): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------interceptMediaList----start--------->>>>", playList);
      }
      let result: ESPlayerInterceptResult = {
        result: null,
      };

      let promise: Promise<ESPlayerInterceptResult> | null = null;
      let list: ESIPlayerInterceptor[] = [];

      const globalInterceptorList = interceptorManager.getInterceptorsByType(
        ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM_LIST,
      );
      if (globalInterceptorList && globalInterceptorList.length > 0) {
        list.push(...globalInterceptorList);
      }
      const interceptorList = playList.interceptors;
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
                Object.assign(playList, result.result);
              }
            } catch (e) {}
            return interceptor.intercept(playList);
          });
        }
      });
      if (promise != null) {
        promise.then(
          (result) => {
            try {
              if (result.result) {
                Object.assign(playList, result.result);
              }
            } catch (e) {}

            onPlayerInterceptSuccess(result);
            //
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "-----------interceptMediaList---------success---->>>>", playList);
            }
            _preparePlayMediaItemList(playList);
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
            onPlayerMediaListError(playerError);
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "-----------interceptMediaList---------error---->>>>", playList);
            }
          },
        );
      } else {
        _preparePlayMediaItemList(playList);
      }
    }

    /**
     * 准备播放
     * @param playList
     */
    function _preparePlayMediaItemList(playList: ESMediaItemList) {
      mediaItemIndex = playList.index;
      if (playList.list && playList.list.length > 0) {
        mediaItemList.push(playList.list);
      }

      //初始化播放列表
      playerManagerViewManager.onPlayerMediaListInitialized(mediaItemList);
      playerManagerEventManager.onPlayerMediaListInitialized(mediaItemList);
      callADPlayerViewMethod("onPlayerMediaListInitialized", mediaItemList);
      callPlayerViewMethod("onPlayerMediaListInitialized", mediaItemList);
      context.emit("onPlayerMediaListInitialized", mediaItemList);

      //-----------------------------------------------------------------------------------
      //
      if (props.playMediaAuto) {
        playMediaByIndex(mediaItemIndex);
      }
      //------------------------------------------
    }

    function playMediaByIndex(index: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------playMediaByIndex----------->>>>", index);
      }
      if (mediaItemList.length <= 0) {
        onPlayerMediaListError({
          errorCode: ESPlayerManagerErrors.ES_PLAYER_MANAGER_ERROR_MEDIA_ITEM,
          errorMessage: "media item list is null!",
        });
        return;
      }
      if (index < 0 || index > mediaItemList.length) {
        onPlayerMediaListError({
          errorCode: ESPlayerManagerErrors.ES_PLAYER_MANAGER_ERROR_MEDIA_ITEM,
          errorMessage: "playing media item index illegal!",
        });
        return;
      }
      mediaItemIndex = index;
      mediaItem = mediaItemList.get(index);
      if (!mediaItem) {
        onPlayerMediaListError({
          errorCode: ESPlayerManagerErrors.ES_PLAYER_MANAGER_ERROR_MEDIA_ITEM,
          errorMessage: "playing media item error!",
        });
        return;
      }
      playMedia(mediaItem);
    }

    function playMediaById(id: string): void {
      if (mediaItemList.length <= 0) {
        onPlayerMediaListError({
          errorCode: ESPlayerManagerErrors.ES_PLAYER_MANAGER_ERROR_MEDIA_ITEM,
          errorMessage: "playing media item list is null!",
        });
        return;
      }
      let index = mediaItemList.findIndex((mediaItem) => mediaItem.id == id);
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "---------playMediaById------>>>", index, mediaItemList);
      }
      if (index < 0) {
        onPlayerMediaListError({
          errorCode: ESPlayerManagerErrors.ES_PLAYER_MANAGER_ERROR_MEDIA_ITEM,
          errorMessage: "playing media item index illegal! index:" + index,
        });
        return;
      }
      playMediaByIndex(index);
    }

    function playMedia(mediaItem: ESMediaItem): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------playMedia------------->>>>", mediaItem);
      }
      setStopped(false);
      //
      context.emit("onPlayerPlayMedia", mediaItem);
      playerManagerViewManager.onPlayerPlayMedia(mediaItem);
      playerManagerEventManager.onPlayerPlayMedia(mediaItem);
      callADPlayerViewMethod("onPlayerPlayMedia", mediaItem);
      callPlayerViewMethod("onPlayerPlayMedia", mediaItem);

      //
      if (mediaItem.previousRollADList && mediaItem.previousRollADList.support) {
        playPreviousRollAD(mediaItem);
      } else {
        playMediaItem(mediaItem);
      }
    }

    function onPlayerMediaListError(error: ESPlayerError): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerError------------->>>>", error);
      }
      context.emit("onPlayerError", error);
    }

    function onPlayerMediaError(error: ESPlayerError): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerError------------->>>>", error);
      }
      context.emit("onPlayerError", error);
    }

    //---------------------------------------------------------------------
    function playMediaItem(mediaItem: ESMediaItem): void {
      playerType =
        mediaItem.playerType ?? mediaItem.type ?? ESBuiltinPlayerType.ES_BUILTIN_PLAYER_TYPE_VIDEO;
      adPlayerType = ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_UNKNOWN;
      interceptMedia(mediaItem);
    }

    function playMediaItemSourceList() {
      if (player && mediaItem && mediaItem.mediaSourceList) {
        player.setStopped(false);
        try {
          //start position
          if (mediaItem && mediaItem.position && mediaItem.mediaSourceList) {
            mediaItem.mediaSourceList.position = mediaItem.position;
          }
        } catch (e) {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            log.e(TAG, "-----------resume---position---error---->>>", e);
          }
        }

        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.e(TAG, "----------playMediaItemSourceList---->>>", mediaItem.mediaSourceList);
        }

        player.playMediaSourceList(mediaItem.mediaSourceList);
      }
    }

    function playPreviousRollAD(mediaItem: ESMediaItem) {
      playerType = mediaItem.adPlayerType ?? ESBuiltinPlayerType.ES_BUILTIN_PLAYER_TYPE_AD;
      adPlayerType = ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_PREVIOUS_ROLL_AD;
      playAD(mediaItem.previousRollADList!);
    }

    function playMiddleRollAD(mediaItem: ESMediaItem) {
      playerType = mediaItem.adPlayerType ?? ESBuiltinPlayerType.ES_BUILTIN_PLAYER_TYPE_AD;
      adPlayerType = ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_MIDDLE_ROLL_AD;
      playAD(mediaItem.mediaSourceList!);
    }

    function playPostRollAD(mediaItem: ESMediaItem) {
      playerType = mediaItem.adPlayerType ?? ESBuiltinPlayerType.ES_BUILTIN_PLAYER_TYPE_AD;
      adPlayerType = ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_POST_ROLL_AD;
      playAD(mediaItem.postRollADList!);
    }

    function playAD(mediaSourceList: ESMediaSourceList) {
      interceptAD(mediaSourceList);
    }

    function playADMediaSourceList() {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------playADMediaSourceList------------->>>>");
      }
      if (adPlayer && mediaItem) {
        if (
          adPlayerType === ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_PREVIOUS_ROLL_AD &&
          mediaItem.previousRollADList
        ) {
          adPlayer.setStopped(false);
          adPlayer.playMediaSourceList(mediaItem.previousRollADList);
        } else if (
          adPlayerType === ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_POST_ROLL_AD &&
          mediaItem.postRollADList
        ) {
          adPlayer.setStopped(false);
          adPlayer.playMediaSourceList(mediaItem.postRollADList);
        }
      } else {
        let playerError: ESPlayerError = {
          errorCode: -1,
          errorMessage: "play AD data error...",
        };
        onADPlayerError(playerError);
      }
    }

    function stopMediaPlayer() {
      if (isStopped() || !isEnabled()) {
        return false;
      }
      if (player != null) {
        player.stop();
        player.setVisible(false);
      }
      callPlayerViewMethod("setVisible", false);
    }

    function initMediaPlayer(): boolean {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------initMediaPlayer------>>>>playerType:" + playerType, mediaItem);
      }
      if (isStopped() || !isEnabled()) {
        return false;
      }
      stopADPlayer();
      if (player != null) {
        player.stop();
        player.setVisible(false);
      }
      //
      player = componentRefs[`${playerType}`];
      if (!player) {
        onPlayerError({
          errorMessage: "播放器ref为null",
          errorCode: -1,
        });
        return false;
      }
      callPlayerViewMethod("setVisible", true);
      player.setVisible(true);
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------initMediaPlayer--------setVisible--true->>>>");
      }

      if (!player.isInitialized()) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------initMediaPlayer-------播放器没有初始化----->>>>");
        }
        player.initialize();
        return false;
      } else {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------initMediaPlayer--------播放器已经初始化----->>>>");
        }
        return true;
      }
    }

    function stopADPlayer() {
      if (isStopped() || !isEnabled()) {
        return false;
      }
      if (adPlayer != null) {
        adPlayer.stop();
        adPlayer.setVisible(false);
      }
      callADPlayerViewMethod("setVisible", false);
    }

    function initADPlayer(): boolean {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------initADPlayer----------->>>>", mediaItem);
      }
      if (isStopped() || !isEnabled()) {
        return false;
      }
      //
      stopMediaPlayer();
      //
      if (adPlayer != null) {
        adPlayer.stop();
        adPlayer.setVisible(false);
      }
      //
      adPlayer = componentADRefs[`${playerType}`];
      if (!adPlayer) {
        onPlayerError({
          errorMessage: "播放器ref为null",
          errorCode: -1,
        });
        return false;
      }

      adPlayer.setVisible(true);
      callADPlayerViewMethod("setVisible", true);
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------initADPlayer--------setVisible--true->>>>");
      }

      if (!adPlayer.isInitialized()) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------initADPlayer-------播放器没有初始化----->>>>");
        }
        adPlayer.initialize();
        return false;
      } else {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "-----------initADPlayer--------播放器已经初始化----->>>>");
        }
        return true;
      }
    }

    //------------------------视频----------------------------------
    function interceptMedia(mediaItem: ESMediaItem): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------interceptMedia------------->>>>", mediaItem);
      }
      let result: ESPlayerInterceptResult = {
        result: null,
      };

      let promise: Promise<ESPlayerInterceptResult> | null = null;
      let list: ESIPlayerInterceptor[] = [];

      const globalInterceptorList = interceptorManager.getInterceptorsByType(
        ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
      );
      if (globalInterceptorList && globalInterceptorList.length > 0) {
        list.push(...globalInterceptorList);
      }
      const interceptorList = mediaItem.interceptors;
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
                Object.assign(mediaItem, result.result);
              }
            } catch (e) {}
            return interceptor.intercept(mediaItem);
          });
        }
      });
      if (promise != null) {
        promise.then(
          (result) => {
            try {
              if (result.result) {
                Object.assign(mediaItem, result.result);
              }
            } catch (e) {}
            onPlayerInterceptSuccess(result);
            _preparePlayMediaItem(mediaItem);
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
            onPlayerError(playerError);
          },
        );
      } else {
        _preparePlayMediaItem(mediaItem);
      }
    }

    function _preparePlayMediaItem(mediaItem: ESMediaItem) {
      const isInitialized = initMediaPlayer();
      if (isInitialized) {
        playMediaItemSourceList();
      }
    }

    //------------------------广告---------------------------------
    function interceptAD(mediaSourceList: ESMediaSourceList): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------interceptAD------------->>>>", mediaItem);
      }
      let result: ESPlayerInterceptResult = {
        result: null,
      };

      let promise: Promise<ESPlayerInterceptResult> | null = null;
      let list: ESIPlayerInterceptor[] = [];

      const globalInterceptorList = interceptorManager.getInterceptorsByType(
        ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_AD_MEDIA_SOURCE_LIST,
      );
      if (globalInterceptorList && globalInterceptorList.length > 0) {
        list.push(...globalInterceptorList);
      }
      const interceptorList = mediaItem?.interceptors;
      if (interceptorList && interceptorList.length > 0) {
        let adInterceptorList = interceptorList.filter(
          (i) => i.type === ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_AD_MEDIA_SOURCE_LIST,
        );
        if (adInterceptorList && adInterceptorList.length > 0) {
          list.push(...adInterceptorList);
        }
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
            return interceptor.intercept(mediaItem);
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
            context.emit("onPlayerInterceptSuccess", result);

            _preparePlayADMediaSourceList();
          },
          (error) => {
            let playerError: ESPlayerError = {
              errorCode: error?.errorCode ?? -1,
              errorMessage: error?.errorMessage ?? "",
            };
            let interceptError: ESPlayerInterceptError = {
              error: playerError,
            };
            context.emit("onPlayerInterceptError", interceptError);
            onADPlayerError(playerError);
          },
        );
      } else {
        _preparePlayADMediaSourceList();
      }
    }

    function _preparePlayADMediaSourceList() {
      const isInitialized = initADPlayer();
      if (isInitialized) {
        playADMediaSourceList();
      }
    }

    //---------------------------------------------------------
    function canPlayNextMedia(): boolean {
      //once
      if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE) {
        return false;
      }
      //order
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER) {
        return mediaItemIndex + 1 < mediaItemList.length;
      }
      //repeat
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT) {
        return mediaItemIndex + 1 < mediaItemList.length;
      }
      //
      else {
        return true;
      }
    }

    function playNextMediaInner(playNext: boolean = false): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------playNextMediaInner--->>>>当前播放模式:", playMediaListMode);
      }
      //once
      if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE) {
        stop();
        setStopped(true);
        onPlayerNoMediaCanPlay(true);
      }
      //order
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER) {
        stop();
        setStopped(false);
        if (mediaItemList && mediaItemIndex + 1 < mediaItemList.length) {
          playMediaByIndex(mediaItemIndex + 1);
        } else {
          onPlayerNoMediaCanPlay(true);
        }
      }
      //order loop
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP) {
        stop();
        setStopped(false);
        if (mediaItemList && mediaItemIndex + 1 < mediaItemList.length) {
          playMediaByIndex(mediaItemIndex + 1);
        } else {
          playMediaByIndex(0);
        }
      }
      //shuffle
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE) {
        if (mediaItemList) {
          let randomIndex = Math.floor(Math.random() * mediaItemList.length);
          stop();
          setStopped(false);
          playMediaByIndex(randomIndex);
        }
      }
      //repeat
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT) {
        stop();
        setStopped(false);
        if (playNext) {
          if (mediaItemList && mediaItemIndex + 1 < mediaItemList.length) {
            playMediaByIndex(mediaItemIndex + 1);
          } else {
            onPlayerNoMediaCanPlay(true);
          }
        } else {
          playMediaByIndex(mediaItemIndex);
        }
      }
    }

    function playNextMedia(): void {
      playNextMediaInner(true);
    }

    function onPlayerNoMediaCanPlay(next: boolean) {
      playerManagerViewManager.onPlayerNoMediaCanPlay(next);
      playerManagerEventManager.onPlayerNoMediaCanPlay(next);
      callADPlayerViewMethod("onPlayerNoMediaCanPlay", next);
      callPlayerViewMethod("onPlayerNoMediaCanPlay", next);
      context.emit("onPlayerNoMediaCanPlay", next);
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerNoMediaCanPlay------------->>>>");
      }
    }

    function canPlayPreviousMedia(): boolean {
      //once
      if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE) {
        return false;
      }
      //order
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER) {
        return mediaItemIndex - 1 >= 0;
      }
      //repeat
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT) {
        return mediaItemIndex - 1 >= 0;
      }
      //
      else {
        return true;
      }
    }

    function playPreviousMedia(): void {
      //once
      if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE) {
        stop();
        setStopped(true);
        onPlayerNoMediaCanPlay(false);
      }
      //order
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER) {
        stop();
        setStopped(false);
        if (mediaItemList && mediaItemIndex - 1 >= 0) {
          playMediaByIndex(mediaItemIndex - 1);
        } else {
          onPlayerNoMediaCanPlay(false);
        }
      }
      //order loop
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP) {
        stop();
        setStopped(false);
        if (mediaItemList) {
          if (mediaItemIndex - 1 >= 0) {
            playMediaByIndex(mediaItemIndex - 1);
          } else {
            playMediaByIndex(mediaItemList.length - 1);
          }
        } else {
          onPlayerNoMediaCanPlay(false);
        }
      }
      //shuffle
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE) {
        if (mediaItemList) {
          let randomIndex = Math.floor(Math.random() * mediaItemList.length);
          stop();
          setStopped(false);
          playMediaByIndex(randomIndex);
        }
      }
      //repeat
      else if (playMediaListMode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT) {
        stop();
        setStopped(false);
        if (mediaItemList && mediaItemIndex - 1 >= 0) {
          playMediaByIndex(mediaItemIndex - 1);
        } else {
          onPlayerNoMediaCanPlay(false);
        }
      }
    }

    //----------------------------广告------------------------------------
    function onADPlayerInitialized(): void {
      context.emit("onADPlayerInitialized");
      callADPlayerViewMethod("onPlayerInitialized");
      playADMediaSourceList();
    }

    function onADPlayerPlayMediaSource(mediaSource: ESMediaSource): void {
      context.emit("onADPlayerPlayMediaSource", mediaSource);
      callADPlayerViewMethod("onPlayerPlayMediaSource", mediaSource);
    }

    function onADPlayerInterceptSuccess(result: ESPlayerInterceptResult): void {
      context.emit("onADPlayerInterceptSuccess", result);
      callADPlayerViewMethod("onPlayerInterceptSuccess", result);
    }

    function onADPlayerInterceptError(result: ESPlayerInterceptResult): void {
      context.emit("onADPlayerInterceptError", result);
      callADPlayerViewMethod("onPlayerInterceptError", result);
    }

    function onADPlayerNoMediaSourceCanPlay(next: boolean): void {
      context.emit("onADPlayerNoMediaSourceCanPlay", next);
      callADPlayerViewMethod("onPlayerNoMediaSourceCanPlay", next);

      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------onADPlayerNoMediaSourceCanPlay------------->>>>");
      }
      //
      if (
        adPlayerType === ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_PREVIOUS_ROLL_AD &&
        mediaItem
      ) {
        playMediaItem(mediaItem);
      }
      //
      else if (
        adPlayerType === ESBuiltinADPlayerType.ES_BUILTIN_PLAYER_TYPE_POST_ROLL_AD &&
        mediaItem
      ) {
        playNextMediaInner();
      }
    }

    function onADPlayerViewChanged(): void {
      context.emit("onADPlayerViewChanged");
      callADPlayerViewMethod("onPlayerViewChanged");
    }

    function onADPlayerSizeChanged(playerWidth: number, playerHeight: number): void {
      context.emit("onADPlayerSizeChanged", playerWidth, playerHeight);
      callADPlayerViewMethod("onPlayerSizeChanged", playerWidth, playerHeight);
    }

    function onADPlayerClickable(playerClickable: boolean): void {
      context.emit("onADPlayerClickable", playerClickable);
      callADPlayerViewMethod("onPlayerClickable", playerClickable);
    }

    function onADPlayerInfo(info: ESPlayerInfo): void {
      context.emit("onADPlayerInfo", info);
      callADPlayerViewMethod("onPlayerInfo", info);
    }

    function onADPlayerError(error: ESPlayerError): void {
      context.emit("onADPlayerError", error);
      callADPlayerViewMethod("onPlayerError", error);
    }

    function onADPlayerPreparing(): void {
      context.emit("onADPlayerPreparing");
      callADPlayerViewMethod("onPlayerPreparing");
    }

    function onADPlayerPrepared(): void {
      context.emit("onADPlayerPrepared");
      callADPlayerViewMethod("onPlayerPrepared");
    }

    function onADPlayerPlaying(): void {
      context.emit("onADPlayerPlaying");
      callADPlayerViewMethod("onPlayerPlaying");
    }

    function onADPlayerPaused(): void {
      context.emit("onADPlayerPaused");
      callADPlayerViewMethod("onPlayerPaused");
    }

    function onADPlayerResumed(): void {
      context.emit("onADPlayerResumed");
      callADPlayerViewMethod("onPlayerResumed");
    }

    function onADPlayerStopped(): void {
      context.emit("onADPlayerStopped");
      callADPlayerViewMethod("onPlayerStopped");
    }

    function onADPlayerCompleted(): void {
      context.emit("onADPlayerCompleted");
      callADPlayerViewMethod("onPlayerCompleted");
    }

    function onADPlayerBufferStart(): void {
      context.emit("onADPlayerBufferStart");
      callADPlayerViewMethod("onPlayerBufferStart");
    }

    function onADPlayerBufferEnd(): void {
      context.emit("onADPlayerBufferEnd");
      callADPlayerViewMethod("onPlayerBufferEnd");
    }

    //---------------------------------------------------------------------------------------------
    function onPlayerProgressChanged(progress): void {
      context.emit("onPlayerProgressChanged", progress);
      playerManagerViewManager.onPlayerProgressChanged(progress);
      playerManagerEventManager.onPlayerProgressChanged(progress);
      callPlayerViewMethod("onPlayerProgressChanged", progress);
    }

    function onPlayerDurationChanged(duration): void {
      context.emit("onPlayerDurationChanged", duration);
      playerManagerViewManager.onPlayerDurationChanged(duration);
      playerManagerEventManager.onPlayerDurationChanged(duration);
      callPlayerViewMethod("onPlayerDurationChanged", duration);
    }

    function onPlayerBufferPercentChanged(percent): void {
      context.emit("onPlayerBufferPercentChanged", percent);
      playerManagerViewManager.onPlayerBufferPercentChanged(percent);
      playerManagerEventManager.onPlayerBufferPercentChanged(percent);
      callPlayerViewMethod("onPlayerBufferPercentChanged", percent);
    }

    function onPlayerInitialized(): void {
      context.emit("onPlayerInitialized");
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerInitialized------------->>>>");
      }
      playerManagerViewManager.onPlayerInitialized(playerType);
      playerManagerEventManager.onPlayerInitialized(playerType);
      callPlayerViewMethod("onPlayerInitialized", playerType);

      //
      getPlayer()?.setDurationCallback(playerDurationCallback);
      getPlayer()?.setProgressCallback(playerProgressCallback);
      getPlayer()?.setBufferPercentCallback(playerBufferPercentCallback);
      //
      playMediaItemSourceList();
    }

    function onPlayerPlayMediaSource(mediaSource: ESMediaSource): void {
      context.emit("onPlayerPlayMediaSource", mediaSource);
      playerManagerViewManager.onPlayerPlayMediaSource(mediaSource);
      playerManagerEventManager.onPlayerPlayMediaSource(mediaSource);
      callPlayerViewMethod("onPlayerPlayMediaSource", mediaSource);
    }

    function onPlayerPlayMediaSourceList(mediaSourceList: ESMediaSourceList): void {
      context.emit("onPlayerPlayMediaSourceList", mediaSourceList);
      playerManagerViewManager.onPlayerPlayMediaSourceList(mediaSourceList);
      playerManagerEventManager.onPlayerPlayMediaSourceList(mediaSourceList);
      callPlayerViewMethod("onPlayerPlayMediaSourceList", mediaSourceList);
    }

    function onPlayerInterceptSuccess(result: ESPlayerInterceptResult): void {
      context.emit("onPlayerInterceptSuccess", result);
      playerManagerViewManager.onPlayerInterceptSuccess(result);
      playerManagerEventManager.onPlayerInterceptSuccess(result);
      callPlayerViewMethod("onPlayerInterceptSuccess", result);
    }

    function onPlayerInterceptError(result: ESPlayerInterceptError): void {
      context.emit("onPlayerInterceptError", result);
      playerManagerViewManager.onPlayerInterceptError(result);
      playerManagerEventManager.onPlayerInterceptError(result);
      callPlayerViewMethod("onPlayerInterceptError", result);
    }

    function onPlayerNoMediaSourceCanPlay(next: boolean): void {
      context.emit("onPlayerNoMediaSourceCanPlay", next);
      playerManagerViewManager.onPlayerNoMediaSourceCanPlay(next);
      playerManagerEventManager.onPlayerNoMediaSourceCanPlay(next);
      callPlayerViewMethod("onPlayerNoMediaSourceCanPlay", next);
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerNoMediaSourceCanPlay------------->>>>");
      }
      if (isStopped() || !isEnabled()) {
        return;
      }
      //
      if (mediaItem?.postRollADList && mediaItem.postRollADList.support) {
        playPostRollAD(mediaItem);
      } else {
        playNextMediaInner();
      }
    }

    function onPlayerViewChanged(): void {
      context.emit("onPlayerViewChanged");
      playerManagerViewManager.onPlayerViewChanged();
      playerManagerEventManager.onPlayerViewChanged();
      callPlayerViewMethod("onPlayerViewChanged");
    }

    function onPlayerViewSizeChanged(playerWidth: number, playerHeight: number): void {
      context.emit("onPlayerViewSizeChanged", playerWidth, playerHeight);
      playerManagerViewManager.onPlayerViewSizeChanged(playerWidth, playerHeight);
      playerManagerEventManager.onPlayerViewSizeChanged(playerWidth, playerHeight);
      callPlayerViewMethod("onPlayerViewSizeChanged", playerWidth, playerHeight);
    }

    function onPlayerViewClickable(playerClickable: boolean): void {
      context.emit("onPlayerViewClickable", playerClickable);
      playerManagerViewManager.onPlayerViewClickable(playerClickable);
      playerManagerEventManager.onPlayerViewClickable(playerClickable);
      callPlayerViewMethod("onPlayerViewClickable", playerClickable);
    }

    function onPlayerInfo(info: ESPlayerInfo): void {
      context.emit("onPlayerInfo", info);
      playerManagerViewManager.onPlayerInfo(info);
      playerManagerEventManager.onPlayerInfo(info);
      callPlayerViewMethod("onPlayerInfo", info);
    }

    function onPlayerError(error: ESPlayerError): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerError------------->>>>", error);
      }
      context.emit("onPlayerError", error);
      playerManagerViewManager.onPlayerError(error);
      playerManagerEventManager.onPlayerError(error);
      callPlayerViewMethod("onPlayerError", error);
    }

    function onPlayerPreparing(): void {
      context.emit("onPlayerPreparing");
      playerManagerViewManager.onPlayerPreparing();
      playerManagerEventManager.onPlayerPreparing();
      callPlayerViewMethod("onPlayerPreparing");
    }

    function onPlayerPrepared(): void {
      context.emit("onPlayerPrepared");
      playerManagerViewManager.onPlayerPrepared();
      playerManagerEventManager.onPlayerPrepared();
      callPlayerViewMethod("onPlayerPrepared");
    }

    function onPlayerPlaying(): void {
      context.emit("onPlayerPlaying");
      playerManagerViewManager.onPlayerPlaying();
      playerManagerEventManager.onPlayerPlaying();
      callPlayerViewMethod("onPlayerPlaying");
    }

    function onPlayerPaused(): void {
      context.emit("onPlayerPaused");
      playerManagerViewManager.onPlayerPaused();
      playerManagerEventManager.onPlayerPaused();
      callPlayerViewMethod("onPlayerPaused");
    }

    function onPlayerResumed(): void {
      context.emit("onPlayerResumed");
      playerManagerViewManager.onPlayerResumed();
      playerManagerEventManager.onPlayerResumed();
      callPlayerViewMethod("onPlayerResumed");
    }

    function onPlayerStopped(): void {
      context.emit("onPlayerStopped");
      playerManagerViewManager.onPlayerStopped();
      playerManagerEventManager.onPlayerStopped();
      callPlayerViewMethod("onPlayerStopped");
    }

    function onPlayerCompleted(): void {
      context.emit("onPlayerCompleted");
      playerManagerViewManager.onPlayerCompleted();
      playerManagerEventManager.onPlayerCompleted();
      callPlayerViewMethod("onPlayerCompleted");
    }

    function onPlayerControlled(options: ESPlayerControlOptions): void {
      context.emit("onPlayerControlled", options);
      playerManagerViewManager.onPlayerControlled(options);
      playerManagerEventManager.onPlayerControlled(options);
      callPlayerViewMethod("onPlayerControlled", options);
    }

    function onPlayerBufferStart(): void {
      context.emit("onPlayerBufferStart");
      playerManagerViewManager.onPlayerBufferStart();
      playerManagerEventManager.onPlayerBufferStart();
      callPlayerViewMethod("onPlayerBufferStart");
    }

    function onPlayerBufferEnd(): void {
      context.emit("onPlayerBufferEnd");
      playerManagerViewManager.onPlayerBufferEnd();
      playerManagerEventManager.onPlayerBufferEnd();
      callPlayerViewMethod("onPlayerBufferEnd");
    }

    function onPlayerSeekStart(): void {
      context.emit("onPlayerSeekStart");
      playerManagerViewManager.onPlayerSeekStart();
      playerManagerEventManager.onPlayerSeekStart();
      callPlayerViewMethod("onPlayerSeekStart");
    }

    function onPlayerSeekCompleted(): void {
      context.emit("onPlayerSeekCompleted");
      playerManagerViewManager.onPlayerSeekCompleted();
      playerManagerEventManager.onPlayerSeekCompleted();
      callPlayerViewMethod("onPlayerSeekCompleted");
    }

    //--------------------------------------------------------------------

    function setVolume(volume: number): void {
      getPlayer()?.setVolume(volume);
      volumeManager.setLeftVolume(volume);
      volumeManager.setRightVolume(volume);
    }

    function getVolume(): void {
      getPlayer()?.getVolume();
    }

    function setLeftVolume(leftVolume: number): void {
      getPlayer()?.setLeftVolume(leftVolume);
      volumeManager.setLeftVolume(leftVolume);
    }

    function getLeftVolume(): void {
      getPlayer()?.getLeftVolume();
    }

    function onPlayerLeftVolumeChanged(volume: number): void {
      context.emit("onPlayerLeftVolumeChanged", volume);
      playerManagerViewManager.onPlayerLeftVolumeChanged(volume);
      playerManagerEventManager.onPlayerLeftVolumeChanged(volume);
      callPlayerViewMethod("onPlayerLeftVolumeChanged", volume);
    }

    function getRightVolume(): void {
      getPlayer()?.getRightVolume();
    }

    function setRightVolume(rightVolume: number): void {
      getPlayer()?.setRightVolume(rightVolume);
      volumeManager.setRightVolume(rightVolume);
    }

    function onPlayerRightVolumeChanged(volume: number): void {
      context.emit("onPlayerRightVolumeChanged", volume);
      playerManagerViewManager.onPlayerRightVolumeChanged(volume);
      playerManagerEventManager.onPlayerRightVolumeChanged(volume);
      callPlayerViewMethod("onPlayerRightVolumeChanged", volume);
    }

    function onPlayerVolumeChanged(leftVolume: number, rightVolume: number): void {
      context.emit("onPlayerVolumeChanged", leftVolume, rightVolume);
      playerManagerViewManager.onPlayerVolumeChanged(leftVolume, rightVolume);
      playerManagerEventManager.onPlayerVolumeChanged(leftVolume, rightVolume);
      callPlayerViewMethod("onPlayerVolumeChanged", leftVolume, rightVolume);
    }

    //--------------------------------------------------------------------
    function setDefinition(definition: ESPlayerDefinition): void {
      getPlayer()?.setDefinition(definition);
      definitionManager.setDefinition(definition);
    }

    function onPlayerDefinitionListChanged(definitionList: Array<ESPlayerDefinition>): void {
      context.emit("onPlayerDefinitionListChanged", definitionList);
      playerManagerViewManager.onPlayerDefinitionListChanged(definitionList);
      playerManagerEventManager.onPlayerDefinitionListChanged(definitionList);
      callPlayerViewMethod("onPlayerDefinitionListChanged", definitionList);
    }

    function onPlayerDefinitionChanged(definition: ESPlayerDefinition): void {
      context.emit("onPlayerDefinitionChanged", definition);
      playerManagerViewManager.onPlayerDefinitionChanged(definition);
      playerManagerEventManager.onPlayerDefinitionChanged(definition);
      callPlayerViewMethod("onPlayerDefinitionChanged", definition);
    }

    //--------------------------------------------------------------------

    function setCache(cache: ESPlayerCache): void {
      getPlayer()?.setCache(cache);
      playerCacheManager.setCache(cache);
    }

    function setM3U8DefaultDefinition(id: number): void {
      getPlayer()?.setM3U8DefaultDefinition(id);
    }

    function getM3U8DefinitionInfo(): Promise<Array<M3U8DefinitionInfo>> {
      const player = getPlayer();
      if (!player) return Promise.resolve([]);
      else return player.getM3U8DefinitionInfo();
    }

    function setM3U8Definition(id: number): void {
      getPlayer()?.setM3U8Definition(id);
    }

    //------------------------------轨道相关--------------------------------------
    function getTrackInfo(sysType: number = 1): Promise<Array<ESPlayerTrackInfo>> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve([]);
      } else return player.getTrackInfo(sysType);
    }

    function getSelectTrack(trackType: number): Promise<number> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(-1);
      } else return player.getSelectTrack(trackType);
    }

    function selectTrack(index: number): void {
      getPlayer()?.selectTrack(index);
    }

    function deselectTrack(index: number): void {
      getPlayer()?.deselectTrack(index);
    }

    //------------------------------获取视频信息--------------------------------------
    function getTcpSpeed(): Promise<string> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve("0");
      } else return player.getTcpSpeed();
    }

    function getBitRate(): Promise<string> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve("0");
      } else return player.getBitRate();
    }

    function getTcpSpeed2(): Promise<string> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve("0");
      } else return player.getTcpSpeed2();
    }

    function getBitRate2(): Promise<string> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve("0");
      } else return player.getBitRate2();
    }

    function getMediaMeta(): Promise<ESPlayerMediaMeta | null> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(null);
      } else return player.getMediaMeta();
    }

    function getCdnInfo(): Promise<ESPlayerCDNInfo | null> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(null);
      } else return player.getCdnInfo();
    }

    function getVideoDecoder(): Promise<string> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve("");
      } else return player.getVideoDecoder();
    }

    function getDropFrameRate(): Promise<string> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve("0");
      } else return player.getDropFrameRate();
    }
    function getVideoDecodeFramesPerSecond(): Promise<string> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve("0");
      } else return player.getVideoDecodeFramesPerSecond();
    }
    function getVideoOutputFramesPerSecond(): Promise<string> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve("0");
      } else return player.getVideoOutputFramesPerSecond();
    }
    function getAudioCachedDuration(): Promise<number> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(0);
      } else return player.getAudioCachedDuration();
    }
    function getVideoCachedDuration(): Promise<number> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(0);
      } else return player.getVideoCachedDuration();
    }

    function getAudioCachedBytes(): Promise<number> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(0);
      } else return player.getAudioCachedBytes();
    }
    function getVideoCachedBytes(): Promise<number> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(0);
      } else return player.getVideoCachedBytes();
    }
    function getVideoCachedPackets(): Promise<number> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(0);
      } else return player.getVideoCachedPackets();
    }
    function getAudioCachedPackets(): Promise<number> {
      let player = getPlayer();
      if (!player) {
        return Promise.resolve(0);
      } else return player.getAudioCachedPackets();
    }

    //--------------------------------------------------------------------
    function setDecode(decode: ESPlayerDecode): void {
      getPlayer()?.setDecode(decode);
      decodeManager.setDecode(decode);
    }

    function onPlayerDecodeListChanged(decodeList: Array<ESPlayerDecode>): void {
      context.emit("onPlayerDecodeListChanged", decodeList);
      playerManagerViewManager.onPlayerDecodeListChanged(decodeList);
      playerManagerEventManager.onPlayerDecodeListChanged(decodeList);
      callPlayerViewMethod("onPlayerDecodeListChanged", decodeList);
    }

    function onPlayerDecodeChanged(decode: ESPlayerDecode): void {
      context.emit("onPlayerDecodeChanged", decode);
      playerManagerViewManager.onPlayerDecodeChanged(decode);
      playerManagerEventManager.onPlayerDecodeChanged(decode);
      callPlayerViewMethod("onPlayerDecodeChanged", decode);
    }

    //--------------------------------------------------------------------
    function setPlayRate(playRate: ESPlayerRate): void {
      getPlayer()?.setPlayRate(playRate);
      playRateManager.setPlayRate(playRate);
    }

    function onPlayerPlayRateListChanged(rateList: Array<ESPlayerRate>): void {
      context.emit("onPlayerPlayRateListChanged", rateList);
      playerManagerViewManager.onPlayerPlayRateListChanged(rateList);
      playerManagerEventManager.onPlayerPlayRateListChanged(rateList);
      callPlayerViewMethod("onPlayerPlayRateListChanged", rateList);
    }

    function onPlayerPlayRateChanged(rate: ESPlayerRate): void {
      context.emit("onPlayerPlayRateChanged", rate);
      playerManagerViewManager.onPlayerPlayRateChanged(rate);
      playerManagerEventManager.onPlayerPlayRateChanged(rate);
      callPlayerViewMethod("onPlayerPlayRateChanged", rate);
    }

    //----------------------------渲染模式----------------------------------------
    function setRender(value: ESPlayerRender): void {
      getPlayer()?.setRender(value);
      renderManager.setRender(value);
    }

    function onPlayerRenderListChanged(renderList: Array<ESPlayerRender>): void {
      context.emit("onPlayerRenderListChanged", renderList);
      playerManagerViewManager.onPlayerRenderListChanged(renderList);
      playerManagerEventManager.onPlayerRenderListChanged(renderList);
    }

    function onPlayerRenderChanged(render: ESPlayerRender): void {
      context.emit("onPlayerRenderChanged", render);
      playerManagerViewManager.onPlayerRenderChanged(render);
      playerManagerEventManager.onPlayerRenderChanged(render);
    }

    //-----------------------------画面比例---------------------------------------
    function setAspectRatio(aspectRatio: ESPlayerAspectRatio): void {
      getPlayer()?.setAspectRatio(aspectRatio);
      aspectRatioManager.setAspectRatio(aspectRatio);
    }

    function onPlayerAspectRatioListChanged(aspectRatioList: Array<ESPlayerAspectRatio>): void {
      context.emit("onPlayerAspectRatioListChanged", aspectRatioList);
      playerManagerViewManager.onPlayerAspectRatioListChanged(aspectRatioList);
      playerManagerEventManager.onPlayerAspectRatioListChanged(aspectRatioList);
      callPlayerViewMethod("onPlayerAspectRatioListChanged", aspectRatioList);
    }

    function onPlayerAspectRatioChanged(aspectRatio: ESPlayerAspectRatio): void {
      context.emit("onPlayerAspectRatioChanged", aspectRatio);
      playerManagerViewManager.onPlayerAspectRatioChanged(aspectRatio);
      playerManagerEventManager.onPlayerAspectRatioChanged(aspectRatio);
      callPlayerViewMethod("onPlayerAspectRatioChanged", aspectRatio);
    }

    //----------------------------播放模式----------------------------------------
    function setPlayMediaListMode(playMode: ESPlayerPlayMode): void {
      playMediaListMode = playMode;
      playModeManager.setPlayMode(playMode);
      onPlayerPlayMediaListModeChanged(playMode);
    }

    function onPlayerPlayMediaListModeListChanged(playModeList: Array<ESPlayerPlayMode>): void {
      context.emit("onPlayerPlayMediaListModeListChanged", playModeList);
      playerManagerViewManager.onPlayerPlayMediaListModeListChanged(playModeList);
      playerManagerEventManager.onPlayerPlayMediaListModeListChanged(playModeList);
      callPlayerViewMethod("onPlayerPlayMediaListModeListChanged", playModeList);
    }

    function onPlayerPlayMediaListModeChanged(playMode: ESPlayerPlayMode): void {
      context.emit("onPlayerPlayMediaListModeChanged", playMode);
      playerManagerViewManager.onPlayerPlayMediaListModeChanged(playMode);
      playerManagerEventManager.onPlayerPlayMediaListModeChanged(playMode);
      callPlayerViewMethod("onPlayerPlayMediaListModeChanged", playMode);
    }

    //----------------------------地址列表播放模式----------------------------------------
    function setPlayMode(playMode: ESPlayerPlayMode): void {
      getPlayer()?.setPlayMode(playMode);
    }

    function onPlayerPlayMediaSourceListModeListChanged(
      playModeList: Array<ESPlayerPlayMode>,
    ): void {
      context.emit("onPlayerPlayMediaSourceListModeListChanged", playModeList);
      playerManagerViewManager.onPlayerPlayMediaSourceListModeListChanged(playModeList);
      playerManagerEventManager.onPlayerPlayMediaSourceListModeListChanged(playModeList);
      callPlayerViewMethod("onPlayerPlayMediaSourceListModeListChanged", playModeList);
    }

    function onPlayerPlayMediaSourceListModeChanged(playMode: ESPlayerPlayMode): void {
      context.emit("onPlayerPlayMediaSourceListModeChanged", playMode);
      playerManagerViewManager.onPlayerPlayMediaSourceListModeChanged(playMode);
      playerManagerEventManager.onPlayerPlayMediaSourceListModeChanged(playMode);
      callPlayerViewMethod("onPlayerPlayMediaSourceListModeChanged", playMode);
    }

    //----------------------------------------------------------------
    function getPlayer(): ESIPlayer | null {
      return player;
    }

    function start(progress: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------start---------->>>", progress);
      }
      getPlayer()?.start(0);
    }

    function pause(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------pause---------->>>");
      }
      getPlayer()?.pause();
    }

    function resume(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------resume---------->>>");
      }
      setStopped(false);
      //
      if (getPlayer()) {
        try {
          //start position
          if (mediaItem && mediaItem.position && mediaItem.mediaSourceList) {
            mediaItem.mediaSourceList.position = mediaItem.position;
          }
        } catch (e) {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            log.e(TAG, "-----------resume---position---error---->>>", e);
          }
        }
        getPlayer()!.resume();
      }
      //
      else {
        playMediaByIndex(mediaItemIndex);
      }
    }

    function stop(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------stop---------->>>");
      }
      getPlayer()?.stop();
      setStopped(true);
    }

    function release(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------release---------->>>");
      }
      getPlayer()?.release();

      context.emit("onPlayerRelease");
      playerManagerViewManager.onPlayerRelease();
      playerManagerEventManager.onPlayerRelease();
      callPlayerViewMethod("onPlayerRelease");
    }

    function reset(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------reset---------->>>");
      }
      getPlayer()?.reset();
      currentPosition = 0;
      duration = 0;
      mediaItemList.clear();
      mediaItemIndex = -1;
      mediaItem = null;

      context.emit("onPlayerReset");
      playerManagerViewManager.onPlayerReset();
      playerManagerEventManager.onPlayerReset();
      callPlayerViewMethod("onPlayerReset");
    }

    function control(options: ESPlayerControlOptions): void {
      try {
        getPlayer()?.control(options);
      } catch (e) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "The method control does not exist!");
        }
      }
    }

    function seekTo(progress: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------seekTo---------->>>", progress);
      }
      currentPosition = progress;
      getPlayer()?.seekTo(progress);
    }

    function setStopped(stopped: boolean): void {
      isStopState = stopped;
    }

    function isStopped(): boolean {
      return isStopState;
    }

    function setEnabled(enabled: boolean): void {
      isEnableState = enabled;
    }

    function isEnabled(): boolean {
      return isEnableState;
    }

    function getDuration(): void {
      getPlayer()?.getDuration();
    }

    function getCurrentPosition(): void {
      getPlayer()?.getCurrentPosition();
    }

    const setProgressCallback = (callback: ESPlayerProgressCallback): void => {
      progressCallback = callback;
    };

    const setDurationCallback = (callback: ESPlayerDurationCallback): void => {
      durationCallback = callback;
    };

    const setBufferPercentCallback = (callback: ESPlayerBufferPercentCallback): void => {
      bufferPercentCallback = callback;
    };

    function playerProgressCallback(progress: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------playerProgressCallback---------->>>" + progress);
      }
      onPlayerProgressChanged(progress);

      if (progressCallback) {
        progressCallback(progress);
      }
    }

    function playerDurationCallback(duration: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------playerDurationCallback---------->>>" + duration);
      }
      onPlayerDurationChanged(duration);

      if (durationCallback) {
        durationCallback(duration);
      }
    }

    function playerBufferPercentCallback(bufferPercent: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------playerBufferPercentCallback---------->>>" + bufferPercent);
      }

      // onPlayerBufferPercentChanged(bufferPercent);

      if (bufferPercentCallback) {
        bufferPercentCallback(bufferPercent);
      }
    }

    function invalidate() {
      getPlayer()?.invalidate();
    }

    //----------------------------------------------------------------
    function addMediaToIndex(beginIndex: number, itemList: Array<ESMediaItem>): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----------addMediaToIndex-----start----->>>", beginIndex, itemList);
      }
      if (itemList.length <= 0 || beginIndex < 0) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.e(TAG, "addMediaToIndex error: list empty");
        }
        return;
      }
      mediaItemList.splice(beginIndex, 0, itemList);
    }

    function addMediaToLast(itemList: Array<ESMediaItem>): void {
      if (itemList.length <= 0) {
        return;
      }
      mediaItemList.push(itemList);
    }

    function addMediaToFirst(itemList: Array<ESMediaItem>): void {
      addMediaToIndex(0, itemList);
    }

    function replaceMedia(beginIndex: number, itemList: Array<ESMediaItem>): void {
      if (itemList.length <= 0 || beginIndex < 0) {
        return;
      }
      const length = itemList.length;
      mediaItemList!.splice(beginIndex, length, itemList);
    }

    function getMediaList(): SparseArray<ESMediaItem> | null {
      return mediaItemList;
    }

    function resetMediaList(): void {
      mediaItemList.clear();
      mediaItemIndex = -1;
      mediaItem = null;
    }

    function getMedia(index: number): ESMediaItem | null {
      return mediaItemList.get(index);
    }

    function getPlayingMediaIndex(): number {
      return mediaItemIndex;
    }

    function getPlayingMedia(): ESMediaItem | null {
      return mediaItem;
    }

    function getWindowType(): ESPlayerWindowType {
      return playerWindowType;
    }

    function setFloatWindow(): void {
      setWindowType(ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT);
    }

    function setSmallWindow(): void {
      setWindowType(ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL);
    }

    function setFullWindow(): void {
      setWindowType(ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL);
    }

    function setWindowType(windowType: ESPlayerWindowType): void {
      initPlayerView(windowType);
    }

    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
      try {
        context.emit("onPlayerWindowTypeChanged", windowType);
        playerManagerViewManager.onPlayerWindowTypeChanged(windowType);
        playerManagerEventManager.onPlayerWindowTypeChanged(windowType);
        callADPlayerViewMethod("onPlayerWindowTypeChanged", windowType);
        callPlayerViewMethod("onPlayerWindowTypeChanged", windowType);
      } catch (e) {}
    }

    function setSize(width: number, height: number): void {
      playerWidth.value = width;
      playerHeight.value = height;
      onPlayerWindowSizeChanged(playerWidth.value, playerHeight.value);
      getPlayer()?.setSize(playerWidth.value, playerHeight.value);
    }

    function setSizeDimension(width: number, height: number, quickUpdate: boolean): void {
      playerWidth.value = width;
      playerHeight.value = height;
      onPlayerWindowSizeChanged(playerWidth.value, playerHeight.value);
      getPlayer()?.setPlayerDimension(
        width,
        height,
        props.fullWindowWidth,
        props.fullWindowHeight,
        false,
        quickUpdate,
      );
    }

    function initPlayerView(windowType: ESPlayerWindowType): void {
      playerWindowType = windowType;
      switch (playerWindowType) {
        case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL:
          playerWidth.value = props.smallWindowWidth;
          playerHeight.value = props.smallWindowHeight;
          break;
        case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL:
          playerWidth.value = props.fullWindowWidth;
          playerHeight.value = props.fullWindowHeight;
          break;
        case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT:
          playerWidth.value = props.floatWindowWidth;
          playerHeight.value = props.floatWindowHeight;
          break;
      }
      onPlayerWindowSizeChanged(playerWidth.value, playerHeight.value);
      onPlayerWindowTypeChanged(windowType);
      //
      getPlayer()?.setSize(playerWidth.value, playerHeight.value);
    }

    function onPlayerWindowSizeChanged(playerWidth: number, playerHeight: number): void {
      context.emit("onPlayerWindowSizeChanged", playerWidth, playerHeight);
      playerManagerViewManager.onPlayerWindowSizeChanged(playerWidth, playerHeight);
      playerManagerEventManager.onPlayerWindowSizeChanged(playerWidth, playerHeight);
      callADPlayerViewMethod("onPlayerWindowSizeChanged", playerWidth, playerHeight);
      callPlayerViewMethod("onPlayerWindowSizeChanged", playerWidth, playerHeight);
    }

    //----------------------------------------------------------------------

    function playMediaSourceList(mediaSourceList: ESMediaSourceList): void {
      getPlayer()?.playMediaSourceList(mediaSourceList);
    }

    function playMediaSourceByIndex(index: number): void {
      getPlayer()?.playMediaSourceByIndex(index);
    }

    function playMediaSourceById(id: string): void {
      getPlayer()?.playMediaSourceById(id);
    }

    function playMediaSource(mediaSource: ESMediaSource): void {
      getPlayer()?.playMediaSource(mediaSource);
    }

    function playNextMediaSource(): void {
      getPlayer()?.playNextMediaSource();
    }

    function playPreviousMediaSource(): void {
      getPlayer()?.playPreviousMediaSource();
    }

    function getMediaSourceList(): Array<ESMediaSource> | null {
      if (getPlayer()) {
        return getPlayer()!.getMediaSourceList();
      }
      return null;
    }

    function getMediaSource(index: number): ESMediaSource | null {
      if (getPlayer()) {
        return getPlayer()!.getMediaSource(index);
      }
      return null;
    }

    function getPlayingMediaSourceIndex(): number {
      if (getPlayer()) {
        return getPlayer()!.getPlayingMediaSourceIndex();
      }
      return -1;
    }

    function getPlayingMediaSourceList(): ESMediaSourceList | null {
      if (getPlayer()) {
        return getPlayer() && getPlayer()!.getPlayingMediaSourceList();
      }
      return null;
    }

    function getPlayingMediaSource(): ESMediaSource | null {
      if (getPlayer()) {
        return getPlayer()!.getPlayingMediaSource();
      }
      return null;
    }

    //----------------------------------------------------------------------

    function onKeyDown(keyEvent: ESKeyEvent): boolean {
      return callPlayerViewReturnMethod("onKeyDown", keyEvent);
    }

    function onKeyUp(keyEvent: ESKeyEvent): boolean {
      return callPlayerViewReturnMethod("onKeyUp", keyEvent);
    }

    function onBackPressed(): boolean {
      return callPlayerViewReturnMethod("onBackPressed");
    }

    return {
      visible,
      playerWidth,
      playerHeight,
      initPlayerComponentRef,
      initADPlayerComponentRef,
      initPlayerViewComponentRef,
      initADPlayerViewComponentRef,
      //
      getPlayer,
      //
      playMediaList,
      playMediaByIndex,
      playMediaById,
      playMedia,
      //
      addMediaToIndex,
      addMediaToLast,
      addMediaToFirst,
      replaceMedia,
      //
      canPlayNextMedia,
      playNextMedia,
      canPlayPreviousMedia,
      playPreviousMedia,
      //
      getMediaList,
      resetMediaList,
      getMedia,
      getPlayingMediaIndex,
      getPlayingMedia,
      //
      getWindowType,
      setFloatWindow,
      setSmallWindow,
      setFullWindow,
      setWindowType,
      //
      onKeyDown,
      onKeyUp,
      onBackPressed,
      //
      setVisible,
      initialize,
      isInitialized,
      //
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
      setSize,
      setSizeDimension,
      setPlayRate,
      setDefinition,
      setCache,
      setDecode,
      setRender,
      setAspectRatio,
      setPlayMediaListMode,
      setPlayMode,
      getLeftVolume,
      getRightVolume,
      getVolume,
      setVolume,
      setLeftVolume,
      setRightVolume,
      invalidate,
      setStopped,
      setEnabled,
      //
      setProgressCallback,
      setDurationCallback,
      setBufferPercentCallback,
      //
      playMediaSourceList,
      playMediaSourceByIndex,
      playMediaSourceById,
      playMediaSource,
      playNextMediaSource,
      playPreviousMediaSource,
      getMediaSourceList,
      getMediaSource,
      getPlayingMediaSourceIndex,
      getPlayingMediaSourceList,
      getPlayingMediaSource,
      //
      getPlayerView,
      //
      onPlayerError,
      onPlayerProgressChanged,
      onPlayerDurationChanged,
      onPlayerBufferPercentChanged,
      onPlayerInitialized,
      onPlayerInfo,
      onPlayerPlayMediaSource,
      onPlayerPlayMediaSourceList,
      onPlayerInterceptSuccess,
      onPlayerInterceptError,
      onPlayerNoMediaSourceCanPlay,
      onPlayerViewChanged,
      onPlayerViewSizeChanged,
      onPlayerViewClickable,
      onPlayerPreparing,
      onPlayerPrepared,
      onPlayerPlaying,
      onPlayerPaused,
      onPlayerResumed,
      onPlayerStopped,
      onPlayerCompleted,
      onPlayerControlled,
      onPlayerBufferStart,
      onPlayerBufferEnd,
      onPlayerSeekStart,
      onPlayerSeekCompleted,
      onPlayerLeftVolumeChanged,
      onPlayerRightVolumeChanged,
      onPlayerVolumeChanged,
      onPlayerDefinitionListChanged,
      onPlayerDefinitionChanged,
      onPlayerDecodeListChanged,
      onPlayerDecodeChanged,
      onPlayerPlayRateListChanged,
      onPlayerPlayRateChanged,
      onPlayerAspectRatioListChanged,
      onPlayerAspectRatioChanged,
      onPlayerPlayMediaListModeListChanged,
      onPlayerPlayMediaListModeChanged,
      onPlayerPlayMediaSourceListModeListChanged,
      onPlayerPlayMediaSourceListModeChanged,
      onPlayerRenderListChanged,
      onPlayerRenderChanged,
      //
      playPreviousRollAD,
      playMiddleRollAD,
      playPostRollAD,
      //
      onADPlayerInitialized,
      onADPlayerPlayMediaSource,
      onADPlayerInterceptSuccess,
      onADPlayerInterceptError,
      onADPlayerNoMediaSourceCanPlay,
      onADPlayerViewChanged,
      onADPlayerSizeChanged,
      onADPlayerClickable,
      onADPlayerInfo,
      onADPlayerError,
      onADPlayerPreparing,
      onADPlayerPrepared,
      onADPlayerPlaying,
      onADPlayerPaused,
      onADPlayerResumed,
      onADPlayerStopped,
      onADPlayerCompleted,
      onADPlayerBufferStart,
      onADPlayerBufferEnd,
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
.player-manager-root-css {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.player-manager-player-css {
  left: 0;
  top: 0;
  position: absolute;
}

.player-manager-player-view-css {
  left: 0;
  top: 0;
  position: absolute;
}
</style>
