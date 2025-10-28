<template>
  <div
    class="es-sound-pool-player-root-css"
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
  ESPlayerState,
  useESPlayerEventManager,
  useESPlayerInterceptorManager,
  useESPlayerLog,
  useESPlayerPlayModeManager,
  useESPlayerRateManager,
  useESPlayerViewManager,
  useESPlayerVolumeManager,
} from "@extscreen/es3-player";

import { createESSoundPoolPlayerModule } from "./module/ESSoundPoolPlayerModule";
import { EventBus } from "@extscreen/es3-vue";
import { ESSoundPoolUsage } from "./core/ESSoundPoolUsage";
import { ESSoundPoolContentType } from "./core/ESSoundPoolContentType";
import { ESSoundPoolStreamType } from "./core/ESSoundPoolStreamType";
import { ESDownloadInfo, ESFile, ESVersion, useES, useESDownload } from "@extscreen/es3-core";

const TAG = "ESSoundPoolPlayer";

export default defineComponent({
  name: "es-sound-pool-player",
  emits: [
    "onPlayerInitialized",
    "onPlayerError",
    "onPlayerNoMediaSourceCanPlay",
    "onPlayerPlayMediaSourceList",
    "onPlayerPlayMediaSource",
    "onPlayerInterceptSuccess",
    "onPlayerInterceptError",
    "onPlayerPreparing",
    "onPlayerPrepared",
    "onPlayerPlaying",
    "onPlayerPaused",
    "onPlayerResumed",
    "onPlayerStopped",
    "onPlayerCompleted",
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
    "onPlayerInfo",
  ],
  props: {
    playerType: {
      type: Number,
      default: 8,
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
  type: 8,
  setup(props, context) {
    const playerRef = ref<ESIPlayer>();
    const log = useESPlayerLog();
    const audioPlayer = createESSoundPoolPlayerModule();
    const playerRateManager = useESPlayerRateManager();
    const interceptorManager = useESPlayerInterceptorManager();
    const playerEventManager = useESPlayerEventManager();
    const playerViewManager = useESPlayerViewManager();
    const volumeManager = useESPlayerVolumeManager();
    const esManager = useES();
    const downloadManager = useESDownload();
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
    let cacheDir = "/audio";
    //
    let progressCallback: ESPlayerProgressCallback;
    let durationCallback: ESPlayerDurationCallback;

    onMounted(() => {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "--------onMounted------>>>>>");
      }
      EventBus.$on("onESSoundPoolLoadComplete", onESSoundPoolLoadComplete);
      EventBus.$on("onESSoundPoolLoadError", onESSoundPoolLoadError);
    });

    onUnmounted(() => {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "--------onUnmounted------>>>>>");
      }
      EventBus.$off("onESSoundPoolLoadComplete", onESSoundPoolLoadComplete);
      EventBus.$off("onESSoundPoolLoadError", onESSoundPoolLoadError);
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

    function getComponentInfo() {}

    function initComponent(...params: Array<any>): void {
      audioPlayer.initSoundPool(
        ESSoundPoolUsage.ES_SOUND_POOL_USAGE_MEDIA,
        ESSoundPoolContentType.ES_SOUND_POOL_CONTENT_TYPE_MUSIC,
        100,
        ESSoundPoolStreamType.ES_SOUND_POOL_STREAM_MUSIC,
        true,
      );
    }

    //
    function initialize(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "--------initializePlayer------>>>>>");
      }
      initComponent();
      onPlayerInitializeSuccess();
    }

    function isInitialized(): boolean {
      return playerRef.value != undefined;
    }

    function unInitialize(): void {
      playerInitialized.value = false;
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

    //----------------------------入口--------------------------------
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
      let promise = Promise.resolve(result);

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
      list.map((interceptor) => {
        promise = promise.then((result: ESPlayerInterceptResult) => {
          try {
            if (result.result) {
              Object.assign(mediaSourceList, result.result);
            }
          } catch (e) {}
          return interceptor.intercept(mediaSourceList);
        });
      });
      promise.then(
        (result) => {
          try {
            if (result.result) {
              Object.assign(mediaSourceList, result.result);
            }
          } catch (e) {}

          onPlayerInterceptSuccess(result);

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
            playMediaSourceByIndex(mediaSourceIndex);
          }
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
    }

    function playMediaSourceByIndex(index: number): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-----playMediaSourceByIndex----->>>", index);
      }
      if (mediaSourceList.list.length <= 0) {
        return;
      }
      if (index < 0 || index > mediaSourceList.list.length) {
        return;
      }
      mediaSourceIndex = index;
      mediaSource = mediaSourceList.list[index];
      try {
        if (mediaSource && !mediaSource.metadata) {
          mediaSource.metadata = {
            soundId: "",
          };
        }
      } catch (e) {}
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
      let promise = Promise.resolve(result);

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
      list.map((interceptor) => {
        promise = promise.then((result: ESPlayerInterceptResult) => {
          try {
            if (result.result) {
              Object.assign(mediaSource, result.result);
            }
          } catch (e) {}
          return interceptor.intercept(mediaSource);
        });
      });
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

    //---------------------------------------------------------
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
      if (mediaSource.uri.startsWith("http") || mediaSource.uri.startsWith("https")) {
        playNetworkFile(mediaSource);
      } else {
        playLocalFile(mediaSource.uri);
      }
    }

    function playNetworkLocalFile(path: string) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------playNetworkLocalFile------>>>", "path:" + path);
      }
      const file = new ESFile();
      file
        .newFile(path)
        .then((fileId) => file.exists())
        .then((exists) => {
          if (exists) {
            const filePath = esManager.getESAppFilePath() + path;
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playNetworkLocalFile----file path-->>>", filePath);
            }
            return audioPlayer.load(filePath);
          } else {
            return Promise.reject("音频文件不存在！");
          }
        })
        .then(
          (id) => {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playNetworkLocalFile----load success-->>>id:", id);
            }
            if (mediaSource.metadata) {
              mediaSource.metadata!.soundId = id;
            } else {
              mediaSource.metadata = {
                soundId: id,
              };
            }
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(
                TAG,
                "------playNetworkLocalFile----load success-->>>mediaSource:",
                mediaSource,
              );
            }
          },
          (error) => {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playNetworkLocalFile----文件不存在-->>>");
            }
            onPlayerError({
              errorCode: -1,
              errorMessage: "播放音频错误：" + error,
            });
          },
        );
    }

    function playLocalFile(path: string) {
      const filePath = esManager.getESAppRuntimePath() + "/" + path;

      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(
          TAG,
          "------playLocalFile------>>>",
          "getESAppRuntimePath:" + esManager.getESAppRuntimePath(),
        );
        log.d(TAG, "------playLocalFile------>>>", "filePath:" + filePath);
      }

      const file = new ESFile();
      file
        .newAbsolutePathFile(filePath)
        .then((fileId) => file.exists())
        .then((exists) => {
          if (exists) {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playLocalFile----file path-->>>", filePath);
            }
            return audioPlayer.load(filePath);
          } else {
            return Promise.reject("音频文件不存在！");
          }
        })
        .then(
          (id) => {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "---1---playLocalFile----load success-->>>id:", id);
            }
            if (mediaSource.metadata) {
              mediaSource.metadata!.soundId = id;
            } else {
              mediaSource.metadata = {
                soundId: id,
              };
            }
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "----2--playLocalFile----load success-->>>id:", id);
            }
          },
          (error) => {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playLocalFile----文件不存在-->>>");
            }
            onPlayerError({
              errorCode: -1,
              errorMessage: "播放音频错误：" + error,
            });
          },
        );
    }

    // sampleId – the sample ID of the sound loaded.
    //   status – the status of the load operation (0 = success)
    // {"status":0,"sampleId":1}
    function onESSoundPoolLoadComplete(status) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(
          TAG,
          "------onESSoundPoolLoadComplete----->>>" +
            " status:" +
            JSON.stringify(status) +
            " mediaSource:" +
            JSON.stringify(mediaSource),
        );
      }

      if (
        !isStopped &&
        isEnabled &&
        status.status === 0 &&
        mediaSource &&
        mediaSource.metadata &&
        mediaSource.metadata!.soundId === status.sampleId
      ) {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "------onESSoundPoolLoadComplete----onPlayerPrepared-->>>");
        }
        onPlayerPrepared();
      } else {
        if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
          log.d(TAG, "------onESSoundPoolLoadComplete----数据不对-->>>");
        }
      }
    }

    function onESSoundPoolLoadError(error) {
      onPlayerError({
        errorCode: -1,
        errorMessage: "加载音频错误：" + error,
      });
    }

    //---------------------------------------------------------
    function playNetworkFile(mediaSource: ESMediaSource) {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------playNetworkFile------>>>");
      }
      if (esManager.getESSDKVersionCode() < ESVersion.ES_SDK_VERSION_22) {
        cacheDir = esManager.getESAppFilePath() + "/audio";
      }
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------playNetworkFile---cacheDir--->>>", cacheDir);
      }
      const downloadInfo = generateDownload(mediaSource);
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------playNetworkFile---downloadInfo->>>", downloadInfo);
      }
      let filePath = cacheDir + "/" + downloadInfo.fileName;
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------playNetworkFile---filePath->>>", filePath);
      }
      const file = new ESFile();
      file
        .newFile(filePath)
        .then(() => file.exists())
        .then((exists) => {
          if (exists) {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playNetworkFile---exists->>>", file.getPath());
            }
            return file.getPath();
          } else {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playNetworkFile--not---exists->>>");
            }
            return Promise.reject("file not exits!");
          }
        })
        .then(
          (path) => {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playNetworkFile---file--exits->>>", path);
            }
            downloadInfo.filePath = path;
            onMediaDownloadSuccess(downloadInfo);
          },
          (error) => {
            if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
              log.d(TAG, "------playNetworkFile---file not exits-->>>", error);
            }
            startDownload(downloadInfo);
          },
        );
    }

    function startDownload(downloadInfo: ESDownloadInfo): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------startDownload----->>>", downloadInfo);
      }
      let downloadListener = {
        onDownloadSuccess(download: ESDownloadInfo) {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            log.d(TAG, "------onDownloadSuccess----->>>", download);
          }
          downloadManager.removeListener(downloadListener);
          onMediaDownloadSuccess(download);
        },
        onDownloadError(download: ESDownloadInfo) {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            log.d(TAG, "------onDownloadError----->>>", download);
          }
          downloadManager.removeListener(downloadListener);
          onMediaDownloadError(download);
        },
        onDownloadInit(download: ESDownloadInfo) {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            log.d(TAG, "------onDownloadInit----->>>", download);
          }
        },
        onDownloadCancel(download: ESDownloadInfo) {},
        onDownloadProgress(download: ESDownloadInfo, downloadSize: number, totalSize: number) {},
        onDownloadStart(download: ESDownloadInfo) {},
        onDownloadStop(download: ESDownloadInfo) {},
      };
      downloadManager.initDownloadPath(cacheDir, 10000);
      downloadManager.addListener(downloadInfo, downloadListener);
      downloadManager.download(downloadInfo);
      downloadManager.start(downloadInfo);
    }

    function onMediaDownloadSuccess(download: ESDownloadInfo): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------onMediaDownloadSuccess----->>>", download);
      }
      if (download.filePath) {
        playNetworkLocalFile(cacheDir + "/" + download.fileName);
      } else {
        onMediaDownloadError(download);
      }
    }

    function onMediaDownloadError(download: ESDownloadInfo): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "------onMediaDownloadError----->>>", download);
      }
      onPlayerError({
        errorCode: -1,
        errorMessage: "音频文件不存在" + download,
      });
    }

    function generateDownload(mediaSource: ESMediaSource): ESDownloadInfo {
      const fileName = generateDownloadFileName(mediaSource.uri);
      return {
        id: 0,
        fileUrl: mediaSource.uri,
        fileName: fileName,
      };
    }

    function generateDownloadFileName(uri: string): string {
      let fileName = uri.substring(uri.lastIndexOf("/") + 1);
      if (!fileName) {
        fileName = uri;
      }
      return fileName;
    }

    //---------------------------------------------------------
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

    //----------------------------------------------------------
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
      if (!mediaSource || !mediaSource.metadata) {
        try {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            log.d(TAG, "------start----mediaSource--不合法->>>" + JSON.stringify(mediaSource));
          }
        } catch (e) {}
        return;
      }
      const soundId = mediaSource.metadata!.soundId;
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(
          TAG,
          "------start------->>>\n" +
            "soundId:" +
            soundId +
            "\n" +
            "leftVolume:" +
            volumeManager.getLeftVolume() +
            "\n" +
            "rightVolume:" +
            volumeManager.getRightVolume() +
            "\n" +
            "priority:" +
            "0" +
            "\n" +
            "loop:" +
            "0" +
            "\n" +
            "playRate:" +
            playerRateManager.getPlayRate(),
        );
      }
      audioPlayer
        .play(
          soundId,
          volumeManager.getLeftVolume(),
          volumeManager.getRightVolume(),
          0,
          0,
          playerRateManager.getPlayRate(),
        )
        .then(
          (streamId: number) => {
            mediaSource.metadata!.streamId = streamId;
            onPlayerPlaying();
          },
          (error) => {
            onPlayerError({
              errorCode: -1,
              errorMessage: "播放错误：" + error,
            });
          },
        );
    }

    function pause(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------pause------------->>>");
      }
      if (!mediaSource.metadata) {
        return;
      }
      const streamId = mediaSource.metadata!.streamId;
      if (streamId > 0) {
        audioPlayer.pause(streamId);
        onPlayerPaused();
      }
    }

    function resume(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------resume------------->>>");
      }
      if (!mediaSource.metadata) {
        return;
      }
      const streamId = mediaSource.metadata!.streamId;
      if (streamId > 0) {
        audioPlayer.resume(streamId);
        onPlayerResumed();
      }
    }

    function stop(): void {
      if (mediaSource && mediaSource.metadata && mediaSource.metadata.streamId > 0) {
        const streamId = mediaSource.metadata.streamId;
        if (streamId > 0) {
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            log.d(TAG, "-------------stop------------->>>");
          }
          audioPlayer.stop(streamId);
          if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
            log.d(TAG, "-------------unload------------->>>");
          }
          audioPlayer.unload(streamId);
          onPlayerStopped();
        }
      }
    }

    function release(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------release------------->>>");
      }
    }

    function reset(): void {
      if (log.isLoggable(ESPlayerLogLevel.DEBUG)) {
        log.d(TAG, "-------------reset------------->>>");
      }
      currentPosition = 0;
      duration = 0;
    }

    function control(options: ESPlayerControlOptions): void {}

    function seekTo(progress: number): void {}

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
      playerState = ESPlayerState.ES_PLAYER_STATE_ERROR;
      context.emit("onPlayerError", error);
      playerEventManager.onPlayerError(error);
      playerViewManager.onPlayerError(error);
      playNextMediaSource();
    }

    function onPlayerPreparing(): void {
      playerState = ESPlayerState.ES_PLAYER_STATE_PREPARING;
      context.emit("onPlayerPreparing");
      playerEventManager.onPlayerPreparing();
      playerViewManager.onPlayerPreparing();
    }

    function onPlayerPrepared(): void {
      playerState = ESPlayerState.ES_PLAYER_STATE_PREPARED;
      context.emit("onPlayerPrepared");
      playerEventManager.onPlayerPrepared();
      playerViewManager.onPlayerPrepared();

      //start
      if (!isStopped && isEnabled) {
        start(0);

        //volume
        let leftVolume = volumeManager.getLeftVolume();
        let rightVolume = volumeManager.getRightVolume();
        setLeftVolume(leftVolume);
        setRightVolume(rightVolume);
      }
    }

    function onPlayerPlaying(): void {
      playerState = ESPlayerState.ES_PLAYER_STATE_PLAYING;
      context.emit("onPlayerPlaying");
      playerEventManager.onPlayerPlaying();
      playerViewManager.onPlayerPlaying();
    }

    function onPlayerPaused(): void {
      playerState = ESPlayerState.ES_PLAYER_STATE_PAUSED;
      context.emit("onPlayerPaused");
      playerEventManager.onPlayerPaused();
      playerViewManager.onPlayerPaused();
    }

    function onPlayerResumed(): void {
      playerState = ESPlayerState.ES_PLAYER_STATE_RESUMED;
      context.emit("onPlayerResumed");
      playerEventManager.onPlayerResumed();
      playerViewManager.onPlayerResumed();
    }

    function onPlayerStopped(): void {
      playerState = ESPlayerState.ES_PLAYER_STATE_STOP;
      context.emit("onPlayerStopped");
      playerEventManager.onPlayerStopped();
      playerViewManager.onPlayerStopped();
    }

    function onPlayerCompleted(): void {
      playerState = ESPlayerState.ES_PLAYER_STATE_PLAYBACK_COMPLETED;
      context.emit("onPlayerCompleted");
      playerEventManager.onPlayerCompleted();
      playerViewManager.onPlayerCompleted();
      playNextMediaSource();
    }

    function getDuration(): void {}

    function getCurrentPosition(): void {}

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
      onPlayerVolumeChanged(volumeManager.getLeftVolume(), volumeManager.getRightVolume());
    }

    function getLeftVolume(): void {
      onPlayerLeftVolumeChanged(volumeManager.getLeftVolume());
    }

    function getRightVolume(): void {
      onPlayerRightVolumeChanged(volumeManager.getRightVolume());
    }

    function setLeftVolume(leftVolume): void {
      if (!mediaSource || !mediaSource.metadata) {
        return;
      }
      volumeManager.setLeftVolume(leftVolume);
      const streamId = mediaSource.metadata?.streamId ?? -1;
      if (streamId > 0) {
        audioPlayer.setVolume(streamId, leftVolume, volumeManager.getRightVolume());
      }
    }

    function setRightVolume(rightVolume): void {
      if (!mediaSource || !mediaSource.metadata) {
        return;
      }
      volumeManager.setRightVolume(rightVolume);
      const streamId = mediaSource.metadata?.streamId ?? -1;
      if (streamId > 0) {
        audioPlayer.setVolume(streamId, volumeManager.getLeftVolume(), rightVolume);
      }
    }

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
      setDecode,
      getPlayerDecode,
      getPlayerDecodeList,
      //
      setCache,
      //
      setVolume,
      getVolume,
      getLeftVolume,
      getRightVolume,
      setLeftVolume,
      setRightVolume,
      //
      setStopped,
      setEnabled,
      setProgressCallback,
      setDurationCallback,
      //
      setPlayMode,
      //
      setSize,
      invalidate,
      //
      onPlayerError,
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
      onPlayerInfo,
      //
      onESSoundPoolLoadComplete,
      onESSoundPoolLoadError,
      //
      onPlayerPlayMediaSourceListModeListChanged,
      onPlayerPlayMediaSourceListModeChanged,
    };
  },
});
</script>

<style scoped>
.es-sound-pool-player-root-css {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
