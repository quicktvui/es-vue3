<template>
  <div class="es-sdk-root-css">
    <es-player-manager
      ref="playerManager"
      :initPlayerWindowType="2"
      :playerList="playerListRef"
      @onPlayerPlayMedia="onPlayerPlayMedia"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerSeekStart="onPlayerSeekStart"
      @onPlayerSeekCompleted="onPlayerSeekCompleted"
      class="es-video-player-manager-page-css"
    />
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <span class="es-player-manager-text-css" text="总时长：" />
      <span class="es-player-manager-text-css" :text="duration + ''" />
      <span class="es-player-manager-text-css" text="当前进度：" />
      <span class="es-player-manager-text-css" :text="progress + ''" />
      <span class="es-player-manager-text-css" text="          " />
      <span class="es-player-manager-text-css" text="播放索引：" />
      <span class="es-player-manager-text-css" :text="playingMediaIndex + ''" />
    </div>
    <div class="es-sdk-content-row-css">
      <s-text-button text="播放上一集" @onButtonClicked="playPreviousMedia" />
      <s-text-button text="播放下一集" @onButtonClicked="playNextMedia" />
    </div>
    <div class="es-sdk-content-row-css">
      <s-text-button text="快进" @onButtonClicked="seekForward" />
      <s-text-button text="快退" @onButtonClicked="seekBackward" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import { markRaw, ref } from "vue";
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
  name: "循环播放",
  emits: [],
  components: {
    "es-player-manager": ESPlayerManager,
  },
  setup: function (props, context) {
    const log = useESLog();
    const playerManager = ref<ESIPlayerManager>();

    const duration = ref(0);
    const progress = ref(0);

    const playingMediaIndex = ref(-1);

    const playerList = [markRaw(ESVideoPlayer)];
    const playerListRef = ref(playerList);

    let isPaused = false;

    let durationTimer = null;
    let progressTimer = null;

    function onPlayerPlayMedia(mediaItem: ESMediaItem) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlayMedia---------->>>>>", mediaItem);
      }
      playingMediaIndex.value = playerManager.value?.getPlayingMediaIndex() ?? -1;
    }

    function playPreviousMedia() {
      playerManager.value?.playPreviousMedia();
    }

    function playNextMedia() {
      playerManager.value?.playNextMedia();
    }

    function durationCallback(d: number) {
      duration.value = d;
    }

    function progressCallback(p: number) {
      progress.value = p;
      if (p > 10000) {
        playerManager.value?.stop();
        playerManager.value?.playMediaByIndex(0);
      }
    }

    function seekForward() {
      playerManager.value?.seekTo(progress.value + 10000);
    }

    function seekBackward() {
      if (progress.value - 10000 > 0) {
        playerManager.value?.seekTo(progress.value - 10000);
      }
    }

    const onPlayerPlaying = () => {
      startDurationTimer();
      startProgressTimer();
    };

    //--------------------------------------------------------------
    function startDurationTimer() {
      stopDurationTimer();
      durationTimer = setInterval(() => {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.e(TAG, "-------getDuration---------->>>>>");
        }
        playerManager.value?.getDuration();
      }, 500);
    }

    function stopDurationTimer() {
      if (durationTimer) {
        clearInterval(durationTimer);
      }
    }

    function startProgressTimer() {
      stopProgressTimer();
      progressTimer = setInterval(() => {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.e(TAG, "-------getCurrentPosition---------->>>>>");
        }
        playerManager.value?.getCurrentPosition();
      }, 500);
    }

    function stopProgressTimer() {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
    }

    function onPlayerSeekStart(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----PlayerEvent-----onPlayerSeekStart----->>>");
      }
    }

    function onPlayerSeekCompleted(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----PlayerEvent-----onPlayerSeekCompleted----->>>");
      }
    }

    const onESCreate = (params) => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onESCreate---------->>>>>");
      }
      isPaused = false;

      let mediaItem_0: ESMediaItem = {
        mediaSourceList: {
          index: 0,
          list: [
            {
              uri: "http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
            },
          ],
        },
      };

      let playList: ESMediaItemList = {
        index: 0,
        list: [mediaItem_0],
      };
      playerManager.value?.initialize();
      playerManager.value?.setDurationCallback(durationCallback);
      playerManager.value?.setProgressCallback(progressCallback);
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
    const onESStop = () => {
      log.e(TAG, "-------onESStop---------->>>>>");
      stopDurationTimer();
      stopProgressTimer();
    };
    const onESDestroy = () => {
      log.e(TAG, "-------onESDestroy---------->>>>>");
      playerManager.value?.release();
    };

    return {
      playingMediaIndex,
      duration,
      progress,
      playPreviousMedia,
      playNextMedia,
      seekBackward,
      seekForward,
      onPlayerPlaying,
      onESCreate,
      onESResume,
      onESPause,
      onESStop,
      onESDestroy,
      playerListRef,
      playerManager,
      onPlayerPlayMedia,
      onPlayerSeekStart,
      onPlayerSeekCompleted,
    };
  },
});
</script>

<style>
.es-video-player-manager-page-css {
  position: absolute;
}

.es-player-manager-text-css {
  color: white;
  font-size: 30px;
  margin-left: 20px;
  margin-right: 20px;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
