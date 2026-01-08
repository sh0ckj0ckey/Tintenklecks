<template>
  <button
    type="button"
    class="tk-button"
    :class="[`tk-button--${props.theme}`, { deboss: props.deboss }]"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
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

<style>
@property --tk-button--primary-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #4984b4;
}

@property --tk-button--primary-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #619bcb;
}
</style>

<style scoped>
.tk-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: default;
  user-select: none;
  transition:
    --tk-button--primary-background-start 0.15s,
    --tk-button--primary-background-end 0.15s,
    box-shadow 0.2s,
    color 0.2s;
}

.tk-button--primary {
  color: #f8f8f8;
  /* background-color: #002fa7; */
  border: 1px solid #002074;
  background: linear-gradient(to top, var(--tk-button--primary-background-start), var(--tk-button--primary-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.3),
    inset 0px 0px 3px rgba(255, 255, 255, 0.5);

  &.deboss {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.5);
  }

  &:hover:not(:disabled) {
    --tk-button--primary-background-start: color-mix(in srgb, #4984b4, white 10%);
    --tk-button--primary-background-end: color-mix(in srgb, #619bcb, white 10%);

    color: #f8f8f8;
  }

  &:active:not(:disabled) {
    --tk-button--primary-background-start: color-mix(in srgb, #4984b4, black 10%);
    --tk-button--primary-background-end: color-mix(in srgb, #619bcb, black 10%);

    color: #f8f8f88c;
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed #002074;
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
