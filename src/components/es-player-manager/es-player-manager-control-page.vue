<template>
  <div class="es-sdk-root-css">
    <es-player-manager
      ref="playerManager"
      :initPlayerWindowType="2"
      :playerList="playerListRef"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerControlled="onPlayerControlled"
      class="es-video-player-manager-page-css"
    />
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />

    <div class="es-sdk-content-row-css">
      <s-text-button text="放大" @onButtonClicked="zoomInButtonClick" />
      <s-text-button text="缩小" @onButtonClicked="zoomOutButtonClick" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import { markRaw, ref } from "vue";
import {
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerControlOptions,
  ESPlayerLogLevel,
} from "@extscreen/es3-player";
import {
  ESIPlayerManager,
  ESMediaItem,
  ESMediaItemList,
  ESPlayerManager,
} from "@extscreen/es3-player-manager";
import { ESLogLevel, useESLog } from "@extscreen/es3-core";
import ESImagePlayer from "./player/ESImagePlayer.vue";

const TAG = "ESVideoPlayerManagerPage";

export default defineComponent({
  name: "自定义播放控制",
  emits: [],
  components: {
    "es-player-manager": ESPlayerManager,
  },
  setup: function (props, context) {
    const log = useESLog();
    const playerManager = ref<ESIPlayerManager>();

    const playerList = [markRaw(ESImagePlayer)];
    const playerListRef = ref(playerList);

    let isPaused = false;

    function zoomInButtonClick() {
      const options = {
        action: "zoomIn",
        payload: {
          width: 1920,
          height: 1080,
        },
      };
      playerManager.value?.control(options);
    }

    function zoomOutButtonClick() {
      const options = {
        action: "zoomOut",
        payload: {
          width: 500,
          height: 500,
        },
      };
      playerManager.value?.control(options);
    }

    function onPlayerPlaying(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerPlaying------------->>>>");
      }
    }

    function onPlayerControlled(options: ESPlayerControlOptions): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerControlled------------->>>>", options);
      }
    }

    const onESCreate = (params) => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onESCreate---------->>>>>");
      }
      isPaused = false;
      let mediaSource: ESMediaSource = {
        uri: "https://pica.zhimg.com/v2-e6efeef93312c17a16d63588592d8fa0_1440w.jpg",
      };
      let mediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [mediaSource],
      };
      let mediaItem: ESMediaItem = {
        mediaSourceList: mediaSourceList,
        playerType: 3, //TODO 自定义的图片播放器的类型
      };
      let playList: ESMediaItemList = {
        index: 0,
        list: [mediaItem],
      };
      playerManager.value?.initialize();
      playerManager.value?.playMediaList(playList);
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
      onPlayerPlaying,
      zoomInButtonClick,
      zoomOutButtonClick,
      onPlayerControlled,
    };
  },
});
</script>

<style>
.es-video-player-manager-page-css {
  position: absolute;
}
</style>
