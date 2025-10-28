<template>
  <div class="es-sdk-root-css">
    <es-player-manager
      ref="playerManager"
      :initPlayerWindowType="2"
      :playerList="playerListRef"
      class="es-video-player-manager-page-css"
    />
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="上一个" @onButtonClicked="onPreviousButtonClicked" />
      <s-text-button text="下一个" @onButtonClicked="onNextButtonClicked" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import { markRaw, ref } from "vue";
import { ESMediaSource, ESMediaSourceList } from "@extscreen/es3-player";
import {
  ESIPlayerManager,
  ESMediaItem,
  ESMediaItemList,
  ESPlayerManager,
} from "@extscreen/es3-player-manager";
import { ESLogLevel, useESLog } from "@extscreen/es3-core";

import { ESVideoPlayer } from "@extscreen/es3-video-player";

const TAG = "ESVideoPlayerManagerPage";

export default defineComponent({
  name: "多类型视频播放",
  components: {
    "es-player-manager": ESPlayerManager,
  },
  setup: function (props, context) {
    const log = useESLog();
    const playerManager = ref<ESIPlayerManager>();

    const playerList = [markRaw(ESVideoPlayer)];
    const playerListRef = ref(playerList);

    let isPaused = false;

    const onESCreate = (params) => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onESCreate---------->>>>>");
      }
      isPaused = false;
      //-------------------------M1905视频播放----------------------------------------
      let m1905MediaSource: ESMediaSource = {
        uri: {
          videoId: "F2024120011", //非vip视频: 'L00185', L00183// vip视频: F2024120011
          userId: "1893861819932884993", //非vip 5147799 //vip 1893861819932884993
        },
      };
      let m1905MediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [m1905MediaSource],
      };
      let m1905MediaItem: ESMediaItem = {
        mediaSourceList: m1905MediaSourceList,
        type: 3,
      };

      //------------------------VideoPlayer-----------------------------------------
      let videoMediaSource: ESMediaSource = {
        uri: "http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
      };
      let videoMediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [videoMediaSource],
      };
      let videoMediaItem: ESMediaItem = {
        mediaSourceList: videoMediaSourceList,
        type: 1,
      };
      //-----------------------------------------------------------------
      let playList: ESMediaItemList = {
        index: 0,
        list: [m1905MediaItem, videoMediaItem],
      };
      playerManager.value?.initialize();
      playerManager.value?.playMediaList(playList);
    };

    const onNextButtonClicked = () => {
      playerManager.value?.playNextMedia();
    };
    const onPreviousButtonClicked = () => {
      playerManager.value?.playPreviousMedia();
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
      onNextButtonClicked,
      onPreviousButtonClicked,
    };
  },
});
</script>

<style>
.es-video-player-manager-page-css {
  position: absolute;
}
</style>
