<template>
  <div class="es-sdk-root-css">
    <s-title-view class="es-sdk-content-title-css" text="使用初探" />
    <div class="es-sdk-content-divider-css" />
    <div class="es-sdk-content-row-css">
      <!--      <animation-->
      <!--        :actions="animation"-->
      <!--        :playing="playing"-->
      <!--        class="actor_guide">-->
      <!--        <s-text-button text="执行动画" @onButtonClicked="onButtonClicked"/>-->
      <!--      </animation>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ESLogLevel, useESLog } from "@extscreen/es3-core";
import { ref } from "vue";

export default defineComponent({
  name: "使用初探",
  emits: [],
  setup() {
    const log = useESLog();
    log.setMinimumLoggingLevel(ESLogLevel.DEBUG);

    const playing = ref<boolean>(false);
    const animation = ref({
      actionsConfig: {
        transform: {
          translateY: [
            {
              startValue: -10,
              toValue: 10,
              duration: 700,
              repeatCount: -1,
              timingFunction: "ease-in-out",
            },
            {
              startValue: 10,
              toValue: -10,
              duration: 700,
              repeatCount: -1,
              timingFunction: "ease-in-out",
            },
          ],
        },
      },
    });

    function onButtonClicked() {
      console.log("-------onButtonClicked------xxx------>>>");
      playing.value = !playing.value;
    }

    return {
      playing,
      animation,
      onButtonClicked,
    };
  },
});
</script>

<style></style>
