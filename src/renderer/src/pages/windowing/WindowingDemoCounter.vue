<template>
  <div class="windowing-demo-counter">
    <div class="window-content">
      <h2>{{ props.title }}</h2>
      <output class="counter-value" aria-live="polite">{{ count }}</output>
      <div class="counter-controls">
        <TkButton theme="secondary" @click="count -= props.step">− {{ props.step }}</TkButton>
        <TkButton theme="secondary" @click="count = 0">Reset</TkButton>
        <TkButton theme="primary" @click="count += props.step">+ {{ props.step }}</TkButton>
      </div>
      <p>Step: {{ props.step }}. Change it from the opener without resetting the count.</p>
      <TkCheckBox v-model="isChecked" :disabled="!isSynced" @change="sendChecked">
        Shared checkbox: {{ isChecked ? 'checked' : 'unchecked' }}
      </TkCheckBox>
    </div>
    <AppTitleBar class="window-title-bar" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppTitleBar from '../../AppTitleBar.vue'
import TkButton from '../../components/TkButtons/TkButton.vue'
import TkCheckBox from '../../components/TkCheckBox/TkCheckBox.vue'
import { useWindowingHost } from '../../composables/useWindowingHost'

const props = defineProps<{
  title: string
  step: number
}>()

const { onEvent, emitEvent } = useWindowingHost()
const count = ref(0)
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
  emitEvent('demo:ready', 'windowing-demo-counter')
})
</script>

<style scoped>
.windowing-demo-counter {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .window-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    height: 100%;
    padding: calc(var(--tk-title-bar-height) + 24px) 24px 24px;
    overflow: auto;
    text-align: center;
    background-color: var(--tk-color-background-deep);
  }

  h2,
  p {
    margin: 0;
  }

  .counter-value {
    font-size: 72px;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .counter-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
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
