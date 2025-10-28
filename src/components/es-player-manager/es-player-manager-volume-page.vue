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
      class="es-video-player-manager-page-css"
    />
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="音量：0" @onButtonClicked="mute" />
      <s-text-button text="音量：1" @onButtonClicked="unmute" />
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
import { ESMediaSource, ESPlayerPlayMode, useESPlayerVolumeManager } from "@extscreen/es3-player";

const TAG = "ESVideoPlayerManagerPage";

export default defineComponent({
  name: "音量控制",
  emits: [],
  components: {
    "es-player-manager": ESPlayerManager,
  },
  setup: function (props, context) {
    const log = useESLog();
    const playerManager = ref<ESIPlayerManager>();
    const playerList = [markRaw(ESVideoPlayer)];
    const playerListRef = ref(playerList);

    const volumeManager = useESPlayerVolumeManager();

    let isPaused = false;

    //
    function mute() {
      playerManager.value?.setVolume(0);
    }

    function unmute() {
      playerManager.value?.setVolume(1);
    }

    function resume() {
      playerManager.value?.resume();
    }

    function stop() {
      playerManager.value?.stop();
    }

    const onPlayerPlaying = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "----PlayerEvent---onPlayerPlaying---------->>>>>");
      }
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

      let mediaItem: ESMediaItem = {
        mediaSourceList: {
          index: 0,
          list: [
            {
              uri: "https://md-mpvolc.meipian.me/users/46717567/762076f2e04d2ade4b1c6afbb0e3719d.mp4",
            },
          ],
        },
      };

      let playList: ESMediaItemList = {
        index: 0,
        list: [mediaItem],
      };

      volumeManager.setLeftVolume(0);
      volumeManager.setRightVolume(0);

      playerManager.value?.initialize();
      playerManager.value?.setPlayMediaListMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP);
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
      onESCreate,
      onESResume,
      onESPause,
      onESDestroy,
      playerListRef,
      playerManager,
      onPlayerPlaying,
      mute,
      unmute,
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
</style>
