import {defineComponent, h, ref} from 'vue';
import {ESApp, Native, registerElement} from "@extscreen/es3-vue";
import {ESPlayerDurationCallback, ESPlayerProgressCallback} from "@extscreen/es3-player";

function registerESADPlayerViewComponent(app: ESApp) {

  const ADPlayerComponent = {
    component: {
      name: 'ADPlayerComponent',
      processEventData(evtData, nativeEventParams: {
        playerStatus: number;
        playerWidth: number;
        playerHeight: number;
        errorCode: number;
        errorMessage: string;
        playerClickable: boolean;
        leftVolume: number,
        rightVolume: number
      }) {
        const {handler: event, __evt: nativeEventName} = evtData;
        switch (nativeEventName) {
          case 'onPlayerStatusChanged':
            event.playerState = nativeEventParams.playerStatus;
            event.errorCode = nativeEventParams.errorCode;
            event.errorMessage = nativeEventParams.errorMessage;
            event.playerClickable = nativeEventParams.playerClickable;
            break;
          case 'onPlayerError':
            event.errorCode = nativeEventParams.errorCode;
            event.errorMessage = nativeEventParams.errorMessage;
            break;
          case 'onPlayerVolumeChanged':
            event.leftVolume = nativeEventParams.leftVolume;
            event.rightVolume = nativeEventParams.rightVolume;
            break;
          default:
        }
        return event;
      },
    },
  }
  registerElement('ADPlayerComponent', ADPlayerComponent);

  const ADPlayerViewImpl = defineComponent({
    emits: [
      'player-status-changed',
      'player-error',
      'player-info',
      'player-volume-changed',
      'player-component-info',
      'canExitTime',
      'player-left-volume-changed',
      'player-right-volume-changed',
    ],
    setup(props, context) {
      const adPlayerViewRef = ref()

      let progressCallback: ESPlayerProgressCallback
      let durationCallback: ESPlayerDurationCallback

      const setProgressCallback = (callback: ESPlayerProgressCallback): void => {
        progressCallback = callback
      }

      const setDurationCallback = (callback: ESPlayerDurationCallback): void => {
        durationCallback = callback
      }

      const getComponentInfo = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'getEsInfo', [], (res) => {
          context.emit('player-component-info', res);
        });
      }
      const initComponent = (channelCode: string, testServer: boolean, debug: boolean) => {
        Native.callUIFunction(adPlayerViewRef.value, 'init', ['2ezER7', '快应用', channelCode, testServer, debug], (res) => {
        });
      }
      const setPointADProgress = (progress: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setPointADProgress', [progress], (res) => {
        });
      }
      const clickPlayerView = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'clickPlayerView', [], (res) => {
        });
      }
      const play = (...params: Array<any>) => {
        let url: string = params[0]
        let type: number = params[1]
        let mediaId: string = params[2]
        let adCount: number = params[3]
        let leftVolume: string = params[4]
        let rightVolume: string = params[5]
        let playerType: number = params[6]
        let playerMediaCodec: boolean = params[7]
        let playerOptionArray: Array<any> = params[8]
        let muteAD: boolean = params[9]
        let display: boolean = params[10]

        Native.callUIFunction(adPlayerViewRef.value, 'play', [url, type, mediaId, adCount, leftVolume, rightVolume, playerType, playerMediaCodec, playerOptionArray, muteAD, display], (res) => {
        });
      }
      const start = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'start', [], (res) => {
        });
      }
      const seekTo = (progress: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'seekTo', [progress], (res) => {
        });
      }
      const resume = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'resume', [], (res) => {
        });
      }
      const stop = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'stop', [], (res) => {
        });
      }
      const changeToFullScreen = (fullScreen: boolean) => {
        Native.callUIFunction(adPlayerViewRef.value, 'changeToFullScreen', [fullScreen], (res) => {
        });
      }
      const requestPlayerViewLayout = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'requestPlayerViewLayout', [], (res) => {
        });
      }
      const requestViewLayout = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'requestLayout', [], (res) => {
        });
      }
      const invalidate = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'requestLayout', [], (res) => {
        });
      }
      const updateLayout = (width: number, height: number, x: number, y: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'updateLayout', [width, height, x, y], (res) => {
        });
      }
      const requestCustomSizeLayout = (width: number, height: number, x: number, y: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'requestCustomSizeLayout', [width, height, x, y], (res) => {
        });
      }
      const requestCustomLayout = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'requestCustomLayout', [], (res) => {
        });
      }
      const setSize = (width: number, height: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setPlayerSize', [width, height], (res) => {
        });
      }
      const setPlayerDimension = (defaultWidth: number, defaultHeight: number, fullPlayerWidth: number, fullPlayerHeight: number, fullScreen: boolean) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setPlayerDimension', [defaultWidth, defaultHeight, fullPlayerWidth, fullPlayerHeight, fullScreen], (res) => {
        });
      }
      const setDefaultPlayerWidth = (defaultPlayerWidth: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setDefaultPlayerWidth', [defaultPlayerWidth], (res) => {
        });
      }
      const setDefaultPlayerHeight = (defaultPlayerHeight: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setDefaultPlayerHeight', [defaultPlayerHeight], (res) => {
        });
      }
      const setFullPlayerWidth = (fullPlayerWidth: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setFullPlayerWidth', [fullPlayerWidth], (res) => {
        });
      }
      const setFullPlayerHeight = (fullPlayerHeight: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setFullPlayerHeight', [fullPlayerHeight], (res) => {
        });
      }
      const setPlayRate = (playRate: string) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setPlayRate', [playRate], (res) => {
        });
      }
      const setDefinition = (definition: number) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setDefinition', [definition], (res) => {
        });
      }
      const release = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'release', [], (res) => {
        });
      }
      const isStopped = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'isStopped', [],
          (res) => {
          });
      }
      const getCurrentPosition = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'getCurrentPosition', [],
          (res) => {
            if (progressCallback) {
              progressCallback(res);
            }
          });
      }
      const getDuration = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'getDuration', [],
          (res) => {
            if (durationCallback) {
              durationCallback(res);
            }
          });
      }
      const getADCanExitTime = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'getADCanExitTime', [],
          (res) => {
            context.emit('canExitTime', res);
          });
      }
      const getLeftVolume = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'getLeftVolume', [], (res) => {
          context.emit('player-left-volume-changed', res);
        });
      }
      const getRightVolume = () => {
        Native.callUIFunction(adPlayerViewRef.value, 'getRightVolume', [], (res) => {
          context.emit('player-right-volume-changed', res);
        });
      }
      const setLeftVolume = (leftVolume: string) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setLeftVolume', [leftVolume], (res) => {
        });
      }
      const setRightVolume = (rightVolume: string) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setRightVolume', [rightVolume], (res) => {
        });
      }
      const setVolume = (volume: string) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setVolume', [volume], (res) => {
        });
      }
      const setLeftRightVolume = (leftVolume: string, rightVolume: string) => {
        Native.callUIFunction(adPlayerViewRef.value, 'setLeftRightVolume', [leftVolume, rightVolume], (res) => {
        });
      }
      context.expose({
        getComponentInfo,
        initComponent,
        setPointADProgress,
        clickPlayerView,
        play,
        start,
        seekTo,
        resume,
        stop,
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
        release,
        isStopped,
        getCurrentPosition,
        getDuration,
        getADCanExitTime,
        getLeftVolume,
        getRightVolume,
        setLeftVolume,
        setRightVolume,
        setVolume,
        setLeftRightVolume,
        setProgressCallback,
        setDurationCallback,
        invalidate
      })
      return () => {
        return h(
          'ADPlayerComponent',
          {
            ref: adPlayerViewRef,
            onPlayerStatusChanged: (evt) => {
              context.emit('player-status-changed', evt);
            },
            onPlayerError: (evt) => {
              context.emit('player-error', evt);
            },
            onPlayerVolumeChanged: (evt) => {
              context.emit('player-volume-changed', evt.leftVolume, evt.rightVolume);
            },
          },
        )
      }
    },
  })
  app.component('es-ad-player-view-component', ADPlayerViewImpl)
}

export default registerESADPlayerViewComponent;
