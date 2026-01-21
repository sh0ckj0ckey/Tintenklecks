<template>
  <div class="tk-popup-page">
    <TkButton ref="primaryButtonRef" theme="primary" :deboss="true" @click="isPrimaryPopupOpen = true">Primary</TkButton>
    <TkPopup v-if="primaryButtonRef" v-model:is-open="isPrimaryPopupOpen" :target="primaryButtonRef" close-mode="click">
      <div
        style="
          padding: 16px;
          width: 172px;
          height: 256px;
          border-radius: 8px;
          background-color: #4984b4;
          box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
        "
      >
        <p>This is a primary popup.</p>
        <TkButton ref="secondaryButtonRef" theme="secondary" :deboss="true" @click="isSecondaryPopupOpen = true">Secondary</TkButton>
        <TkPopup v-if="secondaryButtonRef" v-model:is-open="isSecondaryPopupOpen" :target="secondaryButtonRef" close-mode="click">
          <div
            style="
              padding: 16px;
              width: 256px;
              height: 172px;
              border-radius: 8px;
              background-color: #3a3a3c;
              box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
            "
          >
            <p>This is a secondary popup.</p>
            <TkButton theme="danger" :deboss="true" @click="isSecondaryPopupOpen = false">Close</TkButton>
          </div>
        </TkPopup>
      </div>
    </TkPopup>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import TkButton from '../components/TkButtons/TkButton.vue'
import TkPopup from '../components/TkPopup/TkPopup.vue'

const primaryButtonRef = useTemplateRef<HTMLElement>('primaryButtonRef')
const secondaryButtonRef = useTemplateRef<HTMLElement>('secondaryButtonRef')

const isPrimaryPopupOpen = ref(false)
const isSecondaryPopupOpen = ref(false)
</script>

<style scoped>
.tk-popup-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
