<template>
  <div class="tk-toggle-button-page">
    <div style="display: flex; gap: 8px">
      <TkToggleButton v-model="isPrimaryOn" theme="primary" :deboss="true">Primary</TkToggleButton>
      <TkToggleButton v-model="isSecondaryOn" theme="secondary" :deboss="true">Secondary</TkToggleButton>
      <TkToggleButton v-model="isSuccessOn" theme="success" :deboss="true">Success</TkToggleButton>
      <TkToggleButton v-model="isWarningOn" theme="warning" :deboss="true">Warning</TkToggleButton>
      <TkToggleButton v-model="isDangerOn" theme="danger" :deboss="true">Danger</TkToggleButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TkToggleButton from '../components/TkButtons/TkToggleButton.vue'

const isPrimaryOn = ref(true)
const isSecondaryOn = ref(true)
const isSuccessOn = ref(true)
const isWarningOn = ref(true)
const isDangerOn = ref(true)
</script>

<style scoped>
.tk-toggle-button-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
