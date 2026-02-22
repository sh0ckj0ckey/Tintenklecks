<template>
  <div class="tk-toggle-switch-page">
    <div style="display: flex; gap: 8px">
      <TkToggleSwitch v-model="isPrimaryOn" theme="primary" size="small" :deboss="true">Primary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSecondaryOn" theme="secondary" size="small" :deboss="true">Secondary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSuccessOn" theme="success" size="small" :deboss="true">Success</TkToggleSwitch>
      <TkToggleSwitch v-model="isWarningOn" theme="warning" size="small" :deboss="true">Warning</TkToggleSwitch>
      <TkToggleSwitch v-model="isDangerOn" theme="danger" size="small" :deboss="true">Danger</TkToggleSwitch>
    </div>
    <div style="display: flex; gap: 8px">
      <TkToggleSwitch v-model="isPrimaryOn" theme="primary" size="medium" :deboss="true">Primary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSecondaryOn" theme="secondary" size="medium" :deboss="true">Secondary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSuccessOn" theme="success" size="medium" :deboss="true">Success</TkToggleSwitch>
      <TkToggleSwitch v-model="isWarningOn" theme="warning" size="medium" :deboss="true">Warning</TkToggleSwitch>
      <TkToggleSwitch v-model="isDangerOn" theme="danger" size="medium" :deboss="true">Danger</TkToggleSwitch>
    </div>
    <div style="display: flex; gap: 8px">
      <TkToggleSwitch v-model="isPrimaryOn" theme="primary" size="large" :deboss="true">Primary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSecondaryOn" theme="secondary" size="large" :deboss="true">Secondary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSuccessOn" theme="success" size="large" :deboss="true">Success</TkToggleSwitch>
      <TkToggleSwitch v-model="isWarningOn" theme="warning" size="large" :deboss="true">Warning</TkToggleSwitch>
      <TkToggleSwitch v-model="isDangerOn" theme="danger" size="large" :deboss="true">Danger</TkToggleSwitch>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TkToggleSwitch from '../components/TkToggleSwitch/TkToggleSwitch.vue'

const isPrimaryOn = ref(true)
const isSecondaryOn = ref(true)
const isSuccessOn = ref(true)
const isWarningOn = ref(true)
const isDangerOn = ref(true)
</script>

<style scoped>
.tk-toggle-switch-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
