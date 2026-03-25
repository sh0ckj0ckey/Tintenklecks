<template>
  <div class="tk-toggle-switch-page">
    <div style="display: flex; gap: 8px">
      <TkToggleSwitch v-model="isPrimaryOn" theme="primary" size="small">Primary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSecondaryOn" theme="secondary" size="small">Secondary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSuccessOn" theme="success" size="small">Success</TkToggleSwitch>
      <TkToggleSwitch v-model="isWarningOn" theme="warning" size="small">Warning</TkToggleSwitch>
      <TkToggleSwitch v-model="isDangerOn" theme="danger" size="small">Danger</TkToggleSwitch>
    </div>
    <div style="display: flex; gap: 8px">
      <TkToggleSwitch v-model="isPrimaryOn" theme="primary" size="medium">Primary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSecondaryOn" theme="secondary" size="medium">Secondary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSuccessOn" theme="success" size="medium">Success</TkToggleSwitch>
      <TkToggleSwitch v-model="isWarningOn" theme="warning" size="medium">Warning</TkToggleSwitch>
      <TkToggleSwitch v-model="isDangerOn" theme="danger" size="medium">Danger</TkToggleSwitch>
    </div>
    <div style="display: flex; gap: 8px">
      <TkToggleSwitch v-model="isPrimaryOn" theme="primary" size="large">Primary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSecondaryOn" theme="secondary" size="large">Secondary</TkToggleSwitch>
      <TkToggleSwitch v-model="isSuccessOn" theme="success" size="large">Success</TkToggleSwitch>
      <TkToggleSwitch v-model="isWarningOn" theme="warning" size="large">Warning</TkToggleSwitch>
      <TkToggleSwitch v-model="isDangerOn" theme="danger" size="large">Danger</TkToggleSwitch>
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
