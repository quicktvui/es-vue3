<template>
  <div class="es-sdk-root-css">
    <es-player-manager
      ref="playerManager"
      :initPlayerWindowType="2"
      :playerList="playerListRef"
      @onPlayerInitialized="onPlayerInitialized"
      @onPlayerInterceptSuccess="onPlayerInterceptSuccess"
      @onPlayerInterceptError="onPlayerInterceptError"
      @onPlayerInfo="onPlayerInfo"
      @onPlayerPrepared="onPlayerPrepared"
      class="es-video-player-manager-page-css"
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

import { markRaw, ref } from "vue";
import {
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerInfo,
  ESPlayerInfoCode,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  HLS_ADAPTIVE_NUMBER,
  M3U8DefinitionInfo,
} from "@extscreen/es3-player";
import {
  ESIPlayerManager,
  ESMediaItem,
  ESMediaItemList,
  ESPlayerManager,
} from "@extscreen/es3-player-manager";
import { ESLogLevel, useESLog, useESToast } from "@extscreen/es3-core";
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import { TrackType } from "../../../packages/ESPlayer/src";

const TAG = "ESVideoPlayerManagerPage123";

export default defineComponent({
  name: "自适应码率",
  emits: [],
  components: {
    "es-player-manager": ESPlayerManager,
  },
  setup: function (props, context) {
    const log = useESLog();
    const playerManager = ref<ESIPlayerManager>();

    const playerList = [markRaw(ESVideoPlayer)];
    const playerListRef = ref(playerList);

    const toast = useESToast();

    let definitionList: Array<M3U8DefinitionInfo> = [];
    let dataList = ref([{ id: -2, name: "自动" }]);

    const commonInfo = ref("");
    const videoInfo = ref("");
    const audioInfo = ref("");

    let isPaused = false;

    const onESCreate = (params) => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onESCreate---------->>>>>");
      }
      isPaused = false;
      let mediaSource: ESMediaSource = {
        // uri: "http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
        // uri: 'http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8'
        uri: "https://1326572888.vod-qcloud.com/0d13453cvodtranscq1326572888/64a1228d1397757902212494295/adp.10.m3u8?t=681ace88&sign=1d0268b9617315d036f2b269513b0398",
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

      // playerManager.value?.setM3U8DefaultDefinition(HLS_ADAPTIVE_NUMBER);
      // playerManager.value?.setM3U8DefaultDefinition(0);
      // playerManager.value?.setM3U8DefaultDefinition(1);
      // playerManager.value?.setM3U8DefaultDefinition(2);
      // playerManager.value?.setM3U8DefaultDefinition(3);

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
      playerManager.value?.getM3U8DefinitionInfo().then((result: Array<M3U8DefinitionInfo>) => {
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

    function onPlayerInitialized(): void {
      playerManager.value?.setM3U8DefaultDefinition(HLS_ADAPTIVE_NUMBER);
      // playerManager.value?.setM3U8DefaultDefinition(2);
      // playerManager.value?.setM3U8DefaultDefinition(1);
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
      playerManager.value?.setM3U8Definition(id);
    };

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
      onPlayerInfo,
      onPlayerPrepared,
      dataList,
      onButtonFocused,
      commonInfo,
      videoInfo,
      audioInfo,
      onButtonClicked,
      onPlayerInitialized,
    };
  },
});
</script>

<style>
.es-video-player-manager-page-css {
  position: absolute;
}
</style>
