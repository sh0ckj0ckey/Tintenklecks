<template>
  <div class="tk-toast-page">
    <TkButton theme="primary" :deboss="true" @click="onClickShowToast('info')">Primary</TkButton>
    <TkButton theme="secondary" :deboss="true" @click="onClickShowToast('info')">Secondary</TkButton>
    <TkButton theme="success" :deboss="true" @click="onClickShowToast('success')">Success</TkButton>
    <TkButton theme="danger" :deboss="true" @click="onClickShowToast('error')">Danger</TkButton>
    <div ref="toastContainer" class="tk-toast-container">
      <span>This is a toast container.</span>
    </div>
    <TkButton ref="vueComponentToastContainer" theme="secondary" :deboss="true" style="position: relative"
      >This is a Vue Component toast container.</TkButton
    >
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import TkButton from '../components/TkButtons/TkButton.vue'
import { showToast } from '../components/TkToast'

const toastContainer = useTemplateRef('toastContainer')
const vueComponentToastContainer = useTemplateRef<HTMLElement>('vueComponentToastContainer')

const onClickShowToast = (icon: 'info' | 'success' | 'error'): void => {
  showToast({
    text: `Hello, this is a ${icon} tk-toast.`,
    icon: icon,
    duration: 5,
    placement: 'bottom',
    offset: 16,
    container: undefined
  })
}
</script>

<style scoped>
.tk-toast-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;

  .tk-toast-container {
    position: relative;
    flex: 3 3 auto;
    height: 96px;
    margin: 8px;
    border-radius: 8px;
    background-color: var(--tk-color-background-deep);
  }
}
</style>
