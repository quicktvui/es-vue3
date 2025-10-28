<template>
  <div class="es-sdk-root-css">
    <es-player-manager
      ref="playerManager"
      :initPlayerWindowType="2"
      :playerList="playerListRef"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerPaused="onPlayerPaused"
      @onPlayerResumed="onPlayerResumed"
      @onPlayerStopped="onPlayerStopped"
      @onPlayerPlayMedia="onPlayerPlayMedia"
      @onPlayerPlayMediaSource="onPlayerPlayMediaSource"
      class="es-video-player-manager-page-css"
    />
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-row-css">
      <span class="es-player-manager-text-css" text="总时长：" />
      <span class="es-player-manager-text-css" :text="duration + ''" />
      <span class="es-player-manager-text-css" text="当前进度：" />
      <span class="es-player-manager-text-css" :text="progress + ''" />
    </div>
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="播放上一集" @onButtonClicked="playPreviousMedia" />
      <s-text-button text="播放下一集" @onButtonClicked="playNextMedia" />
      <span class="es-player-manager-text-css" text="播放MediaItem索引：" />
      <span class="es-player-manager-text-css" :text="playingMediaItemIndex + ''" />
      <span class="es-player-manager-text-css" text="播放MediaItem：" />
      <span class="es-player-manager-text-css" :text="playingMediaItem + ''" />
    </div>
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="播放上一源" @onButtonClicked="playPreviousMediaSource" />
      <s-text-button text="播放下一源" @onButtonClicked="playNextMediaSource" />
      <span class="es-player-manager-text-css" text="播放MediaSource索引：" />
      <span class="es-player-manager-text-css" :text="playingMediaSourceIndex + ''" />
      <span class="es-player-manager-text-css" text="播放MediaSource：" />
      <span class="es-player-manager-text-css" :text="playingMediaSource + ''" />
    </div>
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="开始" @onButtonClicked="start" />
      <s-text-button text="暂停" @onButtonClicked="pause" />
      <span class="es-player-manager-text-css" text="             " />
      <s-text-button text="恢复" @onButtonClicked="resume" />
      <s-text-button text="停止" @onButtonClicked="stop" />
      <span class="es-player-manager-text-css" text="             " />
      <s-text-button text="快进" @onButtonClicked="seekTo" />
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
import { ESLogLevel, useESLog, useESToast } from "@extscreen/es3-core";
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import { ESMediaSource } from "@extscreen/es3-player";

const TAG = "ESVideoPlayerManagerPage";

export default defineComponent({
  name: "播放控制",
  emits: [],
  components: {
    "es-player-manager": ESPlayerManager,
  },
  setup: function (props, context) {
    const log = useESLog();
    const playerManager = ref<ESIPlayerManager>();
    const playerList = [markRaw(ESVideoPlayer)];
    const playerListRef = ref(playerList);

    const playingMediaItem = ref("");
    const playingMediaItemIndex = ref(-1);

    const playingMediaSource = ref("");
    const playingMediaSourceIndex = ref(-1);
    const toast = useESToast();

    let isPaused = false;

    const duration = ref(0);
    const progress = ref(0);
    let durationTimer = null;
    let progressTimer = null;

    function onPlayerPlayMedia(mediaItem: ESMediaItem) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlayMedia---------->>>>>", mediaItem);
      }
      playingMediaItem.value = JSON.stringify(mediaItem);
      playingMediaItemIndex.value = playerManager.value?.getPlayingMediaIndex() ?? -1;
    }

    function onPlayerPlayMediaSource(mediaSource: ESMediaSource) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlayMediaSource---------->>>>>", mediaSource);
      }
      playingMediaSource.value = JSON.stringify(mediaSource);
      playingMediaSourceIndex.value = playerManager.value?.getPlayingMediaSourceIndex() ?? -1;
    }

    function playPreviousMedia() {
      if (playerManager.value?.canPlayPreviousMedia()) {
        playerManager.value?.playPreviousMedia();
      } else {
        toast.showToast("已经是第一个了");
      }
    }

    function playNextMedia() {
      if (playerManager.value?.canPlayNextMedia()) {
        playerManager.value?.playNextMedia();
      } else {
        toast.showToast("已经是最后一个了");
      }
    }

    function playPreviousMediaSource() {
      playerManager.value?.playPreviousMediaSource();
    }

    function playNextMediaSource() {
      playerManager.value?.playNextMediaSource();
    }

    //
    function start() {
      playerManager.value?.start(0);
    }

    function seekTo() {
      playerManager.value?.seekTo(0);
    }

    function pause() {
      playerManager.value?.pause();
    }

    function resume() {
      playerManager.value?.resume();
    }

    function stop() {
      stopDurationTimer();
      stopProgressTimer();
      playerManager.value?.stop();
    }

    function durationCallback(d: number) {
      duration.value = d;
    }

    function progressCallback(p: number) {
      progress.value = p;
    }

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

    const onPlayerPlaying = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "----PlayerEvent---onPlayerPlaying---------->>>>>");
      }
      startDurationTimer();
      startProgressTimer();
    };

    const onPlayerPaused = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "----PlayerEvent---onPlayerPaused---------->>>>>");
      }
    };
    const onPlayerResumed = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "----PlayerEvent---onPlayerResumed---------->>>>>");
      }
    };
    const onPlayerStopped = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "----PlayerEvent---onPlayerStopped---------->>>>>");
      }
    };

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
              uri: "https://extcdn.hsrc.tv/data_center/videos/cp_data/import_data/cp_liufan/prod/202411/ba1292565b156b7_hls720_0527.m3u8?sign=4662e6fbc08e73c35d0b94d324dc7093&t=1749697125&md5hash=4662e6fbc08e73c35d0b94d324dc7093&timestamp=1749697125",
            },
            {
              uri: "http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
          ],
        },
      };
      let mediaItem_1: ESMediaItem = {
        mediaSourceList: {
          index: 0,
          list: [
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
          ],
        },
      };

      let mediaItem_2: ESMediaItem = {
        mediaSourceList: {
          index: 0,
          list: [
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
          ],
        },
      };

      let mediaItem_3: ESMediaItem = {
        mediaSourceList: {
          index: 0,
          list: [
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
            {
              uri: "https://extcdn.hsrc.tv/data_center/videos/LIB/MOVIE/2024/10/28/16b02f4a-c011-4e4a-9348-76c4524e950e.mp4",
            },
          ],
        },
      };

      let playList: ESMediaItemList = {
        index: 0,
        list: [mediaItem_0, mediaItem_1, mediaItem_2, mediaItem_3],
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
      stop();
    };
    const onESDestroy = () => {
      log.e(TAG, "-------onESDestroy---------->>>>>");
      playerManager.value?.release();
    };

    return {
      duration,
      progress,
      playingMediaItemIndex,
      playingMediaItem,
      playingMediaSourceIndex,
      playingMediaSource,
      playPreviousMedia,
      playNextMedia,
      playPreviousMediaSource,
      playNextMediaSource,
      onESCreate,
      onESResume,
      onESPause,
      onESDestroy,
      playerListRef,
      playerManager,
      onPlayerPlayMedia,
      onPlayerPlayMediaSource,
      onPlayerPlaying,
      start,
      seekTo,
      pause,
      resume,
      stop,
      onPlayerPaused,
      onPlayerResumed,
      onPlayerStopped,
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
