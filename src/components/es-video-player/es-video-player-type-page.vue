<template>
  <div class="es-sdk-root-css">
    <es-video-player
      ref="videoPlayer"
      :player-width="playerWidth"
      :player-height="playerHeight"
      @onPlayerPlayMediaSource="onPlayerPlayMediaSource"
      @onPlayerInitialized="onPlayerInitialized"
      class="es-video-player-page-css"/>
    <s-title-view class="es-sdk-content-title-css" :text="this.$options.name"/>
    <div class="es-sdk-content-divider-css"/>
    <div class="es-sdk-content-row-css">
      <span class="es-video-player-text-css" text="播放器类型："/>
      <span class="es-video-player-text-css" :text="playerTypeText + '' "/>
    </div>
    <div class="es-sdk-content-row-css">
      <s-text-button text="System" @onButtonClicked="setPlayerTypeSystem"/>
      <s-text-button text="Ijk" @onButtonClicked="setPlayerTypeIjk"/>
      <s-text-button text="Exo" @onButtonClicked="setPlayerTypeExo"/>
      <s-text-button text="Apollo" @onButtonClicked="setPlayerTypeApollo"/>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {useESLog} from "@extscreen/es3-core";
import {ref} from "vue";
import {
  ESIPlayer,
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerType,
  useESPlayerTypeManager,
} from "@extscreen/es3-player";
import {ESVideoPlayer} from "@extscreen/es3-video-player";
import {useESRouter} from "@extscreen/es3-router";

const TAG = 'ESVideoPlayerPage'

export default defineComponent({
  name: '播放器类型',
  components: {
    'es-video-player': ESVideoPlayer,
  },
  setup() {

    const log = useESLog()
    const router = useESRouter()
    const videoPlayer = ref<ESIPlayer>()
    const playerWidth = 1920
    const playerHeight = 1080

    const playingMediaIndex = ref(0)

    const playerTypeManager = useESPlayerTypeManager()
    const playerTypeText = ref<string>(playerTypeManager.getPlayerType().toString())

    function onPlayerPlayMediaSource(mediaSource: ESMediaSource) {
      playingMediaIndex.value = videoPlayer.value?.getPlayingMediaSourceIndex() ?? -1
    }

    //
    function setPlayerTypeSystem() {
      videoPlayer.value?.stop()
      playerTypeManager.setPlayerType(ESPlayerType.ES_PLAYER_TYPE_SYSTEM)
      videoPlayer.value?.playMediaSourceByIndex(playingMediaIndex.value)
      playerTypeText.value = playerTypeManager.getPlayerType().toString()
    }

    function setPlayerTypeIjk() {
      videoPlayer.value?.stop()
      playerTypeManager.setPlayerType(ESPlayerType.ES_PLAYER_TYPE_IJK)
      videoPlayer.value?.playMediaSourceByIndex(playingMediaIndex.value)
      playerTypeText.value = playerTypeManager.getPlayerType().toString()
    }

    function setPlayerTypeExo() {
      videoPlayer.value?.stop()
      playerTypeManager.setPlayerType(ESPlayerType.ES_PLAYER_TYPE_EXO)
      videoPlayer.value?.playMediaSourceByIndex(playingMediaIndex.value)
      playerTypeText.value = playerTypeManager.getPlayerType().toString()
    }

    function setPlayerTypeApollo() {
      videoPlayer.value?.stop()
      playerTypeManager.setPlayerType(ESPlayerType.ES_PLAYER_TYPE_APOLLO)
      videoPlayer.value?.playMediaSourceByIndex(playingMediaIndex.value)
      playerTypeText.value = playerTypeManager.getPlayerType().toString()
    }

    const onESCreate = () => {
      videoPlayer.value?.initialize()
    }
    const onPlayerInitialized = (playerType) => {
      let mediaSourceList: ESMediaSourceList = {
        index: 0,
        list: [
          {
            uri: 'http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4'
          }
        ]
      }
      log.e(TAG, "-------onPlayerInitialized---------->>>>>", playerType)
      videoPlayer.value?.playMediaSourceList(mediaSourceList)
      videoPlayer.value?.start(0)
    }

    function onBackPressed() {
      videoPlayer.value?.stop()
      videoPlayer.value?.release()
      router.back()
    }

    return {
      playerTypeText,
      playingMediaIndex,
      onESCreate,
      onPlayerInitialized,
      playerWidth,
      playerHeight,
      videoPlayer,
      onBackPressed,
      setPlayerTypeSystem,
      setPlayerTypeIjk,
      onPlayerPlayMediaSource,
      setPlayerTypeExo,
      setPlayerTypeApollo,
    }
  },
});

</script>

<style>
.es-video-player-page-css {
  position: absolute;
}

.es-video-player-text-css {
  color: white;
  font-size: 30px;
  margin-left: 20px;
  margin-right: 20px;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
}

</style>
