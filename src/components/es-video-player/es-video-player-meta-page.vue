<template>
  <div class="es-sdk-root-css">
    <es-video-player
      ref="videoPlayer"
      :player-width="playerWidth"
      :player-height="playerHeight"
      @onPlayerInitialized="onPlayerInitialized"
      @onPlayerInfo="onPlayerInfo"
      @onPlayerPrepared="onPlayerPrepared"
      class="es-video-player-page-css"
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useESLog, useESToast } from "@extscreen/es3-core";
import { ref } from "vue";
import {
  ESIPlayer,
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerInfo,
  ESPlayerInfoCode,
  HLS_ADAPTIVE_NUMBER,
  M3U8DefinitionInfo,
} from "@extscreen/es3-player";
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import { useESRouter } from "@extscreen/es3-router";
import { TrackType } from "../../../packages/ESPlayer/src";

const TAG = "ESVideoPlayerPage";

export default defineComponent({
  name: "视频信息",
  components: {
    "es-video-player": ESVideoPlayer,
  },
  setup(props, context) {
    const log = useESLog();
    const router = useESRouter();
    const videoPlayer = ref<ESIPlayer>();
    const playerWidth = 1920;
    const playerHeight = 1080;

    const toast = useESToast();

    let definitionList: Array<M3U8DefinitionInfo> = [];
    let dataList = ref([{ id: -2, name: "自动" }]);

    const commonInfo = ref("123");
    const videoInfo = ref("");
    const audioInfo = ref("");

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

    const onESCreate = (params) => {
      log.e(TAG, "-------onESCreate------start---->>>>>");
      videoPlayer.value?.initialize();
    };
    const onPlayerInitialized = (playerType) => {
      log.e(TAG, "-------onESCreate------onPlayerInitialized---->>>>>");
      let mediaSource: ESMediaSource = {
        uri: "https://cdn.pthuantv.gitv.tv/data_center/videos/SHORT/DEFAULT/2025/08/19/79853b48-ed71-4f46-bfb6-d48e521dc842.mp4",
        // uri: 'http://qcloudcdn.a311.ottcn.com/data_center/videos/SHORT/DEFAULT/2023/08/25/7d3623ae-c002-4929-b5a2-fe10bca06bfc.mp4'
        // uri: 'http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8'
        // uri: "https://1326572888.vod-qcloud.com/0d13453cvodtranscq1326572888/64a1228d1397757902212494295/adp.10.m3u8?t=681ace88&sign=1d0268b9617315d036f2b269513b0398",
      };
      let mediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [mediaSource],
      };

      log.e(TAG, "-------onPlayerInitialized---------->>>>>", playerType);
      videoPlayer.value?.playMediaSourceList(mediaSourceList);
      videoPlayer.value?.start(0);
    };

    function onPlayerInfo(info: ESPlayerInfo): void {
      switch (info.infoCode) {
        case ESPlayerInfoCode.MEDIA_INFO_AUDIO_DATA_SWITCH_COMPLETE:
          commonInfo.value = "音频数据切换完成";
          break;
        case ESPlayerInfoCode.MEDIA_INFO_VIDEO_DATA_SWITCH_COMPLETE:
          commonInfo.value = "视频数据切换完成";
          break;
        case ESPlayerInfoCode.MEDIA_INFO_AUDIO_RENDER_SWITCH_COMPLETE:
          commonInfo.value = "音频输出切换完成";
          break;
        case ESPlayerInfoCode.MEDIA_INFO_VIDEO_RENDER_SWITCH_COMPLETE:
          commonInfo.value = "视频画面切换完成";
          toast.showLongToast("视频画面切换完成:" + info.infoMessage);
          break;
        case ESPlayerInfoCode.MEDIA_INFO_MULTIPLE_HLS_FIRST_CHOOSE:
          commonInfo.value = "第一次播放选中id";
          toast.showLongToast("第一次播放选中id:" + info.infoMessage);
          break;
      }
    }

    function onPlayerPrepared(): void {
      videoPlayer.value?.getMediaMeta().then((meta) => {
        console.log("xiaodong", "获取meta信息", meta);
        containerFormat.value = meta.format;
        let vIndex = meta.video;
        let aIndex = meta.audio;
        videoCodec.value = meta.streams[vIndex].codec_name;
        audioCodec.value = meta.streams[aIndex].codec_name;
        videoWidth.value = meta.streams[vIndex].width;
        videoHeight.value = meta.streams[vIndex].height;
        frameRate.value = String(
          Number(meta.streams[vIndex].fps_num) / Number(meta.streams[vIndex].fps_den),
        );
      });

      videoPlayer.value?.getCdnInfo().then((res) => {
        console.log("xiaodong", "获取cdn信息", res);
        cdnIp.value = res.ip + ":" + res.port;
      });

      setInterval(() => {
        videoPlayer.value?.getTcpSpeed().then((res) => {
          tcpSpeed.value = res;
          console.log("xiaodong", "获取 getTcpSpeed 信息", res);
        });
        videoPlayer.value?.getBitRate().then((res) => {
          bitRate.value = res;
          console.log("xiaodong", "获取 getBitRate 信息", res);
        });
        videoPlayer.value?.getDropFrameRate().then((res) => {
          decodeFrameRate.value = res;
          console.log("xiaodong", "获取 getDropFrameRate 信息", res);
        });
        videoPlayer.value?.getVideoDecoder().then((res) => {
          videoDecoder.value = res;
          console.log("xiaodong", "获取 getVideoDecoder 信息", res);
        });
        videoPlayer.value?.getVideoDecodeFramesPerSecond().then((res) => {
          decodeFrameRate.value = res;
          console.log("xiaodong", "获取 getVideoDecodeFramesPerSecond 信息", res);
        });
        videoPlayer.value?.getVideoOutputFramesPerSecond().then((res) => {
          renderFrameRate.value = res;
          console.log("xiaodong", "获取 getVideoOutputFramesPerSecond 信息", res);
        });
        videoPlayer.value?.getVideoCachedDuration().then((res) => {
          videoBufferedTime.value = res;
          console.log("xiaodong", "获取 getVideoCachedDuration 信息", res);
        });
        videoPlayer.value?.getVideoCachedBytes().then((res) => {
          videoBufferedBytes.value = res;
          console.log("xiaodong", "获取 getVideoCachedBytes 信息", res);
        });
        videoPlayer.value?.getVideoCachedPackets().then((res) => {
          videoBufferedPacket.value = res;
          console.log("xiaodong", "获取 getVideoCachedPackets 信息", res);
        });
        videoPlayer.value?.getAudioCachedDuration().then((res) => {
          audioBufferedTime.value = res;
          console.log("xiaodong", "获取 getAudioCachedDuration 信息", res);
        });
        videoPlayer.value?.getAudioCachedBytes().then((res) => {
          audioBufferedBytes.value = res;
          console.log("xiaodong", "获取 getAudioCachedBytes 信息", res);
        });
        videoPlayer.value?.getAudioCachedPackets().then((res) => {
          audioBufferedPacket.value = res;
          console.log("xiaodong", "获取 getAudioCachedPackets 信息", res);
        });
      }, 1000);
    }

    function onBackPressed() {
      videoPlayer.value?.stop();
      videoPlayer.value?.release();
      router.back();
    }

    return {
      onESCreate,
      onPlayerInitialized,
      playerWidth,
      playerHeight,
      videoPlayer,
      onBackPressed,
      onPlayerInfo,
      onPlayerPrepared,
      dataList,
      commonInfo,
      videoInfo,
      audioInfo,
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
    };
  },
});
</script>

<style>
.es-video-player-page-css {
  position: absolute;
}
.es-video-player-test-text-css {
  font-size: 30px;
  color: black;
}
</style>
