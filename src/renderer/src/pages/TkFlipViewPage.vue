<template>
  <div class="tk-flipview-page">
    <TkButton theme="primary" deboss @click="flipviewRef?.prev()"> Prev </TkButton>
    <TkFlipView ref="flipviewRef" :items="images" direction="horizontal" :loop="true" class="flipview">
      <template #default="{ item, index }">
        <img class="flipview-image" :src="item" :alt="`demo-${index}`" draggable="false" />
      </template>
    </TkFlipView>
    <TkButton theme="primary" deboss @click="flipviewRef?.next()"> Next </TkButton>
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 16px;
  gap: 24px;
}
</style>
