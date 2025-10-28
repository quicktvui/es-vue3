import { defineComponent, h, ref } from "vue";
import { ESApp, Native, registerElement } from "@extscreen/es3-vue";
import {
  ESMediaMetadata,
  ESPlayerCache,
  ESPlayerDurationCallback,
  ESPlayerOption,
  ESPlayerProgressCallback,
  ESPlayerBufferPercentCallback,
} from "@extscreen/es3-player";

/**
 * 播放器view
 */
function registerESVideoPlayerViewComponent(app: ESApp) {
  const videoViewComponent = {
    component: {
      name: "IJKPlayerComponent",
      processEventData(
        evtData,
        nativeEventParams: {
          playerStatus: number;
          playerWidth: number;
          playerHeight: number;
          errorCode: number;
          errorMessage: string;
          playerClickable: boolean;
          infoType: number;
          infoCode: number;
          infoMessage: string;
          leftVolume: number;
          rightVolume: number;
          position: number;
          decode: number;
          aspectRatioList: Array<number>;
          aspectRatio: number;
          playRateList: Array<string>;
          playRate: string;
          decodeList: Array<number>;
        },
      ) {
        const { handler: event, __evt: nativeEventName } = evtData;
        switch (nativeEventName) {
          case "onPlayerStatusChanged":
            event.playerState = nativeEventParams.playerStatus;
            event.playerWidth = nativeEventParams.playerWidth;
            event.playerHeight = nativeEventParams.playerHeight;
            event.errorCode = nativeEventParams.errorCode;
            event.errorMessage = nativeEventParams.errorMessage;
            event.playerClickable = nativeEventParams.playerClickable;
            break;
          case "onPlayerError":
            event.errorCode = nativeEventParams.errorCode;
            event.errorMessage = nativeEventParams.errorMessage;
            break;
          case "onPlayerInfo":
            event.infoType = nativeEventParams.infoType;
            event.infoCode = nativeEventParams.infoCode;
            event.infoMessage = nativeEventParams.infoMessage;
            break;
          //----------------------画面比例-------------------
          case "onAllAspectRatioChanged":
            event.aspectRatioList = nativeEventParams.aspectRatioList;
            break;
          case "onAspectRatioChanged":
            event.aspectRatio = nativeEventParams.aspectRatio;
            break;

          //--------------------倍速---------------------
          case "onAllPlayRateChanged":
            event.playRateList = nativeEventParams.playRateList;
            break;
          case "onPlayRateChanged":
            event.playRate = nativeEventParams.playRate;
            break;
          //--------------------声音---------------------
          case "onPlayerVolumeChanged":
            event.leftVolume = nativeEventParams.leftVolume;
            event.rightVolume = nativeEventParams.rightVolume;
            break;
          //------------------播放进度回调-----------------------
          case "onPlayerPositionChanged":
            event.position = nativeEventParams.position;
            break;
          case "onBufferingPercent":
            event.bufferingPercent = nativeEventParams;
            break;
          default:
        }
        return event;
      },
    },
  };
  registerElement("IJKPlayerComponent", videoViewComponent);

  //
  const VideoViewImpl = defineComponent({
    emits: [
      "player-status-changed",
      "player-decode-list-changed",
      "player-decode-changed",
      "player-rate-list-changed",
      "player-rate-changed",
      "player-aspect-ratio-list-changed",
      "player-aspect-ratio-changed",
      "player-error",
      "player-info",
      "player-volume-changed",
      "player-position-changed",
      "player-component-info",
      "player-left-volume-changed",
      "player-right-volume-changed",
    ],
    setup(props, context) {
      const videoPlayerViewComponentRef = ref();

      let progressCallback: ESPlayerProgressCallback;
      let durationCallback: ESPlayerDurationCallback;
      let bufferPercentCallback: ESPlayerBufferPercentCallback;

      const setProgressCallback = (callback: ESPlayerProgressCallback): void => {
        progressCallback = callback;
      };

      const setDurationCallback = (callback: ESPlayerDurationCallback): void => {
        durationCallback = callback;
      };

      const setBufferPercentCallback = (callback: ESPlayerBufferPercentCallback): void => {
        bufferPercentCallback = callback;
      };

      const getComponentInfo = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "getEsInfo", [], (res) => {
          context.emit("player-component-info", res);
        });
      };
      const setUsingHardwareDecoder = (value: boolean): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setUsingHardwareDecoder",
          [value],
          (res) => {},
        );
      };
      const setPlayerType = (type: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setPlayerType",
          [type],
          (res) => {},
        );
      };
      const initComponent = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "init", [], (res) => {});
      };
      const play = (...params): void => {
        let url: string = params[0];
        let aspectRatio: number = params[1];
        let leftVolume: string = params[2];
        let rightVolume: string = params[3];
        let playerOptionArray: Array<ESPlayerOption> = params[4];
        let playerType: number = params[5];
        let playerMediaCodec: boolean = params[6];
        let loop: boolean = params[7];
        let render: number = params[8];
        let metadata: ESMediaMetadata = params[9];

        console.log(
          "-------play-------->>>>\n" +
            "url:" +
            url +
            "\n" +
            "aspectRatio:" +
            aspectRatio +
            "\n" +
            "leftVolume:" +
            leftVolume +
            "\n" +
            "rightVolume:" +
            rightVolume +
            "\n" +
            "playerOptionArray:" +
            JSON.stringify(playerOptionArray) +
            "\n" +
            "playerType:" +
            playerType +
            "\n" +
            "playerMediaCodec:" +
            playerMediaCodec +
            "\n" +
            "loop:" +
            loop +
            "\n" +
            "render:" +
            render +
            "\n" +
            "metadata:" +
            JSON.stringify(metadata) +
            "\n",
        );

        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "play",
          [
            url,
            aspectRatio,
            leftVolume,
            rightVolume,
            playerOptionArray,
            playerType,
            playerMediaCodec,
            {
              loop: loop,
              render: render,
            },
            metadata,
            // {
            //   videoType: metadata?.videoType,
            //   size: metadata?.size,
            //   coverToConcat: metadata?.coverToConcat,
            // }
          ],
          (res) => {},
        );
      };
      const start = (progress: number): void => {
        console.log("-------ESVideoPlayerViewComponent--------start-------->>>>");
        Native.callUIFunction(videoPlayerViewComponentRef.value, "start", [progress], (res) => {});
      };
      const seekTo = (progress: number): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "seekTo", [progress], (res) => {});
      };
      const resume = (): void => {
        console.log("-------ESVideoPlayerViewComponent--------resume-------->>>>");
        Native.callUIFunction(videoPlayerViewComponentRef.value, "resume", [], (res) => {});
      };
      const pause = (): void => {
        console.log("-------ESVideoPlayerViewComponent--------pause-------->>>>");
        Native.callUIFunction(videoPlayerViewComponentRef.value, "pause", [], (res) => {});
      };
      const stop = (): void => {
        console.log("-------ESVideoPlayerViewComponent--------stop-------->>>>");
        Native.callUIFunction(videoPlayerViewComponentRef.value, "stop", [], (res) => {});
      };
      const clickPlayerView = (): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "clickPlayerView",
          [],
          (res) => {},
        );
      };
      const changeToFullScreen = (fullScreen: boolean): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "changeToFullScreen",
          [fullScreen],
          (res) => {},
        );
      };
      const requestPlayerViewLayout = (): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "requestPlayerViewLayout",
          [],
          (res) => {},
        );
      };
      const requestViewLayout = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "requestLayout", [], (res) => {});
      };
      const invalidate = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "requestLayout", [], (res) => {});
      };
      const updateLayout = (width: number, height: number, x: number, y: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "updateLayout",
          [width, height, x, y],
          (res) => {},
        );
      };
      const requestCustomSizeLayout = (
        width: number,
        height: number,
        x: number,
        y: number,
      ): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "requestCustomSizeLayout",
          [width, height, x, y],
          (res) => {},
        );
      };
      const requestCustomLayout = (): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "requestCustomLayout",
          [],
          (res) => {},
        );
      };
      const setSize = (width: number, height: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setPlayerSize",
          [width, height],
          (res) => {},
        );
      };
      const setPlayerDimension = (
        defaultWidth: number,
        defaultHeight: number,
        fullPlayerWidth: number,
        fullPlayerHeight: number,
        fullScreen: boolean,
        quickUpdate: boolean,
      ): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setPlayerDimension",
          [defaultWidth, defaultHeight, fullPlayerWidth, fullPlayerHeight, fullScreen, quickUpdate],
          (res) => {},
        );
      };
      const setDefaultPlayerWidth = (defaultPlayerWidth: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setDefaultPlayerWidth",
          [defaultPlayerWidth],
          (res) => {},
        );
      };
      const setDefaultPlayerHeight = (defaultPlayerHeight: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setDefaultPlayerHeight",
          [defaultPlayerHeight],
          (res) => {},
        );
      };

      const setFullPlayerWidth = (fullPlayerWidth: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setFullPlayerWidth",
          [fullPlayerWidth],
          (res) => {},
        );
      };

      const setFullPlayerHeight = (fullPlayerHeight: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setFullPlayerHeight",
          [fullPlayerHeight],
          (res) => {},
        );
      };
      const setPlayRate = (playRate: string): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setPlayRate",
          [playRate],
          (res) => {},
        );
      };
      const setDefinition = (definition: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setDefinition",
          [definition],
          (res) => {},
        );
      };
      const setCache = (cacheInfo: ESPlayerCache): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setCacheInfo",
          [cacheInfo],
          (res) => {},
        );
      };
      const setDecode = (decode: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setDecode",
          [decode],
          (res) => {},
        );
      };
      const setAspectRatio = (aspectRatio: number): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setAspectRatio",
          [aspectRatio],
          (res) => {},
        );
      };
      const release = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "release", [], (res) => {});
      };
      const isStopped = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "isStopped", [], (res) => {});
      };
      const getCurrentPosition = (): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "getCurrentPosition",
          [],
          (res) => {
            if (progressCallback) {
              progressCallback(res);
            }
          },
        );
      };
      const getDuration = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "getDuration", [], (res) => {
          if (durationCallback) {
            durationCallback(res);
          }
        });
      };
      const getLeftVolume = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "getLeftVolume", [], (res) => {
          context.emit("player-left-volume-changed", res);
        });
      };
      const getRightVolume = (): void => {
        Native.callUIFunction(videoPlayerViewComponentRef.value, "getRightVolume", [], (res) => {
          context.emit("player-right-volume-changed", res);
        });
      };
      const setLeftVolume = (leftVolume: string): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setLeftVolume",
          [leftVolume],
          (res) => {},
        );
      };
      const setRightVolume = (rightVolume: string): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setRightVolume",
          [rightVolume],
          (res) => {},
        );
      };
      const setVolume = (volume: string): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setVolume",
          [volume],
          (res) => {},
        );
      };
      const setLeftRightVolume = (leftVolume: string, rightVolume: string): void => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setLeftRightVolume",
          [leftVolume, rightVolume],
          (res) => {},
        );
      };
      //--------------------------------------------------------
      const getBitRate = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(videoPlayerViewComponentRef.value, "getBitRate", [], (res) => {
            resolve(res);
          });
        });
      };
      const getTcpSpeed = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(videoPlayerViewComponentRef.value, "getTcpSpeed", [], (res) => {
            resolve(res);
          });
        });
      };
      const getBitRate2 = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(videoPlayerViewComponentRef.value, "getBitRate2", [], (res) => {
            resolve(res);
          });
        });
      };
      const getTcpSpeed2 = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(videoPlayerViewComponentRef.value, "getTcpSpeed2", [], (res) => {
            resolve(res);
          });
        });
      };
      const getMediaMeta = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(videoPlayerViewComponentRef.value, "getMediaMeta", [], (res) => {
            resolve(res);
          });
        });
      };
      const getCdnInfo = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(videoPlayerViewComponentRef.value, "getCdnInfo", [], (res) => {
            resolve(res);
          });
        });
      };
      const getVideoDecoder = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(videoPlayerViewComponentRef.value, "getVideoDecoder", [], (res) => {
            resolve(res);
          });
        });
      };
      const getDropFrameRate = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getDropFrameRate",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getVideoDecodeFramesPerSecond = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getVideoDecodeFramesPerSecond",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getVideoOutputFramesPerSecond = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getVideoOutputFramesPerSecond",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getAudioCachedDuration = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getAudioCachedDuration",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getVideoCachedDuration = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getVideoCachedDuration",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getAudioCachedBytes = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getAudioCachedBytes",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getVideoCachedBytes = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getVideoCachedBytes",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getVideoCachedPackets = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getVideoCachedPackets",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getAudioCachedPackets = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getAudioCachedPackets",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const setOptionLong = (category: number, name: string, value: number) => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setOptionLong",
          [category, name, value],
          (res) => {},
        );
      };
      const setOptionString = (category: number, name: string, value: string) => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setOptionLong",
          [category, name, value],
          (res) => {},
        );
      };
      const getTrackInfo = (sysType: number = 1) => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getTrackInfo",
            [sysType],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const getSelectTrack = (trackType: number) => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getSelectTrack",
            [trackType],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const selectTrack = (index: number) => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "selectTrack",
          [index],
          (res) => {},
        );
      };
      const deselectTrack = (index: number) => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "deselectTrack",
          [index],
          (res) => {},
        );
      };
      const getM3U8DefinitionInfo = () => {
        return new Promise((resolve) => {
          Native.callUIFunction(
            videoPlayerViewComponentRef.value,
            "getM3U8DefinitionInfo",
            [],
            (res) => {
              resolve(res);
            },
          );
        });
      };
      const setM3U8Definition = (index: number) => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setM3U8Definition",
          [index],
          (res) => {},
        );
      };
      const setOptionCategory = (index: number) => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "setOptionCategory",
          [index],
          (res) => {},
        );
      };
      const startPositionListener = () => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "startPositionListener",
          [],
          (res) => {},
        );
      };
      const stopPositionListener = () => {
        Native.callUIFunction(
          videoPlayerViewComponentRef.value,
          "stopPositionListener",
          [],
          (res) => {},
        );
      };
      context.expose({
        initComponent,
        getComponentInfo,
        setUsingHardwareDecoder,
        setPlayerType,
        play,
        start,
        seekTo,
        resume,
        pause,
        stop,
        release,
        clickPlayerView,
        changeToFullScreen,
        requestPlayerViewLayout,
        requestViewLayout,
        updateLayout,
        requestCustomSizeLayout,
        requestCustomLayout,
        setSize,
        setPlayerDimension,
        setDefaultPlayerWidth,
        setDefaultPlayerHeight,
        setFullPlayerWidth,
        setFullPlayerHeight,
        setPlayRate,
        setDefinition,
        setCache,
        setDecode,
        setAspectRatio,
        isStopped,
        getCurrentPosition,
        getDuration,
        getLeftVolume,
        getRightVolume,
        setLeftVolume,
        setRightVolume,
        setVolume,
        setLeftRightVolume,
        getBitRate,
        getTcpSpeed,
        getBitRate2,
        getTcpSpeed2,
        getMediaMeta,
        getCdnInfo,
        getVideoDecoder,
        getDropFrameRate,
        getVideoDecodeFramesPerSecond,
        getVideoOutputFramesPerSecond,
        getAudioCachedDuration,
        getVideoCachedDuration,
        getAudioCachedBytes,
        getVideoCachedBytes,
        getVideoCachedPackets,
        getAudioCachedPackets,
        setOptionLong,
        setOptionString,
        getTrackInfo,
        getSelectTrack,
        selectTrack,
        deselectTrack,
        getM3U8DefinitionInfo,
        setM3U8Definition,
        setOptionCategory,
        startPositionListener,
        stopPositionListener,
        setProgressCallback,
        setDurationCallback,
        setBufferPercentCallback,
        invalidate,
      });
      return () => {
        return h("IJKPlayerComponent", {
          ref: videoPlayerViewComponentRef,
          onPlayerStatusChanged: (evt) => {
            context.emit("player-status-changed", evt);
          },
          onAllDecodeChanged: (evt) => {
            context.emit("player-decode-list-changed", evt.decodeList);
          },
          onDecodeChanged: (evt) => {
            context.emit("player-decode-changed", evt.decode);
          },
          onAllPlayRateChanged: (evt) => {
            context.emit("player-rate-list-changed", evt.playRateList);
          },
          onPlayRateChanged: (evt) => {
            context.emit("player-rate-changed", evt.playRate);
          },
          onAllAspectRatioChanged: (evt) => {
            context.emit("player-aspect-ratio-list-changed", evt.aspectRatioList);
          },
          onAspectRatioChanged: (evt) => {
            context.emit("player-aspect-ratio-changed", evt.aspectRatio);
          },
          onPlayerError: (evt) => {
            context.emit("player-error", evt);
          },
          onPlayerInfo: (evt) => {
            context.emit("player-info", evt);
          },
          onPlayerVolumeChanged: (evt) => {
            context.emit("player-volume-changed", evt.leftVolume, evt.rightVolume);
          },
          onPlayerPositionChanged: (evt) => {
            if (progressCallback) {
              progressCallback(evt);
            }
          },
          onBufferingPercent: (evt) => {
            if (bufferPercentCallback) {
              bufferPercentCallback(evt.bufferingPercent);
            }
          },
        });
      };
    },
  });
  app.component("es-video-player-view-component", VideoViewImpl);
}

export default registerESVideoPlayerViewComponent;
