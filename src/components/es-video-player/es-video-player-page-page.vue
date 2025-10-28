<template>
  <div class="es-sdk-root-css">
    <es-video-player
      ref="videoPlayer"
      :player-width="playerWidth"
      :player-height="playerHeight"
      @onPlayerInitialized="onPlayerInitialized"
      @onPlayerPlaying="onPlayerPlaying"
      class="es-video-player-page-css"/>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";
import {ESIPlayer, ESMediaSource, ESMediaSourceList} from "@extscreen/es3-player";
import {ESVideoPlayer} from "@extscreen/es3-video-player";

const TAG = 'ESVideoPlayer'

export default defineComponent({
  name: '页面播放控制',
  components: {
    'es-video-player': ESVideoPlayer,
  },
  setup() {

    const videoPlayer = ref<ESIPlayer>()
    const playerWidth = 1920
    const playerHeight = 1080

    const duration = ref(0)
    const progress = ref(0)
    let durationTimer = null
    let progressTimer = null

    let isPageStopped = false

    function onESCreate() {
      videoPlayer.value?.initialize()
    }

    const onPlayerInitialized = (playerType) => {
      let mediaSource: ESMediaSource = {
        uri: 'http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4'
      }
      let mediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [mediaSource]
      }
      videoPlayer.value?.playMediaSourceList(mediaSourceList)
      videoPlayer.value?.start(0)
    }

    function onESResume() {
      if (isPageStopped) {
        videoPlayer.value?.resume()
      }
      isPageStopped = false
    }

    function onESPause() {
    }

    function onESStop() {

      stopDurationTimer()
      stopProgressTimer()

      videoPlayer.value?.stop()

      isPageStopped = true
    }

    function onESDestroy() {
      videoPlayer.value?.reset()
      videoPlayer.value?.release()
    }

    const onPlayerPlaying = () => {
      startDurationTimer()
      startProgressTimer()
    }

    function startProgressTimer() {
      stopProgressTimer()
      progressTimer = setInterval(() => {
        videoPlayer.value?.getCurrentPosition()
      }, 500);
    }

    function stopProgressTimer() {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
    }

    function startDurationTimer() {
      stopDurationTimer()
      durationTimer = setInterval(() => {
        videoPlayer.value?.getDuration()
      }, 500);
    }

    function stopDurationTimer() {
      if (durationTimer) {
        clearInterval(durationTimer);
      }
    }

    return {
      duration,
      progress,
      playerWidth,
      playerHeight,
      videoPlayer,
      onPlayerInitialized,
      onPlayerPlaying,
      onESCreate,
      onESResume,
      onESPause,
      onESStop,
      onESDestroy,
    }
  },
});

</script>

<style>
.es-video-player-page-css {
  position: absolute;
}
</style>
