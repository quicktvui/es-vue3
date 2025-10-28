<template>
  <div class="es-sdk-root-css">
    <es-sound-pool-player
      ref="player"
      :player-width="playerWidth"
      :player-height="playerHeight"
      @onPlayerInitialized="onPlayerInitialized"
      class="es-audio-player-page-css"
    />
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <s-text-button text="播放" @onButtonClicked="onPlayButtonClicked" />
      <s-text-button text="开始" @onButtonClicked="onStartButtonClicked" />
      <s-text-button text="暂停" @onButtonClicked="onPauseButtonClicked" />
      <s-text-button text="停止" @onButtonClicked="onStopButtonClicked" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useESLog } from "@extscreen/es3-core";
import { ref } from "vue";
import {
  ESIPlayer,
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerPlayMode,
} from "@extscreen/es3-player";
import { useESRouter } from "@extscreen/es3-router";
import { ESSoundPoolPlayer } from "@extscreen/es3-soundpool-player";

const TAG = "ESAudioPlayerPage";

export default defineComponent({
  name: "本地音效",
  emits: [],
  components: {
    "es-sound-pool-player": ESSoundPoolPlayer,
  },
  setup(props, context) {
    const log = useESLog();
    const router = useESRouter();
    const player = ref<ESIPlayer>();
    const playerWidth = 1920;
    const playerHeight = 1080;

    const onESCreate = (params) => {
      log.e(TAG, "-------onESCreate------start---->>>>>");
    };
    const onPlayerInitialized = (playerType) => {
      log.e(TAG, "-------onESCreate------onPlayerInitialized---->>>>>");
      let mediaSource: ESMediaSource = {
        uri: "assets/63a339ac6ed4bb7f02c7.mp3",
      };
      let mediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [mediaSource],
      };
      player.value?.setPlayMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT);
      player.value?.setVolume(1);
      log.e(TAG, "-------onPlayerInitialized---------->>>>>", playerType);
      player.value?.playMediaSourceList(mediaSourceList);
      player.value?.start(0);
    };

    const onPlayButtonClicked = () => {
      player.value?.initialize();
    };
    const onStartButtonClicked = () => {
      player.value?.start(0);
    };
    const onPauseButtonClicked = () => {
      player.value?.pause();
    };
    const onStopButtonClicked = () => {
      player.value?.stop();
    };

    function onBackPressed() {
      player.value?.stop();
      player.value?.release();
      router.back();
    }

    return {
      onESCreate,
      onPlayerInitialized,
      playerWidth,
      playerHeight,
      player,
      onBackPressed,
      onPlayButtonClicked,
      onStartButtonClicked,
      onPauseButtonClicked,
      onStopButtonClicked,
    };
  },
});
</script>

<style>
.es-audio-player-page-css {
  position: absolute;
}
</style>
