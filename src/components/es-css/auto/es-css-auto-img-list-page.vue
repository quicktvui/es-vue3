<template>
  <div class="es-sdk-root-css" :clipChildren="false">
    <s-title-view class="es-sdk-content-title-css" text="img list" />
    <div class="es-sdk-content-divider-css" />
    <qt-view>
      <qt-view class="es-sdk-content-row-css css-auto-img-root-css" :clipChildren="false">
        <div v-for="item in list">
          <img
            class="css-auto-img-css"
            src="https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750"
            :focusable="true"
            :enableFocusBorder="false"
            :focusScale="1.1"
          />
        </div>
      </qt-view>

      <qt-view class="es-sdk-content-row-css css-auto-img-root-css" :clipChildren="false">
        <img
          v-for="item in list"
          class="css-auto-img-css"
          src="https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750"
          :focusable="true"
          :enableFocusBorder="false"
          :focusScale="1.1"
        />
      </qt-view>
    </qt-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";

export default defineComponent({
  emits: [],
  setup() {
    const list = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);

    return {
      list,
    };
  },
});
</script>

<style scoped>
.css-auto-img-root-css {
  background-color: #40b883;
}

.css-auto-img-css {
  width: 100px;
  /*height: 100px;*/
  flex-direction: column;
  align-items: center;
  background-color: #40b883;
  margin: 5px;
}
</style>
