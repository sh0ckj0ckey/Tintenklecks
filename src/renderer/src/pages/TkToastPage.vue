<template>
  <div class="tk-toast-page">
    <div style="display: flex; gap: 8px">
      <TkButton theme="primary" :deboss="true" @click="onClickShowToast('info')">Primary</TkButton>
      <TkButton theme="secondary" :deboss="true" @click="onClickShowToast('info')">Secondary</TkButton>
      <TkButton theme="success" :deboss="true" @click="onClickShowToast('success')">Success</TkButton>
      <TkButton theme="warning" :deboss="true" @click="onClickShowToast('warning')">Warning</TkButton>
      <TkButton theme="danger" :deboss="true" @click="onClickShowToast('error')">Danger</TkButton>
    </div>
    <div style="display: flex; gap: 8px">
      <TkButton theme="primary" :deboss="true" :disabled="true" @click="onClickShowToast('info')">Primary</TkButton>
      <TkButton theme="secondary" :deboss="true" :disabled="false" @click="onClickShowToastInElement('info')">Show in Element</TkButton>
      <div ref="toastContainer" class="tk-toast-container">
        <span>This is a toast container.</span>
      </div>
    </div>
    <div style="display: flex; gap: 8px">
      <TkHyperlinkButton :emboss="true" @click="onClickShowToastInComponent('info')"> Hyperlink Button </TkHyperlinkButton>
      <TkButton ref="vueComponentToastContainer" style="position: relative" theme="primary" :deboss="true">
        <img src="@renderer/assets/images/avatar.jpg" alt="Avatar" style="width: 128px; border-radius: 4px; object-fit: contain" />
      </TkButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import TkButton from '../components/TkButtons/TkButton.vue'
import TkHyperlinkButton from '../components/TkButtons/TkHyperlinkButton.vue'
import { showToast } from '../components/TkToast'

const toastContainer = useTemplateRef('toastContainer')
const vueComponentToastContainer = useTemplateRef<HTMLElement>('vueComponentToastContainer')

const onClickShowToast = (icon: 'info' | 'success' | 'warning' | 'error'): void => {
  showToast({
    text: `Hello, this is a ${icon} tk-toast.`,
    icon: icon,
    duration: 5,
    placement: 'top',
    offset: 32,
    container: undefined
  })
}

const onClickShowToastInElement = (icon: 'info' | 'success' | 'warning' | 'error'): void => {
  showToast({
    text: `Hello, this is a ${icon} tk-toast.`,
    icon: icon,
    duration: 5,
    placement: 'center',
    offset: 0,
    container: toastContainer.value
  })
}

const onClickShowToastInComponent = (icon: 'info' | 'success' | 'warning' | 'error'): void => {
  showToast({
    text: `Hello, this is a ${icon} tk-toast.`,
    icon: icon,
    duration: 5,
    placement: 'center',
    offset: 0,
    container: vueComponentToastContainer.value
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
  padding: 16px;
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
