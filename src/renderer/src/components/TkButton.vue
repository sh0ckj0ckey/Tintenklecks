<template>
  <button
    type="button"
    class="tk-button"
    :class="`tk-button--${props.theme}`"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  theme: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  deboss?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.tk-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-style: solid;
  border-width: 2px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 400;
  cursor: default;
  user-select: none;
  transition:
    box-shadow 0.2s,
    opacity 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.tk-button--primary {
  background-color: #002fa7;
  border-color: #002fa7;
  color: #f8f8f8;

  &:hover:not(:disabled) {
    background-color: #0039cd;
    border-color: #0039cd;
    color: #f8f8f8;
  }

  &:active:not(:disabled) {
    background-color: #002074;
    border-color: #002074;
    color: #f8f8f88c;
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed #f8f8f8;
    outline-offset: 2px;
  }
}

.tk-button--secondary {
  background-color: #f0f0f0;
  color: #333;
  border-color: #d9d9d9;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: #e0e0e0;
    border-color: #bfbfbf;
    color: #333;
  }
  &:active:not(:disabled) {
    background-color: #d9d9d9;
    border-color: #bfbfbf;
    color: #333;
  }
}

.tk-button--success {
  background-color: #52c41a;
  color: #fff;
  border-color: #52c41a;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: #73d13d;
    border-color: #73d13d;
    color: #fff;
  }
  &:active:not(:disabled) {
    background-color: #389e0d;
    border-color: #389e0d;
    color: #fff;
  }
}

.tk-button--danger {
  background-color: #370d24;
  color: #fff;
  border-color: #370d24;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: #370d24;
    border-color: #370d24;
    color: #fff;
  }
  &:active:not(:disabled) {
    background-color: #370d24;
    border-color: #370d24;
    color: #fff;
  }
}

.tk-button--warning {
  background-color: #faad14;
  color: #fff;
  border-color: #faad14;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: #ffd666;
    border-color: #ffd666;
    color: #fff;
  }
  &:active:not(:disabled) {
    background-color: #d48806;
    border-color: #d48806;
    color: #fff;
  }
}
</style>
