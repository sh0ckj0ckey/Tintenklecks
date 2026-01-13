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
  initial-value: #619bcb;
}

@property --tk-button--primary-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #4984b4;
}

@property --tk-button--secondary-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #3a3a3c;
}

@property --tk-button--secondary-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #2c2c2e;
}

@property --tk-button--success-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #6a9e69;
}
@property --tk-button--success-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #4b7a4a;
}

@property --tk-button--danger-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #cd6e6e;
}
@property --tk-button--danger-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #a34848;
}

@property --tk-button--warning-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #e0b060;
}

@property --tk-button--warning-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #b58942;
}
</style>

<style scoped>
.tk-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: default;
  transition:
    --tk-button--primary-background-start 0.15s,
    --tk-button--primary-background-end 0.15s,
    --tk-button--secondary-background-start 0.15s,
    --tk-button--secondary-background-end 0.15s,
    --tk-button--success-background-start 0.15s,
    --tk-button--success-background-end 0.15s,
    --tk-button--danger-background-start 0.15s,
    --tk-button--danger-background-end 0.15s,
    --tk-button--warning-background-start 0.15s,
    --tk-button--warning-background-end 0.15s,
    box-shadow 0.2s,
    color 0.2s,
    transform 0.1s;
}

.tk-button--primary {
  /* background-color: #002fa7; */
  color: #f8f8f8;
  border: 1px solid #002074;
  background: linear-gradient(to bottom, var(--tk-button--primary-background-start), var(--tk-button--primary-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.3),
    inset 0px 0px 3px rgba(255, 255, 255, 0.5);

  &.deboss {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.5);
  }

  &:hover:not(:disabled) {
    --tk-button--primary-background-start: color-mix(in srgb, #619bcb, white 10%);
    --tk-button--primary-background-end: color-mix(in srgb, #4984b4, white 10%);
    color: #f8f8f8;
  }

  &:active:not(:disabled) {
    --tk-button--primary-background-start: color-mix(in srgb, #619bcb, black 10%);
    --tk-button--primary-background-end: color-mix(in srgb, #4984b4, black 10%);
    color: #f8f8f88c;
    transform: translateY(1px);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--primary-background-start);
    outline-offset: 2px;
  }
}

.tk-button--secondary {
  color: #f8f8f8;
  border: 1px solid #1a1a1a;
  background: linear-gradient(to bottom, var(--tk-button--secondary-background-start), var(--tk-button--secondary-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.1),
    inset 0px 0px 3px rgba(255, 255, 255, 0.05);

  &.deboss {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.5);
  }

  &:hover:not(:disabled) {
    --tk-button--secondary-background-start: color-mix(in srgb, #3a3a3c, white 4%);
    --tk-button--secondary-background-end: color-mix(in srgb, #2c2c2e, white 4%);
    color: #f8f8f8;
  }

  &:active:not(:disabled) {
    --tk-button--secondary-background-start: color-mix(in srgb, #3a3a3c, black 10%);
    --tk-button--secondary-background-end: color-mix(in srgb, #2c2c2e, black 10%);
    color: #f8f8f88c;
    transform: translateY(1px);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--secondary-background-start);
    outline-offset: 2px;
  }
}

.tk-button--success {
  color: #f0fdf4;
  border: 1px solid #1e3a23;
  background: linear-gradient(to bottom, var(--tk-button--success-background-start), var(--tk-button--success-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.25),
    inset 0px 0px 3px rgba(255, 255, 255, 0.4);

  &.deboss {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.5);
  }

  &:hover:not(:disabled) {
    --tk-button--success-background-start: color-mix(in srgb, #6a9e69, white 10%);
    --tk-button--success-background-end: color-mix(in srgb, #4b7a4a, white 10%);
    color: #f0fdf4;
  }

  &:active:not(:disabled) {
    --tk-button--success-background-start: color-mix(in srgb, #6a9e69, black 10%);
    --tk-button--success-background-end: color-mix(in srgb, #4b7a4a, black 10%);
    color: #f0fdf48c;
    transform: translateY(1px);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--success-background-start);
    outline-offset: 2px;
  }
}

.tk-button--danger {
  color: #fff1f0;
  border: 1px solid #4a1a1a;
  background: linear-gradient(to bottom, var(--tk-button--danger-background-start), var(--tk-button--danger-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.25),
    inset 0px 0px 3px rgba(255, 255, 255, 0.4);

  &.deboss {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.5);
  }

  &:hover:not(:disabled) {
    --tk-button--danger-background-start: color-mix(in srgb, #cd6e6e, white 10%);
    --tk-button--danger-background-end: color-mix(in srgb, #a34848, white 10%);
    color: #fff1f0;
  }

  &:active:not(:disabled) {
    --tk-button--danger-background-start: color-mix(in srgb, #cd6e6e, black 10%);
    --tk-button--danger-background-end: color-mix(in srgb, #a34848, black 10%);
    color: #fff1f08c;
    transform: translateY(1px);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--danger-background-start);
    outline-offset: 2px;
  }
}

.tk-button--warning {
  color: #fffbe6;
  border: 1px solid #594118;
  background: linear-gradient(to bottom, var(--tk-button--warning-background-start), var(--tk-button--warning-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.3),
    inset 0px 0px 3px rgba(255, 255, 255, 0.4);

  &.deboss {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.5);
  }

  &:hover:not(:disabled) {
    --tk-button--warning-background-start: color-mix(in srgb, #e0b060, white 16%);
    --tk-button--warning-background-end: color-mix(in srgb, #b58942, white 16%);
    color: #fffbe6;
  }

  &:active:not(:disabled) {
    --tk-button--warning-background-start: color-mix(in srgb, #e0b060, black 10%);
    --tk-button--warning-background-end: color-mix(in srgb, #b58942, black 10%);
    color: #fffbe68c;
    transform: translateY(1px);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--warning-background-start);
    outline-offset: 2px;
  }
}
</style>
