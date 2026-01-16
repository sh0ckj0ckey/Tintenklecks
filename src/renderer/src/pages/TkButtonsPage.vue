<template>
  <div class="tk-buttons-page">
    <div style="display: flex; gap: 8px">
      <TkButton theme="primary" :deboss="true">Primary</TkButton>
      <TkButton theme="secondary" :deboss="true">Secondary</TkButton>
      <TkButton theme="success" :deboss="true">Success</TkButton>
      <TkButton theme="warning" :deboss="true">Warning</TkButton>
      <TkButton theme="danger" :deboss="true">Danger</TkButton>
    </div>
    <div style="display: flex; gap: 8px">
      <TkHyperlinkButton :emboss="true"> Hyperlink Button </TkHyperlinkButton>
      <TkToggleButton v-model="isOn" theme="primary" :deboss="true"> Toggle Button </TkToggleButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TkButton from '../components/TkButtons/TkButton.vue'
import TkHyperlinkButton from '../components/TkButtons/TkHyperlinkButton.vue'
import TkToggleButton from '../components/TkButtons/TkToggleButton.vue'

const isOn = ref(false)
</script>

<style scoped>
.tk-buttons-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
