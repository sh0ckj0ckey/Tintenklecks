<template>
  <button
    type="button"
    class="tk-button"
    :class="[`tk-button--${props.theme}`, { deboss: props.deboss }]"
    :disabled="props.disabled"
    @click="onClick"
  >
    <span class="tk-button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  theme: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  deboss?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent): void => {
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
  initial-value: #1db054;
}
@property --tk-button--success-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #0b6b30;
}

@property --tk-button--danger-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #ff4b59;
}
@property --tk-button--danger-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #d10014;
}

@property --tk-button--warning-background-start {
  syntax: '<color>';
  inherits: false;
  initial-value: #ffdb70;
}

@property --tk-button--warning-background-end {
  syntax: '<color>';
  inherits: false;
  initial-value: #e09600;
}
</style>

<style scoped>
.tk-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  color: var(--tk-color-foreground);
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
    transform 0.1s,
    color 0.2s,
    box-shadow 0.2s;

  .tk-button-content {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: inherit;
    justify-content: inherit;
  }

  &:disabled {
    opacity: 0.6;
  }
}

.tk-button--primary {
  color: #f8f8f8;
  border: 1px solid #153483;
  background: linear-gradient(to bottom, var(--tk-button--primary-background-start), var(--tk-button--primary-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.3),
    inset 0px 0px 3px rgba(255, 255, 255, 0.5);

  &.deboss .tk-button-content {
    filter: drop-shadow(-0.01em -0.06em 0px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0.05em 0px rgba(255, 255, 255, 0.15));
  }

  &:hover:not(:disabled) {
    --tk-button--primary-background-start: color-mix(in srgb, #619bcb, white 10%);
    --tk-button--primary-background-end: color-mix(in srgb, #4984b4, white 10%);
    color: #f8f8f8;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.3),
      inset 0px 0px 3px rgba(255, 255, 255, 0.5);
  }

  &:active:not(:disabled) {
    --tk-button--primary-background-start: color-mix(in srgb, #619bcb, black 10%);
    --tk-button--primary-background-end: color-mix(in srgb, #4984b4, black 10%);
    color: #f8f8f88c;
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.3),
      inset 0px 0px 3px rgba(255, 255, 255, 0.5);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--primary-background-start);
    outline-offset: 2px;
  }
}

.tk-button--secondary {
  color: #f8f8f8;
  border: 1px solid #202020;
  background: linear-gradient(to bottom, var(--tk-button--secondary-background-start), var(--tk-button--secondary-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.1),
    inset 0px 0px 3px rgba(255, 255, 255, 0.05);

  &.deboss .tk-button-content {
    filter: drop-shadow(-0.01em -0.08em 0px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0.05em 0px rgba(255, 255, 255, 0.15));
  }

  &:hover:not(:disabled) {
    --tk-button--secondary-background-start: color-mix(in srgb, #3a3a3c, white 4%);
    --tk-button--secondary-background-end: color-mix(in srgb, #2c2c2e, white 4%);
    color: #f8f8f8;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1),
      inset 0px 0px 3px rgba(255, 255, 255, 0.05);
  }

  &:active:not(:disabled) {
    --tk-button--secondary-background-start: color-mix(in srgb, #3a3a3c, black 10%);
    --tk-button--secondary-background-end: color-mix(in srgb, #2c2c2e, black 10%);
    color: #f8f8f88c;
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1),
      inset 0px 0px 3px rgba(255, 255, 255, 0.05);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed currentColor;
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

  &.deboss .tk-button-content {
    filter: drop-shadow(0px -0.08em 0px rgba(0, 0, 0, 0.4)) drop-shadow(0px 0.05em 0px rgba(255, 255, 255, 0.2));
  }

  &:hover:not(:disabled) {
    --tk-button--success-background-start: color-mix(in srgb, #1db054, white 10%);
    --tk-button--success-background-end: color-mix(in srgb, #0b6b30, white 10%);
    color: #f0fdf4;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.25),
      inset 0px 0px 3px rgba(255, 255, 255, 0.4);
  }

  &:active:not(:disabled) {
    --tk-button--success-background-start: color-mix(in srgb, #1db054, black 10%);
    --tk-button--success-background-end: color-mix(in srgb, #0b6b30, black 10%);
    color: #f0fdf48c;
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.25),
      inset 0px 0px 3px rgba(255, 255, 255, 0.4);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--success-background-start);
    outline-offset: 2px;
  }
}

.tk-button--warning {
  color: #1f1f1f;
  border: 1px solid #594118;
  background: linear-gradient(to bottom, var(--tk-button--warning-background-start), var(--tk-button--warning-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.65),
    inset 0px 0px 3px rgba(255, 255, 255, 0.95);

  &.deboss .tk-button-content {
    filter: drop-shadow(0px -0.05em 0px rgba(0, 0, 0, 0.25)) drop-shadow(0px 0.08em 0px rgba(255, 255, 255, 0.6));
  }

  &:hover:not(:disabled) {
    --tk-button--warning-background-start: color-mix(in srgb, #ffdb70, white 20%);
    --tk-button--warning-background-end: color-mix(in srgb, #e09600, white 20%);
    color: #1f1f1f;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.65),
      inset 0px 0px 3px rgba(255, 255, 255, 0.95);
  }

  &:active:not(:disabled) {
    --tk-button--warning-background-start: color-mix(in srgb, #ffdb70, black 10%);
    --tk-button--warning-background-end: color-mix(in srgb, #e09600, black 10%);
    color: #1f1f1f8c;
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.65),
      inset 0px 0px 3px rgba(255, 255, 255, 0.95);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--warning-background-start);
    outline-offset: 2px;
  }
}

.tk-button--danger {
  color: #fff1f0;
  border: 1px solid #4a1a1a;
  background: linear-gradient(to bottom, var(--tk-button--danger-background-start), var(--tk-button--danger-background-end));
  box-shadow:
    inset 0px 1px 0px rgba(255, 255, 255, 0.25),
    inset 0px 0px 3px rgba(255, 255, 255, 0.75);

  &.deboss .tk-button-content {
    filter: drop-shadow(0px -0.05em 0px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0.05em 0px rgba(255, 255, 255, 0.15));
  }

  &:hover:not(:disabled) {
    --tk-button--danger-background-start: color-mix(in srgb, #ff4b59, white 16%);
    --tk-button--danger-background-end: color-mix(in srgb, #d10014, white 16%);
    color: #fff1f0;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.25),
      inset 0px 0px 3px rgba(255, 255, 255, 0.75);
  }

  &:active:not(:disabled) {
    --tk-button--danger-background-start: color-mix(in srgb, #ff4b59, black 10%);
    --tk-button--danger-background-end: color-mix(in srgb, #d10014, black 10%);
    color: #fff1f0b2;
    transform: translateY(1px);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0px 1px 0px rgba(255, 255, 255, 0.25),
      inset 0px 0px 3px rgba(255, 255, 255, 0.75);
  }

  &:focus-visible:not(:disabled) {
    outline: 2px dashed var(--tk-button--danger-background-start);
    outline-offset: 2px;
  }
}
</style>
