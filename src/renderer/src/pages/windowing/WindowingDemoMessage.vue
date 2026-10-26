<template>
  <div class="windowing-demo-message">
    <div class="window-content">
      <h2>{{ props.title }}</h2>
      <p>{{ props.message }}</p>
      <TkCheckBox v-model="isChecked" :disabled="!isSynced" @change="sendChecked">
        Shared checkbox: {{ isChecked ? 'checked' : 'unchecked' }}
      </TkCheckBox>
      <p class="event-note">Changes here are sent back to the opener through events.</p>
    </div>
    <AppTitleBar class="window-title-bar" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppTitleBar from '../../AppTitleBar.vue'
import TkCheckBox from '../../components/TkCheckBox/TkCheckBox.vue'
import { useWindowingHost } from '../../composables/useWindowingHost'

const props = defineProps<{
  title: string
  message: string
}>()

const { onEvent, emitEvent } = useWindowingHost()
const isChecked = ref(false)
const isSynced = ref(false)

onEvent<boolean>('demo:checked', (value) => {
  if (typeof value !== 'boolean') return
  isChecked.value = value
  isSynced.value = true
})

const sendChecked = (value: boolean): void => {
  emitEvent('demo:checked', value)
}

onMounted(() => {
  emitEvent('demo:ready', 'windowing-demo-message')
})
</script>

<style scoped>
.windowing-demo-message {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .window-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 12px;
    width: 100%;
    height: 100%;
    padding: calc(var(--tk-title-bar-height) + 24px) 24px 24px;
    overflow: auto;
    background-color: var(--tk-color-background-deep);
  }

  h2,
  p {
    margin: 0;
  }

  .event-note {
    font-size: 13px;
    opacity: 0.7;
  }

  .window-title-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--tk-title-bar-height);
    z-index: var(--tk-z-app-title-bar);
  }
}
</style>
