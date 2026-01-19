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
      <TkToggleButton v-model="isOn" theme="primary" :deboss="true">Primary</TkToggleButton>
      <TkToggleButton v-model="isOn" theme="secondary" :deboss="true">Secondary</TkToggleButton>
      <TkToggleButton v-model="isOn" theme="success" :deboss="true">Success</TkToggleButton>
      <TkToggleButton v-model="isOn" theme="warning" :deboss="true">Warning</TkToggleButton>
      <TkToggleButton v-model="isOn" theme="danger" :deboss="true">Danger</TkToggleButton>
    </div>
    <div style="display: flex; gap: 8px">
      <TkHyperlinkButton theme="primary" :emboss="true">Primary</TkHyperlinkButton>
      <TkHyperlinkButton theme="secondary" :emboss="true">Secondary</TkHyperlinkButton>
      <TkHyperlinkButton theme="success" :emboss="true">Success</TkHyperlinkButton>
      <TkHyperlinkButton theme="warning" :emboss="true">Warning</TkHyperlinkButton>
      <TkHyperlinkButton theme="danger" :emboss="true">Danger</TkHyperlinkButton>
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
