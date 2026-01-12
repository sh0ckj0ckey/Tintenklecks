<template>
  <button
    class="tk-hyperlink-button"
    :class="{ emboss: props.emboss }"
    :style="style"
    :disabled="props.disabled"
    type="button"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  borderRadius?: string | number
  height?: string | number
  width?: string | number
  emboss?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const style = computed(() => ({
  borderRadius: props.borderRadius ? (typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius) : undefined,
  height: props.height ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : undefined,
  width: props.width ? (typeof props.width === 'number' ? `${props.width}px` : props.width) : undefined
}))

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.tk-hyperlink-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  padding: 0;
  opacity: 1;
  cursor: pointer;
  user-select: none;
  transition:
    filter 0.2s,
    opacity 0.2s,
    background-color 0.2s;

  &.emboss {
    background-color: #88888810;
    box-shadow:
      inset 1px 1px 2px #ffffff,
      inset -1px -1px 2px #888888;
  }

  &:hover:not(:disabled) {
    background-color: #88888828;
    filter: brightness(1.1);
    opacity: 1;
  }

  &:active:not(:disabled) {
    background-color: #88888820;
    filter: brightness(1);
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid #88888880;
    outline-offset: 2px;
  }
}
</style>
