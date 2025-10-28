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

    <div class="es-sdk-content-row-css" style="margin-top: 200px">
      <s-text-button
        v-for="(item, index) in dataList"
        :text="item.name"
        :key="index"
        @onButtonFocused="onButtonFocused(item.id)"
        @onButtonClicked="onButtonClicked(item.id)"
      />
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
  name: "自适应码率",
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

    const onESCreate = (params) => {
      log.e(TAG, "-------onESCreate------start---->>>>>");
      videoPlayer.value?.initialize();
    };
    const onPlayerInitialized = (playerType) => {
      log.e(TAG, "-------onESCreate------onPlayerInitialized---->>>>>");
      let mediaSource: ESMediaSource = {
        // uri: 'http://qcloudcdn.a311.ottcn.com/data_center/videos/SHORT/DEFAULT/2023/08/25/7d3623ae-c002-4929-b5a2-fe10bca06bfc.mp4'
        // uri: 'http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8'
        uri: "https://1326572888.vod-qcloud.com/0d13453cvodtranscq1326572888/64a1228d1397757902212494295/adp.10.m3u8?t=681ace88&sign=1d0268b9617315d036f2b269513b0398",
      };
      let mediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [mediaSource],
      };

      videoPlayer.value?.setM3U8DefaultDefinition(HLS_ADAPTIVE_NUMBER);
      // videoPlayer.value?.setM3U8DefaultDefinition(0);
      // videoPlayer.value?.setM3U8DefaultDefinition(1);
      // videoPlayer.value?.setM3U8DefaultDefinition(2);
      // videoPlayer.value?.setM3U8DefaultDefinition(3);

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
      videoPlayer.value?.getM3U8DefinitionInfo().then((result: Array<M3U8DefinitionInfo>) => {
        definitionList = result;
        for (let i = 0; i < definitionList.length; i++) {
          const info: M3U8DefinitionInfo = definitionList[i];
          let name = "";
          const streams = info.streams;
          for (let j = 0; j < streams.length; j++) {
            const stream = streams[j];
            if (stream.trackType === TrackType.VIDEO) {
              name = stream.videoWidth + "x" + stream.videoHeight;
              break;
            }
          }
          dataList.value.push({ id: info.id, name: name });
        }
      });
    }

    const onButtonFocused = (id: number) => {
      const info = definitionList.find((item) => item.id === id);
      toast.showLongToast(JSON.stringify(info));
      if (info) {
        commonInfo.value = "id:" + info.id + "【";
        for (let i = 0; i < info.streams.length; i++) {
          const stream = info.streams[i];
          commonInfo.value =
            commonInfo.value +
            "id:" +
            stream.id +
            "," +
            "index:" +
            stream.index +
            "," +
            "trackType:" +
            stream.trackType +
            "," +
            "codec:" +
            stream.codec +
            "," +
            "title:" +
            stream.title +
            "," +
            "language:" +
            stream.language +
            "】";
          if (stream.trackType === TrackType.VIDEO) {
            videoInfo.value = "video:" + stream.videoWidth + "x" + stream.videoHeight;
          } else if (stream.trackType === TrackType.AUDIO) {
            audioInfo.value = "audio:" + stream.channels + "、" + stream.channelName;
          }
        }
      }
    };

    const onButtonClicked = (id: number) => {
      videoPlayer.value?.setM3U8Definition(id);
    };

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
      onButtonFocused,
      commonInfo,
      videoInfo,
      audioInfo,
      onButtonClicked,
    };
  },
});
</script>

<style>
.es-video-player-page-css {
  position: absolute;
}
</style>
