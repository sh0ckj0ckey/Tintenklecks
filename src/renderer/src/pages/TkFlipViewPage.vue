<template>
  <div class="tk-flipview-page">
    <TkButton class="tk-flipview-button" theme="primary" deboss @click="flipviewRef?.prev()">
      <svg class="tk-flipview-button-icon" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-width="3" stroke="currentColor" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
      </svg>
    </TkButton>
    <TkFlipView ref="flipviewRef" :items="images" direction="horizontal" :loop="true" class="tk-flipview">
      <template #default="{ item, index }">
        <img :src="item" :alt="`demo-${index}`" draggable="false" />
      </template>
    </TkFlipView>
    <TkButton class="tk-flipview-button" theme="primary" deboss @click="flipviewRef?.next()">
      <svg class="tk-flipview-button-icon" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-width="3" stroke="currentColor" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
      </svg>
    </TkButton>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import TkButton from '@renderer/components/TkButtons/TkButton.vue'
import TkFlipView from '../components/TkFlipView/TkFlipView.vue'

const images = [
  new URL('../assets/images/demo/demo1.jpg', import.meta.url).href,
  new URL('../assets/images/demo/demo2.jpg', import.meta.url).href,
  new URL('../assets/images/demo/demo3.jpg', import.meta.url).href,
  new URL('../assets/images/demo/demo4.jpg', import.meta.url).href
]

const flipviewRef = useTemplateRef('flipviewRef')
</script>

<style scoped>
.tk-flipview-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 16px;

  .tk-flipview-button {
    flex: none;
    height: 48px;
    width: 48px;
    border-radius: 50%;
    padding: 0;

    .tk-flipview-button-icon {
      height: 28px;
      width: 28px;
    }
  }

  .tk-flipview {
    display: flex;
    height: 180px;
    width: 288px;
    border-radius: 48px;
    overflow: hidden;
    -electron-corner-smoothing: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
}
</style>
