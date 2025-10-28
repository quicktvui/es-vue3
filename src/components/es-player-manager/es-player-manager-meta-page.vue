<template>
  <div class="es-sdk-root-css">
    <es-player-manager
      ref="playerManager"
      :initPlayerWindowType="2"
      :playerList="playerListRef"
      @onPlayerInitialized="onPlayerInitialized"
      @onPlayerInterceptSuccess="onPlayerInterceptSuccess"
      @onPlayerInterceptError="onPlayerInterceptError"
      @onPlayerPrepared="onPlayerPrepared"
      @onPlayerViewSizeChanged="onPlayerViewSizeChanged"
      @onPlayerProgressChanged="onPlayerProgressChanged"
      @onPlayerDurationChanged="onPlayerDurationChanged"
      class="es-video-player-manager-page-css"
    />
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />

    <div class="es-sdk-content-column-css" style="background-color: #40b883">
      <span class="es-video-player-test-text-css">{{ `CDN解析地址：${this.cdnIp}` }}</span>
      <span class="es-video-player-test-text-css">{{ `实时速度：${this.tcpSpeed}` }}</span>
      <span class="es-video-player-test-text-css">{{
        `视频已缓冲：${this.videoBufferedTime} / ${this.videoBufferedBytes} / ${this.videoBufferedPacket}`
      }}</span>
      <span class="es-video-player-test-text-css">{{
        `音频已缓冲：${this.audioBufferedTime} / ${this.audioBufferedBytes} / ${this.audioBufferedPacket}`
      }}</span>
      <span class="es-video-player-test-text-css">{{
        `分辨率：${this.videoWidth} * ${this.videoHeight}`
      }}</span>
      <span class="es-video-player-test-text-css">{{ `码率：${this.bitRate} bit/s` }}</span>
      <span class="es-video-player-test-text-css">{{ `帧率：${this.frameRate} FPS` }}</span>
      <span class="es-video-player-test-text-css">{{
        `解码帧率：${this.decodeFrameRate} FPS`
      }}</span>
      <span class="es-video-player-test-text-css">{{
        `渲染帧率：${this.renderFrameRate} FPS`
      }}</span>
      <span class="es-video-player-test-text-css">{{ `封装格式：${this.containerFormat}` }}</span>
      <span class="es-video-player-test-text-css">{{ `视频编码：${this.videoCodec}` }}</span>
      <span class="es-video-player-test-text-css">{{ `音频编码：${this.audioCodec}` }}</span>
      <span class="es-video-player-test-text-css">{{ `软硬解：${this.videoDecoder}` }}</span>
      <span class="es-video-player-test-text-css">{{ `缓存进度：${this.bufferPercent}%` }}</span>
      <span class="es-video-player-test-text-css">{{ `播放进度：${this.playProgress}` }}</span>
      <span class="es-video-player-test-text-css">{{ `总时长：${this.totalDuration}` }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import { markRaw, ref } from "vue";
import {
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerInfo,
  ESPlayerInfoCode,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerType,
  HLS_ADAPTIVE_NUMBER,
  M3U8DefinitionInfo,
  useESPlayerTypeManager,
} from "@extscreen/es3-player";
import {
  ESIPlayerManager,
  ESMediaItem,
  ESMediaItemList,
  ESPlayerManager,
} from "@extscreen/es3-player-manager";
import { ESLogLevel, useESLog, useESToast } from "@extscreen/es3-core";
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import { Native } from "@extscreen/es3-vue";

const TAG = "ESVideoPlayerManagerPage123";

export default defineComponent({
  name: "视频信息",
  emits: [],
  components: {
    "es-player-manager": ESPlayerManager,
  },
  setup: function (props, context) {
    const log = useESLog();
    const playerTypeManager = useESPlayerTypeManager();
    const playerManager = ref<ESIPlayerManager>();

    const playerList = [markRaw(ESVideoPlayer)];
    const playerListRef = ref(playerList);

    const toast = useESToast();

    let isPaused = false;

    const cdnIp = ref("127.0.9.8");
    const tcpSpeed = ref("0");
    const videoBufferedTime = ref(0);
    const videoBufferedBytes = ref(0);
    const videoBufferedPacket = ref(0);
    const audioBufferedTime = ref(0);
    const audioBufferedBytes = ref(0);
    const audioBufferedPacket = ref(0);
    const videoWidth = ref("0");
    const videoHeight = ref("0");
    const bitRate = ref("0");
    const frameRate = ref("0");
    const decodeFrameRate = ref("0");
    const renderFrameRate = ref("0");
    const containerFormat = ref("");
    const videoCodec = ref("");
    const audioCodec = ref("");
    const videoDecoder = ref("");
    const bufferPercent = ref(0);
    const playProgress = ref(0);
    const totalDuration = ref(0);

    const url =
      // "https://cdn.pthuantv.gitv.tv/data_center/videos/SHORT/DEFAULT/2025/08/19/79853b48-ed71-4f46-bfb6-d48e521dc842.mp4";
      // "https://cdn.wlcdn88.com:777/20220811/Igbwzbmd/index.m3u8";
      // "https://cdn.wlcdn88.com:777/20220506/0YlsDLlI/index.m3u8";
      "https://huan-data-center-1251413187.cos.ap-guangzhou.myqcloud.com/data_center/videos/LIB/CARD/2025/05/08/9bbf5efc-1147-4b17-a439-2eef7a7e06eb_transcode_1137855.mp4";
    // "http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4";
    // "http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear4/prog_index.m3u8"
    // "http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8"
    // "http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear4/fileSequence1.ts"
    // "https://hd.ijycnd.com/play/NbWX4pJd/index.m3u8"
    // "https://cdn.pthuantv.gitv.tv/data_center/videos/SHORT/DEFAULT/2025/08/19/79853b48-ed71-4f46-bfb6-d48e521dc842.mp4"

    let isNew = false;

    const onESCreate = (params) => {
      // playerTypeManager.setPlayerType(ESPlayerType.ES_PLAYER_TYPE_SYSTEM);

      Native.callNativeWithPromise("ESPlayerIJKModule", "getVersion").then((res) => {
        console.log("xiaodong", "获取Version信息", res);
        toast.showLongToast("获取Version信息" + res);
        isNew = true;
      });

      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onESCreate---------->>>>>");
      }
      isPaused = false;
      let mediaSource: ESMediaSource = {
        uri: url,
        // uri: "http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
        // uri: 'http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8'
        // uri: "https://1326572888.vod-qcloud.com/0d13453cvodtranscq1326572888/64a1228d1397757902212494295/adp.10.m3u8?t=681ace88&sign=1d0268b9617315d036f2b269513b0398",
      };
      let mediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [mediaSource],
      };
      let mediaItem: ESMediaItem = {
        mediaSourceList: mediaSourceList,
      };
      let playList: ESMediaItemList = {
        index: 0,
        list: [mediaItem],
      };

      playerManager.value?.initialize();
      playerManager.value?.playMediaList(playList);
    };

    function onPlayerInterceptSuccess(result: ESPlayerInterceptResult): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerInterceptSuccess------------->>>>", result);
      }
    }

    function onPlayerInterceptError(result: ESPlayerInterceptError): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerInterceptError------------->>>>", result);
      }
    }

    function onPlayerProgressChanged(progress: number): void {
      console.log("xiaodong", "onPlayerProgressChanged", progress);
      playProgress.value = progress;
    }

    function onPlayerDurationChanged(duration: number): void {
      console.log("xiaodong", "onPlayerDurationChanged", duration);
      totalDuration.value = duration;
    }

    function onPlayerViewSizeChanged(width: number, height: number): void {
      console.log("xiaodong", "onPlayerViewSizeChanged", width, height);

      videoWidth.value = width + "";
      videoHeight.value = height + "";
    }

    function onPlayerPrepared(): void {
      setTimeout(() => {
        playerManager.value?.seekTo(1000 * 60 * 2);
      }, 5000);

      if (!isNew) {
        playerManager.value?.getTrackInfo(2).then((res) => {
          console.log("xiaodong", "获取getTrackInfo信息", res);
          playerManager.value?.getSelectTrack(1).then((index) => {
            console.log("xiaodong", "获取getSelectTrack1信息", index);
            videoCodec.value = res[index].codec + "";
            videoWidth.value = res[index].videoWidth + "";
            videoHeight.value = res[index].videoHeight + "";
          });
          playerManager.value?.getSelectTrack(2).then((index) => {
            console.log("xiaodong", "获取getSelectTrack2信息", index);
            audioCodec.value = res[index].codec + "";
          });
        });

        playerManager.value?.getDuration();

        setInterval(() => {
          playerManager.value?.getCurrentPosition();

          playerManager.value?.getTcpSpeed().then((res) => {
            tcpSpeed.value = res;
            console.log("xiaodong", "获取 getTcpSpeed 信息", res);
          });
          playerManager.value?.getBitRate().then((res) => {
            bitRate.value = res;
            console.log("xiaodong", "获取 getBitRate 信息", res);
          });
        }, 1000);
      } else {
        playerManager.value?.setBufferPercentCallback((percent) => {
          console.log("xiaodong", "获取缓存进度", percent);
          bufferPercent.value = percent;
        });

        playerManager.value?.getMediaMeta().then((meta) => {
          console.log("xiaodong", "获取meta信息", meta);

          if (meta.format === "mov,mp4,m4a,3gp,3g2,mj2") {
            if (url.indexOf(".mov") !== -1) {
              containerFormat.value = "mov";
            } else if (url.indexOf(".mp4") !== -1) {
              containerFormat.value = "mp4";
            } else if (url.indexOf(".3gp") !== -1) {
              containerFormat.value = "3gp";
            } else if (url.indexOf(".mj2") !== -1) {
              containerFormat.value = "mj2";
            } else {
              containerFormat.value = meta.format;
            }
          } else containerFormat.value = meta.format;
          let vIndex = meta.video;
          let aIndex = meta.audio;
          videoCodec.value = meta.streams[vIndex].codec_name;
          audioCodec.value = meta.streams[aIndex].codec_name;
          videoWidth.value = meta.streams[vIndex].width;
          videoHeight.value = meta.streams[vIndex].height;
          if (meta.streams[vIndex].fps_num && meta.streams[vIndex].fps_den) {
            frameRate.value = String(
              Number(meta.streams[vIndex].fps_num) / Number(meta.streams[vIndex].fps_den),
            );
          } else if (meta.streams[vIndex].tbr_num && meta.streams[vIndex].tbr_den) {
            frameRate.value = String(
              Number(meta.streams[vIndex].tbr_num) / Number(meta.streams[vIndex].tbr_den),
            );
          }
        });

        playerManager.value?.getCdnInfo().then((res) => {
          console.log("xiaodong", "获取cdn信息", res);
          cdnIp.value = res.ip + ":" + res.port;
        });

        playerManager.value?.getDuration();

        setInterval(() => {
          playerManager.value?.getCurrentPosition();

          playerManager.value?.getTcpSpeed2().then((res) => {
            tcpSpeed.value = res;
            console.log("xiaodong", "获取 getTcpSpeed 信息", res);
          });
          playerManager.value?.getBitRate2().then((res) => {
            bitRate.value = res;
            console.log("xiaodong", "获取 getBitRate 信息", res);
          });
          playerManager.value?.getDropFrameRate().then((res) => {
            decodeFrameRate.value = res;
            console.log("xiaodong", "获取 getDropFrameRate 信息", res);
          });
          playerManager.value?.getVideoDecoder().then((res) => {
            videoDecoder.value = res;
            console.log("xiaodong", "获取 getVideoDecoder 信息", res);
          });
          playerManager.value?.getVideoDecodeFramesPerSecond().then((res) => {
            decodeFrameRate.value = res;
            console.log("xiaodong", "获取 getVideoDecodeFramesPerSecond 信息", res);
          });
          playerManager.value?.getVideoOutputFramesPerSecond().then((res) => {
            renderFrameRate.value = res;
            console.log("xiaodong", "获取 getVideoOutputFramesPerSecond 信息", res);
          });
          playerManager.value?.getVideoCachedDuration().then((res) => {
            videoBufferedTime.value = res;
            console.log("xiaodong", "获取 getVideoCachedDuration 信息", res);
          });
          playerManager.value?.getVideoCachedBytes().then((res) => {
            videoBufferedBytes.value = res;
            console.log("xiaodong", "获取 getVideoCachedBytes 信息", res);
          });
          playerManager.value?.getVideoCachedPackets().then((res) => {
            videoBufferedPacket.value = res;
            console.log("xiaodong", "获取 getVideoCachedPackets 信息", res);
          });
          playerManager.value?.getAudioCachedDuration().then((res) => {
            audioBufferedTime.value = res;
            console.log("xiaodong", "获取 getAudioCachedDuration 信息", res);
          });
          playerManager.value?.getAudioCachedBytes().then((res) => {
            audioBufferedBytes.value = res;
            console.log("xiaodong", "获取 getAudioCachedBytes 信息", res);
          });
          playerManager.value?.getAudioCachedPackets().then((res) => {
            audioBufferedPacket.value = res;
            console.log("xiaodong", "获取 getAudioCachedPackets 信息", res);
          });
        }, 1000);
      }
    }

    function onPlayerInitialized(): void {}

    const onESResume = () => {
      log.e(TAG, "-------onESResume---------->>>>>");
      if (isPaused) {
        playerManager.value?.resume();
      }
      isPaused = false;
    };
    const onESPause = () => {
      log.e(TAG, "-------onESPause---------->>>>>");
      isPaused = true;
      playerManager.value?.stop();
    };
    const onESDestroy = () => {
      log.e(TAG, "-------onESDestroy---------->>>>>");
      playerManager.value?.release();
    };

    return {
      onESCreate,
      onESResume,
      onESPause,
      onESDestroy,
      playerListRef,
      playerManager,
      onPlayerInterceptSuccess,
      onPlayerInterceptError,
      onPlayerPrepared,
      onPlayerViewSizeChanged,
      onPlayerProgressChanged,
      onPlayerDurationChanged,
      onPlayerInitialized,
      cdnIp,
      tcpSpeed,
      videoBufferedTime,
      videoBufferedBytes,
      videoBufferedPacket,
      audioBufferedTime,
      audioBufferedBytes,
      audioBufferedPacket,
      videoWidth,
      videoHeight,
      bitRate,
      frameRate,
      decodeFrameRate,
      renderFrameRate,
      containerFormat,
      videoCodec,
      audioCodec,
      videoDecoder,
      bufferPercent,
      playProgress,
      totalDuration,
    };
  },
});
</script>

<style>
.es-video-player-manager-page-css {
  position: absolute;
}

.es-video-player-test-text-css {
  font-size: 30px;
  color: black;
}
</style>
